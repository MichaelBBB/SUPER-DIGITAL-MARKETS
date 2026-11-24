
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const salesMode = searchParams.get('mode') === 'sales';
    const sessionId = searchParams.get('session_id');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Payment status API configuration is missing.');
      return NextResponse.json(
        { error: 'Payment status service is not configured' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    if (salesMode) {
      const { data, error } = await supabase
        .from('payments')
        .select('product_name, amount_usd, status, created_at')
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Could not load completed payments:', error.message);
        return NextResponse.json(
          { error: 'Unable to load completed payments' },
          { status: 500 }
        );
      }

      const sales = data || [];
      const revenueUSD = sales.reduce(
        (sum, payment) => sum + Number(payment.amount_usd || 0),
        0
      );

      return NextResponse.json({
        sales,
        count: sales.length,
        revenueUSD,
      });
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('payments')
      .select('status, amount_usd')
      .eq('session_id', sessionId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: data.status,
      amountUSD: data.amount_usd,
    });
  } catch (err) {
    console.error('Error fetching payment status:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
