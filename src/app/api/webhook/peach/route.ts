import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-signature') || '';
    const SECRET_KEY = process.env.PEACH_SECRET_KEY?.trim() || '';

    console.log('📥 Webhook received from Peach Payments');

    // 1. VERIFY WEBHOOK SIGNATURE
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
      console.error('❌ INVALID SIGNATURE - Webhook rejected');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    console.log('✅ Webhook signature verified successfully');

    // 2. PARSE WEBHOOK DATA
    const paymentData = {
      id: params.get('id') || '',
      merchantTransactionId: params.get('merchantTransactionId') || '',
      resultCode: params.get('result.code') || '',
      resultDescription: params.get('result.description') || '',
      paymentType: params.get('paymentType') || '',
      amount: params.get('amount') || '0',
      currency: params.get('currency') || 'ZAR',
      timestamp: new Date().toISOString(),
    };

    console.log('💳 Payment Data:', paymentData);

    // 3. CHECK IF PAYMENT WAS SUCCESSFUL ('ACK' means successful)
    if (paymentData.resultCode === 'ACK') {
      console.log('✅ PAYMENT SUCCESSFUL! Recording sale...');
      await recordSale(paymentData);
      return NextResponse.json({ status: 'success' });
    } else {
      console.log('⚠️ Payment failed or pending:', paymentData.resultDescription);
      return NextResponse.json({ status: 'ignored', result: paymentData.resultCode });
    }

  } catch (error: any) {
    console.error('💥 Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Function to record sale in sales tracker
async function recordSale(paymentData: any) {
  try {
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
    await fs.writeFile(salesFilePath, JSON.stringify(sales, null, 2));
    console.log('💰 Sale recorded to tracker:', newSale.orderId);
  } catch (error) {
    console.error('Error recording sale:', error);
  }
}
