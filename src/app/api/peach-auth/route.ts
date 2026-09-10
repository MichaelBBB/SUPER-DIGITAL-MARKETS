// FORCE DYNAMIC RENDERING TO ENSURE ENV VARS ARE LOADED AT RUNTIME
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, item, currency = 'USD' } = await request.json();

    // 1. LOAD CREDENTIALS FROM ENVIRONMENT VARIABLES
    const clientId = process.env.PEACH_CLIENT_ID;
    const clientSecret = process.env.PEACH_CLIENT_SECRET;
    const merchantId = process.env.PEACH_MERCHANT_ID;

    // DEBUG: Check if keys exist (logs first 5 chars only for security)
    console.log('🔑 Checking Credentials...');
    console.log('Client ID:', clientId ? `${clientId.substring(0, 5)}...` : 'MISSING');
    console.log('Client Secret:', clientSecret ? `${clientSecret.substring(0, 5)}...` : 'MISSING');
    console.log('Merchant ID:', merchantId ? `${merchantId.substring(0, 5)}...` : 'MISSING');

    if (!clientId || !clientSecret || !merchantId) {
      console.error('❌ ERROR: Credentials are missing in Vercel Environment Variables!');
      return NextResponse.json(
        { error: 'Server Configuration Error: Missing Credentials' },
        { status: 500 }
      );
    }

    // 2. PREPARE PAYLOAD WITH CORRECT FIELD NAMES (UNDERSCORES)
    // Peach Payments REQUIRES client_id, client_secret, merchant_id (NOT camelCase)
    const tokenBody = {
      client_id: clientId,       
      client_secret: clientSecret, 
      merchant_id: merchantId,     
      grant_type: 'client_credentials' // REQUIRED by OAuth 2.0
    };

    console.log('📤 Sending Token Request to Peach...');
    console.log('Payload Keys:', Object.keys(tokenBody));

    // 3. FETCH ACCESS TOKEN
    const tokenResponse = await fetch('https://dashboard.peachpayments.com/api/oauth/token', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(tokenBody),
    });

    const tokenText = await tokenResponse.text();
    
    // 4. LOG THE EXACT RESPONSE FROM PEACH (THIS IS THE TRUTH)
    console.log('🍑 PEACH STATUS:', tokenResponse.status);
    console.log(' PEACH RAW RESPONSE:', tokenText);

    if (!tokenResponse.ok) {
      console.error('❌ Token Request Failed:', tokenText);
      return NextResponse.json(
        { 
          error: 'Token Failed', 
          details: tokenText, // This will show the exact error from Peach
          status: tokenResponse.status 
        },
        { status: 401 }
      );
    }

    // 5. PARSE TOKEN
    let tokenData;
    try {
      tokenData = JSON.parse(tokenText);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      return NextResponse.json({ error: 'Invalid JSON from Peach' }, { status: 500 });
    }

    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error('No access_token in response:', tokenData);
      return NextResponse.json({ error: 'No Token Received', details: tokenData }, { status: 401 });
    }

    console.log('✅ ACCESS TOKEN RECEIVED SUCCESSFULLY!');

    // 6. CREATE CHECKOUT SESSION
    console.log('Creating Checkout Session...');
    const checkoutResponse = await fetch('https://checkout.peachpayments.com/api/v1/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toUpperCase(),
        description: item || 'Digital Product Purchase',
        merchantReference: `ORDER-${Date.now()}`,
        returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment?cancelled=true`,
        webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/peach`,
        customer: { 
          email: 'customer@example.com', 
          firstName: 'Customer', 
          lastName: 'Name' 
        },
        items: [
          {
            name: item || 'Digital Product',
            quantity: 1,
            unitPrice: Math.round(amount * 100),
          },
        ],
      }),
    });

    if (!checkoutResponse.ok) {
      const errText = await checkoutResponse.text();
      console.error('Checkout Failed:', errText);
      return NextResponse.json({ error: 'Checkout Failed', details: errText }, { status: 500 });
    }

    const checkoutData = await checkoutResponse.json();
    
    console.log('✅ CHECKOUT CREATED! Redirecting user...');
    
    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutData.redirectUrl || checkoutData.checkoutUrl || checkoutData.url,
    });

  } catch (error) {
    console.error('💥 API CRASH:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown' }, { status: 500 });
  }
}
