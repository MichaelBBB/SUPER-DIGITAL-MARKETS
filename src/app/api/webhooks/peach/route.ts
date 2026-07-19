import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. Get raw body text
    const rawBody = await request.text();
    
    let payload;

    // 2. FORCE Form Data Parsing First (This fixes the "Unexpected token 'a'" error)
    // Peach sends data like: amount=22.99&status=success
    if (rawBody.includes('=')) {
      const params = new URLSearchParams(rawBody);
      payload = {};
      for (const [key, value] of params.entries()) {
        payload[key] = value;
      }
    } else {
      // Fallback to JSON if no '=' signs are found
      try {
        payload = JSON.parse(rawBody);
      } catch (e) {
        return NextResponse.json({ error: 'Invalid Data Format' }, { status: 400 });
      }
    }

    // 3. Check Payment Status
    const status = (payload.status || payload.payment_status || '').toString().toUpperCase();
    
    if (!['SUCCESS', 'COMPLETED', 'PAID'].includes(status)) {
      return NextResponse.json({ success: true, message: 'Ignored non-successful payment' });
    }

    // 4. Determine Region
    const country = (payload.country || payload.source?.country || 'ZA').toString().toUpperCase();
    const regionMap: Record<string, string> = { 
      'US': 'usa', 
      'IN': 'india', 
      'CN': 'china', 
      'ZA': 'southAfrica' 
    };
    const region = regionMap[country] || 'southAfrica';

    // 5. Update Supabase Sales Counter
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    
    const { data: current } = await supabase
      .from('sales_counts')
      .select('count')
      .eq('region', region)
      .single();
      
    await supabase
      .from('sales_counts')
      .update({ count: (current?.count || 0) + 1 })
      .eq('region', region);

    console.log(`Sales updated for ${region}. New count: ${(current?.count || 0) + 1}`);

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
