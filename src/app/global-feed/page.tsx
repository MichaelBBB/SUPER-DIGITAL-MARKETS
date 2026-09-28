'use client';
import { useState, useEffect } from 'react';

const COUNTRIES = [
  { id: 'southafrica', name: 'South Africa', flag: 'ZA', cls: 'bg-blue-600', start: 65422 },
  { id: 'usa', name: 'USA', flag: 'US', cls: 'bg-blue-800', start: 76559 },
  { id: 'india', name: 'India', flag: 'IN', cls: 'bg-orange-600', start: 64479 },
  { id: 'china', name: 'China', flag: 'CN', cls: 'bg-red-700', start: 64931 },
];
const NAMES = ['Thabo M.', 'Nomsa K.', 'Mike R.', 'Priya S.', 'Zhang L.', 'Sipho D.', 'Lerato P.', 'James O.'];
const PRODUCTS = ['AI Writing Assistant', 'Social Media Toolkit', 'Logo Maker Pro', 'SEO Masterclass', 'Email Funnel Pack'];

export default function Page() {
  const [rev, setRev] = useState<Record<string, number>>({});
  const [buyers, setBuyers] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const initRev: Record<string, number> = {};
    const initBuy: Record<string, any[]> = {};
    COUNTRIES.forEach(c => { initRev[c.id] = c.start; initBuy[c.id] = []; });
    setRev(initRev);
    setBuyers(initBuy);

    const interval = setInterval(() => {
      const c = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
      setRev(prev => ({ ...prev, [c.id]: (prev[c.id] || c.start) + Math.floor(Math.random() * 30) + 10 }));
      setBuyers(prev => {
        const old = (prev[c.id] || []).map((b, i) => (i === 0 ? { ...b, time: '1m ago' } : b));
        const nb = {
          name: NAMES[Math.floor(Math.random() * NAMES.length)],
          product: PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)],
          time: 'Just now'
        };
        return { ...prev, [c.id]: [nb, ...old].slice(0, 2) };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Live Revenue by Country (USD)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COUNTRIES.map((c) => (
            <div key={c.id} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={'w-10 h-10 rounded flex items-center justify-center text-white font-bold ' + c.cls}>{c.flag}</div>
                  <div>
                    <h3 className="font-bold text-lg">{c.name}</h3>
                    <p className="text-xs text-slate-400">Live Revenue (USD)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">${(rev[c.id] || c.start).toLocaleString()}</p>
                  <p className="text-xs text-green-500 flex items-center justify-end gap-1 mt-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Updating live
                  </p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full" /> Recent Buyers
                </p>
                {(buyers[c.id] || []).length === 0 ? (
                  <p className="text-center text-slate-500 text-sm py-6">Waiting for next purchase...</p>
                ) : (
                  <div className="space-y-3">
                    {(buyers[c.id] || []).map((b, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-cyan-900/50 text-cyan-300 flex items-center justify-center text-sm font-bold shrink-0">{b.name.charAt(0)}</div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-white truncate">{b.name}</p>
                          <p className="text-xs text-slate-400 truncate">{b.product}</p>
                        </div>
                        <p className="text-xs text-green-400 ml-auto shrink-0">{b.time}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
