import { NextResponse } from 'next/server';

// Ensure this runs on Node.js for stable API fetching
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  console.log("🚀 Starting Peach Payment Request");

  try {
    // 1. Check Credentials
    const rawEntity = process.env.PEACH_ENTITY_ID?.trim();
    const rawSecret = process.env.PEACH_CLIENT_SECRET?.trim();

    if (!rawEntity || !rawSecret) {
      throw new Error("Configuration Error: Missing PEACH_API_KEY or SECRET");
    }

    // 2. Prepare Auth Header
    const authString = `${rawEntity}:${rawSecret}`;
    const auth = Buffer.from(authString).toString('base64');

    // 3. Read Input Data (Fix: Use formData because the HTML Form sends it this way)
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

    // ⚠️ CRITICAL FIX: Point to the SANDBOX URL (.com)
    // This resolves the "Fetch Failed" timeout because we are now talking to the Test Server
    const peachApiUrl = 'https://sandbox.checkout.peachpayments.com/api/v1/sessions';
    
    console.log("📍 Targeting Sandbox Server:", peachApiUrl);

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

    if (!res.ok || !data.checkoutUrl) {
      console.error("❌ Peach API Error:", data.message);
      return new Response(JSON.stringify({ error: data.message || "Payment Failed" }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // 6. SUCCESS: Redirect to Peach Checkout
    console.log("✅ Success! Redirecting to checkout...");
    return NextResponse.redirect(data.checkoutUrl);

  } catch (error: any) {
    console.error("💥 CRITICAL ERROR:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
