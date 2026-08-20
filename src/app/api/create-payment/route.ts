// src/app/api/create-payment/route.ts
import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';

export async function POST(request: Request) {
  try {
    const { amount, currency, productName, orderId } = await request.json();

    const ENTITY_ID = process.env.PEACH_ENTITY_ID;
    const SECRET_KEY = process.env.PEACH_SECRET_KEY;
    const BASE_URL = process.env.NEXT_PUBLIC_URL;
    const PEACH_MODE = process.env.NEXT_PUBLIC_PEACH_MODE;

    if (!ENTITY_ID || !SECRET_KEY || !BASE_URL) {
      return NextResponse.json({ 
        error: 'Server configuration missing.',
        debug: { hasEntityId: !!ENTITY_ID, hasSecretKey: !!SECRET_KEY, hasBaseUrl: !!BASE_URL }
      }, { status: 500 });
    }

    const nonce = `UNQ${Date.now()}${Math.floor(Math.random() * 1000000)}`;
    
    const body: Record<string, any> = {
      "authentication.entityId": ENTITY_ID,
      "merchantTransactionId": orderId,
      "rateLimitId": orderId,
      "amount": amount.toFixed(2),
      "paymentType": "DB",
      "currency": currency.toUpperCase(),
      "nonce": nonce,
      "shopperResultUrl": `${BASE_URL}/success?orderId=${orderId}&amount=${amount}&item=${encodeURIComponent(productName)}`,
      "merchantInvoiceId": orderId,
      "cancelUrl": `${BASE_URL}/payment?cancelled=true`,
      "notificationUrl": `${BASE_URL}/api/webhook`,
      "customParameters[orderId]": orderId,
      "customParameters[productName]": productName,
      "customer.givenName": "Customer",
      "customer.surname": "Order", 
      "customer.email": "order@super-digital.com",
      "billing.country": "ZA",
      "shipping.country": "ZA",
    };

    // Generate HMAC SHA256 signature (alphabetical keys)
    const sortedKeys = Object.keys(body).sort();
    const sigString = sortedKeys.map(k => `${k}=${(body as any)[k]}`).join('&');
    const signature = createHmac('sha256', SECRET_KEY).update(sigString).digest('hex');
    body.signature = signature;

    const endpoint = PEACH_MODE === 'LIVE' 
      ? 'https://secure.peachpayments.com/checkout/initiate'
      : 'https://testsecure.peachpayments.com/checkout/initiate';

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Referer': BASE_URL,
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } 
    catch (e) { data = { rawResponse: text }; }

    if (!res.ok) {
      console.error('Peach API Error:', data);
      return NextResponse.json({ 
        error: 'Payment initiation failed', 
        status: res.status,
        peachResponse: data 
      }, { status: res.status });
    }

    if (data.redirectUrl) {
      return NextResponse.json({ checkoutUrl: data.redirectUrl });
    }

    return NextResponse.json({ error: 'No redirectUrl', details: data }, { status: 500 });

  } catch (error: any) {
    console.error('Peach Integration Error:', error);
    return NextResponse.json({
      error: 'Payment system error',
      details: error.message
    }, { status: 503 });
  }
}
