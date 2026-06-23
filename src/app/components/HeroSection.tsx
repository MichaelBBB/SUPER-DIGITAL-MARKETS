'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, CreditCard } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden bg-slate-900">
      
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=2070&auto=format&fit=crop')" }}
        />
        {/* Left-heavy gradient for perfect text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/60 to-transparent" />
      </div>

      {/* CONTENT CONTAINER - LEFT ALIGNED */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-16 md:py-24">
        
        {/* LIVE BADGE */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs font-semibold tracking-wide text-cyan-300 uppercase">Live Global Marketplace</span>
          <span className="text-xs text-slate-300">USA • India • China • South Africa</span>
        </div>

        {/* HEADLINE */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 max-w-3xl">
          The World's Top 30<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Digital Products</span><br />
          <span className="text-yellow-400">Delivered Instantly.</span>
        </h1>

        {/* SUBTEXT */}
        <p className="text-lg md:text-xl font-medium text-slate-200 mb-8 max-w-2xl">
          From AI tools to creative software — shop in USD, pay your way, receive instantly. Trusted by buyers across 3 continents.
        </p>

        {/* MAIN CTA BUTTONS */}
        <div className="flex flex-wrap gap-4">
          <Link href="/products" className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-full transition flex items-center gap-2 shadow-lg shadow-cyan-500/20">
            <ShoppingBag className="w-5 h-5" />
            Browse All 30 Products
          </Link>
          <Link href="/how-to-pay" className="px-6 py-3 border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-500/10 font-bold rounded-full transition flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            How to Pay
          </Link>
        </div>

      </div>
    </section>
  );
}
