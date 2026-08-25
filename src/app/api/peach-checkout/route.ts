// src/app/api/peach-checkout/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency, merchantTransactionId, itemName } = body;

    // ✅ FIX: Default to 'sandbox' if PEACH_ENV is missing!
    const env = process.env.PEACH_ENV || 'sandbox'; 
    
    // Correct Peach Payments URLs (Test vs Live)
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
        merchantTransactionId: merchantTransactionId || `SDM-${Date.now()}`,
        entityid: process.env.PEACH_ENTITY_ID, // Peach API expects lowercase 'entityid'
        paymentType: 'DB', // Debit/Instant Payment for Capitec Pay
        'customParameters[CAPITEC_PAY_BRANDING]': 'true',
        testMode: env === 'live' ? '0' : '1',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Peach API Error:', data);
      return NextResponse.json({ error: data }, { status: response.status });
    }

    // The frontend widget needs the 'id' from Peach to render
    return NextResponse.json({ checkoutId: data.id });

  } catch (error) {
    console.error('💥 Internal Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
