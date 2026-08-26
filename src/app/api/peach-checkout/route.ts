// src/app/api/peach-checkout/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency } = body;

    // Log what we're receiving
    console.log(' Received request:', { amount, currency });

    // Check environment variables
    const entityId = process.env.PEACH_ENTITY_ID;
    const authToken = process.env.PEACH_SECRET_TOKEN;
    const env = process.env.PEACH_ENV || 'sandbox';

    console.log('🔍 Environment check:', {
      hasEntityId: !!entityId,
      hasAuthToken: !!authToken,
      env: env,
      entityIdPreview: entityId ? entityId.substring(0, 8) + '...' : 'MISSING',
    });

    // Validate required vars
    if (!entityId) {
      console.error('❌ Missing PEACH_ENTITY_ID');
      return NextResponse.json({ 
        error: 'Configuration error',
        message: 'Missing PEACH_ENTITY_ID environment variable'
      }, { status: 500 });
    }

    if (!authToken) {
      console.error('❌ Missing PEACH_SECRET_TOKEN');
      return NextResponse.json({ 
        error: 'Configuration error',
        message: 'Missing PEACH_SECRET_TOKEN environment variable'
      }, { status: 500 });
    }

    // Build the request
    const baseUrl = env === 'live' 
      ? 'https://peachpayments.com/v1/checkouts' 
      : 'https://test.peachpayments.com/v1/checkouts';

    const payload = {
      amount: amount.toString(),
      currency: currency || 'ZAR',
      entityid: entityId,
      paymentType: 'DB',
      testMode: env === 'live' ? '0' : '1',
      merchantTransactionId: `SDM-${Date.now()}`,
    };

    console.log('📡 Calling Peach API:', {
      url: baseUrl,
      payload: { ...payload, entityid: payload.entityid.substring(0, 8) + '...' }
    });

    // Make the API call
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    console.log('📥 Peach API Response:', {
      status: response.status,
      ok: response.ok,
      hasId: !!data.id,
      data: response.ok ? { id: data.id } : data
    });

    if (!response.ok) {
      console.error('❌ Peach API Error:', data);
      return NextResponse.json({ 
        error: data.description || 'Payment initialization failed',
        details: data
      }, { status: response.status });
    }

    if (!data.id) {
      console.error('❌ No checkout ID returned:', data);
      return NextResponse.json({ 
        error: 'No checkout ID returned',
        details: data
      }, { status: 500 });
    }

    return NextResponse.json({ checkoutId: data.id });

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
