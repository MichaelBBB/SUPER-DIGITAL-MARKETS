// src/app/api/peach-checkout/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amountZAR = parseFloat(body.amount);
    
    // Convert to cents (integer) as required by Peach
    const amountInCents = Math.round(amountZAR * 100);
    
    // Generate unique IDs
    const merchantTransactionId = `SDM-${Date.now()}`;
    const nonce = `nonce-${Math.random().toString(36).substring(2, 15)}`;
    
    // Your LIVE credentials
    const entityId = "8acda4cb9e1b546a019e1b5b39ee001c";
    const authToken = process.env.PEACH_SECRET_TOKEN;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';

    if (!authToken) {
      console.error('❌ PEACH_SECRET_TOKEN is missing');
      return NextResponse.json({ 
        error: 'Server configuration error',
        message: 'Payment token not configured'
      }, { status: 500 });
    }

    // ✅ CORRECT v2 API endpoint per Peach documentation
    const response = await fetch('https://secure.peachpayments.com/v2/checkout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Referer': baseUrl,
        'accept': 'application/json',
      },
      body: JSON.stringify({
        // ✅ Dot notation for authentication (REQUIRED by Peach)
        'authentication.entityId': entityId,
        
        // ✅ Required fields per Peach v2 API
        merchantTransactionId: merchantTransactionId,
        amount: amountInCents,
        currency: body.currency || 'ZAR',
        paymentType: 'DB',
        nonce: nonce,
        
        // ✅ Return URLs
        shopperResultUrl: `${baseUrl}/payment/success`,
        cancelUrl: `${baseUrl}/payment/cancelled`,
        notificationUrl: `${baseUrl}/api/webhooks/peach`,
        
        // ✅ Additional required fields
        forceDefaultMethod: false,
      }),
    });

    const data = await response.json();
    console.log('Peach API Response:', { status: response.status, ok: response.ok, data });

    if (!response.ok) {
      console.error('❌ Peach API Error:', data);
      return NextResponse.json({ 
        error: data.message || 'Payment initialization failed',
        details: data.description || 'Unknown error'
      }, { status: response.status });
    }

    if (!data.id) {
      console.error('❌ No checkout ID in response:', data);
      return NextResponse.json({ 
        error: 'No checkout ID returned',
        response: data 
      }, { status: 500 });
    }

    return NextResponse.json({ checkoutId: data.id });

  } catch (error: any) {
    console.error('💥 API Route Crash:', error);
    return NextResponse.json({ 
      error: 'Failed to connect to payment gateway. Check Entity ID.',
      message: error.message || 'Unknown error'
    }, { status: 500 });
  }
}
