'use client';

import { useState } from 'react';
import { recordSale } from './actions';

export default function RecordSalePage() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setStatus('Processing...');
    const result = await recordSale(formData);
    setLoading(false);
    if (result.success) {
      setStatus('OK - count now ' + result.newCount);
    } else {
      setStatus('ERROR: ' + result.error);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
      <form action={handleSubmit} className="bg-gray-900 p-8 rounded-2xl border border-gray-800 w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">Record Manual Sale</h1>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Record Key</label>
          <input name="key" type="password" required className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500" placeholder="Enter your secret key" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Country</label>
          <select name="region" required className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500">
            <option value="southafrica">South Africa</option>
            <option value="usa">USA</option>
            <option value="india">India</option>
            <option value="china">China</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="w-full py-4 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white font-bold rounded-xl transition-all">
          {loading ? 'Recording...' : 'Record Sale (+1)'}
        </button>
        {status && (
          <p className={'text-center text-sm font-medium ' + (status.startsWith('OK') ? 'text-green-400' : 'text-red-400')}>
            {status}
          </p>
        )}
      </form>
    </div>
  );
}use server';

import { createClient } from '@supabase/supabase-js';

export async function recordSale(formData: FormData) {
  const key = formData.get('key') as string;
  const region = formData.get('region') as string;

  if (key !== process.env.RECORD_KEY) {
    return { success: false, error: 'Invalid record key' };
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const normalizedRegion = region.toLowerCase().replace(/\s/g, '');

  const { data: current, error: fetchError } = await supabase
    .from('sales_counts')
    .select('count')
    .eq('region', normalizedRegion)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    return { success: false, error: fetchError.message };
  }

  const newCount = (current?.count || 0) + 1;

  const { error: updateError } = await supabase
    .from('sales_counts')
    .upsert({ region: normalizedRegion, count: newCount }, { onConflict: 'region' });

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  return { success: true, newCount };
}
