import { NextResponse } from 'next/server';

// Prevents Next.js from caching this endpoint
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. Parse incoming request body
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return NextResponse.json({ 
        success: false, 
        error: "Invalid request format. Please provide amount, orderId, and productName." 
      }, { status: 400 });
    }

    const { amount, orderId, productName } = requestBody;

    // 2. Validate required fields
    if (!amount || !orderId || !productName) {
      console.error("Missing required fields:", { amount, orderId, productName });
      return NextResponse.json({ 
        success: false, 
        error: "Missing required fields: amount, orderId, productName." 
      }, { status: 400 });
    }

    // 3. Check Environment Variables
    const entityId = process.env.PEACH_ENTITY_ID;
    const clientSecret = process.env.PEACH_CLIENT_SECRET;
    
    if (!entityId || !clientSecret) {
      console.error("CRITICAL: Missing PEACH_ENTITY_ID or PEACH_CLIENT_SECRET in environment variables.");
      return NextResponse.json({ 
        success: false, 
        error: "Server Configuration Error: Payment credentials are missing." 
      }, { status: 500 });
    }

    // 4. Prepare Basic Auth Header
    const auth = Buffer.from(`${entityId}:${clientSecret}`).toString('base64');

    // 5. Define Return URL (Use a fallback if env var is missing)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';
    
    // 6. Construct Payload for Peach Payments
    const payload = {
      amount: Math.round(amount * 100), // Peach expects cents
      currency: 'ZAR',
      orderReference: orderId,
      description: productName,
      returnUrl: `${baseUrl}/checkout?status=success`,
      cancelUrl: `${baseUrl}/checkout?status=cancelled`,
      webhook: `${baseUrl}/api/webhooks/peach`
    };

    console.log("Initiating Peach Checkout Session with payload:", JSON.stringify(payload));

    // 7. Call Peach Payments API
    let peachResponse;
    try {
      peachResponse = await fetch('https://secure.checkout.peachpayments.co.za/api/v1/sessions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`
        },
        body: JSON.stringify(payload)
      });
    } catch (networkError) {
      console.error("Network error calling Peach API:", networkError);
      return NextResponse.json({ 
        success: false, 
        error: "Network error connecting to payment provider. Please try again later." 
      }, { status: 503 });
    }

    // 8. Handle Peach API Response
    let data;
    try {
      data = await peachResponse.json();
    } catch (jsonParseError) {
      console.error("Failed to parse Peach API response:", jsonParseError);
      return NextResponse.json({ 
        success: false, 
        error: "Failed to process payment provider response." 
      }, { status: 502 });
    }

    if (!peachResponse.ok) {
      console.error("Peach API returned an error:", data);
      throw new Error(data.message || `Peach API Error: ${peachResponse.status}`);
    }

    // 9. Return Success with Checkout URL
    if (data.checkoutUrl) {
      console.log("Successfully generated checkout URL");
      return NextResponse.json({ success: true, checkoutUrl: data.checkoutUrl });
    } else {
      console.error("Peach API did not return a checkoutUrl:", data);
      throw new Error("Payment provider did not provide a checkout link.");
    }
    
  } catch (error: any) {
    // Catch-all for any unexpected errors
    console.error("Unhandled error in peach-payment route:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected internal server error occurred.' 
    }, { status: 500 });
  }
}
