import { NextResponse } from 'next/server';

// Force longer timeout for payment gateways
export const maxDuration = 60;

export async function POST(request: Request) {
  // 1. Parse Input
  let bodyData;
  try {
    bodyData = await request.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const amountUSD = parseFloat(bodyData.amount);
  if (isNaN(amountUSD) || amountUSD <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }

  // Convert USD to ZAR (approx rate) then to Cents
  const exchangeRate = 18.50; 
  const amountZAR = amountUSD * exchangeRate;
  const amountInCents = Math.round(amountZAR * 100);

  const merchantTransactionId = `SDM-${Date.now()}`;
  const nonce = `UNQ${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  // ⚠️ CRITICAL: Ensure these match your Peach Dashboard EXACTLY
  // If your dashboard says "Test", use the Test URLs. If "Live", use Live URLs.
  // Based on your previous success with cURL, we assume these are correct.
  const CONFIG = {
    entityId: "8acda4cb9e1b546a019e1b5b39ee001c",
    clientId: "482b18ada7a76c073840eba492cbe7",
    clientSecret: "XcQNWhy52Bqbe1i9mAseFg+TzKI5YW3WjKJEUPKB5FMWjPvG0cdyX64bkw8FqDAazrZXnIokvWUn9AlX1PeXew==",
    merchantId: "9e65f2c5950c4b8483ffbd225bd6f027",
    tokenUrl: "https://dashboard.peachpayments.com/api/oauth/token",
    checkoutUrl: "https://secure.peachpayments.com/v2/checkout"
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';

  console.log(' [RAW] Attempting Token Generation...');

  // 2. STEP 1: Get Token (Raw Fetch)
  const tokenPayload = JSON.stringify({
    clientId: CONFIG.clientId,
    clientSecret: CONFIG.clientSecret,
    merchantId: CONFIG.merchantId
  });

  try {
    const tokenRes = await fetch(CONFIG.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': CONFIG.clientSecret,
        'Accept': 'application/json',
        'User-Agent': 'SuperDigitalMarkets/1.0' // Some gateways require a User-Agent
      },
      body: tokenPayload,
      // Disable caching to ensure fresh token
      cache: 'no-store' 
    });

    const tokenText = await tokenRes.text();
    let tokenData;
    try {
      tokenData = JSON.parse(tokenText);
    } catch (e) {
      console.error('❌ [RAW] Token response was not JSON:', tokenText);
      return NextResponse.json({ 
        error: 'Peach returned invalid JSON for token', 
        rawResponse: tokenText 
      }, { status: 502 });
    }

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error(' [RAW] Token Auth Failed:', tokenRes.status, tokenData);
      return NextResponse.json({ 
        error: 'Authentication Failed', 
        details: tokenData,
        status: tokenRes.status 
      }, { status: 401 });
    }

    const accessToken = tokenData.access_token;
    console.log('✅ [RAW] Token Received');

    // 3. STEP 2: Create Checkout (Raw Fetch)
    console.log('💳 [RAW] Creating Checkout...');
    
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
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Referer': baseUrl,
        'User-Agent': 'SuperDigitalMarkets/1.0'
      },
      body: checkoutPayload,
      cache: 'no-store'
    });

    const checkoutText = await checkoutRes.text();
    let checkoutData;
    try {
      checkoutData = JSON.parse(checkoutText);
    } catch (e) {
      console.error('❌ [RAW] Checkout response was not JSON:', checkoutText);
      return NextResponse.json({ 
        error: 'Peach returned invalid JSON for checkout', 
        rawResponse: checkoutText 
      }, { status: 502 });
    }

    if (!checkoutRes.ok || !checkoutData.checkoutId) {
      console.error('❌ [RAW] Checkout Failed:', checkoutRes.status, checkoutData);
      return NextResponse.json({ 
        error: 'Checkout Creation Failed', 
        details: checkoutData,
        status: checkoutRes.status 
      }, { status: checkoutRes.status });
    }

    console.log('✅ [RAW] Checkout ID:', checkoutData.checkoutId);
    return NextResponse.json({ checkoutId: checkoutData.checkoutId });

  } catch (error: any) {
    console.error('💥 [RAW] Critical System Error:', error.message);
    return NextResponse.json({ 
      error: 'Gateway Connection Error', 
      message: error.message 
    }, { status: 500 });
  }
}
