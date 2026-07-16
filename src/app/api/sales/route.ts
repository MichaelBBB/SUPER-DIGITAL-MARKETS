import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function GET() {
  try {
    const { data, error } = await supabase.from('sales_counts').select('region, count');
    if (error) throw error;
    
    const stats = { usa: 0, india: 0, china: 0, southAfrica: 0 };
    data?.forEach((item) => { stats[item.region as keyof typeof stats] = item.count; });
    
    // Forces Vercel/CDN to never cache this response
    return NextResponse.json(stats, {
      headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' }
    });
  } catch {
    return NextResponse.json({ usa: 0, india: 0, china: 0, southAfrica: 0 });
  }
}

export async function POST(request: Request) {
  try {
    const { region } = await request.json();
    if (!region || !['usa', 'india', 'china', 'southAfrica'].includes(region)) {
      return NextResponse.json({ error: 'Invalid region' }, { status: 400 });
    }
    const { data: current } = await supabase.from('sales_counts').select('count').eq('region', region).single();
    await supabase.from('sales_counts').update({ count: (current?.count || 0) + 1 }).eq('region', region);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
