'use client';

import React, { useState } from 'react';
import { Check, Zap, Lock, CreditCard } from 'lucide-react';

const paymentMethods = [
  {
    id: 'capitec',
    name: 'Capitec Bank Transfer',
    type: 'INSTANT DELIVERY',
    icon: '🇿🇦',
    description: 'Instant EFT via Capitec - Payment processed immediately.',
    currency: 'ZAR',
    badges: ['EFT', 'Internet Banking', 'Capitec App'],
    instantDelivery: true,
    color: 'blue'
  },
  {
    id: 'card',
    name: 'Credit / Debit Card',
    type: 'INSTANT DELIVERY',
    icon: '💳',
    description: 'Secure payment via Visa or Mastercard.',
    currency: 'ZAR',
    badges: ['Visa', 'Mastercard'],
    instantDelivery: true,
    color: 'orange'
  },
  {
    id: 'apple_pay',
    name: 'Apple Pay',
    type: 'DIGITAL WALLET',
    icon: '🍎',
    description: 'Fast checkout with TouchID or FaceID.',
    currency: 'ZAR',
    badges: ['Biometric'],
    instantDelivery: true,
    color: 'white'
  }
];

const PaymentPanel = () => {
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: selectedMethod.id,
          amount: 5499,
          currency: 'ZAR'
        })
      });

      const data = await response.json();
      
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else if (data.success) {
        alert('Payment successful!');
      } else {
        alert('Payment failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Payment failed', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0f1115] text-white font-sans">
      <div className="w-1/3 border-r border-gray-800 p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-2">Secure Checkout</h2>
        <p className="text-gray-400 mb-8 text-sm">Select Payment Method</p>

        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                selectedMethod.id === method.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-800 bg-[#16191f] hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{method.icon}</span>
                <div className="text-left">
                  <div className="font-semibold text-sm">{method.name}</div>
                  <div className={`text-[10px] uppercase tracking-wider ${
                     method.instantDelivery ? 'text-green-400' : 'text-gray-500'
                  }`}>
                    {method.type}
                  </div>
                </div>
              </div>
              {selectedMethod.id === method.id && (
                <Check className="w-5 h-5 text-blue-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-10 flex flex-col justify-center max-w-2xl mx-auto">
        <div className="bg-[#16191f] border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center text-2xl">
                {selectedMethod.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedMethod.name}</h3>
                <p className="text-gray-400 text-sm">South Africa Market</p>
              </div>
            </div>
            <div className="p-2 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700">
              <CreditCard className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <p className="text-gray-300 mb-8 leading-relaxed">
            {selectedMethod.description}
          </p>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Currencies</h4>
              <div className="text-blue-400 font-mono font-bold">{selectedMethod.currency}</div>
            </div>
            <div>
              <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Accepted Methods</h4>
              <div className="flex gap-2 flex-wrap">
                {selectedMethod.badges.map(badge => (
                  <span key={badge} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300 border border-gray-700">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {selectedMethod.instantDelivery && (
            <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
              <Zap className="w-5 h-5 text-green-500 fill-green-500" />
              <span className="text-green-400 text-sm font-medium">
                Instant delivery after payment confirmation
              </span>
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
              selectedMethod.color === 'white' 
                ? 'bg-white text-black hover:bg-gray-200' 
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {isProcessing ? (
              <span>Processing...</span>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Pay R54.99 with {selectedMethod.name}
              </>
            )}
          </button>
          
          <div className="mt-4 text-center">
             <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
               <Lock className="w-3 h-3" /> Secured by Peach Payments
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPanel;
