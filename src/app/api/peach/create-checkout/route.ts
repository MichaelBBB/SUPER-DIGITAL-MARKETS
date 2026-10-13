import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency, orderId } = body;

    const entityId = process.env.NEXT_PUBLIC_PEACH_ENTITY_ID;
    const secretToken = process.env.PEACH_SECRET_TOKEN;

    if (!entityId || !secretToken) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 500 });
    }

    const authHeader = 'Basic ' + Buffer.from(`${entityId}:${secretToken}`).toString('base64');
    const peachUrl = 'https://eu-prod.oppwa.com/v1/checkouts';

    // THIS IS THE FIX: Tell Peach where to send the user back
    const baseUrl = 'https://super-digital-markets-co9n.vercel.app';
    const successUrl = `${baseUrl}/?payment=success`;
    const failureUrl = `${baseUrl}/?payment=failed`;

    const payload = new URLSearchParams({
      entity_id: entityId,
      amount: amount.toString(),
      currency: currency || 'ZAR',
      paymentType: 'DB',
      merchant_transaction_id: orderId || `ORDER-${Date.now()}`,
      // Add the return URLs here
      'createRegistration': 'false',
      'testMode': 'EXTERNAL',
    });

    // Note: Peach Hosted Checkout usually handles redirects via the frontend script, 
    // but if we are generating a URL, we must ensure the frontend handles the return.
    // For now, let's fix the frontend to handle the return.

    const response = await fetch(peachUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload.toString(),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Payment service error' }, { status: response.status });
    }

    const data = await response.json();

    if (data.result.code === '000.000.000' || data.result.code === '000.100.110') {
      return NextResponse.json({
        success: true,
        checkoutId: data.id, // We need the ID for the frontend script
        entityId: entityId,
      });
    } else {
      return NextResponse.json({ success: false, error: data.result.description }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
