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
          
          {/* LEFT SIDEBAR: Payment Selection */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-gray-300 mb-4 px-1">Select Payment Method</h2>
            
            <button onClick={() => setSelectedMethod('capitec')} className={`w-full p-4 rounded-xl border transition text-left flex items-center justify-between group ${selectedMethod === 'capitec' ? 'bg-slate-900 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'bg-slate-900/50 border-slate-800 hover:border-slate-600'}`}>
              <div className="flex items-center gap-3">
                <span className="text-xl">🇿</span>
                <div>
                  <div className="font-bold">Capitec Bank Transfer</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Manual</div>
                </div>
              </div>
              {selectedMethod === 'capitec' && <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center text-xs">✓</div>}
            </button>

            <button onClick={() => setSelectedMethod('peach')} className={`w-full p-4 rounded-xl border transition text-left flex items-center justify-between group ${selectedMethod === 'peach' ? 'bg-slate-900 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'bg-slate-900/50 border-slate-800 hover:border-slate-600'}`}>
              <div className="flex items-center gap-3">
                <span className="text-xl">💳</span>
                <div>
                  <div className="font-bold">Credit / Debit Card</div>
                  <div className="text-[10px] text-orange-400 uppercase tracking-wider font-bold">Instant Delivery</div>
                </div>
              </div>
              {selectedMethod === 'peach' && <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center text-xs">✓</div>}
            </button>

            <button onClick={() => setSelectedMethod('razorpay')} className={`w-full p-4 rounded-xl border transition text-left flex items-center justify-between group ${selectedMethod === 'razorpay' ? 'bg-slate-900 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'bg-slate-900/50 border-slate-800 hover:border-slate-600'}`}>
              <div className="flex items-center gap-3">
                <span className="text-xl">🇮🇳</span>
                <div>
                  <div className="font-bold">Razorpay</div>
                  <div className="text-[10px] text-blue-400 uppercase tracking-wider font-bold">India Primary</div>
                </div>
              </div>
              {selectedMethod === 'razorpay' && <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center text-xs">✓</div>}
            </button>

            <button onClick={() => setSelectedMethod('alipay')} className={`w-full p-4 rounded-xl border transition text-left flex items-center justify-between group ${selectedMethod === 'alipay' ? 'bg-slate-900 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'bg-slate-900/50 border-slate-800 hover:border-slate-600'}`}>
              <div className="flex items-center gap-3">
                <span className="text-xl">🇨🇳</span>
                <div>
                  <div className="font-bold">Alipay</div>
                  <div className="text-[10px] text-blue-400 uppercase tracking-wider font-bold">China Primary</div>
                </div>
              </div>
              {selectedMethod === 'alipay' && <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center text-xs">✓</div>}
            </button>
          </div>

          {/* RIGHT PANEL: The Guide & Action */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* --- PAYMENT GUIDE (RESTORED) --- */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">📋 Payment Steps</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-900/50 text-cyan-400 font-bold flex items-center justify-center flex-shrink-0">01</div>
                  <div>
                    <div className="font-bold text-sm">Choose Product</div>
                    <div className="text-xs text-gray-400">You selected: {product.name}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-900/50 text-cyan-400 font-bold flex items-center justify-center flex-shrink-0">02</div>
                  <div>
                    <div className="font-bold text-sm">Select Method</div>
                    <div className="text-xs text-gray-400">{selectedMethod === 'capitec' ? 'Capitec Bank Transfer' : 'Credit Card / Other'}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-900/50 text-cyan-400 font-bold flex items-center justify-center flex-shrink-0">03</div>
                  <div>
                    <div className="font-bold text-sm">Complete Payment</div>
                    <div className="text-xs text-gray-400">Click the button below to proceed.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-900/50 text-green-400 font-bold flex items-center justify-center flex-shrink-0">04</div>
                  <div>
                    <div className="font-bold text-sm">Instant Delivery</div>
                    <div className="text-xs text-gray-400">Receive access immediately via email.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- PAYMENT ACTION CARD --- */}
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
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <span className="text-xs text-gray-500 uppercase font-bold">Currencies</span>
                      <div className="text-cyan-400 font-bold text-lg">ZAR</div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase font-bold">Accepted Methods</span>
                      <div className="flex gap-2 mt-1">
                        <span className="px-2 py-1 bg-slate-800 rounded text-xs border border-slate-700">✓ EFT</span>
                        <span className="px-2 py-1 bg-slate-800 rounded text-xs border border-slate-700">✓ Internet Banking</span>
                        <span className="px-2 py-1 bg-slate-800 rounded text-xs border border-slate-700">✓ Capitec App</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-8">Direct bank transfer to our Capitec account. Funds usually reflect within minutes.</p>

                  <button 
                    onClick={handleCapitecConfirmation}
                    disabled={processing}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg transition shadow-lg shadow-blue-900/20 flex items-center justify-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    {processing ? 'Processing...' : 'Pay with Capitec Bank Transfer'}
                  </button>
                  
                  <div className="mt-4 text-center">
                    <p className="text-green-400 text-xs font-bold flex items-center justify-center gap-1">
                      <span>⚡</span> Instant delivery after payment confirmation
                    </p>
                  </div>
                </div>
              )}

              {selectedMethod === 'peach' && (
                <div className="text-center py-4 relative z-10">
                  <div className="w-16 h-16 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-4 text-3xl">💳</div>
                  <h2 className="text-2xl font-bold mb-2">Credit / Debit Card</h2>
                  <p className="text-gray-400 mb-8">Securely powered by Peach Payments. Accepts Visa, Mastercard, and more.</p>
                  
                  <button 
                    onClick={handlePeachPayment}
                    disabled={processing}
                    className="w-full max-w-md mx-auto py-4 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-bold text-lg transition shadow-lg shadow-cyan-500/25"
                  >
                    {processing ? 'Processing...' : `Pay $${product.price.toFixed(2)} Securely`}
                  </button>
                </div>
              )}

              {(selectedMethod === 'razorpay' || selectedMethod === 'alipay') && (
                 <div className="text-center py-10">
                   <h3 className="text-xl font-bold mb-2 capitalize">{selectedMethod}</h3>
                   <p className="text-gray-400 mb-6">This payment method is being configured.</p>
                   <button disabled className="py-3 px-8 bg-slate-800 rounded-lg font-bold cursor-not-allowed opacity-50">Coming Soon</button>
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
    <Suspense fallback={<div className="min-h-screen bg-[#050B14] text-white flex items-center justify-center">Loading...</div>}>
      <CheckoutInner />
    </Suspense>
  );
}
