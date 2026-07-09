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
  const [showCapitecDetails, setShowCapitecDetails] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-red-400">Product not found</p>
      </div>
    );
  }

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
        const msg = data.error || data.message || 'Payment failed';
        alert(`❌ Payment Error: ${msg}`);
      }
    } catch (e) {
      alert('Failed to connect to payment server.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCapitecConfirmation = async () => {
    setProcessing(true);
    try {
      const res = await fetch('/api/payment/capitec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: product.price, 
          orderId: `SD-${product.id}`,
          productName: product.name 
        })
      });
      
      const data = await res.json();

      if (data.success) {
        alert('✅ Payment recorded! Your product will be delivered to your email within 2 hours.');
      } else {
        alert(`❌ Error: ${data.error || 'Failed to record payment'}`);
      }
    } catch (e) {
      alert('Failed to connect to server.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-cyan-400 mb-6 block">← Back to Products</Link>
        
        <h1 className="text-3xl font-bold mb-6">Secure Checkout</h1>

        {/* Product Summary */}
        <div className="bg-slate-900 p-6 rounded-2xl mb-6">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="text-3xl font-bold text-cyan-400 mt-2">${product.price.toFixed(2)}</p>
          <p className="text-green-400 text-sm mt-2">✓ Instant delivery after payment</p>
        </div>

        {/* Credit/Debit Card - Peach Payments (PRIMARY) */}
        <div className="bg-slate-900 p-6 rounded-2xl mb-6 border-2 border-cyan-500/30">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">💳</span>
            <div>
              <h3 className="text-xl font-bold">Credit / Debit Card</h3>
              <p className="text-gray-400 text-sm">Secure checkout powered by Peach Payments</p>
            </div>
          </div>
          
          <button
            onClick={handlePeachPayment}
            disabled={processing}
            className={`w-full py-4 rounded-xl font-bold text-lg mt-4 transition ${
              processing ? 'bg-gray-600' : 'bg-cyan-500 hover:bg-cyan-400'
            }`}
          >
            {processing ? 'Processing...' : `Pay $${product.price.toFixed(2)} Securely`}
          </button>

          <div className="mt-4 flex items-center justify-center gap-4 text-gray-400 text-sm">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>American Express</span>
          </div>
        </div>

        {/* Capitec Bank Transfer */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏦</span>
              <div>
                <h4 className="font-bold">Capitec Bank Transfer</h4>
                <p className="text-gray-400 text-xs">Direct EFT - Delivery within 2 hours</p>
              </div>
            </div>
            <button
              onClick={() => setShowCapitecDetails(!showCapitecDetails)}
              className="text-cyan-400 text-sm"
            >
              {showCapitecDetails ? 'Hide' : 'Show'} Details
            </button>
          </div>

          {showCapitecDetails && (
            <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="bg-slate-950 p-4 rounded-xl mb-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500 text-xs block">Bank</span>
                    <span className="font-bold text-white">Capitec Bank</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block">Account Name</span>
                    <span className="font-bold text-white">SUPER DIGITAL</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block">Account Number</span>
                    <span className="font-bold font-mono text-cyan-400">1975933441</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block">Branch Code</span>
                    <span className="font-bold font-mono text-white">470010</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 text-xs block">Reference</span>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 bg-slate-900 px-3 py-2 rounded font-mono text-cyan-400 font-bold">
                        SD-{product.id}
                      </code>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(`SD-${product.id}`);
                          alert('Reference copied!');
                        }}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-xs font-bold transition"
                      >
                         Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleCapitecConfirmation}
                disabled={processing}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition disabled:bg-gray-600"
              >
                {processing ? 'Processing...' : '✅ I\'ve Completed the Bank Transfer'}
              </button>
            </div>
          )}
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
