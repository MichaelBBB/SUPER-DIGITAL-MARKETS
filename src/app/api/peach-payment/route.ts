import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { amount, orderId } = await request.json();

    // ✅ Use your NEW verified credentials
    const clientId = '8bbf74df6fc2d54792923a42a1ec28';
    const clientSecret = 'gmaIOZ4kaovr4Xu8juDaJ6L8WLb408xLox+GpIdsKzSKjG433T62hnXE2X3xAYgSLMyM5wUDVwT8ByeUhCHN5w==';
    const merchantId = process.env.PEACH_MERCHANT_ID;
    const entityId = process.env.NEXT_PUBLIC_PEACH_ENTITY_ID;

    if (!merchantId || !entityId) {
      throw new Error('Missing merchantId or entityId in Vercel env vars');
    }

    // 1️⃣ Get Access Token (Embedded Checkout uses same OAuth flow)
    console.log('🔑 Requesting token with Embedded Checkout credentials...');
    const tokenRes = await fetch('https://sandbox-dashboard.peachpayments.com/api/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ clientId, clientSecret, merchantId })
    });

    const tokenText = await tokenRes.text();
    console.log(`Token Status: ${tokenRes.status}`);

    if (!tokenRes.ok) {
      throw new Error(`Token failed (${tokenRes.status}): ${tokenText}`);
    }

    const tokenData = JSON.parse(tokenText);
    const token = tokenData.access_token || tokenData.jwt;
    if (!token) throw new Error('No token returned');

    console.log('✅ Token received. Creating Embedded Checkout session...');

    // 2️⃣ Create Embedded Checkout Session
    // Endpoint for Embedded Checkout (from your docs)
    const checkoutRes = await fetch('https://testsecure.peachpayments.com/v2/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        entityId,
        amount: parseFloat(amount).toFixed(2),
        currency: 'ZAR',
        merchantTransactionId: orderId,
        shopperResultUrl: 'https://super-digital-markets-co9n.vercel.app/checkout/success',
        notificationUrl: 'https://super-digital-markets-co9n.vercel.app/api/webhooks/peach',
        // ✅ Embedded Checkout specific: request a session token, not redirect
        integrationType: 'embedded',
        returnMethod: 'POST'
      })
    });

    const checkoutText = await checkoutRes.text();
    console.log(`Checkout Status: ${checkoutRes.status}`);

    if (!checkoutRes.ok) {
      throw new Error(`Checkout failed (${checkoutRes.status}): ${checkoutText}`);
    }

    const checkoutData = JSON.parse(checkoutText);
    console.log('Checkout response:', checkoutData);

    // ✅ Embedded Checkout returns checkoutId/sessionToken, not redirectUrl
    const checkoutId = checkoutData.checkoutId || checkoutData.id || checkoutData.sessionToken;
    const redirectUrl = checkoutData.redirectUrl || checkoutData.checkoutUrl;

    if (checkoutId) {
      // Return the checkout ID for frontend to use with Peach's JS SDK
      return NextResponse.json({ 
        success: true, 
        checkoutId,
        // Also include redirectUrl as fallback if they want to redirect instead
        checkoutUrl: redirectUrl || `https://testsecure.peachpayments.com/embedded/${checkoutId}`
      });
    } else if (redirectUrl) {
      return NextResponse.json({ success: true, checkoutUrl: redirectUrl });
    } else {
      throw new Error(`No checkoutId or redirectUrl. Response: ${JSON.stringify(checkoutData)}`);
    }

  } catch (error: any) {
    console.error('💥 Error:', error.message);
    return NextResponse.json({
      step: 'api_error',
      error: error.message
    }, { status: 500 });
  }
}
