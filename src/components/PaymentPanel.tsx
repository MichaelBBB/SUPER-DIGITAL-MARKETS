"use client";

import React, { useState } from "react";
import { Check, Zap, Lock } from "lucide-react";

const methods = [
  { id: "capitec", name: "Capitec Bank Transfer", desc: "Instant EFT via Capitec.", badges: ["EFT", "Internet Banking", "Capitec App"] },
  { id: "card", name: "Credit / Debit Card", desc: "Secure Visa/Mastercard processing.", badges: ["Visa", "Mastercard"] },
];

export default function PaymentPanel() {
  const [selected, setSelected] = useState(methods[0]);
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    
    // SIMULATING THE PEACH PAYMENT API CALL HERE
    console.log("Initiating payment for:", selected.name);
    
    setTimeout(() => {
      alert(`Redirecting to ${selected.name} payment gateway...`);
      setLoading(false);
      // Real redirect would happen here:
      // window.location.href = data.redirectUrl; 
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-[#0f1115] text-white overflow-hidden">
      
      {/* LEFT SIDE: Selection List */}
      <div className="w-1/3 border-r border-gray-800 p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8">Select Method</h2>
        
        <div className="space-y-3">
          {methods.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelected(m)}
              className={`w-full p-4 rounded-xl border text-left transition-all ${
                selected.id === m.id 
                  ? "border-blue-500 bg-blue-500/10" 
                  : "border-gray-800 hover:border-gray-600"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{m.name}</span>
                {selected.id === m.id && <Check size={18} className="text-blue-500"/>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: Details & Pay Button */}
      <div className="flex-1 flex items-center justify-center p-10">
        <div className="w-full max-w-md bg-[#16191f] p-8 rounded-2xl border border-gray-800 shadow-xl">
          
          <h1 className="text-2xl font-bold mb-2">{selected.name}</h1>
          <p className="text-gray-400 mb-6">{selected.desc}</p>

          {/* Badges */}
          <div className="flex gap-2 mb-6">
            {selected.badges.map((b) => (
              <span key={b} className="px-2 py-1 text-xs bg-gray-800 rounded text-gray-300">
                {b}
              </span>
            ))}
          </div>

          {/* Instant Badge */}
          <div className="flex items-center gap-2 text-green-400 text-sm mb-8 bg-green-900/20 p-2 rounded border border-green-900/50 w-fit">
            <Zap size={16} /> <span>Instant Delivery</span>
          </div>

          {/* Action Button */}
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-colors"
          >
            <Lock size={20} />
            {loading ? "Processing..." : "Pay R54.99"}
          </button>

        </div>
      </div>
    </div>
  );
}
