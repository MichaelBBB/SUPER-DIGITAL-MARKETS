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

    if (!ENTITY_ID || !SECRET_KEY || !BASE_URL) {
      return NextResponse.json({ error: 'Server configuration missing.' }, { status: 500 });
    }

    const nonce = `UNQ${Date.now()}`;
    
    // Build body WITHOUT signature (Peach requirement)
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

    // Generate signature string: alphabetical keys, key=value format
    const sortedKeys = Object.keys(bodyForSigning).sort();
    const sigString = sortedKeys.map(k => `${k}=${bodyForSigning[k]}`).join('&');
    
    // Generate HMAC-SHA256 signature
    const signature = createHmac('sha256', SECRET_KEY).update(sigString).digest('hex');
    
    // LOG EVERYTHING for manual verification
    console.log("=== PEACH SIGNATURE DEBUG ===");
    console.log("Entity ID:", ENTITY_ID);
    console.log("Secret Key Length:", SECRET_KEY.length);
    console.log("Nonce:", nonce);
    console.log("Signature String:", sigString);
    console.log("Generated Signature:", signature);
    console.log("=== END DEBUG ===");
    
    // Add signature to final body
    const finalBody = { ...bodyForSigning, signature };

    const endpoint = PEACH_MODE === 'LIVE' 
      ? 'https://secure.peachpayments.com/checkout/initiate'
      : 'https://testsecure.peachpayments.com/checkout/initiate';

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
    
    if (!res.ok) {
      console.error("Peach Error Response:", text);
      return NextResponse.json({ error: 'Payment initiation failed', peachResponse: JSON.parse(text || '{}') }, { status: res.status });
    }

    const data = JSON.parse(text);
    if (data.redirectUrl) {
      return NextResponse.json({ checkoutUrl: data.redirectUrl });
    }

    return NextResponse.json({ error: 'No redirectUrl', details: data }, { status: 500 });

  } catch (error: any) {
    console.error("Critical Error:", error);
    return NextResponse.json({ error: 'Payment system error', details: error.message }, { status: 503 });
  }
}
