// src/app/api/create-payment/route.ts
import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';

export async function POST(request: Request) {
  try {
    const { amount, currency, productName, orderId } = await request.json();

    const ENTITY_ID = process.env.PEACH_ENTITY_ID?.trim();
    const SECRET_KEY = process.env.PEACH_SECRET_KEY?.trim();
    const BASE_URL = process.env.NEXT_PUBLIC_URL?.trim();
    const PEACH_MODE = process.env.NEXT_PUBLIC_PEACH_MODE;

    if (!ENTITY_ID || !SECRET_KEY || !BASE_URL) {
      return NextResponse.json({ error: 'Server configuration missing.' }, { status: 500 });
    }

    const nonce = `UNQ${Date.now()}`;
    
    // 🚨 CRITICAL: Only include the 7 fields from Peach's sample in the signature
    const paramsForSigning: Record<string, string> = {
      "amount": amount.toFixed(2),
      "authentication.entityId": ENTITY_ID,
      "currency": currency.toUpperCase(),
      "merchantTransactionId": orderId,
      "nonce": nonce,
      "paymentType": "DB",
      "shopperResultUrl": `${BASE_URL}/success?orderId=${orderId}&amount=${amount}&item=${encodeURIComponent(productName)}`,
    };

    // 🚨 CRITICAL: Signature string = key+value concatenated, NO separators, alphabetical keys
    const sortedKeys = Object.keys(paramsForSigning).sort();
    const sigString = sortedKeys.map(k => `${k}${paramsForSigning[k]}`).join('');
    
    console.log("🔐 Signature string:", sigString);
    
    // Generate HMAC-SHA256 signature using SECRET_KEY as the HMAC key
    const signature = createHmac('sha256', SECRET_KEY).update(sigString).digest('hex');
    console.log("✅ Generated signature:", signature);

    // Build final form data (URL-encoded for HTTP body)
    const formData = new URLSearchParams();
    
    // Add the 7 signed fields
    for (const [key, value] of Object.entries(paramsForSigning)) {
      formData.append(key, value);
    }
    
    // Add signature
    formData.append('signature', signature);
    
    // 🎁 Add optional fields (NOT included in signature)
    formData.append('merchantInvoiceId', orderId);
    formData.append('cancelUrl', `${BASE_URL}/payment?cancelled=true`);
    formData.append('notificationUrl', `${BASE_URL}/api/webhook`);
    formData.append('customParameters[orderId]', orderId);
    formData.append('customParameters[productName]', productName);
    formData.append('customer.givenName', 'Customer');
    formData.append('customer.surname', 'Order');
    formData.append('customer.email', 'order@super-digital.com');
    formData.append('billing.country', 'ZA');
    formData.append('shipping.country', 'ZA');

    const endpoint = PEACH_MODE === 'LIVE' 
      ? 'https://secure.peachpayments.com/checkout/initiate'
      : 'https://testsecure.peachpayments.com/checkout/initiate';

    console.log("📡 POST to:", endpoint);

    // 🚨 CRITICAL: Add Authorization header (base64 of entityId + "|" + secretKey)
    const authCredentials = `${ENTITY_ID}|${SECRET_KEY}`;
    const authHeader = Buffer.from(authCredentials).toString('base64');

    // Send as application/x-www-form-urlencoded
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Referer': BASE_URL,
        'accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${authHeader}`  // 🚨 THIS WAS MISSING!
      },
      body: formData.toString()
    });

    const text = await res.text();
    console.log("📥 Response status:", res.status);
    console.log("📥 Response body:", text.substring(0, 300));
    
    if (!res.ok) {
      console.error("🚫 Peach Error:", text);
      return NextResponse.json({ error: 'Payment initiation failed', peachResponse: text }, { status: res.status });
    }

    const data = JSON.parse(text);
    
    if (data.redirectUrl) {
      console.log("✅ SUCCESS! Redirect:", data.redirectUrl);
      return NextResponse.json({ checkoutUrl: data.redirectUrl });
    }

    return NextResponse.json({ error: 'No redirectUrl', details: data }, { status: 500 });

  } catch (error: any) {
    console.error("💥 CRITICAL ERROR:", error.message);
    return NextResponse.json({ error: 'Payment system error', details: error.message }, { status: 503 });
  }
}
