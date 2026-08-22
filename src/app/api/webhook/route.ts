// src/app/api/webhook/route.ts
import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-signature') || '';
    const SECRET_KEY = process.env.PEACH_SECRET_KEY?.trim() || '';

    // 1. VERIFY WEBHOOK SIGNATURE (Security Check)
    const sortedParams = new URLSearchParams(body).toString().split('&').sort();
    let sigString = '';
    for (const param of sortedParams) {
      const [key, value] = param.split('=');
      sigString += key + (value || '');
    }
    
    const expectedSignature = createHmac('sha256', SECRET_KEY)
      .update(sigString, 'utf8')
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('❌ Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    console.log('✅ Webhook signature verified');

    // 2. PARSE WEBHOOK DATA
    const params = new URLSearchParams(body);
    const paymentData = {
      id: params.get('id') || '',
      merchantTransactionId: params.get('merchantTransactionId') || '',
      result: {
        code: params.get('result.code') || '',
        description: params.get('result.description') || '',
      },
      paymentType: params.get('paymentType') || '',
      amount: params.get('amount') || '0',
      currency: params.get('currency') || 'ZAR',
      timestamp: new Date().toISOString(),
    };

    console.log('📦 Payment Data:', paymentData);

    // 3. CHECK IF PAYMENT WAS SUCCESSFUL
    if (paymentData.result.code === 'ACK') {
      console.log('✅ PAYMENT SUCCESSFUL!');
      
      // 4. UPDATE SALES TRACKER
      await recordSale(paymentData);
      
      // 5. TRIGGER PRODUCT DELIVERY
      await triggerDelivery(paymentData);
      
      return NextResponse.json({ status: 'success' });
    } else {
      console.log('❌ Payment failed or pending:', paymentData.result.description);
      return NextResponse.json({ status: 'failed', result: paymentData.result });
    }

  } catch (error: any) {
    console.error('💥 Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Function to record sale in sales tracker
async function recordSale(paymentData: any) {
  try {
    const salesFilePath = path.join(process.cwd(), 'data', 'sales.json');
    
    // Create data directory if it doesn't exist
    const dataDir = path.dirname(salesFilePath);
    await fs.mkdir(dataDir, { recursive: true });

    // Read existing sales or create new array
    let sales = [];
    try {
      const existingData = await fs.readFile(salesFilePath, 'utf8');
      sales = JSON.parse(existingData);
    } catch (e) {
      sales = [];
    }

    // Add new sale
    const newSale = {
      id: sales.length + 1,
      orderId: paymentData.merchantTransactionId,
      peachPaymentId: paymentData.id,
      amount: parseFloat(paymentData.amount),
      currency: paymentData.currency,
      status: 'completed',
      paymentMethod: paymentData.paymentType,
      timestamp: paymentData.timestamp,
    };

    sales.push(newSale);

    // Save updated sales
    await fs.writeFile(salesFilePath, JSON.stringify(sales, null, 2));
    
    console.log('💰 Sale recorded:', newSale);
  } catch (error) {
    console.error('Error recording sale:', error);
  }
}

// Function to trigger product delivery
async function triggerDelivery(paymentData: any) {
  try {
    // Extract order details from transaction ID (ORD-XXXXX)
    const orderId = paymentData.merchantTransactionId;
    
    // Here you would:
    // 1. Look up the product from your database
    // 2. Send delivery email with download link
    // 3. Or send WhatsApp message with product
    
    console.log('📦 Triggering delivery for order:', orderId);
    
    // Example: Send delivery notification
    // await sendDeliveryEmail(orderId);
    // await sendWhatsAppDelivery(orderId);
    
  } catch (error) {
    console.error('Error triggering delivery:', error);
  }
}
