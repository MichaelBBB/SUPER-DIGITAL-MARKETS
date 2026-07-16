import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-peach-signature') || '';
    const clientSecret = process.env.PEACH_CLIENT_SECRET || '';

    // Verify signature if one is provided (Sandbox sometimes skips this)
    if (signature && clientSecret) {
      const hmac = crypto.createHmac('sha256', clientSecret).update(body).digest('hex');
      if (signature !== hmac) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(body);

    // Only process successful payments
    const status = payload.status?.toUpperCase() || payload.payment_status?.toUpperCase();
    if (!['SUCCESS', 'COMPLETED', 'PAID'].includes(status)) {
      return NextResponse.json({ success: true });
    }

    // Map country to region
    const country = (payload.country || payload.source?.country || 'ZA').toUpperCase();
    const regionMap: Record<string, string> = { 'US': 'usa', 'IN': 'india', 'CN': 'china', 'ZA': 'southAfrica' };
    const region = regionMap[country] || 'southAfrica';

    // Increment Supabase counter
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { data: current } = await supabase.from('sales_counts').select('count').eq('region', region).single();
    await supabase.from('sales_counts').update({ count: (current?.count || 0) + 1 }).eq('region', region);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
