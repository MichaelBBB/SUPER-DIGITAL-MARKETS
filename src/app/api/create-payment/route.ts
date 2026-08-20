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
      return NextResponse.json({ error: 'Server configuration missing.' }, { status: 500 });
    }

    const nonce = `UNQ${Date.now()}${Math.floor(Math.random() * 1000000)}`;
    
    // Build body WITHOUT signature first
    const bodyForSigning: Record<string, any> = {
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

    // ✅ CRITICAL: Generate signature on body WITHOUT signature field
    const sortedKeys = Object.keys(bodyForSigning).sort();
    const sigString = sortedKeys.map(k => `${k}=${bodyForSigning[k]}`).join('&');
    
    console.log("🔐 Signature string:", sigString.substring(0, 100) + '...');
    
    const signature = createHmac('sha256', SECRET_KEY).update(sigString).digest('hex');
    console.log("✅ Generated signature:", signature);

    // NOW add signature to the final body
    const finalBody = { ...bodyForSigning, signature };

    const endpoint = PEACH_MODE === 'LIVE' 
      ? 'https://secure.peachpayments.com/checkout/initiate'
      : 'https://testsecure.peachpayments.com/checkout/initiate';

    console.log("📡 POST to:", endpoint);

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Referer': BASE_URL,
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify(finalBody)
    });

    const text = await res.text();
    console.log("📥 Status:", res.status);
    console.log("📥 Response:", text.substring(0, 300));
    
    let data;
    try { data = JSON.parse(text); } 
    catch (e) { 
      return NextResponse.json({ error: 'Invalid JSON response', raw: text.substring(0, 200) }, { status: 500 }); 
    }

    if (!res.ok) {
      console.error("🚫 Peach Error:", data);
      return NextResponse.json({ error: 'Payment initiation failed', peachResponse: data }, { status: res.status });
    }

    if (data.redirectUrl) {
      console.log("✅ Redirect:", data.redirectUrl);
      return NextResponse.json({ checkoutUrl: data.redirectUrl });
    }

    return NextResponse.json({ error: 'No redirectUrl', details: data }, { status: 500 });

  } catch (error: any) {
    console.error("💥 ERROR:", error.message);
    return NextResponse.json({ error: 'Payment system error', details: error.message }, { status: 503 });
  }
}
