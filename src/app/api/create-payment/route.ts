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
      return NextResponse.json({ error: 'Missing Environment Variables' }, { status: 500 });
    }

    // 1. PREPARE PARAMETERS (Exactly 7 fields, Alphabetical Order)
    const nonce = `UNQ${Date.now()}`;
    const shopperResultUrl = `${BASE_URL}/success`; // Simple URL, no query params in signature

    const params: Record<string, string> = {
      "amount": amount.toFixed(2),
      "authentication.entityId": ENTITY_ID,
      "currency": currency.toUpperCase(),
      "merchantTransactionId": orderId,
      "nonce": nonce,
      "paymentType": "DB",
      "shopperResultUrl": shopperResultUrl,
    };

    // 2. GENERATE SIGNATURE STRING (Key+Value, No Separators)
    const sortedKeys = Object.keys(params).sort();
    let sigString = "";
    for (const key of sortedKeys) {
      sigString += key + params[key];
    }

    // 3. CALCULATE HMAC-SHA256
    const signature = createHmac('sha256', SECRET_KEY).update(sigString, 'utf8').digest('hex');

    console.log(" Signature String:", sigString);
    console.log("✅ Generated Signature:", signature);

    // 4. BUILD FORM DATA BODY (URL Encoded)
    const formData = new URLSearchParams();
    formData.append('authentication.entityId', ENTITY_ID);
    formData.append('signature', signature);
    formData.append('merchantTransactionId', orderId);
    formData.append('amount', amount.toFixed(2));
    formData.append('paymentType', 'DB');
    formData.append('currency', currency.toUpperCase());
    formData.append('nonce', nonce);
    formData.append('shopperResultUrl', shopperResultUrl);
    
    // Optional fields (NOT in signature)
    formData.append('merchantInvoiceId', orderId);
    formData.append('cancelUrl', `${BASE_URL}/payment?cancelled=true`);
    formData.append('notificationUrl', `${BASE_URL}/api/webhook`);
    formData.append('customParameters[orderId]', orderId);
    formData.append('customParameters[productName]', productName);

    // 5. GENERATE AUTHORIZATION HEADER (Critical Fix!)
    // Format: Base64(EntityID | SecretKey)
    const authString = `${ENTITY_ID}|${SECRET_KEY}`;
    const authHeader = Buffer.from(authString).toString('base64');

    // 6. SEND REQUEST
    const endpoint = 'https://secure.peachpayments.com/checkout/initiate';

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Referer': BASE_URL,
        'accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
        // 🚨 CRITICAL: Add the Authorization Header
        'Authorization': `Bearer ${authHeader}`
      },
      body: formData.toString()
    });

    const text = await res.text();

    if (!res.ok) {
      console.error("🚫 Peach Error:", text);
      return NextResponse.json({ 
        error: 'Payment Initiation Failed', 
        peachResponse: text,
        debugAuthHeader: `Bearer ${authHeader}` // Log this to verify
      }, { status: res.status });
    }

    const data = JSON.parse(text);
    
    if (data.redirectUrl) {
      console.log("✅ SUCCESS! Redirect:", data.redirectUrl);
      return NextResponse.json({ checkoutUrl: data.redirectUrl });
    }

    return NextResponse.json({ error: 'No redirectUrl', details: data }, { status: 500 });

  } catch (error: any) {
    console.error("💥 CRITICAL ERROR:", error.message);
    return NextResponse.json({ error: 'System Error', details: error.message }, { status: 503 });
  }
}
