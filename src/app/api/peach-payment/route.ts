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

    // STEP 2: Create Checkout Session - Try with ALL required fields
    const checkoutPayload = {
      entityId: entityId,
      amount: amount.toFixed(2),
      currency: 'ZAR',
      paymentType: 'DB', // Debit
      merchantTransactionId: orderId,
      shopperResultUrl: 'https://super-digital-markets-co9n.vercel.app/checkout/success',
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
    };

    console.log('Sending to Peach:', checkoutPayload);

    const checkoutResponse = await fetch('https://testsecure.peachpayments.com/v2/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(checkoutPayload)
    });

    const checkoutData = await checkoutResponse.json();
    console.log('Peach response status:', checkoutResponse.status);
    console.log('Peach response:', checkoutData);

    // Try all possible field names
    const redirectUrl = 
      checkoutData.redirectUrl || 
      checkoutData.checkoutUrl || 
      checkoutData.url ||
      checkoutData._links?.checkout?.href ||
      (checkoutData.id ? `https://testsecure.peachpayments.com/checkout/${checkoutData.id}` : null);

    if (redirectUrl) {
      return NextResponse.json({ success: true, checkoutUrl: redirectUrl });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'No redirect URL',
        peachStatus: checkoutResponse.status,
        peachResponse: checkoutData 
      }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Server error' 
    }, { status: 500 });
  }
}
