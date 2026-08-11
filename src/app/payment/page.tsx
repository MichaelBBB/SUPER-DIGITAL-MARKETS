"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Zap, Lock, MessageCircle, Copy, Banknote } from "lucide-react";

const methods = [
  { id: "capitec", name: "Capitec Bank Transfer", desc: "Instant EFT via Capitec.", badges: ["EFT", "Instant"], icon: "🏦", instantDelivery: true },
];

// ✅ SEPARATE COMPONENT TO HANDLE SEARCH PARAMS SAFELY
function PaymentFormContent() {
  const searchParams = useSearchParams();
  
  const initialAmount = searchParams.get("amount") || "54.99";
  const initialItem = searchParams.get("item") || "Digital Product";
  
  const [amount, setAmount] = useState(initialAmount);
  const [itemName, setItemName] = useState(initialItem);
  const [selected, setSelected] = useState(methods[0]);
  const [copied, setCopied] = useState(false);

  // Update state if URL changes
  useEffect(() => {
    const urlAmount = searchParams.get("amount");
    const urlItem = searchParams.get("item");
    if (urlAmount) setAmount(urlAmount);
    if (urlItem) setItemName(urlItem);
  }, [searchParams]);

  // ✅ WHATSAPP INTEGRATION LOGIC (Works on iPhone & Android)
  const handleWhatsAppOrder = () => {
    // ️ REPLACE THIS WITH YOUR ACTUAL WHATSAPP NUMBER
    // Format: Country Code + Number (No '+', no spaces)
    // Example South Africa: 27821234567
    const phoneNumber = "27821234567"; 
    
    const message = `Hello Super Digital!%0A%0AI would like to purchase:%0A *${itemName}*%0A💰 Price: *$${amount} USD*%0A%0AI am ready to transfer to your Capitec account.%0APlease confirm receipt so I can send Proof of Payment.`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
  };

  // ✅ COPY BANK DETAILS TO CLIPBOARD (Desktop Fallback)
  const copyBankDetails = () => {
    const text = `SUPER DIGITAL\nAccount: 1975933441\nBranch: 470010\nRef: ${itemName}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="w-full max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Secure Checkout</h1>
        <p className="text-gray-400">Purchasing: <span className="text-cyan-400 font-bold text-xl">{itemName}</span></p>
        <Link href="/products" className="inline-block mt-4 text-blue-400 hover:text-blue-300">← Back to Products</Link>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* LEFT: Instructions */}
        <div className="w-full md:w-1/3 border-r border-gray-800 pr-6">
          <h2 className="text-xl font-bold mb-6">How to Pay</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <MessageCircle className="w-6 h-6 text-green-500" />
                <span className="font-bold text-green-400">Option 1: WhatsApp (Fastest)</span>
              </div>
              <p className="text-sm text-gray-300">Click the green button to open WhatsApp, confirm your order, and send proof of payment instantly.</p>
              <p className="text-xs text-gray-500 mt-2">✅ Works on iPhone & Android</p>
            </div>

            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Banknote className="w-6 h-6 text-gray-400" />
                <span className="font-bold text-gray-300">Option 2: Manual Transfer</span>
              </div>
              <p className="text-sm text-gray-400">Copy our bank details below and transfer directly via your banking app.</p>
            </div>
          </div>
        </div>

        {/* RIGHT: Action Area */}
        <div className="w-full md:w-2/3">
          <div className="bg-[#16191f] border border-gray-800 rounded-2xl shadow-2xl p-8">
            
            {/* PRICE DISPLAY */}
            <div className="text-center mb-8">
              <div className="text-sm text-gray-400 uppercase tracking-wide mb-2">Total Amount</div>
              <div className="text-4xl font-bold text-cyan-400">${amount} USD</div>
              <div className="text-xs text-gray-500 mt-1">(Transfer ZAR equivalent at current rate)</div>
            </div>

            {/* ✅ PRIMARY ACTION: WHATSAPP BUTTON */}
            <button 
              onClick={handleWhatsAppOrder} 
              className="w-full bg-green-600 hover:bg-green-500 text-white py-5 rounded-xl font-bold text-lg flex justify-center items-center gap-3 transition transform hover:scale-[1.02] shadow-lg shadow-green-900/20 mb-6"
            >
              <MessageCircle className="w-6 h-6" />
              Complete Order on WhatsApp
            </button>
            
            <div className="relative flex py-2 items-center mb-6">
              <div className="flex-grow border-t border-gray-700"></div>
              <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">OR PAY MANUALLY</span>
              <div className="flex-grow border-t border-gray-700"></div>
            </div>

            {/* CAPITEC DETAILS CARD */}
            <div className="bg-[#0b0f14] border border-cyan-500/30 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-cyan-400">CAPITEC BANK DETAILS</h4>
                <button 
                  onClick={copyBankDetails}
                  className="flex items-center gap-2 text-xs bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded transition"
                >
                  {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied!" : "Copy Details"}
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500 text-xs">Account Holder</div>
                  <div className="text-white font-medium">SUPER DIGITAL</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Account Number</div>
                  <div className="text-white font-medium">1975933441</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Branch Code</div>
                  <div className="text-white font-medium">470010</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Reference</div>
                  <div className="text-white font-medium truncate">{itemName}</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-800 text-xs text-gray-500">
                Please email POP to payments@superdigital.store if paying manually without WhatsApp.
              </div>
            </div>

            <p className="text-center text-xs text-gray-500">
              Secure checkout powered by Super Digital Markets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ MAIN PAGE COMPONENT WITH SUSPENSE BOUNDARY
export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-white font-sans flex items-center justify-center p-6">
      <Suspense fallback={<div className="text-white text-xl">Loading Checkout...</div>}>
        <PaymentFormContent />
      </Suspense>
    </div>
  );
}
