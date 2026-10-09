import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';

function sign(message: string, secret: string): string {
  return createHmac('sha256', secret).update(message, 'utf8').digest('hex');
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const amount = parseFloat(String(body.amount ?? '10.00')).toFixed(2);

    const entityId = process.env.PEACH_ENTITY_ID || '';
    const secret =
      process.env.PEACH_SECRET_TOKEN ||
      process.env.PEACH_BEARER_TOKEN ||
      process.env.PEACH_AUTH_TOKEN ||
      '';

    if (!entityId || !secret) {
      return NextResponse.json({
        error: 'MISSING KEYS',
        entityIdFound: !!entityId,
        secretFound: !!secret,
      }, { status: 500 });
    }

    const params: Record<string, string> = {
      'authentication.entityId': entityId,
      amount,
      currency: 'USD',
      merchantTransactionId: 'SD' + Date.now().toString().slice(-8),
      nonce: Date.now().toString(36) + Math.random().toString(36).slice(2, 10),
      paymentType: 'DB',
      shopperResultUrl: 'https://super-digital-markets-co9n.vercel.app/payment',
    };

    // Official signature: alphabetical keys, name+value concatenated, HMAC-SHA256
    const message = Object.keys(params).sort().map((k) => k + params[k]).join('');
    const signature = sign(message, secret);

    const formBody = new URLSearchParams({ ...params, signature });

    const bases = process.env.PEACH_API_URL
      ? [process.env.PEACH_API_URL]
      : ['https://secure.peachpayments.com', 'https://testsecure.peachpayments.com'];

    let lastStatus = 0;
    let lastData: any = null;

    for (const base of bases) {
      const res = await fetch(base + '/checkout/initiate', {
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
      lastStatus = res.status;
      lastData = data;

      if (res.ok) {
        const url = data.redirectUrl || data.url || data.checkoutUrl || '';
        if (url) {
          return NextResponse.json({ url, checkoutId: data.id || data.checkoutId });
        }
        return NextResponse.json({ error: 'NO REDIRECT URL', peachResponse: data }, { status: 500 });
      }
    }

    return NextResponse.json({
      error: 'PEACH REJECTED',
      statusCode: lastStatus,
      peachResponse: lastData,
    }, { status: 500 });

  } catch (error: any) {
    return NextResponse.json({ error: 'CODE CRASHED', message: error.message }, { status: 500 });
  }
}
