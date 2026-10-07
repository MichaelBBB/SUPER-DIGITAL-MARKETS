'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function PaymentInner() {
  const params = useSearchParams();
  const urlItem = (params.get('item') || '').trim();
  const rawAmount = Number(params.get('amount') || 0);

  // Clean dummy values
  const itemName = ['', 'digital product', 'test product'].includes(urlItem.toLowerCase()) ? 'Digital Product' : urlItem;
  const amount = rawAmount > 0 && rawAmount !== 10.99 ? rawAmount : 0;

  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const startPeach = async () => {
    setStatus('loading');
    
    // Try standard Peach checkout endpoint first
    const payload = { item: itemName, amount };
    const endpoints = [
      '/api/peach-checkout',
      '/api/peach/create-checkout'
    ];

    for (const endpoint of endpoints) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) continue;

        const text = await res.text();
        let redirectUrl = '';

        try {
          const json = JSON.parse(text);
          redirectUrl = json.url || json.redirectUrl || json.paymentUrl || json.link || '';
        } catch {
          if (text.trim().startsWith('http')) {
            redirectUrl = text.trim();
          }
        }

        if (redirectUrl) {
          window.location.href = redirectUrl;
          return;
        }
      } catch (err) {
        console.error(`Failed at ${endpoint}:`, err);
        // Continue to next endpoint
      }
    }

    // If all endpoints fail, show error state
    setStatus('error');
  };

  const eftLink = `/eft?amount=${amount}&item=${encodeURIComponent(itemName)}`;

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="max-w-md mx-auto space-y-6 pt-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Secure Payment</h1>
          <p className="text-xs text-gray-600 mt-1">Peach Hub v0610-Fix</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Product:</span>
            <span className="font-semibold text-right">{itemName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Total Due:</span>
            <span className="font-bold text-green-400 text-2xl">${amount} USD</span>
          </div>
        </div>

        <button
          onClick={startPeach}
          disabled={status === 'loading'}
          className="block w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-xl text-center shadow-lg transition-all transform hover:scale-105 disabled:opacity-50"
        >
          {status === 'loading' ? 'Connecting to Peach...' : '💳 Pay Securely By Card (Visa/Mastercard)'}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Peach Payments processes international cards securely. South African buyers can also choose Instant EFT within the Peach gateway.
        </p>

        {status === 'error' && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 text-sm text-red-300 text-center">
            Could not connect to Peach Gateway automatically.<br/>
            Please use the Manual Capitec EFT option below.
          </div>
        )}

        <div className="flex items-center justify-center gap-2 text-gray-500 text-xs uppercase tracking-wider">
          <span className="border-b border-gray-700 flex-grow"></span>
          Or Manual EFT
          <span className="border-b border-gray-700 flex-grow"></span>
        </div>

        <a
          href={eftLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-xl text-center shadow-lg transition-all transform hover:scale-105"
        >
          🏦 Pay via Capitec Instant EFT (Manual)
        </a>

        <Link href="/" className="block text-center text-gray-500 hover:text-white text-sm mt-4">
          ← Cancel and Return to Home
        </Link>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <PaymentInner />
    </Suspense>
  );
}
