'use client';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const products = [
  { id: 1, name: "ChatGPT Plus", price: 20.00 }, { id: 2, name: "Adobe Creative Cloud", price: 54.99 }, { id: 3, name: "Netflix Premium", price: 22.99 },
  { id: 4, name: "Microsoft 365 Business", price: 12.50 }, { id: 5, name: "Spotify Premium", price: 9.99 }, { id: 6, name: "NordVPN", price: 3.99 },
  { id: 7, name: "Notion Plus", price: 8.00 }, { id: 8, name: "Figma Professional", price: 12.00 }, { id: 9, name: "Dropbox Plus", price: 9.99 },
  { id: 10, name: "Canva Pro", price: 12.99 }, { id: 11, name: "Grammarly Premium", price: 12.00 }, { id: 12, name: "Zoom Pro", price: 14.99 },
  { id: 13, name: "LastPass Premium", price: 3.00 }, { id: 14, name: "Cursor AI Pro", price: 20.00 }, { id: 15, name: "Midjourney Standard", price: 24.00 },
  { id: 16, name: "GitHub Copilot", price: 10.00 }, { id: 17, name: "Slack Pro", price: 7.25 }, { id: 18, name: "Dashlane Premium", price: 4.99 },
  { id: 19, name: "Adobe Photoshop", price: 22.99 }, { id: 20, name: "Claude Pro", price: 20.00 }, { id: 21, name: "Adobe Premiere Pro", price: 22.99 },
  { id: 22, name: "Asana Premium", price: 10.99 }, { id: 23, name: "ExpressVPN", price: 6.67 }, { id: 24, name: "YouTube Premium", price: 13.99 },
  { id: 25, name: "1Password", price: 2.99 }, { id: 26, name: "Monday.com Pro", price: 9.00 }, { id: 27, name: "Perplexity Pro", price: 20.00 },
  { id: 28, name: "Loom Business", price: 12.50 }, { id: 29, name: "Webflow CMS", price: 14.00 }, { id: 30, name: "ElevenLabs Starter", price: 5.00 }
];

function CheckoutInner() {
  const searchParams = useSearchParams();
  const productId = Number(searchParams.get('product')) || 1;
  const product = products.find(p => p.id === productId) || products[0];
  const [processing, setProcessing] = useState(false);

  const handleCapitecConfirm = async () => {
    setProcessing(true);
    try {
      const email = prompt('Enter your email for instant delivery:');
      if (!email) { alert('Email required.'); return; }
      
      // 1. Record payment
      await fetch('/api/payment/capitec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: product.price, orderId: `SD-${product.id}`, productName: product.name, customerEmail: email })
      });

      // 2. Increment sales tracker
      await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ region: 'southAfrica' })
      });

      alert('✅ Payment recorded & sales tracker updated!');
    } catch (e) { alert('Server error.'); }
    finally { setProcessing(false); }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white py-12 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <Link href="/products" className="text-cyan-400 hover:text-white mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest">← Back to Products</Link>
        <h1 className="text-4xl font-bold mb-2">Secure Checkout</h1>
        <p className="text-gray-400 mb-8">Order: <span className="text-white font-bold">{product.name}</span> — Total: <span className="text-cyan-400 font-bold">${product.price.toFixed(2)}</span></p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-3">
            {['razorpay','alipay','payoneer','googlepay','peach','capitec'].map(m => (
              <div key={m} className={`p-4 rounded-xl border cursor-pointer ${m === 'capitec' ? 'border-cyan-500 bg-[#0F172A]' : 'border-slate-700 bg-[#0F172A]/50'}`}>
                <div className="font-bold text-sm capitalize">{m} {m === 'capitec' ? 'Bank Transfer' : ''}</div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800">
              <h2 className="text-xl font-bold mb-4">Capitec Bank Transfer</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800"><span className="text-gray-500 text-xs block">HOLDER</span><span className="font-bold">SUPER DIGITAL</span></div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800"><span className="text-gray-500 text-xs block">ACCOUNT</span><span className="font-bold font-mono">1975933441</span></div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800"><span className="text-gray-500 text-xs block">SWIFT</span><span className="font-bold">CABLZAJJ</span></div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800"><span className="text-gray-500 text-xs block">BRANCH</span><span className="font-bold">470010</span></div>
              </div>
              <button onClick={handleCapitecConfirm} disabled={processing} className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition">
                {processing ? 'Processing...' : 'Confirm Payment & Update Tracker'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center">Loading...</div>}>
      <CheckoutInner />
    </Suspense>
  );
}
