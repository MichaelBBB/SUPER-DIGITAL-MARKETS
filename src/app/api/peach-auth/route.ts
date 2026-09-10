export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, item, currency = 'USD' } = await request.json();

    // Get credentials from environment variables
    const clientId = process.env.PEACH_CLIENT_ID;
    const clientSecret = process.env.PEACH_CLIENT_SECRET;
    const merchantId = process.env.PEACH_MERCHANT_ID;

    if (!clientId || !clientSecret || !merchantId) {
      console.error('Missing credentials:', { hasClientId: !!clientId, hasClientSecret: !!clientSecret, hasMerchantId: !!merchantId });
      return NextResponse.json(
        { error: 'Peach Payments credentials missing' },
        { status: 500 }
      );
    }

    // Step 1: Get Access Token
    // NOTE: Using snake_case fields as required by OAuth/Peach
    const tokenResponse = await fetch('https://dashboard.peachpayments.com/api/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,       
        client_secret: clientSecret, 
        merchant_id: merchantId,     
        grant_type: 'client_credentials' 
      }),
    });

    const tokenText = await tokenResponse.text();
    console.log('Token Response Status:', tokenResponse.status);
    console.log('Token Response Body:', tokenText);

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { 
          error: 'Failed to get access token', 
          details: tokenText,
          status: tokenResponse.status
        },
        { status: 401 }
      );
    }

    let tokenData;
    try {
      tokenData = JSON.parse(tokenText);
    } catch (e) {
      console.error('Failed to parse token response:', e);
      return NextResponse.json(
        { error: 'Invalid response from Peach Payments', details: tokenText },
        { status: 500 }
      );
    }

    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error('No access_token in response:', tokenData);
      return NextResponse.json(
        { error: 'No access token received', details: tokenData },
        { status: 401 }
      );
    }

    // Step 2: Create Checkout Session
    const checkoutResponse = await fetch('https://checkout.peachpayments.com/api/v1/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), 
        currency: currency.toUpperCase(),
        description: item || 'Digital Product Purchase',
        merchantReference: `ORDER-${Date.now()}`,
        returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment?item=${encodeURIComponent(item)}&amount=${amount}&cancelled=true`,
        webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/peach`,
        customer: {
          email: 'customer@example.com', 
          firstName: 'Customer',
          lastName: 'Name',
        },
        items: [
          {
            name: item || 'Digital Product',
            quantity: 1,
            unitPrice: Math.round(amount * 100),
          },
        ],
      }),
    });

    if (!checkoutResponse.ok) {
      const errorText = await checkoutResponse.text();
      console.error('Checkout Error:', errorText);
      return NextResponse.json(
        { error: 'Failed to create checkout session', details: errorText },
        { status: 500 }
      );
    }

    const checkoutData = await checkoutResponse.json();

    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutData.redirectUrl || checkoutData.checkoutUrl || checkoutData.url,
      sessionId: checkoutData.id,
    });

  } catch (error) {
    console.error('Peach Payments Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
