// src/app/api/peach-checkout/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amount = body.amount;
    const currency = body.currency || 'ZAR';

    console.log(' Received request:', { amount, currency });

    // Your credentials
    const entityId = "8acda4cb9e1b546a019e1b5b39ee001c";
    const authToken = "58c4748b406945d8802cf0f7997456e0";
    
    console.log('🔑 Using credentials:', { 
      entityId: entityId.substring(0, 8) + '...',
      authToken: authToken.substring(0, 8) + '...'
    });

    // Try v1 endpoint first
    const apiUrl = "https://peachpayments.com/v1/checkouts";
    
    console.log(' Calling API:', apiUrl);

    const requestBody = {
      amount: amount,
      currency: currency,
      entityid: entityId,
      paymentType: 'DB',
      testMode: '0',
    };

    console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

    const responseData = await response.json();
    console.log('📥 Response data:', JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      console.error('❌ API call failed:', responseData);
      return NextResponse.json({ 
        error: responseData.description || 'Payment initialization failed',
        debug: {
          status: response.status,
          data: responseData
        }
      }, { status: response.status });
    }

    if (!responseData.id) {
      console.error('❌ No checkout ID in response:', responseData);
      return NextResponse.json({ 
        error: 'No checkout ID returned',
        debug: responseData
      }, { status: 500 });
    }

    console.log('✅ Success! Checkout ID:', responseData.id);
    return NextResponse.json({ checkoutId: responseData.id });

  } catch (error: any) {
    console.error('💥 Unexpected error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
