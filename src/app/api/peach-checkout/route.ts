import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const amount = body.amount || '10.00';

    const token = process.env.PEACH_AUTH_TOKEN;
    const entityId = process.env.PEACH_ENTITY_ID;

    if (!token || !entityId) {
      return NextResponse.json({ 
        error: `VERCEL KEY FAILURE: Token exists: ${!!token}, Entity exists: ${!!entityId}. Check for hidden spaces in Vercel Settings.` 
      }, { status: 500 });
    }

    const payload = new URLSearchParams({
      entityId: entityId,
      amount: parseFloat(amount).toFixed(2),
      currency: 'USD',
      paymentType: 'DB',
    });

    const response = await fetch('https://oppwa.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload.toString(),
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!response.ok) {
      return NextResponse.json({ error: `PEACH REJECTED: ${JSON.stringify(data)}` }, { status: 500 });
    }

    if (data.id) {
      return NextResponse.json({ url: `https://oppwa.com/v1/checkouts/${data.id}/payment` });
    }

    return NextResponse.json({ error: `NO ID: ${JSON.stringify(data)}` }, { status: 500 });

  } catch (error: any) {
    return NextResponse.json({ error: `CRASH: ${error.message}` }, { status: 500 });
  }
}
