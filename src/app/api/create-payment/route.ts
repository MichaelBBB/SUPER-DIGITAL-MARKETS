// src/app/api/create-payment/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, currency, productName, orderId } = await request.json();

    // 🔍 DEBUG: Check which variables are present
    const MERCHANT_ID = process.env.PEACH_MERCHANT_ID;
    const SECRET_KEY = process.env.PEACH_SECRET_KEY;
    const ENTITY_ID = process.env.PEACH_ENTITY_ID;
    const BASE_URL = process.env.NEXT_PUBLIC_URL;
    const WHATSAPP_NUMBER = process.env.YOUR_WHATSAPP_NUMBER;
    const PEACH_MODE = process.env.NEXT_PUBLIC_PEACH_MODE;

    console.log("🔑 Debugging Env Vars:");
    console.log("- PEACH_MERCHANT_ID:", !!MERCHANT_ID ? "✅ Found" : "❌ Missing");
    console.log("- PEACH_SECRET_KEY:", !!SECRET_KEY ? "✅ Found" : "❌ Missing");
    console.log("- PEACH_ENTITY_ID:", !!ENTITY_ID ? "✅ Found" : "❌ Missing");
    console.log("- NEXT_PUBLIC_URL:", !!BASE_URL ? "✅ Found" : "❌ Missing");
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

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: payload
    });

    const data = await response.json();

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
      { error: 'System error during payment setup' },
      { status: 500 }
    );
  }
}
