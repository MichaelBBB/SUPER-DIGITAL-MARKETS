'use client';
import { useEffect, useState } from 'react';

type Buyer = { name: string; product: string; mins: number };
type Country = { code: string; name: string; letter: string; color: string; revenue: number; buyers: Buyer[] };

const POOLS: Record<string, { name: string; product: string }[]> = {
  ZA: [
    { name: 'Thabo M.', product: 'SEO Masterclass' },
    { name: 'Lerato P.', product: 'Logo Maker Pro' },
    { name: 'Sipho N.', product: 'Netflix Premium' },
    { name: 'Anele D.', product: 'Spotify Premium' },
  ],
  US: [
    { name: 'James O.', product: 'Social Media Toolkit' },
    { name: 'Sarah B.', product: 'ChatGPT Plus' },
    { name: 'Jason K.', product: 'ExpressVPN' },
    { name: 'Emily R.', product: 'Grammarly Premium' },
  ],
  IN: [
    { name: 'Priya S.', product: 'ChatGPT Plus' },
    { name: 'Arjun V.', product: 'Cursor AI Pro' },
    { name: 'Rohan P.', product: 'Canva Pro' },
    { name: 'Neha K.', product: 'Grammarly Premium' },
  ],
  CN: [
    { name: 'Wei L.', product: 'Adobe Photoshop' },
    { name: 'Mei C.', product: 'Midjourney Standard' },
    { name: 'Li N.', product: 'Adobe Creative Cloud' },
    { name: 'Zhang Y.', product: 'Figma Professional' },
  ],
};

const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const ago = (m: number) => (m === 0 ? 'Just now' : `${m}m ago`);

export default function LiveTrackersPage() {
  const [orders, setOrders] = useState(241118);
  const [revenue, setRevenue] = useState(1205589);
  const [active, setActive] = useState(1396);
  const [countries, setCountries] = useState<Country[]>([
    { code: 'ZA', name: 'South Africa', letter: 'A', color: 'bg-blue-600', revenue: 300217, buyers: [{ name: 'Thabo M.', product: 'SEO Masterclass', mins: 0 }, { name: 'Thabo M.', product: 'SEO Masterclass', mins: 1 }] },
    { code: 'US', name: 'USA', letter: 'U', color: 'bg-blue-600', revenue: 308264, buyers: [{ name: 'James O.', product: 'Social Media Toolkit', mins: 0 }, { name: 'Lerato P.', product: 'Logo Maker Pro', mins: 1 }] },
    { code: 'IN', name: 'India', letter: 'I', color: 'bg-orange-700', revenue: 297801, buyers: [{ name: 'Priya S.', product: 'ChatGPT Plus', mins: 0 }, { name: 'Arjun V.', product: 'Canva Pro', mins: 1 }] },
    { code: 'CN', name: 'China', letter: 'C', color: 'bg-red-700', revenue: 299307, buyers: [{ name: 'Wei L.', product: 'Adobe Photoshop', mins: 0 }, { name: 'Mei C.', product: 'Midjourney Standard', mins: 1 }] },
  ]);

  useEffect(() => {
    const sale = setInterval(() => {
      const idx = Math.floor(Math.random() * 4);
      const add = 100 + Math.floor(Math.random() * 1400);
      setCountries(cs => cs.map((c, i) => {
        if (i !== idx) return c;
        const pool = POOLS[c.code];
        const pick = pool[Math.floor(Math.random() * pool.length)];
        return {
          ...c,
          revenue: c.revenue + add,
          buyers: [{ name: pick.name, product: pick.product, mins: 0 }, ...c.buyers].slice(0, 3),
        };
      }));
      setOrders(o => o + 1);
      setRevenue(r => r + add);
    }, 6000);

    const age = setInterval(() => {
      setCountries(cs => cs.map(c => ({ ...c, buyers: c.buyers.map(b => ({ ...b, mins: b.mins + 1 })).slice(0, 3) })));
    }, 60000);

    const vis = setInterval(() => {
      setActive(a => Math.max(1200, Math.min(1600, a + (Math.floor(Math.random() * 21) - 10))));
    }, 4000);

    return () => { clearInterval(sale); clearInterval(age); clearInterval(vis); };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-6 pt-10">
      <div className="max-w-7xl mx-auto">

        {/* TOP STAT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <p className="text-sm text-slate-400 mb-2">Orders Today</p>
            <p className="text-4xl font-bold text-green-400">{fmt(orders)}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <p className="text-sm text-slate-400 mb-2">Revenue Today</p>
            <p className="text-4xl font-bold text-cyan-400">${fmt(revenue)}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <p className="text-sm text-slate-400 mb-2">Success Rate</p>
            <p className="text-4xl font-bold text-yellow-400">98.5%</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <p className="text-sm text-slate-400 mb-2">Active Users</p>
            <p className="text-4xl font-bold text-fuchsia-400">{fmt(active)}</p>
          </div>
        </div>

        {/* HEADING */}
        <h2 className="text-3xl font-bold text-center my-12">Live Revenue by Country (USD)</h2>

        {/* COUNTRY PANELS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {countries.map(c => (
            <div key={c.code} className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded ${c.color} flex items-center justify-center font-bold`}>{c.letter}</div>
                  <div>
                    <p className="font-bold">{c.name}</p>
                    <p className="text-xs text-slate-400">Live Revenue (USD)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">${fmt(c.revenue)}</p>
                  <p className="text-xs text-green-500 flex items-center justify-end gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Updating live
                  </p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">Recent Buyers</p>
                <ul className="space-y-3">
                  {c.buyers.map((b, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold shrink-0">{b.name.charAt(0)}</span>
                      <span className="text-sm font-semibold w-28 truncate">{b.name}</span>
                      <span className="text-sm text-slate-400 flex-1 text-right truncate">{b.product}</span>
                      <span className={`text-xs w-16 text-right ${b.mins === 0 ? 'text-green-400' : 'text-slate-500'}`}>{ago(b.mins)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
