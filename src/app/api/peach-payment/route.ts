import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, orderId } = await request.json();
    
    // Get credentials from environment variables
    const clientId = process.env.PEACH_CLIENT_ID;
    const clientSecret = process.env.PEACH_CLIENT_SECRET;
    const merchantId = process.env.PEACH_MERCHANT_ID;
    const secretToken = process.env.PEACH_SECRET_TOKEN;
    const entityId = process.env.NEXT_PUBLIC_PEACH_ENTITY_ID;

    if (!clientId || !clientSecret || !entityId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Configuration missing. Check Vercel environment variables.' 
      }, { status: 500 });
    }

    // STEP 1: Get OAuth2 access token
    const tokenResponse = await fetch('https://testapi-v2.peachpayments.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
      },
      body: 'grant_type=client_credentials'
    });

    const tokenData = await tokenResponse.json();
    console.log('Token response:', tokenData);

    if (!tokenData.access_token) {
      console.error('Failed to get access token:', tokenData);
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication failed with Peach Payments' 
      }, { status: 401 });
    }

    const accessToken = tokenData.access_token;

    // STEP 2: Create payment session
    const paymentResponse = await fetch('https://testapi-v2.peachpayments.com/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-Merchant-ID': merchantId || '',
        'X-Secret-Token': secretToken || ''
      },
      body: JSON.stringify({
        entityId: entityId,
        amount: amount.toFixed(2),
        currency: 'ZAR',
        paymentType: 'DB',
        merchantTransactionId: orderId,
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
        },
        shopperResultUrl: 'https://super-digital-markets-co9n.vercel.app/checkout/success'
      })
    });

    const paymentData = await paymentResponse.json();
    console.log('Payment response:', paymentData);

    // STEP 3: Return checkout URL
    if (paymentData.redirectUrl || paymentData.checkoutUrl) {
      return NextResponse.json({ 
        success: true, 
        checkoutUrl: paymentData.redirectUrl || paymentData.checkoutUrl 
      });
    } else {
      console.error('No checkout URL in response:', paymentData);
      return NextResponse.json({ 
        success: false, 
        error: 'No checkout URL returned from Peach Payments',
        debug: paymentData 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Peach Payments error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Server error' 
    }, { status: 500 });
  }
}
