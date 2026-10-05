import { NextResponse } from 'next/server';

// webhook v0610
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function pickCountry(lower: string): string {
  const m = lower.match(/"country"\s*:\s*"([^"]+)"/);
  const c = m ? m[1] : '';
  if (c.includes('south') || c === 'za' || c === 'rsa') return 'southafrica';
  if (c.includes('united') || c === 'us' || c === 'usa') return 'usa';
  if (c.includes('india') || c === 'in') return 'india';
  if (c.includes('china') || c === 'cn') return 'china';
  return 'southafrica';
}

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  try {
    const raw = await req.text();
    const lower = raw.toLowerCase();

    const hasSuccess = /(successful|succeeded|completed|approved|captured)/.test(lower);
    const hasFailure = /(failed|declined|cancelled|canceled|refunded)/.test(lower);

    if (!hasSuccess || hasFailure) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const country = pickCountry(lower);

    if (SUPABASE_URL && SUPABASE_KEY) {
      const headers = {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      };
      const sel = await fetch(`${SUPABASE_URL}/rest/v1/sales_counts?region=eq.${country}&select=count`, {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      });
      const rows = await sel.json().catch(() => []);
      if (Array.isArray(rows) && rows.length > 0) {
        const newCount = (Number(rows[0].count) || 0) + 1;
        await fetch(`${SUPABASE_URL}/rest/v1/sales_counts?region=eq.${country}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ count: newCount }),
        });
      } else {
        await fetch(`${SUPABASE_URL}/rest/v1/sales_counts`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ region: country, count: 1 }),
        });
      }
    }

    return NextResponse.json({ ok: true, counted: country });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
