import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { amount, orderId } = await request.json();

    // ✅ Your verified Hosted Checkout credentials
    const clientId = '8bbf74df6fc2d54792923a42a1ec28';
    const clientSecret = 'gmaIOZ4kaovr4Xu8juDaJ6L8WLb408xLox+GpIdsKzSKjG433T62hnXE2X3xAYgSLMyM5wUDVwT8ByeUhCHN5w==';
    const entityId = '8ac7a4c89d6f2185019d70e1ee0501f3';
    const secretToken = 'dd81d4af792c47148e06ad389cd653f1';
    const merchantId = process.env.PEACH_MERCHANT_ID;

    if (!merchantId) {
      throw new Error('Missing PEACH_MERCHANT_ID in Vercel env vars');
    }

    // Step 1: Get Access Token
    console.log('🔑 Getting access token...');
    const tokenRes = await fetch('https://sandbox-dashboard.peachpayments.com/api/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        clientId,
        clientSecret,
        merchantId
      })
    });

    const tokenText = await tokenRes.text();
    console.log(`Token Status: ${tokenRes.status}`);

    if (!tokenRes.ok) {
      throw new Error(`Token failed (${tokenRes.status}): ${tokenText}`);
    }

    const tokenData = JSON.parse(tokenText);
    const token = tokenData.access_token || tokenData.jwt;
    if (!token) throw new Error('No token in response');

    console.log('✅ Token received. Creating checkout...');

    // Step 2: Create Hosted Checkout Session
    console.log('📝 Creating hosted checkout session...');
    const checkoutRes = await fetch('https://testsecure.peachpayments.com/v2/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Merchant-ID': merchantId,
        'X-Secret-Token': secretToken
      },
      body: JSON.stringify({
        entityId,
        amount: parseFloat(amount).toFixed(2),
        currency: 'ZAR',
        paymentType: 'DB',
        merchantTransactionId: orderId,
        shopperResultUrl: 'https://super-digital-markets-co9n.vercel.app/checkout/success',
        notificationUrl: 'https://super-digital-markets-co9n.vercel.app/api/webhooks/peach'
      })
    });

    const checkoutText = await checkoutRes.text();
    console.log(`Checkout Status: ${checkoutRes.status}`);

    if (!checkoutRes.ok) {
      throw new Error(`Checkout failed (${checkoutRes.status}): ${checkoutText}`);
    }

    const checkoutData = JSON.parse(checkoutText);
    console.log('Checkout response:', checkoutData);

    const redirectUrl = checkoutData.redirectUrl || checkoutData.checkoutUrl;
    
    if (!redirectUrl) {
      throw new Error(`No redirect URL. Response: ${JSON.stringify(checkoutData)}`);
    }

    return NextResponse.json({ success: true, checkoutUrl: redirectUrl });

  } catch (error: any) {
    console.error('💥 Error:', error.message);
    return NextResponse.json({
      step: 'error',
      error: error.message
    }, { status: 500 });
  }
}
