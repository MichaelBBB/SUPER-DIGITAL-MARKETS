// src/app/api/create-payment/route.ts
import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';

export async function POST(request: Request) {
  try {
    const { amount, currency, productName, orderId } = await request.json();

    // 1. CLEAN CREDENTIALS & URL
    let ENTITY_ID = process.env.PEACH_ENTITY_ID?.trim() || '';
    let SECRET_KEY = process.env.PEACH_SECRET_KEY?.trim() || '';
    let BASE_URL = process.env.NEXT_PUBLIC_URL?.trim() || '';

    // CRITICAL FIX: Remove trailing slash from BASE_URL to prevent double slashes in URL
    if (BASE_URL.endsWith('/')) {
      BASE_URL = BASE_URL.slice(0, -1);
    }

    if (!ENTITY_ID || !SECRET_KEY || !BASE_URL) {
      return NextResponse.json({ error: 'Missing Env Vars' }, { status: 500 });
    }

    // 2. DEFINE SIMPLE SUCCESS URL (No query params for signature!)
    const successPath = '/success';
    const shopperResultUrl = `${BASE_URL}${successPath}`;

    const nonce = `UNQ${Date.now()}`;

    // 3. PREPARE PARAMETERS (Exactly 7 fields, Alphabetical Order)
    // These values will be used for BOTH the signature string AND the form body
    const params: Record<string, string> = {
      "amount": amount.toFixed(2),
      "authentication.entityId": ENTITY_ID,
      "currency": currency.toUpperCase(),
      "merchantTransactionId": orderId,
      "nonce": nonce,
      "paymentType": "DB",
      "shopperResultUrl": shopperResultUrl, 
    };

    // 4. GENERATE SIGNATURE STRING
    // Sort keys alphabetically -> Concatenate key+value (NO separators)
    const sortedKeys = Object.keys(params).sort();
    let sigString = "";
    for (const key of sortedKeys) {
      sigString += key + params[key];
    }

    // Calculate HMAC-SHA256
    const signature = createHmac('sha256', SECRET_KEY).update(sigString, 'utf8').digest('hex');

    console.log("🔍 DEBUG SigString:", sigString);
    console.log("🔍 DEBUG Signature:", signature);
    console.log(" DEBUG ShopperURL Used:", shopperResultUrl);

    // 5. BUILD FORM DATA BODY
    // We MUST use the EXACT same values as in the signature calculation
    const formData = new URLSearchParams();
    
    // Add the 7 signed fields
    formData.append('amount', params['amount']);
    formData.append('authentication.entityId', params['authentication.entityId']);
    formData.append('currency', params['currency']);
    formData.append('merchantTransactionId', params['merchantTransactionId']);
    formData.append('nonce', params['nonce']);
    formData.append('paymentType', params['paymentType']);
    formData.append('shopperResultUrl', params['shopperResultUrl']); // Must match signature exactly
    
    // Add the calculated signature
    formData.append('signature', signature);

    // Add Optional Fields (NOT part of signature)
    formData.append('merchantInvoiceId', orderId);
    formData.append('cancelUrl', `${BASE_URL}/payment?cancelled=true`);
    formData.append('notificationUrl', `${BASE_URL}/api/webhook`);
    formData.append('customParameters[orderId]', orderId);
    formData.append('customParameters[productName]', productName);

    // 6. SEND REQUEST
    const endpoint = 'https://secure.peachpayments.com/checkout/initiate';

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Referer': BASE_URL,
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
        debugSigString: sigString, // Send this to Peach if it fails again
        debugShopperUrl: shopperResultUrl
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
