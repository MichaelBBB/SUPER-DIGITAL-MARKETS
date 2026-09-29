'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';

// Michael's WhatsApp business number — baked in, no edits needed.
const WHATSAPP_NUMBER = '27641061358';

const CATALOG: { name: string; price: number }[] = [
  { name: 'AI Writing Assistant', price: 49 },
  { name: 'Social Media Toolkit', price: 39 },
  { name: 'Logo Maker Pro', price: 29 },
  { name: 'SEO Masterclass', price: 59 },
  { name: 'Email Funnel Pack', price: 35 },
  { name: 'Photo Enhancement Suite', price: 45 },
  { name: 'Brand Kit Deluxe', price: 65 },
  { name: 'Video Template Bundle', price: 55 },
];

function CheckoutInner() {
  const params = useSearchParams();
  const urlItem = (params.get('item') || '').trim();
  const urlAmount = Number(params.get('amount') || 0) || 0;

  const [chosen, setChosen] = useState<string>(urlItem);

  const itemName = chosen || urlItem;
  const inCatalog = CATALOG.find((p) => p.name.toLowerCase() === itemName.toLowerCase());
  const amount = urlAmount > 0 ? urlAmount : inCatalog ? inCatalog.price : 0;

  const message =
    'Hello Super Digital Markets! I want to purchase: ' +
    (itemName || 'a digital product') +
    ' (Total: $' + amount + '). Please send payment instructions.';
  const waLink = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);

  return (
    <div className="min-h-screen bg-black text-white font-sans py-16 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center">Complete Your Purchase</h1>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <div className="text-center pb-6 border-b border-gray-800">
            <p className="text-sm text-gray-400 mb-1">Item</p>
            <p className="text-2xl font-semibold">{itemName || 'Select your product below'}</p>
          </div>
          <div className="text-center pt-6">
            <p className="text-sm text-gray-400 mb-1">Total</p>
            <p className="text-5xl font-bold text-green-400">${amount.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <p className="text-sm text-gray-400 mb-4 text-center">
            Choose your product — the Item name and Total above update instantly:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CATALOG.map((p) => (
              <button
                key={p.name}
                onClick={() => setChosen(p.name)}
                className={
                  'px-4 py-3 rounded-lg border text-sm font-semibold transition-all ' +
                  (itemName.toLowerCase() === p.name.toLowerCase()
                    ? 'bg-cyan-600 border-cyan-400 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-cyan-500')
                }
              >
                {p.name} — ${p.price}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-green-950/40 border border-green-700 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Pay via WhatsApp (Recommended)</h2>
          <p className="text-gray-300 mb-6">
            Fastest method! Chat with us directly for instant payment instructions and order confirmation.
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 rounded-lg bg-green-600 hover:bg-green-500 text-white font-bold text-lg transition-all"
          >
            Chat to Buy Now
          </a>
          <p className="text-xs text-gray-400 mt-4">Available 24/7 • Instant Response</p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <CheckoutInner />
    </Suspense>
  );
}
