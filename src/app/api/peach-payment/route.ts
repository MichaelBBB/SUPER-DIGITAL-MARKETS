import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, orderId } = await request.json();

    // 1. Get Credentials
    const clientId = process.env.PEACH_CLIENT_ID;
    const clientSecret = process.env.PEACH_CLIENT_SECRET;
    const merchantId = process.env.PEACH_MERCHANT_ID;
    const entityId = process.env.NEXT_PUBLIC_PEACH_ENTITY_ID;

    if (!clientId || !clientSecret || !merchantId || !entityId) {
      return NextResponse.json({ success: false, error: 'Missing Environment Variables' }, { status: 500 });
    }

    // 2. Get Access Token using JSON Body Auth (As per Peach API v2 Docs)
    // Endpoint: Sandbox API v2
    const tokenResponse = await fetch('https://testapi-v2.peachpayments.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: clientId,
        clientSecret: clientSecret,
        merchantId: merchantId
      })
    });

    const tokenData = await tokenResponse.json();
    const token = tokenData.access_token;

    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Auth failed', 
        debug: tokenData 
      }, { status: 401 });
    }

    // 3. Create Hosted Checkout Session
    // Endpoint: Sandbox API v2 -> /v1/hosted-checkout/sessions
    const checkoutResponse = await fetch('https://testapi-v2.peachpayments.com/v1/hosted-checkout/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        entityId: entityId,
        amount: amount.toFixed(2),
        currency: 'ZAR',
        merchantTransactionId: orderId,
        shopperResultUrl: 'https://super-digital-markets-co9n.vercel.app/checkout/success',
        notificationUrl: 'https://super-digital-markets-co9n.vercel.app/api/webhooks/peach'
      })
    });

    const checkoutData = await checkoutResponse.json();
    
    // 4. Extract Redirect URL
    const redirectUrl = checkoutData.redirectUrl || checkoutData.checkoutUrl || checkoutData.url;

    if (redirectUrl) {
      return NextResponse.json({ success: true, checkoutUrl: redirectUrl });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'No redirect URL', 
        status: checkoutResponse.status,
        response: checkoutData 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
