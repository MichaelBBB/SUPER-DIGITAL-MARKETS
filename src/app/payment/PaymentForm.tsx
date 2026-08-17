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
  
  // Your WhatsApp number (replace with yours)
  const YOUR_WHATSAPP = '27821234567'; 

  const handleWhatsAppOrder = () => {
    const message = `🛒 *NEW ORDER*\n\nProduct: ${itemName}\nAmount: $${amount.toFixed(2)} USD\nOrder ID: ${orderId}\n\nPlease provide payment proof to complete.`;
    const url = `https://wa.me/${YOUR_WHATSAPP}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handlePeachPayment = async () => {
    setLoading(true);
    try {
      // ✅ Call the CORRECT API route we created
      const res = await fetch('/api/peach/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents (e.g., $54.99 → 5499)
          currency: 'ZAR', // Peach expects ZAR for SA accounts
          redirect_url: `${window.location.origin}/success`,
          webhooks: [`${window.location.origin}/api/webhook`]
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Payment creation failed');
      }
      
      // ✅ Redirect to Peach hosted checkout using the URL they return
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        throw new Error('No checkout URL received from Peach');
      }
    } catch (error: any) {
      console.error("Peach Payment Error:", error);
      alert(`Payment error: ${error.message}. Please try Manual Transfer instead.`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        
        <div>
          <a href="/products" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">← Return to Products</a>
          <h2 className="text-3xl font-bold mb-6 text-green-400">How to Pay</h2>
          
          {/* ✅ WORKING: Manual WhatsApp + Capitec Transfer */}
          <div className="bg-blue-900/20 border border-blue-500 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-bold text-blue-400 mb-2">⚡ Option 1: Manual Transfer (Working Now)</h3>
            <p className="text-gray-300 mb-4 text-sm">
              1. Click the WhatsApp button below.<br/>
              2. Send the pre-filled order message.<br/>
              3. Transfer ${amount.toFixed(2)} USD (or ZAR equivalent) to:<br/>
              <strong>Capitec Bank | Acc: 197593441 | Ref: {orderId}</strong><br/>
              4. Send proof of payment in the WhatsApp chat.<br/>
              5. Receive your product instantly after verification.
            </p>
            <button 
              onClick={handleWhatsAppOrder}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-6 rounded-lg transition-all flex justify-center items-center gap-2"
            >
              📱 Complete Order on WhatsApp
            </button>
            <p className="text-xs text-center mt-3 text-gray-400">Instant support via WhatsApp</p>
          </div>

          {/* ✅ Peach Payments - NOW ACTIVE */}
          <div className="bg-gray-800 p-6 rounded-lg border-2 border-blue-500">
            <h3 className="text-lg font-bold text-blue-400 mb-2">Option 2: Peach Payments ✅</h3>
            <p className="text-xs text-gray-300 mb-4">Automated card/EFT payments. Instant delivery!</p>
            <button 
              onClick={handlePeachPayment}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:transform-none"
            >
              {loading ? "Processing..." : "Pay Now - Instant Delivery"}
            </button>
            <p className="text-xs text-center mt-3 text-gray-400">🔒 Secure payment via Peach Payments</p>
          </div>
        </div>

        {/* RIGHT SIDE: Summary */}
        <div className="flex flex-col justify-center">
          <div className="text-center mb-8">
            <h3 className="text-gray-400 uppercase tracking-wider text-sm mb-2">Total Amount</h3>
            <div className="text-5xl font-extrabold text-cyan-400">
              ${amount.toFixed(2)} <span className="text-2xl text-gray-500">USD</span>
            </div>
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
                <span>Payment:</span>
                <span className="text-green-400">Manual Transfer</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
