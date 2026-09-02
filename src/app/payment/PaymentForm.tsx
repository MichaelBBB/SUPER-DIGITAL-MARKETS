"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MessageCircle, Copy, Check, Zap, AlertCircle, RefreshCw, CreditCard, Phone } from "lucide-react";

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

  // Step 1: Get Checkout ID from our API
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

  // Step 2: Load Peach Widget Script
  useEffect(() => {
    if (!checkoutId || !widgetContainerRef.current) return;

    // Prevent duplicate scripts
    if (document.getElementById("peach-widget-script")) {
      initializeWidget(checkoutId);
      return;
    }

    const script = document.createElement('script');
    script.src = "https://peachpayments.com/checkout/v1/widget.js?entityId=8acda4cb9e1b546a019e1b5b39ee001c";
    script.id = "peach-widget-script";
    script.async = true;
    
    script.onload = () => {
      console.log('✅ Peach Script Loaded');
      initializeWidget(checkoutId);
    };

    script.onerror = () => {
      console.warn('⚠️ Peach Script Blocked. Check Tracking Protection.');
      setError("Script blocked. Please disable 'Enhanced Tracking Protection' (Shield icon) in the address bar.");
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
          style: { primaryColor: '#10b981', backgroundColor: '#1f2937', textColor: '#ffffff' }
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
  
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi! I want to buy *${initialItem}* for $${amount}. Please send me payment details.`)}`;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6"><Link href="/products" className="text-gray-400 hover:text-white">← Back</Link></div>
        <h1 className="text-3xl font-bold mb-8 text-center">How to Pay</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* OPTION 1: PEACH PAYMENTS (CARD/EFT) */}
          <div className="border-2 border-blue-500 bg-gray-800 rounded-lg p-6 flex flex-col shadow-lg shadow-blue-500/10">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-blue-400">Option 1: Card / Instant EFT</h2>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Pay securely via Peach Payments. 
              <br/>
              <span className="text-yellow-500 font-semibold text-xs">Tip:</span> If this doesn't load, click the <strong>Shield Icon</strong> in the address bar and turn off "Enhanced Tracking Protection".
            </p>
            
            <div className="text-2xl font-bold mb-4">${amount} USD</div>

            {loading ? (
              <div className="flex-grow flex flex-col items-center justify-center min-h-[250px]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-3"></div>
                <p className="text-gray-400 text-sm">Loading Secure Form...</p>
              </div>
            ) : error ? (
              <div className="flex-grow flex flex-col items-center justify-center min-h-[250px] bg-red-900/10 rounded-lg border border-red-500/20 p-4 text-center">
                <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
                <p className="text-red-400 font-bold mb-2">Script Blocked</p>
                <p className="text-gray-400 text-sm mb-4">{error}</p>
                <button onClick={handleRetry} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Try Again
                </button>
              </div>
            ) : (
              <div ref={widgetContainerRef} className="flex-grow min-h-[250px] bg-gray-900 rounded-lg overflow-hidden" />
            )}
            <p className="text-xs text-gray-500 mt-4 text-center">Secured by Peach Payments</p>
          </div>

          {/* OPTION 2: WHATSAPP (GUARANTEED) */}
          <div className="border-2 border-green-500 bg-gray-800 rounded-lg p-8 flex flex-col items-center text-center shadow-lg shadow-green-500/10">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-green-400 mb-4">Option 2: WhatsApp Pay</h2>
            <p className="text-gray-300 mb-6">
              Fastest & Most Reliable. Click to chat and get instant payment instructions. No browser issues.
            </p>
            
            <a 
              href={waLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-bold transition transform hover:scale-105 w-full justify-center"
            >
              <Phone className="w-5 h-5" />
              Chat on WhatsApp Now
            </a>
            <p className="text-xs text-gray-500 mt-4">Works on all devices • Available 24/7</p>
          </div>

        </div>

        {/* OPTIONAL: Manual Transfer Below */}
        <div className="mt-8 border border-gray-700 bg-gray-800 rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-gray-400 mb-2">Option 3: Manual Bank Transfer</h2>
          <div className="bg-gray-900 p-4 rounded mb-4 text-sm space-y-2 font-mono">
            <div><span className="text-gray-500">Bank:</span> <span className="text-white">Capitec</span></div>
            <div><span className="text-gray-500">Acc:</span> <span className="text-white">1975933441</span></div>
            <div><span className="text-gray-500">Ref:</span> <span className="text-cyan-400">{initialItem}</span></div>
          </div>
          <button onClick={handleCopy} className="w-full border border-gray-600 hover:border-gray-400 text-gray-300 py-2 rounded text-sm flex items-center justify-center gap-2">
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Details"}
          </button>
        </div>

      </div>
    </div>
  );
}
