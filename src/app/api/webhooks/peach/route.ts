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

    // 1. Verify the signature
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

    // 2. Parse the payment data
    const resultCode = params.get('result.code');
    const merchantTransactionId = params.get('merchantTransactionId') || '';
    const amount = params.get('amount') || '0';
    const currency = params.get('currency') || 'ZAR';

    console.log(`📥 Webhook received: ${resultCode} for Order ${merchantTransactionId}`);

    // 3. Check if payment was successful ('ACK' means approved)
    if (resultCode === 'ACK') {
      console.log('✅ Payment Successful! Recording sale...');
      
      // 4. Record the sale automatically to your dashboard
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
      console.log('💰 Sale recorded successfully to dashboard!');
    }

    // Always return 200 OK to Peach
    return NextResponse.json({ status: 'success' });

  } catch (error: any) {
    console.error('💥 Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
