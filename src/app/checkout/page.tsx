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
  const [selectedMethod, setSelectedMethod] = useState('capitec'); // Default to Capitec as per screenshot

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
        alert(`❌ Payment Error: ${data.error || data.message}`);
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
        alert('✅ Payment recorded! Your product will be delivered within 2 hours.');
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
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-cyan-400 mb-6 block">← Back to Products</Link>
        
        <h1 className="text-3xl font-bold mb-6">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT SIDEBAR - Payment Methods */}
          <div className="space-y-3">
            <button 
              onClick={() => setSelectedMethod('razorpay')}
              className={`w-full p-4 rounded-xl border transition text-left ${
                selectedMethod === 'razorpay' 
                  ? 'border-cyan-500 bg-slate-900 shadow-lg shadow-cyan-500/10' 
                  : 'border-slate-800 bg-slate-900 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🇮🇳</span>
                  <div>
                    <div className="font-bold">Razorpay</div>
                    <div className="text-xs text-blue-400">INDIA PRIMARY</div>
                  </div>
                </div>
                <div className="text-gray-500">India</div>
              </div>
            </button>

            <button 
              onClick={() => setSelectedMethod('alipay')}
              className={`w-full p-4 rounded-xl border transition text-left ${
                selectedMethod === 'alipay' 
                  ? 'border-cyan-500 bg-slate-900 shadow-lg shadow-cyan-500/10' 
                  : 'border-slate-800 bg-slate-900 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🇨🇳</span>
                  <div>
                    <div className="font-bold">Alipay</div>
                    <div className="text-xs text-blue-400">CHINA PRIMARY</div>
                  </div>
                </div>
                <div className="text-gray-500">China</div>
              </div>
            </button>

            <button 
              onClick={() => setSelectedMethod('payoneer')}
              className={`w-full p-4 rounded-xl border transition text-left ${
                selectedMethod === 'payoneer' 
                  ? 'border-cyan-500 bg-slate-900 shadow-lg shadow-cyan-500/10' 
                  : 'border-slate-800 bg-slate-900 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🇺🇸</span>
                  <div>
                    <div className="font-bold">Payoneer</div>
                    <div className="text-xs text-orange-400">USA PRIMARY</div>
                  </div>
                </div>
                <div className="text-gray-500">USA</div>
              </div>
            </button>

            <button 
              onClick={() => setSelectedMethod('googlepay')}
              className={`w-full p-4 rounded-xl border transition text-left ${
                selectedMethod === 'googlepay' 
                  ? 'border-cyan-500 bg-slate-900 shadow-lg shadow-cyan-500/10' 
                  : 'border-slate-800 bg-slate-900 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🌍</span>
                  <div>
                    <div className="font-bold">Google Pay</div>
                    <div className="text-xs text-blue-400">GLOBAL</div>
                  </div>
                </div>
                <div className="text-gray-500">Global</div>
              </div>
            </button>

            <button 
              onClick={() => setSelectedMethod('peach')}
              className={`w-full p-4 rounded-xl border transition text-left ${
                selectedMethod === 'peach' 
                  ? 'border-cyan-500 bg-slate-900 shadow-lg shadow-cyan-500/10' 
                  : 'border-slate-800 bg-slate-900 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🇿🇦</span>
                  <div>
                    <div className="font-bold">Peach Payments</div>
                    <div className="text-xs text-orange-400">SA PRIMARY</div>
                  </div>
                </div>
                <div className="text-gray-500">South Africa</div>
              </div>
            </button>

            <button 
              onClick={() => setSelectedMethod('capitec')}
              className={`w-full p-4 rounded-xl border-2 transition text-left ${
                selectedMethod === 'capitec' 
                  ? 'border-cyan-500 bg-slate-900 shadow-lg shadow-cyan-500/10' 
                  : 'border-slate-800 bg-slate-900 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🇿🇦</span>
                  <div>
                    <div className="font-bold">Capitec Bank Transfer</div>
                    <div className="text-xs text-gray-500">MANUAL</div>
                  </div>
                </div>
                <div className="text-gray-500">South Africa</div>
                {selectedMethod === 'capitec' && (
                  <div className="bg-cyan-500 rounded-full p-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          </div>

          {/* RIGHT PANEL - Selected Method Details */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">
              
              {/* CAPEtec Section */}
              {selectedMethod === 'capitec' && (
                <>
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-4xl">🇿🇦</span>
                        <div>
                          <h2 className="text-2xl font-bold">Capitec Bank Transfer</h2>
                          <p className="text-gray-400">South Africa Market</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-800 rounded-xl">
                      <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                  </div>

                  <p className="text-gray-400 mb-8">Direct bank transfer to our Capitec account.</p>

                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">CURRENCIES</h3>
                    <div className="text-cyan-400 font-bold text-lg">ZAR</div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">ACCEPTED METHODS</h3>
                    <div className="flex gap-3 flex-wrap">
                      <span className="px-4 py-2 bg-slate-800 rounded-full text-sm flex items-center gap-2 border border-slate-700">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        EFT
                      </span>
                      <span className="px-4 py-2 bg-slate-800 rounded-full text-sm flex items-center gap-2 border border-slate-700">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Internet Banking
                      </span>
                      <span className="px-4 py-2 bg-slate-800 rounded-full text-sm flex items-center gap-2 border border-slate-700">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Capitec App
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={handleCapitecConfirmation}
                    disabled={processing}
                    className="w-full py-5 bg-blue-900/50 hover:bg-blue-900/70 border border-blue-800/50 rounded-2xl font-bold text-lg transition duration-200 disabled:bg-gray-700 disabled:border-gray-600 disabled:text-gray-400 flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    {processing ? 'Processing...' : 'Pay with Capitec Bank Transfer'}
                  </button>
                </>
              )}

              {/* PEACH SECTION */}
              {selectedMethod === 'peach' && (
                <div className="text-center py-12">
                  <h3 className="text-2xl font-bold mb-4">Credit / Debit Card</h3>
                  <p className="text-gray-400 mb-8">Secure checkout powered by Peach Payments</p>
                  
                  <button
                    onClick={handlePeachPayment}
                    disabled={processing}
                    className={`w-full max-w-md py-4 rounded-xl font-bold text-lg transition ${
                      processing ? 'bg-gray-600 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20'
                    }`}
                  >
                    {processing ? 'Processing...' : `Pay $${product.price.toFixed(2)} Securely`}
                  </button>
                </div>
              )}

              {/* PLACEHOLDER FOR OTHERS */}
              {selectedMethod !== 'capitec' && selectedMethod !== 'peach' && (
                <div className="text-center py-12">
                  <h3 className="text-2xl font-bold mb-4">{selectedMethod}</h3>
                  <p className="text-gray-400 mb-8">Payment integration coming soon.</p>
                  <button disabled className="py-4 px-8 bg-gray-700 rounded-xl font-bold opacity-50 cursor-not-allowed">Coming Soon</button>
                </div>
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
