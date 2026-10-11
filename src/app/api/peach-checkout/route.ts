import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';

function sign(message: string, secret: string): string {
  return createHmac('sha256', secret).update(message, 'utf8').digest('hex');
}

async function usdToZar(usd: number): Promise<number> {
  try {
    const r = await fetch('https://open.er-api.com/v6/latest/USD');
    const j = await r.json();
    const rate = j?.rates?.ZAR;
    if (rate && rate > 1) return usd * rate;
  } catch {}
  return usd * 18.5;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const amountUsd = parseFloat(String(body.amount ?? '10.00'));

    const entityId = (process.env.PEACH_ENTITY_ID || '').trim();
    const secret = (process.env.PEACH_SECRET_TOKEN || process.env.PEACH_BEARER_TOKEN || process.env.PEACH_AUTH_TOKEN || '').trim();

    if (!entityId || !secret) {
      return NextResponse.json({ error: 'MISSING KEYS' }, { status: 500 });
    }

    const amountUsdStr = amountUsd.toFixed(2);
    const amountZar = (await usdToZar(amountUsd)).toFixed(2);
    const resultUrl = 'https://super-digital-markets-co9n.vercel.app/payment';

    const variants = [
      { label: 'USD', amount: amountUsdStr, currency: 'USD', card: false },
      { label: 'USD+CARD', amount: amountUsdStr, currency: 'USD', card: true },
      { label: 'ZAR', amount: amountZar, currency: 'ZAR', card: false },
      { label: 'ZAR+CARD', amount: amountZar, currency: 'ZAR', card: true },
    ];

    const attempts: any[] = [];

    for (const v of variants) {
      const params: Record<string, string> = {
        'authentication.entityId': entityId,
        amount: v.amount,
        currency: v.currency,
        merchantTransactionId: 'SD' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 10),
        nonce: Date.now().toString(36) + Math.random().toString(36).slice(2, 10),
        paymentType: 'DB',
        shopperResultUrl: resultUrl,
      };
      if (v.card) params.defaultPaymentMethod = 'CARD';

      const message = Object.keys(params).sort().map((k) => k + params[k]).join('');
      const signature = sign(message, secret);
      const formBody = new URLSearchParams({ ...params, signature });

      const res = await fetch('https://secure.peachpayments.com/checkout/initiate', {
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
          return NextResponse.json({ url, variant: v.label, checkoutId: data.id });
        }
      }

      attempts.push({ variant: v.label, status: res.status, response: data });
    }

    return NextResponse.json({
      error: 'PEACH REJECTED ALL VARIANTS',
      entityIdStart: entityId.slice(0, 8),
      attempts,
    }, { status: 500 });

  } catch (error: any) {
    return NextResponse.json({ error: 'CODE CRASHED', message: error.message }, { status: 500 });
  }
}
