import { NextResponse } from 'next/server';

// Handle GET requests
export async function GET(request: Request) {
  return NextResponse.json({
    status: 'success',
    message: 'Peach Payments API Active',
    timestamp: new Date().toISOString(),
  });
}

// Handle POST requests for payment processing
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate environment variables are loaded
    if (!process.env.PEACH_MERCHANT_ID) {
      return NextResponse.json(
        { error: 'Missing PEACH_MERCHANT_ID environment variable' },
        { status: 500 }
      );
    }

    if (!process.env.PEACH_SECRET_TOKEN) {
      return NextResponse.json(
        { error: 'Missing PEACH_SECRET_TOKEN environment variable' },
        { status: 500 }
      );
    }

    // Here you would make the actual Peach Payments API call
    // For now, returning success structure
    return NextResponse.json({
      status: 'success',
      message: 'Payment request received',
      merchantId: process.env.PEACH_MERCHANT_ID,
      data: body,
    });

  } catch (error) {
    console.error('Peach Payment Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
