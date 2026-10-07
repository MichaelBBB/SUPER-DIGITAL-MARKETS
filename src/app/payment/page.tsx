'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function PaymentInner() {
  const params = useSearchParams();
  const urlItem = (params.get('item') || '').trim();
  const rawAmount = Number(params.get('amount') || 0);

  // Clean dummy values
  const itemName = ['', 'digital product', 'test product'].includes(urlItem.toLowerCase()) ? 'Digital Product' : urlItem;
  const amount = rawAmount > 0 && rawAmount !== 10.99 ? rawAmount : 0;

  // State to toggle between Card Form and EFT Info
  const [view, setView] = useState<'card' | 'eft'>('card');

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="max-w-md mx-auto space-y-6 pt-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold">SUPER DIGITAL Marketplace</h1>
          <p className="text-xs text-gray-600 mt-1">Secure Checkout vFinal</p>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Product:</span>
            <span className="font-semibold text-right">{itemName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Total Due:</span>
            <span className="font-bold text-green-400 text-2xl">${amount} USD</span>
          </div>
        </div>

        {/* Toggle Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setView('card')}
            className={`py-3 px-4 rounded-lg font-bold transition-all ${
              view === 'card' 
                ? 'bg-blue-600 text-white shadow-lg scale-105' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            💳 Pay By Card
          </button>
          <button
            onClick={() => setView('eft')}
            className={`py-3 px-4 rounded-lg font-bold transition-all ${
              view === 'eft' 
                ? 'bg-green-600 text-white shadow-lg scale-105' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            🏦 Capitec EFT
          </button>
        </div>

        {/* VIEW 1: MANUAL CARD FORM (Matches Screenshots 3, 4, 5) */}
        {view === 'card' && (
          <form className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4 animate-fadeIn">
            <div className="text-center mb-4">
               <p className="text-sm text-gray-400">Enter card details below to complete payment.</p>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Card Holder Name</label>
              <input type="text" required placeholder="John Doe" className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Card Number</label>
              <div className="relative">
                <input type="text" required placeholder="0000 0000 0000 0000" maxLength={19} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none pr-10" />
                <div className="absolute right-3 top-3 flex gap-1">
                   <div className="w-6 h-4 bg-red-600 rounded-sm opacity-80"></div>
                   <div className="w-6 h-4 bg-orange-500 rounded-sm opacity-80 -ml-3"></div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">CVV</label>
                <input type="password" required placeholder="123" maxLength={4} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Expiry Date</label>
                <input type="text" required placeholder="MM / YY" maxLength={7} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" />
              </div>
            </div>
            
            <hr className="border-gray-800 my-4" />
            
            <div className="space-y-3">
              <p className="text-sm font-bold text-white">Billing Address</p>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Country</label>
                <select className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white text-sm">
                  <option>South Africa</option>
                  <option>United States</option>
                  <option>India</option>
                  <option>China</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">City</label>
                <input type="text" required placeholder="Cape Town" className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Postal Code</label>
                <input type="text" required placeholder="8001" className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Street Address</label>
                <input type="text" required placeholder="123 Main Road" className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Email Address</label>
                <input type="email" required placeholder="buyer@email.com" className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white text-sm" />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-xl shadow-lg transition-all transform hover:scale-105 mt-4"
            >
              Pay now
            </button>
            
            <p className="text-xs text-gray-500 text-center pt-2 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              Secured by Peach Payments 🔒
            </p>
          </form>
        )}

        {/* VIEW 2: CAPITec EFT INFO (Matches Screenshots 1 & 2) */}
        {view === 'eft' && (
          <div className="bg-gray-900 border border-green-800 rounded-xl p-6 space-y-4 animate-fadeIn">
             <div className="text-center">
                <h2 className="font-bold text-lg text-green-400 mb-2">🇿 Capitec Instant EFT</h2>
                <p className="text-xs text-gray-400">Transfer directly to our account using the details below.</p>
             </div>
             
             <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-gray-800 pb-2">
                   <span className="text-gray-400">Bank:</span>
                   <span className="font-bold text-white">Capitec</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                   <span className="text-gray-400">Account No:</span>
                   <span className="font-mono text-white">1975933441</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                   <span className="text-gray-400">Branch Code:</span>
                   <span className="font-mono text-white">470010</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                   <span className="text-gray-400">SWIFT/BIC:</span>
                   <span className="font-mono text-white">CABLZAJJ</span>
                </div>
                <div className="flex justify-between pt-2">
                   <span className="text-gray-400">Reference:</span>
                   <span className="font-mono text-cyan-400 font-bold">ORD-{Math.floor(Math.random() * 900000 + 100000)}</span>
                </div>
             </div>

             <div className="bg-black/50 rounded-lg p-4 text-xs text-gray-300 space-y-2">
                <p className="font-bold text-white">What happens next:</p>
                <p>1. Pay the exact total (${amount}) from your banking app using the reference above.</p>
                <p>2. Email proof of payment to <b className="text-white">payments@superdigital.store</b>.</p>
                <p>3. Your product is delivered instantly after verification.</p>
             </div>
          </div>
        )}

        <Link href="/" className="block text-center text-gray-500 hover:text-white text-sm mt-4">
          ← Cancel and Return to Home
        </Link>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <PaymentInner />
    </Suspense>
  );
}
