// src/app/api/create-payment/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, currency, productName, orderId } = await request.json();

    const ENTITY_ID = process.env.PEACH_ENTITY_ID?.trim();
    const CLIENT_ID = process.env.PEACH_CLIENT_ID?.trim(); // New env var needed
    const CLIENT_SECRET = process.env.PEACH_CLIENT_SECRET?.trim(); // New env var needed
    const BASE_URL = process.env.NEXT_PUBLIC_URL?.trim();

    if (!ENTITY_ID || !CLIENT_ID || !CLIENT_SECRET || !BASE_URL) {
      return NextResponse.json({ 
        error: 'Missing credentials. Please add PEACH_CLIENT_ID and PEACH_CLIENT_SECRET to Vercel.' 
      }, { status: 500 });
    }

    const cleanBaseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

    // STEP 1: Get OAuth Access Token
    const tokenRes = await fetch('https://api.peachpayments.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: 'checkout'
      }).toString()
    });

    if (!tokenRes.ok) {
      const tokenError = await tokenRes.text();
      console.error(" OAuth Token Failed:", tokenError);
      return NextResponse.json({ 
        error: 'Authentication failed', 
        details: tokenError 
      }, { status: 401 });
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    console.log("✅ OAuth Token Obtained");

    // STEP 2: Create Checkout with Valid Bearer Token
    const payload = {
      authentication: { entityId: ENTITY_ID },
      merchantTransactionId: orderId,
      amount: parseFloat(amount).toFixed(2),
      currency: currency.toUpperCase(),
      paymentType: "DB",
      nonce: `UNQ${Date.now()}`,
      shopperResultUrl: `${cleanBaseUrl}/success`,
      merchantInvoiceId: orderId,
      cancelUrl: `${cleanBaseUrl}/payment?cancelled=true`,
      notificationUrl: `${cleanBaseUrl}/api/webhook`,
      customParameters: { orderId, productName },
      customer: { givenName: "Customer", surname: "Order", email: "order@super-digital.com" },
      billing: { country: "ZA" },
      shipping: { country: "ZA" }
    };

    const res = await fetch('https://secure.peachpayments.com/v2/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Referer': cleanBaseUrl
      },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch (e) { 
      return NextResponse.json({ error: 'Invalid response', raw: text.substring(0, 200) }, { status: 500 }); 
    }

    if (!res.ok) {
      console.error("🚫 V2 Checkout Error:", data);
      return NextResponse.json({ error: 'Payment initiation failed', details: data }, { status: res.status });
    }

    if (data.redirectUrl) {
      return NextResponse.json({ checkoutUrl: data.redirectUrl });
    }

    return NextResponse.json({ error: 'No redirectUrl', details: data }, { status: 500 });

  } catch (error: any) {
    return NextResponse.json({ error: 'System error', details: error.message }, { status: 503 });
  }
}
