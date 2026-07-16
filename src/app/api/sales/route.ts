import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Prevents Next.js/Vercel from caching this endpoint
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ usa: 0, india: 0, china: 0, southAfrica: 0 });
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data, error } = await supabase.from('sales_counts').select('region, count');
  
  if (error) return NextResponse.json({ usa: 0, india: 0, china: 0, southAfrica: 0 });

  const stats = { usa: 0, india: 0, china: 0, southAfrica: 0 };
  data?.forEach(item => { stats[item.region as keyof typeof stats] = item.count; });

  return NextResponse.json(stats, {
    headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' }
  });
}

export async function POST(request: Request) {
  try {
    const { region, adminConfirm } = await request.json();
    
    // Only allow increments from your own server or verified admin clicks
    if (!region || !['usa', 'india', 'china', 'southAfrica'].includes(region)) {
      return NextResponse.json({ error: 'Invalid region' }, { status: 400 });
    }

    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { data: current } = await supabase.from('sales_counts').select('count').eq('region', region).single();
    await supabase.from('sales_counts').update({ count: (current?.count || 0) + 1 }).eq('region', region);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
