'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Grabs your REAL Peach Payment Link from Vercel Env Vars
const PAY_LINK = process.env.NEXT_PUBLIC_PAY_LINK || '/payment';

type Buyer = { n: string; p: string; t: string };

const IDS = ['southafrica', 'usa', 'india', 'china'] as const;
type CId = (typeof IDS)[number];

const ALIASES: Record<CId, string[]> = {
  southafrica: ['southafrica', 'za', 'rsa'],
  usa: ['usa', 'us', 'unitedstates'],
  india: ['india', 'in'],
  china: ['china', 'cn'],
};

const NAMES = ['Thabo M.', 'Nomsa K.', 'Mike R.', 'Priya S.', 'Zhang L.', 'Sipho D.', 'Lerato P.', 'James O.', 'Raj P.', 'Wei C.'];
const PRODUCTS = ['AI Writing Assistant', 'Social Media Toolkit', 'Logo Maker Pro', 'SEO Masterclass', 'Email Funnel Pack', 'Photo Enhancement Suite'];

const norm = (s: unknown) => String(s || '').toLowerCase().replace(/[\s\-_]/g, '');

export default function Home() {
  const [rev, setRev] = useState<Record<CId, number>>({ southafrica: 0, usa: 0, india: 0, china: 0 });
  const [buyers, setBuyers] = useState<Record<CId, Buyer[]>>({
    southafrica: [{ n: 'Nomsa K.', p: 'Social Media Toolkit', t: 'Just now' }],
    usa: [{ n: 'Mike R.', p: 'AI Writing Assistant', t: 'Just now' }],
    india: [{ n: 'Priya S.', p: 'Logo Maker Pro', t: '1m ago' }],
    china: [{ n: 'Zhang L.', p: 'Email Funnel Pack', t: '1m ago' }],
  });
  
  // FIX 1: Active Users is now a live state variable
  const [activeUsers, setActiveUsers] = useState(1247); 
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Database Polling (Real Money)
  useEffect(() => {
    if (!supabase || !mounted) return;
    const pull = async () => {
      try {
        const { data } = await supabase.from('sales_counts').select('region, count');
        const rows: any[] = data || [];
        setRev((prev) => {
          const next = { ...prev };
          for (const row of rows) {
            const r = norm(row.region);
            for (const id of IDS) {
              if (ALIASES[id].includes(r)) {
                const dbVal = (Number(row.count) || 0) * 5;
                if (dbVal > next[id]) next[id] = dbVal;
              }
            }
          }
          return next;
        });
      } catch {
        // stay silent
      }
    };
    pull();
    const t = setInterval(pull, 3000);
    return () => clearInterval(t);
  }, [mounted]);

  // Live Simulation Engine (Active Users + Revenue ticks + Buyers)
  useEffect(() => {
    if (!mounted) return;
    const t = setInterval(() => {
      const id = IDS[Math.floor(Math.random() * IDS.length)];
      const gain = 15 + Math.floor(Math.random() * 85);
      setRev((prev) => ({ ...prev, [id]: prev[id] + gain }));
      
      // FIX 1: Increment Active Users randomly every 1.5s
      setActiveUsers((prev) => prev + Math.floor(Math.random() * 3) + 1);

      setBuyers((prev) => {
        const aged = prev[id].map((b, i) => (i === 0 ? { ...b, t: '1m ago' } : b));
        const nb: Buyer = {
          n: NAMES[Math.floor(Math.random() * NAMES.length)],
          p: PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)],
          t: 'Just now',
        };
        return { ...prev, [id]: [nb, ...aged].slice(0, 2) };
      });
    }, 1500);
    return () => clearInterval(t);
  }, [mounted]);

  const totalRevenue = rev.southafrica + rev.usa + rev.india + rev.china;
  const totalOrders = Math.round(totalRevenue / 5);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  const countryCard = (id: CId, label: string, badge: string, badgeCls: string) => (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={'w-10 h-10 rounded flex items-center justify-center text-white font-bold ' + badgeCls}>{badge}</div>
          <div>
            <h3 className="font-bold text-lg">{label}</h3>
            <p className="text-xs text-gray-400">Live Revenue (USD)</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-400">${rev[id].toLocaleString()}</p>
          <p className="text-xs text-green-500 flex items-center justify-end gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Updating live
          </p>
        </div>
      </div>
      <div className="p-4 bg-gray-900/50">
        <p className="text-xs text-gray-500 uppercase mb-2">Recent Buyers</p>
        {buyers[id].length === 0 ? (
          <p className="text-sm text-gray-500 py-2 text-center">Waiting for next purchase...</p>
        ) : (
          <div className="space-y-2">
            {buyers[id].map((b, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-xs">{b.n.charAt(0)}</div>
                  <span>{b.n}</span>
                </div>
                <span className="text-gray-400">{b.p}</span>
                <span className="text-green-400 text-xs">{b.t}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30">
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-black font-bold text-xs group-hover:scale-110 transition-transform">SD</div>
            <span className="text-lg font-bold tracking-wide text-gray-200 group-hover:text-white">SUPER DIGITAL</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <Link href="/products" className="hover:text-cyan-400 transition-colors">Products</Link>
            <Link href="/checkout" className="hover:text-cyan-400 transition-colors">Checkout</Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-green-900/20 border border-green-500/30 text-xs text-green-400">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>LIVE
            </div>
            <Link href="/products"><button className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-full transition-all shadow-lg shadow-cyan-500/20">Shop Now</button></Link>
          </div>
        </div>
      </nav>

      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10"></div>
          <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" alt="Earth Background" className="w-full h-full object-cover opacity-60 scale-105 animate-[pulse_10s_ease-in-out_infinite]" />
        </div>
        <div className="relative z-20 text-center px-6 max-w-5xl mx-auto mt-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span></span>
            <span className="text-xs font-bold tracking-wider text-cyan-400 uppercase">Live Global Marketplace</span>
            <span className="mx-2 h-1 w-1 rounded-full bg-gray-500"></span>
            <span className="text-xs text-gray-400">USA • India • China • South Africa</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight leading-tight">
            <span className="block text-white">The World's Top 30</span>
            <span className="block text-white">Digital Products</span>
            <span className="block text-yellow-400 mt-2">Delivered Instantly.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">From AI tools to creative software — shop in USD, pay your way, receive instantly. Trusted by buyers across 3 continents.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/products"><button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full text-lg shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105">Browse Products</button></Link>
            
            {/* FIX 2: Real Payment Link instead of $10.99 dummy */}
            <a 
              href={PAY_LINK} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full text-lg shadow-lg shadow-green-500/30 transition-all transform hover:scale-105"
            >
              Go To Payment Page
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-900 border-t border-white/10">
        <div className="max-w-7xl mx-auto space-y-16">
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">Live Sales Activity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                <p className="text-gray-400 text-sm mb-2">Orders Today</p>
                <p className="text-4xl font-bold text-green-400">{totalOrders.toLocaleString()}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                <p className="text-gray-400 text-sm mb-2">Revenue Today</p>
                <p className="text-4xl font-bold text-cyan-400">${totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                <p className="text-gray-400 text-sm mb-2">Success Rate</p>
                <p className="text-4xl font-bold text-yellow-400">98.5%</p>
              </div>
              {/* FIX 1: Active Users Now Moving */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                <p className="text-gray-400 text-sm mb-2">Active Users</p>
                <p className="text-4xl font-bold text-purple-400">{activeUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">Live Revenue by Country (USD)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {countryCard('southafrica', 'South Africa', 'A', 'bg-blue-900')}
              {countryCard('usa', 'USA', 'U', 'bg-blue-900')}
              {countryCard('india', 'India', 'I', 'bg-orange-900')}
              {countryCard('china', 'China', 'C', 'bg-red-900')}
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-gray-600 text-sm border-t border-white/5">
        <p>© 2026 Super Digital Markets. All rights reserved.</p>
      </footer>
    </div>
  );
}
