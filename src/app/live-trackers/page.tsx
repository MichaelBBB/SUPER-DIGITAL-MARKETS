'use client';

import { useEffect, useState } from 'react';

const COUNTRIES = [
  { id: 'usa', name: 'USA', tag: 'US', cls: 'bg-blue-800', base: 1240500, names: ['Mike R.', 'Sarah J.', 'David L.', 'Emily C.', 'James O.'], cities: ['New York', 'Texas', 'California', 'Florida'] },
  { id: 'china', name: 'China', tag: 'CN', cls: 'bg-red-700', base: 985200, names: ['Wei C.', 'Zhang L.', 'Chen W.', 'Liu Y.', 'Wang F.'], cities: ['Beijing', 'Shanghai', 'Shenzhen', 'Guangzhou'] },
  { id: 'india', name: 'India', tag: 'IN', cls: 'bg-orange-600', base: 845900, names: ['Priya S.', 'Anika R.', 'Divya N.', 'Rahul K.', 'Arjun M.'], cities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'] },
  { id: 'southafrica', name: 'South Africa', tag: 'ZA', cls: 'bg-blue-600', base: 425300, names: ['Thabo M.', 'Nomsa K.', 'Sipho D.', 'Lerato P.', 'Bongani M.'], cities: ['Joburg', 'Cape Town', 'Durban', 'Pretoria'] },
];

const PRODUCTS = ['AI Writing Assistant', 'Social Media Toolkit', 'Logo Maker Pro', 'SEO Masterclass', 'Email Funnel Pack', 'Brand Kit Deluxe', 'Video Template Bundle'];

type Buyer = { name: string; product: string; city: string; time: string; amount: number };

export default function GlobalLiveTrackers() {
  const [rev, setRev] = useState<Record<string, number>>({
    usa: 1240500, china: 985200, india: 845900, southafrica: 425300
  });
  const [buyers, setBuyers] = useState<Record<string, Buyer[]>>({
    usa: [], china: [], india: [], southafrica: []
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const c = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
      const amount = Math.floor(Math.random() * 85) + 15; // $15 to $100 sales
      
      setRev(prev => ({ ...prev, [c.id]: prev[c.id] + amount }));
      
      setBuyers(prev => {
        const old = prev[c.id].map((b, i) => (i === 0 ? { ...b, time: '1m ago' } : b));
        const nb: Buyer = {
          name: c.names[Math.floor(Math.random() * c.names.length)],
          product: PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)],
          city: c.cities[Math.floor(Math.random() * c.cities.length)],
          time: 'Just now',
          amount
        };
        return { ...prev, [c.id]: [nb, ...old].slice(0, 3) };
      });
    }, 1800); // New sale every 1.8 seconds globally

    return () => clearInterval(interval);
  }, []);

  const totalRev = Object.values(rev).reduce((a, b) => a + b, 0);
  const totalOrders = Math.floor(totalRev / 45);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Global Live Sales Feed</h2>
          <p className="text-slate-400">Real-time purchasing activity across 4 major markets</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
            <p className="text-slate-400 text-sm">Global Orders Today</p>
            <p className="text-4xl font-bold text-green-400">{totalOrders.toLocaleString()}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
            <p className="text-slate-400 text-sm">Total Global Revenue</p>
            <p className="text-4xl font-bold text-cyan-400">${totalRev.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COUNTRIES.map((c) => (
            <div key={c.id} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
              <div className="p-5 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={'w-10 h-10 rounded flex items-center justify-center text-white font-bold ' + c.cls}>{c.tag}</div>
                  <div>
                    <h3 className="font-bold text-lg">{c.name}</h3>
                    <p className="text-xs text-slate-400">Live Market Revenue</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">${rev[c.id].toLocaleString()}</p>
                  <p className="text-xs text-green-500 flex items-center justify-end gap-1 mt-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live
                  </p>
                </div>
              </div>
              
              <div className="p-5">
                <p className="text-xs uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full" /> Recent Buyers
                </p>
                {buyers[c.id].length === 0 ? (
                  <p className="text-center text-slate-500 text-sm py-4">Waiting for activity...</p>
                ) : (
                  <div className="space-y-3">
                    {buyers[c.id].map((b, i) => (
                      <div key={i} className="flex items-center gap-3 bg-slate-800/40 p-2 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-cyan-900/50 text-cyan-300 flex items-center justify-center text-xs font-bold shrink-0">
                          {b.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-white truncate">{b.name} <span className="text-slate-500 font-normal">from {b.city}</span></p>
                          <p className="text-xs text-slate-400 truncate">Bought {b.product}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-bold text-green-400">${b.amount}</p>
                          <p className="text-[10px] text-slate-500">{b.time}</p>
                        </div>
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
