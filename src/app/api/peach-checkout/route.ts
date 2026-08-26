// src/app/api/peach-checkout/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { amount, currency } = body;

  try {
    const peachResponse = await fetch('https://test.peachpayments.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PEACH_SECRET_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount,
        currency: currency || 'ZAR',
        entityid: process.env.PEACH_ENTITY_ID,
        paymentType: 'DB',
        testMode: '1',
      }),
    });

    const data = await peachResponse.json();

    if (!peachResponse.ok) {
      return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }

    return NextResponse.json({ checkoutId: data.id });
    
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
