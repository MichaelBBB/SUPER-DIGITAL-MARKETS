import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, currency, productName, orderId } = await request.json();

    // ⚠️ REPLACE WITH YOUR PEACH PRODUCTION CREDENTIALS
    const MERCHANT_ID = process.env.PEACH_MERCHANT_ID; 
    const SECRET_KEY = process.env.PEACH_SECRET_KEY;
    const ENTITY_ID = process.env.PEACH_ENTITY_ID;

    // Prepare Peach Payload
    const payload = new URLSearchParams({
      entity_id: ENTITY_ID,
      merchant_id: MERCHANT_ID,
      amount: amount.toString(),
      currency: currency,
      paymentType: 'DB', // Debit (Card) or 'PA' for Instant EFT
      transactionMode: 'LIVE', // Change to 'TEST' if still testing
      billingMode: 'B2C',
      resultUrl: `${process.env.NEXT_PUBLIC_URL}/payment/success`, // Where they go after paying
      errorUrl: `${process.env.NEXT_PUBLIC_URL}/payment/fail`,
      shopper_resultUrl: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
      custom_parameters: JSON.stringify({ 
        orderId: orderId, 
        productName: productName,
        whatsappNumber: process.env.YOUR_WHATSAPP_NUMBER 
      })
    });

    // Call Peach API
    const response = await fetch('https://eu-test.peachpayments.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: payload
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message);

    return NextResponse.json({ checkoutUrl: data.id }); // Return ID to frontend
  } catch (error) {
    return NextResponse.json({ error: 'Payment initiation failed' }, { status: 500 });
  }
}
