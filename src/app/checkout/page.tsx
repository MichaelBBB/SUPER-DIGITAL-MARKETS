'use client';

import { useState } from 'react';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // CONFIGURATION: Set your default amount and currency here
  const ORDER_AMOUNT = "150.00"; 
  const CURRENCY = "ZAR";
  const ORDER_ID = `ORDER-${Math.floor(Math.random() * 10000)}`;

  const handleInstantPayment = async () => {
    setLoading(true);
    setError('');

    try {
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

      if (data.success) {
        // Redirect to Peach Payments
        window.location.href = data.checkoutUrl;
      } else {
        setError('Payment initialization failed: ' + data.error);
        setLoading(false);
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        
        <div className="bg-blue-600 p-6 text-center">
          <h1 className="text-2xl font-bold">Secure Checkout</h1>
          <p className="text-blue-100 text-sm mt-1">Super Digital Marketplace</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-700 pb-4">
            <span className="text-gray-400">Order ID</span>
            <span className="font-mono text-sm">{ORDER_ID}</span>
          </div>
          
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total to Pay</span>
            <span>{CURRENCY} {ORDER_AMOUNT}</span>
          </div>

          {error && (
            <div className="bg-red-900/50 text-red-200 p-3 rounded text-sm border border-red-800">
              {error}
            </div>
          )}

          <button
            onClick={handleInstantPayment}
            disabled={loading}
            className={`w-full py-4 rounded-lg font-bold text-lg shadow-lg transition-all transform hover:scale-[1.02]
              ${loading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white'
              }`}
          >
            {loading ? 'Processing...' : 'Pay Now with Card'}
          </button>

          <p className="text-xs text-center text-gray-500 mt-4">
            Secured by Peach Payments. You will be redirected to a secure page.
          </p>
        </div>
      </div>
    </div>
  );
}
