// src/app/api/peach-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency, itemName } = body;

    const ENTITY_ID = process.env.PEACH_ENTITY_ID;
    const AUTH_TOKEN = process.env.PEACH_SECRET_TOKEN; 
    
    if (!ENTITY_ID || !AUTH_TOKEN) {
      return NextResponse.json({ error: 'Payment configuration missing' }, { status: 500 });
    }

    const payload = {
      entityid: ENTITY_ID,
      amount: amount.toString(),
      currency: currency || 'ZAR',
      paymentType: 'DB',
      'customParameters[CAPITEC_PAY_BRANDING]': 'true', 
      testMode: process.env.NEXT_PUBLIC_PEACH_MODE === 'TEST' ? '1' : '0',
      merchantTransactionId: `SDM-${Date.now()}`,
      notificationUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/peach-webhook`,
      returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancelled`,
    };

    const response = await fetch('https://test.peachpayments.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(payload as any).toString(),
    });

    const data = await response.json();

    if (!response.ok || !data.id) {
      console.error('Peach API Error:', data);
      return NextResponse.json({ error: 'Failed to initialize payment' }, { status: 502 });
    }

    return NextResponse.json({ checkoutId: data.id });

  } catch (error) {
    console.error('Checkout API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
