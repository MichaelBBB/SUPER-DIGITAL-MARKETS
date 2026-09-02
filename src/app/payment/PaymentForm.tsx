"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MessageCircle, Copy, Check, Zap, AlertCircle, RefreshCw, CreditCard, Phone, ShieldAlert } from "lucide-react";

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

  // Step 2: Load Peach Widget Script
  useEffect(() => {
    if (!checkoutId || !widgetContainerRef.current) return;

    if (document.getElementById("peach-widget-script")) {
      initializeWidget(checkoutId);
      return;
    }

    const script = document.createElement('script');
    script.src = "https://peachpayments.com/checkout/v1/widget.js?entityId=8acda4cb9e1b546a019e1b5b39ee001c";
    script.id = "peach-widget-script";
    script.async = true;
    
    script.onload = () => initializeWidget(checkoutId);
    script.onerror = () => {
      setError("Browser security blocked the script. Please disable 'Enhanced Tracking Protection' (Shield icon) in the address bar.");
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
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <Link href="/products" className="text-gray-400 hover:text-white flex items-center gap-2 font-bold">
            ← Back to Products
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-center flex-1">Secure Checkout</h1>
          <div className="w-24"></div> {/* Spacer */}
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
          
          {/* LEFT PANEL: PEACH PAYMENTS (CARD) */}
          <div className="border border-blue-500/50 bg-gray-800/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Pay by Card / Instant EFT</h2>
            </div>
            
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Secure payment powered by Peach Payments. Supports all major cards and instant bank transfers.
            </p>

            {/* Helper Tip for Users */}
            <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-3 mb-6 flex gap-3 items-start">
              <ShieldAlert className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-200/80">
                <strong>Trouble loading?</strong> Click the <strong>Shield Icon</strong> 🔒 in your browser's address bar and turn off "Enhanced Tracking Protection".
              </p>
            </div>
            
            <div className="text-3xl font-bold text-white mb-6">${amount} USD</div>

            {loading ? (
              <div className="h-[300px] flex flex-col items-center justify-center bg-gray-900/50 rounded-xl border border-gray-700">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-3"></div>
                <p className="text-gray-400 text-sm animate-pulse">Connecting to Bank...</p>
              </div>
            ) : error ? (
              <div className="h-[300px] flex flex-col items-center justify-center bg-red-900/10 rounded-xl border border-red-500/20 p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-red-400 font-bold mb-2">Connection Blocked</p>
                <p className="text-gray-400 text-sm mb-6 max-w-xs">{error}</p>
                <button onClick={handleRetry} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition">
                  <RefreshCw className="w-4 h-4" /> Try Again
                </button>
              </div>
            ) : (
              <div ref={widgetContainerRef} className="min-h-[300px] bg-gray-900 rounded-xl border border-gray-700 shadow-inner" />
            )}
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span> Secured by Peach Payments
              </p>
            </div>
          </div>

          {/* RIGHT PANEL: WHATSAPP (ALTERNATIVE) */}
          <div className="border border-green-500/50 bg-gray-800/50 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Phone className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Pay via WhatsApp</h2>
            </div>
            
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Prefer human assistance? Chat with us directly for instant payment instructions and order confirmation. No browser issues.
            </p>
            
            <div className="flex-grow flex flex-col items-center justify-center min-h-[200px] bg-green-900/10 rounded-xl border border-green-500/20 p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/30 animate-pulse">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Fast & Reliable</h3>
              <p className="text-gray-400 text-sm mb-8">Get your product keys instantly after payment proof.</p>
              
              <a 
                href={waLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition transform hover:scale-[1.02] shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp Now
              </a>
              <p className="text-xs text-gray-500 mt-4">Available 24/7 • Instant Response</p>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION: MANUAL TRANSFER */}
        <div className="mt-10 border border-gray-700 bg-gray-800/30 rounded-2xl p-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Copy className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-bold text-gray-300">Option 3: Manual Bank Transfer</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-900 p-4 rounded-lg font-mono text-sm border border-gray-700">
            <div className="flex justify-between border-b border-gray-800 pb-2 md:border-0 md:pb-0">
              <span className="text-gray-500">Bank:</span> 
              <span className="text-white font-bold">Capitec</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-2 md:border-0 md:pb-0">
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
          <button onClick={handleCopy} className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition">
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? "Details Copied to Clipboard!" : "Copy Bank Details"}
          </button>
          <p className="text-xs text-gray-500 mt-3 text-center">After transfer, send proof via WhatsApp for instant activation.</p>
        </div>

      </div>
    </div>
  );
}
