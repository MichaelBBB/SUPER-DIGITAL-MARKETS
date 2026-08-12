'use client';
import { useState } from 'react';

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  
  // Product Details (Dynamic based on what user selected)
  const product = { name: 'Asana Premium', price: 10.99, currency: 'USD', id: 'ORD-123' };

  const handleAutomatedPay = async () => {
    setLoading(true);
    try {
      // 1. Call our backend to get Peach Checkout URL
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: product.price,
          currency: product.currency,
          productName: product.name,
          orderId: product.id
        })
      });

      const data = await res.json();

      if (data.checkoutUrl) {
        // 2. Redirect User to Secure Peach Page (Steps 3 & 4 Automated)
        window.location.href = `https://checkout.peachpayments.com/v1/${data.checkoutUrl}`;
      } else {
        alert('Error starting payment. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert('System error. Please contact support.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6">How to Pay</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* ✅ NEW AUTOMATED OPTION */}
        <div className="bg-green-900/20 border border-green-500 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-green-400 mb-2 flex items-center">
            ⚡ Option 1: Instant Pay (Recommended)
          </h3>
          <p className="text-gray-300 mb-4 text-sm">
            Pay securely via Card or Instant EFT. Funds go directly to Capitec. 
            No screenshots needed. Product delivered instantly.
          </p>
          
          <div className="text-3xl font-bold text-white mb-6">
            ${product.price} USD
          </div>

          <button 
            onClick={handleAutomatedPay}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-6 rounded-lg transition-all flex justify-center items-center gap-2"
          >
            {loading ? 'Processing...' : ' Pay Now & Get Instant Access'}
          </button>
          <p className="text-xs text-center mt-2 text-gray-400">Secured by Peach Payments</p>
        </div>

        {/* 🔄 OLD MANUAL OPTION (Keep as backup or hide) */}
        <div className="bg-gray-800 p-6 rounded-lg opacity-75">
          <h3 className="text-xl font-bold text-gray-400 mb-2">Option 2: Manual Transfer</h3>
          <p className="text-sm text-gray-400 mb-4">
            Only use this if card payment fails. Requires manual verification.
          </p>
          <div className="bg-black p-4 rounded text-sm font-mono text-blue-300">
            Bank: Capitec<br/>
            Acc: 197593441<br/>
            Ref: {product.id}
          </div>
          <button className="mt-4 w-full border border-gray-600 text-gray-300 py-2 rounded hover:bg-gray-700">
            Copy Details
          </button>
        </div>

      </div>
    </div>
  );
}
