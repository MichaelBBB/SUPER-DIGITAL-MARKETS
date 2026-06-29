'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function PaymentMethodsInfo() {
  const [selectedMethod, setSelectedMethod] = useState('banktransfer');

  const methods = [
    {
      id: 'razorpay',
      name: 'Razorpay',
      flag: '🇮🇳',
      badge: 'INDIA PRIMARY',
      badgeColor: 'text-blue-400',
      description: "India's leading payment gateway. Accept UPI, cards, net banking, and wallets.",
      currencies: ['INR'],
      acceptedMethods: ['UPI', 'Credit/Debit Cards', 'Net Banking', 'Wallets'],
      icon: '💳'
    },
    {
      id: 'alipay',
      name: 'Alipay',
      flag: '🇨🇳',
      badge: 'CHINA PRIMARY',
      badgeColor: 'text-blue-400',
      description: "China's most popular digital payment platform. Fast, secure, and widely accepted.",
      currencies: ['CNY'],
      acceptedMethods: ['Alipay Balance', 'Bank Cards', "Yu'e Bao"],
      icon: '📱'
    },
    {
      id: 'payoneer',
      name: 'Payoneer',
      flag: '🇺',
      badge: 'USA PRIMARY',
      badgeColor: 'text-orange-400',
      description: 'Global payment platform for businesses. Receive payments from US clients easily.',
      currencies: ['USD', 'EUR', 'GBP'],
      acceptedMethods: ['Bank Transfer', 'Card', 'Local Payment Methods'],
      icon: '🌐'
    },
    {
      id: 'googlepay',
      name: 'Google Pay',
      flag: '🌍',
      badge: 'GLOBAL',
      badgeColor: 'text-blue-400',
      description: 'Fast, simple way to pay online and in stores. Works across multiple countries.',
      currencies: ['USD', 'EUR', 'INR', 'ZAR'],
      acceptedMethods: ['Credit/Debit Cards', 'Bank Accounts', 'Google Pay Balance'],
      icon: '🔵'
    },
    {
      id: 'peachpayments',
      name: 'Peach Payments',
      flag: '🇿🇦',
      badge: 'SA PRIMARY',
      badgeColor: 'text-orange-400',
      description: 'South African payment gateway. Secure, PCI-compliant payment processing.',
      currencies: ['ZAR'],
      acceptedMethods: ['Credit Cards', 'Instant EFT', 'SnapScan', 'Zapper'],
      icon: '🍑'
    },
    {
      id: 'banktransfer',
      name: 'Capitec Bank Transfer',
      flag: '🇿',
      badge: 'SA MARKET',
      badgeColor: 'text-green-400',
      description: 'Direct bank transfer to our Capitec account. Instant and secure.',
      currencies: ['ZAR'],
      acceptedMethods: ['EFT', 'Internet Banking', 'Capitec App'],
      icon: '🏦',
      bankDetails: {
        bank: 'Capitec Bank',
        account: '1975933441',
        swift: 'CABLZAJJ',
        branch: '470010'
      }
    }
  ];

  const current = methods.find(m => m.id === selectedMethod) || methods[0];

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-32 pb-20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"/>
                  <path d="M10 4a6 6 0 016 6c0 1.5-.5 2.9-1.4 4L10 10l-4.6 4A5.96 5.96 0 014 10a6 6 0 016-6z"/>
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                SUPER DIGITAL
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm text-gray-300 hover:text-white transition">Home</Link>
              <Link href="/#products" className="text-sm text-gray-300 hover:text-white transition">Products</Link>
              <Link href="/checkout" className="text-sm text-cyan-400 font-semibold">Checkout</Link>
              <div className="flex items-center gap-3 px-3 py-1.5 bg-green-500/20 rounded-full border border-green-500/30">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">LIVE</span>
              </div>
              <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 rounded-full text-sm font-semibold transition">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Pay Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-yellow-400">Way</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose from 6 payment methods across USA, India, China, and South Africa.
            <br />All transactions are encrypted and secure.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods List */}
          <div className="space-y-4">
            {methods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full p-4 rounded-xl border transition-all duration-300 text-left ${
                  selectedMethod === method.id
                    ? 'bg-cyan-500/20 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-900/50 border-white/10 hover:border-cyan-500/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{method.flag}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{method.name}</h3>
                      <span className={`text-xs ${method.badgeColor} border border-current px-2 py-0.5 rounded-full`}>
                        {method.badge}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{method.description.split('.')[0]}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Payment Method Details */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/50 rounded-2xl border border-white/10 p-8 backdrop-blur-sm">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{current.flag}</div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">{current.name}</h2>
                    <p className="text-gray-400">
                      {current.id === 'razorpay' ? 'India' :
                       current.id === 'alipay' ? 'China' :
                       current.id === 'payoneer' ? 'USA' :
                       current.id === 'googlepay' ? 'Global' : 'South Africa'} Market
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-cyan-500/20 rounded-xl">
                  <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-lg mb-8">{current.description}</p>

              {/* Currencies */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">CURRENCIES</h3>
                <div className="flex gap-3">
                  {current.currencies.map((currency) => (
                    <div key={currency} className="px-4 py-2 bg-slate-800 rounded-lg border border-white/10">
                      <span className="text-cyan-400 font-semibold">{currency}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accepted Methods */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">ACCEPTED METHODS</h3>
                <div className="flex flex-wrap gap-3">
                  {current.acceptedMethods.map((method) => (
                    <div key={method} className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-lg border border-green-500/30">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-green-400">{method}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bank Transfer Details */}
              {current.id === 'banktransfer' && current.bankDetails && (
                <div className="mb-8 p-6 rounded-xl border border-cyan-500/30 bg-cyan-500/5">
                  <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Bank Account Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800 rounded-lg p-4">
                      <div className="text-xs text-gray-400 mb-1">Bank Name</div>
                      <div className="font-bold text-white">{current.bankDetails.bank}</div>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-4">
                      <div className="text-xs text-gray-400 mb-1">Account Number</div>
                      <div className="font-mono font-bold text-cyan-400">{current.bankDetails.account}</div>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-4">
                      <div className="text-xs text-gray-400 mb-1">SWIFT Code</div>
                      <div className="font-mono font-bold text-cyan-400">{current.bankDetails.swift}</div>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-4">
                      <div className="text-xs text-gray-400 mb-1">Branch Code</div>
                      <div className="font-mono font-bold text-cyan-400">{current.bankDetails.branch}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-4">
                    Use your order ID as payment reference. Email proof of payment to{' '}
                    <span className="text-cyan-400">payments@superdigital.store</span>
                  </p>
                </div>
              )}

              {/* CTA */}
              <Link
                href="/checkout"
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl font-semibold text-lg transition transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Proceed to Checkout
              </Link>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-green-500/10 rounded-lg border border-green-500/30 flex items-center gap-3">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-sm text-green-400">
                  All transactions are encrypted with 256-bit SSL security. Your payment information is never stored on our servers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
