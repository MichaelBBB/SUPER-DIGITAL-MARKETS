'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

type Step = 'cart' | 'payment' | 'confirm';

const CURRENCIES = [
  { code: 'USD', symbol: '$', flag: '🇺🇸', label: 'US Dollar', rate: 1 },
  { code: 'INR', symbol: '₹', flag: '🇮🇳', label: 'Indian Rupee', rate: 83.5 },
  { code: 'CNY', symbol: '¥', flag: '🇨🇳', label: 'Chinese Yuan', rate: 7.25 },
  { code: 'ZAR', symbol: 'R', flag: '🇿🇦', label: 'South African Rand', rate: 18.6 },
];

const PAYMENT_METHODS = [
  { id: 'razorpay', name: 'Razorpay', region: 'India', flag: '🇮', color: '#3395FF', description: "India's leading payment gateway. Accept UPI, cards, net banking, and wallets." },
  { id: 'alipay', name: 'Alipay', region: 'China', flag: '🇨🇳', color: '#1677FF', description: "China's most popular digital payment platform. Fast, secure, and widely accepted." },
  { id: 'payoneer', name: 'Payoneer', region: 'USA', flag: '🇺', color: '#FF4800', description: 'Global payment platform for businesses. Receive payments from US clients easily.' },
  { id: 'googlepay', name: 'Google Pay', region: 'Global', flag: '🌍', color: '#4285F4', description: 'Fast, simple way to pay online and in stores. Works across multiple countries.' },
  { id: 'peachpayments', name: 'Peach Payments', region: 'South Africa', flag: '🇿🇦', color: '#FF6B35', description: 'South African payment gateway. Secure, PCI-compliant payment processing.' },
  { id: 'banktransfer', name: 'Capitec Bank Transfer', region: 'South Africa', flag: '🇿🇦', color: '#002855', description: 'Direct bank transfer to our Capitec account. Instant and secure.' },
];

const PRODUCTS = [
  { id: 'chatgpt', name: 'ChatGPT Plus', price: 20.00, category: 'AI Tools', badge: 'HOT', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800', description: "OpenAI's GPT-4 powered assistant. Advanced reasoning, image generation, and browsing included." },
  { id: 'adobe', name: 'Adobe Creative Cloud', price: 54.99, category: 'Creative', badge: 'POPULAR', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800', description: 'Full suite of Adobe apps — Photoshop, Illustrator, Premiere Pro, and 20+ more.' },
  { id: 'netflix', name: 'Netflix Premium', price: 22.99, category: 'Entertainment', badge: 'HOT', image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800', description: '4K streaming, 4 simultaneous screens, offline downloads. 10,000+ titles worldwide.' },
  { id: 'microsoft365', name: 'Microsoft 365 Business', price: 12.50, category: 'Business', badge: 'POPULAR', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800', description: 'Word, Excel, PowerPoint, Teams, and 1TB OneDrive. For business and personal use.' },
  { id: 'spotify', name: 'Spotify Premium', price: 9.99, category: 'Entertainment', badge: 'POPULAR', image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800', description: 'Ad-free music, offline listening, unlimited skips. 100M+ songs and podcasts.' },
  { id: 'nordvpn', name: 'NordVPN', price: 3.99, category: 'Security', badge: 'HOT', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800', description: 'Military-grade encryption, 5,500+ servers in 60 countries. No-logs policy.' },
];

export default function CheckoutFlow() {
  const [step, setStep] = useState<Step>('cart');
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [email, setEmail] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');

  const convertedPrice = (parseFloat(selectedProduct.price) * currency.rate).toFixed(2);
  const fee = (parseFloat(selectedProduct.price) * 0.029 + 0.30).toFixed(2);
  const total = (parseFloat(selectedProduct.price) + parseFloat(fee)).toFixed(2);
  const totalConverted = (parseFloat(total) * currency.rate).toFixed(2);

  const handleConfirm = () => {
    const id = `SD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setOrderId(id);
    setConfirmed(true);
    setStep('confirm');
  };

  const STEPS: { key: Step; label: string }[] = [
    { key: 'cart', label: 'Product' },
    { key: 'payment', label: 'Payment' },
    { key: 'confirm', label: 'Confirm' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
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
              <Link href="/payment-methods" className="text-sm text-gray-300 hover:text-white transition">How Do I Pay?</Link>
              <div className="flex items-center gap-3 px-3 py-1.5 bg-green-500/20 rounded-full border border-green-500/30">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            Secure <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Checkout</span>
          </h1>
          <p className="text-xl text-gray-400">Encrypted · Instant Delivery · Multi-Currency</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.key}>
              <button
                onClick={() => !confirmed && setStep(s.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  step === s.key
                    ? 'bg-cyan-500 text-white border border-cyan-500/50'
                    : confirmed && s.key === 'confirm'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-slate-900/50 text-gray-400 border border-white/10'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-extrabold ${
                  step === s.key ? 'bg-white text-cyan-600' : 'bg-slate-700 text-gray-300'
                }`}>
                  {i + 1}
                </span>
                {s.label}
              </button>
              {i < STEPS.length - 1 && (
                <div className="w-8 h-px bg-white/10" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step: Cart */}
        {step === 'cart' && (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Product Selector */}
            <div className="lg:col-span-3">
              <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Select Product
              </h2>
              <div className="grid sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                {PRODUCTS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
                      selectedProduct.id === p.id
                        ? 'border-cyan-500/50 bg-cyan-500/10'
                        : 'border-white/10 bg-slate-900/50 hover:border-white/30'
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs text-white truncate">{p.name}</div>
                      <div className="text-xs text-gray-400">{p.category}</div>
                    </div>
                    <div className="font-mono text-sm font-bold text-cyan-400 flex-shrink-0">
                      ${p.price}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Order Summary
              </h2>
              <div className="bg-slate-900/50 rounded-2xl p-5 border border-white/10 mb-5">
                <div className="relative h-32 rounded-xl overflow-hidden mb-4 bg-slate-800">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60"></div>
                  <div className="absolute bottom-3 left-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      selectedProduct.badge === 'HOT' ? 'bg-orange-500 text-white' :
                      selectedProduct.badge === 'NEW' ? 'bg-cyan-500 text-white' : 'bg-yellow-500 text-white'
                    }`}>
                      {selectedProduct.badge}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-white text-base mb-1">{selectedProduct.name}</h3>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed line-clamp-2">
                  {selectedProduct.description}
                </p>

                {/* Currency Selector */}
                <div className="mb-4">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Currency</div>
                  <div className="grid grid-cols-2 gap-2">
                    {CURRENCIES.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => setCurrency(c)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${
                          currency.code === c.code
                            ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400'
                            : 'border-white/10 bg-slate-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        <span>{c.flag}</span>
                        <span>{c.code}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 border-t border-white/10 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Product</span>
                    <span className="font-mono text-white font-semibold">
                      {currency.symbol}{convertedPrice}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Processing fee</span>
                    <span className="font-mono text-gray-400">
                      {currency.symbol}{(parseFloat(fee) * currency.rate).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t border-white/10 pt-2 mt-2">
                    <span className="text-white">Total</span>
                    <span className="font-mono text-cyan-400 text-lg">
                      {currency.symbol}{totalConverted}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep('payment')}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl font-bold text-base transition transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                Continue to Payment
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Step: Payment */}
        {step === 'payment' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Payment Method List */}
            <div className="space-y-3">
              {PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm.id}
                  onClick={() => setPaymentMethod(pm)}
                  className={`w-full p-4 rounded-xl border transition-all duration-300 text-left ${
                    paymentMethod.id === pm.id
                      ? 'border-cyan-500/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                      : 'border-white/10 bg-slate-900/50 hover:border-cyan-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{pm.flag}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white text-sm">{pm.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${
                            pm.region === 'India' ? 'text-blue-400 border-blue-400/30' :
                            pm.region === 'China' ? 'text-blue-400 border-blue-400/30' :
                            pm.region === 'USA' ? 'text-orange-400 border-orange-400/30' :
                            pm.region === 'Global' ? 'text-blue-400 border-blue-400/30' :
                            pm.id === 'peachpayments' ? 'text-orange-400 border-orange-400/30' :
                            'text-gray-400 border-gray-400/30'
                          }`}>
                            {pm.region === 'India' ? 'INDIA PRIMARY' :
                             pm.region === 'China' ? 'CHINA PRIMARY' :
                             pm.region === 'USA' ? 'USA PRIMARY' :
                             pm.region === 'Global' ? 'GLOBAL' :
                             pm.id === 'peachpayments' ? 'SA PRIMARY' : 'SA MARKET'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{pm.region}</p>
                      </div>
                    </div>
                    {paymentMethod.id === pm.id && (
                      <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Right: Payment Method Details */}
            <div className="lg:col-span-2">
              <div className="bg-slate-900/50 rounded-2xl border border-white/10 p-6 backdrop-blur-sm h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{paymentMethod.flag}</div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">{paymentMethod.name}</h2>
                      <p className="text-gray-400 text-sm">
                        {paymentMethod.id === 'razorpay' ? 'India Market' :
                         paymentMethod.id === 'alipay' ? 'China Market' :
                         paymentMethod.id === 'payoneer' ? 'USA Market' :
                         paymentMethod.id === 'googlepay' ? 'Global Market' : 'South Africa Market'}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-cyan-500/20 rounded-xl">
                    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 mb-6">{paymentMethod.description}</p>

                {/* Currencies */}
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">CURRENCIES</h3>
                  <div className="flex gap-2">
                    <div className="px-3 py-1.5 bg-slate-800 rounded-lg border border-white/10">
                      <span className="text-cyan-400 font-semibold text-sm">
                        {paymentMethod.id === 'razorpay' ? 'INR' :
                         paymentMethod.id === 'alipay' ? 'CNY' :
                         paymentMethod.id === 'payoneer' ? 'USD, EUR, GBP' :
                         paymentMethod.id === 'googlepay' ? 'USD, EUR, INR, ZAR' : 'ZAR'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Accepted Methods */}
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">ACCEPTED METHODS</h3>
                  <div className="flex flex-wrap gap-2">
                    {paymentMethod.id === 'razorpay' && ['UPI', 'Cards', 'Net Banking', 'Wallets'].map(m => (
                      <div key={m} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 rounded-lg border border-green-500/30">
                        <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs text-green-400">{m}</span>
                      </div>
                    ))}
                    {paymentMethod.id === 'alipay' && ['Alipay Balance', 'Bank Cards', "Yu'e Bao"].map(m => (
                      <div key={m} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 rounded-lg border border-green-500/30">
                        <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs text-green-400">{m}</span>
                      </div>
                    ))}
                    {paymentMethod.id === 'payoneer' && ['Bank Transfer', 'Card', 'Local Methods'].map(m => (
                      <div key={m} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 rounded-lg border border-green-500/30">
                        <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs text-green-400">{m}</span>
                      </div>
                    ))}
                    {paymentMethod.id === 'googlepay' && ['Credit/Debit Cards', 'Bank Accounts', 'GPay Balance'].map(m => (
                      <div key={m} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 rounded-lg border border-green-500/30">
                        <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs text-green-400">{m}</span>
                      </div>
                    ))}
                    {paymentMethod.id === 'peachpayments' && ['Credit Cards', 'Instant EFT', 'SnapScan', 'Zapper'].map(m => (
                      <div key={m} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 rounded-lg border border-green-500/30">
                        <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs text-green-400">{m}</span>
                      </div>
                    ))}
                    {paymentMethod.id === 'banktransfer' && ['EFT', 'Internet Banking', 'Capitec App'].map(m => (
                      <div key={m} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 rounded-lg border border-green-500/30">
                        <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs text-green-400">{m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bank Transfer Details */}
                {paymentMethod.id === 'banktransfer' && (
                  <div className="mb-6 p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5">
                    <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Bank Account Details
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-800 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Bank Name</div>
                        <div className="font-bold text-white text-sm">Capitec Bank</div>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Account Number</div>
                        <div className="font-mono font-bold text-cyan-400 text-sm">1975933441</div>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">SWIFT Code</div>
                        <div className="font-mono font-bold text-cyan-400 text-sm">CABLZAJJ</div>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Branch Code</div>
                        <div className="font-mono font-bold text-cyan-400 text-sm">470010</div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-3">
                      Use your order ID as payment reference. Email proof of payment to{' '}
                      <span className="text-cyan-400">payments@superdigital.store</span>
                    </p>
                  </div>
                )}

                {/* Email Field */}
                <div className="mb-6">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                    Delivery Email
                  </label>
                  <div className="relative">
                    <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-4 py-3 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-white placeholder-gray-400 outline-none focus:border-cyan-500/50 transition-colors"
                      aria-label="Email address for product delivery"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">
                    Your digital product will be delivered to this email instantly.
                  </p>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handleConfirm}
                  disabled={!email}
                  className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                    email
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white transform hover:scale-[1.02]'
                      : 'bg-slate-800 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Pay with {paymentMethod.name}
                </button>

                {/* Security Notice */}
                <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/30 flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <p className="text-xs text-green-400">
                    All transactions are encrypted with 256-bit SSL security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step: Confirmation */}
        {step === 'confirm' && confirmed && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-slate-900/50 rounded-3xl p-10 border border-green-500/30 mb-8"
              style={{ boxShadow: '0 0 60px rgba(0,255,136,0.1)' }}>
              {/* Success Icon */}
              <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-3xl font-extrabold text-white mb-2">
                Order <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Confirmed!</span>
              </h2>
              <p className="text-gray-400 mb-6">
                Your payment is being processed. Product delivery is on its way.
              </p>

              {/* Order ID */}
              <div className="bg-slate-900/50 rounded-2xl p-4 border border-white/10 mb-6">
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Order ID</div>
                <div className="font-mono text-xl font-extrabold text-cyan-400">{orderId}</div>
                <div className="text-xs text-gray-400 mt-1">Save this for your records</div>
              </div>

              {/* Details Grid */}
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-900/50 rounded-xl p-4 border border-white/10">
                  <div className="text-xs text-gray-400 mb-1">Product</div>
                  <div className="font-bold text-white text-sm">{selectedProduct.name}</div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-white/10">
                  <div className="text-xs text-gray-400 mb-1">Total Paid</div>
                  <div className="font-mono font-bold text-cyan-400 text-sm">
                    {currency.symbol}{totalConverted} {currency.code}
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-white/10">
                  <div className="text-xs text-gray-400 mb-1">Payment</div>
                  <div className="font-bold text-white text-sm">{paymentMethod.name}</div>
                </div>
              </div>

              {/* Delivery info */}
              <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 mb-8 text-left">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div className="font-bold text-white text-sm mb-1">Delivery Details</div>
                    <div className="text-xs text-gray-400 leading-relaxed">
                      Your product will be delivered to <span className="text-white font-medium">{email}</span> within
                      minutes of payment confirmation. Check your spam folder if not received.
                      {paymentMethod.id === 'banktransfer' && (
                        <span className="block mt-1 text-cyan-400">
                          For bank transfer: Email your proof of payment with order ID <strong>{orderId}</strong> to payments@superdigital.store
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/#products"
                  className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Shop More Products
                </Link>
                <Link
                  href="/"
                  className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Back to Home
                </Link>
              </div>
            </div>

            {/* Security note */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>256-bit encrypted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>PCI DSS compliant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Instant delivery</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
