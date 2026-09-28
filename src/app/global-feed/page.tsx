'use client';

import { useState, useEffect } from 'react';

export default function GlobalVolumeFeed() {
  // Starting numbers reflecting massive global market penetration
  const [rev, setRev] = useState({
    usa: 4250000,
    china: 3800000,
    india: 2900000,
    sa: 1850000
  });
  
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // Updates every 1 second to reflect high-volume global traffic
    const interval = setInterval(() => {
      setRev(prev => ({
        usa: prev.usa + Math.floor(Math.random() * 800) + 200,
        china: prev.china + Math.floor(Math.random() * 750) + 200,
        india: prev.india + Math.floor(Math.random() * 600) + 150,
        sa: prev.sa + Math.floor(Math.random() * 500) + 150,
      }));
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const total = rev.usa + rev.china + rev.india + rev.sa;

  const cards = [
    { id: 'usa', name: 'United States', tag: 'US', cls: 'bg-blue-800', val: rev.usa },
    { id: 'china', name: 'China', tag: 'CN', cls: 'bg-red-700', val: rev.china },
    { id: 'india', name: 'India', tag: 'IN', cls: 'bg-orange-600', val: rev.india },
    { id: 'sa', name: 'South Africa', tag: 'ZA', cls: 'bg-green-700', val: rev.sa },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Global Live Revenue Engine</h1>
          <p className="text-slate-400 text-lg">Real-time market capture across 3.4 Billion Users</p>
          <p className="text-green-400 text-sm mt-2 animate-pulse">● LIVE SYSTEM ACTIVE - UPDATING EVERY SECOND</p>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 mb-10 text-center shadow-2xl">
          <p className="text-slate-400 text-sm uppercase tracking-widest mb-2">Total Global Revenue Captured</p>
          <p className="text-6xl font-bold text-cyan-400">${total.toLocaleString()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((c) => (
            <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <div className={'w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl ' + c.cls}>
                    {c.tag}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{c.name}</h3>
                    <p className="text-xs text-slate-500">Active Market Region</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-400">${c.val.toLocaleString()}</p>
                  <p className="text-xs text-green-500 flex items-center justify-end gap-1 mt-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" /> Live
                  </p>
                </div>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className={'h-full ' + c.cls} style={{ width: '85%' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
