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

    // 1. PREPARE PARAMETERS (Exactly as per official Peach documentation)
    // MUST include notificationUrl (even if empty) and sort alphabetically
    const params: Record<string, string> = {
      "amount": parseFloat(amount).toFixed(2),
      "authentication.entityId": ENTITY_ID,
      "billing.country": "ZA",
      "currency": currency.toUpperCase(),
      "customer.email": "customer@example.com",
      "customer.givenName": "Customer",
      "customer.surname": "Order",
      "defaultPaymentMethod": "CARD",
      "merchantTransactionId": orderId,
      "nonce": `UNQ${Date.now()}`,
      "notificationUrl": `${cleanBaseUrl}/api/webhook/peach`, // MUST be in signature
      "paymentType": "DB",
      "shopperResultUrl": `${cleanBaseUrl}/success`,
    };

    // 2. GENERATE SIGNATURE STRING (Exactly like Python example)
    // Sort keys alphabetically and concatenate key+value without separators
    const sortedKeys = Object.keys(params).sort();
    let sigString = "";
    for (const key of sortedKeys) {
      sigString += key + params[key];
    }

    console.log("🔐 Signature String:", sigString);

    // 3. CALCULATE HMAC-SHA256 (Using secret token as key)
    const signature = createHmac('sha256', SECRET_KEY)
      .update(sigString, 'utf8')
      .digest('hex');

    console.log("✅ Generated Signature:", signature);

    // 4. BUILD FORM DATA BODY
    const formData = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      formData.append(key, value);
    }
    formData.append('signature', signature);

    // 5. SEND TO LIVE ENDPOINT (Per documentation)
    const res = await fetch('https://secure.peachpayments.com/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': cleanBaseUrl,
        'Accept': 'application/json'
      },
      body: formData.toString()
    });

    const text = await res.text();
    console.log("📥 Peach Response Status:", res.status);
    console.log("📥 Peach Response Body:", text.substring(0, 500));
    
    let data;
    try { 
      data = JSON.parse(text); 
    } catch (e) { 
      return NextResponse.json({ error: 'Invalid JSON response', raw: text.substring(0, 500) }, { status: 500 }); 
    }

    if (!res.ok) {
      console.error("🚫 Peach API Error:", data);
      return NextResponse.json({ error: data.message || 'Payment initiation failed', details: data }, { status: res.status });
    }

    // 6. HANDLE SUCCESSFUL RESPONSE
    if (data.redirectUrl && data.redirectUrl !== "") {
      return NextResponse.json({ checkoutUrl: data.redirectUrl });
    } else if (data.checkoutId) {
      return NextResponse.json({ checkoutUrl: `https://secure.peachpayments.com/checkout?checkoutId=${data.checkoutId}` });
    } else {
      console.error("❓ UNKNOWN RESPONSE FORMAT:", data);
      return NextResponse.json({ error: 'No checkout URL or checkoutId in response', details: data }, { status: 500 });
    }

  } catch (error: any) {
    console.error("💥 SYSTEM ERROR:", error);
    return NextResponse.json({ error: 'System error', details: error.message }, { status: 503 });
  }
}
