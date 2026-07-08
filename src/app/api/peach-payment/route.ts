import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, orderId } = await request.json();

    const clientId = process.env.PEACH_CLIENT_ID;
    const clientSecret = process.env.PEACH_CLIENT_SECRET;
    const merchantId = process.env.PEACH_MERCHANT_ID;
    const entityId = process.env.NEXT_PUBLIC_PEACH_ENTITY_ID;

    if (!clientId || !clientSecret || !merchantId || !entityId) {
      return NextResponse.json({
        success: false,
        error: 'Environment variables missing',
        details: {
          hasClientId: !!clientId,
          hasClientSecret: !!clientSecret,
          hasMerchantId: !!merchantId,
          hasEntityId: !!entityId
        }
      }, { status: 500 });
    }

    console.log('Using Entity ID:', entityId);

    // Step 1: Get Access Token
    console.log('Requesting token from Peach...');
    const tokenResponse = await fetch('https://sandbox-dashboard.peachpayments.com/api/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, clientSecret, merchantId })
    });

    console.log('Token response status:', tokenResponse.status);
    const tokenData = await tokenResponse.json();
    console.log('Token data:', tokenData);

    const token = tokenData.access_token || tokenData.jwt;
    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Failed to get access token',
        debug: tokenData
      }, { status: 401 });
    }

    // Step 2: Create Checkout WITH WEBHOOK URL
    console.log('Creating checkout session...');
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
        shopperResultUrl: 'https://super-digital-markets-co9n.vercel.app/checkout/success',
        // ✅ ADD WEBHOOK URL (required by Peach)
        webhookUrl: 'https://super-digital-markets-co9n.vercel.app/api/webhooks/peach',
        notificationUrl: 'https://super-digital-markets-co9n.vercel.app/api/webhooks/peach',
        customer: {
          email: 'customer@example.com',
          givenName: 'Test',
          surname: 'Customer'
        },
        billing: {
          street1: '123 Test Street',
          city: 'Johannesburg',
          postcode: '2000',
          country: 'ZA'
        }
      })
    });

    console.log('Checkout response status:', checkoutResponse.status);
    const checkoutData = await checkoutResponse.json();
    console.log('Checkout data:', checkoutData);

    if (checkoutData.redirectUrl) {
      return NextResponse.json({ success: true, checkoutUrl: checkoutData.redirectUrl });
    } else {
      return NextResponse.json({
        success: false,
        error: 'No redirect URL',
        peachStatus: checkoutResponse.status,
        peachResponse: checkoutData
      }, { status: 400 });
    }

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Server error',
      message: error.message
    }, { status: 500 });
  }
}
