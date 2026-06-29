'use client';

import { useState, useEffect } from 'react';

export default function LiveSalesTracker() {
  // We start with the number you prefer: 116,250
  const [total, setTotal] = useState(116250);

  useEffect(() => {
    // 1. Check if there is a saved number in your browser's memory
    const savedTotal = localStorage.getItem('live_sales_total');
    
    if (savedTotal) {
      setTotal(parseInt(savedTotal));
    } else {
      // If not, save the starting number
      localStorage.setItem('live_sales_total', total.toString());
    }

    // 2. Simulate live sales (adds random numbers every few seconds)
    // Note: In real life, this would come from your Peach Webhook!
    const timer = setInterval(() => {
      const jump = Math.floor(Math.random() * 3) + 1; // Adds 1, 2, or 3
      setTotal(prev => {
        const newTotal = prev + jump;
        // Save the new number to browser memory so it persists after restart
        localStorage.setItem('live_sales_total', newTotal.toString());
        return newTotal;
      });
    }, 3000); // Updates every 3 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full py-12 px-4 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Live Sales Tracker</h2>
        <div className="p-8 bg-slate-800 rounded-xl border border-blue-500/30 inline-block shadow-lg">
          <div className="text-sm font-bold text-slate-400 uppercase mb-2">GLOBAL TOTAL (TODAY)</div>
          <div className="text-5xl font-extrabold text-blue-400 font-mono">
            {total.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
