import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, orderId } = await request.json();

    // 1. Get Access Token
    const tokenResponse = await fetch('https://sandbox-dashboard.peachpayments.com/api/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: process.env.PEACH_CLIENT_ID,
        clientSecret: process.env.PEACH_CLIENT_SECRET,
        merchantId: process.env.PEACH_MERCHANT_ID
      })
    });

    const tokenData = await tokenResponse.json();
    const token = tokenData.access_token || tokenData.jwt;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Auth failed' }, { status: 401 });
    }

    // 2. Create Checkout (Try with /api/ prefix)
    const checkoutResponse = await fetch('https://testsecure.peachpayments.com/api/v2/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        entityId: process.env.NEXT_PUBLIC_PEACH_ENTITY_ID,
        amount: amount.toFixed(2),
        currency: 'ZAR',
        paymentType: 'DB',
        merchantTransactionId: orderId,
        shopperResultUrl: 'https://super-digital-markets-co9n.vercel.app/checkout/success',
        customer: {
          email: 'customer@example.com',
          givenName: 'Test',
          surname: 'Customer'
        }
      })
    });

    const checkoutData = await checkoutResponse.json();
    console.log('Peach Checkout Response:', checkoutData);

    if (checkoutData.redirectUrl) {
      return NextResponse.json({ success: true, checkoutUrl: checkoutData.redirectUrl });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'No redirect URL', 
        debug: checkoutData 
      }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
