'use client';

import { useEffect, useState } from 'react';

type Buyer = { n: string; p: string; t: string };

const COUNTRIES = [
  { id: 'za', name: 'South Africa', flag: '🇿', start: 131995 },
  { id: 'us', name: 'USA', flag: '🇺🇸', start: 143699 },
  { id: 'in', name: 'India', flag: '🇮', start: 130373 },
  { id: 'cn', name: 'China', flag: '🇨🇳', start: 132135 },
];

const NAMES = ['Thabo M.', 'Raj P.', 'Nomsa K.', 'Mike R.', 'Priya S.', 'Zhang L.', 'Sipho D.', 'Lerato P.', 'James O.', 'Wei C.'];
const PRODUCTS = ['AI Writing Assistant', 'Photo Enhancement Suite', 'Social Media Toolkit', 'Logo Maker Pro', 'SEO Masterclass', 'Email Funnel Pack', 'Brand Kit Deluxe'];

function fmt(n: number): string {
  const s = String(n);
  let out = '';
  for (let i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 === 0) out += ' ';
    out += s[i];
  }
  return out;
}

export default function TrackerPage() {
  const [rev, setRev] = useState<number[]>(COUNTRIES.map((c) => c.start));
  const [buy, setBuy] = useState<Buyer[][]>(COUNTRIES.map(() => []));

  useEffect(() => {
    const t = setInterval(() => {
      const k = Math.floor(Math.random() * COUNTRIES.length);
      const gain = 25 + Math.floor(Math.random() * 175);
      setRev((p) => p.map((x, j) => (j === k ? x + gain : x)));
      if (Math.random() < 0.7) {
        setBuy((p) =>
          p.map((arr, j) => {
            if (j !== k) return arr;
            const aged = arr.map((b, m) => (m === 0 ? { ...b, t: '1m ago' } : b));
            const nb: Buyer = {
              n: NAMES[Math.floor(Math.random() * NAMES.length)],
              p: PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)],
              t: 'Just now',
            };
            return [nb, ...aged].slice(0, 2);
          })
        );
      }
    }, 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Live Revenue by Country (USD)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COUNTRIES.map((c, idx) => (
            <div key={c.id} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-2xl leading-none">{c.flag}</span>
                  <div>
                    <h3 className="font-bold text-lg">{c.name}</h3>
                    <p className="text-xs text-slate-400">Live Revenue (USD)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">${fmt(rev[idx])}</p>
                  <p className="text-xs text-green-500 flex items-center justify-end gap-1 mt-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Updating live
                  </p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full" /> Recent Buyers
                </p>
                {buy[idx].length === 0 ? (
                  <p className="text-center text-slate-500 text-sm py-6">Waiting for next purchase...</p>
                ) : (
                  <div className="space-y-3">
                    {buy[idx].map((b, m) => (
                      <div key={m} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-cyan-900/50 text-cyan-300 flex items-center justify-center text-sm font-bold shrink-0">
                          {b.n.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold truncate">{b.n}</p>
                          <p className="text-xs text-slate-400 truncate">{b.p}</p>
                        </div>
                        <p className="text-xs text-green-400 ml-auto shrink-0">{b.t}</p>
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
