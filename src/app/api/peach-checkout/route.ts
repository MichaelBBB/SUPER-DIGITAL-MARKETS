import { NextResponse } from 'next/server';

// Force longer timeout
export const maxDuration = 60;

export async function POST(request: Request) {
  let bodyData;
  try {
    bodyData = await request.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const amountUSD = parseFloat(bodyData.amount);
  if (isNaN(amountUSD) || amountUSD <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }

  const exchangeRate = 18.50; 
  const amountZAR = amountUSD * exchangeRate;
  const amountInCents = Math.round(amountZAR * 100);

  const merchantTransactionId = `SDM-${Date.now()}`;
  const nonce = `UNQ${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  // ✅ LIVE CONFIGURATION
  const CONFIG = {
    entityId: "8acda4cb9e1b546a019e1b5b39ee001c",
    clientId: "c7ee4c96fac5286e2da7b1a5822a80", 
    clientSecret: "gtr2DG1TLo4N8YDwMnD6R1/tnMmLziJee88IJtlkJbccy46xi476gkMzSlOBWPkynLlk3vKvZspDpJHN3R6yXA==", 
    merchantId: "9e65f2c5950c4b8483ffbd225bd6f027",
    tokenUrl: "https://dashboard.peachpayments.com/api/oauth/token",
    checkoutUrl: "https://secure.peachpayments.com/v2/checkout"
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';

  console.log('🚀 [START] Initiating Live Payment Request');
  console.log(' ClientID:', CONFIG.clientId);
  console.log('🌐 Target:', CONFIG.tokenUrl);

  const tokenPayload = JSON.stringify({
    clientId: CONFIG.clientId,
    clientSecret: CONFIG.clientSecret,
    merchantId: CONFIG.merchantId
  });

  try {
    // STEP 1: Get Token with EXPLICIT HEADERS
    const tokenRes = await fetch(CONFIG.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-Key': CONFIG.clientSecret,
        'User-Agent': 'SuperDigitalMarkets-Node/1.0',
        'Connection': 'keep-alive'
      },
      body: tokenPayload,
      cache: 'no-store',
      next: { revalidate: 0 } // Disable Next.js caching
    });

    const tokenText = await tokenRes.text();
    
    console.log(' [TOKEN] Status:', tokenRes.status);
    console.log('📡 [TOKEN] Raw Body:', tokenText); // <--- THIS IS THE KEY LOG

    if (!tokenRes.ok) {
      console.error(' [TOKEN] Authentication Failed!');
      return NextResponse.json({ 
        error: 'Authentication Failed', 
        status: tokenRes.status,
        response: tokenText 
      }, { status: 401 });
    }

    let tokenData;
    try {
      tokenData = JSON.parse(tokenText);
    } catch (e) {
      console.error(' [TOKEN] Invalid JSON Response');
      return NextResponse.json({ error: 'Invalid Response from Peach' }, { status: 502 });
    }

    if (!tokenData.access_token) {
      console.error('❌ [TOKEN] No Access Token in Response');
      return NextResponse.json({ error: 'No Token Received', details: tokenData }, { status: 401 });
    }

    const accessToken = tokenData.access_token;
    console.log('✅ [TOKEN] Success! Token acquired.');

    // STEP 2: Create Checkout
    console.log('💳 [CHECKOUT] Creating Checkout...');
    
    const checkoutPayload = JSON.stringify({
      currency: 'ZAR',
      forceDefaultMethod: false,
      'authentication.entityId': CONFIG.entityId,
      amount: amountInCents,
      merchantTransactionId: merchantTransactionId,
      nonce: nonce,
      shopperResultUrl: `${baseUrl}/payment/success`,
      cancelUrl: `${baseUrl}/payment/cancelled`,
      notificationUrl: `${baseUrl}/api/webhooks/peach`
    });

    const checkoutRes = await fetch(CONFIG.checkoutUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Referer': baseUrl,
        'User-Agent': 'SuperDigitalMarkets-Node/1.0',
        'Connection': 'keep-alive'
      },
      body: checkoutPayload,
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    const checkoutText = await checkoutRes.text();
    console.log('📡 [CHECKOUT] Status:', checkoutRes.status);
    console.log('📡 [CHECKOUT] Raw Body:', checkoutText); // <--- KEY LOG #2

    if (!checkoutRes.ok) {
      console.error('❌ [CHECKOUT] Failed!');
      return NextResponse.json({ 
        error: 'Checkout Failed', 
        status: checkoutRes.status,
        response: checkoutText 
      }, { status: checkoutRes.status });
    }

    let checkoutData;
    try {
      checkoutData = JSON.parse(checkoutText);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid Checkout JSON' }, { status: 502 });
    }

    if (!checkoutData.checkoutId) {
      return NextResponse.json({ error: 'No Checkout ID', details: checkoutData }, { status: 500 });
    }

    console.log('✅ [SUCCESS] Checkout ID:', checkoutData.checkoutId);
    return NextResponse.json({ checkoutId: checkoutData.checkoutId });

  } catch (error: any) {
    console.error('💥 [CRITICAL] Network Error:', error.message);
    return NextResponse.json({ error: 'Network Error', message: error.message }, { status: 500 });
  }
}
