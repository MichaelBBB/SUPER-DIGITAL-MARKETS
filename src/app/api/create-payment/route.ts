// src/app/api/create-payment/route.ts
import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';

// Helper: Generate HMAC SHA256 signature
function generateSignature(params: Record<string, any>, secretKey: string): string {
  // Peach requires signature of all parameters in alphabetical order
  const sortedKeys = Object.keys(params).sort();
  const signatureString = sortedKeys
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  return createHmac('sha256', secretKey)
    .update(signatureString)
    .digest('hex');
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

    if (!ENTITY_ID || !SECRET_KEY || !BASE_URL) {
      return NextResponse.json({ error: 'Server configuration missing.' }, { status: 500 });
    }

    // Prepare parameters EXACTLY as Peach requires
    const nonce = `UNQ${Date.now()}${Math.floor(Math.random() * 1000000)}`;
    
    const peachParams: Record<string, any> = {
      'authentication.entityId': ENTITY_ID,
      'merchantTransactionId': orderId,
      'rateLimitId': `customer-${orderId}-order-${Date.now()}`,
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
      // Optional but recommended customer fields
      'customer.givenName': 'Customer',
      'customer.surname': 'Order',
      'customer.email': 'customer@example.com',
      'customer.ip': '127.0.0.1', // Vercel will replace with real IP if configured
      'billing.country': 'ZA',
      'billing.city': 'Cape Town',
      'shipping.country': 'ZA',
      'shipping.city': 'Cape Town',
    };

    // Generate HMAC SHA256 signature [[1]]
    const signature = generateSignature(peachParams, SECRET_KEY);
    peachParams.signature = signature;

    // Determine endpoint
    const apiEndpoint = PEACH_MODE === 'LIVE'
      ? 'https://secure.peachpayments.com/checkout/initiate'
      : 'https://testsecure.peachpayments.com/checkout/initiate';

    console.log("📡 Sending to Peach:", apiEndpoint);
    console.log("🔐 Signature generated:", signature.substring(0, 16) + '...');

    // Make request with CORRECT headers and JSON body
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Referer': BASE_URL, // Must be allowlisted in Peach Dashboard [[16]]
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify(peachParams)
    });

    const data = await response.json();
    console.log("📥 Peach Response:", response.status, data);

    if (!response.ok) {
      console.error('Peach API Error:', data);
      return NextResponse.json(
        { error: 'Payment initiation failed', details: data },
        { status: response.status }
      );
    }

    // Peach returns redirectUrl for Hosted Checkout
    if (data.redirectUrl) {
      return NextResponse.json({ checkoutUrl: data.redirectUrl });
    }

    return NextResponse.json({ error: 'No redirectUrl in response', details: data }, { status: 500 });

  } catch (error: any) {
    console.error('💥 CRITICAL ERROR:', error.message);
    return NextResponse.json(
      { error: 'Problem Connecting To Peach Payments', details: error.message },
      { status: 503 }
    );
  }
}
