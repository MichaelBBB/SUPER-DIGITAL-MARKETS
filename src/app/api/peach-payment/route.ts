import { NextResponse } from 'next/server';

// Force Node.js runtime (prevents edge-runtime compatibility issues)
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  console.log("👉 Starting Payment Request");

  try {
    // 1. CHECK CREDENTIALS
    if (!process.env.PEACH_ENTITY_ID || !process.env.PEACH_CLIENT_SECRET) {
      console.log("❌ MISSING CREDENTIALS");
      throw new Error("Missing PEACH_ENTITY_ID or PEACH_CLIENT_SECRET");
    }

    // 2. READ RAW BODY (Handles Form Data correctly)
    const rawBody = await request.text();
    
    // Parse into an object safely
    const params = new URLSearchParams(rawBody);
    const amountInput = params.get('amount');
    const orderId = params.get('orderId') || 'ORDER-' + Date.now();
    const productName = params.get('productName') || 'Product';

    // Validate Amount
    const amount = parseFloat(amountInput || '0');
    if (isNaN(amount) || amount <= 0) {
      console.log("❌ INVALID AMOUNT:", amountInput);
      throw new Error(`Invalid Amount: ${amountInput}`);
    }

    console.log("✅ Parsed Data:", { amount, orderId, productName });

    // 3. AUTH HEADER
    const auth = Buffer.from(`${process.env.PEACH_ENTITY_ID}:${process.env.PEACH_CLIENT_SECRET}`).toString('base64');
    console.log("✅ Auth String Created (Length:", auth.length, ")");

    // 4. BASE URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';

    // 5. CALL PEACH
    console.log("🚀 Calling Peach API...");
    
    const peachUrl = 'https://secure.checkout.peachpayments.co.za/api/v1/sessions';
    console.log("Target URL:", peachUrl);

    const res = await fetch(peachUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Must be integer cents
        currency: 'ZAR',
        orderReference: orderId,
        description: `SD - ${productName}`,
        returnUrl: `${baseUrl}/checkout?status=success`,
        cancelUrl: `${baseUrl}/checkout?status=cancelled`,
        webhook: `${baseUrl}/api/webhooks/peach`
      }),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    console.log(" Peach Response Status:", res.status);
    const data = await res.json();

    // 6. HANDLE RESPONSE
    if (!res.ok) {
      console.log("❌ Peach API Error:", data);
      throw new Error(data.message || `Peach API returned ${res.status}`);
    }

    // 7. REDIRECT
    console.log("✅ Success! Redirecting to:", data.checkoutUrl);
    return NextResponse.redirect(data.checkoutUrl);

  } catch (error: any) {
    console.error("💥 CRITICAL FAIL:", error);
    // Return a plain text error so Vercel shows it clearly
    return new Response("Error: " + error.message, { status: 500 });
  }
}
