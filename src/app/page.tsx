'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  // State for real sales data
  const [stats, setStats] = useState({ 
    usa: 0, 
    india: 0, 
    china: 0, 
    southAfrica: 0 
  });

  // Function to fetch real sales data from our new API
  const fetchSalesData = async () => {
    try {
      const res = await fetch('/api/sales');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to load sales data", error);
    }
  };

  useEffect(() => {
    // Initial fetch on page load
    fetchSalesData();

    // Refresh every 5 seconds to keep it "Live"
    const interval = setInterval(fetchSalesData, 5000);
    return () => clearInterval(interval);
  }, []);

  const total = stats.usa + stats.india + stats.china + stats.southAfrica;

  return (
    <div className="min-h-screen bg-[#0B1120] text-white font-sans overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-[#0B1120]/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center font-bold shadow-[0_0_15px_rgba(6,182,212,0.5)]">❄</div>
          <span className="text-xl font-bold tracking-wide">SUPER DIGITAL</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-white hover:text-cyan-400 transition">Home</Link>
          <Link href="/products" className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition">Products</Link>
          <Link href="/checkout" className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition">Checkout</Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-green-400">LIVE</span>
          </div>
          <Link href="/products" className="bg-cyan-500 hover:bg-cyan-400 text-white px-5 py-2 rounded-xl font-bold text-sm transition shadow-lg shadow-cyan-500/30">Shop Now</Link>
        </div>
      </nav>

      {/* HERO SECTION WITH BRIGHT EARTH */}
      <main className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
        
        {/* The Bright Earth Background Image */}
        <div className="absolute inset-0 z-0">
           <img 
             src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80" 
             alt="Earth Background" 
             className="w-full h-full object-cover"
             style={{ filter: 'brightness(1.2) contrast(1.1)' }} // Forces brightness
           />
           {/* Very subtle overlay to make text pop */}
           <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-[#0B1120]/30"></div>
        </div>

        {/* Live Badge */}
        <div className="relative z-10 mt-20 mb-6">
          <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-black/40 border border-cyan-500/50 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Live Global Marketplace</span>
            <span className="text-gray-300 text-xs">USA • India • China • South Africa</span>
          </div>
        </div>

        {/* Main Text */}
        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1.1] mb-6 drop-shadow-2xl">
            The World's <span className="text-cyan-400">Top 30</span><br />
            Digital Products<br />
            <span className="text-yellow-400">Delivered Instantly.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light">
            From AI tools to creative software — shop in USD, pay your way, receive instantly. Trusted by buyers across 3 continents.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/products" className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-4 px-10 rounded-xl text-lg transition transform hover:scale-105 shadow-xl shadow-cyan-500/30">
              Browse All Products
            </Link>
            <Link href="/checkout" className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-10 rounded-xl text-lg transition backdrop-blur-sm border border-white/10">
              Go to Checkout
            </Link>
          </div>
        </div>
      </main>

      {/* MOVING SALES TRACKER (NOW REAL DATA) */}
      <section className="relative z-20 py-12 px-6 bg-[#0B1120] border-t border-white/5">
        <div className="max-w-6xl mx-auto bg-slate-900/50 backdrop-blur-md border border-slate-700 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-center text-xl font-bold text-cyan-400 mb-10 uppercase tracking-widest">Live Sales Activity</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 hover:border-blue-500 transition duration-300">
              <div className="text-xs text-blue-400 font-bold uppercase mb-3">USA</div>
              <div className="text-3xl font-mono font-bold text-white">{stats.usa.toLocaleString()}</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 hover:border-orange-500 transition duration-300">
              <div className="text-xs text-orange-400 font-bold uppercase mb-3">INDIA</div>
              <div className="text-3xl font-mono font-bold text-white">{stats.india.toLocaleString()}</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 hover:border-red-500 transition duration-300">
              <div className="text-xs text-red-400 font-bold uppercase mb-3">CHINA</div>
              <div className="text-3xl font-mono font-bold text-white">{stats.china.toLocaleString()}</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-800 border border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <div className="text-xs text-green-400 font-bold uppercase mb-3">SOUTH AFRICA</div>
              <div className="text-3xl font-mono font-bold text-white">{stats.southAfrica.toLocaleString()}</div>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-slate-800 flex justify-center">
             <span className="text-slate-500 text-sm font-medium mr-3">Total Global Volume:</span>
             <span className="text-cyan-400 font-bold text-2xl font-mono">{total.toLocaleString()}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
