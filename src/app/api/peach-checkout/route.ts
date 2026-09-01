import { NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(request: Request) {
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

  const exchangeRate = 18.50; 
  const amountZAR = amountUSD * exchangeRate;
  const amountInCents = Math.round(amountZAR * 100);

  const merchantTransactionId = `SDM-${Date.now()}`;
  const nonce = `UNQ${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  // ✅ CONFIRMED LIVE CONFIGURATION
  const CONFIG = {
    entityId: "8acda4cb9e1b546a019e1b5b39ee001c",
    clientId: "c7ee4c96fac5286e2da7b1a5822a80", 
    clientSecret: "gtr2DG1TLo4N8YDwMnD6R1/tnMmLziJee88IJtlkJbccy46xi476gkMzSlOBWPkynLlk3vKvZspDpJHN3R6yXA==", 
    merchantId: "9e65f2c5950c4b8483ffbd225bd6f027",
    tokenUrl: "https://dashboard.peachpayments.com/api/oauth/token",
    checkoutUrl: "https://secure.peachpayments.com/v2/checkout"
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';

  console.log('🔑 [DIAGNOSTIC] Starting Live Token Request...');
  console.log('🔑 [DIAGNOSTIC] ClientID:', CONFIG.clientId.substring(0, 5) + '...');
  console.log('🔑 [DIAGNOSTIC] Target URL:', CONFIG.tokenUrl);

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
        'User-Agent': 'SuperDigitalMarkets-Live/1.0'
      },
      body: tokenPayload,
      cache: 'no-store' 
    });

    const tokenText = await tokenRes.text();
    
    // ⚠️ CRITICAL: Log the EXACT raw response from Peach
    console.log('📡 [DIAGNOSTIC] RAW Token Response Status:', tokenRes.status);
    console.log('📡 [DIAGNOSTIC] RAW Token Response Body:', tokenText);

    let tokenData;
    try {
      tokenData = JSON.parse(tokenText);
    } catch (e) {
      console.error('❌ [DIAGNOSTIC] Response was not valid JSON.');
      return NextResponse.json({ 
        error: 'Peach returned non-JSON response', 
        rawBody: tokenText 
      }, { status: 502 });
    }

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('❌ [DIAGNOSTIC] AUTH FAILED. Details:', JSON.stringify(tokenData));
      return NextResponse.json({ 
        error: 'Authentication Failed', 
        details: tokenData,
        status: tokenRes.status 
      }, { status: 401 });
    }

    const accessToken = tokenData.access_token;
    console.log('✅ [DIAGNOSTIC] Token Acquired Successfully');

    console.log('💳 [DIAGNOSTIC] Creating Checkout...');
    
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
        'User-Agent': 'SuperDigitalMarkets-Live/1.0'
      },
      body: checkoutPayload,
      cache: 'no-store'
    });

    const checkoutText = await checkoutRes.text();
    console.log(' [DIAGNOSTIC] RAW Checkout Response Status:', checkoutRes.status);
    console.log('📡 [DIAGNOSTIC] RAW Checkout Response Body:', checkoutText);

    let checkoutData;
    try {
      checkoutData = JSON.parse(checkoutText);
    } catch (e) {
      return NextResponse.json({ 
        error: 'Peach returned invalid checkout JSON', 
        rawBody: checkoutText 
      }, { status: 502 });
    }

    if (!checkoutRes.ok || !checkoutData.checkoutId) {
      console.error(' [DIAGNOSTIC] Checkout Failed:', JSON.stringify(checkoutData));
      return NextResponse.json({ 
        error: 'Checkout Failed', 
        details: checkoutData 
      }, { status: checkoutRes.status });
    }

    console.log('✅ [DIAGNOSTIC] Success! Checkout ID:', checkoutData.checkoutId);
    return NextResponse.json({ checkoutId: checkoutData.checkoutId });

  } catch (error: any) {
    console.error('💥 [DIAGNOSTIC] Network/System Error:', error.message);
    return NextResponse.json({ 
      error: 'Connection Error', 
      message: error.message 
    }, { status: 500 });
  }
}import { NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(request: Request) {
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

  // Convert USD to ZAR then to Cents
  const exchangeRate = 18.50; 
  const amountZAR = amountUSD * exchangeRate;
  const amountInCents = Math.round(amountZAR * 100);

  const merchantTransactionId = `SDM-${Date.now()}`;
  const nonce = `UNQ${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  // ✅ UPDATED WITH YOUR NEW REGENERATED KEYS
  const CONFIG = {
    entityId: "8acda4cb9e1b546a019e1b5b39ee001c",
    clientId: "c7ee4c96fac5286e2da7b1a5822a80", // ← NEW CLIENT ID
    clientSecret: "gtr2DG1TLo4N8YDwMnD6R1/tnMmLziJee88IJtlkJbccy46xi476gkMzSlOBWPkynLlk3vKvZspDpJHN3R6yXA==", // ← NEW CLIENT SECRET
    merchantId: "9e65f2c5950c4b8483ffbd225bd6f027",
    tokenUrl: "https://dashboard.peachpayments.com/api/oauth/token",
    checkoutUrl: "https://secure.peachpayments.com/v2/checkout"
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';

  console.log('🔑 [Peach API] Attempting Token Generation with NEW keys...');

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
        'User-Agent': 'SuperDigitalMarkets/1.0'
      },
      body: tokenPayload,
      cache: 'no-store' 
    });

    const tokenText = await tokenRes.text();
    let tokenData;
    try {
      tokenData = JSON.parse(tokenText);
    } catch (e) {
      console.error(' [Peach API] Token response was not JSON:', tokenText.substring(0, 200));
      return NextResponse.json({ 
        error: 'Peach returned invalid response', 
        rawResponse: tokenText.substring(0, 200)
      }, { status: 502 });
    }

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('❌ [Peach API] Token Auth Failed:', tokenRes.status, tokenData);
      return NextResponse.json({ 
        error: 'Authentication Failed - Check Credentials', 
        details: tokenData,
        status: tokenRes.status 
      }, { status: 401 });
    }

    const accessToken = tokenData.access_token;
    console.log('✅ [Peach API] Token Received Successfully');

    console.log('💳 [Peach API] Creating Checkout...');
    
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
      console.error('❌ [Peach API] Checkout response was not JSON:', checkoutText.substring(0, 200));
      return NextResponse.json({ 
        error: 'Peach returned invalid checkout response', 
        rawResponse: checkoutText.substring(0, 200)
      }, { status: 502 });
    }

    if (!checkoutRes.ok || !checkoutData.checkoutId) {
      console.error('❌ [Peach API] Checkout Failed:', checkoutRes.status, checkoutData);
      return NextResponse.json({ 
        error: 'Checkout Creation Failed', 
        details: checkoutData,
        status: checkoutRes.status 
      }, { status: checkoutRes.status });
    }

    console.log('✅ [Peach API] Checkout ID:', checkoutData.checkoutId);
    return NextResponse.json({ checkoutId: checkoutData.checkoutId });

  } catch (error: any) {
    console.error('💥 [Peach API] Critical System Error:', error.message);
    return NextResponse.json({ 
      error: 'Gateway Connection Error', 
      message: error.message 
    }, { status: 500 });
  }
}
