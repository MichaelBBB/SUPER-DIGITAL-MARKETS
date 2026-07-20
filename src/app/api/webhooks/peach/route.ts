import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    let payload;
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      try { payload = JSON.parse(rawBody); } catch (e) { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
    } else {
      const params = new URLSearchParams(rawBody);
      payload = {};
      for (const [key, value] of params.entries()) { payload[key] = value; }
    }

    const status = (payload.status || payload.payment_status || '').toString().toUpperCase();
    if (!['SUCCESS', 'COMPLETED', 'PAID'].includes(status)) return NextResponse.json({ success: true });

    const country = (payload.country || 'ZA').toString().toUpperCase();
    const regionMap: Record<string, string> = { 'US': 'usa', 'IN': 'india', 'CN': 'china', 'ZA': 'southAfrica' };
    const region = regionMap[country] || 'southAfrica';

    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { data: current } = await supabase.from('sales_counts').select('count').eq('region', region).single();
    await supabase.from('sales_counts').update({ count: (current?.count || 0) + 1 }).eq('region', region);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
