// src/app/api/create-payment/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, currency, productName, orderId } = await request.json();

    const MERCHANT_ID = process.env.PEACH_MERCHANT_ID;
    const SECRET_KEY = process.env.PEACH_SECRET_KEY;
    const ENTITY_ID = process.env.PEACH_ENTITY_ID;
    const BASE_URL = process.env.NEXT_PUBLIC_URL;
    const WHATSAPP_NUMBER = process.env.YOUR_WHATSAPP_NUMBER;
    const PEACH_MODE = process.env.NEXT_PUBLIC_PEACH_MODE;

    if (!MERCHANT_ID || !SECRET_KEY || !ENTITY_ID || !BASE_URL) {
      return NextResponse.json({ error: 'Server configuration missing.' }, { status: 500 });
    }

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

    // 🇿🇦 SOUTH AFRICAN ENDPOINTS (Correct for Capitec/Peach SA)
    const apiEndpoint = PEACH_MODE === 'LIVE' 
      ? 'https://za-api.peachpayments.com/v1/checkouts' 
      : 'https://za-test.peachpayments.com/v1/checkouts';

    console.log("📡 Sending to:", apiEndpoint);

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: payload,
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(10000)
    });

    const data = await response.json();
    console.log("📥 Peach Response:", response.status, data);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Payment failed', details: data },
        { status: response.status }
      );
    }

    return NextResponse.json({ checkoutUrl: data.id });

  } catch (error: any) {
    console.error("💥 ERROR:", error.message);
    return NextResponse.json(
      { error: 'Network error connecting to Peach Payments', details: error.message },
      { status: 503 }
    );
  }
}
