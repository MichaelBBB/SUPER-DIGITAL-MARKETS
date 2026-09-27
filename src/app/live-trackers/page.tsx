'use client';
import { useEffect, useState } from 'react';
const ROWS = [
  { id: 'za', name: 'South Africa', tag: 'ZA', cls: 'bg-blue-600', start: 65422 },
  { id: 'us', name: 'USA', tag: 'US', cls: 'bg-blue-800', start: 76559 },
  { id: 'in', name: 'India', tag: 'IN', cls: 'bg-orange-600', start: 64479 },
  { id: 'cn', name: 'China', tag: 'CN', cls: 'bg-red-700', start: 64931 },
];
const NAMES = ['Thabo M.', 'Nomsa K.', 'Mike R.', 'Priya S.', 'Zhang L.', 'Sipho D.', 'Lerato P.', 'James O.'];
const PROD = ['AI Writing Assistant', 'Social Media Toolkit', 'Logo Maker Pro', 'SEO Masterclass', 'Email Funnel Pack'];
type B = { n: string; p: string; t: string };
export default function Page() {
  const [v, setV] = useState<number[]>(ROWS.map((r) => r.start));
  const [b, setB] = useState<B[][]>(ROWS.map(() => []));
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      const k = i % ROWS.length; i++;
      setV((p) => p.map((x, j) => (j === k ? x + 8 + Math.floor(Math.random() * 33) : x)));
      setB((p) => p.map((arr, j) => {
        if (j !== k) return arr;
        const aged = arr.map((x, m) => (m === 0 ? { ...x, t: '1m ago' } : x));
        const nb: B = { n: NAMES[Math.floor(Math.random() * NAMES.length)], p: PROD[Math.floor(Math.random() * PROD.length)], t: 'Just now' };
        return [nb, ...aged].slice(0, 2);
      }));
    }, 2500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Live Revenue by Country (USD)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ROWS.map((r, idx) => (
            <div key={r.id} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={'w-10 h-10 rounded flex items-center justify-center text-white font-bold ' + r.cls}>{r.tag}</div>
                  <div><h3 className="font-bold text-lg">{r.name}</h3><p className="text-xs text-slate-400">Live Revenue (USD)</p></div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">${v[idx].toLocaleString()}</p>
                  <p className="text-xs text-green-500 flex items-center justify-end gap-1 mt-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />Updating live</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2"><span className="w-2 h-2 bg-cyan-400 rounded-full" />Recent Buyers</p>
                {b[idx].length === 0 ? <p className="text-center text-slate-500 text-sm py-6">Waiting for next purchase...</p> :
                  <div className="space-y-3">{b[idx].map((x, m) => (
                    <div key={m} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-cyan-900/50 text-cyan-300 flex items-center justify-center text-sm font-bold shrink-0">{x.n.charAt(0)}</div>
                      <div className="min-w-0 flex-1"><p className="text-sm font-semibold truncate">{x.n}</p><p className="text-xs text-slate-400 truncate">{x.p}</p></div>
                      <p className="text-xs text-green-400 ml-auto shrink-0">{x.t}</p>
                    </div>))}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
