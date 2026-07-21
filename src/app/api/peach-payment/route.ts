import { NextResponse } from 'next/server';

// Force Node.js runtime to ensure stability and access to standard networking
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  console.log("🚀 Payment Request Received");

  try {
    // 1. Get Credentials
    const rawEntity = process.env.PEACH_ENTITY_ID?.trim();
    const rawSecret = process.env.PEACH_CLIENT_SECRET?.trim();

    if (!rawEntity || !rawSecret) {
      console.error("❌ Missing Credentials");
      return new Response(JSON.stringify({ error: "Configuration Error: Missing Credentials" }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // 2. Prepare Authorization Header
    // We use Buffer to ensure the Base64 encoding is perfectly formatted
    const authString = `${rawEntity}:${rawSecret}`;
    const auth = Buffer.from(authString).toString('base64');

    // 3. Intelligent Data Reader (Handles JSON or Form Data automatically)
    let bodyData: Record<string, any> = {};
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      // Case A: Frontend sent JSON
      bodyData = await request.json();
    } else {
      // Case B: Frontend sent Form Data
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        bodyData[key] = value;
      }
    }

    const amountInput = bodyData.amount || '0';
    const amountCents = Math.round(parseFloat(amountInput) * 100);
    
    if (amountCents <= 0) {
      return new Response(JSON.stringify({ error: "Invalid Amount" }), { 
        status: 400, headers: { 'Content-Type': 'application/json' } 
      });
    }

    const orderId = bodyData.orderId || `SD-${Date.now()}`;
    const productName = bodyData.productName || 'Digital Product';
    // Fallback Base URL if env var is missing
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';

    // 4. Configure Sandbox Endpoint
    // Using the specific Sandbox domain (.co.za) for testing
    const peachApiUrl = 'https://sandbox.secure.checkout.peachpayments.co.za/api/v1/sessions';
    
    console.log("📍 Connecting to Sandbox:", peachApiUrl);
    console.log("🔑 Auth Status:", auth ? 'Created' : 'Failed');

    // 5. Call Peach Payments API
    const res = await fetch(peachApiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'User-Agent': 'SuperDigitalMarket-API-V1'
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
    if (!res.ok) {
      // Try to read the error message from Peach
      let errorMsg = "Unknown Gateway Error";
      try {
        const errorData = await res.json();
        errorMsg = errorData.message || errorMsg;
      } catch {
        const errorText = await res.text();
        errorMsg = errorText.substring(0, 100);
      }
      
      console.error("❌ Peach Returned Error:", res.status, errorMsg);
      return new Response(JSON.stringify({ error: errorMsg }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const data = await res.json();

    if (data.checkoutUrl) {
      console.log("✅ Success! Redirecting to:", data.checkoutUrl);
      return NextResponse.redirect(data.checkoutUrl);
    }

    console.error("❌ Response missing checkoutUrl");
    return new Response(JSON.stringify({ error: "Invalid response from payment gateway" }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (error: any) {
    // Catch-all for system-level failures (DNS, Network, etc.)
    console.error("💥 System Failure:", error.message);
    return new Response(JSON.stringify({ error: "Service unavailable" }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
