import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, orderId } = await request.json();
    
    // Credentials from Vercel Environment Variables
    const clientId = process.env.PEACH_CLIENT_ID;
    const clientSecret = process.env.PEACH_CLIENT_SECRET;
    const merchantId = process.env.PEACH_MERCHANT_ID;
    const secretToken = process.env.PEACH_SECRET_TOKEN;
    const entityId = process.env.NEXT_PUBLIC_PEACH_ENTITY_ID;

    if (!clientId || !clientSecret) {
      return NextResponse.json({ success: false, error: 'Configuration missing' }, { status: 500 });
    }

    // 1. Get Access Token
    const tokenResponse = await fetch('https://test.peachpayments.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
      },
      body: 'grant_type=client_credentials'
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      return NextResponse.json({ success: false, error: 'Auth failed' }, { status: 401 });
    }

    // 2. Create Payment Session
    const paymentResponse = await fetch('https://test.peachpayments.com/api/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenData.access_token}`,
        'X-Merchant-ID': merchantId || '',
        'X-Secret-Token': secretToken || ''
      },
      body: JSON.stringify({
        entityId: entityId,
        amount: amount.toFixed(2),
        currency: 'ZAR',
        paymentType: 'DB',
        merchantTransactionId: orderId,
        customer: { email: 'customer@example.com', givenName: 'Test', surname: 'Customer' },
        billing: { street1: '123 Test St', city: 'Johannesburg', postcode: '2000', country: 'ZA' },
        shopperResultUrl: 'https://super-digital-markets-co9n.vercel.app/checkout/success'
      })
    });

    const paymentData = await paymentResponse.json();

    if (paymentData.redirectUrl || paymentData.checkoutUrl) {
      return NextResponse.json({ success: true, checkoutUrl: paymentData.redirectUrl || paymentData.checkoutUrl });
    } else {
      return NextResponse.json({ success: false, error: 'No URL returned', debug: paymentData }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
