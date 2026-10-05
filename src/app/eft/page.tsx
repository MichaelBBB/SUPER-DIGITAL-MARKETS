'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function makeRef(item: string, amount: number) {
  const s = (item + amount).toUpperCase();
  let h = 7;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) % 900000;
  }
  return 'ORD-' + (100000 + h);
}

function EftInner() {
  const params = useSearchParams();
  const urlItem = (params.get('item') || '').trim();
  const rawAmount = Number(params.get('amount') || 0);
  const itemName = ['', 'digital product', 'test product'].includes(urlItem.toLowerCase()) ? 'Digital Product' : urlItem;
  const amount = rawAmount > 0 && rawAmount !== 10.99 ? rawAmount : 0;
  const orderRef = makeRef(itemName, amount);
  const cardLink = `https://super-digital-markets-co9n.vercel.app/payment?amount=${amount}&item=${encodeURIComponent(itemName)}`;

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Super Digital Markets</h1>
          <p className="text-gray-400 text-sm mt-1">Instant EFT Payment Panel</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
          <div className="flex justify-between"><span className="text-gray-400">Product:</span><span className="font-semibold text-right">{itemName}</span></div>
          <div className="flex justify-between items-center"><span className="text-gray-400">Total Due:</span><span className="font-bold text-green-400 text-2xl">${amount}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Order Ref:</span><span className="font-mono text-cyan-400">{orderRef}</span></div>
        </div>

        <div className="bg-gray-900 border border-green-800 rounded-xl p-6 space-y-2">
          <h2 className="font-bold text-lg text-green-400 mb-2">🇿 Capitec Instant EFT</h2>
          <p>Bank: <b>Capitec</b></p>
          <p>Account No: <b className="font-mono">1975933441</b></p>
          <p>Branch Code: <b className="font-mono">470010</b></p>
          <p>SWIFT/BIC: <b className="font-mono">CABLZAJJ</b></p>
          <p>Reference: <b className="font-mono text-cyan-400">{orderRef}</b></p>
          <p className="text-sm text-gray-400 pt-2">Use "Immediate Payment" and the reference above so your delivery is automatic.</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-sm text-gray-300 space-y-2">
          <p className="font-bold text-white mb-1">What happens next:</p>
          <p>1. Pay the exact total from your banking app using the reference.</p>
          <p>2. Email your proof of payment to <b className="text-white">payments@superdigital.store</b> with the reference in the subject.</p>
          <p>3. Your product is delivered to your email instantly after verification.</p>
          <p className="text-gray-400 pt-1">Outside South Africa? Use the card button below instead.</p>
        </div>

        <a
          href={cardLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-xl text-center shadow-lg transition-all transform hover:scale-105"
        >
          💳 Pay by Card Instead (Visa/Mastercard)
        </a>

        <Link href="/" className="block text-center text-gray-500 hover:text-white text-sm">← Back to Home</Link>
      </div>
    </div>
  );
}

export default function EftPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <EftInner />
    </Suspense>
  );
}
