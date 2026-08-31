// src/app/api/peach-checkout/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amountZAR = parseFloat(body.amount);
    const amountInCents = Math.round(amountZAR * 100); // Peach requires integer cents
    
    const merchantTransactionId = `SDM-${Date.now()}`;
    const nonce = `UNQ${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    // Your confirmed credentials from Peach Support
    const entityId = "8acda4cb9e1b546a019e1b5b39ee001c";
    const clientId = "1a870140ea12becc628b6e99369e98f0"; // Replace with your actual Client ID
    const clientSecret = "Skl+MwgdPwiclcyjx4hjSPlhdbACow62nVmsjtXbDYbAxo5OPtLoNB19ERkYOVhCReykHWt6O9Q2G4M73rhvsw=="; // Replace with your actual Client Secret
    const merchantId = "9e65f2c5950c4b8483ffbd225bd6f027"; // Replace with your actual Merchant ID
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';

    // STEP 1: Generate OAuth Access Token
    const tokenResponse = await fetch('https://dashboard.peachpayments.com/api/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': clientSecret, // Use Client Secret as X-API-Key per Peach docs
      },
      body: JSON.stringify({
        clientId: clientId,
        clientSecret: clientSecret,
        merchantId: merchantId,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('❌ Failed to get access token:', tokenData);
      return NextResponse.json({ 
        error: 'Failed to authenticate with Peach Payments',
        details: tokenData
      }, { status: 401 });
    }

    const accessToken = tokenData.access_token;

    // STEP 2: Create Checkout using the Access Token
    const checkoutResponse = await fetch('https://secure.peachpayments.com/v2/checkout', {
      method: 'POST',
      headers: {
        'Referer': baseUrl,
        'accept': 'application/json',
        'authorization': `Bearer ${accessToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        currency: body.currency || 'ZAR',
        forceDefaultMethod: false,
        'authentication.entityId': entityId, // Dot notation required for v2 API
        amount: amountInCents, // Integer in cents
        merchantTransactionId: merchantTransactionId,
        nonce: nonce,
        shopperResultUrl: `${baseUrl}/payment/success`,
        // Optional but recommended:
        cancelUrl: `${baseUrl}/payment/cancelled`,
        notificationUrl: `${baseUrl}/api/webhooks/peach`,
      }),
    });

    const checkoutData = await checkoutResponse.json();

    if (!checkoutResponse.ok || !checkoutData.checkoutId) {
      console.error('❌ Failed to create checkout:', checkoutData);
      return NextResponse.json({ 
        error: checkoutData.message || 'Failed to create checkout',
        details: checkoutData
      }, { status: checkoutResponse.status });
    }

    return NextResponse.json({ checkoutId: checkoutData.checkoutId });

  } catch (error: any) {
    console.error('💥 API Error:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      message: error.message
    }, { status: 500 });
  }
}// src/app/api/peach-checkout/route.ts
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
