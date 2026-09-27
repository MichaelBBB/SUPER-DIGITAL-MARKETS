'use client';

import { useState, useEffect } from 'react';

// Simple data structure matching your homepage
const COUNTRIES = [
  { id: 'southafrica', name: 'South Africa', flag: '🇿' },
  { id: 'usa', name: 'USA', flag: '🇺' },
  { id: 'india', name: 'India', flag: '🇮' },
  { id: 'china', name: 'China', flag: '🇨' },
];

export default function LiveTrackersPage() {
  // Initial state with realistic numbers
  const [stats, setStats] = useState({
    southafrica: 65422,
    usa: 76559,
    india: 64479,
    china: 64931,
  });

  useEffect(() => {
    // Timer: Updates every 2 seconds automatically
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        southafrica: prev.southafrica + Math.floor(Math.random() * 15) + 5,
        usa: prev.usa + Math.floor(Math.random() * 15) + 5,
        india: prev.india + Math.floor(Math.random() * 15) + 5,
        china: prev.china + Math.floor(Math.random() * 15) + 5,
      }));
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
              <div className="p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{c.flag}</span>
                  <div>
                    <h3 className="font-bold text-lg">{c.name}</h3>
                    <p className="text-xs text-slate-400">Live Revenue (USD)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">
                    ${stats[c.id as keyof typeof stats].toLocaleString()}
                  </p>
                  <p className="text-xs text-green-500 flex items-center justify-end gap-1 mt-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Updating live
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}'use client';

import { useState, useEffect } from 'react';

const C = [
  { id: 'southafrica', name: 'South Africa', tag: 'ZA', color: 'bg-blue-600' },
  { id: 'usa', name: 'USA', tag: 'US', color: 'bg-blue-800' },
  { id: 'india', name: 'India', tag: 'IN', color: 'bg-orange-600' },
  { id: 'china', name: 'China', tag: 'CN', color: 'bg-red-700' },
];
const NAMES = ['Thabo M.', 'Nomsa K.', 'Mike R.', 'Priya S.', 'Zhang L.', 'Sipho D.', 'Lerato P.', 'James O.'];
const PROD = ['AI Writing Assistant', 'Social Media Toolkit', 'Logo Maker Pro', 'SEO Masterclass', 'Email Funnel Pack'];
const START: Record<string, number> = { southafrica: 65422, usa: 76559, india: 64479, china: 64931 };
type B = { name: string; product: string; time: string };

export default function LiveTrackersPage() {
  const [rev, setRev] = useState<Record<string, number>>(START);
  const [buy, setBuy] = useState<Record<string, B[]>>({ southafrica: [], usa: [], india: [], china: [] });

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      const c = C[i % C.length];
      i++;
      setRev((p) => ({ ...p, [c.id]: p[c.id] + 8 + Math.floor(Math.random() * 33) }));
      setBuy((p) => {
        const old = p[c.id].map((b, k) => (k === 0 ? { ...b, time: '1m ago' } : b));
        const nb: B = {
          name: NAMES[Math.floor(Math.random() * NAMES.length)],
          product: PROD[Math.floor(Math.random() * PROD.length)],
          time: 'Just now',
        };
        return { ...p, [c.id]: [nb, ...old].slice(0, 2) };
      });
    }, 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Live Revenue by Country (USD)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {C.map((c) => {
            const list = buy[c.id];
            return (
              <div key={c.id} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={'w-10 h-10 rounded flex items-center justify-center text-white font-bold ' + c.color}>{c.tag}</div>
                    <div>
                      <h3 className="font-bold text-lg">{c.name}</h3>
                      <p className="text-xs text-slate-400">Live Revenue (USD)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-400">${rev[c.id].toLocaleString()}</p>
                    <p className="text-xs text-green-500 flex items-center justify-end gap-1 mt-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Updating live
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full" /> Recent Buyers
                  </p>
                  {list.length === 0 ? (
                    <p className="text-center text-slate-500 text-sm py-6">Waiting for next purchase...</p>
                  ) : (
                    <div className="space-y-3">
                      {list.map((b, k) => (
                        <div key={k} className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-cyan-900/50 text-cyan-300 flex items-center justify-center text-sm font-bold shrink-0">
                            {b.name.charAt(0)}
                          </div>
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
