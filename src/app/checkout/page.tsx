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
  const productId = Number(searchParams.get('product')) || 1;
  const product = products.find(p => p.id === productId) || products[0];
  const [selectedMethod, setSelectedMethod] = useState('capitec');
  const [processing, setProcessing] = useState(false);

  const handleCapitecConfirm = async () => {
    setProcessing(true);
    try {
      const email = prompt('Enter your email for instant delivery:');
      if (!email) { alert('Email required.'); return; }
      const res = await fetch('/api/payment/capitec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: product.price, orderId: `SD-${product.id}`, productName: product.name, customerEmail: email })
      });
      const data = await res.json();
      alert(data.success ? '✅ Payment recorded! Admin will verify & deliver instantly.' : `❌ ${data.error}`);
    } catch (e) { alert('Server error.'); }
    finally { setProcessing(false); }
  };

  const handlePeachPay = async () => {
    setProcessing(true);
    try {
      const res = await fetch('/api/peach-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: product.price, orderId: `SD-${product.id}` })
      });
      const data = await res.json();
      if (data.success && data.checkoutUrl) window.location.href = data.checkoutUrl;
      else alert(`❌ ${data.error || 'Payment failed'}`);
    } catch (e) { alert('Server error.'); }
    finally { setProcessing(false); }
  };

  const handleExternal = (name: string) => {
    alert(`Redirecting to ${name}...\nPlease use Order ID: SD-${product.id} as reference.`);
  };

  const methods = [
    { id: 'razorpay', name: 'Razorpay', sub: 'INDIA PRIMARY', flag: '🇮🇳', color: 'text-blue-400' },
    { id: 'alipay', name: 'Alipay', sub: 'CHINA PRIMARY', flag: '🇨🇳', color: 'text-blue-400' },
    { id: 'payoneer', name: 'Payoneer', sub: 'USA PRIMARY', flag: '🇺🇸', color: 'text-orange-400' },
    { id: 'googlepay', name: 'Google Pay', sub: 'GLOBAL', flag: '🌍', color: 'text-blue-400' },
    { id: 'peach', name: 'Peach Payments', sub: 'SA PRIMARY', flag: '🇿🇦', color: 'text-orange-400' },
    { id: 'capitec', name: 'Capitec Bank Transfer', sub: 'MANUAL', flag: '🇿', color: 'text-cyan-400' },
  ];

  return (
    <div className="min-h-screen bg-[#0B1120] text-white py-12 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <Link href="/products" className="text-cyan-400 hover:text-white mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
          &larr; Back to Products
        </Link>
        <h1 className="text-4xl font-bold mb-2">Secure Checkout</h1>
        <p className="text-gray-400 mb-8">Order: <span className="text-white font-bold">{product.name}</span> — Total: <span className="text-cyan-400 font-bold">${product.price.toFixed(2)}</span></p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: INTERACTIVE BUTTONS */}
          <div className="space-y-3">
            {methods.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMethod(m.id)}
                className={`w-full p-4 rounded-xl border transition text-left flex items-center justify-between ${
                  selectedMethod === m.id 
                    ? 'border-cyan-500 bg-[#0F172A] shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                    : 'border-slate-700 bg-[#0F172A]/50 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{m.flag}</span>
                  <div>
                    <div className="font-bold text-sm">{m.name}</div>
                    <div className={`text-[10px] uppercase tracking-wider font-bold ${m.color}`}>{m.sub}</div>
                  </div>
                </div>
                {selectedMethod === m.id && <span className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center text-xs text-white">✓</span>}
              </button>
            ))}
          </div>

          {/* RIGHT: TWO EXPLICIT PANELS */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            
            {/* PANEL 1: PAYMENT STEPS GUIDE */}
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-lg">
              <h3 className="text-lg font-bold mb-4 text-cyan-400 border-b border-slate-800 pb-3">📋 Payment Steps</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-900/40 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-sm">01</div>
                  <div><h4 className="font-bold text-sm">Choose Product</h4><p className="text-xs text-gray-400">You selected: {product.name}</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-900/40 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-sm">02</div>
                  <div><h4 className="font-bold text-sm">Select Method</h4><p className="text-xs text-gray-400">{methods.find(m => m.id === selectedMethod)?.name}</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-900/40 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-sm">03</div>
                  <div><h4 className="font-bold text-sm">Complete Payment</h4><p className="text-xs text-gray-400">Use details below or follow provider flow.</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-900/40 border border-green-500/40 flex items-center justify-center text-green-400 font-bold text-sm">04</div>
                  <div><h4 className="font-bold text-sm">Instant Delivery</h4><p className="text-xs text-gray-400">Receive access immediately via email.</p></div>
                </div>
              </div>
            </div>

            {/* PANEL 2: PAYMENT DETAILS (DYNAMIC) */}
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              
              <div className="relative z-10">
                {selectedMethod === 'capitec' && (
                  <>
                    <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-2xl border border-slate-700">🇿</div>
                        <div><h2 className="text-xl font-bold">Capitec Bank Transfer</h2><p className="text-slate-400 text-sm">South Africa • Direct EFT</p></div>
                      </div>
                      <span className="px-2 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold">✓ Verified</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <span className="text-gray-500 text-[10px] uppercase block">Holder</span>
                        <span className="font-bold">SUPER DIGITAL</span>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <span className="text-gray-500 text-[10px] uppercase block">Account</span>
                        <span className="font-bold font-mono">1975933441</span>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <span className="text-gray-500 text-[10px] uppercase block">SWIFT</span>
                        <span className="font-bold">CABLZAJJ</span>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <span className="text-gray-500 text-[10px] uppercase block">Branch</span>
                        <span className="font-bold">470010</span>
                      </div>
                    </div>
                    <div className="bg-blue-900/20 border border-blue-800 p-3 rounded-lg mb-5">
                      <p className="text-xs text-blue-200">Transfer exact amount. Email proof to <a href="mailto:payments@superdigital.store" className="underline">payments@superdigital.store</a> with Order ID.</p>
                    </div>
                    <button onClick={handleCapitecConfirm} disabled={processing} className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition flex items-center justify-center gap-2">
                      {processing ? 'Processing...' : 'Pay with Capitec Bank Transfer'}
                    </button>
                  </>
                )}

                {selectedMethod === 'peach' && (
                  <>
                    <div className="flex items-center gap-3 mb-5"><span className="text-2xl">💳</span><div><h2 className="text-xl font-bold">Credit / Debit Card</h2><p className="text-slate-400 text-sm">Powered by Peach Payments</p></div></div>
                    <button onClick={handlePeachPay} disabled={processing} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold transition">
                      {processing ? 'Processing...' : `Pay $${product.price.toFixed(2)} Securely`}
                    </button>
                  </>
                )}

                {!['capitec', 'peach'].includes(selectedMethod) && (
                  <>
                    <div className="flex items-center gap-3 mb-5"><span className="text-2xl">{methods.find(m => m.id === selectedMethod)?.flag}</span><div><h2 className="text-xl font-bold capitalize">{selectedMethod}</h2><p className="text-slate-400 text-sm">International Payment</p></div></div>
                    <button onClick={() => handleExternal(selectedMethod)} className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold transition">
                      Proceed to {selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1)}
                    </button>
                  </>
                )}
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
    <Suspense fallback={<div className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center">Loading...</div>}>
      <CheckoutInner />
    </Suspense>
  );
}
