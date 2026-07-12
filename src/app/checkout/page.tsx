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
  const product = products.find(p => p.id === Number(searchParams.get('product')));
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('capitec');

  if (!product) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center"><p className="text-red-400">Product not found</p></div>;

  const handlePeachPayment = async () => {
    setProcessing(true);
    try {
      const res = await fetch('/api/peach-payment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: product.price, orderId: `SD-${product.id}` }) });
      const data = await res.json();
      if (data.success && data.checkoutUrl) window.location.href = data.checkoutUrl;
      else alert(`❌ Payment Error: ${data.error || data.message}`);
    } catch (e) { alert('Failed to connect to payment server.'); }
    finally { setProcessing(false); }
  };

  const handleCapitecConfirmation = async () => {
    setProcessing(true);
    try {
      const customerEmail = prompt('Please enter your email for instant delivery after approval:');
      if (!customerEmail) { alert('Email is required for delivery.'); return; }
      const res = await fetch('/api/payment/capitec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: product.price, orderId: `SD-${product.id}`, productName: product.name, customerEmail }) });
      const data = await res.json();
      alert(data.success ? '✅ Payment recorded! Admin will verify & deliver instantly.' : `❌ Error: ${data.error}`);
    } catch (e) { alert('Failed to connect to server.'); }
    finally { setProcessing(false); }
  };

  return (
    <div className="min-h-screen bg-[#050B14] text-white py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/products" className="text-cyan-400 hover:text-white mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest">&larr; Back to Products</Link>
        
        <h1 className="text-4xl font-bold mb-8">Secure Checkout</h1>
        <p className="text-gray-400 mb-8">Order: <span className="text-white font-bold">{product.name}</span> — Total: <span className="text-cyan-400 font-bold">${product.price.toFixed(2)}</span></p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDEBAR: PAYMENT STEPS GUIDE */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-300 mb-4 px-1">Payment Steps</h2>
            
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-900/50 text-cyan-400 font-bold flex items-center justify-center flex-shrink-0">01</div>
                <div>
                  <div className="font-bold text-sm">Choose Your Product</div>
                  <div className="text-xs text-gray-400">Browse all 30 digital products and click "Buy Now".</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-900/50 text-cyan-400 font-bold flex items-center justify-center flex-shrink-0">02</div>
                <div>
                  <div className="font-bold text-sm">Select Payment Method</div>
                  <div className="text-xs text-gray-400">Choose from Razorpay, Alipay, Payoneer, Google Pay, Peach Payments, or direct bank transfer.</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-900/50 text-cyan-400 font-bold flex items-center justify-center flex-shrink-0">03</div>
                <div>
                  <div className="font-bold text-sm">Complete Payment</div>
                  <div className="text-xs text-gray-400">Follow the secure checkout flow. For bank transfers, use the Capitec details below.</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-900/50 text-green-400 font-bold flex items-center justify-center flex-shrink-0">04</div>
                <div>
                  <div className="font-bold text-sm">Instant Delivery</div>
                  <div className="text-xs text-gray-400">Your digital product is delivered immediately to your email after payment confirmation.</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: BANK DETAILS & ACTION */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

              {selectedMethod === 'capitec' && (
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🇿</span>
                      <div>
                        <h2 className="text-2xl font-bold">Capitec Bank Transfer</h2>
                        <p className="text-gray-400 text-sm">South Africa Market</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-green-900/30 border border-green-800 text-green-400 text-xs font-bold flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                      Verified
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <span className="text-gray-500 text-xs block">Account Holder</span>
                      <div className="flex items-center justify-between">
                        <span className="font-bold">SUPER DIGITAL</span>
                        <button onClick={() => navigator.clipboard.writeText('SUPER DIGITAL')}>📋</button>
                      </div>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <span className="text-gray-500 text-xs block">Account Number</span>
                      <div className="flex items-center justify-between">
                        <span className="font-bold font-mono">1975933441</span>
                        <button onClick={() => navigator.clipboard.writeText('1975933441')}>📋</button>
                      </div>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <span className="text-gray-500 text-xs block">Swift Code</span>
                      <div className="flex items-center justify-between">
                        <span className="font-bold">CABLZAJJ</span>
                        <button onClick={() => navigator.clipboard.writeText('CABLZAJJ')}>📋</button>
                      </div>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <span className="text-gray-500 text-xs block">Branch Code</span>
                      <div className="flex items-center justify-between">
                        <span className="font-bold">470010</span>
                        <button onClick={() => navigator.clipboard.writeText('470010')}>📋</button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-800 p-4 rounded-xl mb-6">
                    <p className="text-xs text-blue-200">
                      <strong>After payment:</strong> Email your proof of payment to <a href="mailto:payments@superdigital.store" className="underline hover:text-blue-100">payments@superdigital.store</a> with your order number. Products are delivered within 2 hours of payment confirmation. Reference your order number in the payment description.
                    </p>
                  </div>

                  <button 
                    onClick={handleCapitecConfirmation}
                    disabled={processing}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg transition shadow-lg shadow-blue-900/20 flex items-center justify-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    {processing ? 'Processing...' : 'Pay with Capitec Bank Transfer'}
                  </button>
                </div>
              )}

              {selectedMethod === 'peach' && (
                <div className="text-center py-4 relative z-10">
                  <div className="w-16 h-16 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-4 text-3xl">💳</div>
                  <h2 className="text-2xl font-bold mb-2">Credit / Debit Card</h2>
                  <p className="text-gray-400 mb-8">Securely powered by Peach Payments.</p>
                  <button onClick={handlePeachPayment} disabled={processing} className={`w-full max-w-md mx-auto py-4 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-bold text-lg transition shadow-lg shadow-cyan-500/25`}>{processing ? 'Processing...' : `Pay $${product.price.toFixed(2)} Securely`}</button>
                </div>
              )}
              
              {(selectedMethod !== 'capitec' && selectedMethod !== 'peach') && (
                 <div className="text-center py-10">
                   <h3 className="text-xl font-bold mb-2 capitalize">{selectedMethod}</h3>
                   <p className="text-gray-400 mb-6">Coming soon.</p>
                   <button disabled className="py-3 px-8 bg-slate-800 rounded-lg font-bold cursor-not-allowed opacity-50">Unavailable</button>
                 </div>
              )}
            </div>

            {/* ALL ACCEPTED METHODS BAR */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
               <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 text-center">All Accepted Payment Methods</h3>
               <div className="flex flex-wrap justify-center gap-3">
                 <button onClick={() => setSelectedMethod('razorpay')} className="px-3 py-1 bg-slate-800 rounded-full text-xs border border-slate-700 hover:border-cyan-500 transition">Razorpay 🇮</button>
                 <button onClick={() => setSelectedMethod('alipay')} className="px-3 py-1 bg-slate-800 rounded-full text-xs border border-slate-700 hover:border-cyan-500 transition">Alipay 🇨</button>
                 <button onClick={() => setSelectedMethod('payoneer')} className="px-3 py-1 bg-slate-800 rounded-full text-xs border border-slate-700 hover:border-cyan-500 transition">Payoneer 🇺🇸</button>
                 <button onClick={() => setSelectedMethod('googlepay')} className="px-3 py-1 bg-slate-800 rounded-full text-xs border border-slate-700 hover:border-cyan-500 transition">Google Pay 🌍</button>
                 <button onClick={() => setSelectedMethod('peach')} className="px-3 py-1 bg-slate-800 rounded-full text-xs border border-slate-700 hover:border-cyan-500 transition">Peach Payments 🇿🇦</button>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050B14] text-white flex items-center justify-center">Loading...</div>}>
      <CheckoutInner />
    </Suspense>
  );
}
