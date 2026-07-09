import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { amount, orderId } = await request.json();

    // ✅ Verified Credentials
    const clientId = '8bbf74df6fc2d54792923a42a1ec28';
    const clientSecret = 'gmaIOZ4kaovr4Xu8juDaJ6L8WLb408xLox+GpIdsKzSKjG433T62hnXE2X3xAYgSLMyM5wUDVwT8ByeUhCHN5w==';
    const entityId = '8ac7a4c89d6f2185019d70e1ee0501f3';
    const secretToken = 'dd81d4af792c47148e06ad389cd653f1';
    const merchantId = process.env.PEACH_MERCHANT_ID;

    if (!merchantId) {
      throw new Error('Missing merchantId');
    }

    // Step 1: Get Access Token
    const tokenRes = await fetch('https://sandbox-dashboard.peachpayments.com/api/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ clientId, clientSecret, merchantId })
    });

    const tokenText = await tokenRes.text();
    if (!tokenRes.ok) throw new Error(`Token failed: ${tokenText}`);

    const tokenData = JSON.parse(tokenText);
    const token = tokenData.access_token || tokenData.jwt;
    if (!token) throw new Error('No token received');

    // ✅ Generate unique NONCE and Transaction ID
    const nonce = crypto.randomUUID();
    const merchantTransactionId = `SD-${orderId}-${Date.now()}`;

    // Step 2: Create Hosted Checkout Session
    const checkoutRes = await fetch('https://testsecure.peachpayments.com/v2/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Merchant-ID': merchantId,
        'X-Secret-Token': secretToken,
        // ✅ Use the exact domain from your screenshot
        'Referer': 'https://super-digital-markets-co9n-pc05aa1os-michaelbbb-projects.vercel.app',
        'Origin': 'https://super-digital-markets-co9n-pc05aa1os-michaelbbb-projects.vercel.app'
      },
      body: JSON.stringify({
        entityId: entityId,
        amount: parseFloat(amount).toFixed(2),
        currency: 'ZAR',
        paymentType: 'DB',
        merchantTransactionId: merchantTransactionId,
        nonce: nonce,
        shopperResultUrl: 'https://super-digital-markets-co9n.vercel.app/checkout/success',
        notificationUrl: 'https://super-digital-markets-co9n.vercel.app/api/webhooks/peach'
      })
    });

    const checkoutText = await checkoutRes.text();

    if (!checkoutRes.ok) {
      throw new Error(`Checkout failed (${checkoutRes.status}): ${checkoutText}`);
    }

    const checkoutData = JSON.parse(checkoutText);
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
