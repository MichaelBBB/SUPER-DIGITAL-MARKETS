import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Adjust key names based on your exact gateway (Peach/Flutterwave)
    const sessionId = body.session_id || body.tx_ref || body.merchant_transaction_id; 
    const gatewayStatus = body.status; 
    
    const newStatus = (gatewayStatus === 'successful' || gatewayStatus === 'completed') 
      ? 'completed' 
      : 'failed';

    if (sessionId) {
      await supabase
        .from('payments')
        .update({ 
          status: newStatus, 
          updated_at: new Date().toISOString() 
        })
        .eq('session_id', sessionId);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
