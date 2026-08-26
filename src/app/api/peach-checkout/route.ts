// src/app/api/peach-checkout/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Step 1: Safely parse request body
  let amount: string;
  let currency: string;
  
  try {
    const body = await request.json();
    amount = body.amount || '100.00';
    currency = body.currency || 'ZAR';
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' }, 
      { status: 400 }
    );
  }

  // Step 2: Get environment variables safely
  const entityId = process.env.PEACH_ENTITY_ID;
  const authToken = process.env.PEACH_SECRET_TOKEN;

  if (!entityId) {
    return NextResponse.json(
      { error: 'Server configuration error', details: 'PEACH_ENTITY_ID missing' },
      { status: 500 }
    );
  }

  if (!authToken) {
    return NextResponse.json(
      { error: 'Server configuration error', details: 'PEACH_SECRET_TOKEN missing' },
      { status: 500 }
    );
  }

  // Step 3: Make the Peach Payments API call
  try {
    const peachResponse = await fetch('https://test.peachpayments.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount,
        currency: currency,
        entityid: entityId,
        paymentType: 'DB',
        testMode: '1',
      }),
    });

    const peachData = await peachResponse.json();

    if (!peachResponse.ok) {
      return NextResponse.json(
        { 
          error: 'Payment gateway error',
          message: peachData.description || 'Failed to initialize payment',
          peachResponse: peachData
        }, 
        { status: peachResponse.status }
      );
    }

    if (!peachData.id) {
      return NextResponse.json(
        { error: 'No checkout ID returned', response: peachData },
        { status: 500 }
      );
    }

    return NextResponse.json({ checkoutId: peachData.id });

  } catch (fetchError) {
    return NextResponse.json(
      { 
        error: 'Network error',
        message: fetchError instanceof Error ? fetchError.message : 'Unknown network error'
      },
      { status: 500 }
    );
  }
}
