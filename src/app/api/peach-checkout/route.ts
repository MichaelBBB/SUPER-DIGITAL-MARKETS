import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const amount = body.amount || '10.00';
    
    // DYNAMIC TOKEN CATCHER (Finds it no matter what you named it in Vercel)
    const token = process.env.PEACH_BEARER_TOKEN || process.env.PEACH_AUTH_TOKEN || process.env.PEACH_TOKEN;
    const entityId = process.env.PEACH_ENTITY_ID;
    const apiUrl = process.env.PEACH_API_URL || 'https://oppwa.com';

    if (!token || !entityId) {
      return NextResponse.json({ error: 'Missing Vercel Keys' }, { status: 500 });
    }

    // Auto-generate the missing fields your old code was demanding
    const formData = new URLSearchParams();
    formData.append('entityId', entityId);
    formData.append('amount', parseFloat(amount).toFixed(2));
    formData.append('currency', 'USD');
    formData.append('paymentType', 'DB');
    formData.append('merchantTransactionId', `INV-${Date.now()}`);

    const response = await fetch(`${apiUrl}/v1/checkouts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const data = await response.json();

    if (!response.ok || !data.id) {
      return NextResponse.json({ error: 'Peach Failed', details: data }, { status: 500 });
    }

    // CRITICAL: Build the exact URL the Blue Button needs to redirect the customer
    const paymentUrl = `${apiUrl}/v1/checkouts/${data.id}/payment`;
    return NextResponse.json({ url: paymentUrl, checkoutId: data.id });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
