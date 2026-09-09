import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, item, currency = 'USD' } = await request.json();

    // Get credentials from environment variables
    const clientId = process.env.PEACH_CLIENT_ID;
    const clientSecret = process.env.PEACH_CLIENT_SECRET;
    const merchantId = process.env.PEACH_MERCHANT_ID;

    if (!clientId || !clientSecret || !merchantId) {
      return NextResponse.json(
        { error: 'Peach Payments credentials not configured' },
        { status: 500 }
      );
    }

    // Step 1: Get Access Token
    const tokenResponse = await fetch('https://dashboard.peachpayments.com/api/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientId,
        clientSecret,
        merchantId,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token Error:', errorText);
      return NextResponse.json(
        { error: 'Failed to get access token', details: errorText },
        { status: 401 }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Step 2: Create Checkout Session
    const checkoutResponse = await fetch('https://checkout.peachpayments.com/api/v1/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toUpperCase(),
        description: item || 'Digital Product Purchase',
        merchantReference: `ORDER-${Date.now()}`,
        returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
        webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/peach`,
        customer: {
          email: 'customer@example.com', // You can get this from your form
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
      checkoutUrl: checkoutData.redirectUrl || checkoutData.checkoutUrl,
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
