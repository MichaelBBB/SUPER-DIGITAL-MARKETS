'use client'; // MUST BE THE VERY FIRST LINE

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PaymentContent() {
  const searchParams = useSearchParams();
  const item = searchParams.get('item') || 'Digital Product';
  const amount = parseFloat(searchParams.get('amount') || '10.99');

  // Generate WhatsApp Link
  const whatsappMessage = `Hi, I want to buy ${encodeURIComponent(item)} for $${amount}. Please send payment instructions.`;
  const whatsappLink = `https://wa.me/27123456789?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      {/* Navigation */}
      <nav className="border-b border-gray-800 px-6 py-4 mb-8 sticky top-0 z-50 bg-black/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm"></span>
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
        </div>

        {/* PRIMARY OPTION: WhatsApp (Fastest) */}
        <div className="bg-green-900/20 p-8 rounded-xl border border-green-600 mb-6 text-center shadow-lg shadow-green-900/20">
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            Pay via WhatsApp (Recommended)
          </h3>
          <p className="text-gray-300 mb-6">
            Fastest method! Chat with us directly for instant payment instructions and order confirmation.
          </p>
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            Chat to Buy Now
          </a>
          <p className="text-xs text-gray-400 mt-4">Available 24/7 • Instant Response</p>
        </div>

        {/* SECONDARY OPTION: Bank Transfer */}
        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 text-center">
          <h3 className="text-lg font-bold text-white mb-2">Option 2: Manual Bank Transfer</h3>
          <p className="text-gray-400 text-sm mb-4">
            Transfer funds directly to our account. Send proof of payment via WhatsApp for activation.
          </p>
          <div className="bg-black p-4 rounded-lg text-left text-sm text-gray-300 mb-4 font-mono">
            <p><strong>Bank:</strong> [Your Bank Name]</p>
            <p><strong>Account Name:</strong> [Your Account Name]</p>
            <p><strong>Account Number:</strong> [Your Account Number]</p>
            <p><strong>Branch Code:</strong> [Your Branch Code]</p>
            <p><strong>Reference:</strong> {item.replace(/\s/g, '')}</p>
          </div>
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline text-sm"
          >
            Send Proof of Payment on WhatsApp
          </a>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          Card payments will be restored shortly. Thank you for your patience.
        </div>
      </div>
    </div>
  );
}

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
