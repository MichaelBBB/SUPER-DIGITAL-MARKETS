'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const products = [
  { id: 1, name: "ChatGPT Plus", price: 20.00, description: "OpenAI's GPT-4 powered assistant" },
  { id: 2, name: "Adobe Creative Cloud", price: 54.99, description: "Full suite of Adobe apps" },
  { id: 3, name: "Netflix Premium", price: 22.99, description: "4K streaming service" },
  { id: 4, name: "Microsoft 365 Business", price: 12.50, description: "Office apps + 1TB OneDrive" },
  { id: 5, name: "Spotify Premium", price: 9.99, description: "Ad-free music streaming" },
  { id: 6, name: "NordVPN", price: 3.99, description: "Military-grade encryption" },
  { id: 7, name: "Notion Plus", price: 8.00, description: "All-in-one workspace" },
  { id: 8, name: "Figma Professional", price: 12.00, description: "Collaborative UI/UX design" },
  { id: 9, name: "Dropbox Plus", price: 9.99, description: "2TB cloud storage" },
  { id: 10, name: "Canva Pro", price: 12.99, description: "Premium design templates" },
  { id: 11, name: "Grammarly Premium", price: 12.00, description: "AI writing assistant" },
  { id: 12, name: "Zoom Pro", price: 14.99, description: "Unlimited meetings" },
  { id: 13, name: "LastPass Premium", price: 3.00, description: "Secure password manager" },
  { id: 14, name: "Cursor AI Pro", price: 20.00, description: "AI-first code editor" },
  { id: 15, name: "Midjourney Standard", price: 24.00, description: "AI image generation" },
  { id: 16, name: "GitHub Copilot", price: 10.00, description: "AI pair programmer" },
  { id: 17, name: "Slack Pro", price: 7.25, description: "Team messaging" },
  { id: 18, name: "Dashlane Premium", price: 4.99, description: "Password manager + VPN" },
  { id: 19, name: "Adobe Photoshop", price: 22.99, description: "Industry-standard photo editing" },
  { id: 20, name: "Claude Pro", price: 20.00, description: "Advanced AI assistant" },
  { id: 21, name: "Adobe Premiere Pro", price: 22.99, description: "Professional video editing" },
  { id: 22, name: "Asana Premium", price: 10.99, description: "Project management" },
  { id: 23, name: "ExpressVPN", price: 6.67, description: "Ultra-fast VPN" },
  { id: 24, name: "YouTube Premium", price: 13.99, description: "Ad-free YouTube" },
  { id: 25, name: "1Password", price: 2.99, description: "Password manager" },
  { id: 26, name: "Monday.com Pro", price: 9.00, description: "Visual work OS" },
  { id: 27, name: "Perplexity Pro", price: 20.00, description: "AI-powered search" },
  { id: 28, name: "Loom Business", price: 12.50, description: "Async video messaging" },
  { id: 29, name: "Webflow CMS", price: 14.00, description: "No-code website builder" },
  { id: 30, name: "ElevenLabs Starter", price: 5.00, description: "AI voice cloning" }
];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const id = searchParams.get('product');
    if (id) {
      const found = products.find((p) => p.id === parseInt(id));
      setProduct(found || null);
    }
    setLoading(false);
  }, [searchParams]);

  const handleCapitecClick = () => {
    const subject = encodeURIComponent(`Payment Confirmation - SD-${product?.id}`);
    const body = encodeURIComponent(`Hello,\n\nI have completed a bank transfer for product: ${product?.name} (ID: ${product?.id}).\n\nAmount: $${product?.price.toFixed(2)}\n\nReference: SD-${product?.id}`);
    window.location.href = `mailto:payments@superdigital.store?subject=${subject}&body=${body}`;
  };

  const handlePeachPayment = async () => {
    if (!product) {
      alert('Error: No product selected.');
      return;
    }

    setProcessing(true);
    
    try {
      const response = await fetch('/api/peach-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: product.price,
          orderId: `SD-${product.id}-${Date.now()}`
        })
      });

      const data = await response.json();

      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert('Payment error: ' + (data.error || 'Failed to create payment session'));
      }
    } catch (error) {
      console.error('Peach payment error:', error);
      alert('Failed to process payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Product not found</p>
          <Link href="/" className="px-6 py-3 bg-cyan-500 rounded-full font-semibold hover:bg-cyan-400 transition">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition">
            ← Back to Marketplace
          </Link>
          <h1 className="text-3xl font-bold">Secure Checkout</h1>
          <div className="w-20"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
              <p className="text-gray-400 text-sm mb-6">{product.description}</p>
              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <span className="text-gray-400">Total</span>
                <span className="text-3xl font-bold text-cyan-400">${product.price.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🏦</span>
                <h3 className="text-xl font-bold">Capitec Bank Transfer</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">Direct EFT. Instant delivery upon confirmation.</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-xs text-gray-500 mb-1">Account Holder</div>
                  <div className="font-semibold text-sm">SUPER DIGITAL</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-xs text-gray-500 mb-1">Account Number</div>
                  <div className="font-semibold text-sm font-mono">1975933441</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-xs text-gray-500 mb-1">Branch Code</div>
                  <div className="font-semibold text-sm font-mono">470010</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-xs text-gray-500 mb-1">Reference</div>
                  <div className="font-semibold text-sm font-mono">SD-{product.id}</div>
                </div>
              </div>

              <button 
                onClick={handleCapitecClick} 
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition cursor-pointer"
              >
                I've Completed the Transfer
              </button>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 border border-cyan-500/30">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">💳</span>
                <h3 className="text-xl font-bold">Credit / Debit Card</h3>
                <span className="ml-auto px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full border border-cyan-500/30">PEACH PAYMENTS</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">Secure checkout powered by Peach Payments. Supports Visa, Mastercard, and Capitec Pay.</p>
              
              <button 
                onClick={handlePeachPayment} 
                disabled={processing}
                className={`w-full py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 ${
                  processing 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-cyan-500 hover:bg-cyan-400 cursor-pointer'
                }`}
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Pay ${product.price.toFixed(2)} Securely
                  </>
                )}
              </button>
              <p className="text-center text-xs text-gray-500 mt-3">Opens Peach Payments secure gateway in a new tab.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
