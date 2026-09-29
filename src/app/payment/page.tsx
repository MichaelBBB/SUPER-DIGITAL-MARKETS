'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Michael's REAL WhatsApp number — baked in.
const WHATSAPP_NUMBER = '27743868889';

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

const DUMMY_NAMES = ['digital product', 'test product', 'product', 'item', ''];

function cleanItem(raw: string): string {
  const t = raw.trim();
  const low = t.toLowerCase();
  if (DUMMY_NAMES.includes(low)) return '';
  return t;
}

function CheckoutInner() {
  const params = useSearchParams();
  const urlItem = cleanItem(params.get('item') || '');
  const rawAmount = Number(params.get('amount') || 0) || 0;
  const urlAmount = rawAmount === 10.99 ? 0 : rawAmount;

  const [chosen, setChosen] = useState<string>(urlItem);

  const itemName = chosen || urlItem;
  const inCatalog = CATALOG.find((p) => p.name.toLowerCase() === itemName.toLowerCase());
  const amount = urlAmount > 0 ? urlAmount : inCatalog ? inCatalog.price : 0;

  const message =
    'Hello Super Digital Markets! I want to purchase: ' +
    (itemName || 'a digital product') +
    ' (Total: $' + amount + '). I have read the Payment Guide and I am ready to pay. Please confirm my order.';
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

        <div className="bg-gray-900 border border-cyan-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6">How To Pay — Payment Guide</h2>
          <div className="space-y-4 text-gray-300 text-sm md:text-base">
            <p><span className="font-bold text-cyan-400">Step 1.</span> Tap <span className="text-white font-semibold">Chat to Buy Now</span> below — your order (product name + total) is already typed for you.</p>
            <p><span className="font-bold text-cyan-400">Step 2.</span> Press <span className="text-white font-semibold">Send</span> in WhatsApp. Our team replies 24/7 with our secure Capitec EFT / card payment details.</p>
            <p><span className="font-bold text-cyan-400">Step 3.</span> Pay and send the proof in the same chat. You receive your Order Reference (e.g. ORDER-8882).</p>
            <p><span className="font-bold text-cyan-400">Step 4.</span> Your product is delivered instantly in chat with your download / license details.</p>
          </div>
          <p className="text-xs text-gray-500 mt-6 text-center">
            Banking details are shared only inside your private WhatsApp chat for your security — never on public pages.
          </p>
        </div>

        <div className="bg-green-950/40 border border-green-700 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Pay via WhatsApp (Recommended)</h2>
          <p className="text-gray-300 mb-6">
            Fastest method! Chat with us directly for instant payment details and order confirmation.
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

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <p className="text-sm text-gray-400 mb-4 text-center">Choose Similar Products</p>
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

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <button className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full text-lg shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105">
              ← Back To Products
            </button>
          </Link>
          <Link href="/">
            <button className="w-full px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-full text-lg shadow-lg transition-all transform hover:scale-105">
              Back To Home
            </button>
          </Link>
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
