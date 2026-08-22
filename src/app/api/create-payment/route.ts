// src/app/api/create-payment/route.ts
import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';

export async function POST(request: Request) {
  try {
    const { amount, currency, productName, orderId } = await request.json();

    const ENTITY_ID = process.env.PEACH_ENTITY_ID?.trim();
    const SECRET_KEY = process.env.PEACH_SECRET_KEY?.trim();
    const BASE_URL = process.env.NEXT_PUBLIC_URL?.trim();

    if (!ENTITY_ID || !SECRET_KEY || !BASE_URL) {
      return NextResponse.json({ error: 'Server configuration missing.' }, { status: 500 });
    }

    const cleanBaseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

    // 1. PREPARE PAYLOAD FOR SIGNATURE (V1 Style - Required for many V2 endpoints)
    // Note: V2 JSON structure flattened for signature string generation
    const paramsForSigning: Record<string, string> = {
      "amount": parseFloat(amount).toFixed(2),
      "authentication.entityId": ENTITY_ID,
      "currency": currency.toUpperCase(),
      "merchantTransactionId": orderId,
      "nonce": `UNQ${Date.now()}`,
      "paymentType": "DB",
      "shopperResultUrl": `${cleanBaseUrl}/success`,
    };

    // 2. GENERATE SIGNATURE STRING (Alphabetical, Key+Value, No Separators)
    const sortedKeys = Object.keys(paramsForSigning).sort();
    let sigString = "";
    for (const key of sortedKeys) {
      sigString += key + paramsForSigning[key];
    }

    // 3. CALCULATE HMAC-SHA256
    const signature = createHmac('sha256', SECRET_KEY).update(sigString, 'utf8').digest('hex');

    console.log("🔐 V2 Hybrid Signature:", signature);

    // 4. BUILD V2 JSON PAYLOAD WITH SIGNATURE INCLUDED
    const payload = {
      authentication: {
        entityId: ENTITY_ID,
      },
      merchantTransactionId: orderId,
      amount: parseFloat(amount).toFixed(2),
      currency: currency.toUpperCase(),
      paymentType: "DB",
      nonce: paramsForSigning.nonce,
      shopperResultUrl: paramsForSigning.shopperResultUrl,
      merchantInvoiceId: orderId,
      cancelUrl: `${cleanBaseUrl}/payment?cancelled=true`,
      notificationUrl: `${cleanBaseUrl}/api/webhook`,
      customParameters: {
        orderId: orderId,
        productName: productName,
      },
      customer: {
        givenName: "Customer",
        surname: "Order",
        email: "order@super-digital.com",
      },
      billing: { country: "ZA" },
      shipping: { country: "ZA" },
      // CRITICAL: Include signature in V2 payload for authentication
      signature: signature 
    };

    // 5. SEND TO V2 ENDPOINT
    const res = await fetch('https://secure.peachpayments.com/v2/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': cleanBaseUrl,
        // Try without Authorization header first, as signature is in body
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch (e) { return NextResponse.json({ error: 'Invalid response', raw: text.substring(0, 200) }, { status: 500 }); }

    if (!res.ok) {
      console.error("🚫 V2 Error:", data);
      return NextResponse.json({ error: 'Payment initiation failed', details: data }, { status: res.status });
    }

    if (data.redirectUrl) {
      return NextResponse.json({ checkoutUrl: data.redirectUrl });
    }

    return NextResponse.json({ error: 'No redirectUrl', details: data }, { status: 500 });

  } catch (error: any) {
    return NextResponse.json({ error: 'System error', details: error.message }, { status: 503 });
  }
}
