import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { amount, orderId } = await request.json();
  
  const clientId = process.env.PEACH_CLIENT_ID;
  const clientSecret = process.env.PEACH_CLIENT_SECRET;
  const merchantId = process.env.PEACH_MERCHANT_ID;
  const entityId = process.env.NEXT_PUBLIC_PEACH_ENTITY_ID;

  // STEP 1: Get JWT Token first
  const tokenResponse = await fetch('https://sandbox-dashboard.peachpayments.com/api/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId, clientSecret, merchantId })
  });

  const tokenData = await tokenResponse.json();
  const jwt = tokenData.jwt || tokenData.access_token;

  if (!jwt) {
    return NextResponse.json({ success: false, error: 'Auth failed' }, { status: 401 });
  }

  // STEP 2: Build hosted checkout URL WITH JWT TOKEN
  const baseUrl = 'https://testsecure.peachpayments.com';
  
  const params = new URLSearchParams({
    entityId: entityId || '',
    amount: amount.toFixed(2),
    currency: 'ZAR',
    paymentType: 'DB',
    merchantTransactionId: orderId,
    shopperResultUrl: 'https://super-digital-markets-co9n.vercel.app/checkout/success',
    token: jwt  // ✅ Add the JWT token to the URL
  });

  const checkoutUrl = `${baseUrl}?${params.toString()}`;
  
  console.log('Generated checkout URL with token');

  return NextResponse.json({ success: true, checkoutUrl });
}
