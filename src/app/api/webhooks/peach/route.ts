import { NextRequest, NextResponse } from 'next/server';
import { deliverProduct } from '@/lib/delivery'; // <-- FIXED IMPORT PATH HERE

export async function POST(req: NextRequest) {
  try {
    // 1. Get the raw data from Peach Payments
    const rawBody = await req.text();
    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      payload = Object.fromEntries(new URLSearchParams(rawBody));
    }

    // 2. Check for payment success
    const resultCode = payload.result?.code || payload.resultCode || '';
    const successCodes = ['000.000.000', '000.100.110', '000.400.000']; // Peach success indicators
    const isPaid = successCodes.includes(resultCode);

    if (!isPaid) {
      return NextResponse.json({ status: 'payment_not_complete' }, { status: 200 });
    }

    // 3. Extract order details (Format we use: PRODUCT_NAME__ORDER_REF)
    const mti = payload.merchantTransactionId || payload.customParameters?.merchantTransactionId || '';
    const [productName, orderRef] = mti.split('__');
    
    if (!productName || !orderRef) {
      console.error('Invalid merchantTransactionId format:', mti);
      return NextResponse.json({ error: 'Invalid order format' }, { status: 400 });
    }

    // 4. Trigger the automated delivery
    const deliverySuccess = await deliverProduct({
      productName: productName.trim(),
      orderRef,
      amount: Number(payload.amount) / 100, // Peach sends amount in cents
      customerEmail: payload.customParameters?.email || '',
      customerPhone: payload.customParameters?.phone || ''
    });

    if (deliverySuccess) {
      return NextResponse.json({ success: true, message: 'Product delivered' });
    } else {
      console.error('Delivery failed for order:', orderRef);
      return NextResponse.json({ error: 'Delivery failed' }, { status: 500 });
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
