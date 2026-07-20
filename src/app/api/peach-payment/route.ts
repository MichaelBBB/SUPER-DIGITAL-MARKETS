import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. Check Credentials
    const entityId = process.env.PEACH_ENTITY_ID;
    const clientSecret = process.env.PEACH_CLIENT_SECRET;

    if (!entityId || !clientSecret) {
      console.error("MISSING CREDENTIALS");
      return new Response(JSON.stringify({ error: "Missing PEACH credentials" }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // 2. Get Data
    const { amount, orderId, productName } = await request.json();
    
    // 3. Create Auth Header
    const auth = Buffer.from(`${entityId}:${clientSecret}`).toString('base64');

    // 4. Call Peach API
    const res = await fetch('https://secure.checkout.peachpayments.co.za/api/v1/sessions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency: 'ZAR',
        orderReference: orderId,
        description: productName,
        returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?status=success`,
        cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?status=cancelled`,
        webhook: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/peach`
      })
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Peach Error:", data);
      return new Response(JSON.stringify({ error: data.message || 'Payment Failed' }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // 5. Return Success
    return NextResponse.json({ success: true, checkoutUrl: data.checkoutUrl });

  } catch (error: any) {
    console.error("Route Crash:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
