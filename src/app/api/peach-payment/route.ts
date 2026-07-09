import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { amount, orderId } = await request.json();

    const clientId = process.env.PEACH_CLIENT_ID;
    const clientSecret = process.env.PEACH_CLIENT_SECRET;
    const merchantId = process.env.PEACH_MERCHANT_ID;
    const entityId = process.env.NEXT_PUBLIC_PEACH_ENTITY_ID;

    if (!clientId || !clientSecret || !merchantId || !entityId) {
      throw new Error('Environment variables not loaded');
    }

    // ✅ FIX: Use form-encoded body (standard for OAuth2 token endpoints)
    const tokenBody = new URLSearchParams();
    tokenBody.append('grant_type', 'client_credentials');
    tokenBody.append('clientId', clientId);
    tokenBody.append('clientSecret', clientSecret);
    tokenBody.append('merchantId', merchantId);

    console.log('🔑 Requesting token with form-encoded body...');

    const tokenResponse = await fetch('https://testapi-v2.peachpayments.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: tokenBody.toString()
    });

    // ✅ Handle non-JSON responses gracefully
    const tokenText = await tokenResponse.text();
    console.log('Raw token response:', tokenText.substring(0, 200));

    let tokenData;
    try {
      tokenData = JSON.parse(tokenText);
    } catch (e) {
      throw new Error(`Peach returned non-JSON: ${tokenText.substring(0, 100)}`);
    }

    const token = tokenData.access_token || tokenData.jwt;
    if (!token) {
      throw new Error(`No token in response: ${JSON.stringify(tokenData)}`);
    }

    console.log('✅ Token received. Creating checkout...');

    // Create checkout session
    const checkoutResponse = await fetch('https://testapi-v2.peachpayments.com/v1/hosted-checkout/sessions', {
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

    const checkoutText = await checkoutResponse.text();
    console.log('Raw checkout response:', checkoutText.substring(0, 200));

    let checkoutData;
    try {
      checkoutData = JSON.parse(checkoutText);
    } catch (e) {
      throw new Error(`Checkout returned non-JSON: ${checkoutText.substring(0, 100)}`);
    }

    const redirectUrl = checkoutData.redirectUrl || checkoutData.checkoutUrl || checkoutData.url;

    if (redirectUrl) {
      return NextResponse.json({ success: true, checkoutUrl: redirectUrl });
    } else {
      throw new Error(`No URL: ${checkoutResponse.status} - ${JSON.stringify(checkoutData)}`);
    }

  } catch (error: any) {
    console.error('💥 Error:', error.message);
    return NextResponse.json({
      step: 'error',
      error: error.message
    }, { status: 500 });
  }
}
