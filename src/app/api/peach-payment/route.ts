import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, orderId } = await request.json();

    // ✅ Credentials from secure environment variables
    const entityId = process.env.NEXT_PUBLIC_PEACH_ENTITY_ID;
    const username = process.env.PEACH_USERNAME;
    const password = process.env.PEACH_PASSWORD;

    if (!entityId || !username || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Payment configuration missing' 
      }, { status: 500 });
    }
    
    // Create payment with Peach Payments API
    const response = await fetch('https://test.peachpayments.com/checkout/v1/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
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

    const data = await response.json();
    console.log('Peach API response:', data);

    if (data.result && data.result.code === '000') {
      return NextResponse.json({ 
        success: true, 
        checkoutUrl: data.redirectUrl 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: data.result?.description || 'Payment creation failed' 
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Peach Payments error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create payment session' 
    }, { status: 500 });
  }
}
