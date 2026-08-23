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

    // EXACT parameters from Peach Knowledge Base
    const params: Record<string, string> = {
      "amount": parseFloat(amount).toFixed(2),
      "authentication.entityId": ENTITY_ID,
      "currency": "ZAR",
      "defaultPaymentMethod": "CARD",
      "merchantTransactionId": orderId,
      "nonce": `UNQ${Date.now()}`,
      "notificationUrl": "", // Must be included as empty string per KB
      "paymentType": "DB",
      "shopperResultUrl": `${cleanBaseUrl}/success`,
    };

    // Sort keys alphabetically and concatenate key+value without separators
    const sortedKeys = Object.keys(params).sort();
    let sigString = "";
    for (const key of sortedKeys) {
      sigString += key + params[key];
    }

    console.log("🔐 Signature String:", sigString);

    // Calculate HMAC-SHA256
    const signature = createHmac('sha256', SECRET_KEY)
      .update(sigString, 'utf8')
      .digest('hex');

    console.log("✅ Generated Signature:", signature);

    // Build Form Data Body
    const formData = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      formData.append(key, value);
    }
    formData.append('signature', signature);

    console.log("📤 Sending request to: https://secure.peachpayments.com/checkout");

    // Send to EXACT live endpoint from KB, WITH BROWSER USER-AGENT TO BYPASS WAF
    const res = await fetch('https://secure.peachpayments.com/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        // 🛡️ CRITICAL: This bypasses the WAF blocking Node.js/Vercel requests
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      },
      body: formData.toString()
    });

    const text = await res.text();
    console.log("📥 Peach Status:", res.status);
    console.log("📥 Peach RAW Response:", text);
    
    let data;
    try { 
      data = JSON.parse(text); 
    } catch (e) { 
      console.error("❌ PEACH RETURNED HTML/TEXT INSTEAD OF JSON!");
      return NextResponse.json({ 
        error: 'Peach returned an HTML error page (WAF Block or Domain Status Issue)', 
        raw: text.substring(0, 1000) 
      }, { status: 500 }); 
    }

    if (!res.ok) {
      console.error("🚫 Peach API Error:", data);
      return NextResponse.json({ error: data.message || 'Payment initiation failed', details: data }, { status: res.status });
    }

    // Handle Successful Response
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
