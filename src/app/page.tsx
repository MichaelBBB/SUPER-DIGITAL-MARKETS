'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePayment, setActivePayment] = useState('capitec');
  
  const [salesData, setSalesData] = useState([
    { country: "USA", sales: 35791, color: "text-blue-400" },
    { country: "INDIA", sales: 43191, color: "text-orange-400" },
    { country: "CHINA", sales: 39655, color: "text-red-400" },
    { country: "SOUTH AFRICA", sales: 24248, color: "text-green-400" }
  ]);

  const STORAGE_KEY = 'superDigitalSales_v3';

  useEffect(() => {
    const savedSales = localStorage.getItem(STORAGE_KEY);
    if (savedSales) {
      try {
        const parsed = JSON.parse(savedSales);
        setSalesData(parsed);
      } catch (e) {
        console.error('Failed to load sales data:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(salesData));
  }, [salesData]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSalesData(prevData => 
        prevData.map(item => ({
          ...item,
          sales: item.sales + Math.floor(Math.random() * 3)
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const totalSales = salesData.reduce((acc, curr) => acc + curr.sales, 0);

  const products = [
    { id: 1, name: "ChatGPT Plus", price: 20.00, category: "AI Tools", tag: "HOT", tagColor: "bg-orange-500", description: "OpenAI's GPT-4 powered assistant. Advanced reasoning, image generation, and browsing included.", image: "/images/chatgpt.jpg" },
    { id: 2, name: "Adobe Creative Cloud", price: 54.99, category: "Creative", tag: "POPULAR", tagColor: "bg-yellow-500", description: "Full suite of Adobe apps — Photoshop, Illustrator, Premiere Pro, and 20+ more.", image: "/images/adobe-cc.jpg" },
    { id: 3, name: "Netflix Premium", price: 22.99, category: "Entertainment", tag: "HOT", tagColor: "bg-orange-500", description: "4K streaming, 4 simultaneous screens, offline downloads. 10,000+ titles worldwide.", image: "/images/netflix.jpg" },
    { id: 4, name: "Microsoft 365 Business", price: 12.50, category: "Business", tag: "POPULAR", tagColor: "bg-yellow-500", description: "Word, Excel, PowerPoint, Teams, and 1TB OneDrive. For business and personal use.", image: "/images/microsoft365.jpg" },
    { id: 5, name: "Spotify Premium", price: 9.99, category: "Entertainment", tag: "POPULAR", tagColor: "bg-yellow-500", description: "Ad-free music, offline listening, unlimited skips. 100M+ songs and podcasts.", image: "/images/spotify.jpg" },
    { id: 6, name: "NordVPN", price: 3.99, category: "Security", tag: "HOT", tagColor: "bg-orange-500", description: "Military-grade encryption, 5,500+ servers in 60 countries. No-logs policy.", image: "/images/nordvpn.jpg" },
    { id: 7, name: "Notion Plus", price: 8.00, category: "Productivity", tag: "POPULAR", tagColor: "bg-yellow-500", description: "All-in-one workspace for notes, wikis, databases, and project management.", image: "/images/notion.jpg" },
    { id: 8, name: "Figma Professional", price: 12.00, category: "Creative", tag: "HOT", tagColor: "bg-orange-500", description: "Collaborative UI/UX design tool. Real-time multiplayer, unlimited projects, dev mode.", image: "/images/figma.jpg" },
    { id: 9, name: "Dropbox Plus", price: 9.99, category: "Productivity", tag: "POPULAR", tagColor: "bg-yellow-500", description: "2TB cloud storage, Smart Sync, version history, and secure file sharing.", image: "/images/dropbox.jpg" },
    { id: 10, name: "Canva Pro", price: 12.99, category: "Creative", tag: "NEW", tagColor: "bg-cyan-500", description: "Premium design templates, Brand Kit, background remover, and 100M+ stock assets.", image: "/images/canva.jpg" },
    { id: 11, name: "Grammarly Premium", price: 12.00, category: "Productivity", tag: "POPULAR", tagColor: "bg-yellow-500", description: "AI writing assistant with advanced grammar, clarity, and plagiarism detection.", image: "/images/grammarly.jpg" },
    { id: 12, name: "Zoom Pro", price: 14.99, category: "Business", tag: "HOT", tagColor: "bg-orange-500", description: "Unlimited meetings up to 30 hours, 100 participants, cloud recording, admin controls.", image: "/images/zoom.jpg" },
    { id: 13, name: "LastPass Premium", price: 3.00, category: "Security", tag: "POPULAR", tagColor: "bg-yellow-500", description: "Secure password manager with dark web monitoring, 1GB encrypted storage.", image: "/images/lastpass.jpg" },
    { id: 14, name: "Cursor AI Pro", price: 20.00, category: "AI Tools", tag: "NEW", tagColor: "bg-cyan-500", description: "AI-first code editor built on VS Code. Write, edit, and debug with GPT-4 natively.", image: "/images/cursor.jpg" },
    { id: 15, name: "Midjourney Standard", price: 24.00, category: "AI Tools", tag: "HOT", tagColor: "bg-orange-500", description: "AI image generation. 15 GPU hours/month, unlimited relaxed generations.", image: "/images/midjourney.jpg" },
    { id: 16, name: "GitHub Copilot", price: 10.00, category: "AI Tools", tag: "HOT", tagColor: "bg-orange-500", description: "AI pair programmer. Real-time code suggestions, multi-language support.", image: "/images/github-copilot.jpg" },
    { id: 17, name: "Slack Pro", price: 7.25, category: "Business", tag: "POPULAR", tagColor: "bg-yellow-500", description: "Team messaging with unlimited message history, Huddles, and 10+ app integrations.", image: "/images/slack.jpg" },
    { id: 18, name: "Dashlane Premium", price: 4.99, category: "Security", tag: "POPULAR", tagColor: "bg-yellow-500", description: "Password manager with VPN, dark web monitoring, and phishing alerts.", image: "/images/dashlane.jpg" },
    { id: 19, name: "Adobe Photoshop", price: 22.99, category: "Creative", tag: "POPULAR", tagColor: "bg-yellow-500", description: "Industry-standard photo editing and compositing. AI-powered tools, Neural Filters.", image: "/images/photoshop.jpg" },
    { id: 20, name: "Claude Pro", price: 20.00, category: "AI Tools", tag: "NEW", tagColor: "bg-cyan-500", description: "Anthropic's advanced AI assistant. 200K context window, priority access.", image: "/images/claude.jpg" },
    { id: 21, name: "Adobe Premiere Pro", price: 22.99, category: "Creative", tag: "HOT", tagColor: "bg-orange-500", description: "Professional video editing with AI auto-reframe, speech-to-text, and Lumetri color.", image: "/images/premiere.jpg" },
    { id: 22, name: "Asana Premium", price: 10.99, category: "Business", tag: "POPULAR", tagColor: "bg-yellow-500", description: "Project management with Gantt charts, workflow automation, and advanced reporting.", image: "/images/asana.jpg" },
    { id: 23, name: "ExpressVPN", price: 6.67, category: "Security", tag: "HOT", tagColor: "bg-orange-500", description: "Ultra-fast VPN with 3,000+ servers, split tunneling, and 24/7 support.", image: "/images/expressvpn.jpg" },
    { id: 24, name: "YouTube Premium", price: 13.99, category: "Entertainment", tag: "POPULAR", tagColor: "bg-yellow-500", description: "Ad-free YouTube, background play, offline downloads, and YouTube Music included.", image: "/images/youtube-premium.jpg" },
    { id: 25, name: "1Password", price: 2.99, category: "Security", tag: "POPULAR", tagColor: "bg-yellow-500", description: "Password manager with Travel Mode, Watchtower security alerts, and family sharing.", image: "/images/1password.jpg" },
    { id: 26, name: "Monday.com Pro", price: 9.00, category: "Business", tag: "NEW", tagColor: "bg-cyan-500", description: "Visual work OS with automations, integrations, and real-time collaboration dashboards.", image: "/images/monday.jpg" },
    { id: 27, name: "Perplexity Pro", price: 20.00, category: "AI Tools", tag: "NEW", tagColor: "bg-cyan-500", description: "AI-powered search engine with real-time web access, citations, and image generation.", image: "/images/perplexity.jpg" },
    { id: 28, name: "Loom Business", price: 12.50, category: "Productivity", tag: "POPULAR", tagColor: "bg-yellow-500", description: "Async video messaging. Screen + cam recording, AI summaries, team workspace.", image: "/images/loom.jpg" },
    { id: 29, name: "Webflow CMS", price: 14.00, category: "Business", tag: "NEW", tagColor: "bg-cyan-500", description: "No-code website builder with CMS, hosting, and custom domain. Export clean code.", image: "/images/webflow.jpg" },
    { id: 30, name: "ElevenLabs Starter", price: 5.00, category: "AI Tools", tag: "NEW", tagColor: "bg-cyan-500", description: "AI voice cloning and text-to-speech. 30,000 characters/month, 10+ voice styles.", image: "/images/elevenlabs.jpg" }
  ];

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const paymentMethods = [
    { id: 'razorpay', name: 'Razorpay', region: 'India', tag: 'INDIA PRIMARY', tagColor: 'bg-blue-900/50 text-blue-400 border-blue-800', flag: '🇳' },
    { id: 'alipay', name: 'Alipay', region: 'China', tag: 'CHINA PRIMARY', tagColor: 'bg-blue-900/50 text-blue-400 border-blue-800', flag: '🇨🇳' },
    { id: 'payoneer', name: 'Payoneer', region: 'USA', tag: 'USA PRIMARY', tagColor: 'bg-red-900/50 text-red-400 border-red-800', flag: '🇺' },
    { id: 'googlepay', name: 'Google Pay', region: 'Global', tag: 'GLOBAL', tagColor: 'bg-blue-900/50 text-blue-400 border-blue-800', flag: '🌍' },
    { id: 'peach', name: 'Peach Payments', region: 'South Africa', tag: 'SA PRIMARY', tagColor: 'bg-orange-900/50 text-orange-400 border-orange-800', flag: '🇦' },
    { id: 'capitec', name: 'Capitec Bank Transfer', region: 'South Africa', tag: 'MANUAL', tagColor: 'bg-slate-800 text-slate-400 border-slate-700', flag: '🏦' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      
      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
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

            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-sm text-gray-300 hover:text-white transition">Home</a>
              <a href="#products" className="text-sm text-gray-300 hover:text-white transition">Products</a>
              <a href="#payment-methods" className="text-sm text-gray-300 hover:text-white transition">How Do I Pay?</a>
              <div className="flex items-center gap-3 px-3 py-1.5 bg-green-500/20 rounded-full border border-green-500/30">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">LIVE</span>
              </div>
              {/* ✅ FIXED: Shop Now is now a Link */}
              <Link 
                href="#products" 
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 rounded-full text-sm font-semibold transition flex items-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Shop Now
              </Link>
            </div>

            <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-2">
              <a href="#" className="block px-4 py-2 hover:bg-white/5 rounded-lg">Home</a>
              <a href="#products" className="block px-4 py-2 hover:bg-white/5 rounded-lg">Products</a>
              <a href="#payment-methods" className="block px-4 py-2 hover:bg-white/5 rounded-lg">How Do I Pay?</a>
            </div>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">LIVE GLOBAL MARKETPLACE</span>
            <span className="text-sm text-gray-400">USA • India • China • South Africa</span>
          </div>

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
            <Link href="#products" className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 rounded-full font-semibold text-lg transition transform hover:scale-105 text-center">
              Browse Products
            </Link>
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-full font-semibold text-lg transition backdrop-blur-sm border border-white/20">
              How It Works
            </button>
          </div>
        </div>

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
            <div className="text-center"><div className="text-3xl font-bold text-cyan-400 mb-1">30+</div><div className="text-sm text-gray-400">PRODUCTS AVAILABLE</div></div>
            <div className="text-center"><div className="text-3xl font-bold text-cyan-400 mb-1">4</div><div className="text-sm text-gray-400">COUNTRIES SERVED</div></div>
            <div className="text-center"><div className="text-3xl font-bold text-cyan-400 mb-1">8+</div><div className="text-sm text-gray-400">PAYMENT METHODS</div></div>
            <div className="text-center"><div className="text-3xl font-bold text-cyan-400 mb-1">100%</div><div className="text-sm text-gray-400">INSTANT DELIVERY</div></div>
          </div>
        </div>
      </section>

      {/* LIVE SALES TRACKER */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10">Live Sales Tracker</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {salesData.map((data) => (
              <div key={data.country} className="p-6 bg-slate-900/50 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-cyan-500/30 transition duration-300">
                <div className={`text-sm font-semibold mb-2 ${data.color}`}>{data.country}</div>
                <div className="text-3xl font-bold text-white tabular-nums">
                  {data.sales.toLocaleString().replace(',', ' ')}
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-2xl border border-cyan-500/30">
            <div className="text-sm text-gray-400 mb-2">GLOBAL TOTAL (TODAY)</div>
            <div className="text-5xl font-bold text-blue-400 tabular-nums">
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
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  activeCategory === cat 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
            <div className="ml-auto px-6 py-2 rounded-full text-sm text-cyan-400 border border-cyan-500/30 flex items-center gap-2">
              View All 30
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group bg-slate-900/50 rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/50 transition duration-300 hover:transform hover:-translate-y-2">
                <div className="relative h-64 overflow-hidden bg-slate-800">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60"></div>
                  
                  {product.tag && (
                    <div className={`absolute top-4 left-4 px-3 py-1 ${product.tagColor} rounded-full text-xs font-bold text-white`}>
                      {product.tag}
                    </div>
                  )}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                    {product.category}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs">🇺</span>
                    <span className="text-xs">🇮🇳</span>
                    <span className="text-xs">🇨🇳</span>
                    <span className="text-xs text-gray-500 ml-2">Available in these markets</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-cyan-400">${product.price.toFixed(2)}</span>
                    
                    {/* ✅ FIXED: Buy Now is now a Link */}
                    <Link 
                      href={`/checkout?product=${product.id}`}
                      className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 rounded-full font-semibold transition transform hover:scale-105 flex items-center gap-2 cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Buy Now – ${product.price.toFixed(2)}
                    </Link>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAYMENT METHODS SECTION */}
      <section id="payment-methods" className="py-20 bg-slate-950 border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6">
          
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-semibold mb-4">
              SECURE PAYMENTS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Select Payment</span>
              <span className="text-yellow-400"> Method</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Choose the best option for your region
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: Payment Method List */}
            <div className="lg:col-span-5 space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setActivePayment(method.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                    activePayment === method.id
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
                    {activePayment === method.id && (
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

            {/* RIGHT: Payment Details Panel */}
            <div className="lg:col-span-7">
              <div className="p-8 bg-slate-900/50 rounded-2xl border border-slate-800 backdrop-blur-sm h-full">
                
                {activePayment === 'capitec' && (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                          🇿 Capitec Bank Transfer
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
                      <div>
                        <div className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wider">
                          Currencies
                        </div>
                        <div className="text-xl font-mono text-white">
                          ZAR (South African Rand)
                        </div>
                      </div>

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

                      <button className="w-full mt-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Pay with Capitec Bank Transfer
                      </button>
                    </div>
                  </>
                )}

                {activePayment !== 'capitec' && (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4 opacity-50">{paymentMethods.find(m => m.id === activePayment)?.flag}</div>
                    <h3 className="text-xl font-bold text-gray-300 mb-2">
                      {paymentMethods.find(m => m.id === activePayment)?.name}
                    </h3>
                    <p className="text-gray-500">Integration details coming soon...</p>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PAYMENT GUIDE SECTION */}
      <section className="py-20 bg-slate-950 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-semibold mb-4">
              HOW IT WORKS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Payment</span>
              <span className="text-yellow-400"> Guide</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Follow these simple steps to complete your purchase securely.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* LEFT: The 4 Steps */}
            <div className="space-y-4">
              
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

            {/* RIGHT: Capitec Bank Details Card */}
            <div className="space-y-6">
              
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl shadow-cyan-500/5">
                
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

              {/* Accepted Methods Footer */}
              <div className="bg-slate-900/30 rounded-2xl p-6 border border-slate-800">
                <div className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-4">All Accepted Payment Methods</div>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full text-xs text-gray-300 border border-slate-700">Razorpay 🇳</div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full text-xs text-gray-300 border border-slate-700">Alipay 🇨</div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full text-xs text-gray-300 border border-slate-700">Payoneer 🇺🇸</div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full text-xs text-gray-300 border border-slate-700">Google Pay 🌍</div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full text-xs text-gray-300 border border-slate-700">Peach Payments 🇦</div>
                </div>
              </div>

            </div>

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
