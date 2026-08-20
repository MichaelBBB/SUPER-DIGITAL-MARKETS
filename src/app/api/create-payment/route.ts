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
    
    // Build parameters for signing (alphabetical order, key=value format)
    const paramsForSigning: Record<string, string> = {
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

    // Generate signature string: alphabetical keys, key=value (NO URL encoding for signature)
    const sortedKeys = Object.keys(paramsForSigning).sort();
    const sigString = sortedKeys.map(k => `${k}=${paramsForSigning[k]}`).join('&');
    
    // Generate HMAC-SHA256 signature using SECRET_KEY
    const signature = createHmac('sha256', SECRET_KEY).update(sigString).digest('hex');

    // Build final form data (URL-encoded)
    const formData = new URLSearchParams();
    for (const [key, value] of Object.entries(paramsForSigning)) {
      formData.append(key, value);
    }
    formData.append('signature', signature);

    const endpoint = PEACH_MODE === 'LIVE' 
      ? 'https://secure.peachpayments.com/checkout/initiate'
      : 'https://testsecure.peachpayments.com/checkout/initiate';

    console.log("📡 POST to:", endpoint);
    console.log("🔐 Signature:", signature);

    // ✅ CRITICAL: Send as application/x-www-form-urlencoded (NOT JSON)
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Referer': BASE_URL,
        'accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'  // ✅ THIS WAS THE BUG!
      },
      body: formData.toString()  // ✅ Send as form string, NOT JSON.stringify()
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
