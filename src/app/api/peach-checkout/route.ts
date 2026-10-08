import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amount = body.amount;

    if (!amount) {
      return NextResponse.json({ error: 'Missing amount' }, { status: 400 });
    }

    // Check for common naming variations
    const token = process.env.PEACH_AUTH_TOKEN || process.env.PEACH_TOKEN || process.env.AUTH_TOKEN;
    const entityId = process.env.PEACH_ENTITY_ID || process.env.ENTITY_ID;

    // Log to Vercel Function Logs so we can see what's happening
    console.log('Peach Debug - Token exists:', !!token, 'Entity exists:', !!entityId);

    if (!token || !entityId) {
      return NextResponse.json({ error: 'Internal server configuration error' }, { status: 500 });
    }

    const payload = new URLSearchParams({
      entityId: entityId,
      amount: parseFloat(amount).toFixed(2),
      currency: 'USD',
      paymentType: 'DB',
      merchantInvoiceId: `INV-${Date.now()}`,
    });

    const response = await fetch('https://oppwa.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload.toString(),
    });

    const data = await response.json();

    if (data.id) {
      return NextResponse.json({
        url: `https://oppwa.com/v1/checkouts/${data.id}/payment`,
        checkoutId: data.id
      });
    }

    return NextResponse.json({ error: 'Peach API failed', details: data }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
