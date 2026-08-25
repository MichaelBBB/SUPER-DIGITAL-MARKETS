// src/app/payment/PaymentForm.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, Copy, Check, AlertTriangle } from "lucide-react";

// ✅ Tell TypeScript about Peach Payments global object
declare global {
  interface Window {
    PeachPayments?: {
      createWidget: (config: { checkoutId: string; selector: string; style?: any }) => void;
    };
  }
}

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
  const [itemName] = useState(initialItem);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'capitec' | 'whatsapp'>('capitec');
  const [widgetError, setWidgetError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);

  // Initialize Peach checkout session
  useEffect(() => {
    const initCheckout = async () => {
      try {
        setLoading(true);
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

    if (activeTab === 'capitec') {
      initCheckout();
    }
  }, [activeTab, amount, itemName]);

  // Load Peach Widget script when checkoutId is ready
  useEffect(() => {
    if (checkoutId && activeTab === 'capitec' && !widgetError) {
      // Prevent duplicate script injection
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
      
      // Timeout fallback if widget doesn't load
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
            style: { primaryColor: '#0284c7', borderRadius: '8px' }
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

  const waMessage = `Hi Super Digital! I want to buy *${itemName}* for $${amount}. Ready to pay.`;
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
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

      {/* Capitec Pay Tab */}
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
            <div id="peach-widget-container" className="min-h-[400px]" />
          )}
        </div>
      ) : (
        /* WhatsApp / Manual Tab */
        <div className="space-y-6">
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
  );
}
