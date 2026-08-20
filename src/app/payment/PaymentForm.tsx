// src/app/payment/PaymentForm.tsx
'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentForm() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const amount = parseFloat(searchParams.get('amount') || '0');
  const itemName = searchParams.get('item') || 'Digital Product';
  const orderId = `ORD-${Date.now()}`;

  const handlePeachPayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,
          currency: 'USD',
          productName: itemName,
          orderId: orderId
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error("Peach Error:", error);
      alert(`Payment error: ${error.message}\n\nPlease try again or contact support.`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950 text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-800">
        
        <a href="/products" className="text-blue-400 hover:text-blue-300 mb-6 inline-block flex items-center gap-1">
          ← Return to Products
        </a>
        
        <h1 className="text-3xl font-bold mb-2 text-center">Secure Checkout</h1>
        <p className="text-gray-400 text-center mb-8">Powered by Peach Payments</p>

        {/* Order Summary */}
        <div className="bg-gray-950/50 rounded-xl p-6 mb-8 border border-gray-800">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-800">
            <span className="text-gray-400">Product</span>
            <span className="font-semibold text-white">{itemName}</span>
          </div>
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-800">
            <span className="text-gray-400">Order ID</span>
            <span className="font-mono text-cyan-400 text-sm">{orderId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Total Amount</span>
            <span className="text-3xl font-extrabold text-green-400">
              ${amount.toFixed(2)} <span className="text-sm text-gray-500">USD</span>
            </span>
          </div>
        </div>

        {/* Peach Payments Button - PRIMARY ACTION */}
        <button
          onClick={handlePeachPayment}
          disabled={loading}
          className={`w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex justify-center items-center gap-3 shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Pay Securely with Peach Payments
            </>
          )}
        </button>

        {/* Trust Badges */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Instant Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>24/7 Support</span>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-8">
          🔒 Secured by Peach Payments • Instant automated delivery • Funds settle to Capitec
        </p>
      </div>
    </div>
  );
}
