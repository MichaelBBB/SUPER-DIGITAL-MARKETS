import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, currency, productName, orderId } = await request.json();

    // ⚠️ Ensure these are set in your Vercel Environment Variables
    const MERCHANT_ID = process.env.PEACH_MERCHANT_ID;
    const SECRET_KEY = process.env.PEACH_SECRET_KEY;
    const ENTITY_ID = process.env.PEACH_ENTITY_ID;
    const BASE_URL = process.env.NEXT_PUBLIC_URL || 'https://super-digital-markets-co9n.vercel.app';
    const WHATSAPP_NUMBER = process.env.YOUR_WHATSAPP_NUMBER;

    if (!MERCHANT_ID || !SECRET_KEY || !ENTITY_ID) {
      return NextResponse.json(
        { error: 'Server configuration missing. Check Environment Variables.' },
        { status: 500 }
      );
    }

    // Prepare Peach Payload - Explicitly typed as Record<string, string>
    const payloadData: Record<string, string> = {
      entity_id: ENTITY_ID,
      merchant_id: MERCHANT_ID,
      amount: amount.toString(),
      currency: currency,
      paymentType: 'DB', // DB = Debit (Card), PA = Payment Account (Instant EFT)
      transactionMode: 'LIVE', // Change to 'TEST' if you haven't gone live yet
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

    // Determine API Endpoint (Test vs Live)
    const apiEndpoint = process.env.NEXT_PUBLIC_PEACH_MODE === 'LIVE' 
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

    // Peach returns the checkout ID in 'id' field
    return NextResponse.json({ checkoutUrl: data.id });

  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json(
      { error: 'System error during payment setup' },
      { status: 500 }
    );
  }
}
