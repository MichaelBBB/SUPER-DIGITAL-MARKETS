'use client';

import { useState } from 'react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const products = [
    { 
      id: 1, 
      name: "ChatGPT Plus", 
      price: 20.00, 
      category: "AI Tools",
      tag: "HOT",
      tagColor: "bg-orange-500",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop"
    },
    { 
      id: 2, 
      name: "Adobe Creative Cloud", 
      price: 54.99, 
      category: "Creative",
      tag: "POPULAR",
      tagColor: "bg-yellow-500",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop"
    },
    { 
      id: 3, 
      name: "Netflix Premium", 
      price: 22.99, 
      category: "Entertainment",
      tag: "HOT",
      tagColor: "bg-orange-500",
      image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop"
    },
    { 
      id: 4, 
      name: "Midjourney Pro", 
      price: 30.00, 
      category: "AI Tools",
      tag: "NEW",
      tagColor: "bg-blue-500",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop"
    },
    { 
      id: 5, 
      name: "Spotify Premium", 
      price: 9.99, 
      category: "Entertainment",
      tag: null,
      tagColor: null,
      image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&auto=format&fit=crop"
    },
    { 
      id: 6, 
      name: "Notion Pro", 
      price: 8.00, 
      category: "Productivity",
      tag: "POPULAR",
      tagColor: "bg-yellow-500",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop"
    }
  ];

  const salesData = [
    { country: "USA", sales: 14969, color: "text-blue-400" },
    { country: "INDIA", sales: 22413, color: "text-orange-400" },
    { country: "CHINA", sales: 18731, color: "text-red-400" },
    { country: "SOUTH AFRICA", sales: 3468, color: "text-green-400" }
  ];

  const totalSales = salesData.reduce((acc, curr) => acc + curr.sales, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      
      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"/>
                  <path d="M10 4a6 6 0 016 6c0 1.5-.5 2.9-1.4 4L10 10l-4.6 4A5.96 5.96 0 014 10a6 6 0 016-6z"/>
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                SUPER DIGITAL
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-6 px-6 py-2 bg-white/5 rounded-full border border-white/10">
                <a href="#" className="text-sm text-gray-300 hover:text-white transition">Home</a>
                <a href="#products" className="text-sm text-gray-300 hover:text-white transition">Products</a>
                <a href="#checkout" className="text-sm text-gray-300 hover:text-white transition">Checkout</a>
              </div>
              <div className="flex items-center gap-3 px-3 py-1.5 bg-green-500/20 rounded-full border border-green-500/30">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">LIVE</span>
              </div>
              <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 rounded-full text-sm font-semibold transition flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Shop Now
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-2">
              <a href="#" className="block px-4 py-2 hover:bg-white/5 rounded-lg">Home</a>
              <a href="#products" className="block px-4 py-2 hover:bg-white/5 rounded-lg">Products</a>
              <a href="#checkout" className="block px-4 py-2 hover:bg-white/5 rounded-lg">Checkout</a>
            </div>
          )}
        </div>
      </nav>

      {/* HERO SECTION WITH EARTH BACKGROUND */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Earth Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
          {/* Live Marketplace Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">LIVE GLOBAL MARKETPLACE</span>
            <span className="text-sm text-gray-400">USA • India • China • South Africa</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            <span className="block text-white">The World's</span>
            <span className="block text-cyan-400">Top 30</span>
            <span className="block text-white">Digital Products</span>
            <span className="block text-yellow-400">Delivered Instantly.</span>
          </h1>

          <p className="text-lg text-gray-300 max-w-2xl mb-8">
            From AI tools to creative software — shop in USD, pay your way, receive instantly. 
            Trusted by buyers across 3 continents.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 rounded-full font-semibold text-lg transition transform hover:scale-105">
              Browse Products
            </button>
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-full font-semibold text-lg transition backdrop-blur-sm border border-white/20">
              How It Works
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-12 bg-slate-900/50 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-1">30+</div>
              <div className="text-sm text-gray-400">PRODUCTS AVAILABLE</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-1">3</div>
              <div className="text-sm text-gray-400">COUNTRIES SERVED</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-1">8+</div>
              <div className="text-sm text-gray-400">PAYMENT METHODS</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-1">100%</div>
              <div className="text-sm text-gray-400">INSTANT DELIVERY</div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE SALES TRACKER */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10">Live Sales Tracker</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {salesData.map((data) => (
              <div key={data.country} className="p-6 bg-slate-900/50 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className={`text-sm font-semibold mb-2 ${data.color}`}>{data.country}</div>
                <div className="text-3xl font-bold text-white">
                  {data.sales.toLocaleString().replace(',', ' ')}
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-2xl border border-cyan-500/30">
            <div className="text-sm text-gray-400 mb-2">GLOBAL TOTAL (TODAY)</div>
            <div className="text-5xl font-bold text-blue-400">
              {totalSales.toLocaleString().replace(',', ' ')}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section id="products" className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <div className="text-sm text-cyan-400 mb-2">FEATURED SELECTION</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Top Digital</span>
              <span className="text-yellow-400"> Products</span>
            </h2>
            <p className="text-gray-400 max-w-xl">
              Handpicked bestsellers across every category. Instant delivery worldwide.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-10">
            {['All', 'AI Tools', 'Creative', 'Entertainment', 'Business', 'Productivity', 'Security'].map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  cat === 'All' 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
            <button className="ml-auto px-6 py-2 rounded-full text-sm text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 transition flex items-center gap-2">
              View All 30
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group bg-slate-900/50 rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/50 transition duration-300 hover:transform hover:-translate-y-2">
                {/* Product Image */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60"></div>
                  
                  {/* Tags */}
                  {product.tag && (
                    <div className={`absolute top-4 left-4 px-3 py-1 ${product.tagColor} rounded-full text-xs font-bold text-white`}>
                      {product.tag}
                    </div>
                  )}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                    {product.category}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-cyan-400">${product.price.toFixed(2)}</span>
                    <button className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 rounded-full font-semibold transition transform hover:scale-105">
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-slate-900 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
          <p>&copy; 2024 Super Digital Markets. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
