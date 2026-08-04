'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        
        {/* Background Effect */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        {/* Content */}
        <div className={`relative z-10 max-w-6xl mx-auto px-6 text-center transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          
          <nav className="flex justify-between items-center mb-16">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center font-bold text-xl">
                SD
              </div>
              <span className="text-2xl font-bold tracking-tight">SUPER DIGITAL</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
              <Link href="/products" className="hover:text-blue-400 transition-colors">Products</Link>
              <Link href="/checkout" className="hover:text-blue-400 transition-colors">Checkout</Link>
              
              <Link 
                href="/payment"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Shop Now
              </Link>
            </div>
            
            <div className="md:hidden">
              <Link href="/payment" className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-semibold">
                Pay Now
              </Link>
            </div>
          </nav>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="block text-white">The World&apos;s</span>
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Top 30
            </span>
            <span className="block text-white mt-2">Digital Products</span>
            <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent mt-4">
              Delivered Instantly.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            From AI tools to creative software — shop in USD, pay your way, receive instantly. Trusted by buyers across 3 continents.
          </p>

          {/* Global Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full mb-12">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-300">
              LIVE GLOBAL MARKETPLACE
            </span>
            <span className="mx-2 text-gray-500">•</span>
            <span className="text-sm text-gray-400">USA • India • China • South Africa</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/payment"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl flex items-center gap-2"
            >
              Start Shopping
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a 
              href="#features"
              className="px-8 py-4 border border-gray-600 hover:border-gray-400 rounded-xl font-semibold transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 bg-gray-900/50 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50 hover:border-blue-500/50 transition-colors">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-3xl mb-6">
                ⚡
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Instant Delivery</h3>
              <p className="text-gray-400">Get your digital products immediately after payment confirmation.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50 hover:border-cyan-500/50 transition-colors">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-3xl mb-6">
                🌍
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Global Marketplace</h3>
              <p className="text-gray-400">Serving customers across USA, India, China, and South Africa.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50 hover:border-green-500/50 transition-colors">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-3xl mb-6">
                🔒
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Secure Payments</h3>
              <p className="text-gray-400">Powered by Peach Payments with multiple local payment methods.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-500">
          <p>© 2026 Super Digital Markets. All rights reserved.</p>
          <p className="mt-2 text-sm">Payments processed securely via Peach Payments API</p>
        </div>
      </footer>
    </>
  );
}
