import { NextResponse } from 'next/server';

// Force Node.js runtime
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const rawEntity = process.env.PEACH_ENTITY_ID?.trim();
    const rawSecret = process.env.PEACH_CLIENT_SECRET?.trim();

    if (!rawEntity || !rawSecret) {
      throw new Error("Configuration Error: Missing PEACH_API_KEY or SECRET");
    }

    const authString = `${rawEntity}:${rawSecret}`;
    const auth = Buffer.from(authString).toString('base64');

    const formData = await request.formData();
    const amountInput = formData.get('amount')?.toString() || '0';
    const amountCents = Math.round(parseFloat(amountInput) * 100);
    
    if (amountCents <= 0) {
        return NextResponse.json({ error: "Invalid Amount" }, { status: 400 });
    }

    const orderId = formData.get('orderId')?.toString() || 'ORD-' + Date.now();
    const productName = formData.get('productName')?.toString() || 'Product';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';

    // ⚠️ CHANGE HERE: Standard Gateway (.com)
    const peachApiUrl = 'https://checkout.peachpayments.com/api/v1/sessions';
    
    console.log("🚀 Connecting to Peach:", peachApiUrl);

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

    // ✅ FIX: Inspect the response BEFORE parsing to prevent "Not Valid JSON" crashes
    const contentType = res.headers.get('content-type') || '';
    let data;

    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      // Peach sent back HTML (an error page) instead of JSON. Read it as text.
      const htmlText = await res.text();
      console.log("❌ HTML REPLY RECEIVED (Status:", res.status, "):", htmlText.substring(0, 200));
      throw new Error(`Peach rejected request (Status ${res.status}). ${htmlText.substring(0, 100)}... Check your credentials.`);
    }

    // If successful, redirect
    if (res.ok && data.checkoutUrl) {
      return NextResponse.redirect(data.checkoutUrl);
    }

    // If it was JSON but an error (e.g. 401 Unauthorized)
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
