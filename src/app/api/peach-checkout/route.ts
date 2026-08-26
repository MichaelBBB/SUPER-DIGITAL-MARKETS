// src/app/api/peach-checkout/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amount = body.amount || '100.00';
    const currency = body.currency || 'ZAR';

    const entityId = process.env.PEACH_ENTITY_ID;
    const authToken = process.env.PEACH_SECRET_TOKEN;

    // Build the request
    const peachPayload = {
      amount: amount,
      currency: currency,
      entityid: entityId || '',
      paymentType: 'DB',
      testMode: '1',
    };

    // Make the API call
    const peachResponse = await fetch('https://test.peachpayments.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken || ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(peachPayload),
    });

    const peachData = await peachResponse.json();

    // Check if Peach returned an error
    if (!peachResponse.ok) {
      return NextResponse.json({ 
        error: 'Payment gateway error',
        message: peachData.description || 'Failed to initialize'
      }, { status: peachResponse.status });
    }

    // Return the checkout ID
    return NextResponse.json({ checkoutId: peachData.id });

  } catch (error) {
    // Catch any unexpected errors
    return NextResponse.json({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
