'use client';

import { useState, useEffect } from 'react';

// --- EXACT DATA STRUCTURE FROM YOUR HOMEPAGE ---
const COUNTRIES = [
  { id: 'southafrica', name: 'South Africa', flag: '🇿' },
  { id: 'usa', name: 'USA', flag: '🇺🇸' },
  { id: 'india', name: 'India', flag: '🇮🇳' },
  { id: 'china', name: 'China', flag: '🇨🇳' },
];

const BUYER_NAMES = ['Thabo M.', 'Nomsa K.', 'Mike R.', 'Priya S.', 'Zhang L.', 'Sipho D.', 'Lerato P.', 'James O.', 'Anika R.', 'Wei C.'];
const PRODUCTS = ['AI Writing Assistant', 'Social Media Toolkit', 'Logo Maker Pro', 'SEO Masterclass', 'Email Funnel Pack', 'Brand Kit Deluxe'];

export default function LiveTrackersPage() {
  // Initialize state with realistic starting numbers matching your homepage
  const [stats, setStats] = useState({
    southafrica: { revenue: 65422, buyers: [] as any[] },
    usa: { revenue: 76559, buyers: [] as any[] },
    india: { revenue: 64479, buyers: [] as any[] },
    china: { revenue: 64931, buyers: [] as any[] },
  });

  useEffect(() => {
    // Simulation Engine: Identical behavior to your homepage tracker
    const interval = setInterval(() => {
      setStats(prev => {
        const next = { ...prev };
        
        // Pick a random country to update
        const countries = Object.keys(next);
        const targetCountry = countries[Math.floor(Math.random() * countries.length)] as keyof typeof next;
        
        // Increment Revenue randomly ($8 - $40 per sale)
        const increment = Math.floor(Math.random() * 32) + 8;
        next[targetCountry].revenue += increment;
        
        // Add a new buyer to the top of the list
        const newName = BUYER_NAMES[Math.floor(Math.random() * BUYER_NAMES.length)];
        const newProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
        
        // Age existing buyers slightly
        const agedBuyers = next[targetCountry].buyers.map(b => ({ ...b, time: '1m ago' }));
        
        // Insert new buyer at position 0
        next[targetCountry].buyers = [{ name: newName, product: newProduct, time: 'Just now' }, ...agedBuyers].slice(0, 2);
        
        return next;
      });
    }, 2500); // Update every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Live Revenue by Country (USD)</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COUNTRIES.map((c) => {
            const data = stats[c.id as keyof typeof stats];
            return (
              <div key={c.id} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
                {/* Header Section */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl leading-none">{c.flag}</span>
                    <div>
                      <h3 className="font-bold text-lg">{c.name}</h3>
                      <p className="text-xs text-slate-400">Live Revenue (USD)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-400">
                      ${data.revenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-500 flex items-center justify-end gap-1 mt-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      Updating live
                    </p>
                  </div>
                </div>

                {/* Recent Buyers Section */}
                <div className="p-6 bg-slate-900/50">
                  <p className="text-xs uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full" />
                    Recent Buyers
                  </p>

                  {data.buyers.length === 0 ? (
                    <p className="text-center text-slate-500 text-sm py-6 italic">
                      Waiting for next purchase...
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {data.buyers.map((buyer: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                          <div className="w-9 h-9 rounded-full bg-cyan-900/50 text-cyan-300 flex items-center justify-center text-sm font-bold shrink-0 border border-cyan-800/50">
                            {buyer.name.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-white truncate">{buyer.name}</p>
                            <p className="text-xs text-slate-400 truncate">{buyer.product}</p>
                          </div>
                          <p className="text-xs text-green-400 ml-auto shrink-0 whitespace-nowrap">{buyer.time}</p>
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
