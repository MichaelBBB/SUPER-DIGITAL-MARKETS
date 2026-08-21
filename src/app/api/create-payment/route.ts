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
    const nonce = `UNQ${Date.now()}`;

    // 🚨 CRITICAL: Match Peach's cURL example exactly.
    // They send notificationUrl and cancelUrl as EMPTY strings.
    // We will do the same to ensure the signature matches.
    const allParams: Record<string, string> = {
      "amount": amount.toFixed(2),
      "authentication.entityId": ENTITY_ID,
      "cancelUrl": "",                  // EMPTY string like Peach's example
      "currency": currency.toUpperCase(),
      "merchantInvoiceId": orderId,     // Included as per standard practice
      "merchantTransactionId": orderId,
      "notificationUrl": "",            // EMPTY string like Peach's example
      "nonce": nonce,
      "paymentType": "DB",
      "shopperResultUrl": shopperResultUrl,
      // Custom parameters are tricky. If not in the example, exclude from signature 
      // OR ensure they are formatted exactly as sent. 
      // For safety, let's exclude customParameters from signature for now 
      // and only send them in the body if needed, OR include them if strictly required.
      // Given the repeated failures, let's stick to the CORE fields + empty optional ones first.
      // If customParameters are required in signature, they must be added here.
      // Let's add them as per standard requirement but ensure format is correct.
      "customParameters[orderId]": orderId,
      "customParameters[productName]": productName,
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

    // Build Form Data Body
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
      console.error("🚫 Peach Error:", text);
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
