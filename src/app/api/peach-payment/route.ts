import { NextResponse } from 'next/server';

// Run on Node.js to ensure stable fetching capabilities
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    console.log("👉 Payment attempt started.");

    // 1. CLEAN AND GET CREDENTIALS
    // We trim() to remove hidden spaces that break Base64 encoding
    const rawEntity = process.env.PEACH_ENTITY_ID?.trim();
    const rawSecret = process.env.PEACH_CLIENT_SECRET?.trim();

    if (!rawEntity || !rawSecret) {
      console.error("❌ CREDENTIALS MISSING OR EMPTY");
      return new Response(JSON.stringify({ error: "Configuration Error: Missing Keys" }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // 2. PREPARE AUTH HEADER
    // Combine ID + : + Secret -> Encode to Base64
    const authString = `${rawEntity}:${rawSecret}`;
    const auth = Buffer.from(authString).toString('base64');

    // 3. READ INPUT DATA SAFELY
    const formData = await request.formData();
    const amount = parseFloat(formData.get('amount') as string);
    const orderId = formData.get('orderId') as string;
    const productName = formData.get('productName') as string;

    console.log("✅ Credentials Validated. Attempting request...");

    // 4. CALL PEACH PAYMENTS
    const peachUrl = 'https://secure.checkout.peachpayments.co.za/api/v1/sessions';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';

    const response = await fetch(peachUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency: 'ZAR',
        orderReference: orderId || 'ORDER-' + Date.now(),
        description: productName || 'Test Product',
        returnUrl: `${baseUrl}/checkout?status=success`,
        cancelUrl: `${baseUrl}/checkout?status=cancelled`,
        webhook: `${baseUrl}/api/webhooks/peach`
      })
    });

    // 5. PROCESS RESPONSE
    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Peach Rejected Request:", data.message);
      return new Response(JSON.stringify({ error: data.message || "Peach API Error" }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // 6. SUCCESS: REDIRECT TO PEACH CHECKOUT
    return NextResponse.redirect(data.checkoutUrl);

  } catch (error: any) {
    console.error("💥 CRITICAL FETCH ERROR:", error.message);
    return new Response(JSON.stringify({ error: "Connection failed: " + error.message }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
