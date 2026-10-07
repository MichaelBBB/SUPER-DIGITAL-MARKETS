import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

const REGIONS = [
  { key: 'southafrica', label: '🇿🇦 South Africa' },
  { key: 'usa', label: '🇺🇸 USA' },
  { key: 'india', label: '🇮🇳 India' },
  { key: 'china', label: '🇨🇳 China' },
];

async function recordSale(formData: FormData) {
  'use server';
  const region = String(formData.get('region') || 'southafrica');
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
  if (!url || !key) return;
  try {
    const h = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };
    const sel = await fetch(`${url}/rest/v1/sales_counts?region=eq.${region}&select=count`, { headers: h, cache: 'no-store' });
    const rows = await sel.json().catch(() => []);
    if (Array.isArray(rows) && rows.length > 0) {
      const next = (Number(rows[0].count) || 0) + 1;
      await fetch(`${url}/rest/v1/sales_counts?region=eq.${region}`, { method: 'PATCH', headers: { ...h, Prefer: 'return=minimal' }, body: JSON.stringify({ count: next }) });
    } else {
      await fetch(`${url}/rest/v1/sales_counts`, { method: 'POST', headers: { ...h, Prefer: 'return=minimal' }, body: JSON.stringify({ region, count: 1 }) });
    }
    revalidatePath('/');
    revalidatePath('/live-trackers');
  } catch (e) {
    console.error('recordSale failed', e);
  }
}

export default function TapPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Record a Real Sale</h1>
          <p className="text-gray-400 text-sm mt-1">Bank‑Mirror Mode — only money in Capitec/Peach counts</p>
          <p className="text-xs text-gray-600 mt-1">Tap v0610</p>
        </div>
        <p className="text-sm text-gray-300 bg-gray-900 border border-gray-800 rounded-xl p-4">
          When a customer's payment shows in your Capitec Main Account (or Peach settles a card), tap their country once. The Live Trackers climb by exactly one real sale.
        </p>
        <div className="space-y-3">
          {REGIONS.map((r) => (
            <form key={r.key} action={recordSale} className="w-full">
              <input type="hidden" name="region" value={r.key} />
              <button type="submit" className="block w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-xl text-center shadow-lg transition-all transform hover:scale-105">
                +1 Real Sale — {r.label}
              </button>
            </form>
          ))}
        </div>
        <a href="/live-trackers" className="block text-center text-cyan-400 hover:text-cyan-300 text-sm">→ See the trackers update</a>
        <a href="/" className="block text-center text-gray-500 hover:text-white text-sm">← Back to Home</a>
      </div>
    </div>
  );
}
