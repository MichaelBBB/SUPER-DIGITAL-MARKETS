'use client'; // This file is 100% Client Side for Live Data

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default function LiveTrackersPage() {
  const [trackerData, setTrackerData] = useState<any[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState('Connecting...');

  // Prevent Hydration Mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch Live Data
  useEffect(() => {
    if (!supabase || !mounted) return;

    const fetchLiveData = async () => {
      setStatus('Updating...');
      try {
        const { data, error } = await supabase.from('sales_counts').select('*');
        if (error) throw error;
        
        if (data) {
          setTrackerData(data);
          const orders = data.reduce((sum, row) => sum + (Number(row.count) || 0), 0);
          setTotalOrders(orders);
          setTotalRevenue(orders * 5); // Adjust multiplier if needed
          setStatus('Live');
        }
      } catch (err) {
        console.error('Error fetching live data:', err);
        setStatus('Error Connecting');
      }
    };

    fetchLiveData();
    const interval = setInterval(fetchLiveData, 3000); // Update every 3 seconds
    return () => clearInterval(interval);
  }, [mounted]);

  // Helper to get revenue by country
  const getCountryRevenue = (country: string) => {
    const row = trackerData.find(r => r.region?.toLowerCase() === country.toLowerCase());
    return row ? (Number(row.count) * 5) : 0;
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-xl text-cyan-400 animate-pulse">Loading Live Trackers...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Live Sales Dashboard</h1>
          <p className="text-gray-400">Real-time statistics from global marketplace</p>
          <span className={`text-xs font-bold ${status === 'Live' ? 'text-green-400' : 'text-red-400'}`}>
            ● {status}
          </span>
        </div>
        <Link href="/" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm font-bold transition">
          ← Back to Home
        </Link>
      </div>

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* 1. Live Sales Activity */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-center">Live Sales Activity</h2>
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
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
              <p className="text-gray-400 text-sm mb-2">Active Users</p>
              <p className="text-4xl font-bold text-purple-400">1,247</p>
            </div>
          </div>
        </section>

        {/* 2. Live Revenue by Country */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-center">Live Revenue by Country (USD)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* South Africa */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-900 rounded flex items-center justify-center text-white font-bold">A</div>
                  <div>
                    <h3 className="font-bold text-lg">South Africa</h3>
                    <p className="text-xs text-gray-400">Live Revenue (USD)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">${getCountryRevenue('south africa').toLocaleString()}</p>
                  <p className="text-xs text-green-500 flex items-center justify-end gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Updating live</p>
                </div>
              </div>
              <div className="p-4 bg-gray-900/50">
                <p className="text-xs text-gray-500 uppercase mb-2">Recent Buyers</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-xs">N</div>
                    <span>Nomsa K.</span>
                  </div>
                  <span className="text-gray-400">Social Media Toolkit</span>
                  <span className="text-green-400 text-xs">Just now</span>
                </div>
              </div>
            </div>

            {/* USA */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-900 rounded flex items-center justify-center text-white font-bold">U</div>
                  <div>
                    <h3 className="font-bold text-lg">USA</h3>
                    <p className="text-xs text-gray-400">Live Revenue (USD)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">${getCountryRevenue('usa').toLocaleString()}</p>
                  <p className="text-xs text-green-500 flex items-center justify-end gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Updating live</p>
                </div>
              </div>
              <div className="p-4 bg-gray-900/50">
                <p className="text-xs text-gray-500 uppercase mb-2">Recent Buyers</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-xs">M</div>
                    <span>Mike R.</span>
                  </div>
                  <span className="text-gray-400">AI Writing Assistant</span>
                  <span className="text-green-400 text-xs">Just now</span>
                </div>
              </div>
            </div>

            {/* India */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-900 rounded flex items-center justify-center text-white font-bold">I</div>
                  <div>
                    <h3 className="font-bold text-lg">India</h3>
                    <p className="text-xs text-gray-400">Live Revenue (USD)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">${getCountryRevenue('india').toLocaleString()}</p>
                  <p className="text-xs text-green-500 flex items-center justify-end gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Updating live</p>
                </div>
              </div>
            </div>

            {/* China */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-900 rounded flex items-center justify-center text-white font-bold">C</div>
                  <div>
                    <h3 className="font-bold text-lg">China</h3>
                    <p className="text-xs text-gray-400">Live Revenue (USD)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">${getCountryRevenue('china').toLocaleString()}</p>
                  <p className="text-xs text-green-500 flex items-center justify-end gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Updating live</p>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}
