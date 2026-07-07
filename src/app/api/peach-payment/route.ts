import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, orderId } = await request.json();

    // Get credentials from environment variables
    const clientId = process.env.PEACH_CLIENT_ID;
    const clientSecret = process.env.PEACH_CLIENT_SECRET;
    const merchantId = process.env.PEACH_MERCHANT_ID;
    const entityId = process.env.NEXT_PUBLIC_PEACH_ENTITY_ID;

    if (!clientId || !clientSecret || !merchantId || !entityId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Configuration missing' 
      }, { status: 500 });
    }

    // STEP 1: Get Access Token
    const tokenResponse = await fetch('https://sandbox-dashboard.peachpayments.com/api/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clientId: clientId,
        clientSecret: clientSecret,
        merchantId: merchantId
      })
    });

    const tokenData = await tokenResponse.json();
    console.log('Token response:', tokenData);

    if (!tokenData.jwt) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication failed' 
      }, { status: 401 });
    }

    const jwt = tokenData.jwt;

    // STEP 2: Create Checkout Session
    const checkoutResponse = await fetch('https://testsecure.peachpayments.com/v2/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify({
        entityId: entityId,
        amount: amount.toFixed(2),
        currency: 'ZAR',
        merchantTransactionId: orderId,
        shopperResultUrl: 'https://super-digital-markets-co9n.vercel.app/checkout/success'
      })
    });

    const checkoutData = await checkoutResponse.json();
    console.log('Checkout response:', checkoutData);

    // STEP 3: Return redirect URL
    if (checkoutData.redirectUrl) {
      return NextResponse.json({ 
        success: true, 
        checkoutUrl: checkoutData.redirectUrl 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'No redirect URL returned',
        debug: checkoutData 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Server error' 
    }, { status: 500 });
  }
}
