import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const amount = body.amount || '0.00';
    const currency = body.currency || 'USD';
    const item = body.item || 'Super Digital Markets Purchase';

    const entityId = process.env.PEACH_ENTITY_ID || '';
    const authToken = process.env.PEACH_AUTH_TOKEN || '';
    const isTest = process.env.PEACH_TEST_MODE === 'true';
    
    const baseUrl = isTest 
      ? 'https://test.oppwa.com/v1/checkouts' 
      : 'https://oppwa.com/v1/checkouts';

    if (!entityId || !authToken) {
      return NextResponse.json({ error: 'Peach credentials missing in environment variables' }, { status: 500 });
    }

    const params = new URLSearchParams();
    params.append('entityId', entityId);
    params.append('amount', String(amount));
    params.append('currency', currency);
    params.append('paymentType', 'DB'); 
    params.append('merchantInvoiceId', `INV-${Date.now()}`);
    params.append('merchantMemo', item);

    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await res.json();

    if (data.id) {
      return NextResponse.json({ checkoutId: data.id, url: data.redirectUrl });
    }

    return NextResponse.json({ error: 'Failed to get checkout ID', details: data }, { status: 400 });

  } catch (err: any) {
    return NextResponse.json({ error: 'Server error', details: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'peach-auth active' });
}
