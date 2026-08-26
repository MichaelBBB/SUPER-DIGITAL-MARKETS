// src/app/payment/PaymentForm.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, Copy, Check, Zap } from "lucide-react";

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

  useEffect(() => {
    console.log(' Starting checkout initialization...');
    
    const initCheckout = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const zAmount = (parseFloat(amount) * 18.5).toFixed(2);
        console.log(' Converting amount:', amount, 'USD ->', zAmount, 'ZAR');
        
        console.log('📡 Calling /api/peach-checkout...');
        const res = await fetch('/api/peach-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            amount: zAmount,
            currency: 'ZAR'
          }),
        });
        
        console.log('📥 Response received:', res.status, res.ok);
        
        if (!res.ok) {
          const errorData = await res.json();
          console.error('❌ API Error:', errorData);
          setError(errorData.error || 'Payment unavailable');
          return;
        }
        
        const data = await res.json();
        console.log('✅ Checkout ID received:', data.checkoutId);
        
        if (data.checkoutId) {
          setCheckoutId(data.checkoutId);
        } else {
          setError('No checkout ID returned');
        }
      } catch (err) {
        console.error(' Network error:', err);
        setError('Network error - check console');
      } finally {
        setLoading(false);
      }
    };

    initCheckout();
  }, [amount]);

  useEffect(() => {
    if (checkoutId) {
      console.log('🎯 Loading Peach widget with checkoutId:', checkoutId);
      
      const script = document.createElement('script');
      script.src = `https://test.peachpayments.com/checkout/v1/widget.js?entityId=${process.env.NEXT_PUBLIC_PEACH_ENTITY_ID}`;
      script.async = true;
      
      script.onload = () => {
        console.log(' Peach script loaded');
        if ((window as any).PeachPayments) {
          console.log('🎨 Creating widget...');
          (window as any).PeachPayments.createWidget({
            checkoutId: checkoutId,
            selector: '#peach-widget',
            style: { primaryColor: '#10b981' }
          });
        } else {
          console.error('❌ PeachPayments object not found');
          setError('Failed to load payment widget');
        }
      };
      
      script.onerror = () => {
        console.error('❌ Failed to load Peach script');
        setError('Failed to load payment script');
      };
      
      document.body.appendChild(script);
    }
  }, [checkoutId]);

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
                <p className="text-gray-400 mt-2">Initializing payment...</p>
              </div>
            ) : error ? (
              <div className="text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <a href={waLink} target="_blank" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-bold">
                  <MessageCircle className="w-5 h-5" />
                  Use WhatsApp Instead
                </a>
              </div>
            ) : (
              <div id="peach-widget" />
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
