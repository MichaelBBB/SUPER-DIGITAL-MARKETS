import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    // Read the data sent from the checkout page
    const body = await req.json();
    
    console.log('Payment received:', body.orderId);

    return NextResponse.json({ 
      success: true, 
      message: 'Capitec payment recorded' 
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Something went wrong' 
    }, { status: 500 });
  }
}
