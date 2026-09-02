"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MessageCircle, Copy, Check, Zap, AlertCircle, RefreshCw } from "lucide-react";

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
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const widgetContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initCheckout = async () => {
      try {
        setLoading(true);
        setError(null);
        const zAmount = (parseFloat(amount) * 18.5).toFixed(2);
        
        console.log('🚀 [PaymentForm] Initiating payment for:', zAmount, 'ZAR');
        
        const res = await fetch('/api/peach-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: zAmount, currency: 'ZAR' }),
        });
        
        const data = await res.json();
        console.log('📡 [PaymentForm] API Response:', res.status, data);
        
        if (res.ok && data.checkoutId) {
          console.log('✅ [PaymentForm] Checkout ID received:', data.checkoutId);
          setCheckoutId(data.checkoutId);
        } else {
          setError(data.error || 'Payment unavailable');
          console.error('❌ [PaymentForm] Payment initialization failed:', data);
        }
      } catch (err) {
        setError('Network error connecting to payment service');
        console.error('🌐 [PaymentForm] Network error:', err);
      } finally {
        setLoading(false);
      }
    };
    initCheckout();
  }, [amount]);

  useEffect(() => {
    if (!checkoutId || widgetLoaded) return;

    console.log('🔧 [PaymentForm] Loading Peach Payments widget with ID:', checkoutId);

    const entityId = "8acda4cb9e1b546a019e1b5b39ee001c";
    
    // Remove any existing script first to avoid duplicates
    const existingScript = document.getElementById("peach-payments-script");
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.src = `https://peachpayments.com/checkout/v1/widget.js?entityId=${entityId}`;
    script.async = true;
    script.id = "peach-payments-script";
    
    script.onload = () => {
      console.log('✅ [PaymentForm] Peach Payments script loaded successfully');
      
      if ((window as any).PeachPayments) {
        console.log('✅ [PaymentForm] PeachPayments object found, creating widget...');
        
        try {
          (window as any).PeachPayments.createWidget({
            checkoutId: checkoutId,
            selector: '#peach-widget',
            style: { 
              primaryColor: '#10b981',
              backgroundColor: '#1f2937',
              textColor: '#ffffff'
            }
          });
          setWidgetLoaded(true);
          console.log('✅ [PaymentForm] Widget created successfully');
        } catch (widgetError) {
          console.error('❌ [PaymentForm] Widget creation failed:', widgetError);
          setError("Payment widget failed to initialize.");
        }
      } else {
        console.error(' [PaymentForm] PeachPayments object not found after script load');
        setError("Payment system failed to load.");
      }
    };
    
    script.onerror = () => {
      console.error('❌ [PaymentForm] Failed to load Peach Payments script');
      setError("Failed to connect to payment gateway.");
    };
    
    document.body.appendChild(script);
    
    return () => {
      // Cleanup not needed on every render, only on unmount if necessary
    };
  }, [checkoutId, widgetLoaded]);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`Bank: Capitec\nAcc: 1975933441\nRef: ${initialItem}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi! Buy *${initialItem}* $${amount}`)}`;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/products" className="text-gray-400 hover:text-white">← Back</Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">How to Pay</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Option 1 */}
          <div className="border-2 border-green-500 bg-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-bold text-green-400">Option 1: Instant Pay (Recommended)</h2>
            </div>
            
            <p className="text-gray-300 mb-6">
              Pay securely via Card or Instant EFT. Funds go directly to Capitec. No screenshots needed. Product delivered instantly.
            </p>

            <div className="text-3xl font-bold mb-6">${amount} USD</div>

            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                <p className="text-gray-400 mt-2">Connecting to Bank...</p>
              </div>
            ) : error ? (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-red-400 mb-4">
                  <AlertCircle className="w-5 h-5" />
                  <p className="font-bold">{error}</p>
                </div>
                
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleRetry}
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-bold transition"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Try Again
                  </button>
                  
                  <a href={waLink} target="_blank" className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-bold transition">
                    <MessageCircle className="w-5 h-5" />
                    Use WhatsApp Instead
                  </a>
                </div>
              </div>
            ) : (
              <div id="peach-widget" ref={widgetContainerRef} className="min-h-[300px] flex items-center justify-center bg-gray-800 rounded-lg">
                {!widgetLoaded && (
                  <span className="text-gray-500 animate-pulse">Loading Secure Payment Form...</span>
                )}
              </div>
            )}

            <p className="text-xs text-gray-400 mt-4 text-center">Secured by Peach Payments</p>
          </div>

          {/* Option 2 */}
          <div className="border border-gray-700 bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-400 mb-2">Option 2: Manual Transfer</h2>
            <p className="text-gray-400 text-sm mb-6">Only use this if card payment fails. Requires manual verification.</p>

            <div className="bg-gray-900 p-4 rounded mb-4 text-sm space-y-2">
              <div><span className="text-gray-400">Bank:</span> <span className="text-white">Capitec</span></div>
              <div><span className="text-gray-400">Acc:</span> <span className="text-white">1975933441</span></div>
              <div><span className="text-gray-400">Ref:</span> <span className="text-white">{initialItem}</span></div>
            </div>

            <button onClick={handleCopy} className="w-full border border-gray-600 hover:border-gray-500 text-gray-300 py-3 rounded font-medium flex items-center justify-center gap-2">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Details"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
