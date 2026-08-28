// src/app/api/peach-checkout/route.ts
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid'; // Install: npm install uuid @types/uuid

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amountZAR = parseFloat(body.amount) * 100; // Convert to cents (integer)
    
    // Generate unique transaction ID and nonce
    const merchantTransactionId = `SDM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const nonce = uuidv4();
    
    // Your LIVE credentials
    const entityId = "8acda4cb9e1b546a019e1b5b39ee001c";
    const authToken = process.env.PEACH_SECRET_TOKEN;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';

    if (!authToken) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // ✅ CORRECT Peach Payments v2 API endpoint
    const response = await fetch('https://secure.peachpayments.com/v2/checkout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Referer': baseUrl,
        'accept': 'application/json',
      },
      body: JSON.stringify({
        // ✅ Dot notation for authentication
        'authentication.entityId': entityId,
        
        // ✅ Required fields per Peach docs
        merchantTransactionId: merchantTransactionId,
        amount: Math.round(amountZAR), // Integer in cents
        currency: body.currency || 'ZAR',
        paymentType: 'DB',
        nonce: nonce,
        
        // ✅ Return URLs
        shopperResultUrl: `${baseUrl}/payment/success`,
        cancelUrl: `${baseUrl}/payment/cancelled`,
        notificationUrl: `${baseUrl}/api/webhooks/peach`,
        
        // ✅ Optional but recommended
        forceDefaultMethod: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Peach API Error:', data);
      return NextResponse.json({ 
        error: data.message || 'Payment initialization failed',
        details: data 
      }, { status: response.status });
    }

    // Peach v2 returns { id: "checkout_id" }
    if (!data.id) {
      return NextResponse.json({ error: 'No checkout ID returned', response: data }, { status: 500 });
    }

    return NextResponse.json({ checkoutId: data.id });

  } catch (error: any) {
    console.error('💥 API Route Error:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      message: error.message 
    }, { status: 500 });
  }
}
