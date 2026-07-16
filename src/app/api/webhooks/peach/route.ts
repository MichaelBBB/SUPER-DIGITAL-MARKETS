import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { amount, orderId, productName } = await request.json();
    
    // Peach Payments API endpoint (replace with your actual API URL from Peach dashboard)
    const PEACH_API_URL = process.env.PEACH_API_URL || 'https://api.peachpayments.co.za/v1/sessions';
    const PEACH_API_KEY = process.env.PEACH_API_KEY || '';

    const res = await fetch(PEACH_API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PEACH_API_KEY}`
      },
      body: JSON.stringify({
        amount: amount * 100, // Peach expects cents
        currency: 'ZAR',
        orderReference: orderId,
        description: productName,
        returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?status=success`,
        cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?status=cancelled`
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Peach API error');

    return NextResponse.json({ success: true, checkoutUrl: data.checkoutUrl });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
