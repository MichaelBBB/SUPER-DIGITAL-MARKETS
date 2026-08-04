import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const PEACH_API_BASE = process.env.NODE_ENV === 'production'
  ? 'https://api-v2.peachpayments.com'
  : 'https://testapi-v2.peachpayments.com';

interface PaymentRequestBody {
  customerName?: string;
  phoneNumber?: string;
  amount: number | string;
  reference?: string;
  paymentMethod?: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json() as PaymentRequestBody;
    
    // Validate required environment variables
    if (!process.env.PEACH_ENTITY_ID || !process.env.PEACH_USERNAME || !process.env.PEACH_PASSWORD) {
      console.error('Missing environment variables:', {
        entity: !!process.env.PEACH_ENTITY_ID,
        username: !!process.env.PEACH_USERNAME,
        password: !!process.env.PEACH_PASSWORD,
      });
      
      return NextResponse.json(
        { error: 'Server misconfiguration', details: 'Environment variables missing' },
        { status: 500 }
      );
    }

    // Generate Basic Auth header
    const authString = `${process.env.PEACH_USERNAME}:${process.env.PEACH_PASSWORD}`;
    const authorization = `Basic ${Buffer.from(authString).toString('base64')}`;

    // Prepare payment data
    const paymentData = {
      entity_id: process.env.PEACH_ENTITY_ID,
      amount: parseInt(String(body.amount)) || 100,
      currency: 'ZAR',
      reference: body.reference || `PAY-${Date.now()}`,
      payment_methods: ['card', 'capitec_transfer'],
      contact_method: {
        type: 'phone',
        value: body.phoneNumber || '+27000000000'
      },
      redirect_url: `${process.env.NEXT_PUBLIC_VERCEL_URL}/payment/success`,
      return_message: 'Thank you for your payment!',
    };

    // Call Peach Payments API
    const response = await fetch(`${PEACH_API_BASE}/v2/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization,
      },
      body: JSON.stringify(paymentData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Peach Payment Error:', result);
      return NextResponse.json(
        { 
          error: 'Payment initialization failed', 
          details: result 
        }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, ...result });

  } catch (error) {
    console.error('Payment Setup Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Handle GET requests
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ 
    status: 'ok',
    endpoint: '/api/peach-payment',
    timestamp: Date.now(),
    configured: {
      entity: !!process.env.PEACH_ENTITY_ID,
      username: !!process.env.PEACH_USERNAME,
      password: !!process.env.PEACH_PASSWORD,
      vercel: !!process.env.NEXT_PUBLIC_VERCEL_URL,
    },
  });
}
