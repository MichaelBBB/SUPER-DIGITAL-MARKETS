import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { amount, orderId } = await request.json();
  const entityId = process.env.NEXT_PUBLIC_PEACH_ENTITY_ID;

  // Build hosted checkout URL directly (no API call needed)
  const baseUrl = 'https://testsecure.peachpayments.com';
  
  const params = new URLSearchParams({
    entityId: entityId || '',
    amount: amount.toFixed(2),
    currency: 'ZAR',
    paymentType: 'DB',
    merchantTransactionId: orderId,
    shopperResultUrl: 'https://super-digital-markets-co9n.vercel.app/checkout/success'
  });

  const checkoutUrl = `${baseUrl}?${params.toString()}`;
  
  console.log('Generated checkout URL:', checkoutUrl);

  return NextResponse.json({ success: true, checkoutUrl });
}
