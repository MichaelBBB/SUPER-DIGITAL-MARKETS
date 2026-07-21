import { NextResponse } from 'next/server';

// Force Node.js runtime for stable connection to payment gateways
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. Get Credentials
    const rawEntity = process.env.PEACH_ENTITY_ID?.trim();
    const rawSecret = process.env.PEACH_CLIENT_SECRET?.trim();

    if (!rawEntity || !rawSecret) {
      return new Response(JSON.stringify({ error: "Missing Environment Variables" }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // 2. Prepare Authorization (Basic Auth)
    // You must combine Entity ID and Client Secret with a colon (:), then encode
    const authString = `${rawEntity}:${rawSecret}`;
    const auth = Buffer.from(authString).toString('base64');

    // 3. Read Input Data
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

    // ⚠️ SANDBOX URL: Using the standard testing domain
    const peachApiUrl = 'https://sandbox.checkout.peachpayments.com/api/v1/sessions';
    
    console.log("📍 Connecting to Peach Sandbox:", peachApiUrl);

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

    // 5. Handle Response Safely
    if (!res.ok) {
      // If the status is not 200, read the text body instead of JSON to avoid crashes
      const errorText = await res.text();
      console.error("❌ Peach Rejected Request:", errorText);
      
      return new Response(JSON.stringify({ error: `Gateway Error (${res.status}): ${errorText.substring(0, 100)}` }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // Only parse JSON if the request was successful
    const data = await res.json();

    if (data.checkoutUrl) {
      return NextResponse.redirect(data.checkoutUrl);
    }

    console.error("❌ Missing Checkout URL in response");
    return new Response(JSON.stringify({ error: "Peach did not provide a checkout link." }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (error: any) {
    // This only catches total system failures
    console.error("💥 System Error:", error);
    return new Response(JSON.stringify({ error: "Service unavailable" }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
