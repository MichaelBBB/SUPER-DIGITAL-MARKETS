// src/app/api/create-payment/route.ts
import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';

export async function POST(request: Request) {
  const { amount, currency, productName, orderId } = await request.json();

  const ENTITY_ID = process.env.PEACH_ENTITY_ID;
  const SECRET_KEY = process.env.PEACH_SECRET_KEY;
  const BASE_URL = process.env.NEXT_PUBLIC_URL;

  if (!ENTITY_ID || !SECRET_KEY || !BASE_URL) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 500 });
  }

  // Generate unique nonce
  const nonce = `UNQ${Date.now()}`;
  
  // Build signature string EXACTLY like Peach's example:
  // - Alphabetical keys
  // - key+value format (NO = or &)
  // - NO URL encoding
  const paramsForSigning: Record<string, string> = {
    "amount": amount.toFixed(2),
    "authentication.entityId": ENTITY_ID,
    "currency": currency.toUpperCase(),
    "merchantTransactionId": orderId,
    "nonce": nonce,
    "paymentType": "DB",
    "shopperResultUrl": `${BASE_URL}/success`,
  };

  // Concatenate: key1value1key2value2...
  const sortedKeys = Object.keys(paramsForSigning).sort();
  const sigString = sortedKeys.map(k => `${k}${paramsForSigning[k]}`).join('');
  
  // HMAC-SHA256 with raw secret key
  const signature = createHmac('sha256', SECRET_KEY).update(sigString, 'utf8').digest('hex');

  // Build form body
  const formData = new URLSearchParams();
  formData.append('authentication.entityId', ENTITY_ID);
  formData.append('signature', signature);
  formData.append('merchantTransactionId', orderId);
  formData.append('amount', amount.toFixed(2));
  formData.append('paymentType', 'DB');
  formData.append('currency', currency.toUpperCase());
  formData.append('nonce', nonce);
  formData.append('shopperResultUrl', `${BASE_URL}/success`);
  
  // Optional fields (NOT in signature)
  formData.append('merchantInvoiceId', orderId);
  formData.append('cancelUrl', `${BASE_URL}/payment`);
  formData.append('notificationUrl', `${BASE_URL}/api/webhook`);

  // Use LIVE endpoint
  const endpoint = 'https://secure.peachpayments.com/checkout/initiate';

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Referer': BASE_URL,
      'accept': 'application/json',
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: formData.toString()
  });

  const text = await res.text();
  
  if (!res.ok) {
    return NextResponse.json({ error: 'Payment failed', peachResponse: text }, { status: res.status });
  }

  const data = JSON.parse(text);
  
  if (data.redirectUrl) {
    return NextResponse.json({ checkoutUrl: data.redirectUrl });
  }

  return NextResponse.json({ error: 'No redirectUrl', details: data }, { status: 500 });
}
