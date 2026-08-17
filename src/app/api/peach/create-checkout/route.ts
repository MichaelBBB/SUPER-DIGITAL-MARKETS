import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { amount, currency, redirect_url, webhooks } = await request.json();

    // ✅ CORRECT LIVE ENDPOINT FROM PEACH DOCS
    const PEACH_API_URL = "https://secure.peachpayments.com/checkout";
    
    // ✅ Your credentials from Peach Dashboard
    const ENTITY_ID = process.env.PEACH_ENTITY_ID;
    const SECRET_TOKEN = process.env.PEACH_SECRET_TOKEN;

    if (!ENTITY_ID || !SECRET_TOKEN) {
      return NextResponse.json(
        { error: "Missing Peach credentials in environment variables" },
        { status: 400 }
      );
    }

    // ✅ Build request payload for Hosted Checkout
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
        success_url: redirect_url || `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
        failure_url: redirect_url || `${process.env.NEXT_PUBLIC_SITE_URL}/failure`,
        cancel_url: redirect_url || `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`
      },
      webhooks: webhooks || []
    };

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

    if (!response.ok) {
      console.error("Peach API Error:", data);
      return NextResponse.json(
        { error: data.result?.description || "Payment creation failed" },
        { status: response.status }
      );
    }

    // ✅ Return checkout URL for redirect
    return NextResponse.json({
      checkout_url: data.redirect?.url || data.url,
      transaction_id: data.id,
      result: data.result
    });

  } catch (error) {
    console.error("Checkout API Error:", error);
    return NextResponse.json(
      { error: "Internal server error during checkout creation" },
      { status: 500 }
    );
  }
}
