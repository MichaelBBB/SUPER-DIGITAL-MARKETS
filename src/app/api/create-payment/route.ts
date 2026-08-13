// src/app/api/create-payment/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, currency, productName, orderId } = await request.json();

    // 🔍 DEBUG: Log which variables are present
    console.log("🔑 Checking Environment Variables:");
    
    const MERCHANT_ID = process.env.PEACH_MERCHANT_ID;
    const SECRET_KEY = process.env.PEACH_SECRET_KEY;
    const ENTITY_ID = process.env.PEACH_ENTITY_ID;
    const BASE_URL = process.env.NEXT_PUBLIC_URL;
    const WHATSAPP_NUMBER = process.env.YOUR_WHATSAPP_NUMBER;
    const PEACH_MODE = process.env.NEXT_PUBLIC_PEACH_MODE;

    console.log("- Mode:", PEACH_MODE);
    console.log("- Entity ID:", ENTITY_ID ? "✅ Present" : "❌ Missing");

    if (!MERCHANT_ID || !SECRET_KEY || !ENTITY_ID || !BASE_URL) {
      return NextResponse.json({ error: 'Server configuration missing.' }, { status: 500 });
    }

    // Prepare Peach Payload
    const payloadData: Record<string, string> = {
      entity_id: ENTITY_ID,
      merchant_id: MERCHANT_ID,
      amount: amount.toString(),
      currency: currency.toUpperCase(),
      paymentType: 'DB',
      transactionMode: PEACH_MODE === 'LIVE' ? 'LIVE' : 'TEST',
      billingMode: 'B2C',
      resultUrl: `${BASE_URL}/payment/success`,
      errorUrl: `${BASE_URL}/payment/fail`,
      shopper_resultUrl: `${BASE_URL}/payment/success`,
      custom_parameters: JSON.stringify({
        orderId: orderId,
        productName: productName,
        whatsappNumber: WHATSAPP_NUMBER
      })
    };

    const payload = new URLSearchParams(payloadData);

    // Determine API Endpoint - CRITICAL FIX
    // If LIVE, use the standard global endpoint. If TEST, use eu-test.
    let apiEndpoint = '';
    if (PEACH_MODE === 'LIVE') {
      apiEndpoint = 'https://api.peachpayments.com/v1/checkouts';
    } else {
      apiEndpoint = 'https://eu-test.peachpayments.com/v1/checkouts';
    }

    console.log("📡 Sending request to:", apiEndpoint);

    let response;
    try {
      response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: payload
      });
    } catch (fetchError: any) {
      console.error('🚨 Network Fetch Error:', fetchError.message);
      console.error(' Error Cause:', fetchError.cause);
      return NextResponse.json(
        { error: 'Network error connecting to Peach Payments', details: fetchError.message },
        { status: 503 }
      );
    }

    let data;
    try {
      data = await response.json();
    } catch (jsonError: any) {
      console.error('JSON Parse Error:', jsonError.message);
      return NextResponse.json(
        { error: 'Invalid response from Peach Payments', details: jsonError.message },
        { status: 500 }
      );
    }

    console.log("📥 Response Status:", response.status);
    console.log("📥 Response Data:", data);

    if (!response.ok) {
      console.error('Peach API Error:', data);
      return NextResponse.json(
        { error: 'Payment initiation failed', details: data },
        { status: response.status }
      );
    }

    return NextResponse.json({ checkoutUrl: data.id });

  } catch (error: any) {
    console.error('💀 CRITICAL SERVER ERROR:', error);
    return NextResponse.json(
      { error: 'System error during payment setup', details: error.message },
      { status: 500 }
    );
  }
}
