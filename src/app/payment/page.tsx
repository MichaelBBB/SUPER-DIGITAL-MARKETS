'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function PaymentInner() {
  const params = useSearchParams();
  const urlItem = (params.get('item') || '').trim();
  const rawAmount = Number(params.get('amount') || 0);

  const itemName = ['', 'digital product', 'test product'].includes(urlItem.toLowerCase()) ? 'Digital Product' : urlItem;
  const amount = rawAmount > 0 && rawAmount !== 10.99 ? rawAmount : 0;

  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const startPeach = async () => {
    setStatus('loading');
    const payload = { item: itemName, amount };
    const attempts = [
      () => fetch('/api/peach-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
      () => fetch('/api/peach/create-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
      () => fetch(`/api/peach-checkout?amount=${amount}&item=${encodeURIComponent(itemName)}`),
    ];
    for (const attempt of attempts) {
      try {
        const res = await attempt();
        if (!res.ok) continue;
        const text = await res.text();
        let url = '';
        try {
          const j = JSON.parse(text);
          url = j.url || j.redirectUrl || j.redirect || j.paymentUrl || j.link || '';
        } catch {
          if (text.trim().startsWith('http')) url = text.trim();
        }
        if (url) {
          window.location.href = url;
          return;
        }
      } catch {
        // try next attempt
      }
    }
    setStatus('error');
  };

  const eftLink = `/eft?amount=${amount}&item=${encodeURIComponent(itemName)}`;

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Secure Payment</h1>
          <p className="text-xs text-gray-600 mt-1">Peach Payment Hub v0610</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
          <div className="flex justify-between"><span className="text-gray-400">Product:</span><span className="font-semibold text-right">{itemName}</span></div>
          <div className="flex justify-between items-center"><span className="text-gray-400">Total Due:</span><span className="font-bold text-green-400 text-2xl">${amount}</span></div>
        </div>

        <button
          onClick={startPeach}
          disabled={status === 'loading'}
          className="block w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-xl text-center shadow-lg transition-all transform hover:scale-105 disabled:opacity-50"
        >
          {status === 'loading' ? 'Connecting to Peach...' : '💳 Pay with Peach — Card or Instant EFT'}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Peach is directly connected to Capitec Bank. On the Peach page, South African customers choose <b>Instant EFT</b> and approve in their Capitec app. International customers pay by Visa/Mastercard.
        </p>

        {status === 'error' && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 text-sm text-red-300 text-center">
            Peach checkout could not start automatically. Use the manual EFT panel below, or retry.
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
          🏦 Manual Capitec EFT Panel
        </a>

        <Link href="/" className="block text-center text-gray-500 hover:text-white text-sm">← Back to Home</Link>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <PaymentInner />
    </Suspense>
  );
}
