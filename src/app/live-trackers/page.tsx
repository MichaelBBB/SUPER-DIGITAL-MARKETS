'use client';

import { useEffect, useState } from 'react';

const URL = 'https://qrfmfvbcorbuqcdpliqs.supabase.co/rest/v1/sales_counts?select=region,count';
const KEY = 'sb_publishable_5PU-k6ynenRWOEktBuWBTA_0aGF-lO5';

const CARDS = [
  { id: 'southafrica', name: 'South Africa', tag: 'ZA', cls: 'bg-blue-600' },
  { id: 'usa', name: 'USA', tag: 'US', cls: 'bg-blue-800' },
  { id: 'india', name: 'India', tag: 'IN', cls: 'bg-orange-600' },
  { id: 'china', name: 'China', tag: 'CN', cls: 'bg-red-700' },
];

export default function LiveTrackersPage() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [status, setStatus] = useState('Connecting...');

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch(URL, { headers: { apikey: KEY } });
        if (!res.ok) {
          if (alive) setStatus('HTTP ' + res.status);
          return;
        }
        const rows = await res.json();
        if (!alive) return;
        const map: Record<string, number> = {};
        for (const row of rows) {
          const r = String(row.region || '').toLowerCase().replace(/\s/g, '');
          map[r] = Number(row.count) || 0;
        }
        setCounts(map);
        setStatus('Live ' + new Date().toLocaleTimeString());
      } catch {
        if (alive) setStatus('Network error');
      }
    };
    load();
    const t = setInterval(load, 3000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const total = CARDS.reduce((s, c) => s + (counts[c.id] || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <h2 className="text-2xl font-bold">Live Revenue by Country (USD)</h2>
          <span className="text-xs px-3 py-1 rounded-full bg-slate-800 border border-green-800 text-green-400">{status}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <p className="text-sm text-slate-400 mb-1">Orders Today</p>
            <p className="text-4xl font-bold text-green-400">{total.toLocaleString()}</p>
          </div>
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <p className="text-sm text-slate-400 mb-1">Revenue Today</p>
            <p className="text-4xl font-bold text-cyan-400">${(total * 5).toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CARDS.map((c) => (
            <div key={c.id} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <div className="p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={'w-10 h-10 rounded flex items-center justify-center text-white font-bold ' + c.cls}>{c.tag}</div>
                  <div>
                    <h3 className="font-bold text-lg">{c.name}</h3>
                    <p className="text-xs text-slate-400">Live Revenue (USD)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">${((counts[c.id] || 0) * 5).toLocaleString()}</p>
                  <p className="text-xs text-green-500 flex items-center justify-end gap-1 mt-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Updating live
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-500 text-sm mt-8">
          Reads your real Supabase database every 3 seconds. Record sales at /tap.
        </p>
      </div>
    </div>
  );
}
