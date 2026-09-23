'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default function LiveTrackersPage() {
  const [data, setData] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState('Connecting...');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!supabase || !mounted) return;

    const fetchData = async () => {
      setStatus('Updating...');
      try {
        const { data: rows, error } = await supabase.from('sales_counts').select('*');
        
        if (error) {
          console.error('Supabase error:', error);
          setStatus('Error: ' + error.message);
          return;
        }

        if (rows) {
          console.log('Fetched data:', rows);
          setData(rows);
          
          const orders = rows.reduce((sum: number, row: any) => sum + (Number(row.count) || 0), 0);
          setTotalOrders(orders);
          setTotalRevenue(orders * 5); 
          setStatus('Live ✓');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setStatus('Error connecting');
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [mounted]);

  // ROBUST MATCHING: Handles 'southafrica', 'South Africa', 'south africa', etc.
  const getCountryData = (targetRegion: string) => {
    const normalizedTarget = targetRegion.toLowerCase().replace(/\s/g, '');
    return data.find(row => {
      const rowRegion = (row.region || '').toLowerCase().replace(/\s/g, '');
      return rowRegion === normalizedTarget;
    }) || { count: 0 };
  };

  if (!mounted) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white"><div className="text-xl text-cyan-400 animate-pulse">Loading...</div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Live Sales Dashboard</h1>
          <p className="text-gray-400">Real-time statistics</p>
          <span className={`text-xs font-bold ${status === 'Live ✓' ? 'text-green-400' : 'text-yellow-400'}`}>● {status}</span>
        </div>
        <Link href="/" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm font-bold transition">← Back to Home</Link>
      </div>

      <div className="max-w-7xl mx-auto space-y-12">
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
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 text-center">Live Revenue by Country (USD)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* South Africa */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold">Z</div>
                  <div>
                    <h3 className="font-bold text-lg">South Africa</h3>
                    <p className="text-xs text-gray-400">Live Revenue (USD)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">
                    ${(getCountryData('southafrica').count * 5).toLocaleString()}
                  </p>
                  <p className="text-xs text-green-500 flex items-center justify-end gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Updating live
                  </p>
                </div>
              </div>
            </div>

            {/* USA */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-800 rounded flex items-center justify-center text-white font-bold">U</div>
                  <div>
                    <h3 className="font-bold text-lg">USA</h3>
                    <p className="text-xs text-gray-400">Live Revenue (USD)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">
                    ${(getCountryData('usa').count * 5).toLocaleString()}
                  </p>
                  <p className="text-xs text-green-500 flex items-center justify-end gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Updating live
                  </p>
                </div>
              </div>
            </div>

            {/* India */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-600 rounded flex items-center justify-center text-white font-bold">I</div>
                  <div>
                    <h3 className="font-bold text-lg">India</h3>
                    <p className="text-xs text-gray-400">Live Revenue (USD)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">
                    ${(getCountryData('india').count * 5).toLocaleString()}
                  </p>
                  <p className="text-xs text-green-500 flex items-center justify-end gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Updating live
                  </p>
                </div>
              </div>
            </div>

            {/* China */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-700 rounded flex items-center justify-center text-white font-bold">C</div>
                  <div>
                    <h3 className="font-bold text-lg">China</h3>
                    <p className="text-xs text-gray-400">Live Revenue (USD)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">
                    ${(getCountryData('china').count * 5).toLocaleString()}
                  </p>
                  <p className="text-xs text-green-500 flex items-center justify-end gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Updating live
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}
