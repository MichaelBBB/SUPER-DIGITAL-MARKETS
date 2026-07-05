import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, orderId } = await request.json();
    const entityId = process.env.NEXT_PUBLIC_PEACH_ENTITY_ID;

    if (!entityId) {
      return NextResponse.json({ success: false, error: 'Entity ID missing' }, { status: 500 });
    }

    // Construct the Hosted Checkout URL directly
    const checkoutUrl = new URL('https://test.peachpayments.com/checkout');
    
    checkoutUrl.searchParams.append('entityId', entityId);
    checkoutUrl.searchParams.append('amount', amount.toFixed(2));
    checkoutUrl.searchParams.append('currency', 'ZAR');
    checkoutUrl.searchParams.append('paymentType', 'DB');
    checkoutUrl.searchParams.append('merchantTransactionId', orderId);
    checkoutUrl.searchParams.append('customer.email', 'customer@example.com');
    checkoutUrl.searchParams.append('customer.givenName', 'Test');
    checkoutUrl.searchParams.append('customer.surname', 'Customer');
    checkoutUrl.searchParams.append('billing.street1', '123 Test Street');
    checkoutUrl.searchParams.append('billing.city', 'Johannesburg');
    checkoutUrl.searchParams.append('billing.postcode', '2000');
    checkoutUrl.searchParams.append('billing.country', 'ZA');
    checkoutUrl.searchParams.append('shopper.resultUrl', 'https://super-digital-markets-co9n.vercel.app/checkout/success');

    console.log('Generated URL:', checkoutUrl.toString());

    return NextResponse.json({ 
      success: true, 
      checkoutUrl: checkoutUrl.toString() 
    });
  } catch (error) {
    console.error('Error generating URL:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate checkout URL' 
    }, { status: 500 });
  }
}
