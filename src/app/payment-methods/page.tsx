'use client';

import { useState } from 'react';

const paymentMethods = [
  { 
    id: 'razorpay', 
    name: 'Razorpay', 
    region: 'India', 
    tag: 'INDIA PRIMARY', 
    tagColor: 'bg-blue-900/50 text-blue-400 border-blue-800',
    flag: '🇮🇳'
  },
  { 
    id: 'alipay', 
    name: 'Alipay', 
    region: 'China', 
    tag: 'CHINA PRIMARY', 
    tagColor: 'bg-blue-900/50 text-blue-400 border-blue-800',
    flag: '🇳'
  },
  { 
    id: 'payoneer', 
    name: 'Payoneer', 
    region: 'USA', 
    tag: 'USA PRIMARY', 
    tagColor: 'bg-red-900/50 text-red-400 border-red-800',
    flag: '🇺🇸'
  },
  { 
    id: 'googlepay', 
    name: 'Google Pay', 
    region: 'Global', 
    tag: 'GLOBAL', 
    tagColor: 'bg-blue-900/50 text-blue-400 border-blue-800',
    flag: ''
  },
  { 
    id: 'peach', 
    name: 'Peach Payments', 
    region: 'South Africa', 
    tag: 'SA PRIMARY', 
    tagColor: 'bg-orange-900/50 text-orange-400 border-orange-800',
    flag: '🇿🇦'
  },
  { 
    id: 'capitec', 
    name: 'Capitec Bank Transfer', 
    region: 'South Africa', 
    tag: 'MANUAL', 
    tagColor: 'bg-slate-800 text-slate-400 border-slate-700',
    flag: '🇿🇦'
  },
];

export default function PaymentMethods() {
  // Default to 'capitec' to match your screenshot
  const [activeId, setActiveId] = useState('capitec');

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Select Payment Method</h1>
          <p className="text-gray-400">Choose the best option for your region</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: Payment List */}
          <div className="lg:col-span-5 space-y-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setActiveId(method.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                  activeId === method.id
                    ? 'bg-slate-900 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                    : 'bg-slate-900/30 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{method.flag}</span>
                  <div>
                    <div className="font-semibold text-white group-hover:text-cyan-400 transition">
                      {method.name}
                    </div>
                    <div className="text-xs text-gray-500">{method.region}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold border ${method.tagColor}`}>
                    {method.tag}
                  </span>
                  {activeId === method.id && (
                    <div className="w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* RIGHT SIDE: Details Panel */}
          <div className="lg:col-span-7">
            <div className="p-8 bg-slate-900/50 rounded-2xl border border-slate-800 backdrop-blur-sm h-full">
              
              {/* Capitec Specific Content (Matches Screenshot Exactly) */}
              {activeId === 'capitec' && (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        🇦 Capitec Bank Transfer
                      </h2>
                      <p className="text-gray-400 text-sm">South Africa Market</p>
                    </div>
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-2xl">
                      🏦
                    </div>
                  </div>

                  <p className="text-gray-300 mb-8">
                    Direct bank transfer to our Capitec account.
                  </p>

                  <div className="space-y-6">
                    {/* Currencies */}
                    <div>
                      <div className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wider">
                        Currencies
                      </div>
                      <div className="text-xl font-mono text-white">
                        ZAR (South African Rand)
                      </div>
                    </div>

                    {/* Accepted Methods */}
                    <div>
                      <div className="text-xs text-gray-500 font-semibold mb-3 uppercase tracking-wider">
                        Accepted Methods
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <span className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-sm text-green-400">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          EFT
                        </span>
                        <span className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-sm text-green-400">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Internet Banking
                        </span>
                        <span className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-sm text-green-400">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Capitec App
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="w-full mt-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Pay with Capitec Bank Transfer
                    </button>
                  </div>
                </>
              )}

              {/* Placeholder for other methods */}
              {activeId !== 'capitec' && (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4 opacity-50">{paymentMethods.find(m => m.id === activeId)?.flag}</div>
                  <h3 className="text-xl font-bold text-gray-300 mb-2">
                    {paymentMethods.find(m => m.id === activeId)?.name}
                  </h3>
                  <p className="text-gray-500">Integration details coming soon...</p>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
