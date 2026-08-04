import { NextResponse } from 'next/server';

const PEACH_API_BASE = process.env.NODE_ENV === 'production'
  ? 'https://api-v2.peachpayments.com'
  : 'https://testapi-v2.peachpayments.com';

interface PaymentData {
  customerName?: string;
  phoneNumber?: string;
  amount: number | string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json() as PaymentData;
    
    if (!process.env.PEACH_ENTITY_ID || !process.env.PEACH_USERNAME || !process.env.PEACH_PASSWORD) {
      return NextResponse.json(
        { error: 'Server misconfiguration', details: 'Environment variables missing' },
        { status: 500 }
      );
    }

    const authString = `${process.env.PEACH_USERNAME}:${process.env.PEACH_PASSWORD}`;
    const authorization = `Basic ${Buffer.from(authString).toString('base64')}`;

    const response = await fetch(`${PEACH_API_BASE}/v2/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization,
      },
      body: JSON.stringify({
        entity_id: process.env.PEACH_ENTITY_ID,
        amount: parseInt(String(body.amount)) || 100,
        currency: 'ZAR',
        reference: `PAY-${Date.now()}`,
        payment_methods: ['card', 'capitec_transfer'],
        contact_method: {
          type: 'phone',
          value: body.phoneNumber || '+27000000000'
        },
        redirect_url: `${process.env.NEXT_PUBLIC_VERCEL_URL}/payment/success`,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Payment initialization failed', details: result },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, ...result });

  } catch (error) {
    console.error('Payment Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ 
    status: 'ok',
    endpoint: '/api/peach-payment',
    configured: {
      entity: !!process.env.PEACH_ENTITY_ID,
      vercel: !!process.env.NEXT_PUBLIC_VERCEL_URL,
    },
  });
}
