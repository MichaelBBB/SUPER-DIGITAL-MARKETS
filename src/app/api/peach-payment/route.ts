import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Parse request body safely
    let body;
    try {
      body = await request.json();
    } catch (e: any) {
      return NextResponse.json({ step: 'parse_body', error: 'Invalid JSON body', details: e.message }, { status: 400 });
    }

    const { amount, orderId } = body;
    if (!amount || !orderId) {
      return NextResponse.json({ step: 'validate', error: 'Missing amount or orderId' }, { status: 400 });
    }

    // 2. Check Environment Variables
    const clientId = process.env.PEACH_CLIENT_ID;
    const clientSecret = process.env.PEACH_CLIENT_SECRET;
    const merchantId = process.env.PEACH_MERCHANT_ID;
    const entityId = process.env.NEXT_PUBLIC_PEACH_ENTITY_ID;

    if (!clientId || !clientSecret || !merchantId || !entityId) {
      return NextResponse.json({
        step: 'env_check',
        error: 'Missing environment variables',
        details: {
          hasClientId: !!clientId,
          hasClientSecret: !!clientSecret,
          hasMerchantId: !!merchantId,
          hasEntityId: !!entityId
        }
      }, { status: 500 });
    }

    // 3. Fetch Access Token
    let tokenResponse;
    try {
      tokenResponse = await fetch('https://testapi-v2.peachpayments.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, clientSecret, merchantId })
      });
    } catch (e: any) {
      return NextResponse.json({ step: 'fetch_token', error: 'Network error fetching token', details: e.message }, { status: 500 });
    }

    const tokenData = await tokenResponse.json();
    const token = tokenData.access_token || tokenData.jwt;

    if (!token) {
      return NextResponse.json({ step: 'parse_token', error: 'No token in response', details: tokenData }, { status: 401 });
    }

    // 4. Create Checkout Session
    let checkoutResponse;
    try {
      checkoutResponse = await fetch('https://testapi-v2.peachpayments.com/v1/hosted-checkout/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          entityId,
          amount: parseFloat(amount).toFixed(2),
          currency: 'ZAR',
          merchantTransactionId: orderId,
          shopperResultUrl: 'https://super-digital-markets-co9n.vercel.app/checkout/success',
          notificationUrl: 'https://super-digital-markets-co9n.vercel.app/api/webhooks/peach'
        })
      });
    } catch (e: any) {
      return NextResponse.json({ step: 'fetch_checkout', error: 'Network error fetching checkout', details: e.message }, { status: 500 });
    }

    const checkoutData = await checkoutResponse.json();

    // 5. Extract Redirect URL
    const redirectUrl = checkoutData.redirectUrl || checkoutData.checkoutUrl || checkoutData.url;
    if (redirectUrl) {
      return NextResponse.json({ success: true, checkoutUrl: redirectUrl });
    }

    return NextResponse.json({
      step: 'no_url',
      error: 'No redirect URL found',
      status: checkoutResponse.status,
      response: checkoutData
    }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({
      step: 'global_catch',
      error: 'Unexpected server error',
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
