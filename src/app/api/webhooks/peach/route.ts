import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-peach-signature') || '';
    const peachSecret = process.env.PEACH_WEBHOOK_SECRET || '';

    // Verify webhook signature
    const hmac = crypto.createHmac('sha256', peachSecret).update(body).digest('hex');
    if (signature !== hmac) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(body);
    
    // Only process successful payments
    if (payload.status !== 'SUCCESS' && payload.status !== 'COMPLETED') {
      return NextResponse.json({ success: true });
    }

    // Determine region (you can adjust logic based on card/EFT country if needed)
    const region = payload.country?.toLowerCase() === 'za' ? 'southAfrica' : 
                   payload.country?.toLowerCase() === 'us' ? 'usa' : 
                   payload.country?.toLowerCase() === 'in' ? 'india' : 
                   payload.country?.toLowerCase() === 'cn' ? 'china' : 'southAfrica';

    // Update Supabase sales counter
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { data: current } = await supabase.from('sales_counts').select('count').eq('region', region).single();
    await supabase.from('sales_counts').update({ count: (current?.count || 0) + 1 }).eq('region', region);

    // TODO: Add email delivery logic here if needed

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
