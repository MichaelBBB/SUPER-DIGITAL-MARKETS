import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';

function sign(message: string, secret: string): string {
  return createHmac('sha256', secret).update(message, 'utf8').digest('hex');
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const amount = parseFloat(String(body.amount ?? '10.00')).toFixed(2);

    const entityId = (process.env.PEACH_ENTITY_ID || '').trim();

    // Collect EVERY candidate secret and trim hidden spaces/newlines
    const candidates: Record<string, string> = {};
    for (const name of ['PEACH_SECRET_TOKEN', 'PEACH_BEARER_TOKEN', 'PEACH_AUTH_TOKEN']) {
      const v = (process.env[name] || '').trim();
      if (v) candidates[name] = v;
    }
    const names = Object.keys(candidates);

    if (!entityId || names.length === 0) {
      return NextResponse.json({
        error: 'MISSING KEYS',
        entityIdFound: !!entityId,
        secretSourcesFound: names,
      }, { status: 500 });
    }

    const baseParams: Record<string, string> = {
      'authentication.entityId': entityId,
      amount,
      currency: 'USD',
      merchantTransactionId: 'SD' + Date.now().toString().slice(-8),
      nonce: Date.now().toString(36) + Math.random().toString(36).slice(2, 10),
      paymentType: 'DB',
      shopperResultUrl: 'https://super-digital-markets-co9n.vercel.app/payment',
    };

    // Official signature: alphabetical keys, name+value concatenated, HMAC-SHA256
    const message = Object.keys(baseParams).sort().map((k) => k + baseParams[k]).join('');

    const bases = [
      'https://secure.peachpayments.com',
      'https://testsecure.peachpayments.com',
    ];

    const attempts: any[] = [];

    for (const base of bases) {
      for (const name of names) {
        const signature = sign(message, candidates[name]);
        const formBody = new URLSearchParams({ ...baseParams, signature });

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
        try { data = JSON.parse(text); } catch { data = { rawResponse: text.slice(0, 300) }; }

        if (res.ok) {
          const url = data.redirectUrl || data.url || data.checkoutUrl || '';
          if (url) {
            return NextResponse.json({ url, checkoutId: data.id || data.checkoutId, workedWith: name, host: base });
          }
          return NextResponse.json({ error: 'NO REDIRECT URL', peachResponse: data }, { status: 500 });
        }

        attempts.push({ host: base, secretUsed: name, status: res.status, response: data });
      }
    }

    return NextResponse.json({
      error: 'PEACH REJECTED ON ALL HOSTS',
      entityIdStart: entityId.slice(0, 8),
      attempts,
    }, { status: 500 });

  } catch (error: any) {
    return NextResponse.json({ error: 'CODE CRASHED', message: error.message }, { status: 500 });
  }
}
