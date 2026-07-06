import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, orderId } = await request.json();

    // Get credentials from Vercel Environment Variables
    const clientId = process.env.PEACH_CLIENT_ID;
    const clientSecret = process.env.PEACH_CLIENT_SECRET;
    const entityId = process.env.NEXT_PUBLIC_PEACH_ENTITY_ID;

    if (!clientId || !clientSecret || !entityId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Configuration missing. Check Vercel environment variables.' 
      }, { status: 500 });
    }

    // STEP 1: Get OAuth2 Access Token using NEW API v2 Endpoint
    const tokenResponse = await fetch('https://testapi-v2.peachpayments.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
      },
      body: 'grant_type=client_credentials'
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error('Token Error:', tokenData);
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication failed. Check Client ID and Secret.' 
      }, { status: 401 });
    }

    const accessToken = tokenData.access_token;

    // STEP 2: Create Checkout Session using NEW API v2 Endpoint
    const checkoutResponse = await fetch('https://testapi-v2.peachpayments.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
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
    console.log('Checkout Response:', checkoutData);

    // STEP 3: Return the redirect URL
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
    console.error('Server Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Server connection failed' 
    }, { status: 500 });
  }
}
