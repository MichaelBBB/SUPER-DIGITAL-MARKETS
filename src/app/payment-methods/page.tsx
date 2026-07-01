'use client';

import Link from 'next/link';

export default function PaymentGuide() {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Title */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-semibold mb-4">
            SECURE CHECKOUT
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How Do I <span className="text-yellow-400">Pay?</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Follow these simple steps to complete your purchase securely.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* LEFT COLUMN: The 4 Steps */}
          <div className="space-y-4">
            
            {/* Step 01 */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex gap-5 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                  <span className="text-cyan-500">01</span> Choose Your Product
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Browse all 30 digital products and click "Buy Now" on your selection.
                </p>
              </div>
            </div>

            {/* Step 02 */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex gap-5 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                  <span className="text-cyan-500">02</span> Select Payment Method
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Choose from Razorpay (India), Alipay (China), Payoneer (USA), Google Pay, Peach Payments, or direct bank transfer.
                </p>
              </div>
            </div>

            {/* Step 03 */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex gap-5 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                  <span className="text-cyan-500">03</span> Complete Payment
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Follow the secure checkout flow. For bank transfers, use the Capitec details below and email your proof of payment.
                </p>
              </div>
            </div>

            {/* Step 04 */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex gap-5 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                  <span className="text-cyan-500">04</span> Instant Delivery
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Your digital product is delivered immediately to your email after payment confirmation.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Capitec Bank Details */}
          <div className="space-y-6">
            
            {/* Bank Card */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl shadow-cyan-500/5">
              
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-2xl shadow-lg shadow-blue-600/20">
                    🇿🇦
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Capitec Bank</h2>
                    <p className="text-gray-400 text-sm">South Africa • Savings Account</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold uppercase tracking-wider">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Verified
                </div>
              </div>

              {/* Account Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Account Holder</div>
                  <div className="text-lg font-bold text-white">SUPER DIGITAL</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Account Number</div>
                  <div className="text-lg font-bold text-white font-mono">1975933441</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Swift Code</div>
                  <div className="text-lg font-bold text-white font-mono">CABLZAJJ</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Branch Code</div>
                  <div className="text-lg font-bold text-white font-mono">470010</div>
                </div>
              </div>

              {/* Warning Alert */}
              <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 flex gap-3 items-start">
                <div className="flex-shrink-0 mt-0.5 text-orange-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                </div>
                <div>
                  <p className="text-sm text-orange-200 font-semibold mb-1">After payment:</p>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Email your proof of payment to <span className="text-cyan-400 font-bold">payments@superdigital.store</span> with your order number. Products are delivered within 2 hours of payment confirmation. Reference your order number in the payment description.
                  </p>
                </div>
              </div>

            </div>

            {/* All Accepted Payment Methods */}
            <div className="bg-slate-900/30 rounded-2xl p-6 border border-slate-800">
              <div className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-4">All Accepted Payment Methods</div>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full text-xs text-gray-300 border border-slate-700">Razorpay 🇮🇳</div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full text-xs text-gray-300 border border-slate-700">Alipay 🇨🇳</div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full text-xs text-gray-300 border border-slate-700">Payoneer 🇺🇸</div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full text-xs text-gray-300 border border-slate-700">Google Pay </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full text-xs text-gray-300 border border-slate-700">Peach Payments 🇿🇦</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
