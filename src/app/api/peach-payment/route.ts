import { NextResponse } from 'next/server';

// Force Node.js runtime for better stability
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. Get Credentials
    const rawEntity = process.env.PEACH_ENTITY_ID?.trim();
    const rawSecret = process.env.PEACH_CLIENT_SECRET?.trim();

    if (!rawEntity || !rawSecret) {
      throw new Error("Configuration Error: Missing PEACH_API_KEY or SECRET");
    }

    // 2. Prepare Auth Header (Basic Auth)
    const authString = `${rawEntity}:${rawSecret}`;
    const auth = Buffer.from(authString).toString('base64');

    // 3. Read Input Data (Handles Form Submit)
    const formData = await request.formData();
    const amountInput = formData.get('amount')?.toString() || '0';
    const amountCents = Math.round(parseFloat(amountInput) * 100);
    
    if (amountCents <= 0) {
        return NextResponse.json({ error: "Invalid Amount" }, { status: 400 });
    }

    const orderId = formData.get('orderId')?.toString() || 'ORD-' + Date.now();
    const productName = formData.get('productName')?.toString() || 'Product';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';

    // ⚠️ CHANGE HERE: Using SANDBOX URL with .CO.ZA domain
    const peachApiUrl = 'https://sandbox.secure.checkout.peachpayments.co.za/api/v1/sessions';
    
    console.log("🚀 Connecting to Peach Sandbox:", peachApiUrl);

    const res = await fetch(peachApiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'User-Agent': 'SuperDigitalMarket-V1'
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

    // ✅ FIX: Handle errors gracefully
    if (!res.ok) {
      const contentType = res.headers.get('content-type') || '';
      let errorMessage = "Unknown Error";
      
      if (contentType.includes('application/json')) {
        const errData = await res.json();
        errorMessage = errData.message || errData.error || JSON.stringify(errData);
      } else {
        errorMessage = `Server Rejected Request (${res.status}). Sandbox connection issue.`;
      }

      console.error("❌ Peach API Failure:", errorMessage);
      return new Response(JSON.stringify({ error: errorMessage }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const data = await res.json();

    if (data.checkoutUrl) {
      return NextResponse.redirect(data.checkoutUrl);
    }

    console.error("❌ Peach API Error:", data.message);
    return new Response(JSON.stringify({ error: data.message || "Payment Failed" }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (error: any) {
    console.error("💥 CRITICAL ERROR:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
