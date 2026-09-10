export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, item, currency = 'USD' } = await request.json();

    const clientId = process.env.PEACH_CLIENT_ID;
    const clientSecret = process.env.PEACH_CLIENT_SECRET;
    const merchantId = process.env.PEACH_MERCHANT_ID;

    if (!clientId || !clientSecret || !merchantId) {
      return NextResponse.json({ error: 'Credentials missing' }, { status: 500 });
    }

    // Try Standard OAuth Format with grant_type
    const tokenBody = {
      client_id: clientId,
      client_secret: clientSecret,
      merchant_id: merchantId,
      grant_type: 'client_credentials'
    };

    console.log('Sending Token Request...', tokenBody);

    const tokenResponse = await fetch('https://dashboard.peachpayments.com/api/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tokenBody),
    });

    const tokenText = await tokenResponse.text();
    
    // CRITICAL: Log the EXACT response from Peach
    console.log(' PEACH RESPONSE STATUS:', tokenResponse.status);
    console.log('🍑 PEACH RESPONSE BODY:', tokenText);

    if (!tokenResponse.ok) {
      // Return the raw error from Peach so we can see it
      return NextResponse.json(
        { 
          error: 'Token Failed', 
          peachError: tokenText, // This will show up in your logs!
          status: tokenResponse.status 
        },
        { status: 401 }
      );
    }

    const tokenData = JSON.parse(tokenText);
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return NextResponse.json({ error: 'No token in response', details: tokenData }, { status: 401 });
    }

    // Create Checkout
    const checkoutResponse = await fetch('https://checkout.peachpayments.com/api/v1/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency: currency.toUpperCase(),
        description: item || 'Product',
        merchantReference: `ORDER-${Date.now()}`,
        returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment?cancelled=true`,
        webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/peach`,
        customer: { email: 'test@example.com', firstName: 'Test', lastName: 'User' },
        items: [{ name: item, quantity: 1, unitPrice: Math.round(amount * 100) }],
      }),
    });

    if (!checkoutResponse.ok) {
      const errText = await checkoutResponse.text();
      return NextResponse.json({ error: 'Checkout Failed', details: errText }, { status: 500 });
    }

    const checkoutData = await checkoutResponse.json();
    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutData.redirectUrl || checkoutData.checkoutUrl,
    });

  } catch (error) {
    console.error('API Crash:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
