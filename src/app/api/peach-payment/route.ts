import { NextResponse } from 'next/server';

// Force dynamic rendering so this doesn't cache
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // CHECK CREDENTIALS FIRST
    if (!process.env.PEACH_ENTITY_ID || !process.env.PEACH_CLIENT_SECRET) {
      throw new Error("Missing Credentials");
    }

    // READ RAW TEXT (Bypasses all JSON/Form-data crashes)
    const rawBody = await request.text();
    
    // MANUALLY SPLIT THE STRING INTO VARIABLES
    // Example input: "amount=22.99&orderId=SD-3&productName=Netflix"
    const params = new URLSearchParams(rawBody);
    
    const amount = parseFloat(params.get('amount') || '0');
    const orderId = params.get('orderId') || '';
    const productName = params.get('productName') || '';

    // PREPARE AUTH HEADER
    const auth = Buffer.from(`${process.env.PEACH_ENTITY_ID}:${process.env.PEACH_CLIENT_SECRET}`).toString('base64');
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';

    // CALL PEACH PAYMENTS
    const res = await fetch('https://secure.checkout.peachpayments.co.za/api/v1/sessions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency: 'ZAR',
        orderReference: orderId,
        description: productName,
        returnUrl: `${baseUrl}/checkout?status=success`,
        cancelUrl: `${baseUrl}/checkout?status=cancelled`,
        webhook: `${baseUrl}/api/webhooks/peach`
      })
    });

    const data = await res.json();

    // IF SUCCESSFUL, REDIRECT TO PEACH
    if (res.ok && data.checkoutUrl) {
      return NextResponse.redirect(data.checkoutUrl);
    }

    // OTHERWISE, SHOW ERROR
    return NextResponse.json({ error: data.message || 'Payment Failed' }, { status: 500 });

  } catch (error: any) {
    console.error("CRITICAL ERROR:", error);
    return NextResponse.json({ error: error.message || "Server Crash" }, { status: 500 });
  }
}
