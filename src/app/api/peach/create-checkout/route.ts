// src/app/api/peach/create-checkout/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { amount, currency, redirect_url, webhooks } = await request.json();

    // ✅ CORRECT LIVE ENDPOINT FROM PEACH DOCS
    const PEACH_API_URL = "https://secure.peachpayments.com/checkout";
    
    // ✅ Your credentials from Peach Dashboard (MUST be set in Vercel env vars)
    const ENTITY_ID = process.env.PEACH_ENTITY_ID;
    const SECRET_TOKEN = process.env.PEACH_SECRET_TOKEN;

    // DEBUG: Log if credentials are missing (check Vercel logs)
    if (!ENTITY_ID || !SECRET_TOKEN) {
      console.error("❌ Missing Peach credentials in environment variables");
      console.error("PEACH_ENTITY_ID:", ENTITY_ID ? "✓ Set" : "✗ MISSING");
      console.error("PEACH_SECRET_TOKEN:", SECRET_TOKEN ? "✓ Set" : "✗ MISSING");
      
      return NextResponse.json(
        { error: "Missing Peach credentials. Check Vercel environment variables." },
        { status: 400 }
      );
    }

    // ✅ Build request payload for Hosted Checkout (Peach API format)
    const payload = {
      entity_id: ENTITY_ID,
      amount: amount, // in cents (e.g., 5499 for R54.99)
      currency: currency, // "ZAR"
      payment_type: "DB", // Debit
      brand: "VISA", // or "MASTER" etc.
      merchant: {
        name: "Super Digital Markets",
        street1: "123 Main St",
        city: "Cape Town",
        state: "WC",
        country: "ZA",
        postcode: "8001",
        email: "merchant@superdigitalmarkets.com",
        phone: "+27211234567"
      },
      customer: {
        // Peach will auto-capture these during checkout flow
        givenName: "",
        surname: "",
        email: "",
        phone: ""
      },
      billing: {
        street1: "",
        city: "",
        state: "",
        country: "ZA",
        postcode: ""
      },
      shipping: {
        street1: "",
        city: "",
        state: "",
        country: "ZA",
        postcode: ""
      },
      custom_parameters: {
        "request.receipt": "true",
        "request.redirect": "true"
      },
      redirect: {
        success_url: redirect_url || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://super-digital-markets-co9n.vercel.app'}/success`,
        failure_url: redirect_url || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://super-digital-markets-co9n.vercel.app'}/failure`,
        cancel_url: redirect_url || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://super-digital-markets-co9n.vercel.app'}/cancel`
      },
      webhooks: webhooks || []
    };

    // DEBUG: Log the request being sent
    console.log("🔹 Sending to Peach API:", PEACH_API_URL);
    console.log("🔹 Payload entity_id:", ENTITY_ID?.substring(0, 8) + "...");

    // ✅ Make API call to CORRECT endpoint
    const response = await fetch(PEACH_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SECRET_TOKEN}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    // DEBUG: Log Peach response
    console.log("🔹 Peach API Response Status:", response.status);
    console.log("🔹 Peach API Response Body:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("❌ Peach API Error:", data);
      return NextResponse.json(
        { error: data.result?.description || data.message || "Payment creation failed" },
        { status: response.status }
      );
    }

    // ✅ Return checkout URL for redirect
    return NextResponse.json({
      checkout_url: data.redirect?.url || data.url,
      transaction_id: data.id,
      result: data.result
    });

  } catch (error: any) {
    console.error("💥 Checkout API Error:", error);
    console.error("💥 Error name:", error.name);
    console.error("💥 Error message:", error.message);
    console.error("💥 Error stack:", error.stack);
    
    return NextResponse.json(
      { error: "Internal server error during checkout creation" },
      { status: 500 }
    );
  }
}
