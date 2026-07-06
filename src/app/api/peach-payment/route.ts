import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { amount, orderId } = await request.json();
  const entityId = process.env.NEXT_PUBLIC_PEACH_ENTITY_ID;

  // Build direct hosted checkout URL - NO API, NO AUTH, NO ERRORS
  const params = new URLSearchParams({
    entityId: entityId || '',
    amount: amount.toFixed(2),
    currency: 'ZAR',
    paymentType: 'DB',
    merchantTransactionId: orderId,
    'customer.email': 'customer@example.com',
    'customer.givenName': 'Test',
    'customer.surname': 'Customer',
    'billing.street1': '123 Test Street',
    'billing.city': 'Johannesburg',
    'billing.postcode': '2000',
    'billing.country': 'ZA',
    'shopper.resultUrl': 'https://super-digital-markets-co9n.vercel.app/checkout/success'
  });

  const checkoutUrl = `https://test.peachpayments.com/checkout?${params.toString()}`;

  return NextResponse.json({ success: true, checkoutUrl });
}
