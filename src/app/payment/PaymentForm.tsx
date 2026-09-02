"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Copy, Check, Zap, CreditCard, Phone, AlertCircle } from "lucide-react";

export default function PaymentForm({ 
  initialAmount, 
  initialItem, 
  whatsappNumber 
}: { 
  initialAmount: string; 
  initialItem: string; 
  whatsappNumber: string; 
}) {
  const [amount] = useState(initialAmount);
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(`Bank: Capitec\nAcc: 1975933441\nRef: ${initialItem}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi! I want to buy *${initialItem}* for $${amount}. Please send me payment details.`)}`;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <Link href="/products" className="text-gray-400 hover:text-white flex items-center gap-2 font-bold">
            ← Back to Products
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-center flex-1">Secure Checkout</h1>
          <div className="w-24"></div>
        </div>
        
        {/* PRIMARY OPTION: WHATSAPP */}
        <div className="border-2 border-green-500 bg-gray-800 rounded-2xl p-8 mb-8 shadow-2xl shadow-green-500/20">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
              <Phone className="w-12 h-12 text-white" />
            </div>
            <div className="flex-grow text-center md:text-left">
              <h2 className="text-3xl font-bold text-green-400 mb-4">Pay via WhatsApp (Recommended)</h2>
              <p className="text-gray-300 mb-6 text-lg">
                For the fastest and most reliable service, chat with us directly. We will send you instant payment instructions and confirm your order immediately.
              </p>
              <a 
                href={waLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-full font-bold text-xl transition transform hover:scale-105 shadow-lg"
              >
                <MessageCircle className="w-6 h-6" />
                Chat on WhatsApp Now
              </a>
              <p className="text-xs text-gray-500 mt-4">Available 24/7 • Instant Response • No Browser Issues</p>
            </div>
          </div>
        </div>

        {/* SECONDARY OPTION: MANUAL TRANSFER */}
        <div className="border border-gray-700 bg-gray-800 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-8 h-8 text-blue-400" />
            <h2 className="text-2xl font-bold text-blue-400">Option 2: Manual Bank Transfer</h2>
          </div>
          <p className="text-gray-400 mb-6">
            Prefer to pay directly? Use our bank details below.
          </p>
          
          <div className="bg-gray-900 p-6 rounded-lg mb-6 text-lg space-y-4 font-mono border border-gray-700">
            <div className="flex justify-between">
              <span className="text-gray-500">Bank:</span> 
              <span className="text-white font-bold">Capitec</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Account:</span> 
              <span className="text-white font-bold">1975933441</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Reference:</span> 
              <span className="text-cyan-400 font-bold">{initialItem}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Amount:</span> 
              <span className="text-green-400 font-bold">${amount} USD</span>
            </div>
          </div>
          
          <button onClick={handleCopy} className="w-full bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-3 transition">
            {copied ? <Check className="w-6 h-6 text-green-500" /> : <Copy className="w-6 h-6" />}
            {copied ? "Details Copied!" : "Copy Bank Details"}
          </button>
          <p className="text-xs text-gray-500 mt-4 text-center">After transfer, send proof via WhatsApp for instant activation.</p>
        </div>

        {/* NOTE ABOUT CARD PAYMENT */}
        <div className="mt-8 p-6 bg-yellow-900/20 border border-yellow-700/50 rounded-lg text-center">
          <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <h3 className="text-yellow-500 font-bold mb-2">Card Payment Temporarily Unavailable</h3>
          <p className="text-gray-400 text-sm">
            Our automated card system is currently experiencing technical difficulties due to browser security restrictions. 
            We are working hard to resolve this. In the meantime, please use WhatsApp or Bank Transfer for instant service.
          </p>
        </div>

      </div>
    </div>
  );
}
