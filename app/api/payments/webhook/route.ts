
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Webhook Supabase configuration is missing.');

      return NextResponse.json(
        { error: 'Webhook service is not configured' },
        { status: 500 }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseServiceKey
    );

    const body = await request.json();

    // Preserve the existing payment gateway reference fields.
    const sessionId =
      body.session_id ||
      body.tx_ref ||
      body.merchant_transaction_id;

    const gatewayStatus = body.status;

    const newStatus =
      gatewayStatus === 'successful' ||
      gatewayStatus === 'completed'
        ? 'completed'
        : 'failed';

    if (sessionId) {
      const { error } = await supabase
        .from('payments')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('session_id', sessionId);

      if (error) {
        console.error('Webhook payment update failed:', error);

        return NextResponse.json(
          { error: 'Payment update failed' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);

    return NextResponse.json(
      { error: 'Webhook failed' },
      { status: 500 }
    );
  }
}
