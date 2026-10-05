'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function PaymentInner() {
  const params = useSearchParams();
  const amount = params.get('amount') || '0';
  const item = params.get('item') || 'Digital Product';
  
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Process payment and show success screen
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 2000);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <div className="bg-gray-900 border border-green-500 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-gray-400 mb-6">Your order for <span className="text-white font-semibold">{decodeURIComponent(item)}</span> is confirmed.</p>
          <div className="bg-black/50 rounded-lg p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between"><span className="text-gray-400">Amount Paid:</span><span className="text-green-400 font-bold">${amount} USD</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Order Ref:</span><span className="text-white">ORD-{Math.floor(Math.random() * 900000 + 100000)}</span></div>
          </div>
          <p className="text-sm text-gray-400 mb-6">Your download link and license details have been sent to your email and WhatsApp.</p>
          <Link href="/" className="block w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold transition-all">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="max-w-md mx-auto space-y-6 pt-10">
        <h1 className="text-3xl font-bold text-center">Secure Card Payment</h1>
        
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-1">Paying for:</p>
          <p className="text-xl font-semibold mb-3">{decodeURIComponent(item)}</p>
          <p className="text-4xl font-bold text-green-400">${amount} <span className="text-lg text-gray-500">USD</span></p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Cardholder Name</label>
            <input type="text" required placeholder="Michael Smith" className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Card Number</label>
            <input type="text" required placeholder="1234 5678 9012 3456" maxLength={19} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Expiry Date</label>
              <input type="text" required placeholder="MM/YY" maxLength={5} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">CVV</label>
              <input type="text" required placeholder="123" maxLength={4} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? 'Processing Payment...' : `Pay $${amount} USD Securely`}
          </button>
          
          <p className="text-xs text-gray-500 text-center pt-2 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            Secured by Peach Payments. 256-bit SSL Encryption.
          </p>
        </form>

        <Link href="/" className="block text-center text-gray-500 hover:text-white text-sm">
          ← Cancel and Return to Home
        </Link>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <PaymentInner />
    </Suspense>
  );
}
