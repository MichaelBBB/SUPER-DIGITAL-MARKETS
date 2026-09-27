export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const WEBHOOK_URL = 'https://super-digital-markets-co9n.vercel.app/api/webhooks/peach';
const SECRET = process.env.PEACH_WEBHOOK_SECRET || '';
const SUCCESS_CODES = ['000.000.000', '000.100.110'];
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: Request) {
  const raw = await request.text();
  console.log('PEACH WEBHOOK RAW:', raw.slice(0, 400));

  let json: Record<string, any> | null = null;
  const ct = request.headers.get('content-type') || '';
  if (ct.includes('json') || raw.trim().startsWith('{')) {
    try { json = JSON.parse(raw); } catch { json = null; }
  }
  const params = json ? null : new URLSearchParams(raw);

  const ts = request.headers.get('x-webhook-timestamp') || '';
  const wid = request.headers.get('x-webhook-id') || '';
  const sig = request.headers.get('x-webhook-signature') || '';
  if (sig && SECRET) {
    const msg = ts + '.' + wid + '.' + WEBHOOK_URL + '.' + raw;
    const calc = crypto.createHmac('sha256', SECRET).update(msg).digest('hex');
    console.log(calc === sig ? 'SIG OK' : 'SIG MISMATCH - processing anyway');
  }

  const get = (dotted: string, flat: string): string => {
    if (json) {
      if (typeof json[dotted] === 'string') return json[dotted];
      if (typeof json[flat] === 'string') return json[flat];
      const parts = dotted.split('.');
      const nested = json[parts[0]];
      if (nested && typeof nested === 'object' && typeof nested[parts[1]] === 'string') return nested[parts[1]];
      return '';
    }
    const p = params as URLSearchParams;
    return p.get(dotted) || p.get(flat) || '';
  };

  const code = get('result.code', 'result_code');
  const desc = get('result.description', 'result_description');
  const ptype = get('paymentType', 'paymentType');
  const country = get('billing.country', 'billing_country').toUpperCase();
  const amount = get('amount', 'amount');
  const txn = get('id', 'id');

  const isSale =
    ptype !== 'RF' &&
    (SUCCESS_CODES.includes(code) || /approved|successfully processed/i.test(desc));

  console.log('PARSED', { code, desc, ptype, country, amount, txn, isSale });

  if (isSale) {
    const regionMap: Record<string, string> = { ZA: 'southafrica', US: 'usa', IN: 'india', CN: 'china' };
    const region = regionMap[country] || 'southafrica';
    const { data: row } = await supabase
      .from('sales_counts')
      .select('count')
      .eq('region', region)
      .single();
    const next = (Number(row && row.count) || 0) + 1;
    if (row) {
      await supabase.from('sales_counts').update({ count: next }).eq('region', region);
    } else {
      await supabase.from('sales_counts').insert([{ region, count: 1 }]);
    }
    console.log('COUNTED AUTOMATICALLY:', region, next);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
