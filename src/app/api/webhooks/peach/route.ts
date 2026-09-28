export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: Request) {
  const raw = await request.text();
  console.log('WEBHOOK RECEIVED:', raw.slice(0, 200));

  let code = '';
  let country = 'southafrica';

  if (raw.includes('result.code') || raw.includes('result_code')) {
    const params = new URLSearchParams(raw);
    code = params.get('result.code') || params.get('result_code') || '';
    country = (params.get('billing.country') || 'southafrica').toLowerCase().replace(/\s/g, '');
  } else {
    try {
      const json = JSON.parse(raw);
      code = json.result?.code || '';
      country = (json.billing?.country || 'southafrica').toLowerCase().replace(/\s/g, '');
    } catch (e) {
      console.log('JSON Parse Error', e);
    }
  }

  console.log('PARSED:', { code, country });

  if (code.startsWith('000')) {
    const regionMap: Record<string, string> = { za: 'southafrica', us: 'usa', in: 'india', cn: 'china' };
    const region = regionMap[country] || 'southafrica';

    const { data: row } = await supabase
      .from('sales_counts')
      .select('count')
      .eq('region', region)
      .single();

    const next = (Number(row?.count) || 0) + 1;

    if (row) {
      await supabase.from('sales_counts').update({ count: next }).eq('region', region);
    } else {
      await supabase.from('sales_counts').insert([{ region, count: 1 }]);
    }

    console.log('SUCCESS COUNTED:', region, next);
  }

  return NextResponse.json({ ok: true });
}
