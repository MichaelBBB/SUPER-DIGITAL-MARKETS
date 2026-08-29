// src/app/api/peach-checkout/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amountZAR = parseFloat(body.amount);
    const amountInCents = Math.round(amountZAR * 100); // Peach requires integer cents
    
    const merchantTransactionId = `SDM-${Date.now()}`;
    const nonce = `nonce-${Math.random().toString(36).substring(2, 15)}`;
    
    // ✅ THIS IS THE CORRECT ENTITY ID DECODED FROM YOUR ACCESS TOKEN
    const entityId = "8acda4da9dd88496019e1b40cc0944d8"; 
    
    // ✅ USE THE EXACT ACCESS TOKEN YOU PROVIDED
    const authToken = "OGFjZGE0ZGE5ZGQ4ODQ5NjAxOWUxYjQwY2MwOTQ0ZDR8SncrNWpqM01iRWpKRHRkYjN6Rnk=";
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';

    console.log('🔑 Attempting auth with Entity ID:', entityId);

    const response = await fetch('https://secure.peachpayments.com/v2/checkout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Referer': baseUrl,
        'accept': 'application/json',
      },
      body: JSON.stringify({
        'authentication.entityId': entityId,
        merchantTransactionId: merchantTransactionId,
        amount: amountInCents,
        currency: body.currency || 'ZAR',
        paymentType: 'DB',
        nonce: nonce,
        shopperResultUrl: `${baseUrl}/payment/success`,
        cancelUrl: `${baseUrl}/payment/cancelled`,
        notificationUrl: `${baseUrl}/api/webhooks/peach`,
        forceDefaultMethod: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Peach API Rejected:', data);
      return NextResponse.json({ 
        error: data.message || 'Payment initialization failed',
        details: data.description || 'Unknown error'
      }, { status: response.status });
    }

    if (!data.id) {
      return NextResponse.json({ error: 'No checkout ID returned', response: data }, { status: 500 });
    }

    return NextResponse.json({ checkoutId: data.id });

  } catch (error: any) {
    console.error('💥 API Crash:', error);
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
  }
}
