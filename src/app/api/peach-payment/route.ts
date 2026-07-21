import { NextResponse } from 'next/server';

// Force Node.js runtime to prevent Edge Runtime networking restrictions
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. Check Credentials (Trimming removes invisible spaces)
    const rawEntity = process.env.PEACH_ENTITY_ID?.trim();
    const rawSecret = process.env.PEACH_CLIENT_SECRET?.trim();

    if (!rawEntity || !rawSecret) {
      throw new Error("Configuration Error: Missing Credentials");
    }

    // 2. Prepare Authorization Header (Basic Auth)
    const authString = `${rawEntity}:${rawSecret}`;
    const auth = Buffer.from(authString).toString('base64');

    // 3. Read Input Data
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

    // ⚠️ CRITICAL FIX: Using the SOUTH AFRICAN SANDBOX URL
    // This matches your currency setting (ZAR) and location
    const peachApiUrl = 'https://sandbox.secure.checkout.peachpayments.co.za/api/v1/sessions';
    
    console.log("🚀 Connecting to Peach Sandbox:", peachApiUrl);

    // 4. Call Peach Payments
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
    if (!res.ok) {
      // Try to get the specific error message from Peach
      const errorText = await res.text();
      console.error("❌ Peach Returned Error:", errorText);
      
      return new Response(JSON.stringify({ error: `Payment Gateway Error (${res.status})` }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const data = await res.json();

    // Success: Redirect the user to the checkout page
    if (data.checkoutUrl) {
      return NextResponse.redirect(data.checkoutUrl);
    }

    console.error("❌ Missing Checkout URL in response");
    return new Response(JSON.stringify({ error: "Gateway did not provide a checkout link." }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (error: any) {
    // Catch-all for system failures (DNS errors, Network timeouts, etc.)
    console.error("💥 System Failure:", error.message);
    return new Response(JSON.stringify({ error: `System Error: ${error.message}` }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
