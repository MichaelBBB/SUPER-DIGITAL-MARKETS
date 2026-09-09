'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default function TestTrackerPage() {
  const [rawData, setRawData] = useState<any[]>([]);
  const [status, setStatus] = useState('Connecting...');
  const [lastUpdated, setLastUpdated] = useState('Never');

  useEffect(() => {
    if (!supabase) {
      setStatus('ERROR: Supabase Client Not Initialized');
      return;
    }

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
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-mono">
      <h1 className="text-3xl font-bold mb-4 text-cyan-400">🧪 ISOLATED TRACKER TEST</h1>
      
      {/* Status Bar */}
      <div className={`p-4 rounded mb-6 border ${status.includes('ERROR') ? 'bg-red-900/50 border-red-500' : status.includes('WARNING') ? 'bg-yellow-900/50 border-yellow-500' : 'bg-green-900/50 border-green-500'}`}>
        <strong>STATUS:</strong> {status} <br/>
        <strong>Last Updated:</strong> {lastUpdated}
      </div>

      {/* Raw Data Display */}
      <div className="bg-black p-6 rounded-lg border border-gray-700 overflow-x-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-300">Raw Database Response:</h2>
        <pre className="text-sm text-green-400 whitespace-pre-wrap">
          {JSON.stringify(rawData, null, 2)}
        </pre>
      </div>

      {/* Calculated Revenue Display */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {rawData.map((row: any, idx) => (
          <div key={idx} className="bg-gray-800 p-4 rounded border border-gray-600">
            <h3 className="text-lg font-bold capitalize text-cyan-300">{row.region || row.country}</h3>
            <p className="text-sm text-gray-400">Count: {row.count}</p>
            <p className="text-2xl font-bold text-green-400 mt-2">
              ${(row.count * 5).toLocaleString()}
            </p>
          </div>
        ))}
        {rawData.length === 0 && <p className="text-gray-500">No data to display yet.</p>}
      </div>
    </div>
  );
}
