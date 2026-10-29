import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('payments')
      .select('status, amount_usd')
      .eq('session_id', sessionId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      status: data.status, 
      amountUSD: data.amount_usd 
    });
  } catch (err) {
    console.error('Error fetching payment status:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
