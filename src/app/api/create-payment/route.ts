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
    
    // 🚨 CRITICAL: Use SIMPLE shopperResultUrl (NO query params, NO encoding)
    // Just like Peach's example: https://mydemostore.com/OrderNo453432
    const shopperResultUrl = `${BASE_URL}/success`;
    
    // ONLY these 7 fields (alphabetical order)
    const paramsForSigning: Record<string, string> = {
      "amount": amount.toFixed(2),
      "authentication.entityId": ENTITY_ID,
      "currency": currency.toUpperCase(),
      "merchantTransactionId": orderId,
      "nonce": nonce,
      "paymentType": "DB",
      "shopperResultUrl": shopperResultUrl, // 🚨 NO encodeURIComponent!
    };

    // 🚨 CRITICAL: Concatenate key+value, NO separators, NO encoding
    const sortedKeys = Object.keys(paramsForSigning).sort();
    const sigString = sortedKeys.map(k => `${k}${paramsForSigning[k]}`).join('');
    
    // 🚨 CRITICAL: Use secret key as-is (NO encoding, NO trimming beyond initial)
    const signature = createHmac('sha256', SECRET_KEY).update(sigString, 'utf8').digest('hex');

    console.log("🔐 Signature String:", sigString);
    console.log("✅ Generated Signature:", signature);

    // Build form body
    const formData = new URLSearchParams();
    for (const [key, value] of Object.entries(paramsForSigning)) {
      formData.append(key, value);
    }
    formData.append('signature', signature);
    
    // Optional fields (NOT in signature)
    formData.append('merchantInvoiceId', orderId);
    formData.append('cancelUrl', `${BASE_URL}/payment?cancelled=true`);
    formData.append('notificationUrl', `${BASE_URL}/api/webhook`);
    formData.append('customParameters[orderId]', orderId);
    formData.append('customParameters[productName]', productName);

    const endpoint = PEACH_MODE === 'LIVE' 
      ? 'https://secure.peachpayments.com/checkout/initiate'
      : 'https://testsecure.peachpayments.com/checkout/initiate';

    // Send as form-urlencoded
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
      console.error("🚫 Peach Error:", text);
      return NextResponse.json({ error: 'Payment initiation failed', peachResponse: text }, { status: res.status });
    }

    const data = JSON.parse(text);
    
    if (data.redirectUrl) {
      console.log("✅ SUCCESS! Redirect:", data.redirectUrl);
      return NextResponse.json({ checkoutUrl: data.redirectUrl });
    }

    return NextResponse.json({ error: 'No redirectUrl', details: data }, { status: 500 });

  } catch (error: any) {
    console.error("💥 CRITICAL ERROR:", error.message);
    return NextResponse.json({ error: 'Payment system error', details: error.message }, { status: 503 });
  }
}
