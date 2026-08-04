'use client';

import React, { useState } from 'react';
import { Check, Zap, Lock, CreditCard } from 'lucide-react';

const paymentMethods = [
  {
    id: 'capitec',
    name: 'Capitec Bank Transfer',
    type: 'INSTANT DELIVERY',
    icon: '🇿',
    description: 'Instant EFT via Capitec - Payment processed immediately.',
    currency: 'ZAR',
    badges: ['EFT', 'Internet Banking'],
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
  }
];

const PaymentPanel = () => {
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    alert('Payment processing for: ' + selectedMethod.name);
    setIsProcessing(false);
  };

  return (
    <div className="flex h-screen bg-[#0f1115] text-white font-sans">
      <div className="w-1/3 border-r border-gray-800 p-6">
        <h2 className="text-2xl font-bold mb-2">Secure Checkout</h2>
        <p className="text-gray-400 mb-8 text-sm">Select Payment Method</p>

        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border ${
                selectedMethod.id === method.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-800 bg-[#16191f]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{method.icon}</span>
                <div className="text-left">
                  <div className="font-semibold text-sm">{method.name}</div>
                  <div className="text-[10px] text-green-400 uppercase">
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

      <div className="flex-1 p-10 flex flex-col justify-center">
        <div className="bg-[#16191f] border border-gray-800 rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-4">{selectedMethod.name}</h3>
          <p className="text-gray-300 mb-6">{selectedMethod.description}</p>

          {selectedMethod.instantDelivery && (
            <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
              <Zap className="w-5 h-5 text-green-500" />
              <span className="text-green-400 text-sm">
                Instant delivery after payment confirmation
              </span>
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full py-4 rounded-xl font-bold text-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2"
          >
            <Lock className="w-5 h-5" />
            {isProcessing ? 'Processing...' : 'Pay R54.99'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPanel;
