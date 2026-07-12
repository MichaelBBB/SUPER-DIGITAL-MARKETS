'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

// --- MOVING SALES TRACKER LOGIC ---
const useLiveSales = () => {
  const [stats, setStats] = useState({
    usa: 226679,
    india: 233806,
    china: 231639,
    southAfrica: 215475,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const regions = ['usa', 'india', 'china', 'southAfrica'] as const;
      const randomRegion = regions[Math.floor(Math.random() * regions.length)];
      
      setStats(prev => ({
        ...prev,
        [randomRegion]: prev[randomRegion] + Math.floor(Math.random() * 5) + 1
      }));
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  return stats;
};

export default function Home() {
  const stats = useLiveSales();
  const total = stats.usa + stats.india + stats.china + stats.southAfrica;

  return (
    <div className="min-h-screen bg-[#050B14] text-white font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* NAVBAR */}
      <nav className="relative z-20 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center">
             <span className="text-lg font-bold">❄</span>
          </div>
          <span className="text-xl font-bold tracking-wide">SUPER DIGITAL</span>
        </div>

        <div className="hidden md:flex items-center gap-1 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <Link href="/" className="px-4 py-1 text-sm font-medium text-white hover:text-cyan-400 transition">Home</Link>
          <Link href="/products" className="px-4 py-1 text-sm font-medium text-gray-300 hover:text-cyan-400 transition">Products</Link>
          <Link href="/checkout" className="px-4 py-1 text-sm font-medium text-gray-300 hover:text-cyan-400 transition">Checkout</Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-green-400">LIVE</span>
          </div>
          <Link href="/products" className="bg-cyan-500 hover:bg-cyan-400 text-white px-5 py-2 rounded-xl font-bold text-sm transition shadow-lg shadow-cyan-500/20 flex items-center gap-2">
            <span>🛍️</span> Shop Now
          </Link>
        </div>
      </nav>

      {/* LIVE BADGE */}
      <div className="absolute top-20 left-6 z-10">
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/40 border border-cyan-500/30 backdrop-blur-md shadow-lg shadow-cyan-900/20">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Live Global Marketplace</span>
          <span className="h-4 w-[1px] bg-white/20"></span>
          <span className="text-xs text-gray-300">USA • India • China • South Africa</span>
        </div>
      </div>

      {/* HERO SECTION WITH BRIGHT EARTH */}
      <main className="relative z-10 min-h-[85vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        
        {/* Background Image Layer */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80')" }}
        ></div>

        {/* Overlay - Very subtle to keep Earth bright */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#050B14]/10 to-[#050B14]"></div>

        <div className="relative z-10 max-w-4xl mx-auto pt-10">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 drop-shadow-2xl">
            The World's <span className="text-cyan-400">Top 30</span><br />
            Digital Products<br />
            <span className="text-yellow-400">Delivered Instantly.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-100 mb-10 max-w-2xl mx-auto drop-shadow-md">
            From AI tools to creative software — shop in USD, pay your way, receive instantly. Trusted by buyers across 3 continents.
          </p>
          
          <Link href="/products" className="inline-block bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-lg py-4 px-10 rounded-2xl transition transform hover:scale-105 shadow-xl shadow-cyan-500/30">
            Browse All Products
          </Link>
        </div>
      </main>

      {/* MOVING SALES TRACKER */}
      <section className="relative z-20 py-12 px-6 bg-[#050B14]">
        <div className="max-w-6xl mx-auto bg-[#0B1120] border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-center text-xl font-bold text-cyan-400 mb-8 uppercase tracking-widest">Live Sales Activity</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50">
              <div className="text-xs text-blue-400 font-bold uppercase mb-2">USA</div>
              <div className="text-2xl md:text-3xl font-mono font-bold text-white tabular-nums">{stats.usa.toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50">
              <div className="text-xs text-orange-400 font-bold uppercase mb-2">INDIA</div>
              <div className="text-2xl md:text-3xl font-mono font-bold text-white tabular-nums">{stats.india.toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50">
              <div className="text-xs text-red-400 font-bold uppercase mb-2">CHINA</div>
              <div className="text-2xl md:text-3xl font-mono font-bold text-white tabular-nums">{stats.china.toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/30 border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <div className="text-xs text-green-400 font-bold uppercase mb-2">SOUTH AFRICA</div>
              <div className="text-2xl md:text-3xl font-mono font-bold text-white tabular-nums">{stats.southAfrica.toLocaleString()}</div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-800 flex justify-center">
             <span className="text-slate-500 text-sm">Total Global Volume: </span>
             <span className="ml-2 text-cyan-400 font-bold text-xl">{total.toLocaleString()}</span>
          </div>
        </div>
      </section>

    </div>
  );
}
