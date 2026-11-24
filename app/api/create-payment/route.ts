
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PEACH_AUTH_URL =
  'https://dashboard.peachpayments.com/api/oauth/token';

const PEACH_CHECKOUT_URL =
  'https://secure.peachpayments.com/v2/checkout';

const PEACH_WEBHOOK_URL =
  'https://super-digital-markets-co9n.vercel.app/api/webhooks/peach';

function safeProviderError(text: string): string {
  // Limit diagnostic size and redact common credential/token fields.
  return text
    .slice(0, 1500)
    .replace(
      /("(?:access_token|refresh_token|clientSecret|client_secret|token)"\s*:\s*")[^"]*(")/gi,
      '$1[REDACTED]$2'
    );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const productId = body?.productId;
    const email = body?.email;
    const method = body?.method;

    if (
      typeof productId !== 'string' ||
      !productId.trim() ||
      typeof email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return NextResponse.json(
        { error: 'A valid product and email address are required.' },
        { status: 400 }
      );
    }

    if (method !== 'peach') {
      return NextResponse.json(
        { error: 'This payment method is not configured yet.' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const clientId = process.env.PEACH_CLIENT_ID;
    const clientSecret = process.env.PEACH_CLIENT_SECRET;
    const merchantId = process.env.PEACH_MERCHANT_ID;
    const entityId = process.env.PEACH_ENTITY_ID;

    if (
      !supabaseUrl ||
      !serviceRoleKey ||
      !clientId ||
      !clientSecret ||
      !merchantId ||
      !entityId
    ) {
      // Do not log environment-variable values.
      console.error('Create payment: required server configuration is missing.', {
        supabaseUrlPresent: Boolean(supabaseUrl),
        serviceRoleKeyPresent: Boolean(serviceRoleKey),
        peachClientIdPresent: Boolean(clientId),
        peachClientSecretPresent: Boolean(clientSecret),
        peachMerchantIdPresent: Boolean(merchantId),
        peachEntityIdPresent: Boolean(entityId),
      });

      return NextResponse.json(
        { error: 'Payment service configuration is incomplete.' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, name, price_usd')
      .eq('id', productId)
      .single();

    if (
      productError ||
      !product ||
      !Number.isFinite(Number(product.price_usd)) ||
      Number(product.price_usd) <= 0
    ) {
      console.error('Create payment: product lookup failed.', {
        code: productError?.code || 'NO_PRODUCT',
      });

      return NextResponse.json(
        { error: 'The selected product or its price is invalid.' },
        { status: 400 }
      );
    }

    const amount = Number(Number(product.price_usd).toFixed(2));
    const siteUrl = new URL(request.url).origin;

    const merchantTransactionId =
      'SDM' + randomUUID().replace(/-/g, '').slice(0, 10);

    // Step 1: Request a Peach OAuth access token.
    const tokenResponse = await fetch(PEACH_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        clientId,
        clientSecret,
        merchantId,
      }),
      cache: 'no-store',
    });

    if (!tokenResponse.ok) {
      const providerText = await tokenResponse.text();

      console.error('Peach OAuth authentication failed.', {
        httpStatus: tokenResponse.status,
        response: safeProviderError(providerText),
      });

      return NextResponse.json(
        {
          error: `Peach authentication failed (HTTP ${tokenResponse.status}). Please try again later.`,
        },
        { status: 502 }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData?.access_token;

    if (typeof accessToken !== 'string' || !accessToken) {
      console.error('Peach OAuth returned no access token.', {
        responseKeys:
          tokenData && typeof tokenData === 'object'
            ? Object.keys(tokenData)
            : [],
      });

      return NextResponse.json(
        { error: 'Peach authentication returned an invalid response.' },
        { status: 502 }
      );
    }

    // Step 2: Create the real Peach Hosted Checkout session.
    const checkoutResponse = await fetch(PEACH_CHECKOUT_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Origin: siteUrl,
        Referer: `${siteUrl}/`,
      },
      body: JSON.stringify({
        authentication: { entityId },
        merchantTransactionId,
        amount,
        currency: 'USD',
        paymentType: 'DB',
        nonce: randomUUID(),
        shopperResultUrl: `${siteUrl}/api/payments/return`,
        notificationUrl: PEACH_WEBHOOK_URL,
        customer: {
          email: email.trim(),
        },
        customParameters: {
          productId: product.id,
          productName: product.name,
        },
      }),
      cache: 'no-store',
    });

    if (!checkoutResponse.ok) {
      const providerText = await checkoutResponse.text();

      console.error('Peach checkout creation failed.', {
        httpStatus: checkoutResponse.status,
        response: safeProviderError(providerText),
      });

      return NextResponse.json(
        {
          error: `Peach could not create checkout (HTTP ${checkoutResponse.status}). Please try again later.`,
        },
        { status: 502 }
      );
    }

    const checkout = await checkoutResponse.json();

    if (
      typeof checkout?.checkoutId !== 'string' ||
      typeof checkout?.redirectUrl !== 'string' ||
      !checkout.redirectUrl.startsWith('https://')
    ) {
      console.error('Peach returned an incomplete checkout response.', {
        responseKeys:
          checkout && typeof checkout === 'object'
            ? Object.keys(checkout)
            : [],
      });

      return NextResponse.json(
        { error: 'Peach returned an invalid checkout response.' },
        { status: 502 }
      );
    }

    // Step 3: Save the pending payment using the known payments columns.
    // Do not insert product_name unless that column exists in the database.
    const { error: insertError } = await supabase
      .from('payments')
      .insert({
        session_id: checkout.checkoutId,
        amount_usd: amount,
        status: 'pending',
      });

    if (insertError) {
      console.error('Could not record pending payment.', {
        code: insertError.code,
        message: insertError.message,
      });

      return NextResponse.json(
        {
          error:
            'The payment session was created but could not be recorded. Please contact support before retrying.',
        },
        { status: 500 }
      );
    }

    // Step 4: Send the customer to Peach's secure hosted checkout.
    return NextResponse.json({
      redirectUrl: checkout.redirectUrl,
    });
  } catch (error) {
    console.error('Create-payment request failed.', {
      message:
        error instanceof Error ? error.message : 'Unknown server error',
    });

    return NextResponse.json(
      { error: 'Unable to start checkout. Please try again.' },
      { status: 500 }
    );
  }
}
