import { NextResponse } from 'next/server';

// Prevents Next.js from caching this endpoint
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. CHECK ENVIRONMENT VARIABLES IMMEDIATELY
    if (!process.env.PEACH_ENTITY_ID || !process.env.PEACH_CLIENT_SECRET) {
      console.error("MISSING PEACH CREDENTIALS");
      return NextResponse.json({ 
        success: false, 
        error: "Configuration Error: Missing PEACH_ENTITY_ID or PEACH_CLIENT_SECRET in Environment Variables." 
      }, { status: 500 });
    }

    const { amount, orderId, productName } = await request.json();
    const entityId = process.env.PEACH_ENTITY_ID;
    const clientSecret = process.env.PEACH_CLIENT_SECRET;

    // 2. Prepare Basic Auth Header
    const auth = Buffer.from(`${entityId}:${clientSecret}`).toString('base64');

    // 3. Define Return URL (Use a fallback if env var is missing)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';
    
    // 4. Call Peach Payments API
    const res = await fetch('https://secure.checkout.peachpayments.co.za/api/v1/sessions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Peach expects cents
        currency: 'ZAR',
        orderReference: orderId,
        description: productName,
        returnUrl: `${baseUrl}/checkout?status=success`,
        cancelUrl: `${baseUrl}/checkout?status=cancelled`,
        webhook: `${baseUrl}/api/webhooks/peach`
      })
    });

    const data = await res.json();
    
    // 5. Handle API Errors
    if (!res.ok) {
      console.error("Peach API Error:", data);
      throw new Error(data.message || 'Peach API Error');
    }

    // 6. Return Success
    return NextResponse.json({ success: true, checkoutUrl: data.checkoutUrl });
    
  } catch (error: any) {
    console.error("Route Error:", error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
