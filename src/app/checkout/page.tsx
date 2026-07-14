'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Product Data
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
  
  // Get product ID from URL. If missing, default to 1 (ChatGPT) ONLY as a last resort.
  const productIdParam = searchParams.get('product');
  const productId = productIdParam ? Number(productIdParam) : 1;
  const product = products.find(p => p.id === productId);

  // If product is truly not found in our list, show error
  if (!product) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link href="/products" className="text-cyan-400 hover:underline">Back to Products</Link>
        </div>
      </div>
    );
  }

  const [processing, setProcessing] = useState(false);

  const handleCapitecConfirmation = async () => {
    setProcessing(true);
    try {
      const customerEmail = prompt('Please enter your email for instant delivery after approval:');
      if (!customerEmail) { alert('Email is required for delivery.'); return; }
      
      const res = await fetch('/api/payment/capitec', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ amount: product.price, orderId: `SD-${product.id}`, productName: product.name, customerEmail }) 
      });
      const data = await res.json();
      alert(data.success ? '✅ Payment recorded! Admin will verify & deliver instantly.' : `❌ Error: ${data.error}`);
    } catch (e) { alert('Failed to connect to server.'); }
    finally { setProcessing(false); }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white py-12 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <Link href="/products" className="text-cyan-400 hover:text-white mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition">
          &larr; Back to Products
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Secure Checkout</h1>

        {/* TWO COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDEBAR: Payment Options */}
          <div className="space-y-3">
            {/* Razorpay */}
            <div className="p-4 rounded-xl border border-slate-700 bg-[#0F172A] opacity-60 flex items-center justify-between cursor-pointer hover:border-slate-500 transition">
              <div className="flex items-center gap-3">
                <span className="text-xl">🇮🇳</span>
                <div>
                  <div className="font-bold text-sm">Razorpay</div>
                  <div className="text-[10px] text-blue-400 uppercase tracking-wider">India Primary</div>
                </div>
              </div>
              <span className="text-gray-500 text-xs">India</span>
            </div>
            
            {/* Alipay */}
            <div className="p-4 rounded-xl border border-slate-700 bg-[#0F172A] opacity-60 flex items-center justify-between cursor-pointer hover:border-slate-500 transition">
              <div className="flex items-center gap-3">
                <span className="text-xl">🇨</span>
                <div>
                  <div className="font-bold text-sm">Alipay</div>
                  <div className="text-[10px] text-blue-400 uppercase tracking-wider">China Primary</div>
                </div>
              </div>
              <span className="text-gray-500 text-xs">China</span>
            </div>

            {/* Payoneer */}
            <div className="p-4 rounded-xl border border-slate-700 bg-[#0F172A] opacity-60 flex items-center justify-between cursor-pointer hover:border-slate-500 transition">
              <div className="flex items-center gap-3">
                <span className="text-xl">🇺</span>
                <div>
                  <div className="font-bold text-sm">Payoneer</div>
                  <div className="text-[10px] text-orange-400 uppercase tracking-wider">USA Primary</div>
                </div>
              </div>
              <span className="text-gray-500 text-xs">USA</span>
            </div>

            {/* Google Pay */}
            <div className="p-4 rounded-xl border border-slate-700 bg-[#0F172A] opacity-60 flex items-center justify-between cursor-pointer hover:border-slate-500 transition">
              <div className="flex items-center gap-3">
                <span className="text-xl">🌍</span>
                <div>
                  <div className="font-bold text-sm">Google Pay</div>
                  <div className="text-[10px] text-blue-400 uppercase tracking-wider">Global</div>
                </div>
              </div>
              <span className="text-gray-500 text-xs">Global</span>
            </div>

             {/* Peach */}
             <div className="p-4 rounded-xl border border-slate-700 bg-[#0F172A] opacity-60 flex items-center justify-between cursor-pointer hover:border-slate-500 transition">
              <div className="flex items-center gap-3">
                <span className="text-xl">🇿</span>
                <div>
                  <div className="font-bold text-sm">Peach Payments</div>
                  <div className="text-[10px] text-orange-400 uppercase tracking-wider">SA Primary</div>
                </div>
              </div>
              <span className="text-gray-500 text-xs">South Africa</span>
            </div>

            {/* Capitec - SELECTED */}
            <div className="p-4 rounded-xl border-2 border-cyan-500 bg-[#0F172A] flex items-center justify-between shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              <div className="flex items-center gap-3">
                <span className="text-xl">🇿</span>
                <div>
                  <div className="font-bold text-sm text-white">Capitec Bank Transfer</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">Manual</div>
                </div>
              </div>
              <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center text-xs text-white">✓</div>
            </div>
          </div>

          {/* RIGHT SIDE: TWO SEPARATE PANELS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* PANEL 1: PAYMENT STEPS GUIDE */}
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800">
              <h3 className="text-lg font-bold mb-4 text-cyan-400">Payment Steps</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-900/30 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 text-cyan-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">01 Choose Your Product</h4>
                    <p className="text-xs text-gray-400 mt-1">Browse all 30 digital products and click "Buy Now" on your selection.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-900/30 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 text-cyan-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">02 Select Payment Method</h4>
                    <p className="text-xs text-gray-400 mt-1">Choose from Razorpay (India), Alipay (China), Payoneer (USA), Google Pay, Peach Payments, or direct bank transfer.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-900/30 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 text-cyan-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">03 Complete Payment</h4>
                    <p className="text-xs text-gray-400 mt-1">Follow the secure checkout flow. For bank transfers, use the Capitec details below and email your proof of payment.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-900/30 border border-green-500/30 flex items-center justify-center flex-shrink-0 text-green-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">04 Instant Delivery</h4>
                    <p className="text-xs text-gray-400 mt-1">Your digital product is delivered immediately to your email after payment confirmation.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* PANEL 2: CAPITEC BANK DETAILS */}
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
               {/* Background Glow Effect */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-2xl border border-slate-700">🇿</div>
                    <div>
                      <h2 className="text-xl font-bold">Capitec Bank</h2>
                      <p className="text-slate-400 text-sm">South Africa • Savings Account</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    Verified
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-gray-500 text-xs block">ACCOUNT HOLDER</span>
                    <div className="flex items-center justify-between">
                      <span className="font-bold">SUPER DIGITAL</span>
                      <button onClick={() => navigator.clipboard.writeText('SUPER DIGITAL')} className="text-gray-500 hover:text-white">📋</button>
                    </div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-gray-500 text-xs block">ACCOUNT NUMBER</span>
                    <div className="flex items-center justify-between">
                      <span className="font-bold font-mono">1975933441</span>
                      <button onClick={() => navigator.clipboard.writeText('1975933441')} className="text-gray-500 hover:text-white">📋</button>
                    </div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-gray-500 text-xs block">SWIFT CODE</span>
                    <div className="flex items-center justify-between">
                      <span className="font-bold">CABLZAJJ</span>
                      <button onClick={() => navigator.clipboard.writeText('CABLZAJJ')} className="text-gray-500 hover:text-white">📋</button>
                    </div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-gray-500 text-xs block">BRANCH CODE</span>
                    <div className="flex items-center justify-between">
                      <span className="font-bold">470010</span>
                      <button onClick={() => navigator.clipboard.writeText('470010')} className="text-gray-500 hover:text-white">📋</button>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-800 p-4 rounded-xl mb-6">
                  <p className="text-xs text-blue-200 leading-relaxed">
                    <strong className="text-blue-100">After payment:</strong> Email your proof of payment to <a href="mailto:payments@superdigital.store" className="underline hover:text-blue-100">payments@superdigital.store</a> with your order number. Products are delivered within 2 hours of payment confirmation. Reference your order number in the payment description.
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
            </div>

            {/* ALL ACCEPTED METHODS BAR */}
            <div className="bg-[#0F172A] p-4 rounded-2xl border border-slate-800">
               <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 text-center">All Accepted Payment Methods</h3>
               <div className="flex flex-wrap justify-center gap-3">
                 <div className="px-3 py-1 bg-slate-800 rounded-full text-xs border border-slate-700">Razorpay 🇮🇳</div>
                 <div className="px-3 py-1 bg-slate-800 rounded-full text-xs border border-slate-700">Alipay 🇨</div>
                 <div className="px-3 py-1 bg-slate-800 rounded-full text-xs border border-slate-700">Payoneer 🇺🇸</div>
                 <div className="px-3 py-1 bg-slate-800 rounded-full text-xs border border-slate-700">Google Pay 🌍</div>
                 <div className="px-3 py-1 bg-slate-800 rounded-full text-xs border border-slate-700">Peach Payments 🇿🇦</div>
                 <div className="px-3 py-1 bg-slate-800 rounded-full text-xs border border-slate-700">Capitec EFT 🇿</div>
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
