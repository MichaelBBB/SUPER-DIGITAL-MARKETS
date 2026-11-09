
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createHmac, timingSafeEqual } from 'node:crypto';

export const runtime = 'nodejs';

const WEBHOOK_URL =
  'https://super-digital-markets-co9n.vercel.app/api/webhooks/peach';

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.PEACH_WEBHOOK_SECRET;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!secret || !supabaseUrl || !serviceRoleKey) {
      console.error('Peach webhook configuration is incomplete.');
      return NextResponse.json(
        { error: 'Server configuration incomplete.' },
        { status: 500 }
      );
    }

    const rawBody = await request.text();

    const timestamp = request.headers.get('x-webhook-timestamp') || '';
    const webhookId = request.headers.get('x-webhook-id') || '';
    const signature = request.headers.get('x-webhook-signature') || '';
    const algorithm =
      request.headers.get('x-webhook-signature-algorithm') || '';

    if (
      !timestamp ||
      !webhookId ||
      !signature ||
      algorithm.toLowerCase() !== 'hmac-sha256'
    ) {
      return NextResponse.json(
        { error: 'Missing webhook signature.' },
        { status: 401 }
      );
    }

    const signedMessage =
      `${timestamp}.${webhookId}.${WEBHOOK_URL}.${rawBody}`;

    const expectedSignature = createHmac('sha256', secret)
      .update(signedMessage)
      .digest('hex');

    const received = Buffer.from(signature, 'hex');
    const expected = Buffer.from(expectedSignature, 'hex');

    if (
      received.length !== expected.length ||
      !timingSafeEqual(received, expected)
    ) {
      console.error('Peach webhook signature verification failed.');
      return NextResponse.json(
        { error: 'Invalid webhook signature.' },
        { status: 401 }
      );
    }

    // Parse only after signature verification.
    const contentType = request.headers.get('content-type') || '';
    let fields: Record<string, unknown>;

    if (contentType.includes('application/json')) {
      fields = JSON.parse(rawBody) as Record<string, unknown>;
    } else {
      fields = Object.fromEntries(
        new URLSearchParams(rawBody).entries()
      );
    }

    const checkoutId =
      typeof fields.checkoutId === 'string'
        ? fields.checkoutId
        : '';

    const resultCode =
      typeof fields['result.code'] === 'string'
        ? fields['result.code']
        : typeof fields.result_code === 'string'
          ? fields.result_code
          : typeof fields.resultCode === 'string'
            ? fields.resultCode
            : '';

    if (!checkoutId || !resultCode) {
      return NextResponse.json(
        { error: 'Checkout ID or result code missing.' },
        { status: 400 }
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

    const { data: payment, error: lookupError } = await supabase
      .from('payments')
      .select('id, status')
      .eq('session_id', checkoutId)
      .maybeSingle();

    if (lookupError) {
      console.error('Payment lookup failed:', lookupError.code);
      return NextResponse.json(
        { error: 'Payment lookup failed.' },
        { status: 500 }
      );
    }

    if (!payment) {
      console.error('Payment record not found for checkout:', checkoutId);
      return NextResponse.json(
        { error: 'Payment record not found.' },
        { status: 500 }
      );
    }

    // Never downgrade a payment already marked completed.
    if (payment.status === 'completed') {
      return NextResponse.json({ received: true });
    }

    let newStatus: string;

    if (
      resultCode === '000.100.110' ||
      resultCode === '000.000.000'
    ) {
      newStatus = 'completed';
    } else if (resultCode.startsWith('000.200.')) {
      newStatus = 'pending';
    } else if (resultCode === '100.396.101') {
      newStatus = 'cancelled';
    } else if (resultCode === '100.396.104') {
      newStatus = 'uncertain';
    } else if (resultCode.startsWith('000.')) {
      // Do not guess the meaning of unfamiliar success-family codes.
      console.warn('Unmapped Peach result code:', resultCode);
      return NextResponse.json(
        { received: true, reviewRequired: true }
      );
    } else {
      newStatus = 'failed';
    }

    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.id);

    if (updateError) {
      console.error('Payment update failed:', updateError.code);
      return NextResponse.json(
        { error: 'Payment update failed.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(
      'Peach webhook error:',
      error instanceof Error ? error.message : 'Unknown error'
    );

    return NextResponse.json(
      { error: 'Webhook processing failed.' },
      { status: 500 }
    );
  }
}

