import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, orderId } = await request.json();
    const entityId = process.env.NEXT_PUBLIC_PEACH_ENTITY_ID;

    // Build the hosted checkout URL directly (no API call)
    const baseUrl = 'https://testsecure.peachpayments.com/checkout';
    
    const params = new URLSearchParams({
      entityId: entityId || '',
      amount: amount.toFixed(2),
      currency: 'ZAR',
      paymentType: 'DB',
      merchantTransactionId: orderId,
      customerEmail: 'customer@example.com',
      customerGivenName: 'Test',
      customerSurname: 'Customer',
      billingStreet1: '123 Test Street',
      billingCity: 'Johannesburg',
      billingPostcode: '2000',
      billingCountry: 'ZA',
      shopperResultUrl: 'https://super-digital-markets-co9n.vercel.app/checkout/success'
    });

    const checkoutUrl = `${baseUrl}?${params.toString()}`;
    
    console.log('Generated checkout URL:', checkoutUrl);

    return NextResponse.json({ success: true, checkoutUrl });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
