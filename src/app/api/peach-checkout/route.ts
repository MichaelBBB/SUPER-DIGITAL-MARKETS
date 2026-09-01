import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amountZAR = parseFloat(body.amount);
    
    if (isNaN(amountZAR) || amountZAR <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }
    
    const amountInCents = Math.round(amountZAR * 100);
    const merchantTransactionId = `SDM-${Date.now()}`;
    const nonce = `UNQ${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    // ✅ YOUR VERIFIED CREDENTIALS FROM PEACH DASHBOARD
    const entityId = "8acda4cb9e1b546a019e1b5b39ee001c";
    const clientId = "482b18ada7a76c073840eba492cbe7"; // ← REPLACE WITH YOUR ACTUAL CLIENT ID
    const clientSecret = "XcQNWhy52Bqbe1i9mAseFg+TzKI5YW3WjKJEUPKB5FMWjPvG0cdyX64bkw8FqDAazrZXnIokvWUn9AlX1PeXew=="; // ← REPLACE WITH YOUR ACTUAL CLIENT SECRET
    const merchantId = "9e65f2c5950c4b8483ffbd225bd6f027"; // ← REPLACE WITH YOUR ACTUAL MERCHANT ID
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';

    console.log('🔑 [Peach API] Starting OAuth token generation...');
    
    // STEP 1: Generate OAuth Access Token — EXACTLY AS PER PEACH'S CURL EXAMPLE
    const tokenResponse = await fetch('https://dashboard.peachpayments.com/api/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': clientSecret, // ← This is critical — must be exact
      },
      body: JSON.stringify({
        clientId: clientId,
        clientSecret: clientSecret,
        merchantId: merchantId,
      }),
    });

    const tokenData = await tokenResponse.json();
    console.log(`🔑 [Peach API] Token response: ${tokenResponse.status}`, tokenData);

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('❌ [Peach API] Token generation failed:', tokenData);
      return NextResponse.json({ 
        error: 'Authentication failed with Peach Payments',
        details: tokenData,
        status: tokenResponse.status
      }, { status: 401 });
    }

    const accessToken = tokenData.access_token;
    console.log('✅ [Peach API] Access token received successfully');

    // STEP 2: Create Checkout — EXACTLY AS PER PEACH'S CURL EXAMPLE
    console.log('💳 [Peach API] Creating checkout for amount:', amountInCents, 'cents');
    
    const checkoutResponse = await fetch('https://secure.peachpayments.com/v2/checkout', {
      method: 'POST',
      headers: {
        'Referer': baseUrl, // ← Required by Peach
        'accept': 'application/json', // ← Required by Peach
        'authorization': `Bearer ${accessToken}`, // ← Bearer token from step 1
        'content-type': 'application/json', // ← Required by Peach
      },
      body: JSON.stringify({
        currency: body.currency || 'ZAR',
        forceDefaultMethod: false,
        'authentication.entityId': entityId, // ← Dot notation required for v2 API
        amount: amountInCents, // ← Integer cents
        merchantTransactionId: merchantTransactionId,
        nonce: nonce,
        shopperResultUrl: `${baseUrl}/payment/success`,
        cancelUrl: `${baseUrl}/payment/cancelled`,
        notificationUrl: `${baseUrl}/api/webhooks/peach`,
      }),
    });

    const checkoutData = await checkoutResponse.json();
    console.log(`💳 [Peach API] Checkout response: ${checkoutResponse.status}`, checkoutData);

    if (!checkoutResponse.ok || !checkoutData.checkoutId) {
      console.error('❌ [Peach API] Checkout creation failed:', checkoutData);
      return NextResponse.json({ 
        error: checkoutData.message || 'Failed to create checkout',
        details: checkoutData,
        status: checkoutResponse.status
      }, { status: checkoutResponse.status });
    }

    console.log('✅ [Peach API] Checkout created successfully:', checkoutData.checkoutId);
    return NextResponse.json({ checkoutId: checkoutData.checkoutId });

  } catch (error: any) {
    console.error('💥 [Peach API] Critical error:', error);
    return NextResponse.json({ 
      error: 'Payment gateway connection failed',
      message: error.message,
      type: error.constructor.name
    }, { status: 500 });
  }
}
