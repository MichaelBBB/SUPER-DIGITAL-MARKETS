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

    // Clean URL to prevent double slashes
    const cleanBaseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    
    const nonce = `UNQ${Date.now()}`;
    const shopperResultUrl = `${cleanBaseUrl}/success`;
    const cancelUrl = `${cleanBaseUrl}/payment?cancelled=true`;
    const notificationUrl = `${cleanBaseUrl}/api/webhook`;

    // 🚨 CRITICAL: Define ALL parameters we will send. 
    // Per Peach Docs: "Include all payment parameters... If you include any other parameters, they must be part of the encrypted message."
    const allParams: Record<string, string> = {
      "amount": amount.toFixed(2),
      "authentication.entityId": ENTITY_ID,
      "cancelUrl": cancelUrl,                  // Included in signature
      "currency": currency.toUpperCase(),
      "customParameters[orderId]": orderId,     // Included in signature
      "customParameters[productName]": productName, // Included in signature
      "merchantInvoiceId": orderId,             // Included in signature
      "merchantTransactionId": orderId,
      "notificationUrl": notificationUrl,       // Included in signature (even if not empty)
      "nonce": nonce,
      "paymentType": "DB",
      "shopperResultUrl": shopperResultUrl,
    };

    // 1. Generate Signature String
    // Sort keys alphabetically -> Concatenate key+value (NO separators, NO spaces)
    const sortedKeys = Object.keys(allParams).sort();
    let sigString = "";
    for (const key of sortedKeys) {
      sigString += key + allParams[key];
    }

    console.log("🔍 DEBUG SigString:", sigString);
    
    // Calculate HMAC-SHA256 using the Secret Key
    const signature = createHmac('sha256', SECRET_KEY).update(sigString, 'utf8').digest('hex');
    console.log("✅ Generated Signature:", signature);

    // 2. Build Form Data Body
    // We must send EXACTLY the same fields used in the signature
    const formData = new URLSearchParams();
    for (const [key, value] of Object.entries(allParams)) {
      formData.append(key, value);
    }
    // Add the calculated signature
    formData.append('signature', signature);

    // 3. Send Request
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
      console.error("🚫 Peach Error Response:", text);
      return NextResponse.json({ 
        error: 'Payment Initiation Failed', 
        peachMessage: text,
        debugSigString: sigString // Send this to Peach if it fails again
      }, { status: res.status });
    }

    const data = JSON.parse(text);
    
    if (data.redirectUrl) {
      console.log("✅ SUCCESS! Redirect URL received.");
      return NextResponse.json({ checkoutUrl: data.redirectUrl });
    }

    return NextResponse.json({ error: 'No redirectUrl', details: data }, { status: 500 });

  } catch (error: any) {
    console.error("💥 System Error:", error);
    return NextResponse.json({ error: 'System Error', details: error.message }, { status: 503 });
  }
}
