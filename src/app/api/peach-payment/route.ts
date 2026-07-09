import { NextResponse } from 'next/server';

// ✅ CRITICAL FIX: Force Node.js Runtime to support process.env and Node APIs
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    // 1. Parse Request Body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ step: 'parse', error: 'Invalid JSON body' }, { status: 400 });
    }

    const { amount, orderId } = body;
    if (!amount || !orderId) {
      return NextResponse.json({ step: 'validate', error: 'Missing amount or orderId' }, { status: 400 });
    }

    // 2. Read Environment Variables (Safe for Node Runtime)
    const clientId = process.env.PEACH_CLIENT_ID;
    const clientSecret = process.env.PEACH_CLIENT_SECRET;
    const merchantId = process.env.PEACH_MERCHANT_ID;
    const entityId = process.env.NEXT_PUBLIC_PEACH_ENTITY_ID;

    // Explicit check to catch missing vars immediately
    if (!clientId || !clientSecret || !merchantId || !entityId) {
      throw new Error('Environment variables not loaded. Check Vercel Settings.');
    }

    console.log('✅ Env vars loaded. Starting Peach API flow...');

    // 3. Fetch Access Token
    const tokenResponse = await fetch('https://testapi-v2.peachpayments.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, clientSecret, merchantId })
    });

    const tokenData = await tokenResponse.json();
    const token = tokenData.access_token || tokenData.jwt;

    if (!token) {
      throw new Error(`Auth failed: ${JSON.stringify(tokenData)}`);
    }

    console.log('✅ Token received. Creating checkout session...');

    // 4. Create Checkout Session
    const checkoutResponse = await fetch('https://testapi-v2.peachpayments.com/v1/hosted-checkout/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        entityId: entityId,
        amount: parseFloat(amount).toFixed(2),
        currency: 'ZAR',
        merchantTransactionId: orderId,
        shopperResultUrl: 'https://super-digital-markets-co9n.vercel.app/checkout/success',
        notificationUrl: 'https://super-digital-markets-co9n.vercel.app/api/webhooks/peach'
      })
    });

    const checkoutData = await checkoutResponse.json();
    console.log('Peach Response:', checkoutData);

    // 5. Extract URL
    const redirectUrl = checkoutData.redirectUrl || checkoutData.checkoutUrl || checkoutData.url;

    if (redirectUrl) {
      return NextResponse.json({ success: true, checkoutUrl: redirectUrl });
    } else {
      throw new Error(`No URL found: ${checkoutResponse.status} - ${JSON.stringify(checkoutData)}`);
    }

  } catch (error: any) {
    console.error('💥 API ROUTE CRASH:', error.message);
    return NextResponse.json({
      step: 'crash',
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
