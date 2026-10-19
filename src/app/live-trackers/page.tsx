'use client';
import { useEffect, useState } from 'react';

const SALE_POOL = [
  { name: 'Thabo M.', country: 'South Africa', flag: '🇿🇦', product: 'Netflix Premium', price: 22.99 },
  { name: 'Priya S.', country: 'India', flag: '🇮', product: 'ChatGPT Plus', price: 20.00 },
  { name: 'Wei L.', country: 'China', flag: '🇨🇳', product: 'Adobe Photoshop', price: 22.99 },
  { name: 'Jason K.', country: 'USA', flag: '🇺🇸', product: 'ExpressVPN', price: 6.67 },
  { name: 'Anele D.', country: 'South Africa', flag: '🇿🇦', product: 'Spotify Premium', price: 9.99 },
  { name: 'Rohan P.', country: 'India', flag: '🇮🇳', product: 'Canva Pro', price: 12.99 },
  { name: 'Mei C.', country: 'China', flag: '🇨🇳', product: 'Midjourney Standard', price: 24.00 },
  { name: 'Sarah B.', country: 'USA', flag: '🇺🇸', product: 'Grammarly Premium', price: 12.00 },
  { name: 'Sipho N.', country: 'South Africa', flag: '🇿🇦', product: 'YouTube Premium', price: 13.99 },
  { name: 'Arjun V.', country: 'India', flag: '🇮🇳', product: 'Cursor AI Pro', price: 20.00 },
];

type FeedItem = { id: number; name: string; country: string; flag: string; product: string; price: number; secs: number };

export default function LiveTrackersPage() {
  const [feed, setFeed] = useState<FeedItem[]>(() =>
    SALE_POOL.slice(0, 5).map((s, i) => ({ ...s, id: i + 1, secs: (i + 1) * 47 }))
  );
  const [sales, setSales] = useState(133);
  const [revenue, setRevenue] = useState(2414);
  const [online, setOnline] = useState(57);

  useEffect(() => {
    const age = setInterval(() => {
      setFeed(f => f.map(it => ({ ...it, secs: it.secs + 5 })));
    }, 5000);
    const sale = setInterval(() => {
      const pick = SALE_POOL[Math.floor(Math.random() * SALE_POOL.length)];
      setFeed(f => [{ ...pick, id: Date.now(), secs: 0 }, ...f].slice(0, 6));
      setSales(s => s + 1);
      setRevenue(r => r + pick.price);
    }, 9000);
    const vis = setInterval(() => {
      setOnline(o => Math.max(38, Math.min(94, o + (Math.floor(Math.random() * 7) - 3))));
    }, 4000);
    return () => { clearInterval(age); clearInterval(sale); clearInterval(vis); };
  }, []);

  const fmtAgo = (s: number) => (s < 60 ? 'just now' : `${Math.floor(s / 60)} min ago`);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
            Live Sales Trackers
          </h2>
          <span className="text-xs text-gray-400">Updates in real time</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* TRACKER 1: LIVE SALES FEED */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-cyan-400 mb-4">🛒 Live Sales Feed</h3>
            <ul className="space-y-3">
              {feed.map(it => (
                <li key={it.id} className="flex items-center justify-between gap-3 bg-black/40 rounded-xl px-4 py-3 border border-slate-800">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl">{it.flag}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{it.name} — {it.product}</p>
                      <p className="text-xs text-gray-500">{it.country}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-green-400">${it.price.toFixed(2)}</p>
                    <p className="text-[10px] text-gray-500">{fmtAgo(it.secs)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* TRACKER 2: LIVE COUNTERS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between gap-6">
            <h3 className="text-lg font-bold text-cyan-400">📊 Live Counters</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-black/40 rounded-xl p-4 border border-slate-800">
                <p className="text-3xl font-extrabold text-white">{sales}</p>
                <p className="text-xs text-gray-500 mt-1">Sales Today</p>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-slate-800">
                <p className="text-3xl font-extrabold text-green-400">${revenue.toFixed(0)}</p>
                <p className="text-xs text-gray-500 mt-1">Revenue Today</p>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-slate-800">
                <p className="text-3xl font-extrabold text-cyan-400">{online}</p>
                <p className="text-xs text-gray-500 mt-1">Visitors Online</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="bg-black/40 rounded-xl p-3 border border-slate-800"><p className="text-lg">🇺🇸</p><p className="text-[10px] text-gray-500">USA</p></div>
              <div className="bg-black/40 rounded-xl p-3 border border-slate-800"><p className="text-lg">🇮🇳</p><p className="text-[10px] text-gray-500">India</p></div>
              <div className="bg-black/40 rounded-xl p-3 border border-slate-800"><p className="text-lg">🇨🇳</p><p className="text-[10px] text-gray-500">China</p></div>
              <div className="bg-black/40 rounded-xl p-3 border border-slate-800"><p className="text-lg">🇿🇦</p><p className="text-[10px] text-gray-500">South Africa</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
