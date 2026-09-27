'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const COUNTRIES = [
  { id: 'southafrica', name: 'South Africa', tag: 'ZA', cls: 'bg-blue-600' },
  { id: 'usa', name: 'USA', tag: 'US', cls: 'bg-blue-800' },
  { id: 'india', name: 'India', tag: 'IN', cls: 'bg-orange-600' },
  { id: 'china', name: 'China', tag: 'CN', cls: 'bg-red-700' },
];

export default function Page() {
  const [rev, setRev] = useState<Record<string, number>>({
    southafrica: 0, usa: 0, india: 0, china: 0
  });

  useEffect(() => {
    const fetchRealData = async () => {
      const { data: rows } = await supabase.from('sales_counts').select('region, count');
      if (rows) {
        const next: Record<string, number> = { southafrica: 0, usa: 0, india: 0, china: 0 };
        rows.forEach((row: any) => {
          const r = String(row.region || '').toLowerCase().replace(/\s/g, '');
          const c = Number(row.count) || 0;
          if (r.includes('south') || r === 'za' || r === 'rsa') next.southafrica = c * 5;
          else if (r.includes('usa') || r === 'us') next.usa = c * 5;
          else if (r.includes('india') || r === 'in') next.india = c * 5;
          else if (r.includes('china') || r === 'cn') next.china = c * 5;
        });
        setRev(next);
      }
    };
    fetchRealData();
    const t = setInterval(fetchRealData, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Live REAL Revenue by Country (USD)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COUNTRIES.map((r) => (
            <div key={r.id} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={'w-10 h-10 rounded flex items-center justify-center text-white font-bold ' + r.cls}>{r.tag}</div>
                  <div><h3 className="font-bold text-lg">{r.name}</h3><p className="text-xs text-slate-400">Real Live Revenue (USD)</p></div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">${(rev[r.id] || 0).toLocaleString()}</p>
                  <p className="text-xs text-green-500 flex items-center justify-end gap-1 mt-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />Connected to Database</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-slate-500 text-sm mt-8">Data updates every 3 seconds from Supabase. Use /tap to record manual sales.</p>
      </div>
    </div>
  );
}
