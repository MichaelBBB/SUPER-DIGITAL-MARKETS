export const dynamic = 'force-dynamic'; // CRITICAL: Prevents static build error with useSearchParams

'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import PeachCheckout from '@/components/PeachCheckout';

// Inner component that uses hooks
function PaymentContent() {
  const searchParams = useSearchParams();
  const item = searchParams.get('item') || 'Digital Product';
  const amount = parseFloat(searchParams.get('amount') || '10.99');

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      {/* Navigation */}
      <nav className="border-b border-gray-800 px-6 py-4 mb-8 sticky top-0 z-50 bg-black/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">⚡</span>
            </div>
            <span className="text-xl font-bold tracking-tight">SUPER DIGITAL</span>
          </div>
          <a href="/" className="text-gray-300 hover:text-white font-medium transition">Back to Home</a>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Complete Your Purchase</h1>
        
        {/* Order Summary */}
        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 mb-8 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">{item}</h2>
            <span className="text-xs bg-green-900/50 text-green-400 px-2 py-1 rounded">Instant Delivery</span>
          </div>
          
          <div className="flex justify-between items-end mb-6">
            <span className="text-gray-400">Total Amount</span>
            <span className="text-4xl font-bold text-green-400">${amount.toFixed(2)}</span>
          </div>

          <div className="space-y-3 text-sm text-gray-400 border-t border-gray-800 pt-4">
            <div className="flex justify-between">
              <span>Product Type</span>
              <span className="text-white">Digital Download</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Method</span>
              <span className="text-white">Email / Dashboard</span>
            </div>
            <div className="flex justify-between">
              <span>Security</span>
              <span className="text-white">SSL Encrypted (Peach Payments)</span>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="space-y-6">
          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Secure Card Payment
            </h3>
            
            {/* Peach Payments Button */}
            <PeachCheckout 
              amount={amount} 
              itemName={item}
              onSuccess={(data) => {
                console.log('Payment successful:', data);
                alert('Payment initiated successfully! Redirecting...');
              }}
              onError={(error) => {
                console.error('Payment error:', error);
                alert('Error initiating payment. Please try again or contact support.');
              }}
            />
          </div>

          {/* WhatsApp Alternative */}
          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 text-center">
            <h3 className="text-lg font-bold text-white mb-2">Prefer WhatsApp?</h3>
            <p className="text-gray-400 text-sm mb-4">Chat with us directly to complete your order manually.</p>
            <a 
              href={`https://wa.me/27123456789?text=Hi, I want to buy ${encodeURIComponent(item)} for $${amount}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          By completing this purchase, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
}

// Wrapper with Suspense to satisfy Next.js requirements
export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
