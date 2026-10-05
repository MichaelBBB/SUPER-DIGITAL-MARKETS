'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const WHATSAPP_NUMBER = '27743868889';

const CATALOG = [
  { name: 'AI Writing Assistant', price: 49 },
  { name: 'Social Media Toolkit', price: 39 },
  { name: 'Logo Maker Pro', price: 29 },
  { name: 'SEO Masterclass', price: 59 },
  { name: 'Email Funnel Pack', price: 35 },
  { name: 'Photo Enhancement Suite', price: 45 },
  { name: 'Brand Kit Deluxe', price: 65 },
  { name: 'Video Template Bundle', price: 55 },
  { name: 'Claude Pro', price: 20 },
  { name: 'ExpressVPN', price: 6.67 },
  { name: 'LastPass Premium', price: 3 },
  { name: 'Dashlane Premium', price: 4.99 },
];

function CheckoutInner() {
  const params = useSearchParams();
  const urlItem = (params.get('item') || '').trim();
  const rawAmount = Number(params.get('amount') || 0);
  
  const itemName = ['digital product', 'test product'].includes(urlItem.toLowerCase()) ? '' : urlItem;
  const amount = rawAmount === 10.99 ? 0 : rawAmount;

  const [selected, setSelected] = useState(itemName);
  
  const currentPrice = selected 
    ? (CATALOG.find(p => p.name === selected)?.price ?? amount) 
    : amount;

  const orderRef = 'ORD-' + Math.floor(Math.random() * 900000 + 100000);

  const msg = `*ORDER CONFIRMED - SUPER DIGITAL MARKETS*\n\n*Ref:* ${orderRef}\n*Product:* ${selected || 'Digital Product'}\n*Total:* $${currentPrice} USD\n\n--- HOW TO PAY ---\n\n🌍 INTERNATIONAL BUYERS (USA, India, China):\nUse the Blue "Pay Securely By Card" button above.\n\n🇿 SOUTH AFRICA (INSTANT EFT):\nBank: Capitec\nAcc: 1975933441\nBranch: 470010\nSWIFT/BIC: CABLZAJJ\nRef: ${orderRef}\nUse "Immediate Payment" for instant delivery.\n\nReply PAID after transfer for automatic delivery.`;

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

  // HARDCODED ABSOLUTE URL TO PEACH GATEWAY
  const peachUrl = `https://super-digital-markets-co9n.vercel.app/payment?amount=${currentPrice}&item=${encodeURIComponent(selected || 'Digital+Product')}`;

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Secure Checkout</h1>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-3">Select Product:</p>
          <select 
            value={selected} 
            onChange={(e) => setSelected(e.target.value)}
            className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white"
          >
            <option value="">-- Choose One --</option>
            {CATALOG.map(p => (
              <option key={p.name} value={p.name}>{p.name} (${p.price})</option>
            ))}
          </select>
          
          {selected && (
            <div className="mt-4 pt-4 border-t border-gray-800 text-center">
              <p className="text-gray-400 text-sm">Total Due:</p>
              <p className="text-4xl font-bold text-green-400">${currentPrice}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          
          {/* BLUE BUTTON: DIRECT TO PEACH CARD FORM */}
          <a 
            href={peachUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-xl text-center shadow-lg transition-all transform hover:scale-105"
          >
             Pay Securely By Card (Visa/Mastercard)
          </a>

          <div className="flex items-center justify-center gap-2 text-gray-500 text-xs uppercase tracking-wider">
            <span className="border-b border-gray-700 flex-grow"></span>
            Or Chat For EFT
            <span className="border-b border-gray-700 flex-grow"></span>
          </div>

          {/* GREEN BUTTON: WHATSAPP */}
          <a 
            href={waLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-xl text-center shadow-lg transition-all transform hover:scale-105"
          >
            📲 Chat On WhatsApp To Buy (Capitec EFT)
          </a>
        </div>

        <Link href="/" className="block text-center text-gray-500 hover:text-white text-sm mt-4">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <CheckoutInner />
    </Suspense>
  );
}
