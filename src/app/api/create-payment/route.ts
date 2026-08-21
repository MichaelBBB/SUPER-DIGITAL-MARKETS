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

    // 🚨 CRITICAL: Match the Python example EXACTLY.
    // Includes 'defaultPaymentMethod' and 'notificationUrl' as empty string.
    const coreParams: Record<string, string> = {
      "amount": amount.toFixed(2),
      "authentication.entityId": ENTITY_ID,
      "currency": currency.toUpperCase(),
      "defaultPaymentMethod": "CARD",       // <--- ADDED (Required by docs)
      "merchantTransactionId": orderId,
      "nonce": nonce,
      "notificationUrl": "",                // <--- ADDED as empty string (Matches Python example)
      "paymentType": "DB",
      "shopperResultUrl": shopperResultUrl,
    };

    // Generate Signature String: Alphabetical keys, key+value concatenation (NO separators)
    const sortedKeys = Object.keys(coreParams).sort();
    let sigString = "";
    for (const key of sortedKeys) {
      sigString += key + coreParams[key];
    }

    console.log("🔍 DEBUG SigString:", sigString);
    
    // Calculate HMAC-SHA256 using the Secret Key
    const signature = createHmac('sha256', SECRET_KEY).update(sigString, 'utf8').digest('hex');
    console.log("✅ Generated Signature:", signature);

    // Build Form Data Body
    const formData = new URLSearchParams();
    
    // Add the signed core fields
    for (const [key, value] of Object.entries(coreParams)) {
      formData.append(key, value);
    }
    formData.append('signature', signature);

    // Add Optional Fields to BODY ONLY (NOT included in signature)
    // These are sent for functionality but excluded from the hash
    formData.append('merchantInvoiceId', orderId);
    formData.append('cancelUrl', `${cleanBaseUrl}/payment?cancelled=true`);
    formData.append('customParameters[orderId]', orderId);
    formData.append('customParameters[productName]', productName);

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
      console.error(" Peach Error Response:", text);
      return NextResponse.json({ 
        error: 'Payment Initiation Failed', 
        peachMessage: text,
        debugSigString: sigString 
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
