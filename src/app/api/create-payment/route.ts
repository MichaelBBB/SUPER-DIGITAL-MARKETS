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

    console.log("🔑 ENV CHECK:", {
      ENTITY_ID: ENTITY_ID ? "✅" : "❌",
      SECRET_KEY: SECRET_KEY ? "✅ (length: " + SECRET_KEY.length + ")" : "❌",
      BASE_URL: BASE_URL ? "✅" : "❌"
    });

    if (!ENTITY_ID || !SECRET_KEY || !BASE_URL) {
      return NextResponse.json({ error: 'Server configuration missing.' }, { status: 500 });
    }

    const nonce = `UNQ${Date.now()}`;
    
    // Build body WITHOUT signature first (Peach requirement)
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

    // ✅ Generate signature string: alphabetical keys, URL-encoded values
    const sortedKeys = Object.keys(bodyForSigning).sort();
    
    // Try METHOD 1: Simple key=value (no encoding)
    const sigStringSimple = sortedKeys.map(k => `${k}=${bodyForSigning[k]}`).join('&');
    
    // Try METHOD 2: URL-encoded values (common requirement)
    const sigStringEncoded = sortedKeys.map(k => `${k}=${encodeURIComponent(bodyForSigning[k])}`).join('&');
    
    console.log("🔐 Signature string (simple):", sigStringSimple.substring(0, 200) + '...');
    console.log("🔐 Signature string (encoded):", sigStringEncoded.substring(0, 200) + '...');
    
    // Generate both signatures for testing
    const signatureSimple = createHmac('sha256', SECRET_KEY).update(sigStringSimple).digest('hex');
    const signatureEncoded = createHmac('sha256', SECRET_KEY).update(sigStringEncoded).digest('hex');
    
    console.log("✅ Signature (simple):", signatureSimple);
    console.log("✅ Signature (encoded):", signatureEncoded);
    
    // Try simple first, fallback to encoded if needed
    // You can switch this line to test encoded: use signatureEncoded instead
    const signature = signatureSimple;
    
    // Add signature to final body
    const finalBody = { ...bodyForSigning, signature };

    const endpoint = PEACH_MODE === 'LIVE' 
      ? 'https://secure.peachpayments.com/checkout/initiate'
      : 'https://testsecure.peachpayments.com/checkout/initiate';

    console.log("📡 POST to:", endpoint);
    console.log("📦 Final body keys:", Object.keys(finalBody).sort());

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
    console.log("📥 Response:", text.substring(0, 500));
    
    let data;
    try { data = JSON.parse(text); } 
    catch (e) { 
      return NextResponse.json({ error: 'Invalid JSON response', raw: text.substring(0, 200) }, { status: 500 }); 
    }

    if (!res.ok) {
      console.error("🚫 Peach Error:", JSON.stringify(data, null, 2));
      return NextResponse.json({ error: 'Payment initiation failed', peachResponse: data }, { status: res.status });
    }

    if (data.redirectUrl) {
      console.log("✅ SUCCESS! Redirect:", data.redirectUrl);
      return NextResponse.json({ checkoutUrl: data.redirectUrl });
    }

    return NextResponse.json({ error: 'No redirectUrl', details: data }, { status: 500 });

  } catch (error: any) {
    console.error("💥 CRITICAL ERROR:", {
      name: error.name,
      message: error.message,
      cause: error.cause?.message || error.cause
    });
    return NextResponse.json({ error: 'Payment system error', details: error.message }, { status: 503 });
  }
}
