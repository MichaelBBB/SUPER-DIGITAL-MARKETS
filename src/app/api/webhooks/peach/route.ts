import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    let payload: any = {};

    // ALWAYS parse as form data first (Peach sends this format)
    if (rawBody.includes('=')) {
      const params = new URLSearchParams(rawBody);
      params.forEach((value, key) => {
        payload[key] = value;
      });
    }

    const status = (payload.status || '').toUpperCase();
    
    if (!['SUCCESS', 'COMPLETED', 'PAID'].includes(status)) {
      return NextResponse.json({ success: true });
    }

    const region = 'southAfrica'; // Default for Peach SA
    
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data: current } = await supabase
      .from('sales_counts')
      .select('count')
      .eq('region', region)
      .single();
      
    await supabase
      .from('sales_counts')
      .update({ count: (current?.count || 0) + 1 })
      .eq('region', region);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
