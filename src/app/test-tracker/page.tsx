'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default function TestTrackerPage() {
  const [rawData, setRawData] = useState<any[]>([]);
  const [status, setStatus] = useState('Connecting...');
  const [lastUpdated, setLastUpdated] = useState('Never');
  const [previousData, setPreviousData] = useState<any[]>([]);
  const [changedRows, setChangedRows] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!supabase || !mounted) return;

    const fetchData = async () => {
      setStatus('Fetching...');
      try {
        const { data, error } = await supabase.from('sales_counts').select('*');
        
        if (error) {
          setStatus(`ERROR: ${error.message}`);
          console.error('Supabase Error:', error);
          return;
        }

        if (!data || data.length === 0) {
          setStatus('WARNING: Table is Empty or No Rows Returned');
          setRawData([]);
        } else {
          setStatus(`SUCCESS: Found ${data.length} rows`);
          
          // Check which rows changed
          const changes: string[] = [];
          data.forEach((row: any) => {
            const prevRow = previousData.find((p: any) => p.id === row.id);
            if (prevRow && prevRow.count !== row.count) {
              changes.push(`${row.region}: ${prevRow.count} → ${row.count}`);
            }
          });
          
          setChangedRows(changes);
          setPreviousData(data);
          setRawData(data);
        }
        
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (err) {
        setStatus('ERROR: Fetch Failed');
        console.error(err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000); // Update every 3 seconds
    return () => clearInterval(interval);
  }, [mounted]);

  // Calculate totals
  const totalRevenue = rawData.reduce((sum, row) => sum + (row.count * 5), 0);
  const totalOrders = rawData.reduce((sum, row) => sum + row.count, 0);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p>Loading tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-mono" suppressHydrationWarning>
      <h1 className="text-3xl font-bold mb-4 text-cyan-400">🧪 ISOLATED TRACKER TEST</h1>
      
      {/* Status Bar */}
      <div className={`p-4 rounded mb-6 border ${status.includes('ERROR') ? 'bg-red-900/50 border-red-500' : status.includes('WARNING') ? 'bg-yellow-900/50 border-yellow-500' : 'bg-green-900/50 border-green-500'}`} suppressHydrationWarning>
        <strong>STATUS:</strong> {status} <br/>
        <strong>Last Updated:</strong> {lastUpdated}
        {changedRows.length > 0 && (
          <div className="mt-2 text-sm">
            <strong>Changes detected:</strong>
            <ul className="list-disc list-inside">
              {changedRows.map((change, idx) => (
                <li key={idx} className="text-green-300">{change}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-bold text-gray-300 mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-green-400" suppressHydrationWarning>{totalOrders.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-bold text-gray-300 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-cyan-400" suppressHydrationWarning>${totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Raw Data Display */}
      <div className="bg-black p-6 rounded-lg border border-gray-700 overflow-x-auto mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-300">Raw Database Response:</h2>
        <pre className="text-sm text-green-400 whitespace-pre-wrap" suppressHydrationWarning>
          {JSON.stringify(rawData, null, 2)}
        </pre>
      </div>

      {/* Individual Country Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {rawData.map((row: any, idx) => (
          <div key={idx} className="bg-gray-800 p-6 rounded-lg border border-gray-600 hover:border-cyan-500 transition-colors">
            <h3 className="text-xl font-bold capitalize text-cyan-300 mb-2" suppressHydrationWarning>{row.region}</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Count: <span className="text-white font-bold" suppressHydrationWarning>{row.count.toLocaleString()}</span></p>
              <p className="text-2xl font-bold text-green-400" suppressHydrationWarning>${(row.count * 5).toLocaleString()}</p>
              <p className="text-xs text-gray-500">ID: {row.id}</p>
            </div>
          </div>
        ))}
        {rawData.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No data to display yet.
          </div>
        )}
      </div>
    </div>
  );
}
