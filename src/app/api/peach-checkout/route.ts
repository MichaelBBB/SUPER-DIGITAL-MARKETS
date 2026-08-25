// src/app/api/peach-checkout/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency, itemName } = body;

    // Default to sandbox if PEACH_ENV is missing
    const env = process.env.PEACH_ENV || 'sandbox';
    
    const baseUrl = env === 'live' 
      ? 'https://peachpayments.com/v1/checkouts' 
      : 'https://test.peachpayments.com/v1/checkouts';

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PEACH_SECRET_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount.toString(),
        currency: currency || 'ZAR',
        entityid: process.env.PEACH_ENTITY_ID,
        paymentType: 'DB',
        'customParameters[CAPITEC_PAY_BRANDING]': 'true',
        testMode: env === 'live' ? '0' : '1',
        merchantTransactionId: `SDM-${Date.now()}`,
        shopperResultUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.id) {
      console.error('❌ Peach API Error:', data);
      return NextResponse.json({ error: data.description || 'Payment initialization failed' }, { status: response.status });
    }

    return NextResponse.json({ checkoutId: data.id });

  } catch (error) {
    console.error('💥 Checkout Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
