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

    console.log("- PEACH_MERCHANT_ID:", !!MERCHANT_ID ? "✅ Present" : " Missing");
    console.log("- PEACH_SECRET_KEY:", !!SECRET_KEY ? "✅ Present" : " Missing");
    console.log("- PEACH_ENTITY_ID:", !!ENTITY_ID ? "✅ Present" : " Missing");
    console.log("- NEXT_PUBLIC_URL:", !!BASE_URL ? "✅ Present" : "❌ Missing");
    console.log("- PEACH_MODE:", PEACH_MODE);

    // If any critical key is missing, return a specific error
    if (!MERCHANT_ID || !SECRET_KEY || !ENTITY_ID || !BASE_URL) {
      return NextResponse.json(
        { 
          error: 'Server configuration missing.',
          debug: {
            hasMerchantId: !!MERCHANT_ID,
            hasSecretKey: !!SECRET_KEY,
            hasEntityId: !!ENTITY_ID,
            hasBaseUrl: !!BASE_URL
          }
        },
        { status: 500 }
      );
    }

    // Validate input data
    if (!amount || !currency || !productName || !orderId) {
      return NextResponse.json(
        { error: 'Missing required payment details.' },
        { status: 400 }
      );
    }

    // Prepare Peach Payload
    const payloadData: Record<string, string> = {
      entity_id: ENTITY_ID,
      merchant_id: MERCHANT_ID,
      amount: amount.toString(),
      currency: currency,
      paymentType: 'DB', // Debit (Card)
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

    // Determine API Endpoint
    const apiEndpoint = PEACH_MODE === 'LIVE' 
      ? 'https://api.peachpayments.com/v1/checkouts' 
      : 'https://eu-test.peachpayments.com/v1/checkouts';

    console.log("📡 Sending request to Peach API...");
    console.log("- Endpoint:", apiEndpoint);
    console.log("- Payload Keys:", Array.from(payload.keys()).join(', '));

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: payload
    });

    const data = await response.json();

    console.log("📥 Response from Peach:", data);

    if (!response.ok) {
      console.error('Peach API Error:', data);
      return NextResponse.json(
        { error: 'Payment initiation failed', details: data },
        { status: response.status }
      );
    }

    return NextResponse.json({ checkoutUrl: data.id });

  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json(
      { error: 'System error during payment setup', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
