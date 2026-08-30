// src/app/api/peach-checkout/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Never let this function crash - always return valid JSON
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const amount = body?.amount || '100.00';
    const currency = body?.currency || 'ZAR';

    // Your confirmed credentials
    const entityId = "8acda4cb9e1b546a019e1b5b39ee001c";
    const authToken = "58c4748b406945d8802cf0f7997456e0";
    const apiUrl = "https://peachpayments.com/v1/checkouts";

    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    let response;
    try {
      response = await fetch(apiUrl, {
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
          testMode: '0',
        }),
        signal: controller.signal,
      });
    } catch (fetchError) {
      clearTimeout(timeout);
      return NextResponse.json(
        { error: 'Network error connecting to Peach Payments', message: fetchError instanceof Error ? fetchError.message : 'Unknown' },
        { status: 500 }
      );
    }
    clearTimeout(timeout);

    // Safely parse response - handle HTML error pages
    let data;
    try {
      const text = await response.text();
      if (!text || text.trim().startsWith('<')) {
        return NextResponse.json(
          { error: 'Peach Payments returned an error page', status: response.status },
          { status: 500 }
        );
      }
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: 'Invalid response from Peach Payments' },
        { status: 500 }
      );
    }

    // Check for API errors
    if (!response.ok) {
      return NextResponse.json(
        { 
          error: data?.description || 'Payment initialization failed',
          peachStatus: response.status,
          peachResponse: data
        },
        { status: response.status }
      );
    }

    // Success
    if (data?.id) {
      return NextResponse.json({ checkoutId: data.id });
    }

    return NextResponse.json({ error: 'No checkout ID returned' }, { status: 500 });

  } catch (error: any) {
    // Catch-all: never crash
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
