// src/app/api/debug-payment/route.ts
import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';

export async function POST(request: Request) {
  // Hardcoded test values matching Peach's example structure but using YOUR credentials
  const ENTITY_ID = process.env.PEACH_ENTITY_ID?.trim();
  const SECRET_KEY = process.env.PEACH_SECRET_KEY?.trim();
  const BASE_URL = process.env.NEXT_PUBLIC_URL?.trim();

  if (!ENTITY_ID || !SECRET_KEY || !BASE_URL) {
    return NextResponse.json({ error: 'Missing Env Vars' }, { status: 500 });
  }

  // Clean URL
  const cleanBaseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  const shopperResultUrl = `${cleanBaseUrl}/success`;

  const testParams = {
    amount: "5.00",
    "authentication.entityId": ENTITY_ID,
    currency: "USD",
    merchantTransactionId: "DEBUG-TEST-001",
    nonce: `UNQ${Date.now()}`,
    paymentType: "DB",
    shopperResultUrl: shopperResultUrl,
  };

  // Generate Signature String (Alphabetical, Key+Value, No Separators)
  const sortedKeys = Object.keys(testParams).sort();
  let sigString = "";
  for (const key of sortedKeys) {
    sigString += key + testParams[key];
  }

  // Generate HMAC
  const signature = createHmac('sha256', SECRET_KEY).update(sigString, 'utf8').digest('hex');

  // Construct the cURL command
  const formData = new URLSearchParams();
  formData.append('authentication.entityId', ENTITY_ID);
  formData.append('signature', signature);
  formData.append('merchantTransactionId', testParams.merchantTransactionId);
  formData.append('amount', testParams.amount);
  formData.append('paymentType', testParams.paymentType);
  formData.append('currency', testParams.currency);
  formData.append('nonce', testParams.nonce);
  formData.append('shopperResultUrl', testParams.shopperResultUrl);
  formData.append('merchantInvoiceId', testParams.merchantTransactionId);
  formData.append('cancelUrl', `${cleanBaseUrl}/payment?cancelled=true`);
  formData.append('notificationUrl', `${cleanBaseUrl}/api/webhook`);

  const curlCommand = `curl --location 'https://secure.peachpayments.com/checkout/initiate' \\
--header 'Content-Type: application/x-www-form-urlencoded' \\
--header 'Referer: ${cleanBaseUrl}' \\
--data-urlencode 'authentication.entityId=${ENTITY_ID}' \\
--data-urlencode 'signature=${signature}' \\
--data-urlencode 'merchantTransactionId=${testParams.merchantTransactionId}' \\
--data-urlencode 'amount=${testParams.amount}' \\
--data-urlencode 'paymentType=${testParams.paymentType}' \\
--data-urlencode 'currency=${testParams.currency}' \\
--data-urlencode 'nonce=${testParams.nonce}' \\
--data-urlencode 'shopperResultUrl=${testParams.shopperResultUrl}' \\
--data-urlencode 'merchantInvoiceId=${testParams.merchantTransactionId}' \\
--data-urlencode 'cancelUrl=${cleanBaseUrl}/payment?cancelled=true' \\
--data-urlencode 'notificationUrl=${cleanBaseUrl}/api/webhook'`;

  return NextResponse.json({
    message: "Debug Data Generated. Copy the 'curlCommand' below and run it in your terminal. If it fails, send the output to Peach Support.",
    debug: {
      entityId: ENTITY_ID,
      secretKeyPreview: SECRET_KEY.substring(0, 8) + '...',
      baseUrl: cleanBaseUrl,
      signatureStringUsed: sigString,
      generatedSignature: signature,
      curlCommand: curlCommand
    }
  });
}
