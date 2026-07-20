import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. Get Credentials
    const rawEntity = process.env.PEACH_ENTITY_ID?.trim();
    const rawSecret = process.env.PEACH_CLIENT_SECRET?.trim();

    if (!rawEntity || !rawSecret) {
      throw new Error("Missing Credentials");
    }

    // 2. Create Auth Header
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

    // ⚠️ CRITICAL FIX: Use SANDBOX URL (.com not .co.za)
    // We explicitly define this to avoid the timeout
    const peachApiUrl = 'https://sandbox.checkout.peachpayments.com/api/v1/sessions';
    
    // LOGGING: This appears in your Vercel logs to prove we are using Sandbox
    console.log("✅ Using Peach Sandbox URL:", peachApiUrl);

    // 4. Call Peach
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
      console.error("❌ Peach Error:", data.message);
      return new Response(JSON.stringify({ error: data.message || "Payment Failed" }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // 6. Redirect
    return NextResponse.redirect(data.checkoutUrl);

  } catch (error: any) {
    console.error("💥 ERROR:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
