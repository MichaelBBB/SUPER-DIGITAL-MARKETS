import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const rawEntity = process.env.PEACH_ENTITY_ID?.trim();
    const rawSecret = process.env.PEACH_CLIENT_SECRET?.trim();

    if (!rawEntity || !rawSecret) {
      throw new Error("Missing Credentials");
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

    // ⚠️ CHANGE HERE: Using the Standard Gateway (.com) which supports Sandbox keys
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

    const data = await res.json();

    if (res.ok && data.checkoutUrl) {
      return NextResponse.redirect(data.checkoutUrl);
    }

    console.error("❌ Peach API Error:", data.message);
    return new Response(JSON.stringify({ error: data.message || "Payment Failed" }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (error: any) {
    console.error("💥 ERROR:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
