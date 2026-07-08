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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, clientSecret, merchantId })
    });

    const tokenData = await tokenResponse.json();
    const token = tokenData.access_token || tokenData.jwt;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Auth failed' }, { status: 401 });
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
    console.log('Full checkout response:', checkoutData);

    // ✅ Check ALL possible redirect URL field names
    const redirectUrl = 
      checkoutData.redirectUrl || 
      checkoutData.checkoutUrl || 
      checkoutData.url || 
      checkoutData.redirect_url ||
      checkoutData._links?.checkout?.href;

    if (redirectUrl) {
      return NextResponse.json({ success: true, checkoutUrl: redirectUrl });
    } else {
      // Log the full response so we can see what Peach returned
      console.error('No redirect URL found. Full response:', checkoutData);
      return NextResponse.json({ 
        success: false, 
        error: 'No redirect URL in response',
        debug: checkoutData 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
