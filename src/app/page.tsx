'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
// We use a safe check to prevent build errors if env vars are missing during build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

interface Buyer {
  name: string;
  product: string;
  country: string;
}

export default function HomePage() {
  const [salesData, setSalesData] = useState([
    { country: 'South Africa', revenue: 0, currency: '$', flag: '🇿🇦' },
    { country: 'USA', revenue: 0, currency: '$', flag: '🇺🇸' },
    { country: 'India', revenue: 0, currency: '$', flag: '🇮🇳' },
    { country: 'China', revenue: 0, currency: '$', flag: '🇨🇳' },
  ]);

  const [recentBuyers, setRecentBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real sales data from Supabase (Polling every 5s)
  useEffect(() => {
    // If supabase client failed to initialize (missing env vars), stop here
    if (!supabase) {
      console.error('Supabase client not initialized. Check Environment Variables in Vercel.');
      setLoading(false);
      return;
    }

    const fetchSalesData = async () => {
      try {
        const { data, error } = await supabase.from('sales_counts').select('*');

        if (error) throw error;

        if (data && data.length > 0) {
          setSalesData(prev => prev.map(item => {
            const dbRegion = item.country.toLowerCase().replace(' ', '');
            const regionData = data.find((d: any) => d.region.toLowerCase() === dbRegion);
            
            const count = regionData ? regionData.count : 0;
            const revenue = count * 5; // $5 per unit
            
            return { ...item, revenue };
          }));
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData(); // Initial fetch
    const interval = setInterval(fetchSalesData, 5000); // Poll every 5 seconds
    
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

  // ✅ CALCULATE REAL TOTALS FOR TRACKER 1 FROM LIVE DATA
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

          <div
