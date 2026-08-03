import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, currency, orderId } = body;

    // 1. Get your Live Peach Credentials from Environment Variables
    const entityId = process.env.NEXT_PUBLIC_PEACH_ENTITY_ID;
    const secretToken = process.env.PEACH_SECRET_TOKEN;

    if (!entityId || !secretToken) {
      return NextResponse.json({ error: 'Missing Peach credentials' }, { status: 500 });
    }

    // 2. Prepare the Authorization Header (Basic Auth)
    const authHeader = 'Basic ' + Buffer.from(`${entityId}:${secretToken}`).toString('base64');

    // 3. Prepare the Data for Peach Payments (Live URL)
    const peachUrl = 'https://eu-prod.oppwa.com/v1/checkouts';

    const payload = new URLSearchParams({
      entity_id: entityId,
      amount: amount.toString(), 
      currency: currency,        
      paymentType: 'DB',         
      merchant_transaction_id: orderId,
      customer_givenName: 'Guest',
      customer_surname: 'User',
      customer_email: 'guest@example.com', 
      billing_street1: '123 Main St',
      billing_city: 'Johannesburg',
      billing_state: 'GP',
      billing_postcode: '2000',
      billing_country: 'ZA',
    });

    // 4. Send Request to Peach
    const response = await fetch(peachUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload.toString(),
    });

    const data = await response.json();

    if (data.result.code === '000.000.000' || data.result.code === '000.100.110') {
      return NextResponse.json({ 
        success: true, 
        checkoutUrl: data.buildUrl 
      });
    } else {
      console.error('Peach Error:', data);
      return NextResponse.json({ 
        success: false, 
        error: data.result.description 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
