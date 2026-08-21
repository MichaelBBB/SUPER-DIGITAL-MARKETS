// src/app/api/create-payment/route.ts
import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';

export async function POST(request: Request) {
  try {
    const { amount, currency, productName, orderId } = await request.json();

    const ENTITY_ID = process.env.PEACH_ENTITY_ID?.trim();
    const SECRET_KEY = process.env.PEACH_SECRET_KEY?.trim();
    const BASE_URL = process.env.NEXT_PUBLIC_URL?.trim();
    const PEACH_MODE = process.env.NEXT_PUBLIC_PEACH_MODE;

    if (!ENTITY_ID || !SECRET_KEY || !BASE_URL) {
      return NextResponse.json({ error: 'Server configuration missing.' }, { status: 500 });
    }

    const nonce = `UNQ${Date.now()}`;
    
    // 🚨 CRITICAL: ONLY these 7 fields for signature (exactly like Peach's sample)
    // shopperResultUrl must be SIMPLE - no query params for signature calculation
    const simpleSuccessUrl = `${BASE_URL}/success`;
    
    const paramsForSigning: Record<string, string> = {
      "amount": amount.toFixed(2),
      "authentication.entityId": ENTITY_ID,
      "currency": currency.toUpperCase(),
      "merchantTransactionId": orderId,
      "nonce": nonce,
      "paymentType": "DB",
      "shopperResultUrl": simpleSuccessUrl, // 🚨 NO query params in signature!
    };

    // 🚨 CRITICAL: Signature = key+value concatenated, alphabetical keys, NO separators
    const sortedKeys = Object.keys(paramsForSigning).sort();
    const sigString = sortedKeys.map(k => `${k}${paramsForSigning[k]}`).join('');
    
    // Generate HMAC-SHA256 using SECRET_KEY as raw string
    const signature = createHmac('sha256', SECRET_KEY).update(sigString, 'utf8').digest('hex');

    // Build form body: signed fields + signature + optional fields (NOT in signature)
    const formData = new URLSearchParams();
    
    // Add the 7 signed fields
    for (const [key, value] of Object.entries(paramsForSigning)) {
      formData.append(key, value);
    }
    formData.append('signature', signature);
    
    // Add optional fields (NOT included in signature calculation)
    formData.append('merchantInvoiceId', orderId);
    formData.append('cancelUrl', `${BASE_URL}/payment?cancelled=true`);
    formData.append('notificationUrl', `${BASE_URL}/api/webhook`);
    formData.append('customParameters[orderId]', orderId);
    formData.append('customParameters[productName]', productName);
    formData.append('customParameters[itemName]', productName);

    const endpoint = PEACH_MODE === 'LIVE' 
      ? 'https://secure.peachpayments.com/checkout/initiate'
      : 'https://testsecure.peachpayments.com/checkout/initiate';

    // Send as application/x-www-form-urlencoded (NOT JSON)
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Referer': BASE_URL,
        'accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
        // 🚨 NO Authorization header - not required for /checkout/initiate per Peach docs
      },
      body: formData.toString()
    });

    const text = await res.text();
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Payment initiation failed', peachResponse: text }, { status: res.status });
    }

    const data = JSON.parse(text);
    
    if (data.redirectUrl) {
      return NextResponse.json({ checkoutUrl: data.redirectUrl });
    }

    return NextResponse.json({ error: 'No redirectUrl', details: data }, { status: 500 });

  } catch (error: any) {
    return NextResponse.json({ error: 'Payment system error', details: error.message }, { status: 503 });
  }
}
