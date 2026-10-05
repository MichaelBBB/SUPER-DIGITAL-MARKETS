'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Michael's Real WhatsApp Number
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
  
  // Clean dummy values
  const itemName = ['digital product', 'test product'].includes(urlItem.toLowerCase()) ? '' : urlItem;
  const amount = rawAmount === 10.99 ? 0 : rawAmount;

  const [selected, setSelected] = useState(itemName);
  
  // Determine final price: Use catalog price if selected, otherwise URL amount
  const currentPrice = selected 
    ? (CATALOG.find(p => p.name === selected)?.price ?? amount) 
    : amount;

  // Generate unique Order Ref
  const orderRef = 'ORD-' + Math.floor(Math.random() * 900000 + 100000);

  // HARD-CODED CORRECT SPELLING: SUPER DIGITAL MARKETS
  const msg = `*ORDER CONFIRMED - SUPER DIGITAL MARKETS*\n\n*Ref:* ${orderRef}\n*Product:* ${selected || 'Digital Product'}\n*Total:* $${currentPrice} USD\n\n--- HOW TO PAY ---\n\n🌍 INTERNATIONAL BUYERS (USA, India, China):\nPay securely via Visa/Mastercard here:\nhttps://super-digital-markets-co9n.vercel.app/payment?amount=${currentPrice}&item=${encodeURIComponent(selected || 'Digital+Product')}\n\n🇿 SOUTH AFRICA (INSTANT EFT):\nBank: Capitec\nAcc: 1975933441\nBranch: 470010\nSWIFT/BIC: CABLZAJJ\nRef: ${orderRef}\nUse "Immediate Payment" for instant delivery.\n\nReply PAID after transfer for automatic delivery.`;

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Secure Checkout</h1>

        {/* Product Selector */}
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

        {/* Preview of what the customer sees */}
        <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-4 text-xs text-gray-300 whitespace-pre-wrap">
          {msg.split('\n').slice(0, 5).join('\n')}...
        </div>

        {/* Big Green Button */}
        <a 
          href={waLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-xl text-center shadow-lg transition-all"
        >
          Chat on WhatsApp to Buy
        </a>

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
