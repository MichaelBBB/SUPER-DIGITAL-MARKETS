import { NextResponse } from 'next/server';
import { initiatePayment } from '@/lib/peachPayments';

export async function POST(request) {
  try {
    const body = await request.json();
    
    const result = await initiatePayment({
      amount: body.amount,
      currency: body.currency,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com'
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        redirectUrl: result.redirectUrl,
        checkoutId: result.checkoutId
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Server error'
    }, { status: 500 });
  }
}
