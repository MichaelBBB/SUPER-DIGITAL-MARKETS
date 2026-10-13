'use client';

import { useState } from 'react';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // CONFIGURATION: Set your default amount and currency here
  // (You can make this dynamic later based on the user's cart)
  const ORDER_AMOUNT = "150.00"; 
  const CURRENCY = "ZAR";
  const ORDER_ID = `ORDER-${Math.floor(Math.random() * 100000)}`;

  const handleInstantPayment = async () => {
    setLoading(true);
    setError('');

    try {
      // 1. Call our backend API to create a secure Peach session
      const response = await fetch('/api/peach/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: ORDER_AMOUNT,
          currency: CURRENCY,
          orderId: ORDER_ID,
        }),
      });

      const data = await response.json();

      // 2. If successful, redirect the user to the Peach Payments Hosted Page
      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setError('Payment initialization failed: ' + (data.error || 'Unknown error'));
        setLoading(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        
        {/* Header */}
        <div className="bg-blue-600 p-6 text-center">
          <h1 className="text-2xl font-bold">Secure Checkout</h1>
          <p className="text-blue-100 text-sm mt-1">Super Digital Marketplace</p>
        </div>

        {/* Order Summary */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-700 pb-4">
            <span className="text-gray-400">Order ID</span>
            <span className="font-mono text-sm text-gray-300">{ORDER_ID}</span>
          </div>
          
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total to Pay</span>
            <span className="text-green-400">{CURRENCY} {ORDER_AMOUNT}</span>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="bg-red-900/50 text-red-200 p-3 rounded text-sm border border-red-800 flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {error}
            </div>
          )}

          {/* Instant Payment Button */}
          <button
            onClick={handleInstantPayment}
            disabled={loading}
            className={`w-full py-4 rounded-lg font-bold text-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]
              ${loading 
                ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white'
              }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Pay Now with Card'
            )}
          </button>

          <p className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            Secured by Peach Payments. You will be redirected to a secure page.
          </p>
        </div>
      </div>
    </div>
  );
}
