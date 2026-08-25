// src/app/payment/PaymentForm.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, Copy, Check, AlertTriangle } from "lucide-react";

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
      <div className="flex justify-between items-center mb-6">
        <Link href="/products" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-sm font-medium transition">
          ← Back
        </Link>
        <div className="text-lg font-semibold text-blue-600">
          ZAR {(parseFloat(amount) * 18.5).toFixed(2)}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <p className="text-sm text-gray-600">Purchasing: <span className="font-semibold text-gray-900">{itemName}</span></p>
      </div>

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
            <div id="peach-widget-container" className="min-h-[400px]" />
          )}
        </div>
      ) : (
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
}'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentForm() {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [peachLoading, setPeachLoading] = useState(false);

  const amount = parseFloat(searchParams.get('amount') || '0');
  const itemName = searchParams.get('item') || 'Digital Product';
  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
  
  const YOUR_WHATSAPP = '27821234567'; // Replace with your number

  const handleWhatsAppOrder = () => {
    const message = `🛒 *NEW ORDER - SUPER DIGITAL MARKETS*%0A%0A*Product:* ${itemName}%0A*Amount:* $${amount.toFixed(2)} USD%0A*Order ID:* ${orderId}%0A%0A*Payment Details:*%0ABank: Capitec%0AAccount: 1975933441%0AReference: ${orderId}%0A%0APlease send proof of payment after transfer.`;
    window.open(`https://wa.me/${YOUR_WHATSAPP}?text=${message}`, '_blank');
  };

  const copyAccountDetails = () => {
    const text = `Capitec Bank\nAccount Holder: SUPER DIGITAL\nAccount Number: 1975933441\nBranch Code: 470010\nReference: ${orderId}\nAmount: $${amount.toFixed(2)} USD`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePeachPayment = async () => {
    setPeachLoading(true);
    try {
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency: 'ZAR', productName: itemName, orderId })
      });
      const data = await res.json();
      
      if (!res.ok) {
        // Show the EXACT error from Peach so we know what to fix
        const errorMsg = data.details ? JSON.stringify(data.details, null, 2) : data.error;
        throw new Error(`Peach API Error:\n\n${errorMsg}`);
      } 
      
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl; // Instant redirect!
      } else {
        throw new Error('No checkout URL received from server.');
      }
    } catch (error: any) {
      alert(error.message + "\n\nPlease check Vercel Function Logs for 'RAW PEACH RESPONSE'");
    } finally {
      setPeachLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8">
        
        {/* LEFT SIDE: Payment Options */}
        <div>
          <a href="/products" className="text-blue-400 hover:text-blue-300 mb-6 inline-block flex items-center gap-1">
            ← Return to Products
          </a>
          
          <h2 className="text-3xl font-bold mb-8">How to Pay</h2>
          
          {/* Option 1: Peach Payments */}
          <div 
            onClick={handlePeachPayment}
            className={`bg-purple-900/20 border border-purple-500/30 rounded-xl p-6 mb-6 cursor-pointer transition-all hover:bg-purple-900/30 hover:border-purple-500/50 ${peachLoading ? 'opacity-70 pointer-events-none' : ''}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
              <h3 className="text-xl font-bold text-purple-400">Option 1: Peach Payments (Instant)</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Pay securely with Card or Instant EFT. Automated delivery immediately after verification.
            </p>
            <div className="flex items-center gap-2 text-sm text-purple-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              <span>{peachLoading ? 'Connecting to Peach...' : 'Click to pay automatically'}</span>
            </div>
          </div>

          {/* Option 2: WhatsApp */}
          <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.226 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <h3 className="text-xl font-bold text-green-400">Option 2: WhatsApp (Backup)</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Click the green button to open WhatsApp and confirm your order manually.
            </p>
          </div>

          {/* Option 3: Manual Transfer */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
              <h3 className="text-xl font-bold text-gray-300">Option 3: Manual Transfer</h3>
            </div>
            <p className="text-gray-400">
              Copy bank details and paste into your banking app.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: Amount & Actions */}
        <div>
          <div className="text-center mb-8">
            <p className="text-gray-400 uppercase tracking-wider text-sm mb-2">Total Amount</p>
            <div className="text-5xl font-extrabold text-cyan-400 mb-2">
              ${amount.toFixed(2)} USD
            </div>
            <p className="text-gray-500 text-sm">(Transfer ZAR equivalent at current rate)</p>
          </div>

          <button 
            onClick={handleWhatsAppOrder}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-6 rounded-lg transition-all flex justify-center items-center gap-3 shadow-lg hover:shadow-green-500/25 hover:scale-[1.02] mb-8"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.226 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Complete Order on WhatsApp
          </button>

          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative bg-gray-950 px-4 text-sm text-gray-500">
              OR PAY MANUALLY
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative">
            <h3 className="text-cyan-400 font-bold text-lg mb-4">CAPITEC BANK DETAILS</h3>
            
            <button 
              onClick={copyAccountDetails}
              className="absolute top-6 right-6 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all flex items-center gap-2"
            >
              {copied ? 'Copied!' : 'Copy Details'}
            </button>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-gray-950/50 p-4 rounded-lg border border-gray-800">
                <p className="text-gray-500 text-xs mb-1">Account Holder</p>
                <p className="font-semibold text-white">SUPER DIGITAL</p>
              </div>
              <div className="bg-gray-950/50 p-4 rounded-lg border border-gray-800">
                <p className="text-gray-500 text-xs mb-1">Account Number</p>
                <p className="font-mono text-cyan-400">1975933441</p>
              </div>
              <div className="bg-gray-950/50 p-4 rounded-lg border border-gray-800">
                <p className="text-gray-500 text-xs mb-1">Branch Code</p>
                <p className="font-mono text-white">470010</p>
              </div>
              <div className="bg-gray-950/50 p-4 rounded-lg border border-gray-800">
                <p className="text-gray-500 text-xs mb-1">Reference</p>
                <p className="font-mono text-yellow-400">{orderId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
