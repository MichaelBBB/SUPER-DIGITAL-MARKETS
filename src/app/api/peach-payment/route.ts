import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, orderId } = await request.json();

    const clientId = process.env.PEACH_CLIENT_ID;
    const clientSecret = process.env.PEACH_CLIENT_SECRET;
    const merchantId = process.env.PEACH_MERCHANT_ID;
    const entityId = process.env.NEXT_PUBLIC_PEACH_ENTITY_ID;

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

    // ✅ Use access_token OR jwt (check both fields)
    const token = tokenData.access_token || tokenData.jwt;

    if (!token) {
      console.error('No token in response:', tokenData);
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication failed - no token received' 
      }, { status: 401 });
    }

    // STEP 2: Create Checkout Session
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
        merchantTransactionId: orderId,
        shopperResultUrl: 'https://super-digital-markets-co9n.vercel.app/checkout/success'
      })
    });

    const checkoutData = await checkoutResponse.json();
    console.log('Checkout response:', checkoutData);

    if (checkoutData.redirectUrl) {
      return NextResponse.json({ 
        success: true, 
        checkoutUrl: checkoutData.redirectUrl 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'No redirect URL',
        debug: checkoutData 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Server error' 
    }, { status: 500 });
  }
}
