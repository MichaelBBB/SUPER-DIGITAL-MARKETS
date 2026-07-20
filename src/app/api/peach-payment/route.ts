import { NextResponse } from 'next/server';

// Run Node.js runtime for stable fetching
export const runtime = 'nodejs';

export async function POST(request: Request) {
  console.log("👉 Payment Request Received");

  try {
    // 1. STRICTLY CLEAN CREDENTIALS
    // This removes any hidden spaces/newlines that cause connection failures
    const rawEntity = process.env.PEACH_ENTITY_ID?.trim();
    const rawSecret = process.env.PEACH_CLIENT_SECRET?.trim();

    if (!rawEntity || !rawSecret) {
      console.error("❌ MISSING KEYS");
      return new Response(JSON.stringify({ error: "Missing Credentials" }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // 2. VERIFY CREDENTIALS FORMAT
    const authString = `${rawEntity}:${rawSecret}`;
    console.log("✅ Auth String Validated (Length:", authString.length, ")");

    const base64Auth = Buffer.from(authString).toString('base64');

    // 3. ROBUST INPUT PARSING (Handles Standard HTML Forms)
    const formData = await request.formData();
    const amountInput = formData.get('amount')?.toString();
    
    // Convert amount to cents safely
    const amountCents = Math.round(parseFloat(amountInput || '0') * 100);
    
    if (amountCents <= 0) {
        return NextResponse.json({ error: "Invalid Amount" }, { status: 400 });
    }

    const orderId = formData.get('orderId')?.toString() || 'ORD-' + Date.now();
    const productName = formData.get('productName')?.toString() || 'Product';

    // 4. CONFIGURE PEACH PAYMENT
    // Note: Using .co.za domain for South African transactions
    const peachApiUrl = 'https://secure.checkout.peachpayments.co.za/api/v1/sessions';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';

    const payload = {
      amount: amountCents,
      currency: 'ZAR',
      orderReference: orderId,
      description: productName,
      returnUrl: `${baseUrl}/checkout?status=success`,
      cancelUrl: `${baseUrl}/checkout?status=cancelled`,
      webhook: `${baseUrl}/api/webhooks/peach`
    };

    console.log("🚀 Fetching Peach...");

    // 5. THE ACTUAL REQUEST
    const res = await fetch(peachApiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${base64Auth}`,
        'X-PayByBank-Enabled': 'true' 
      },
      body: JSON.stringify(payload)
    });

    // 6. HANDLE RESPONSE
    const data = await res.json();

    if (!res.ok || !data.checkoutUrl) {
      console.error("❌ Peach Error:", data.message);
      return new Response(JSON.stringify({ error: data.message || "Payment Failed" }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    console.log("✅ Success! Redirecting to Peach Checkout");
    return NextResponse.redirect(data.checkoutUrl);

  } catch (error: any) {
    console.error("💥 CRITICAL FAILURE:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
