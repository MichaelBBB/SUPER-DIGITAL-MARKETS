'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const products = [
  { id: 1, name: "ChatGPT Plus", price: 20.00 },
  { id: 2, name: "Adobe Creative Cloud", price: 54.99 },
  { id: 3, name: "Netflix Premium", price: 22.99 },
  { id: 4, name: "Microsoft 365 Business", price: 12.50 },
  { id: 5, name: "Spotify Premium", price: 9.99 },
  { id: 6, name: "NordVPN", price: 3.99 },
  { id: 7, name: "Notion Plus", price: 8.00 },
  { id: 8, name: "Figma Professional", price: 12.00 },
  { id: 9, name: "Dropbox Plus", price: 9.99 },
  { id: 10, name: "Canva Pro", price: 12.99 },
  { id: 11, name: "Grammarly Premium", price: 12.00 },
  { id: 12, name: "Zoom Pro", price: 14.99 },
  { id: 13, name: "LastPass Premium", price: 3.00 },
  { id: 14, name: "Cursor AI Pro", price: 20.00 },
  { id: 15, name: "Midjourney Standard", price: 24.00 },
  { id: 16, name: "GitHub Copilot", price: 10.00 },
  { id: 17, name: "Slack Pro", price: 7.25 },
  { id: 18, name: "Dashlane Premium", price: 4.99 },
  { id: 19, name: "Adobe Photoshop", price: 22.99 },
  { id: 20, name: "Claude Pro", price: 20.00 },
  { id: 21, name: "Adobe Premiere Pro", price: 22.99 },
  { id: 22, name: "Asana Premium", price: 10.99 },
  { id: 23, name: "ExpressVPN", price: 6.67 },
  { id: 24, name: "YouTube Premium", price: 13.99 },
  { id: 25, name: "1Password", price: 2.99 },
  { id: 26, name: "Monday.com Pro", price: 9.00 },
  { id: 27, name: "Perplexity Pro", price: 20.00 },
  { id: 28, name: "Loom Business", price: 12.50 },
  { id: 29, name: "Webflow CMS", price: 14.00 },
  { id: 30, name: "ElevenLabs Starter", price: 5.00 }
];

function CheckoutInner() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');
  const product = products.find(p => p.id === Number(productId));
  const [processing, setProcessing] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-red-400">Product not found</p>
      </div>
    );
  }

  const handleCapitecClick = () => {
    const subject = encodeURIComponent(`Payment - SD-${product.id}`);
    const body = encodeURIComponent(`Order: ${product.name}\nReference: SD-${product.id}\nAmount: $${product.price}`);
    window.location.href = `mailto:payments@superdigital.store?subject=${subject}&body=${body}`;
  };

  const handlePeachPayment = async () => {
    setProcessing(true);
    try {
      const res = await fetch('/api/peach-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: product.price, orderId: `SD-${product.id}` })
      });
      
      const data = await res.json();

      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        const step = data.step || 'unknown';
        const msg = data.error || data.message || 'Unknown error';
        alert(`❌ Payment Failed\n\nStep: ${step}\nError: ${msg}`);
      }
    } catch (e) {
      alert('Failed to connect to server.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-cyan-400 mb-6 block">← Back to Products</Link>
        <h1 className="text-3xl font-bold mb-6">Secure Checkout</h1>
        
        <div className="bg-slate-900 p-6 rounded-2xl mb-6">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="text-3xl font-bold text-cyan-400 mt-2">${product.price.toFixed(2)}</p>
        </div>

        <div className="space-y-4">
          {/* Capitec Bank Transfer */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-xl font-bold mb-3">🏦 Capitec Bank Transfer</h3>
            <p className="text-gray-400 text-sm mb-4">Direct EFT. Instant delivery upon confirmation.</p>
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div className="bg-slate-950 p-3 rounded">
                <span className="text-gray-500 text-xs block">Account</span>
                <span className="font-bold">SUPER DIGITAL</span>
              </div>
              <div className="bg-slate-950 p-3 rounded">
                <span className="text-gray-500 text-xs block">Number</span>
                <span className="font-bold font-mono">1975933441</span>
              </div>
              <div className="bg-slate-950 p-3 rounded">
                <span className="text-gray-500 text-xs block">Branch</span>
                <span className="font-bold font-mono">470010</span>
              </div>
              <div className="bg-slate-950 p-3 rounded">
                <span className="text-gray-500 text-xs block">Reference</span>
                <span className="font-bold font-mono">SD-{product.id}</span>
              </div>
            </div>
            <button 
              onClick={handleCapitecClick} 
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition"
            >
              I've Completed the Transfer
            </button>
          </div>

          {/* Peach Payments Card Button */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-cyan-500/30">
            <h3 className="text-xl font-bold mb-2">💳 Credit / Debit Card</h3>
            <p className="text-gray-400 text-sm mb-4">Secure checkout powered by Peach Payments</p>
            <button
              onClick={handlePeachPayment}
              disabled={processing}
              className={`w-full py-4 rounded-xl font-bold text-lg transition ${
                processing 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-cyan-500 hover:bg-cyan-400 cursor-pointer'
              }`}
            >
              {processing ? 'Processing...' : `Pay $${product.price.toFixed(2)} Securely`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading...
      </div>
    }>
      <CheckoutInner />
    </Suspense>
  );
}
