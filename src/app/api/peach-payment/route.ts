import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { amount, orderId, productName } = await request.json();
    const entityId = process.env.PEACH_ENTITY_ID || '';
    const clientSecret = process.env.PEACH_CLIENT_SECRET || '';

    // Peach uses Basic Auth with Entity ID + Client Secret
    const auth = Buffer.from(`${entityId}:${clientSecret}`).toString('base64');

    const res = await fetch('https://secure.checkout.peachpayments.co.za/api/v1/sessions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Peach expects cents
        currency: 'ZAR',
        orderReference: orderId,
        description: productName,
        returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?status=success`,
        cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?status=cancelled`,
        // This automatically registers your webhook URL with Peach for this transaction
        webhook: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/peach`
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Peach API error');

    return NextResponse.json({ success: true, checkoutUrl: data.checkoutUrl });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
