"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Zap, Lock } from "lucide-react";
import LiveSalesTracker from "../components/LiveSalesTracker";

const methods = [
  { id: "capitec", name: "Capitec Bank Transfer", desc: "Instant EFT via Capitec - Payment processed immediately.", badges: ["EFT", "Internet Banking", "Capitec App"], icon: "🏦", instantDelivery: true },
  { id: "card", name: "Credit / Debit Card", desc: "Secure payment via Visa or Mastercard.", badges: ["Visa", "Mastercard"], icon: "💳", instantDelivery: true },
];

export default function PaymentPage() {
  const [selected, setSelected] = useState(methods[0]);
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 5499, currency: "ZAR", paymentMethod: selected.id }),
      });
      const data = await res.json();
      if (data.redirectUrl) window.location.href = data.redirectUrl;
    } catch (err) { console.error(err); alert("Network error"); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-white font-sans flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Secure Checkout</h1>
          <p className="text-gray-400">Select your payment method below</p>
          <Link href="/" className="inline-block mt-4 text-blue-400 hover:text-blue-300">← Back to Home</Link>
        </div>
        
        <LiveSalesTracker />

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 border-r border-gray-800 pr-6">
            <h2 className="text-xl font-bold mb-6">Payment Methods</h2>
            <div className="space-y-3">
              {methods.map((m) => (
                <button key={m.id} onClick={() => setSelected(m)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border ${
                    selected.id === m.id ? "border-blue-500 bg-blue-500/10" : "border-gray-800 hover:bg-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{m.icon}</span>
                    <div className="text-left">
                      <div className="font-semibold">{m.name}</div>
                      <div className="text-xs uppercase tracking-wider text-green-400">INSTANT DELIVERY</div>
                    </div>
                  </div>
                  {selected.id === m.id && <Check className="w-5 h-5 text-blue-500" />}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full md:w-2/3">
            <div className="bg-[#16191f] border border-gray-800 rounded-2xl shadow-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center text-2xl">{selected.icon}</div>
                <div><h3 className="text-xl font-bold">{selected.name}</h3><p className="text-gray-400 text-sm">South Africa Market</p></div>
              </div>
              <p className="text-gray-300 mb-6">{selected.desc}</p>
              <div className="mb-6"><span className="text-xs text-gray-500 uppercase block mb-2">Accepted Methods</span><div className="flex flex-wrap gap-2">
                {selected.badges.map((b) => (<span key={b} className="px-3 py-1 bg-gray-800 rounded text-xs text-gray-300 border border-gray-700">{b}</span>))}
              </div></div>
              {selected.instantDelivery && (
                <div className="mb-8 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
                  <Zap className="w-5 h-5 text-green-500 fill-green-500" /><span className="text-green-400 text-sm font-medium">Instant delivery after payment confirmation</span>
                </div>
              )}
              <div className="text-xl font-bold mb-4 text-center">Total: R54.99</div>
              
              {/* BANK DETAILS FOR CAPITEC */}
              {selected.id === "capitec" && (
                <div className="bg-[#0b0f14] border border-cyan-500/30 rounded-xl p-4 mb-6">
                  <h4 className="font-semibold mb-3 text-cyan-400">CAPITEC BANK TRANSFER DETAILS</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-gray-400">Account Holder:</div>
                    <div className="text-white font-medium">SUPER DIGITAL</div>
                    <div className="text-gray-400">Account Number:</div>
                    <div className="text-white font-medium">1975933441</div>
                    <div className="text-gray-400">Branch Code:</div>
                    <div className="text-white font-medium">470010</div>
                    <div className="text-gray-400">Swift Code:</div>
                    <div className="text-white font-medium">CABLZAJJ</div>
                  </div>
                  <div className="mt-4 text-xs text-gray-500">Transfer exact amount. Email proof to payments@superdigital.store with Order ID.</div>
                </div>
              )}

              <button onClick={handlePay} disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2"
              >
                <Lock className="w-5 h-5" />{loading ? "Processing..." : "Pay R54.99"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
