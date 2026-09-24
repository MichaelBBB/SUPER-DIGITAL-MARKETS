export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const headers = Object.fromEntries(request.headers.entries());
    
    console.log('📥 PEACH WEBHOOK RECEIVED');
    console.log('Headers:', headers);
    console.log('Body:', rawBody);

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (e) {
      console.error('❌ Failed to parse webhook JSON');
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // 1. CHECK FOR SUCCESS (Peach uses multiple success indicators)
    const isSuccessful = 
      payload.status === 'SUCCESSFUL' || 
      payload.status === 'successful' ||
      payload.result?.code === '000.000.000' || 
      payload.result?.code === '0' ||
      payload.event_type === 'payment.successful';

    if (isSuccessful) {
      console.log('✅ PAYMENT SUCCESSFUL - Triggering automatic tracker update!');

      // 2. DETERMINE REGION (Default to southafrica if not provided)
      const region = payload.metadata?.region || 'southafrica';
      const normalizedRegion = region.toLowerCase().replace(/\s/g, '');

      console.log(`🌍 Updating region: ${normalizedRegion}`);

      // 3. FETCH CURRENT COUNT
      const { data: current, error: fetchError } = await supabase
        .from('sales_counts')
        .select('count')
        .eq('region', normalizedRegion)
        .single();

      if (fetchError) {
        console.error('❌ Fetch error:', fetchError);
      }

      // 4. INCREMENT AND UPDATE
      const newCount = (current?.count || 0) + 1;
      
      const { error: updateError } = await supabase
        .from('sales_counts')
        .update({ 
          count: newCount, 
          updated_at: new Date().toISOString() 
        })
        .eq('region', normalizedRegion);

      if (updateError) {
        console.error('❌ Update error:', updateError);
      } else {
        console.log(`🚀 SUCCESS: Tracker updated! ${normalizedRegion} is now ${newCount}`);
      }
    } else {
      console.log('⚠️ Payment not successful. Status:', payload.status || payload.result?.code);
    }

    // 5. ALWAYS RETURN 200 OK TO PEACH (Stops them from retrying)
    return NextResponse.json({ received: true, status: 'ok' }, { status: 200 });

  } catch (err) {
    console.error('❌ CRITICAL WEBHOOK ERROR:', err);
    // Still return 200 so Peach doesn't keep retrying a broken request
    return NextResponse.json({ error: 'Processed with error' }, { status: 200 });
  }
}
