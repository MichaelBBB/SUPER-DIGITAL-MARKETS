import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const amount = body.amount || '10.00';

    // Try all possible token names
    const token = process.env.PEACH_BEARER_TOKEN || process.env.PEACH_AUTH_TOKEN || process.env.PEACH_TOKEN;
    const entityId = process.env.PEACH_ENTITY_ID;
    const apiUrl = process.env.PEACH_API_URL || 'https://oppwa.com';

    // CHECK 1: Do we have the keys?
    if (!token || !entityId) {
      return NextResponse.json({ 
        error: 'MISSING KEYS',
        tokenFound: !!token,
        entityIdFound: !!entityId,
        availableKeys: Object.keys(process.env).filter(k => k.includes('PEACH'))
      }, { status: 500 });
    }

    // CHECK 2: Build the request
    const formData = new URLSearchParams();
    formData.append('entityId', entityId);
    formData.append('amount', parseFloat(amount).toFixed(2));
    formData.append('currency', 'USD');
    formData.append('paymentType', 'DB');
    formData.append('merchantTransactionId', `INV-${Date.now()}`);

    // CHECK 3: Send to Peach
    const response = await fetch(`${apiUrl}/v1/checkouts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { rawResponse: text };
    }

    // CHECK 4: Did Peach accept it?
    if (!response.ok) {
      return NextResponse.json({ 
        error: 'PEACH REJECTED',
        statusCode: response.status,
        peachResponse: data
      }, { status: 500 });
    }

    // CHECK 5: Do we have a checkout ID?
    if (!data.id) {
      return NextResponse.json({ 
        error: 'NO CHECKOUT ID',
        peachResponse: data
      }, { status: 500 });
    }

    // SUCCESS: Build the redirect URL
    const paymentUrl = `${apiUrl}/v1/checkouts/${data.id}/payment`;
    return NextResponse.json({ 
      url: paymentUrl, 
      checkoutId: data.id 
    });

  } catch (error: any) {
    return NextResponse.json({ 
      error: 'CODE CRASHED',
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
