'use client';

import { useState, useEffect } from 'react';

const COUNTRIES = [
  { id: 'southafrica', name: 'South Africa', flag: '🇿' },
  { id: 'usa', name: 'USA', flag: '🇺' },
  { id: 'india', name: 'India', flag: '🇮' },
  { id: 'china', name: 'China', flag: '🇨' },
];

export default function LiveTrackersPage() {
  const [stats, setStats] = useState({
    southafrica: 65422,
    usa: 76559,
    india: 64479,
    china: 64931,
  });

  useEffect(() => {
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
}
