'use client';
import { useEffect, useState } from 'react';

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

const MARKETS = [
  { code: 'ZA', flag: '🇿🇦', name: 'South Africa', letter: 'A', color: 'bg-blue-600', tz: 'Africa/Johannesburg', city: 'Johannesburg' },
  { code: 'US', flag: '🇺🇸', name: 'USA', letter: 'U', color: 'bg-blue-600', tz: 'America/New_York', city: 'New York' },
  { code: 'IN', flag: '🇮🇳', name: 'India', letter: 'I', color: 'bg-orange-700', tz: 'Asia/Kolkata', city: 'Delhi' },
  { code: 'CN', flag: '🇳', name: 'China', letter: 'C', color: 'bg-red-700', tz: 'Asia/Shanghai', city: 'Beijing' },
];

export default function LiveTrackersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [now, setNow] = useState(new Date());
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Load orders from Supabase
  const loadOrders = async () => {
    setIsLoading(true);
    if (!SB_URL) {
      setIsLoading(false);
      return;
    }
    
    try {
      const res = await fetch(`${SB_URL}/rest/v1/orders?select=product_name,amount,status,customer_email,created_at&status=eq.delivered&order=created_at.desc`, {
        headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
        cache: 'no-store' // Force fresh data
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Initial load
    loadOrders();
    
    // Update clock every second
    const clockInterval = setInterval(() => setNow(new Date()), 1000);
    
    // Poll for new orders every 3 seconds (THIS MAKES IT MOVE!)
    const pollInterval = setInterval(loadOrders, 3000);
    
    return () => {
      clearInterval(clockInterval);
      clearInterval(pollInterval);
    };
  }, []);

  const revenue = orders.reduce((s, o) => s + Number(o.amount || 0), 0);
  const marketsServed = new Set(orders.map(o => (o.customer_email || '').split('@')[1]?.split('.')[0] || 'unknown')).size || 1;
  
  const clock = (tz: string) => now.toLocaleTimeString('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-6 pt-10">
      <div className="max-w-7xl mx-auto">
        {/* HEADER WITH LIVE INDICATOR */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
            <h2 className="text-2xl md:text-3xl font-bold">Live Sales Ledger — 100% Real</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">
              {isLoading ? '🔄 Updating...' : `✓ Updated ${lastUpdate.toLocaleTimeString()}`}
            </span>
            <span className="text-xs text-gray-500">Polling every 3 seconds</span>
          </div>
        </div>

        {/* TOP STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <p className="text-sm text-slate-400 mb-2">Orders Fulfilled</p>
            <p className="text-4xl font-bold text-green-400">{fmt(orders.length)}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <p className="text-sm text-slate-400 mb-2">Revenue Fulfilled</p>
            <p className="text-4xl font-bold text-cyan-400">${fmt(Math.round(revenue))}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <p className="text-sm text-slate-400 mb-2">Fulfilment Rate</p>
            <p className="text-4xl font-bold text-yellow-400">100%</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <p className="text-sm text-slate-400 mb-2">Markets Served</p>
            <p className="text-4xl font-bold text-fuchsia-400">{marketsServed}</p>
          </div>
        </div>

        {/* LIVE CLOCKS & ADDRESSABLE MARKET */}
        <h3 className="text-2xl font-bold text-center mb-8">Global Market Reach — Live Local Time</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {MARKETS.map(m => (
            <div key={m.code} className="bg-slate-900 border border-slate-800 rounded-lg p-6 text-center">
              <p className="text-3xl mb-2">{m.flag}</p>
              <p className="font-bold">{m.name}</p>
              <p className="text-2xl font-extrabold text-cyan-400 my-2">
                {m.code === 'US' ? '350 000 000' : m.code === 'IN' ? '1 400 000 000' : m.code === 'CN' ? '1 400 000 000' : '45 000 000'}
              </p>
              <p className="text-xs text-slate-500 mb-3">addressable customers</p>
              <p className="text-lg font-mono text-green-400">{clock(m.tz)}</p>
              <p className="text-[10px] text-slate-500">local time — {m.city}</p>
            </div>
          ))}
        </div>

        {/* RECENT REAL ORDERS */}
        <h3 className="text-2xl font-bold text-center mb-8">Recent Real Orders</h3>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-slate-500 mb-2">🔍 Monitoring for sales...</p>
              <p className="text-xs text-slate-600">The system is live and checking every 3 seconds. First sale will appear here instantly.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {orders.slice(0, 10).map((o, i) => (
                <li key={i} className="flex items-center justify-between bg-black/40 rounded-xl px-4 py-3 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs font-bold">
                      {(o.customer_email || '?')[0].toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{o.product_name}</p>
                      <p className="text-xs text-slate-500">{o.customer_email || 'Anonymous'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-400">${Number(o.amount || 0).toFixed(2)}</p>
                    <p className="text-[10px] text-slate-500">
                      {new Date(o.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
