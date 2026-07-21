import { NextResponse } from 'next/server';

// Force Node.js runtime to ensure stable connections to external APIs
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. Retrieve and clean credentials
    const entityId = process.env.PEACH_ENTITY_ID?.trim();
    const secret = process.env.PEACH_CLIENT_SECRET?.trim();

    if (!entityId || !secret) {
      return new Response(JSON.stringify({ error: "Missing Credentials in Vercel Settings" }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // 2. Create Basic Auth header (Encoding ID:SECRET to Base64)
    const authString = `${entityId}:${secret}`;
    const auth = Buffer.from(authString).toString('base64');

    // 3. Read form data
    const formData = await request.formData();
    const amountInput = formData.get('amount');
    
    // Calculate cents safely
    const amountCents = Math.round(parseFloat(amountInput || '0') * 100);
    
    if (!amountCents || amountCents <= 0) {
      return new Response(JSON.stringify({ error: "Invalid Amount" }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const orderId = formData.get('orderId') || `SD-${Date.now()}`;
    const productName = formData.get('productName') || 'Digital Product';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';

    // 4. Call Peach Sandbox API
    // Using the standard Sandbox .com domain
    const peachApiUrl = 'https://sandbox.checkout.peachpayments.com/api/v1/sessions';
    
    console.log("🚀 Connecting to Peach Sandbox...");

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
      // Try to read the specific error message from Peach
      const errorText = await res.text();
      console.error("❌ Peach Rejected Request:", errorText);
      return new Response(JSON.stringify({ error: `Gateway Error (${res.status})` }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const data = await res.json();

    // Success: Redirect to the checkout page hosted by Peach
    if (data.checkoutUrl) {
      return NextResponse.redirect(data.checkoutUrl);
    }

    console.error("❌ Response missing checkoutUrl");
    return new Response(JSON.stringify({ error: "Peach did not provide a checkout link." }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (error: any) {
    // This catches system/network errors (like DNS failure or Connection Refused)
    console.error("💥 System Network Error:", error.message);
    return new Response(JSON.stringify({ error: `Connection Failed: ${error.message}` }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
