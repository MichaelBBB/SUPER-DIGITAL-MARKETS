'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, CreditCard } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[85vh] flex flex-col justify-between bg-slate-900 text-white overflow-hidden">
      
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center opacity-80"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900" />
      </div>

      {/* TOP MAIN BUTTONS */}
      <div className="relative z-10 flex flex-wrap gap-4 p-6 md:p-12 pt-20">
        <Link href="/products" className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-full transition flex items-center gap-2 shadow-lg shadow-cyan-500/20">
          <ShoppingBag className="w-5 h-5" />
          Browse All 30 Products
        </Link>
        <Link href="/how-to-pay" className="px-6 py-3 border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 font-bold rounded-full transition flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          How to Pay
        </Link>
      </div>

      {/* CATEGORY BUTTONS */}
      <div className="relative z-10 flex flex-wrap justify-center gap-3 md:gap-4 px-6 pb-28 md:pb-36">
        <button className="px-5 py-2 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-full text-white hover:bg-cyan-500/20 hover:border-cyan-500 transition text-sm md:text-base">
          AI Tools <span className="text-cyan-400 ml-1">8</span>
        </button>
        <button className="px-5 py-2 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-full text-white hover:bg-cyan-500/20 hover:border-cyan-500 transition text-sm md:text-base">
          Creative <span className="text-cyan-400 ml-1">7</span>
        </button>
        <button className="px-5 py-2 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-full text-white hover:bg-cyan-500/20 hover:border-cyan-500 transition text-sm md:text-base">
          Entertainment <span className="text-cyan-400 ml-1">6</span>
        </button>
        <button className="px-5 py-2 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-full text-white hover:bg-cyan-500/20 hover:border-cyan-500 transition text-sm md:text-base">
          Business <span className="text-cyan-400 ml-1">9</span>
        </button>
      </div>

    </section>
  );
}
