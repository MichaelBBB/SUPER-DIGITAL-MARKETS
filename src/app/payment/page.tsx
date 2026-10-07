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

  const orderRef = 'ORD-' + Math.floor(Math.random() * 900000 + 100000);

  const startPeach = async () => {
    setStatus('loading');
    const payload = { item: itemName, amount };
    const endpoints = ['/api/peach-checkout', '/api/peach/create-checkout'];
    for (const endpoint of endpoints) {
      try {
        const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) continue;
        const text = await res.text();
        let url = '';
        try { const j = JSON.parse(text); url = j.url || j.redirectUrl || j.paymentUrl || j.link || ''; } catch { if (text.trim().startsWith('http')) url = text.trim(); }
        if (url) { window.location.href = url; return; }
      } catch {}
    }
    setStatus('error');
  };

  const waMessage = `*ORDER CONFIRMED - SUPER DIGITAL MARKETS*\n\n*Ref:* ${orderRef}\n*Product:* ${itemName}\n*Total:* $${amount} USD\n\n--- HOW TO PAY ---\n\n🌍 INTERNATIONAL BUYERS (USA, India, China):\nUse the Blue "Pay Securely By Card" button.\n\n🇿 SOUTH AFRICA (INSTANT EFT):\nBank: Capitec\nAcc: 1975933441\nBranch: 470010\nSWIFT/BIC: CABLZAJJ\nRef: ${orderRef}\nUse "Immediate Payment" for instant delivery.\n\nReply PAID after transfer for automatic delivery.`;
  const waLink = `https://web.whatsapp.com/send?phone=27743868889&text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="max-w-md mx-auto space-y-6 pt-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold">SUPER DIGITAL Marketplace</h1>
          <p className="text-xs text-gray-600 mt-1">Secure Checkout vFinal</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
          <div className="flex justify-between"><span className="text-gray-400">Product:</span><span className="font-semibold text-right">{itemName}</span></div>
          <div className="flex justify-between items-center"><span className="text-gray-400">Total Due:</span><span className="font-bold text-green-400 text-2xl">${amount} USD</span></div>
        </div>

        <button onClick={startPeach} disabled={status === 'loading'} className="block w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-xl text-center shadow-lg transition-all transform hover:scale-105 disabled:opacity-50">
          {status === 'loading' ? 'Connecting to Peach...' : '💳 Pay Securely By Card (Visa/Mastercard)'}
        </button>

        {status === 'error' && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 text-sm text-red-300 text-center">
            Could not reach Peach Gateway. Please use the WhatsApp button below.
          </div>
        )}

        <div className="flex items-center justify-center gap-2 text-gray-500 text-xs uppercase tracking-wider">
          <span className="border-b border-gray-700 flex-grow"></span>Or<span className="border-b border-gray-700 flex-grow"></span>
        </div>

        <a href={waLink} target="_blank" rel="noopener noreferrer" className="block w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-xl text-center shadow-lg transition-all transform hover:scale-105">
          📲 Chat on WhatsApp To Buy
        </a>

        <Link href="/" className="block text-center text-gray-500 hover:text-white text-sm mt-4">← Cancel and Return to Home</Link>
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
