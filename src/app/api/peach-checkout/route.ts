import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amountZAR = parseFloat(body.amount);
    const amountInCents = Math.round(amountZAR * 100);
    
    const merchantTransactionId = `SDM-${Date.now()}`;
    const nonce = `UNQ${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    // ⚠️ REPLACE THESE WITH YOUR ACTUAL CREDENTIALS FROM PEACH SUPPORT
    const entityId = "8acda4cb9e1b546a019e1b5b39ee001c";
    const clientId = "YOUR_CLIENT_ID_HERE";
    const clientSecret = "YOUR_CLIENT_SECRET_HERE";
    const merchantId = "YOUR_MERCHANT_ID_HERE";
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';

    // STEP 1: Generate OAuth Access Token
    const tokenResponse = await fetch('https://dashboard.peachpayments.com/api/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': clientSecret,
      },
      body: JSON.stringify({
        clientId: clientId,
        clientSecret: clientSecret,
        merchantId: merchantId,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
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
        'authentication.entityId': entityId,
        amount: amountInCents,
        merchantTransactionId: merchantTransactionId,
        nonce: nonce,
        shopperResultUrl: `${baseUrl}/payment/success`,
        cancelUrl: `${baseUrl}/payment/cancelled`,
        notificationUrl: `${baseUrl}/api/webhooks/peach`,
      }),
    });

    const checkoutData = await checkoutResponse.json();

    if (!checkoutResponse.ok || !checkoutData.checkoutId) {
      return NextResponse.json({ 
        error: checkoutData.message || 'Failed to create checkout',
        details: checkoutData
      }, { status: checkoutResponse.status });
    }

    return NextResponse.json({ checkoutId: checkoutData.checkoutId });

  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Internal Server Error',
      message: error.message
    }, { status: 500 });
  }
}
