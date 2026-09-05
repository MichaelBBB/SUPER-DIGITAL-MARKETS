'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface Buyer {
  name: string;
  product: string;
  country: string;
}

export default function HomePage() {
  const [salesData, setSalesData] = useState([
    { country: 'South Africa', revenue: 0, currency: '$', flag: '🇿🇦' },
    { country: 'USA', revenue: 0, currency: '$', flag: '🇺🇸' },
    { country: 'India', revenue: 0, currency: '$', flag: '🇳' },
    { country: 'China', revenue: 0, currency: '$', flag: '🇨🇳' },
  ]);

  const [recentBuyers, setRecentBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real sales data from Supabase (Polling every 5s)
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('sales_counts')
          .select('*');

        if (error) throw error;

        if (data) {
          setSalesData(prev => prev.map(item => {
            const dbRegion = item.country.toLowerCase().replace(' ', '');
            const regionData = data.find((d: any) => d.region.toLowerCase() === dbRegion);
            
            const count = regionData ? regionData.count : 0;
            const revenue = count * 5; // Assuming $5 per unit
            
            return { ...item, revenue };
          }));
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
    const interval = setInterval(fetchSalesData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Mock buyers data
  useEffect(() => {
    const mockBuyers: Buyer[] = [
      { name: 'Nomsa K.', product: 'Social Media Toolkit', country: 'South Africa' },
      { name: 'Mike R.', product: 'AI Writing Assistant', country: 'USA' },
      { name: 'Raj P.', product: 'Photo Enhancement Suite', country: 'India' },
      { name: 'Zhang L.', product: 'Video Editor Pro', country: 'China' },
    ];
    setRecentBuyers(mockBuyers);
  }, []);

  // ✅ CALCULATE REAL TOTALS FROM LIVE DATA
  const totalOrders = loading 
    ? 0 
    : salesData.reduce((sum, item) => sum + Math.floor(item.revenue / 5), 0);
  
  const totalRevenue = loading 
    ? 0 
    : salesData.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 px-6 py-4 sticky top-0 z-50 bg-black/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">⚡</span>
            </div>
            <span className="text-xl font-bold tracking-tight">SUPER DIGITAL</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-300 hover:text-white font-medium transition">Home</Link>
            <Link href="/products" className="text-gray-300 hover:text-white font-medium transition">Products</Link>
            <Link href="/checkout" className="text-gray-300 hover:text-white font-medium transition">Checkout</Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-900/30 border border-green-500 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400 font-semibold">LIVE</span>
            </div>
            
            <Link 
              href="/products" 
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-sm shadow-lg shadow-blue-500/30 transition transform hover:scale-105"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80')"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/50 border border-cyan-500/50 rounded-full mb-8 backdrop-blur-md">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-cyan-400 text-sm font-bold uppercase tracking-wider">Live Global Marketplace</span>
            <span className="text-gray-300 text-sm">•</span>
            <span className="text-gray-300 text-sm">USA • India • China • South Africa</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight tracking-tight">
            <span className="text-white block">The World's</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 block">Top 30</span>
            <span className="text-white block">Digital Products</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 block mt-2">Delivered Instantly.</span>
          </h1>

          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            From AI tools to creative software — shop in USD, pay your way, receive instantly. Trusted by buyers across 3 continents.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link 
              href="/products" 
              className="w-full sm:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg shadow-xl shadow-blue-600/30 transition-all transform hover:-translate-y-1 hover:shadow-2xl"
            >
              Browse Products
            </Link>
            <Link 
              href="/payment?item=Test&amount=10.99" 
              className="w-full sm:w-auto px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-lg shadow-xl shadow-emerald-600/30 transition-all transform hover:-translate-y-1 hover:shadow-2xl"
            >
              Test Payment
            </Link>
          </div>
        </div>
      </div>

      {/* ✅ FIRST TRACKER: NOW CONNECTED TO REAL DATA */}
      <div className="py-16 px-6 bg-gray-900 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Live Sales Activity</h2>
            <p className="text-gray-400">Real-time statistics from our global marketplace</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Orders Today - REAL DATA */}
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-green-500 transition-colors group">
              <div className="text-4xl font-bold text-green-400 mb-2 group-hover:scale-110 transition-transform">
                {loading ? '-' : totalOrders.toLocaleString()}
              </div>
              <div className="text-gray-400 font-medium">Orders Today</div>
              <div className="mt-2 text-xs text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Live
              </div>
            </div>
            
            {/* Revenue Today - REAL DATA */}
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-cyan-500 transition-colors group">
              <div className="text-4xl font-bold text-cyan-400 mb-2 group-hover:scale-110 transition-transform">
                ${loading ? '-' : totalRevenue.toLocaleString()}
              </div>
              <div className="text-gray-400 font-medium">Revenue Today</div>
              <div className="mt-2 text-xs text-cyan-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span> +12% vs yesterday
              </div>
            </div>
            
            {/* Success Rate - Static (Safe Placeholder) */}
            <div className="bg-gray-800 p
