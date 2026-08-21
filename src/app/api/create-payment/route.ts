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
      return NextResponse.json({ error: 'Missing Env Vars' }, { status: 500 });
    }

    // Clean URL
    const cleanBaseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    const shopperResultUrl = `${cleanBaseUrl}/success`;
    const cancelUrl = `${cleanBaseUrl}/payment?cancelled=true`;
    const notificationUrl = `${cleanBaseUrl}/api/webhook`;
    const nonce = `UNQ${Date.now()}`;

    // 🚨 CRITICAL: Include ALL parameters that will be sent in the body, even empty ones or optional ones.
    // This matches Peach's requirement: "Include all payment parameters... sorted alphabetically".
    const allParams: Record<string, string> = {
      "amount": amount.toFixed(2),
      "authentication.entityId": ENTITY_ID,
      "cancelUrl": cancelUrl,              // Included in signature
      "currency": currency.toUpperCase(),
      "customParameters[orderId]": orderId, // Included in signature
      "customParameters[productName]": productName, // Included in signature
      "merchantInvoiceId": orderId,         // Included in signature
      "merchantTransactionId": orderId,
      "notificationUrl": notificationUrl,   // Included in signature (Peach example includes this)
      "nonce": nonce,
      "paymentType": "DB",
      "shopperResultUrl": shopperResultUrl,
    };

    // Generate Signature String: Alphabetical keys, key+value concatenation
    const sortedKeys = Object.keys(allParams).sort();
    let sigString = "";
    for (const key of sortedKeys) {
      sigString += key + allParams[key];
    }

    console.log("🔍 DEBUG SigString:", sigString);
    
    // Calculate HMAC-SHA256
    const signature = createHmac('sha256', SECRET_KEY).update(sigString, 'utf8').digest('hex');
    console.log("✅ Generated Signature:", signature);

    // Build Form Data Body (Must match the params used in signature exactly)
    const formData = new URLSearchParams();
    for (const [key, value] of Object.entries(allParams)) {
      formData.append(key, value);
    }
    formData.append('signature', signature);

    // Send Request
    const endpoint = 'https://secure.peachpayments.com/checkout/initiate';

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Referer': cleanBaseUrl,
        'accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    const text = await res.text();

    if (!res.ok) {
      console.error(" Peach Error:", text);
      return NextResponse.json({ 
        error: 'Payment Initiation Failed', 
        peachMessage: text,
        debugSigString: sigString 
      }, { status: res.status });
    }

    const data = JSON.parse(text);
    
    if (data.redirectUrl) {
      return NextResponse.json({ checkoutUrl: data.redirectUrl });
    }

    return NextResponse.json({ error: 'No redirectUrl', details: data }, { status: 500 });

  } catch (error: any) {
    console.error("💥 System Error:", error);
    return NextResponse.json({ error: 'System Error', details: error.message }, { status: 503 });
  }
}
