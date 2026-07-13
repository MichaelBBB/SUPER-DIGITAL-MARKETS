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
          
          {/* LEFT SIDEBAR: Payment Options (Matches Screenshot) */}
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
                <span className="text-xl">🇺🇸</span>
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

          {/* RIGHT PANEL: THE PAYMENT PANEL (Matches Screenshot) */}
          <div className="lg:col-span-2">
            <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden h-full flex flex-col">
              
              {/* Header Section */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">🇿🇦</span>
                  <div>
                    <h2 className="text-2xl font-bold">Capitec Bank Transfer</h2>
                    <p className="text-slate-400 text-sm">South Africa Market</p>
                  </div>
                </div>
                <div className="p-2 rounded-full bg-slate-800 border border-slate-700">
                   <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
              </div>

              <p className="text-gray-400 mb-8">Direct bank transfer to our Capitec account.</p>

              {/* Currencies Section */}
              <div className="mb-8">
                <span className="text-xs text-gray-500 uppercase font-bold mb-2 block">Currencies</span>
                <div className="text-cyan-400 font-bold text-xl">ZAR</div>
              </div>

              {/* Accepted Methods Section */}
              <div className="mb-10">
                <span className="text-xs text-gray-500 uppercase font-bold mb-3 block">Accepted Methods</span>
                <div className="flex flex-wrap gap-3">
                  <div className="px-4 py-2 bg-slate-800 rounded-full text-sm flex items-center gap-2 border border-slate-700">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    EFT
                  </div>
                  <div className="px-4 py-2 bg-slate-800 rounded-full text-sm flex items-center gap-2 border border-slate-700">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Internet Banking
                  </div>
                  <div className="px-4 py-2 bg-slate-800 rounded-full text-sm flex items-center gap-2 border border-slate-700">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Capitec App
                  </div>
                </div>
              </div>

              {/* Push Button to Bottom */}
              <div className="mt-auto">
                <button 
                  onClick={handleCapitecConfirmation}
                  disabled={processing}
                  className="w-full py-4 bg-blue-900 hover:bg-blue-800 rounded-2xl font-bold text-lg transition shadow-lg shadow-blue-900/20 flex items-center justify-center gap-3 border border-blue-800"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  {processing ? 'Processing...' : 'Pay with Capitec Bank Transfer'}
                </button>
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
    <Suspense fallback={<div className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center">Loading Checkout...</div>}>
      <CheckoutInner />
    </Suspense>
  );
}
