import { NextResponse } from 'next/server';

// Force Node.js runtime to prevent Edge Runtime connection issues
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  console.log("🚀 Payment request received");

  try {
    // 1. Get Credentials
    const rawEntity = process.env.PEACH_ENTITY_ID?.trim();
    const rawSecret = process.env.PEACH_CLIENT_SECRET?.trim();

    // Check for empty keys first to avoid sending broken requests
    if (!rawEntity || !rawSecret) {
      return new Response(JSON.stringify({ error: "Missing Environment Variables" }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // 2. Prepare Authorization (Basic Auth)
    const authString = `${rawEntity}:${rawSecret}`;
    const auth = Buffer.from(authString).toString('base64');

    // 3. Read Input Data (Handles Form Submission safely)
    const formData = await request.formData();
    const amountInput = formData.get('amount')?.toString() || '0';
    const amountCents = Math.round(parseFloat(amountInput) * 100);
    
    if (amountCents <= 0) {
      return new Response(JSON.stringify({ error: "Invalid Amount" }), { 
        status: 400, headers: { 'Content-Type': 'application/json' } 
      });
    }

    const orderId = formData.get('orderId')?.toString() || `ORD-${Date.now()}`;
    const productName = formData.get('productName')?.toString() || 'Digital Product';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';

    // ⚠️ CORRECTED SANDBOX URL
    // Using the standard .com sandbox domain which is generally more accessible
    const peachApiUrl = 'https://sandbox.checkout.peachpayments.com/api/v1/sessions';
    
    console.log("📍 Connecting to:", peachApiUrl);

    // 4. Call Peach Payments
    const res = await fetch(peachApiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        // Some gateways require a User-Agent to accept the request
        'User-Agent': 'SuperDigital-Marketplace-V1'
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

    // 5. Handle the Response
    const data = await res.json();

    // Success: Redirect the user to Peach's hosted checkout
    if (res.ok && data.checkoutUrl) {
      return NextResponse.redirect(data.checkoutUrl);
    }

    // Failure: Return the specific error message from Peach
    console.error("❌ Peach API returned error:", data.message);
    return new Response(JSON.stringify({ error: data.message || "Payment Session Failed" }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (error: any) {
    // Catch all other errors (including "fetch failed")
    console.error("💥 System Error:", error.message);
    return new Response(JSON.stringify({ error: "Service unavailable" }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
