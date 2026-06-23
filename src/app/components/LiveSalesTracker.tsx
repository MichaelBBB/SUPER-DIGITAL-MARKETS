'use client';

import { useState, useEffect, useMemo } from 'react';

export default function LiveSalesTracker() {
  const [usa, setUsa] = useState(14879);
  const [india, setIndia] = useState(22350);
  const [china, setChina] = useState(18661);
  const [sa, setSa] = useState(3429);

  useEffect(() => {
    const timer = setInterval(() => {
      const jump = Math.floor(Math.random() * 5) + 1;
      const random = Math.random();

      if (random < 0.25) setUsa(prev => prev + jump);
      else if (random < 0.5) setIndia(prev => prev + jump);
      else if (random < 0.75) setChina(prev => prev + jump);
      else setSa(prev => prev + jump);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // useMemo ensures the total recalculates whenever any country changes
  const totalSales = useMemo(() => usa + india + china + sa, [usa, india, china, sa]);

  return (
    <div className="w-full py-12 px-4 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Live Sales Tracker</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
            <div className="text-xl font-bold text-blue-400 mb-2">USA</div>
            <div className="text-3xl font-bold font-mono">{usa.toLocaleString()}</div>
          </div>
          <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
            <div className="text-xl font-bold text-orange-400 mb-2">INDIA</div>
            <div className="text-3xl font-bold font-mono">{india.toLocaleString()}</div>
          </div>
          <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
            <div className="text-xl font-bold text-red-400 mb-2">CHINA</div>
            <div className="text-3xl font-bold font-mono">{china.toLocaleString()}</div>
          </div>
          <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
            <div className="text-xl font-bold text-green-400 mb-2">SOUTH AFRICA</div>
            <div className="text-3xl font-bold font-mono">{sa.toLocaleString()}</div>
          </div>
        </div>

        <div className="p-8 bg-slate-800 rounded-xl border border-blue-500/30">
          <div className="text-sm font-bold text-slate-400 uppercase mb-2">GLOBAL TOTAL (TODAY)</div>
          <div className="text-5xl font-extrabold text-blue-400 font-mono">
            {totalSales.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
