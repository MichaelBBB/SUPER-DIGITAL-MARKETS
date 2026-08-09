"use client";

import React, { useState } from "react";
import { Check, Zap, Lock } from "lucide-react";

const methods = [
  { 
    id: "capitec", 
    name: "Capitec Bank Transfer", 
    desc: "Instant EFT via Capitec - Payment processed immediately.", 
    badges: ["EFT", "Internet Banking", "Capitec App"],
    icon: "🏦",
    color: "blue"
  },
  { 
    id: "card", 
    name: "Credit / Debit Card", 
    desc: "Secure payment via Visa or Mastercard.", 
    badges: ["Visa", "Mastercard"],
    icon: "💳",
    color: "orange"
  },
];

export default function PaymentPage() {
  const [selected, setSelected] = useState(methods[0]);
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 5499, // R54.99 in cents
          currency: "ZAR",
          paymentMethod: selected.id,
        }),
      });

      const data = await response.json();
      
      if (data.redirectUrl) {
        window.location.href = `${data.redirectUrl}?next=/success`;
      } else {
        alert("Payment failed");
      }
    } catch (error) {
      console.error(error);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0f1115] text-white font-sans">
      
      {/* LEFT PANEL */}
      <div className="w-full md:w-1/3 border-r border-gray-800 p-6 flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-8">Select Payment</h2>
        
        <div className="space-y-3">
          {methods.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelected(m)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                selected.id === m.id
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-800 hover:bg-gray-900"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{m.icon}</span>
                <div className="text-left">
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-xs uppercase tracking-wider text-green-400">
                    INSTANT DELIVERY
                  </div>
                </div>
              </div>
              {selected.id === m.id && <Check className="w-5 h-5 text-blue-500" />}
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-lg bg-[#16191f] border border-gray-800 rounded-2xl shadow-2xl p-8">
          
          <div className="flex items-center gap-4 mb-6">
             <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center text-2xl">
               {selected.icon}
             </div>
             <div>
              <h3 className="text-xl font-bold">{selected.name}</h3>
              <p className="text-gray-400 text-sm">South Africa Market</p>
             </div>
          </div>

          <p className="text-gray-300 mb-6">{selected.desc}</p>

          <div className="mb-6">
             <span className="text-xs text-gray-500 uppercase block mb-2">Accepted Methods</span>
             <div className="flex flex-wrap gap-2">
               {selected.badges.map((b) => (
                 <span key={b} className="px-3 py-1 bg-gray-800 rounded text-xs text-gray-300 border border-gray-700">
                   {b}
                 </span>
               ))}
             </div>
          </div>

          <div className="mb-8 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
              <Zap className="w-5 h-5 text-green-500 fill-green-500" />
              <span className="text-green-400 text-sm font-medium">
                Instant delivery after payment confirmation
              </span>
          </div>

          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-colors"
          >
            <Lock className="w-5 h-5" />
            {loading ? "Processing..." : "Pay R54.99"}
          </button>

        </div>
      </div>
    </div>
  );
}
