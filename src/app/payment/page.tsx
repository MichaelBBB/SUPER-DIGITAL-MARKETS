// src/app/payment/page.tsx
"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MessageCircle, Copy, Check, ShieldCheck, AlertTriangle } from "lucide-react";

// ✅ FIX: Explicitly define Peach Payments global type
declare global {
  interface Window {
    PeachPayments?: {
      createWidget: (config: { checkoutId: string; selector: string; style?: any }) => void;
    };
  }
}

interface PaymentFormProps {
  whatsappNumber: string;
}

function PaymentFormContent({ whatsappNumber }: PaymentFormProps) {
  const searchParams = useSearchParams();
  const [amount, setAmount] = useState(searchParams.get("amount") || "54.99");
  const [itemName, setItemName] = useState(searchParams.get("item") || "Digital Product");
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'capitec' | 'whatsapp'>('capitec');
  const [widgetError, setWidgetError] = useState(false);

  // Initialize Peach Checkout Session Securely
  useEffect(() => {
    const initCheckout = async () => {
      try {
        const res = await fetch('/api/peach-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            amount: (parseFloat(amount) * 18.5).toFixed(2), 
            currency: 'ZAR',
            itemName 
          }),
        });
        const data = await res.json();
        if (data.checkoutId) setCheckoutId(data.checkoutId);
        else setWidgetError(true);
      } catch (err) { 
        console.error("Failed to load payment gateway", err); 
        setWidgetError(true);
      }
    };

    if (activeTab === 'capitec') initCheckout();
  }, [activeTab, amount, itemName]);

  // Load Peach Widget Script with Timeout Fallback
  useEffect(() => {
    if (checkoutId && activeTab === 'capitec' && !widgetError) {
      if (document.getElementById('peach-widget-script')) return;

      const entityId = process.env.NEXT_PUBLIC_PEACH_ENTITY_ID;
      
      if (!entityId || entityId === '') {
        setWidgetError(true);
        return;
      }

      const script = document.createElement('script');
      script.id = 'peach-widget-script';
      script.src = `https://test.peachpayments.com/checkout/v1/widget.js?entityId=${entityId}`;
      script.async = true;
      
      // ✅ TIMEOUT FALLBACK: If widget doesn't load in 10s, switch to WhatsApp
      const timeout = setTimeout(() => {
        if (!window.PeachPayments) {
          console.warn("Peach widget timed out. Switching to manual payment.");
          setWidgetError(true);
          setActiveTab('whatsapp');
        }
      }, 10000);

      script.onload = () => {
        clearTimeout(timeout);
        if (window.PeachPayments) {
          window.PeachPayments.createWidget({
            checkoutId: checkoutId,
            selector: '#peach-widget-container',
            style: { primaryColor: '#0ea5e9', borderRadius: '12px' }
          });
        } else {
          setWidgetError(true);
        }
      };
      
      script.onerror = () => {
        clearTimeout(timeout);
        setWidgetError(true);
      };
      
      document.body.appendChild(script);
      return () => { 
        clearTimeout(timeout);
        const el = document.getElementById('peach-widget-script');
        if (el) el.remove(); 
      };
    }
  }, [checkoutId, activeTab, widgetError]);

  const handleCopyDetails = () => {
    const text = `SUPER DIGITAL\nAcc: 1975933441\nBranch: 470010\nRef: ${itemName}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const waMessage = `Hi Super Digital! I want to buy *${itemName}* for $${amount}. Ready to pay.`;
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Secure Checkout</h1>
        <p className="text-gray-400">Purchasing: <span className="text-cyan-400 font-bold">{itemName}</span></p>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-[#16191f] p-1 rounded-xl mb-8 border border-gray-800">
        <button onClick={() => { setActiveTab('capitec'); setWidgetError(false); }} 
          className={`flex-1 py-3 rounded-lg font-semibold transition ${activeTab === 'capitec' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
           Capitec Pay (Instant)
        </button>
        <button onClick={() => setActiveTab('whatsapp')} 
          className={`flex-1 py-3 rounded-lg font-semibold transition ${activeTab === 'whatsapp' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
           WhatsApp / Manual
        </button>
      </div>

      {activeTab === 'capitec' ? (
        <div className="bg-[#16191f] border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-8 h-8 text-cyan-400" />
            <div>
              <h3 className="text-xl font-bold">Pay Instantly with Capitec</h3>
              <p className="text-sm text-gray-400">Open Banking • No Proof of Payment Needed • Auto-Delivery</p>
            </div>
          </div>
          
          <div className="text-center mb-8 p-4 bg-black/30 rounded-xl border border-gray-700">
            <span className="text-gray-400 text-sm block mb-1">Total Amount (ZAR)</span>
            <span className="text-4xl font-bold text-white">R{(parseFloat(amount) * 18.5).toFixed(2)}</span>
          </div>

          {widgetError ? (
            <div className="min-h-[300px] flex flex-col items-center justify-center bg-red-500/10 rounded-xl border border-red-500/30 p-6 text-center">
              <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
              <h4 className="text-red-400 font-bold text-lg mb-2">Payment Gateway Unavailable</h4>
              <p className="text-gray-400 text-sm mb-6">We couldn't connect to Capitec Pay right now.</p>
              <button onClick={() => setActiveTab('whatsapp')} className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2">
                <MessageCircle className="w-5 h-5" /> Use WhatsApp Instead
              </button>
            </div>
          ) : (
            <div id="peach-widget-container" className="min-h-[300px] flex items-center justify-center bg-gray-900/50 rounded-xl border border-dashed border-gray-700">
              {!checkoutId ? <span className="text-gray-500 animate-pulse">Initializing Secure Gateway...</span> : null}
            </div>
          )}
          
          <p className="text-xs text-center text-gray-500 mt-4">Secured by Peach Payments.</p>
        </div>
      ) : (
        <div className="bg-[#16191f] border border-gray-800 rounded-2xl p-8 shadow-2xl space-y-6">
          <button onClick={() => window.open(waLink, '_blank')} 
            className="w-full bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition">
            <MessageCircle className="w-6 h-6" /> Complete Order on WhatsApp
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="mx-4 text-gray-500 text-sm">OR MANUAL EFT</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          <div className="bg-[#0b0f14] border border-cyan-500/30 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-cyan-400">CAPITEC BANK DETAILS</h4>
              <button onClick={handleCopyDetails} className="text-xs bg-gray-800 px-3 py-1.5 rounded hover:bg-gray-700 flex items-center gap-2">
                {copied ? <Check className="w-3 h-3 text-green-400"/> : <Copy className="w-3 h-3"/>} {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><div className="text-gray-500 text-xs">Holder</div><div className="text-white">SUPER DIGITAL</div></div>
              <div><div className="text-gray-500 text-xs">Account</div><div className="text-white">1975933441</div></div>
              <div><div className="text-gray-500 text-xs">Branch</div><div className="text-white">470010</div></div>
              <div><div className="text-gray-500 text-xs">Ref</div><div className="text-white truncate">{itemName}</div></div>
            </div>
          </div>
        </div>
      )}
      
      <div className="text-center mt-8">
        <Link href="/products" className="text-blue-400 hover:text-blue-300 text-sm">← Return to Products</Link>
      </div>
    </div>
  );
}

// ✅ SERVER COMPONENT: Uses connection() to force dynamic rendering & pass secrets safely
import { connection } from 'next/server';
export default async function PaymentPage() {
  await connection(); 
  
  const whatsappNumber = process.env.WHATSAPP_NUMBER || "27821234567"; 

  return (
    <div className="min-h-screen bg-[#0f1115] text-white flex items-center justify-center">
      <Suspense fallback={<div className="text-white text-xl">Loading Secure Checkout...</div>}>
        <PaymentFormContent whatsappNumber={whatsappNumber} />
      </Suspense>
    </div>
  );
}
