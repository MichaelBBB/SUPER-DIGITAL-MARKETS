// src/app/api/create-payment/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, currency, productName, orderId } = await request.json();

    // Get Environment Variables
    const ENTITY_ID = process.env.PEACH_ENTITY_ID?.trim();
    const SECRET_KEY = process.env.PEACH_SECRET_KEY?.trim();
    const BASE_URL = process.env.NEXT_PUBLIC_URL?.trim();

    if (!ENTITY_ID || !SECRET_KEY || !BASE_URL) {
      return NextResponse.json({ error: 'Server configuration missing.' }, { status: 500 });
    }

    // Clean Base URL
    const cleanBaseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

    // Prepare V2 Payload (JSON Format - NO SIGNATURE REQUIRED)
    const payload = {
      authentication: {
        entityId: ENTITY_ID,
      },
      merchantTransactionId: orderId,
      amount: parseFloat(amount).toFixed(2),
      currency: currency.toUpperCase(),
      paymentType: "DB",
      nonce: `UNQ${Date.now()}`,
      shopperResultUrl: `${cleanBaseUrl}/success`,
      merchantInvoiceId: orderId,
      cancelUrl: `${cleanBaseUrl}/payment?cancelled=true`,
      notificationUrl: `${cleanBaseUrl}/api/webhook`,
      customParameters: {
        orderId: orderId,
        productName: productName,
      },
      customer: {
        givenName: "Customer",
        surname: "Order",
        email: "order@super-digital.com",
      },
      billing: {
        country: "ZA",
      },
      shipping: {
        country: "ZA",
      },
    };

    console.log("🚀 Sending V2 Request...");

    // Send Request to V2 Endpoint
    const res = await fetch('https://secure.peachpayments.com/v2/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SECRET_KEY}`,
        'Referer': cleanBaseUrl,
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("❌ Invalid JSON response:", text);
      return NextResponse.json({ error: 'Invalid response from Peach', raw: text.substring(0, 200) }, { status: 500 });
    }

    if (!res.ok) {
      console.error("🚫 V2 API Error:", data);
      return NextResponse.json({ 
        error: 'Payment initiation failed', 
        details: data 
      }, { status: res.status });
    }

    // V2 returns a redirectUrl directly in the response
    if (data.redirectUrl) {
      console.log("✅ SUCCESS! Redirect:", data.redirectUrl);
      return NextResponse.json({ checkoutUrl: data.redirectUrl });
    }

    return NextResponse.json({ error: 'No redirectUrl in response', details: data }, { status: 500 });

  } catch (error: any) {
    console.error("💥 CRITICAL ERROR:", error.message);
    return NextResponse.json({ error: 'System error during checkout creation', details: error.message }, { status: 503 });
  }
}
