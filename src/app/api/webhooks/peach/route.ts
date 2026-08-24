// src/app/api/webhooks/peach/route.ts
import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-signature') || request.headers.get('X-Signature') || '';
    const SECRET_KEY = process.env.PEACH_SECRET_KEY?.trim() || '';

    // Verify the signature
    const params = new URLSearchParams(body);
    const sortedKeys = Array.from(params.keys()).sort();
    
    let sigString = '';
    for (const key of sortedKeys) {
      const value = params.get(key) || '';
      sigString += key + value;
    }

    const expectedSignature = createHmac('sha256', SECRET_KEY)
      .update(sigString, 'utf8')
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('❌ Webhook signature invalid');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Parse the payment data
    const resultCode = params.get('result.code');
    const merchantTransactionId = params.get('merchantTransactionId') || '';
    const amount = params.get('amount') || '0';
    const currency = params.get('currency') || 'ZAR';
    const customerPhone = params.get('customer.mobile') || params.get('billing.phone') || '';

    console.log(`📥 Webhook received: ${resultCode} for Order ${merchantTransactionId}`);

    // Check if payment was successful
    if (resultCode === 'ACK') {
      console.log('✅ Payment Successful! Recording sale...');
      
      // Record the sale automatically
      const salesFilePath = path.join(process.cwd(), 'data', 'sales.json');
      const dataDir = path.dirname(salesFilePath);
      
      await fs.mkdir(dataDir, { recursive: true });

      let sales = [];
      try {
        const existingData = await fs.readFile(salesFilePath, 'utf8');
        sales = JSON.parse(existingData);
      } catch (e) {
        sales = [];
      }

      sales.push({
        id: sales.length + 1,
        orderId: merchantTransactionId,
        amount: parseFloat(amount),
        currency: currency,
        status: 'completed',
        timestamp: new Date().toISOString(),
      });

      await fs.writeFile(salesFilePath, JSON.stringify(sales, null, 2));
      console.log('💰 Sale recorded successfully!');

      // Send automated WhatsApp message
      if (customerPhone) {
        await sendWhatsAppMessage(customerPhone, merchantTransactionId, amount);
      } else {
        console.log('⚠️ No customer phone number found in webhook payload.');
      }
    }

    return NextResponse.json({ status: 'success' });

  } catch (error: any) {
    console.error(' Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Helper function to send WhatsApp via Twilio
async function sendWhatsAppMessage(phone: string, orderId: string, amount: string) {
  const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
  const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const TWILIO_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;

  if (!ACCOUNT_SID || !AUTH_TOKEN || !TWILIO_NUMBER) {
    console.error('❌ Twilio credentials missing');
    return;
  }

  try {
    const auth = Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString('base64');
    
    const messageBody = `*PAYMENT CONFIRMED!* \n\nHi there! Your payment of ZAR ${amount} was successful.\n\n*Order ID:* ${orderId}\n\nThank you for shopping with SUPER DIGITAL MARKETS!`;

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: `whatsapp:${TWILIO_NUMBER}`,
        To: `whatsapp:${phone}`,
        Body: messageBody,
      }),
    });

    if (response.ok) {
      console.log('📱 WhatsApp message sent successfully!');
    } else {
      const errorData = await response.text();
      console.error('❌ Twilio API Error:', errorData);
    }
  } catch (error) {
    console.error('💥 Error sending WhatsApp:', error);
  }
}
