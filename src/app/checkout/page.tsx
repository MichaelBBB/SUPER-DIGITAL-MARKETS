import { NextResponse } from 'next/server';

// Force Node.js runtime for stability
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  console.log("🚀 Starting Payment Request");

  try {
    // 1. Get Credentials
    const rawEntity = process.env.PEACH_ENTITY_ID?.trim();
    const rawSecret = process.env.PEACH_CLIENT_SECRET?.trim();

    if (!rawEntity || !rawSecret) {
      throw new Error("Configuration Error: Missing PEACH_API_KEY or SECRET");
    }

    // 2. Prepare Auth Header
    const authString = `${rawEntity}:${rawSecret}`;
    const auth = Buffer.from(authString).toString('base64');

    // 3. Read Input Data (Handles Form Submit correctly)
    const formData = await request.formData();
    const amountInput = formData.get('amount')?.toString() || '0';
    
    // Calculate amount in cents safely
    const amountCents = Math.round(parseFloat(amountInput) * 100);
    
    if (amountCents <= 0) {
        return NextResponse.json({ error: "Invalid Amount" }, { status: 400 });
    }

    const orderId = formData.get('orderId')?.toString() || 'ORD-' + Date.now();
    const productName = formData.get('productName')?.toString() || 'Product';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';

    // ⚠️ CRITICAL FIX: Using the STANDARD LIVE URL
    // This bypasses the broken Sandbox URL while still accepting Sandbox/Test keys
    const peachApiUrl = 'https://checkout.peachpayments.com/api/v1/sessions';
    
    console.log("📍 Connecting to Standard Gateway:", peachApiUrl);

    // 4. Call Peach Payments API
    const res = await fetch(peachApiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        amount: amountCents,
        currency: 'ZAR',
        orderReference: orderId,
        description: productName,
        returnUrl: `${baseUrl}/checkout?status=success`,
        cancelUrl: `${baseUrl}/checkout?status=cancelled`,
        webhook: `${baseUrl}/api/webhooks/peach`
      })
    });

    // 5. Handle Response
    const data = await res.json();

    // If Peach provides a checkoutUrl, we redirect the user there (Success 200 logic)
    if (res.ok && data.checkoutUrl) {
      console.log("✅ Success! Redirecting to checkout...");
      return NextResponse.redirect(data.checkoutUrl);
    }

    // If there was an error from Peach, return 500 (Failure logic)
    console.error("❌ Peach API Error:", data.message);
    return new Response(JSON.stringify({ error: data.message || "Payment Failed" }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (error: any) {
    console.error("💥 CRITICAL ERROR:", error.message);
    // Return 500 if the server crashes
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
