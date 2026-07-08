import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, orderId } = await request.json();

    const clientId = process.env.PEACH_CLIENT_ID;
    const clientSecret = process.env.PEACH_CLIENT_SECRET;
    const entityId = process.env.NEXT_PUBLIC_PEACH_ENTITY_ID;

    if (!clientId || !clientSecret || !entityId) {
      return NextResponse.json({ success: false, error: 'Config missing' }, { status: 500 });
    }

    // STEP 1: Get Access Token using CORRECT Sandbox API endpoint
    const tokenResponse = await fetch('https://testapi-v2.peachpayments.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
      },
      body: 'grant_type=client_credentials'
    });

    const tokenData = await tokenResponse.json();
    const token = tokenData.access_token;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Auth failed', debug: tokenData }, { status: 401 });
    }

    // STEP 2: Create Hosted Checkout Session using CORRECT endpoint
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
    console.log('Peach Checkout Response:', checkoutData);

    // STEP 3: Extract redirect URL
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
    console.error('Server error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
