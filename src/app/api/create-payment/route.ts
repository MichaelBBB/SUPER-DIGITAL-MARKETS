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

    const params: Record<string, string> = {
      "amount": parseFloat(amount).toFixed(2),
      "authentication.entityId": ENTITY_ID,
      "currency": currency.toUpperCase(),
      "defaultPaymentMethod": "CARD",
      "merchantTransactionId": orderId,
      "nonce": `UNQ${Date.now()}`,
      "paymentType": "DB",
      "shopperResultUrl": `${cleanBaseUrl}/success`,
      "merchantInvoiceId": orderId,
      "cancelUrl": `${cleanBaseUrl}/payment?cancelled=true`,
      "notificationUrl": `${cleanBaseUrl}/api/webhook/peach`,
      "customParameters[orderId]": orderId,
      "customParameters[productName]": productName,
      "customer.givenName": "Customer",
      "customer.surname": "Order",
      "customer.email": "order@super-digital.com",
      "billing.country": "ZA",
      "shipping.country": "ZA",
    };

    const sortedKeys = Object.keys(params).sort();
    let sigString = "";
    for (const key of sortedKeys) {
      sigString += key + params[key];
    }

    const signature = createHmac('sha256', SECRET_KEY).update(sigString, 'utf8').digest('hex');

    const formData = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      formData.append(key, value);
    }
    formData.append('signature', signature);

    const res = await fetch('https://secure.peachpayments.com/checkout/initiate', {
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

    if (data.redirectUrl) {
      return NextResponse.json({ checkoutUrl: data.redirectUrl });
    } else if (data.id) {
      return NextResponse.json({ checkoutUrl: `https://secure.peachpayments.com/checkout/${data.id}` });
    }

    return NextResponse.json({ error: 'No checkout URL in response', details: data }, { status: 500 });

  } catch (error: any) {
    console.error("💥 System Error:", error);
    return NextResponse.json({ error: 'System error', details: error.message }, { status: 503 });
  }
}
