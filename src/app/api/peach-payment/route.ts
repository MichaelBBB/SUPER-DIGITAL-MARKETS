import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, orderId } = await request.json();

    const clientId = process.env.PEACH_CLIENT_ID;
    const clientSecret = process.env.PEACH_CLIENT_SECRET;
    const merchantId = process.env.PEACH_MERCHANT_ID;
    const entityId = process.env.NEXT_PUBLIC_PEACH_ENTITY_ID;

    if (!clientId || !clientSecret || !entityId) {
      return NextResponse.json({ success: false, error: 'Env Vars Missing' }, { status: 500 });
    }

    // 1. Get Token
    const tokenResponse = await fetch('https://sandbox-dashboard.peachpayments.com/api/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, clientSecret, merchantId })
    });

    const tokenData = await tokenResponse.json();
    const token = tokenData.access_token || tokenData.jwt;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Auth Failed', debug: tokenData }, { status: 401 });
    }

    // 2. Create Checkout
    const checkoutResponse = await fetch('https://testsecure.peachpayments.com/v2/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        entityId: entityId,
        amount: amount.toFixed(2),
        currency: 'ZAR',
        paymentType: 'DB',
        merchantTransactionId: orderId,
        shopperResultUrl: 'https://super-digital-markets-co9n.vercel.app/checkout/success'
      })
    });

    // ✅ CRITICAL: Read RAW TEXT first to see exactly what Peach returns
    const rawText = await checkoutResponse.text();
    
    let checkoutData;
    try {
      checkoutData = JSON.parse(rawText);
    } catch (e) {
      checkoutData = { rawText: rawText, parseError: 'Response was not JSON' };
    }

    console.log('PEACH RAW RESPONSE:', rawText);
    console.log('PEACH STATUS:', checkoutResponse.status);

    // 3. Check for URL
    const url = checkoutData.redirectUrl || checkoutData.checkoutUrl || checkoutData.url || checkoutData.redirect_url;

    if (url) {
      return NextResponse.json({ success: true, checkoutUrl: url });
    } else {
      return NextResponse.json({
        success: false,
        error: 'No Redirect URL',
        peachStatus: checkoutResponse.status,
        peachRaw: rawText
      }, { status: 400 });
    }

  } catch (error) {
    console.error('SERVER CRASH:', error);
    return NextResponse.json({ success: false, error: 'Server Crash', message: error.message }, { status: 500 });
  }
}
