export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, item, currency = 'USD' } = await request.json();

    // 1. Load Credentials
    const clientId = process.env.PEACH_CLIENT_ID;
    const clientSecret = process.env.PEACH_CLIENT_SECRET;
    
    // ⚠️ CRITICAL FIX: Use the CORRECT Merchant ID provided by Peach Support
    // Old (Wrong): 9e65f2c5950c4b483ffbd225bd6f027
    // New (Correct): 9e65f2c5950c4b8483ffbd225bd6f027
    const merchantId = "9e65f2c5950c4b8483ffbd225bd6f027"; 

    if (!clientId || !clientSecret || !merchantId) {
      console.error('❌ MISSING ENV VARS');
      return NextResponse.json({ error: 'Credentials missing' }, { status: 500 });
    }

    console.log('🔑 Using Correct Merchant ID:', merchantId);

    // 2. Prepare Payload EXACTLY as per Peach's instruction
    // - Use camelCase (clientId, merchantId)
    // - NO grant_type
    const tokenBody = {
      clientId: clientId,       
      clientSecret: clientSecret, 
      merchantId: merchantId      
    };

    console.log('📤 Sending Token Request (CamelCase, No Grant Type)...');

    // 3. Fetch Token
    const tokenResponse = await fetch('https://dashboard.peachpayments.com/api/oauth/token', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(tokenBody),
    });

    const tokenText = await tokenResponse.text();
    
    console.log(' PEACH STATUS:', tokenResponse.status);
    console.log(' PEACH RAW RESPONSE:', tokenText);

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { error: 'Token Failed', details: tokenText },
        { status: 401 }
      );
    }

    const tokenData = JSON.parse(tokenText);
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return NextResponse.json({ error: 'No token in response' }, { status: 401 });
    }

    console.log('✅ TOKEN RECEIVED! Creating Checkout...');

    // 4. Create Checkout
    const checkoutResponse = await fetch('https://checkout.peachpayments.com/api/v1/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency: currency.toUpperCase(),
        description: item || 'Digital Product Purchase',
        merchantReference: `ORDER-${Date.now()}`,
        returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment?cancelled=true`,
        webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/peach`,
        customer: { email: 'customer@example.com', firstName: 'Customer', lastName: 'Name' },
        items: [{ name: item, quantity: 1, unitPrice: Math.round(amount * 100) }],
      }),
    });

    if (!checkoutResponse.ok) {
      const errText = await checkoutResponse.text();
      return NextResponse.json({ error: 'Checkout Failed', details: errText }, { status: 500 });
    }

    const checkoutData = await checkoutResponse.json();
    
    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutData.redirectUrl || checkoutData.checkoutUrl,
    });

  } catch (error) {
    console.error('API Crash:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
