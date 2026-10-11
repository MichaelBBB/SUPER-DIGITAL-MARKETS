import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';

function sign(message: string, secret: string): string {
  return createHmac('sha256', secret).update(message, 'utf8').digest('hex');
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const selfTest = body.selfTest === true;

    const entityId = selfTest
      ? '8ac7a4ca68c22c4d0168c2caab2e0025'
      : (process.env.PEACH_ENTITY_ID || '').trim();

    const secret = selfTest
      ? '3fcd7cf22f55119eadbe02d14de18c0c'
      : (process.env.PEACH_SECRET_TOKEN || process.env.PEACH_BEARER_TOKEN || process.env.PEACH_AUTH_TOKEN || '').trim();

    if (!entityId || !secret) {
      return NextResponse.json({ error: 'MISSING KEYS' }, { status: 500 });
    }

    const baseParams: Record<string, string> = {
      'authentication.entityId': entityId,
      amount: parseFloat(String(body.amount ?? '10.00')).toFixed(2),
      currency: selfTest ? 'ZAR' : 'USD',
      merchantTransactionId: 'SD' + Date.now().toString().slice(-8),
      nonce: Date.now().toString(36) + Math.random().toString(36).slice(2, 10),
      paymentType: 'DB',
      shopperResultUrl: 'https://super-digital-markets-co9n.vercel.app/payment',
    };

    const message = Object.keys(baseParams).sort().map((k) => k + baseParams[k]).join('');
    const signature = sign(message, secret);
    const formBody = new URLSearchParams({ ...baseParams, signature });

    const host = selfTest
      ? 'https://testsecure.peachpayments.com'
      : 'https://secure.peachpayments.com';

    const res = await fetch(host + '/checkout/initiate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        Referer: 'https://super-digital-markets-co9n.vercel.app',
      },
      body: formBody.toString(),
    });

    const text = await res.text();
    let data: any;
    try { data = JSON.parse(text); } catch { data = { rawResponse: text.slice(0, 400) }; }

    if (res.ok) {
      const url = data.redirectUrl || data.url || data.checkoutUrl || '';
      if (url) return NextResponse.json({ url, selfTest });
      return NextResponse.json({ error: 'NO REDIRECT URL', peachResponse: data }, { status: 500 });
    }

    return NextResponse.json({
      error: 'PEACH REJECTED',
      selfTest,
      host,
      entityIdStart: entityId.slice(0, 8),
      status: res.status,
      response: data,
    }, { status: 500 });

  } catch (error: any) {
    return NextResponse.json({ error: 'CODE CRASHED', message: error.message }, { status: 500 });
  }
}
