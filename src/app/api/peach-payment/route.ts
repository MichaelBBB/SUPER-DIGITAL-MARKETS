import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, orderId } = await request.json();
    
    const entityId = process.env.NEXT_PUBLIC_PEACH_ENTITY_ID;
    
    if (!entityId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Entity ID missing' 
      }, { status: 500 });
    }

    // Build the hosted checkout URL
    const checkoutURL = `https://test.peachpayments.com/checkout?` +
      `entityId=${entityId}&` +
      `amount=${amount.toFixed(2)}&` +
      `currency=ZAR&` +
      `paymentType=DB&` +
      `merchantTransactionId=${orderId}&` +
      `customer.email=customer@example.com&` +
      `customer.givenName=Test&` +
      `customer.surname=Customer&` +
      `billing.street1=123 Test Street&` +
      `billing.city=Johannesburg&` +
      `billing.postcode=2000&` +
      `billing.country=ZA&` +
      `shopperResultUrl=https://super-digital-markets-co9n.vercel.app/checkout/success`;

    return NextResponse.json({ 
      success: true, 
      checkoutUrl: checkoutURL 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create checkout URL' 
    }, { status: 500 });
  }
}
