'use client';
import { useEffect, useState } from 'react';

/* ============================================================
   MICHAEL'S REAL SALES LEDGER
   Every time a sale is confirmed, message me "+1" and the
   product name — I will send the updated file. Nothing here
   is simulated: these are fulfilled orders only.
   ============================================================ */
const REAL_LEDGER = {
  orders: 1,
  revenue: 13.99,
  entries: [
    { product: 'Disney Premium', amount: 13.99, market: 'South Africa', flag: '🇿🇦', note: 'Fulfilled via WhatsApp' },
  ],
};

const MARKETS = [
  { flag: '🇺🇸', name: 'USA', population: 350000000, tz: 'America/New_York', city: 'New York' },
  { flag: '🇮🇳', name: 'India', population: 1400000000, tz: 'Asia/Kolkata', city: 'Delhi' },
  { flag: '🇨🇳', name: 'China', population: 1400000000, tz: 'Asia/Shanghai', city: 'Beijing' },
  { flag: '🇿🇦', name: 'South Africa', population: 45000000, tz: 'Africa/Johannesburg', city: 'Johannesburg' },
];

const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export default function LiveTrackersPage() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const clock = (tz: string) =>
    now.toLocaleTimeString('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const marketsServed = new Set(REAL_LEDGER.entries.map(e => e.market)).size;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-6 pt-10">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
            Live Sales Ledger — 100% Real
          </h2>
          <span className="text-xs text-gray-400">Every figure below is a fulfilled order</span>
        </div>

        {/* REAL LEDGER STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <p className="text-sm text-slate-400 mb-2">Orders Fulfilled</p>
            <p className="text-4xl font-bold text-green-400">{fmt(REAL_LEDGER.orders)}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <p className="text-sm text-slate-400 mb-2">Revenue Fulfilled</p>
            <p className="text-4xl font-bold text-cyan-400">${REAL_LEDGER.revenue.toFixed(2)}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <p className="text-sm text-slate-400 mb-2">Fulfilment Rate</p>
            <p className="text-4xl font-bold text-yellow-400">100%</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <p className="text-sm text-slate-400 mb-2">Markets Served</p>
            <p className="text-4xl font-bold text-fuchsia-400">{marketsServed}</p>
          </div>
        </div>

        {/* BIG TRUE NUMBERS: ADDRESSABLE MARKET + LIVE CLOCKS */}
        <h3 className="text-2xl font-bold text-center mb-8">Global Market Reach — Live Local Time</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {MARKETS.map(m => (
            <div key={m.name} className="bg-slate-900 border border-slate-800 rounded-lg p-6 text-center">
              <p className="text-3xl mb-2">{m.flag}</p>
              <p className="font-bold">{m.name}</p>
              <p className="text-2xl font-extrabold text-cyan-400 my-2">{fmt(m.population)}</p>
              <p className="text-xs text-slate-500 mb-3">addressable customers</p>
              <p className="text-lg font-mono text-green-400">{clock(m.tz)}</p>
              <p className="text-[10px] text-slate-500">local time — {m.city}</p>
            </div>
          ))}
        </div>

        {/* RECENT REAL ORDERS */}
        <h3 className="text-2xl font-bold text-center mb-8">Recent Real Orders</h3>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <ul className="space-y-3">
            {REAL_LEDGER.entries.map((e, i) => (
              <li key={i} className="flex items-center justify-between gap-3 bg-black/40 rounded-xl px-4 py-3 border border-slate-800">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl">{e.flag}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{e.product}</p>
                    <p className="text-xs text-gray-500">{e.market} — {e.note}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-green-400 shrink-0">${e.amount.toFixed(2)}</p>
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-500 text-center mt-4">
            This ledger grows with every confirmed sale. Real numbers, real customers, real growth.
          </p>
        </div>
      </div>
    </div>
  );
}
