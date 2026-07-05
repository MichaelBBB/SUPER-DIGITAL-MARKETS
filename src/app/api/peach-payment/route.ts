import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Return a hardcoded test URL - NO FETCH, NO API CALLS, NO ERRORS
  return NextResponse.json({ 
    success: true, 
    checkoutUrl: 'https://test.peachpayments.com/checkout?entityId=8ac7a4c89d6f2185019d70e1ee0501f3&amount=22.99&currency=ZAR&paymentType=DB&merchantTransactionId=TEST-123&customer.email=test@example.com&customer.givenName=Test&customer.surname=User&billing.street1=123+Test&billing.city=Johannesburg&billing.postcode=2000&billing.country=ZA&shopper.resultUrl=https://super-digital-markets-co9n.vercel.app/checkout/success'
  });
}
