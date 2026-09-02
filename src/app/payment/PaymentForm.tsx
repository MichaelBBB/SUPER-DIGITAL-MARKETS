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
  const widgetContainerRef = useRef<HTMLDivElement>(null);

  // Step 1: Get Checkout ID
  useEffect(() => {
    const initCheckout = async () => {
      try {
        setLoading(true);
        setError(null);
        const zAmount = (parseFloat(amount) * 18.5).toFixed(2);
        
        const res = await fetch('/api/peach-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: zAmount, currency: 'ZAR' }),
        });
        
        const data = await res.json();
        
        if (res.ok && data.checkoutId) {
          setCheckoutId(data.checkoutId);
        } else {
          setError(data.error || 'Failed to initialize payment');
        }
      } catch (err) {
        setError('Network connection failed');
      } finally {
        setLoading(false);
      }
    };
    initCheckout();
  }, [amount]);

  // Step 2: Load Widget Script
  useEffect(() => {
    if (!checkoutId || !widgetContainerRef.current) return;

    // Prevent duplicate scripts
    if (document.getElementById("peach-widget-script")) {
      initializeWidget(checkoutId);
      return;
    }

    const script = document.createElement('script');
    // Use the exact URL from Peach's docs
    script.src = "https://peachpayments.com/checkout/v1/widget.js?entityId=8acda4cb9e1b546a019e1b5b39ee001c";
    script.id = "peach-widget-script";
    script.async = true;
    
    script.onload = () => {
      initializeWidget(checkoutId);
    };

    script.onerror = () => {
      setError("Payment security script blocked by browser. Please disable ad-blockers or try WhatsApp.");
      setLoading(false);
    };

    document.body.appendChild(script);
  }, [checkoutId]);

  const initializeWidget = (id: string) => {
    if ((window as any).PeachPayments && widgetContainerRef.current) {
      try {
        (window as any).PeachPayments.createWidget({
          checkoutId: id,
          selector: widgetContainerRef.current,
          style: {
            primaryColor: '#10b981',
            backgroundColor: '#1f2937',
            textColor: '#ffffff'
          }
        });
        setLoading(false);
      } catch (e) {
        setError("Payment form failed to render.");
        setLoading(false);
      }
    }
  };

  const handleRetry = () => window.location.reload();
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
        <div className="mb-6"><Link href="/products" className="text-gray-400 hover:text-white">← Back</Link></div>
        <h1 className="text-3xl font-bold mb-8">How to Pay</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border-2 border-green-500 bg-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-bold text-green-400">Option 1: Instant Pay</h2>
            </div>
            <p className="text-gray-300 mb-6 text-sm">Pay securely via Card or Instant EFT.</p>
            <div className="text-3xl font-bold mb-6">${amount} USD</div>

            {loading ? (
              <div className="h-[300px] flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
                <p className="text-gray-400">Connecting...</p>
              </div>
            ) : error ? (
              <div className="h-[300px] flex flex-col items-center justify-center bg-red-900/10 rounded-lg border border-red-500/20">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-red-400 font-bold mb-6">{error}</p>
                <button onClick={handleRetry} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-bold flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Try Again
                </button>
                <div className="mt-6">
                   <a href={waLink} target="_blank" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-bold">
                    <MessageCircle className="w-5 h-5" /> Use WhatsApp Instead
                  </a>
                </div>
              </div>
            ) : (
              <div ref={widgetContainerRef} className="min-h-[300px] bg-gray-900 rounded-lg overflow-hidden" />
            )}
            <p className="text-xs text-gray-500 mt-4 text-center">Secured by Peach Payments</p>
          </div>

          <div className="border border-gray-700 bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-400 mb-2">Option 2: Manual Transfer</h2>
            <p className="text-gray-400 text-sm mb-6">Use this if card payment fails.</p>
            <div className="bg-gray-900 p-4 rounded mb-4 text-sm space-y-2 font-mono">
              <div><span className="text-gray-500">Bank:</span> <span className="text-white">Capitec</span></div>
              <div><span className="text-gray-500">Acc:</span> <span className="text-white">1975933441</span></div>
              <div><span className="text-gray-500">Ref:</span> <span className="text-cyan-400">{initialItem}</span></div>
            </div>
            <button onClick={handleCopy} className="w-full border border-gray-600 hover:border-gray-400 text-gray-300 py-3 rounded font-medium flex items-center justify-center gap-2">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Details"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
