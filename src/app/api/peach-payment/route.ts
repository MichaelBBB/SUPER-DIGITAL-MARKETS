import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. Get Credentials
    const entityId = process.env.PEACH_ENTITY_ID?.trim();
    const clientSecret = process.env.PEACH_CLIENT_SECRET?.trim();

    if (!entityId || !clientSecret) {
      console.error("❌ Missing Credentials");
      return new Response(JSON.stringify({ error: "Missing Credentials" }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // 2. Create Basic Auth Header
    const authString = `${entityId}:${clientSecret}`;
    const auth = Buffer.from(authString).toString('base64');

    // 3. Read Form Data
    const formData = await request.formData();
    const amount = parseFloat(formData.get('amount')?.toString() || '0');
    const amountCents = Math.round(amount * 100);
    const orderId = formData.get('orderId')?.toString() || `SD-${Date.now()}`;
    const productName = formData.get('productName')?.toString() || 'Product';

    if (amountCents <= 0) {
      return new Response(JSON.stringify({ error: "Invalid Amount" }), { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';

    // 4. Use the Verified Sandbox URL
    const peachApiUrl = 'https://sandbox.checkout.peachpayments.com/api/v1/sessions';

    // 5. Make the API Call
    const response = await fetch(peachApiUrl, {
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

    // 6. Handle Response
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Peach Error:", response.status, errorText);
      
      return new Response(JSON.stringify({ 
        error: `Payment Gateway Rejected (${response.status})`,
        details: errorText.substring(0, 200)
      }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const data = await response.json();
    
    if (data.checkoutUrl) {
      return NextResponse.redirect(data.checkoutUrl);
    }

    return new Response(JSON.stringify({ error: "Invalid response from gateway" }), { status: 500 });

  } catch (error: any) {
    console.error("💥 System Error:", error.message);
    return new Response(JSON.stringify({ error: `Connection Failed: ${error.message}` }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
