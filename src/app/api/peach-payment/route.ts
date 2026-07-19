import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const entityId = process.env.PEACH_ENTITY_ID;
    const clientSecret = process.env.PEACH_CLIENT_SECRET;

    if (!entityId || !clientSecret) {
      return new Response(JSON.stringify({ error: "Missing credentials" }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // READ AS FORM DATA (not JSON!)
    const formData = await request.formData();
    const amount = parseFloat(formData.get('amount') as string);
    const orderId = formData.get('orderId') as string;
    const productName = formData.get('productName') as string;

    const auth = Buffer.from(`${entityId}:${clientSecret}`).toString('base64');
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';

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
        returnUrl: `${baseUrl}/checkout?status=success`,
        cancelUrl: `${baseUrl}/checkout?status=cancelled`,
        webhook: `${baseUrl}/api/webhooks/peach`
      })
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data.message || 'Payment failed' }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    return NextResponse.redirect(data.checkoutUrl);

  } catch (error: any) {
    console.error("Payment error:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
