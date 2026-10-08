import { NextResponse } from 'next/server';

// Ensure your environment variables are configured in Vercel
const PEACH_API_URL = process.env.PEACH_API_URL || 'https://oppwa.com/v1/checkouts';
const PEACH_AUTH_TOKEN = process.env.PEACH_AUTH_TOKEN;
const PEACH_ENTITY_ID = process.env.PEACH_ENTITY_ID;

export async function POST(request: Request) {
  try {
    // 1. Parse the request body from your frontend
    const body = await request.json();
    
    // Provide safe defaults so the frontend payload doesn't fail validation
    const amount = body.amount;
    const currency = body.currency || 'USD';
    const merchantTransactionId = body.merchantTransactionId || `INV-${Date.now()}`;

    // Validate incoming data
    if (!amount) {
      return NextResponse.json(
        { error: 'Missing required field: amount' },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!PEACH_AUTH_TOKEN || !PEACH_ENTITY_ID) {
      console.error('Peach Payments environment variables are missing.');
      return NextResponse.json(
        { error: 'Internal server configuration error' },
        { status: 500 }
      );
    }

    // 2. Prepare URL-encoded payload for Peach Payments
    const payload = new URLSearchParams({
      entityId: PEACH_ENTITY_ID,
      amount: parseFloat(amount).toFixed(2), // Peach requires 2 decimal places (e.g., "100.00")
      currency: currency,
      paymentType: 'DB', // DB = Debit, PA = Pre-authorization
      merchantTransactionId: merchantTransactionId,
    });

    // 3. Send the request to Peach Payments
    const response = await fetch(PEACH_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PEACH_AUTH_TOKEN}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Peach Payments API Error:', data);
      return NextResponse.json(
        { error: data.result?.description || 'Failed to initiate payment checkout session' },
        { status: response.status }
      );
    }

    // 4. Return the checkout session ID and redirect URL to the frontend
    const baseUrl = PEACH_API_URL.replace('/v1/checkouts', '');
    return NextResponse.json({
      success: true,
      checkoutId: data.id,
      result: data.result,
      url: `${baseUrl}/v1/checkouts/${data.id}/payment`,
      redirectUrl: `${baseUrl}/v1/checkouts/${data.id}/payment`
    });

  } catch (error) {
    console.error('Internal Server Error in peach-checkout route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
