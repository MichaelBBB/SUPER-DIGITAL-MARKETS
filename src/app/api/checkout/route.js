import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // For now, return success (add Peach Payments API later)
    return NextResponse.json({
      success: true,
      redirectUrl: 'https://test.peachpayments.com',
      message: 'Payment initiated'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Server error'
    }, { status: 500 });
  }
}
