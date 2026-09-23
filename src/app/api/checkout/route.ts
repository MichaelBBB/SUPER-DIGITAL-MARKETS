// app/api/checkout/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { orderId, amountUSD, customerPhone } = await req.json();

    // 1. Convert USD to ZAR (Using a mock rate for this example, replace with live API call)
    // In production, fetch this from an API like ExchangeRate-API or OpenExchangeRates
    const usdToZarRate = 18.50; 
    const amountZAR = (amountUSD * usdToZarRate).toFixed(2);
    
    // Peach Payments requires the amount in the smallest currency unit (cents)
    const amountInCents = Math.round(parseFloat(amountZAR) * 100).toString();

    // 2. Prepare Peach Payments Payload
    const params = new URLSearchParams();
    params.append('entityId', process.env.PEACH_PAYMENTS_ENTITY_ID!);
    params.append('amount', amountInCents);
    params.append('currency', 'ZAR'); // Must be ZAR for local Capitec settlement
    params.append('paymentType', 'DB'); // DB = Debit (Standard purchase)
    params.append('merchantTransactionId', orderId);
    params.append('customParameters[merchant_customer_phone]', customerPhone);

    // 3. Call Peach Payments API
    const peachResponse = await fetch(`${process.env.PEACH_PAYMENTS_BASE_URL}/checkouts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PEACH_PAYMENTS_ACCESS_TOKEN}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!peachResponse.ok) {
      const errorText = await peachResponse.text();
      console.error('Peach Payments Error:', errorText);
      return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
    }

    const peachData = await peachResponse.json();
    
    // peachData.redirectUrl contains the secure link to send to the customer
    return NextResponse.json({ 
      success: true, 
      paymentLink: peachData.redirectUrl,
      checkoutId: peachData.id 
    });

  } catch (error) {
    console.error('Checkout API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
