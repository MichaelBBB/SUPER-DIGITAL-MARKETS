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

    // Clean Base URL
    const cleanBaseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

    // 1. PREPARE PARAMETERS EXACTLY AS PER PYTHON EXAMPLE
    // Include ALL parameters that will be sent in the form body
    const params: Record<string, string> = {
      "amount": parseFloat(amount).toFixed(2),
      "authentication.entityId": ENTITY_ID,
      "currency": currency.toUpperCase(),
      "merchantTransactionId": orderId,
      "nonce": `UNQ${Date.now()}`,
      "paymentType": "DB",
      "shopperResultUrl": `${cleanBaseUrl}/success`,
      // Optional but recommended fields (must be included in signature if sent)
      "merchantInvoiceId": orderId,
      "cancelUrl": `${cleanBaseUrl}/payment?cancelled=true`,
      "notificationUrl": `${cleanBaseUrl}/api/webhook`,
      "customParameters[orderId]": orderId,
      "customParameters[productName]": productName,
      "customer.givenName": "Customer",
      "customer.surname": "Order",
      "customer.email": "order@super-digital.com",
      "billing.country": "ZA",
      "shipping.country": "ZA",
    };

    // 2. GENERATE SIGNATURE STRING (Alphabetical, Key+Value, No Separators)
    // This matches the Python: "".join([str(key) + str(value) for key in sorted(params)])
    const sortedKeys = Object.keys(params).sort();
    let sigString = "";
    for (const key of sortedKeys) {
      sigString += key + params[key];
    }

    console.log("🔐 Signature String:", sigString.substring(0, 100) + "...");

    // 3. CALCULATE HMAC-SHA256
    const signature = createHmac('sha256', SECRET_KEY).update(sigString, 'utf8').digest('hex');
    console.log("✅ Generated Signature:", signature);

    // 4. BUILD FORM DATA BODY (URL Encoded)
    const formData = new URLSearchParams();
    
    // Add all signed parameters
    for (const [key, value] of Object.entries(params)) {
      formData.append(key, value);
    }
    
    // Add the signature itself
    formData.append('signature', signature);

    // 5. SEND REQUEST TO LIVE ENDPOINT
    // Per docs: Live endpoint is https://secure.peachpayments.com/checkout
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
    let data;
    try { data = JSON.parse(text); } catch (e) { 
      return NextResponse.json({ error: 'Invalid response', raw: text.substring(0, 200) }, { status: 500 }); 
    }

    if (!res.ok) {
      console.error("🚫 API Error:", data);
      return NextResponse.json({ error: 'Payment initiation failed', details: data }, { status: res.status });
    }

    // Hosted Checkout returns redirectUrl or id depending on version
    if (data.redirectUrl || data.id) {
      const checkoutUrl = data.redirectUrl || `https://secure.peachpayments.com/checkout/${data.id}`;
      return NextResponse.json({ checkoutUrl });
    }

    return NextResponse.json({ error: 'No checkout URL in response', details: data }, { status: 500 });

  } catch (error: any) {
    console.error("💥 System Error:", error);
    return NextResponse.json({ error: 'System error', details: error.message }, { status: 503 });
  }
}
