// src/app/api/create-payment/route.ts
import { NextResponse } from 'next/server';

// Web Crypto API compatible HMAC SHA256 (works in Vercel serverless)
async function generateSignature(params: Record<string, any>, secretKey: string): Promise<string> {
  // Sort keys alphabetically (Peach requirement)
  const sortedKeys = Object.keys(params).sort();
  
  // Build signature string: key=value&key2=value2
  const signatureString = sortedKeys
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  // Use Web Crypto API (available in Vercel)
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secretKey);
  const messageData = encoder.encode(signatureString);
  
  // Import key
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  // Sign
  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  
  // Convert to hex
  return Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function POST(request: Request) {
  try {
    const { amount, currency, productName, orderId } = await request.json();

    // Get environment variables
    const ENTITY_ID = process.env.PEACH_ENTITY_ID;
    const SECRET_KEY = process.env.PEACH_SECRET_KEY;
    const BASE_URL = process.env.NEXT_PUBLIC_URL;
    const WHATSAPP_NUMBER = process.env.YOUR_WHATSAPP_NUMBER;
    const PEACH_MODE = process.env.NEXT_PUBLIC_PEACH_MODE;

    console.log("🔑 Env check:", {
      hasEntityId: !!ENTITY_ID,
      hasSecretKey: !!SECRET_KEY,
      hasBaseUrl: !!BASE_URL,
      mode: PEACH_MODE
    });

    if (!ENTITY_ID || !SECRET_KEY || !BASE_URL) {
      return NextResponse.json({ error: 'Server configuration missing.' }, { status: 500 });
    }

    // Prepare parameters EXACTLY as Peach requires (flat keys with dot/bracket notation)
    const nonce = `UNQ${Date.now()}${Math.floor(Math.random() * 1000000)}`;
    
    const peachParams: Record<string, any> = {
      'authentication.entityId': ENTITY_ID,
      'merchantTransactionId': orderId,
      'rateLimitId': `order-${orderId}`,
      'amount': amount.toFixed(2),
      'paymentType': 'DB',
      'currency': currency.toUpperCase(),
      'nonce': nonce,
      'shopperResultUrl': `${BASE_URL}/payment/success`,
      'merchantInvoiceId': orderId,
      'cancelUrl': `${BASE_URL}/payment/fail`,
      'notificationUrl': `${BASE_URL}/api/webhook`,
      'customParameters[orderId]': orderId,
      'customParameters[productName]': productName,
      'customParameters[whatsappNumber]': WHATSAPP_NUMBER || '',
      'customer.givenName': 'Customer',
      'customer.surname': 'Order',
      'customer.email': 'customer@example.com',
      'customer.ip': '127.0.0.1',
      'billing.country': 'ZA',
      'billing.city': 'Cape Town',
      'shipping.country': 'ZA',
      'shipping.city': 'Cape Town',
    };

    // Generate signature BEFORE adding it to params
    console.log("🔐 Generating signature for params:", Object.keys(peachParams).sort().slice(0, 5), '...');
    const signature = await generateSignature(peachParams, SECRET_KEY);
    console.log("✅ Signature generated:", signature.substring(0, 16) + '...');
    
    // Add signature to params
    peachParams.signature = signature;

    // Determine endpoint (Peach Hosted Checkout)
    const apiEndpoint = PEACH_MODE === 'LIVE'
      ? 'https://secure.peachpayments.com/checkout/initiate'
      : 'https://testsecure.peachpayments.com/checkout/initiate';

    console.log("📡 POST to:", apiEndpoint);

    // Make request with EXACT headers Peach requires
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Referer': BASE_URL, // Must be allowlisted in Peach Dashboard
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify(peachParams)
    });

    console.log("📥 Response status:", response.status);
    
    let data;
    try {
      data = await response.json();
      console.log("📥 Response body:", JSON.stringify(data).slice(0, 200) + '...');
    } catch (e) {
      const text = await response.text();
      console.error("❌ Failed to parse JSON response:", text);
      throw new Error(`Invalid JSON response: ${text}`);
    }

    if (!response.ok) {
      console.error('🚫 Peach API error:', data);
      return NextResponse.json(
        { error: 'Payment initiation failed', details: data },
        { status: response.status }
      );
    }

    // Peach returns redirectUrl for Hosted Checkout
    if (data.redirectUrl) {
      console.log("✅ Success! Redirect URL:", data.redirectUrl);
      return NextResponse.json({ checkoutUrl: data.redirectUrl });
    }

    console.error("❌ No redirectUrl in successful response:", data);
    return NextResponse.json({ error: 'No redirectUrl in response', details: data }, { status: 500 });

  } catch (error: any) {
    console.error('💥 CRITICAL ERROR:', {
      message: error.message,
      name: error.name,
      stack: error.stack?.split('\n')[0]
    });
    return NextResponse.json(
      { error: 'Internal server error during checkout creation', details: error.message },
      { status: 503 }
    );
  }
}
