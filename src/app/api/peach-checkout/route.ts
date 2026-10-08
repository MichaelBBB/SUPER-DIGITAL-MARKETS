import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const amount = body.amount || '0.00';

    // Log exactly what Vercel is passing to the server
    const peachKeys = Object.keys(process.env).filter(k => k.toUpperCase().includes('PEACH'));
    console.log('--- PEACH DEBUG START ---');
    console.log('Keys found in Vercel:', peachKeys);
    console.log('PEACH_AUTH_TOKEN exists:', !!process.env.PEACH_AUTH_TOKEN);
    console.log('PEACH_ENTITY_ID exists:', !!process.env.PEACH_ENTITY_ID);
    console.log('--- PEACH DEBUG END ---');

    const token = process.env.PEACH_AUTH_TOKEN;
    const entityId = process.env.PEACH_ENTITY_ID;

    if (!token || !entityId) {
      return NextResponse.json(
        { error: `Config error. Found keys: ${peachKeys.join(', ')}` }, 
        { status: 500 }
      );
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
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
