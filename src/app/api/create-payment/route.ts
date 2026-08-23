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

    // EXACT parameters from the official Peach Knowledge Base
    const params: Record<string, string> = {
      "amount": parseFloat(amount).toFixed(2),
      "authentication.entityId": ENTITY_ID,
      "currency": "ZAR",
      "defaultPaymentMethod": "CARD",
      "merchantTransactionId": orderId,
      "nonce": `UNQ${Date.now()}`,
      "notificationUrl": "",
      "paymentType": "DB",
      "shopperResultUrl": `${cleanBaseUrl}/success`,
    };

    // Sort keys alphabetically and concatenate key+value without separators
    const sortedKeys = Object.keys(params).sort();
    let sigString = "";
    for (const key of sortedKeys) {
      sigString += key + params[key];
    }

    // Calculate HMAC-SHA256
    const signature = createHmac('sha256', SECRET_KEY).update(sigString, 'utf8').digest('hex');

    // Build Form Data Body
    const formData = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      formData.append(key, value);
    }
    formData.append('signature', signature);

    // Send to Live Endpoint
    const res = await fetch('https://secure.peachpayments.com/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: formData.toString()
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.message || 'Payment initiation failed', details: data }, { status: res.status });
    }

    // Handle Successful Response (This is what worked before)
    if (data.redirectUrl) {
      return NextResponse.json({ checkoutUrl: data.redirectUrl });
    } else if (data.checkoutId) {
      return NextResponse.json({ checkoutUrl: `https://secure.peachpayments.com/checkout?checkoutId=${data.checkoutId}` });
    } else {
      return NextResponse.json({ error: 'No checkout URL in response', details: data }, { status: 500 });
    }

  } catch (error: any) {
    return NextResponse.json({ error: 'System error', details: error.message }, { status: 503 });
  }
}
