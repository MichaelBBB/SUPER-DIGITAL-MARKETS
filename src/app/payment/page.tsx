'use client';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function PaymentInner() {
  const params = useSearchParams();
  const itemName = params.get('item') || 'Digital Product';
  const amount = Number(params.get('amount')) || 10;

  const callApi = async (selfTest: boolean) => {
    const res = await fetch('/api/peach-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, item: itemName, selfTest }),
    });
    const data = await res.json().catch(() => ({ error: 'parse failed' }));
    if (res.ok && data.url) {
      window.location.href = data.url;
      return;
    }
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-cyan-400">Checkout: {itemName}</h1>
        <p className="text-gray-400">Amount: ${amount}</p>

        <button
          onClick={() => callApi(true)}
          className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg text-lg"
        >
          🧪 TEST PEACH CONNECTION (uses demo keys)
        </button>

        <button
          onClick={() => callApi(false)}
          className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-lg"
        >
          💳 PAY NOW BY CARD (uses your LIVE keys)
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentInner />
    </Suspense>
  );
}
