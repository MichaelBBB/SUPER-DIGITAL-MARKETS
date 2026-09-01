import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amountZAR = parseFloat(body.amount);
    const amountInCents = Math.round(amountZAR * 100);
    
    const merchantTransactionId = `SDM-${Date.now()}`;
    const nonce = `UNQ${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    // ✅ YOUR VERIFIED CREDENTIALS FROM PEACH DASHBOARD
    const entityId = "8acda4cb9e1b546a019e1b5b39ee001c";
    const clientId = "482b18ada7a76c073840eba492cbe7";
    const clientSecret = "XcQNWhy52Bqbe1i9mAseFg+TzKI5YW3WjKJEUPKB5FMWjPvG0cdyX64bkw8FqDAazrZXnIokvWUn9AlX1PeXew==";
    const merchantId = "9e65f2c5950c4b8483ffbd225bd6f027";
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';

    console.log('🔑 Starting OAuth token generation...');
    
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
    console.log(' Token response:', tokenResponse.status, tokenData);

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('❌ Token generation failed:', tokenData);
      return NextResponse.json({ 
        error: 'Failed to authenticate with Peach Payments',
        details: tokenData,
        status: tokenResponse.status
      }, { status: 401 });
    }

    const accessToken = tokenData.access_token;
    console.log('✅ Access token received successfully');

    // STEP 2: Create Checkout using the Access Token
    console.log('💳 Creating checkout with amount:', amountInCents, 'cents');
    
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
    console.log('💳 Checkout response:', checkoutResponse.status, checkoutData);

    if (!checkoutResponse.ok || !checkoutData.checkoutId) {
      console.error('❌ Checkout creation failed:', checkoutData);
      return NextResponse.json({ 
        error: checkoutData.message || 'Failed to create checkout',
        details: checkoutData,
        status: checkoutResponse.status
      }, { status: checkoutResponse.status });
    }

    console.log('✅ Checkout created successfully:', checkoutData.checkoutId);
    return NextResponse.json({ checkoutId: checkoutData.checkoutId });

  } catch (error: any) {
    console.error('💥 API Error:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
