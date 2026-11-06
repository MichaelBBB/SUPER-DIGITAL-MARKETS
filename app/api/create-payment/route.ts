
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';

export const runtime = 'nodejs';

const PEACH_AUTH_URL =
  'https://dashboard.peachpayments.com/api/oauth/token';

const PEACH_CHECKOUT_URL =
  'https://secure.peachpayments.com/v2/checkout';

export async function POST(request: NextRequest) {
  try {
    const {
      productId,
      email,
      method,
    } = await request.json();

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

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

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
      console.error('Required server configuration is missing.');

      return NextResponse.json(
        { error: 'Payment service configuration is incomplete.' },
        { status: 500 }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    // Always retrieve the price from the database.
    const { data: product, error: productError } =
      await supabase
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
      return NextResponse.json(
        { error: 'The selected product or its price is invalid.' },
        { status: 400 }
      );
    }

    const amount = Number(
      Number(product.price_usd).toFixed(2)
    );

    const siteUrl = new URL(request.url).origin;

    // Peach requires a unique transaction reference
    // between 8 and 16 characters.
    const merchantTransactionId =
      'SDM' + randomUUID().replace(/-/g, '').slice(0, 10);

    const tokenResponse = await fetch(PEACH_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientId,
        clientSecret,
        merchantId,
      }),
      cache: 'no-store',
    });

    if (!tokenResponse.ok) {
      console.error(
        'Peach authentication failed:',
        tokenResponse.status
      );

      return NextResponse.json(
        { error: 'Peach authentication failed. Please contact support.' },
        { status: 502 }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (typeof accessToken !== 'string' || !accessToken) {
      console.error('Peach returned no access token.');

      return NextResponse.json(
        { error: 'Peach authentication returned an invalid response.' },
        { status: 502 }
      );
    }

    const checkoutResponse = await fetch(
      PEACH_CHECKOUT_URL,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Origin': siteUrl,
          'Referer': `${siteUrl}/`,
        },
        body: JSON.stringify({
          authentication: {
            entityId,
          },
          merchantTransactionId,
          amount,
          currency: 'USD',
          paymentType: 'DB',
          nonce: randomUUID(),
          shopperResultUrl:
            `${siteUrl}/api/payments/return`,
          notificationUrl:
            `${siteUrl}/api/payments/webhook`,
          customer: {
            email: email.trim(),
          },
          customParameters: {
            productId: product.id,
          },
        }),
        cache: 'no-store',
      }
    );

    if (!checkoutResponse.ok) {
      console.error(
        'Peach checkout creation failed:',
        checkoutResponse.status
      );

      return NextResponse.json(
        { error: 'Peach could not create checkout. Please try again.' },
        { status: 502 }
      );
    }

    const checkout = await checkoutResponse.json();

    if (
      typeof checkout.checkoutId !== 'string' ||
      typeof checkout.redirectUrl !== 'string' ||
      !checkout.redirectUrl.startsWith('https://')
    ) {
      console.error('Peach returned an incomplete checkout response.');

      return NextResponse.json(
        { error: 'Peach returned an invalid checkout response.' },
        { status: 502 }
      );
    }

    // Record a pending payment before redirecting the customer.
    const { error: insertError } = await supabase
      .from('payments')
      .insert({
        session_id: checkout.checkoutId,
        amount_usd: amount,
        status: 'pending',
      });

    if (insertError) {
      console.error(
        'Could not record pending payment:',
        insertError.code
      );

      return NextResponse.json(
        { error: 'The payment record could not be created. Please contact support before retrying.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      redirectUrl: checkout.redirectUrl,
    });
  } catch (error) {
    console.error(
      'Create-payment request failed:',
      error instanceof Error ? error.message : 'Unknown error'
    );

    return NextResponse.json(
      { error: 'Unable to start checkout. Please try again.' },
      { status: 500 }
    );
  }
}

