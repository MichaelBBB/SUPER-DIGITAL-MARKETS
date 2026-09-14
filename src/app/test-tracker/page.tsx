'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default function TestTrackerPage() {
  const [data, setData] = useState<any[]>([]);
  const [status, setStatus] = useState('Connecting...');
  const [lastUpdated, setLastUpdated] = useState('Never');
  
  // State to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!supabase || !mounted) return;

    const fetchData = async () => {
      setStatus('Fetching...');
      try {
        // Fetch ALL data from sales_counts
        const { data: rows, error } = await supabase.from('sales_counts').select('*');
        
        if (error) {
          setStatus(`ERROR: ${error.message}`);
          console.error('Supabase Error:', error);
          return;
        }

        if (!rows) {
          setStatus('WARNING: No data returned');
          setData([]);
        } else {
          setStatus(`SUCCESS: Loaded ${rows.length} rows`);
          setData(rows);
        }
        
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (err) {
        setStatus('ERROR: Fetch Failed');
        console.error(err);
      }
    };

    // Fetch immediately
    fetchData();
    
    // Then every 3 seconds
    const interval = setInterval(fetchData, 3000);
    
    return () => clearInterval(interval);
  }, [mounted]);

  // Calculate totals safely
  const totalOrders = data.reduce((sum, row) => sum + (Number(row.count) || 0), 0);
  const totalRevenue = totalOrders * 5; // Assuming $5 per order

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl text-cyan-400 animate-pulse">Loading Live Tracker...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-mono" suppressHydrationWarning>
      <h1 className="text-3xl font-bold mb-6 text-cyan-400"> LIVE TRACKER TEST</h1>
      
      {/* Status Bar */}
      <div className={`p-4 rounded mb-6 border ${status.includes('ERROR') ? 'bg-red-900/50 border-red-500' : 'bg-green-900/50 border-green-500'}`} suppressHydrationWarning>
        <strong>STATUS:</strong> {status} <br/>
        <strong>Last Updated:</strong> {lastUpdated}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-bold text-gray-300 mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-green-400" suppressHydrationWarning>{totalOrders.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-bold text-gray-300 mb-2">Total Revenue (USD)</h3>
          <p className="text-3xl font-bold text-cyan-400" suppressHydrationWarning>${totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Raw Data Display */}
      <div className="bg-black p-6 rounded-lg border border-gray-700 overflow-x-auto mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-300">Raw Database Data:</h2>
        <pre className="text-sm text-green-400 whitespace-pre-wrap" suppressHydrationWarning>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>

      {/* Country Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((row: any, idx) => (
          <div key={idx} className="bg-gray-800 p-6 rounded-lg border border-gray-600 hover:border-cyan-500 transition-colors">
            <h3 className="text-xl font-bold capitalize text-cyan-300 mb-2" suppressHydrationWarning>
              {row.region || row.country || 'Unknown'}
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Count: <span className="text-white font-bold" suppressHydrationWarning>{Number(row.count).toLocaleString()}</span></p>
              <p className="text-2xl font-bold text-green-400" suppressHydrationWarning>
                ${(Number(row.count) * 5).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">ID: {row.id}</p>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No data found. Check Supabase table 'sales_counts'.
          </div>
        )}
      </div>
    </div>
  );
}
