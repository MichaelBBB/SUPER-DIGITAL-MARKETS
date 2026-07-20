import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const entityId = process.env.PEACH_ENTITY_ID;
    const clientSecret = process.env.PEACH_CLIENT_SECRET;

    if (!entityId || !clientSecret) {
      throw new Error("Missing Peach credentials");
    }

    // Parse form data manually from raw body
    const rawBody = await request.text();
    const params = new URLSearchParams(rawBody);
    
    const amount = parseFloat(params.get('amount') || '0');
    const orderId = params.get('orderId') || '';
    const productName = params.get('productName') || '';

    console.log('Payment request:', { amount, orderId, productName });

    const auth = Buffer.from(`${entityId}:${clientSecret}`).toString('base64');
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';

    // Call Peach API
    const peachRes = await fetch('https://secure.checkout.peachpayments.co.za/api/v1/sessions', {
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
        returnUrl: `${baseUrl}/checkout?status=success`,
        cancelUrl: `${baseUrl}/checkout?status=cancelled`,
        webhook: `${baseUrl}/api/webhooks/peach`
      })
    });

    const data = await peachRes.json();
    console.log('Peach response:', data);

    if (!peachRes.ok || !data.checkoutUrl) {
      throw new Error(data.message || 'Failed to create checkout session');
    }

    // Redirect to Peach checkout
    return NextResponse.redirect(data.checkoutUrl);

  } catch (error: any) {
    console.error("Payment error:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
