'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const products = [
  { id: 1, name: "ChatGPT Plus", price: 20.00 },
  { id: 2, name: "Adobe Creative Cloud", price: 54.99 },
  { id: 3, name: "Netflix Premium", price: 22.99 },
  { id: 4, name: "Microsoft 365 Business", price: 12.50 },
  { id: 5, name: "Spotify Premium", price: 9.99 },
  { id: 6, name: "NordVPN", price: 3.99 },
  { id: 7, name: "Notion Plus", price: 8.00 },
  { id: 8, name: "Figma Professional", price: 12.00 },
  { id: 9, name: "Dropbox Plus", price: 9.99 },
  { id: 10, name: "Canva Pro", price: 12.99 },
  { id: 11, name: "Grammarly Premium", price: 12.00 },
  { id: 12, name: "Zoom Pro", price: 14.99 },
  { id: 13, name: "LastPass Premium", price: 3.00 },
  { id: 14, name: "Cursor AI Pro", price: 20.00 },
  { id: 15, name: "Midjourney Standard", price: 24.00 },
  { id: 16, name: "GitHub Copilot", price: 10.00 },
  { id: 17, name: "Slack Pro", price: 7.25 },
  { id: 18, name: "Dashlane Premium", price: 4.99 },
  { id: 19, name: "Adobe Photoshop", price: 22.99 },
  { id: 20, name: "Claude Pro", price: 20.00 },
  { id: 21, name: "Adobe Premiere Pro", price: 22.99 },
  { id: 22, name: "Asana Premium", price: 10.99 },
  { id: 23, name: "ExpressVPN", price: 6.67 },
  { id: 24, name: "YouTube Premium", price: 13.99 },
  { id: 25, name: "1Password", price: 2.99 },
  { id: 26, name: "Monday.com Pro", price: 9.00 },
  { id: 27, name: "Perplexity Pro", price: 20.00 },
  { id: 28, name: "Loom Business", price: 12.50 },
  { id: 29, name: "Webflow CMS", price: 14.00 },
  { id: 30, name: "ElevenLabs Starter", price: 5.00 }
];

function CheckoutInner() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');
  const product = products.find(p => p.id === Number(productId));
  const [processing, setProcessing] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-red-400">Product not found</p>
      </div>
    );
  }

  const handlePeachPayment = async () => {
    setProcessing(true);
    try {
      const res = await fetch('/api/peach-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: product.price, orderId: `SD-${product.id}` })
      });
      
      const data = await res.json();

      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        const msg = data.error || data.message || 'Payment failed';
        alert(`❌ Payment Error: ${msg}`);
      }
    } catch (e) {
      alert('Failed to connect to payment server.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCapitecConfirmation = async () => {
    setProcessing(true);
    try {
      const res = await fetch('/api/payment/capitec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: product.price, 
          orderId: `SD-${product.id}`,
          productName: product.name 
        })
      });
      
      const data = await res.json();

      if (data.success) {
        alert('✅ Payment recorded! Please email your proof of payment to payments@superdigital.store.');
      } else {
        alert(`❌ Error: ${data.error || 'Failed to record payment'}`);
      }
    } catch (e) {
      alert('Failed to connect to server.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-cyan-400 mb-6 block">&larr; Back to Products</Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Payment Guide */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Payment Steps</h2>
            
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-400 font-bold text-sm">01</div>
                <div>
                  <h3 className="font-bold">Choose Your Product</h3>
                  <p className="text-gray-400 text-xs mt-1">Browse all 30 digital products and click "Buy Now" on your selection.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-400 font-bold text-sm">02</div>
                <div>
                  <h3 className="font-bold">Select Payment Method</h3>
                  <p className="text-gray-400 text-xs mt-1">Choose from Razorpay (India), Alipay (China), Payoneer (USA), Google Pay, Peach Payments, or direct bank transfer.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-400 font-bold text-sm">03</div>
                <div>
                  <h3 className="font-bold">Complete Payment</h3>
                  <p className="text-gray-400 text-xs mt-1">Follow the secure checkout flow. For bank transfers, use the Capitec details below and email your proof of payment.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-400 font-bold text-sm">04</div>
                <div>
                  <h3 className="font-bold">Instant Delivery</h3>
                  <p className="text-gray-400 text-xs mt-1">Your digital product is delivered immediately to your email after payment confirmation.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Payment Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Capitec Bank Transfer Block */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🇿</span>
                  <div>
                    <h2 className="text-2xl font-bold">Capitec Bank Transfer</h2>
                    <p className="text-gray-400">South Africa Market</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full border border-green-800 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                  Verified
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-gray-500 text-xs block">Account Holder</span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">SUPER DIGITAL</span>
                    <button onClick={() => navigator.clipboard.writeText('SUPER DIGITAL')}>📋</button>
                  </div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-gray-500 text-xs block">Account Number</span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono">1975933441</span>
                    <button onClick={() => navigator.clipboard.writeText('1975933441')}>📋</button>
                  </div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-gray-500 text-xs block">Swift Code</span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">CABLZAJJ</span>
                    <button onClick={() => navigator.clipboard.writeText('CABLZAJJ')}>📋</button>
                  </div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-gray-500 text-xs block">Branch Code</span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">470010</span>
                    <button onClick={() => navigator.clipboard.writeText('470010')}>📋</button>
                  </div>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-800 p-4 rounded-xl mb-6">
                <p className="text-xs text-blue-200">
                  <strong>After payment:</strong> Email your proof of payment to <a href="mailto:payments@superdigital.store" className="underline hover:text-blue-100">payments@superdigital.store</a> with your order number. Products are delivered within 2 hours of payment confirmation. Reference your order number in the payment description.
                </p>
              </div>

              <button 
                onClick={handleCapitecConfirmation}
                disabled={processing}
                className="w-full py-4 bg-blue-900/50 hover:bg-blue-900/70 rounded-xl font-bold transition disabled:bg-gray-700 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                {processing ? 'Processing...' : 'Pay with Capitec Bank Transfer'}
              </button>
            </div>

            {/* Other Payment Methods (Accordion Style) */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <h3 className="text-lg font-bold mb-4">ALL ACCEPTED PAYMENT METHODS</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <button className="flex flex-col items-center gap-2 p-4 bg-slate-950 rounded-xl hover:bg-slate-800 transition group">
                  <span className="text-2xl">🇮🇳</span>
                  <span className="text-sm font-bold group-hover:text-cyan-400">Razorpay</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 bg-slate-950 rounded-xl hover:bg-slate-800 transition group">
                  <span className="text-2xl">🇨</span>
                  <span className="text-sm font-bold group-hover:text-cyan-400">Alipay</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 bg-slate-950 rounded-xl hover:bg-slate-800 transition group">
                  <span className="text-2xl">🇺</span>
                  <span className="text-sm font-bold group-hover:text-cyan-400">Payoneer</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 bg-slate-950 rounded-xl hover:bg-slate-800 transition group">
                  <span className="text-2xl">🌍</span>
                  <span className="text-sm font-bold group-hover:text-cyan-400">Google Pay</span>
                </button>
                <button 
                  onClick={handlePeachPayment}
                  disabled={processing}
                  className={`col-span-2 md:col-span-1 flex flex-col items-center gap-2 p-4 rounded-xl transition group ${processing ? 'bg-gray-700 cursor-not-allowed' : 'bg-cyan-900/50 hover:bg-cyan-900/70 border border-cyan-800'}`}
                >
                  <span className="text-2xl">💳</span>
                  <span className="text-sm font-bold text-cyan-400">Credit Card</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading...
      </div>
    }>
      <CheckoutInner />
    </Suspense>
  );
}
