import { NextResponse } from 'next/server';

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
  
  const CONFIG = {
    entityId: "8acda4cb9e1b546a019e1b5b39ee001c",
    clientId: "c7ee4c96fac5286e2da7b1a5822a80", 
    clientSecret: "gtr2DG1TLo4N8YDwMnD6R1/tnMmLziJee88IJtlkJbccy46xi476gkMzSlOBWPkynLlk3vKvZspDpJHN3R6yXA==", 
    merchantId: "9e65f2c5950c4b8483ffbd225bd6f027",
    tokenUrl: "https://dashboard.peachpayments.com/api/oauth/token",
    checkoutUrl: "https://secure.peachpayments.com/v2/checkout"
  };

  // ⚠️ CRITICAL FIX: HARDCODE THE EXACT URL PEACH EXPECTS
  // Do NOT use process.env here. It must match their allowlist exactly.
  const ALLOWED_REFERER = 'https://super-digital-markets-co9n.vercel.app';

  console.log('🚀 [START] Initiating Payment with Hardcoded Referer');

  // STEP 1: Get Token
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
        'Accept': 'application/json',
      },
      body: tokenPayload,
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    const tokenText = await tokenRes.text();
    
    if (!tokenRes.ok) {
      console.error(' [TOKEN] Failed:', tokenText);
      return NextResponse.json({ error: 'Auth Failed', details: tokenText }, { status: 401 });
    }

    const tokenData = JSON.parse(tokenText);
    if (!tokenData.access_token) {
      return NextResponse.json({ error: 'No Token', details: tokenData }, { status: 401 });
    }

    const accessToken = tokenData.access_token;
    console.log('✅ [TOKEN] Success');

    // STEP 2: Create Checkout
    console.log('💳 [CHECKOUT] Creating Session...');
    
    // ⚠️ PAYLOAD STRUCTURE: Nested 'authentication' object as per Peach Curl
    const checkoutPayload = JSON.stringify({
      authentication: {
        entityId: CONFIG.entityId
      },
      amount: amountInCents,
      currency: 'ZAR',
      merchantTransactionId: merchantTransactionId,
      nonce: nonce,
      shopperResultUrl: `${ALLOWED_REFERER}/payment/success`,
      cancelUrl: `${ALLOWED_REFERER}/payment/cancelled`,
      notificationUrl: `${ALLOWED_REFERER}/api/webhooks/peach`,
      forceDefaultMethod: false
    });

    const checkoutRes = await fetch(CONFIG.checkoutUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        // ⚠️ CRITICAL: HARDCODED REFERER HEADER (Mandatory per Peach)
        'Referer': ALLOWED_REFERER, 
      },
      body: checkoutPayload,
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    const checkoutText = await checkoutRes.text();
    console.log(' [CHECKOUT] Status:', checkoutRes.status);
    
    // Log the full response for debugging if it fails again
    if (!checkoutRes.ok) {
      console.error('❌ [CHECKOUT] FAILED RESPONSE:', checkoutText);
    } else {
      console.log('✅ [CHECKOUT] Success Body:', checkoutText);
    }

    if (!checkoutRes.ok) {
      return NextResponse.json({ 
        error: 'Checkout Failed', 
        status: checkoutRes.status,
        response: checkoutText 
      }, { status: checkoutRes.status });
    }

    const checkoutData = JSON.parse(checkoutText);

    if (!checkoutData.checkoutId) {
      return NextResponse.json({ error: 'No Checkout ID', details: checkoutData }, { status: 500 });
    }

    console.log('✅ [SUCCESS] Checkout ID:', checkoutData.checkoutId);
    return NextResponse.json({ checkoutId: checkoutData.checkoutId });

  } catch (error: any) {
    console.error(' [CRITICAL] Error:', error.message);
    return NextResponse.json({ error: 'System Error', message: error.message }, { status: 500 });
  }
}
