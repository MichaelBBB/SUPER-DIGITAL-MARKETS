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
  const [selectedMethod, setSelectedMethod] = useState('capitec');

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

  const handlePayment = async (method: string) => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/payment/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: product.price, 
          orderId: `SD-${product.id}`,
          productName: product.name 
        })
      });
      
      const data = await res.json();

      if (data.success && data.url) {
        window.location.href = data.url;
      } else if (data.success && data.checkoutUrl) {
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

  return (
    <div className="min-h-screen bg-slate-950 text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-cyan-400 mb-6 block">← Back to Products</Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Payment Methods */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold mb-4">Select Payment Method</h2>
            
            {/* Razorpay */}
            <button 
              onClick={() => setSelectedMethod('razorpay')}
              className={`w-full p-4 rounded-xl border-2 transition text-left ${
                selectedMethod === 'razorpay' 
                  ? 'border-cyan-500 bg-slate-900' 
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🇮🇳</span>
                    <span className="font-bold">Razorpay</span>
                  </div>
                  <span className="text-xs text-blue-400">INDIA PRIMARY</span>
                </div>
              </div>
            </button>

            {/* Alipay */}
            <button 
              onClick={() => setSelectedMethod('alipay')}
              className={`w-full p-4 rounded-xl border-2 transition text-left ${
                selectedMethod === 'alipay' 
                  ? 'border-cyan-500 bg-slate-900' 
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🇨🇳</span>
                    <span className="font-bold">Alipay</span>
                  </div>
                  <span className="text-xs text-blue-400">CHINA PRIMARY</span>
                </div>
              </div>
            </button>

            {/* Payoneer */}
            <button 
              onClick={() => setSelectedMethod('payoneer')}
              className={`w-full p-4 rounded-xl border-2 transition text-left ${
                selectedMethod === 'payoneer' 
                  ? 'border-cyan-500 bg-slate-900' 
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🇺🇸</span>
                    <span className="font-bold">Payoneer</span>
                  </div>
                  <span className="text-xs text-red-400">USA PRIMARY</span>
                </div>
              </div>
            </button>

            {/* Google Pay */}
            <button 
              onClick={() => setSelectedMethod('googlepay')}
              className={`w-full p-4 rounded-xl border-2 transition text-left ${
                selectedMethod === 'googlepay' 
                  ? 'border-cyan-500 bg-slate-900' 
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🌍</span>
                    <span className="font-bold">Google Pay</span>
                  </div>
                  <span className="text-xs text-blue-400">GLOBAL</span>
                </div>
              </div>
            </button>

            {/* Peach Payments */}
            <button 
              onClick={() => setSelectedMethod('peach')}
              className={`w-full p-4 rounded-xl border-2 transition text-left ${
                selectedMethod === 'peach' 
                  ? 'border-cyan-500 bg-slate-900' 
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🇿🇦</span>
                    <span className="font-bold">Peach Payments</span>
                  </div>
                  <span className="text-xs text-orange-400">SA PRIMARY</span>
                </div>
              </div>
            </button>

            {/* Capitec Bank Transfer */}
            <button 
              onClick={() => setSelectedMethod('capitec')}
              className={`w-full p-4 rounded-xl border-2 transition text-left ${
                selectedMethod === 'capitec' 
                  ? 'border-cyan-500 bg-slate-900' 
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🇿🇦</span>
                    <span className="font-bold">Capitec Bank Transfer</span>
                  </div>
                  <span className="text-xs text-gray-500">MANUAL</span>
                </div>
                {selectedMethod === 'capitec' && <span className="text-cyan-400">✓</span>}
              </div>
            </button>
          </div>

          {/* Right Panel - Payment Details */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 p-6 rounded-2xl mb-6">
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <p className="text-3xl font-bold text-cyan-400 mt-2">${product.price.toFixed(2)}</p>
            </div>

            {/* Payment Method Content */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              {selectedMethod === 'capitec' && (
                <>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <span className="text-2xl">🇿🇦</span> Capitec Bank Transfer
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">Direct bank transfer to our Capitec account.</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-gray-400 mb-2">CURRENCIES</h4>
                    <span className="text-cyan-400">ZAR</span>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-gray-400 mb-2">ACCEPTED METHODS</h4>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 bg-slate-800 rounded-full text-xs">EFT</span>
                      <span className="px-3 py-1 bg-slate-800 rounded-full text-xs">Internet Banking</span>
                      <span className="px-3 py-1 bg-slate-800 rounded-full text-xs">Capitec App</span>
                    </div>
                  </div>

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
                    Pay with Capitec Bank Transfer
                  </button>
                </>
              )}

              {selectedMethod === 'peach' && (
                <>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <span className="text-2xl">🇿🇦</span> Peach Payments
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">Secure card payments, Google Pay, Apple Pay & Instant EFT</p>
                  
                  <button
                    onClick={() => handlePayment('peach')}
                    disabled={processing}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition ${
                      processing ? 'bg-gray-600' : 'bg-cyan-500 hover:bg-cyan-400'
                    }`}
                  >
                    {processing ? 'Processing...' : `Pay $${product.price.toFixed(2)} Securely`}
                  </button>
                </>
              )}

              {selectedMethod === 'razorpay' && (
                <>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <span className="text-2xl">🇮🇳</span> Razorpay
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">Pay with Indian payment methods (UPI, Cards, NetBanking)</p>
                  
                  <button
                    onClick={() => handlePayment('razorpay')}
                    disabled={processing}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition ${
                      processing ? 'bg-gray-600' : 'bg-indigo-600 hover:bg-indigo-500'
                    }`}
                  >
                    {processing ? 'Processing...' : `Pay $${product.price.toFixed(2)} via Razorpay`}
                  </button>
                </>
              )}

              {selectedMethod === 'alipay' && (
                <>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <span className="text-2xl">🇨🇳</span> Alipay
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">Pay with Alipay (China's leading payment platform)</p>
                  
                  <button
                    onClick={() => handlePayment('alipay')}
                    disabled={processing}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition ${
                      processing ? 'bg-gray-600' : 'bg-blue-500 hover:bg-blue-400'
                    }`}
                  >
                    {processing ? 'Processing...' : `Pay $${product.price.toFixed(2)} via Alipay`}
                  </button>
                </>
              )}

              {selectedMethod === 'payoneer' && (
                <>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <span className="text-2xl">🇺🇸</span> Payoneer
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">International payments via Payoneer</p>
                  
                  <button
                    onClick={() => handlePayment('payoneer')}
                    disabled={processing}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition ${
                      processing ? 'bg-gray-600' : 'bg-yellow-600 hover:bg-yellow-500'
                    }`}
                  >
                    {processing ? 'Processing...' : `Pay $${product.price.toFixed(2)} via Payoneer`}
                  </button>
                </>
              )}

              {selectedMethod === 'googlepay' && (
                <>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <span className="text-2xl">🌍</span> Google Pay
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">Fast & secure payments with Google Pay</p>
                  
                  <button
                    onClick={() => handlePayment('googlepay')}
                    disabled={processing}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition ${
                      processing ? 'bg-gray-600' : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    {processing ? 'Processing...' : `Pay $${product.price.toFixed(2)} with Google Pay`}
                  </button>
                </>
              )}
            </div>
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
