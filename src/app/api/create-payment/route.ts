// src/app/api/create-payment/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, currency, productName, orderId } = await request.json();

    const ENTITY_ID = process.env.PEACH_ENTITY_ID;
    const SECRET_KEY = process.env.PEACH_SECRET_KEY;
    const BASE_URL = process.env.NEXT_PUBLIC_URL;
    const PEACH_MODE = process.env.NEXT_PUBLIC_PEACH_MODE;

    console.log("🔑 ENV CHECK:", {
      ENTITY_ID: ENTITY_ID ? "✅" : "❌",
      SECRET_KEY: SECRET_KEY ? "✅" : "❌", 
      BASE_URL: BASE_URL || "❌",
      MODE: PEACH_MODE
    });

    if (!ENTITY_ID || !SECRET_KEY || !BASE_URL) {
      console.error("❌ Missing env vars");
      return NextResponse.json({ error: 'Server configuration missing.' }, { status: 500 });
    }

    // Build request body EXACTLY like Peach's example
    const nonce = `UNQ${Date.now()}`;
    const body = {
      "authentication.entityId": ENTITY_ID,
      "merchantTransactionId": orderId,
      "rateLimitId": orderId,
      "amount": amount.toFixed(2),
      "paymentType": "DB",
      "currency": currency.toUpperCase(),
      "nonce": nonce,
      "shopperResultUrl": `${BASE_URL}/payment/success`,
      "merchantInvoiceId": orderId,
      "cancelUrl": `${BASE_URL}/payment/fail`,
      "notificationUrl": `${BASE_URL}/api/webhook`,
      "customParameters[orderId]": orderId,
      "customParameters[productName]": productName,
      "customer.givenName": "Customer",
      "customer.surname": "Order", 
      "customer.email": "order@super-digital.com",
      "billing.country": "ZA",
      "shipping.country": "ZA",
    };

    // Generate signature: alphabetical keys, key=value& format
    const sortedKeys = Object.keys(body).sort();
    const sigString = sortedKeys.map(k => `${k}=${body[k]}`).join('&');
    
    // Use Node.js crypto (available in Vercel serverless)
    const { createHmac } = await import('crypto');
    const signature = createHmac('sha256', SECRET_KEY).update(sigString).digest('hex');
    
    body.signature = signature;

    console.log("🔐 Signature:", signature.substring(0, 20) + '...');
    console.log("📦 Body keys:", sortedKeys);

    // Endpoint from Peach docs
    const endpoint = PEACH_MODE === 'LIVE' 
      ? 'https://secure.peachpayments.com/checkout/initiate'
      : 'https://testsecure.peachpayments.com/checkout/initiate';

    console.log("📡 POST to:", endpoint);

    // Fetch with EXACT headers from Peach example
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Referer': BASE_URL,
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    console.log("📥 Status:", res.status, res.statusText);
    
    const text = await res.text();
    console.log("📥 Raw response:", text.substring(0, 500));
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("❌ JSON parse failed:", e);
      return NextResponse.json({ error: 'Invalid response from Peach', raw: text }, { status: 500 });
    }

    if (!res.ok) {
      console.error("🚫 Peach error:", data);
      return NextResponse.json({ error: 'Payment failed', details: data }, { status: res.status });
    }

    if (data.redirectUrl) {
      console.log("✅ Success! Redirect:", data.redirectUrl);
      return NextResponse.json({ checkoutUrl: data.redirectUrl });
    }

    console.error("❌ No redirectUrl:", data);
    return NextResponse.json({ error: 'No redirectUrl', details: data }, { status: 500 });

  } catch (error: any) {
    console.error("💥 CATCH ERROR:", {
      name: error.name,
      message: error.message,
      cause: error.cause,
      stack: error.stack?.split('\n')[0]
    });
    return NextResponse.json(
      { error: 'Internal server error during checkout creation', details: error.message },
      { status: 503 }
    );
  }
}
