import { NextResponse } from 'next/server';

// Force Node.js runtime for stability
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  console.log("👉 Payment Request Received");

  try {
    // 1. CHECK CREDENTIALS
    // We trim() to remove hidden spaces that break connections
    const rawEntity = process.env.PEACH_ENTITY_ID?.trim();
    const rawSecret = process.env.PEACH_CLIENT_SECRET?.trim();

    if (!rawEntity || !rawSecret) {
      throw new Error("Missing Credentials");
    }

    // 2. PREPARE AUTH HEADER
    const authString = `${rawEntity}:${rawSecret}`;
    const auth = Buffer.from(authString).toString('base64');

    // 3. READ INPUT DATA SAFELY (Handles Form Data correctly)
    const formData = await request.formData();
    const amountInput = formData.get('amount')?.toString() || '0';
    
    // Calculate amount in cents safely
    const amountCents = Math.round(parseFloat(amountInput) * 100);
    
    if (amountCents <= 0) {
        return NextResponse.json({ error: "Invalid Amount" }, { status: 400 });
    }

    const orderId = formData.get('orderId')?.toString() || 'ORD-' + Date.now();
    const productName = formData.get('productName')?.toString() || 'Product';

    // ⚠️ CRITICAL FIX: Point to the SANDBOX URL
    // Because your dashboard shows Sandbox, you MUST use this specific URL
    const peachApiUrl = 'https://sandbox.checkout.peachpayments.com/api/v1/sessions';
    
    console.log("🚀 Connecting to Peach Sandbox...");

    // 4. CALL PEACH PAYMENTS
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';

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

    // 5. PROCESS RESPONSE
    const data = await res.json();

    if (!res.ok || !data.checkoutUrl) {
      console.error("❌ Peach Error:", data.message);
      return new Response(JSON.stringify({ error: data.message || "Payment Failed" }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // 6. SUCCESS: REDIRECT TO PEACH
    return NextResponse.redirect(data.checkoutUrl);

  } catch (error: any) {
    console.error("💥 CRITICAL ERROR:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
