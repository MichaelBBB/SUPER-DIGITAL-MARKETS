"use client";

import React, { useState } from "react";
import { Check, Zap, Lock, CreditCard } from "lucide-react";

// Define data here to avoid import errors
const paymentMethods = [
  {
    id: "capitec",
    name: "Capitec Bank Transfer",
    description: "Direct bank transfer to our Capitec account.",
    badges: ["EFT", "Internet Banking", "Capitec App"],
    currency: "ZAR",
    instantDelivery: true,
  },
  {
    id: "card",
    name: "Credit / Debit Card",
    description: "Secure payment via Visa or Mastercard.",
    badges: ["Visa", "Mastercard"],
    currency: "ZAR",
    instantDelivery: true,
  },
];

export default function PaymentPanel() {
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Call your backend API
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 5499, // R54.99 in cents
          currency: "ZAR",
          paymentMethod: selectedMethod.id,
        }),
      });

      const data = await response.json();
      
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        alert("Error processing payment");
      }
    } catch (error) {
      console.error(error);
      alert("Network error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f1115] text-white font-sans">
      
      {/* LEFT PANEL: Selection */}
      <div className="w-full md:w-1/3 border-r border-gray-800 p-6 flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-8">Secure Checkout</h2>
        
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                selectedMethod.id === method.id
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-800 hover:bg-gray-900"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{selectedMethod.id === "capitec" ? "🏦" : "💳"}</span>
                <div className="text-left">
                  <div className="font-semibold">{method.name}</div>
                  <div className={`text-xs uppercase tracking-wider ${method.instantDelivery ? "text-green-400" : "text-gray-500"}`}>
                    {method.instantDelivery ? "INSTANT DELIVERY" : "MANUAL"}
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

      {/* RIGHT PANEL: Details & Action */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-lg bg-[#16191f] border border-gray-800 rounded-2xl shadow-2xl p-8">
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center text-2xl">
               {selectedMethod.id === "capitec" ? "🏦" : "💳"}
            </div>
            <div>
              <h3 className="text-xl font-bold">{selectedMethod.name}</h3>
              <p className="text-gray-400 text-sm">South Africa Market</p>
            </div>
          </div>

          <p className="text-gray-300 mb-6">{selectedMethod.description}</p>

          {/* Badges */}
          <div className="mb-6">
             <span className="text-xs text-gray-500 uppercase block mb-2">Accepted Methods</span>
             <div className="flex flex-wrap gap-2">
               {selectedMethod.badges.map((badge) => (
                 <span key={badge} className="px-3 py-1 bg-gray-800 rounded text-xs text-gray-300 border border-gray-700">
                   {badge}
                 </span>
               ))}
             </div>
          </div>

          {/* Instant Delivery Badge */}
          {selectedMethod.instantDelivery && (
            <div className="mb-8 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
              <Zap className="w-5 h-5 text-green-500 fill-green-500" />
              <span className="text-green-400 text-sm font-medium">
                Instant delivery after payment confirmation
              </span>
            </div>
          )}

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-colors"
          >
            <Lock className="w-5 h-5" />
            {isProcessing ? "Processing..." : `Pay R54.99 with ${selectedMethod.name}`}
          </button>

        </div>
      </div>
    </div>
  );
}
