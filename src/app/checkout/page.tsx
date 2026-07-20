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
  const [selectedMethod, setSelectedMethod] = useState('peach');
  const [processing, setProcessing] = useState(false);

  const methods = [
    { id: 'razorpay', name: 'Razorpay', sub: 'INDIA PRIMARY', flag: '🇳' },
    { id: 'alipay', name: 'Alipay', sub: 'CHINA PRIMARY', flag: '' },
    { id: 'payoneer', name: 'Payoneer', sub: 'USA PRIMARY', flag: '🇺' },
    { id: 'googlepay', name: 'Google Pay', sub: 'GLOBAL', flag: '🌍' },
    { id: 'peach', name: 'Peach Payments', sub: 'SA PRIMARY', flag: '🇿' },
    { id: 'capitec', name: 'Capitec Bank Transfer', sub: 'MANUAL', flag: '' },
  ];

  const handlePeachPayment = () => {
    setProcessing(true);
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/api/peach-payment';
    
    const i1 = document.createElement('input'); i1.type='hidden'; i1.name='amount'; i1.value=product.price.toString();
    const i2 = document.createElement('input'); i2.type='hidden'; i2.name='orderId'; i2.value=`SD-${product.id}`;
    const i3 = document.createElement('input'); i3.type='hidden'; i3.name='productName'; i3.value=product.name;
    
    form.appendChild(i1);
    form.appendChild(i2);
    form.appendChild(i3);
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white py-12 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <Link href="/products" className="text-cyan-400 hover:text-white mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest">← Back to Products</Link>
        <h1 className="text-4xl font-bold mb-2">Secure Checkout</h1>
        <p className="text-gray-400 mb-8">Order: <span className="text-white font-bold">{product.name}</span> — Total: <span className="text-cyan-400 font-bold">${product.price.toFixed(2)}</span></p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-3">
            {methods.map((m) => (
              <button key={m.id} onClick={() => setSelectedMethod(m.id)} className={`w-full p-4 rounded-xl border transition text-left flex items-center justify-between ${selectedMethod === m.id ? 'border-cyan-500 bg-[#0F172A] shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'border-slate-700 bg-[#0F172A]/50 hover:border-slate-600'}`}>
                <div className="flex items-center gap-3"><span className="text-xl">{m.flag}</span><div><div className="font-bold text-sm">{m.name}</div><div className={`text-[10px] uppercase tracking-wider font-bold ${m.id === 'peach' || m.id === 'capitec' ? 'text-orange-400' : 'text-blue-400'}`}>{m.sub}</div></div></div>
                {selectedMethod === m.id && <span className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center text-xs text-white">✓</span>}
              </button>
            ))}
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* PANEL 1: STEPS */}
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800">
              <h3 className="text-lg font-bold mb-4 text-cyan-400">📋 Payment Steps</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3"><div className="w-8 h-8 rounded-full bg-cyan-900/30 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">01</div><div><h4 className="font-bold text-sm">Choose Product</h4><p className="text-xs text-gray-400">You selected: {product.name}</p></div></div>
                <div className="flex items-start gap-3"><div className="w-8 h-8 rounded-full bg-cyan-900/30 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">02</div><div><h4 className="font-bold text-sm">Select Method</h4><p className="text-xs text-gray-400">{methods.find(m => m.id === selectedMethod)?.name}</p></div></div>
                <div className="flex items-start gap-3"><div className="w-8 h-8 rounded-full bg-cyan-900/30 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">03</div><div><h4 className="font-bold text-sm">Complete Payment</h4><p className="text-xs text-gray-400">Click the blue button below.</p></div></div>
                <div className="flex items-start gap-3"><div className="w-8 h-8 rounded-full bg-green-900/30 border border-green-500/30 flex items-center justify-center text-green-400 font-bold text-sm">04</div><div><h4 className="font-bold text-sm">Instant Delivery</h4><p className="text-xs text-gray-400">Receive access immediately via email.</p></div></div>
              </div>
            </div>

            {/* PANEL 2: PAYMENT DETAILS */}
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              <div className="relative z-10">
                {selectedMethod === 'peach' && (
                  <>
                    <div className="flex items-center gap-3 mb-6"><span className="text-2xl">💳</span><div><h2 className="text-xl font-bold">Credit / Debit Card / Instant EFT</h2><p className="text-slate-400 text-sm">Powered by Peach Payments</p></div></div>
                    <p className="text-gray-400 mb-6 text-lg font-medium text-center">SECURE PAYMENT. INSTANT DELIVERY.</p>
                    <button onClick={handlePeachPayment} disabled={processing} className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold text-lg transition shadow-lg shadow-cyan-900/20">
                      {processing ? 'Redirecting...' : `Pay $${product.price.toFixed(2)} Securely`}
                    </button>
                    <p className="text-xs text-gray-500 mt-3 text-center">⚠️ Testing: Use Card `4111 1111 1111 1111` | Any future expiry | CVV `123`</p>
                  </>
                )}
                {selectedMethod === 'capitec' && (
                  <>
                    <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-2xl border border-slate-700"></div><div><h2 className="text-xl font-bold">Capitec Bank Transfer</h2><p className="text-slate-400 text-sm">Direct EFT</p></div></div><span className="px-2 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold">✓ Verified</span></div>
                    <div className="grid grid-cols-2 gap-3 mb-5"><div className="bg-slate-900 p-3 rounded-lg border border-slate-800"><span className="text-gray-500 text-[10px] block">HOLDER</span><span className="font-bold">SUPER DIGITAL</span></div><div className="bg-slate-900 p-3 rounded-lg border border-slate-800"><span className="text-gray-500 text-[10px] block">ACCOUNT</span><span className="font-bold font-mono">1975933441</span></div><div className="bg-slate-900 p-3 rounded-lg border border-slate-800"><span className="text-gray-500 text-[10px] block">SWIFT</span><span className="font-bold">CABLZAJJ</span></div><div className="bg-slate-900 p-3 rounded-lg border border-slate-800"><span className="text-gray-500 text-[10px] block">BRANCH</span><span className="font-bold">470010</span></div></div>
                    <div className="bg-blue-900/20 border border-blue-800 p-3 rounded-lg mb-5"><p className="text-xs text-blue-200">Transfer exact amount. Email proof to <a href="mailto:payments@superdigital.store" className="underline">payments@superdigital.store</a> with Order ID.</p></div>
                    <button disabled className="w-full py-4 bg-slate-700 rounded-xl font-bold text-lg cursor-not-allowed opacity-70">Manual Transfer Only</button>
                  </>
                )}
                {!['peach', 'capitec'].includes(selectedMethod) && (
                  <>
                    <div className="flex items-center gap-3 mb-6"><span className="text-2xl">{methods.find(m => m.id === selectedMethod)?.flag}</span><div><h2 className="text-xl font-bold capitalize">{selectedMethod}</h2><p className="text-slate-400 text-sm">International Payment</p></div></div>
                    <p className="text-gray-400 mb-6">Coming soon. Select Peach or Capitec for instant processing.</p>
                    <button disabled className="w-full py-4 bg-slate-700 rounded-xl font-bold text-lg cursor-not-allowed opacity-70">Unavailable</button>
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
  return (<Suspense fallback={<div className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center">Loading...</div>}><CheckoutInner /></Suspense>);
}
