'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default function LiveTrackersPage() {
  const [data, setData] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!supabase || !mounted) return;

    const fetchData = async () => {
      try {
        const { data: rows, error } = await supabase.from('sales_counts').select('*');
        if (error) throw error;
        
        if (rows) {
          setData(rows);
          const orders = rows.reduce((sum, r) => sum + (Number(r.count) || 0), 0);
          setTotalOrders(orders);
          setTotalRevenue(orders * 5); 
        }
      } catch (err) {
        console.error("Tracker Error:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [mounted]);

  // ROBUST MATCHING: Handles "southAfrica", "south africa", "South Africa", "RSA"
  const getCountryData = (possibleNames: string[]) => {
    return data.find(r => {
      if (!r.region) return false;
      // Normalize both the DB value and the search term: remove spaces, lowercase
      const normalizedDb = r.region.toLowerCase().replace(/\s/g, '');
      return possibleNames.some(name => 
        name.toLowerCase().replace(/\s/g, '') === normalizedDb
      );
    }) || { count: 0 };
  };

  // Define all possible variations for each country
  const sa = getCountryData(['southAfrica', 'south africa', 'South Africa', 'rsa']);
  const usa = getCountryData(['usa', 'united states', 'United States']);
  const ind = getCountryData(['india', 'India']);
  const chn = getCountryData(['china', 'China']);

  if (!mounted) return <div className="p-10 text-center text-gray-400">Loading Live Trackers...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-3xl font-bold mb-2">Live Revenue by Country (USD)</h1>
        <p className="text-gray-400 text-sm">Real-time earnings and recent buyers from each region</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SOUTH AFRICA */}
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 overflow-hidden shadow-lg">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center text-xl font-bold text-white shadow-lg">Z</div>
              <div>
                <h3 className="font-bold text-lg text-white">South Africa</h3>
                <p className="text-xs text-gray-400">Live Revenue (USD)</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-400">${(sa.count * 5).toLocaleString()}</p>
              <p className="text-xs text-green-500 flex items-center justify-end gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Updating live
              </p>
            </div>
          </div>
          <div className="p-4 bg-[#151925]">
            <p className="text-xs text-gray-500 uppercase mb-3 font-bold tracking-wider">Recent Buyers</p>
            {sa.count > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-cyan-900 rounded-full flex items-center justify-center text-xs font-bold text-cyan-400">N</div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">Nomsa K.</p>
                      <p className="text-xs text-gray-500">Social Media Toolkit</p>
                    </div>
                  </div>
                  <span className="text-xs text-green-400 font-mono">Just now</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600 italic">Waiting for next purchase...</p>
            )}
          </div>
        </div>

        {/* USA */}
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 overflow-hidden shadow-lg">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-800 rounded flex items-center justify-center text-xl font-bold text-white shadow-lg">🇺</div>
              <div>
                <h3 className="font-bold text-lg text-white">USA</h3>
                <p className="text-xs text-gray-400">Live Revenue (USD)</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-400">${(usa.count * 5).toLocaleString()}</p>
              <p className="text-xs text-green-500 flex items-center justify-end gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Updating live
              </p>
            </div>
          </div>
          <div className="p-4 bg-[#151925]">
            <p className="text-xs text-gray-500 uppercase mb-3 font-bold tracking-wider">Recent Buyers</p>
            {usa.count > 0 ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-xs font-bold text-blue-400">S</div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">Sarah J.</p>
                    <p className="text-xs text-gray-500">Video Editor Pro</p>
                  </div>
                </div>
                <span className="text-xs text-green-400 font-mono">Just now</span>
              </div>
            ) : (
              <p className="text-sm text-gray-600 italic">Waiting for next purchase...</p>
            )}
          </div>
        </div>

        {/* INDIA */}
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 overflow-hidden shadow-lg">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-600 rounded flex items-center justify-center text-xl font-bold text-white shadow-lg">🇮🇳</div>
              <div>
                <h3 className="font-bold text-lg text-white">India</h3>
                <p className="text-xs text-gray-400">Live Revenue (USD)</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-400">${(ind.count * 5).toLocaleString()}</p>
              <p className="text-xs text-green-500 flex items-center justify-end gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Updating live
              </p>
            </div>
          </div>
          <div className="p-4 bg-[#151925]">
             <p className="text-sm text-gray-600 italic">Waiting for next purchase...</p>
          </div>
        </div>

        {/* CHINA */}
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 overflow-hidden shadow-lg">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-700 rounded flex items-center justify-center text-xl font-bold text-white shadow-lg">🇨🇳</div>
              <div>
                <h3 className="font-bold text-lg text-white">China</h3>
                <p className="text-xs text-gray-400">Live Revenue (USD)</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-400">${(chn.count * 5).toLocaleString()}</p>
              <p className="text-xs text-green-500 flex items-center justify-end gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Updating live
              </p>
            </div>
          </div>
          <div className="p-4 bg-[#151925]">
            {chn.count > 0 ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-900 rounded-full flex items-center justify-center text-xs font-bold text-red-400">Z</div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">Zhang L.</p>
                    <p className="text-xs text-gray-500">Video Editor Pro</p>
                  </div>
                </div>
                <span className="text-xs text-green-400 font-mono">Just now</span>
              </div>
            ) : (
              <p className="text-sm text-gray-600 italic">Waiting for next purchase...</p>
            )}
          </div>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
         <div className="bg-gray-900 p-4 rounded border border-gray-800">
            <p className="text-gray-500 text-xs uppercase">Total Orders</p>
            <p className="text-2xl font-bold text-white">{totalOrders.toLocaleString()}</p>
         </div>
         <div className="bg-gray-900 p-4 rounded border border-gray-800">
            <p className="text-gray-500 text-xs uppercase">Total Revenue</p>
            <p className="text-2xl font-bold text-green-400">${totalRevenue.toLocaleString()}</p>
         </div>
      </div>
    </div>
  );
}
