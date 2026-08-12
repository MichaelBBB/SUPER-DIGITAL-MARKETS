'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  
  // ✅ This captures the price and item from the URL exactly like your old panel did
  const amount = parseFloat(searchParams.get('amount') || '0');
  const itemName = searchParams.get('item') || 'Digital Product';
  const orderId = `ORD-${Date.now()}`; // Generate unique order ID

  const handlePayNow = async () => {
    setLoading(true);
    console.log(`🚀 Initiating payment for: ${itemName} ($${amount})`);

    try {
      // 1. Call our Backend API to create a Peach Session
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
        throw new Error(data.error || 'Failed to initialize payment');
      }

      if (data.checkoutUrl) {
        // 2. Redirect user to Secure Peach Payments Page
        window.location.href = `https://checkout.peachpayments.com/v1/${data.checkoutUrl}`;
      } else {
        throw new Error('No payment link generated');
      }

    } catch (error: any) {
      console.error("Payment Error:", error);
      alert(`Error: ${error.message}. Please try again or contact support.`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        
        {/* LEFT SIDE: Instructions */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-green-400">How to Pay</h2>
          
          {/* ✅ AUTOMATED OPTION (Replaces old WhatsApp button) */}
          <div className="bg-green-900/20 border border-green-500 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-bold text-green-400 mb-2 flex items-center gap-2">
              ⚡ Option 1: Instant Pay (Recommended)
            </h3>
            <p className="text-gray-300 mb-4 text-sm">
              Pay securely via Card or Instant EFT. Funds go directly to Capitec. 
              No screenshots needed. Product delivered instantly after payment.
            </p>
            
            <div className="text-4xl font-bold text-white mb-6">
              ${amount.toFixed(2)} USD
            </div>

            <button 
              onClick={handlePayNow}
              disabled={loading}
              className={`w-full font-bold py-4 px-6 rounded-lg transition-all flex justify-center items-center gap-2 ${
                loading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-500 hover:shadow-lg hover:scale-[1.02]'
              }`}
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  Pay Now & Get Instant Access
                </>
              )}
            </button>
            <p className="text-xs text-center mt-3 text-gray-400">Secured by Peach Payments</p>
          </div>

          {/* OLD MANUAL OPTION (Kept as backup) */}
          <div className="bg-gray-700/50 p-6 rounded-lg opacity-80">
            <h3 className="text-lg font-bold text-gray-400 mb-2">Option 2: Manual Transfer</h3>
            <p className="text-xs text-gray-400 mb-4">Only if card payment fails.</p>
            <div className="bg-black p-3 rounded text-xs font-mono text-blue-300 break-all">
              Bank: Capitec<br/>
              Acc: 197593441<br/>
              Ref: {orderId}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Order Summary */}
        <div className="flex flex-col justify-center">
          <div className="text-center mb-8">
            <h3 className="text-gray-400 uppercase tracking-wider text-sm mb-2">Total Amount</h3>
            <div className="text-5xl font-extrabold text-cyan-400">
              ${amount.toFixed(2)} <span className="text-2xl text-gray-500">USD</span>
            </div>
            <p className="text-gray-500 text-sm mt-2">(ZAR equivalent calculated at checkout)</p>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <h4 className="font-bold text-lg mb-4 text-white">Order Details</h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Product:</span>
                <span className="font-semibold text-white">{itemName}</span>
              </div>
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span className="font-mono text-cyan-400">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-yellow-400">Awaiting Payment</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
