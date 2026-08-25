// src/app/payment/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, Copy, Check, ShieldCheck, AlertTriangle } from "lucide-react";

declare global {
  interface Window {
    PeachPayments?: {
      createWidget: (config: { checkoutId: string; selector: string; style?: any }) => void;
    };
  }
}

export default function PaymentPage() {
  const [amount, setAmount] = useState("3.00"); // Default amount in USD
  const [itemName, setItemName] = useState("Digital Product");
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'capitec' | 'whatsapp'>('capitec');
  const [widgetError, setWidgetError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);

  // Initialize checkout on mount
  useEffect(() => {
    const initCheckout = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/peach-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            amount: (parseFloat(amount) * 18.5).toFixed(2), // Convert USD to ZAR
            currency: 'ZAR',
            itemName 
          }),
        });
        const data = await res.json();
        
        if (!res.ok) {
          setErrorMsg(data.error || 'Failed to initialize payment');
          setWidgetError(true);
          return;
        }
        
        if (data.checkoutId) {
          setCheckoutId(data.checkoutId);
        } else {
          setErrorMsg('No checkout ID returned');
          setWidgetError(true);
        }
      } catch (err) { 
        setErrorMsg('Network error');
        setWidgetError(true);
      } finally {
        setLoading(false);
      }
    };

    initCheckout();
  }, [amount, itemName]);

  // Load Peach Widget when checkoutId is ready
  useEffect(() => {
    if (checkoutId && activeTab === 'capitec' && !widgetError) {
      if (document.getElementById('peach-widget-script')) return;

      const entityId = process.env.NEXT_PUBLIC_PEACH_ENTITY_ID;
      
      if (!entityId) {
        setErrorMsg('Peach Entity ID not configured');
        setWidgetError(true);
        return;
      }

      const script = document.createElement('script');
      script.id = 'peach-widget-script';
      script.src = `https://test.peachpayments.com/checkout/v1/widget.js?entityId=${entityId}`;
      script.async = true;
      
      const timeout = setTimeout(() => {
        if (!window.PeachPayments) {
          setErrorMsg('Widget load timeout');
          setWidgetError(true);
        }
      }, 15000);

      script.onload = () => {
        clearTimeout(timeout);
        if (window.PeachPayments) {
          window.PeachPayments.createWidget({
            checkoutId: checkoutId,
            selector: '#peach-widget-container',
            style: { 
              primaryColor: '#0284c7', // Blue color matching your screenshots
              borderRadius: '8px'
            }
          });
        }
      };
      
      script.onerror = () => {
        clearTimeout(timeout);
        setErrorMsg('Script failed to load');
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

  const whatsappNumber = "27821234567"; // Replace with your number
  const waMessage = `Hi Super Digital! I want to buy *${itemName}* for $${amount}. Ready to pay.`;
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-center text-gray-900">
            SUPER DIGITAL Marketplace
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back Button & Amount */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/products" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-sm font-medium transition">
            ← Back
          </Link>
          <div className="text-lg font-semibold text-blue-600">
            ZAR {(parseFloat(amount) * 18.5).toFixed(2)}
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <p className="text-sm text-gray-600">Purchasing: <span className="font-semibold text-gray-900">{itemName}</span></p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
          <button 
            onClick={() => { setActiveTab('capitec'); setWidgetError(false); }}
            className={`flex-1 py-3 px-4 rounded-md font-semibold text-sm transition ${activeTab === 'capitec' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            💳 Card Payment
          </button>
          <button 
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 py-3 px-4 rounded-md font-semibold text-sm transition ${activeTab === 'whatsapp' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
             WhatsApp / EFT
          </button>
        </div>

        {activeTab === 'capitec' ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading secure payment gateway...</p>
              </div>
            ) : widgetError ? (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Gateway Unavailable</h3>
                <p className="text-gray-600 mb-6">{errorMsg}</p>
                <button 
                  onClick={() => setActiveTab('whatsapp')} 
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  Use WhatsApp Instead
                </button>
              </div>
            ) : (
              <div id="peach-widget-container" className="min-h-[400px]">
                {/* Peach Payments widget will load here */}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* WhatsApp Button */}
            <button 
              onClick={() => window.open(waLink, '_blank')}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-3 transition shadow-sm"
            >
              <MessageCircle className="w-6 h-6" />
              Complete Order on WhatsApp
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">OR PAY MANUALLY</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Bank Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">CAPITEC BANK DETAILS</h3>
                <button 
                  onClick={handleCopyDetails} 
                  className={`px-3 py-2 rounded text-sm font-medium transition flex items-center gap-2 ${copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Details"}
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <div className="text-gray-500 text-xs mb-1">Account Holder</div>
                  <div className="font-semibold text-gray-900">SUPER DIGITAL</div>
                </div>
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <div className="text-gray-500 text-xs mb-1">Account Number</div>
                  <div className="font-semibold text-gray-900">1975933441</div>
                </div>
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <div className="text-gray-500 text-xs mb-1">Branch Code</div>
                  <div className="font-semibold text-gray-900">470010</div>
                </div>
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <div className="text-gray-500 text-xs mb-1">Reference</div>
                  <div className="font-semibold text-gray-900 truncate">{itemName}</div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                After transferring, email POP to <span className="text-blue-600 font-medium">payments@superdigital.store</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}/ src/app/payment/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { MessageCircle, Copy, Check, ShieldCheck, AlertTriangle } from "lucide-react";

declare global {
  interface Window {
    PeachPayments?: {
      createWidget: (config: { checkoutId: string; selector: string; style?: any }) => void;
    };
  }
}

interface PaymentFormProps {
  whatsappNumber: string;
  initialAmount: string;
  initialItem: string;
}

function PaymentFormContent({ whatsappNumber, initialAmount, initialItem }: PaymentFormProps) {
  const [amount] = useState(initialAmount);
  const [itemName] = useState(initialItem);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'capitec' | 'whatsapp'>('capitec');
  const [widgetError, setWidgetError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
        
        if (!res.ok) {
          setErrorMsg(data.details ? 
            `Missing: ${!data.details.hasEntityId ? 'Entity ID ' : ''}${!data.details.hasAuthToken ? 'Auth Token' : ''}` : 
            data.error || 'Unknown error');
          setWidgetError(true);
          return;
        }
        
        if (data.checkoutId) {
          setCheckoutId(data.checkoutId);
        } else {
          setErrorMsg('No checkout ID returned');
          setWidgetError(true);
        }
      } catch (err) { 
        setErrorMsg('Network error');
        setWidgetError(true);
      }
    };

    if (activeTab === 'capitec') initCheckout();
  }, [activeTab, amount, itemName]);

  useEffect(() => {
    if (checkoutId && activeTab === 'capitec' && !widgetError) {
      if (document.getElementById('peach-widget-script')) return;

      const entityId = process.env.NEXT_PUBLIC_PEACH_ENTITY_ID;
      
      if (!entityId || entityId === '') {
        setErrorMsg('Peach Entity ID not configured');
        setWidgetError(true);
        return;
      }

      const script = document.createElement('script');
      script.id = 'peach-widget-script';
      script.src = `https://test.peachpayments.com/checkout/v1/widget.js?entityId=${entityId}`;
      script.async = true;
      
      const timeout = setTimeout(() => {
        if (!window.PeachPayments) {
          setErrorMsg('Widget load timeout');
          setWidgetError(true);
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
          setErrorMsg('PeachPayments not loaded');
          setWidgetError(true);
        }
      };
      
      script.onerror = () => {
        clearTimeout(timeout);
        setErrorMsg('Script failed to load');
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
        <p className="text-gray-400">Purchasing: <span className="text-cyan-400 font-bold text-xl">{itemName}</span></p>
      </div>

      <div className="flex bg-[#16191f] p-1 rounded-xl mb-8 border border-gray-800">
        <button onClick={() => { setActiveTab('capitec'); setWidgetError(false); setErrorMsg(''); }} 
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
              <p className="text-gray-400 text-sm mb-2">{errorMsg}</p>
              <button onClick={() => setActiveTab('whatsapp')} className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 mx-auto">
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
            <span className="mx-4 text-gray-500 text-sm">OR PAY MANUALLY</span>
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

// ✅ SERVER COMPONENT with Suspense boundary
import { Suspense } from 'react';

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string; item?: string }>
}) {
  const params = await searchParams;
  
  const whatsappNumber = process.env.WHATSAPP_NUMBER || "27821234567";
  const amount = params.amount || "54.99";
  const item = params.item || "Digital Product";

  return (
    <div className="min-h-screen bg-[#0f1115] text-white flex items-center justify-center">
      {/* ✅ WRAP CLIENT COMPONENT IN SUSPENSE */}
      <Suspense fallback={
        <div className="text-white text-xl animate-pulse">Loading checkout...</div>
      }>
        <PaymentFormContent 
          whatsappNumber={whatsappNumber}
          initialAmount={amount}
          initialItem={item}
        />
      </Suspense>
    </div>
  );
}
