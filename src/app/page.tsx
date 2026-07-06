'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePayment, setActivePayment] = useState('peach'); // Default to Peach or Capitec
  
  // ✅ UPDATED SALES TRACKER NUMBERS (From your screenshot)
  const [salesData, setSalesData] = useState([
    { country: "USA", sales: 92966, color: "text-blue-400" },
    { country: "INDIA", sales: 100288, color: "text-orange-400" },
    { country: "CHINA", sales: 97083, color: "text-red-400" },
    { country: "SOUTH AFRICA", sales: 81571, color: "text-green-400" }
  ]);

  const STORAGE_KEY = 'sales_tracker_v4'; // New key to prevent overwriting

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
          sales: item.sales + Math.floor(Math.random() * 5) // Increments faster
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const totalSales = salesData.reduce((acc, curr) => acc + curr.sales, 0);

  const products = [
    { id: 1, name: "ChatGPT Plus", price: 20.00, category: "AI Tools", tag: "HOT", tagColor: "bg-orange-500", description: "OpenAI's GPT-4 powered assistant.", image: "/images/chatgpt.jpg" },
    { id: 2, name: "Adobe Creative Cloud", price: 54.99, category: "Creative", tag: "POPULAR", tagColor: "bg-yellow-500", description: "Full suite of Adobe apps.", image: "/images/adobe-cc.jpg" },
    { id: 3, name: "Netflix Premium", price: 22.99, category: "Entertainment", tag: "HOT", tagColor: "bg-orange-500", description: "4K streaming service.", image: "/images/netflix.jpg" },
    { id: 4, name: "Microsoft 365 Business", price: 12.50, category: "Business", tag: "POPULAR", tagColor: "bg-yellow-500", description: "Office apps + 1TB OneDrive.", image: "/images/microsoft365.jpg" },
    { id: 5, name: "Spotify Premium", price: 9.99, category: "Entertainment", tag: "POPULAR", tagColor: "bg-yellow-500", description: "Ad-free music streaming.", image: "/images/spotify.jpg" },
    { id: 6, name: "NordVPN", price: 3.99, category: "Security", tag: "HOT", tagColor: "bg-orange-500", description: "Military-grade encryption.", image: "/images/nordvpn.jpg" },
    { id: 7, name: "Notion Plus", price: 8.00, category: "Productivity", tag: "POPULAR", tagColor: "bg-yellow-500", description: "All-in-one workspace.", image: "/images/notion.jpg" },
    { id: 8, name: "Figma Professional", price: 12.00, category: "Creative", tag: "HOT", tagColor: "bg-orange-500", description: "Collaborative UI/UX design.", image: "/images/figma.jpg" },
    { id: 9, name: "Dropbox Plus", price: 9.99, category: "Productivity", tag: "POPULAR", tagColor: "bg-yellow-500", description: "2TB cloud storage.", image: "/images/dropbox.jpg" },
    { id: 10, name: "Canva Pro", price: 12.99, category: "Creative", tag: "NEW", tagColor: "bg-cyan-500", description: "Premium design templates.", image: "/images/canva.jpg" },
    { id: 11, name: "Grammarly Premium", price: 12.00, category: "Productivity", tag: "POPULAR", tagColor: "bg-yellow-500", description: "AI writing assistant.", image: "/images/grammarly.jpg" },
    { id: 12, name: "Zoom Pro", price: 14.99, category: "Business", tag: "HOT", tagColor: "bg-orange-500", description: "Unlimited meetings.", image: "/images/zoom.jpg" },
    { id: 13, name: "LastPass Premium", price: 3.00, category: "Security", tag: "POPULAR", tagColor: "bg-yellow-500", description: "Secure password manager.", image: "/images/lastpass.jpg" },
    { id: 14, name: "Cursor AI Pro", price: 20.00, category: "AI Tools", tag: "NEW", tagColor: "bg-cyan-500", description: "AI-first code editor.", image: "/images/cursor.jpg" },
    { id: 15, name: "Midjourney Standard", price: 24.00, category: "AI Tools", tag: "HOT", tagColor: "bg-orange-500", description: "AI image generation.", image: "/images/midjourney.jpg" },
    { id: 16, name: "GitHub Copilot", price: 10.00, category: "AI Tools", tag: "HOT", tagColor: "bg-orange-500", description: "AI pair programmer.", image: "/images/github-copilot.jpg" },
    { id: 17, name: "Slack Pro", price: 7.25, category: "Business", tag: "POPULAR", tagColor: "bg-yellow-500", description: "Team messaging.", image: "/images/slack.jpg" },
    { id: 18, name: "Dashlane Premium", price: 4.99, category: "Security", tag: "POPULAR", tagColor: "bg-yellow-500", description: "Password manager + VPN.", image: "/images/dashlane.jpg" },
    { id: 19, name: "Adobe Photoshop", price: 22.99, category: "Creative", tag: "POPULAR", tagColor: "bg-yellow-500", description: "Industry-standard photo editing.", image: "/images/photoshop.jpg" },
    { id: 20, name: "Claude Pro", price: 20.00, category: "AI Tools", tag: "NEW", tagColor: "bg-cyan-500", description: "Advanced AI assistant.", image: "/images/claude.jpg" },
    { id: 21, name: "Adobe Premiere Pro", price: 22.99, category: "Creative", tag: "HOT", tagColor: "bg-orange-500", description: "Professional video editing.", image: "/images/premiere.jpg" },
    { id: 22, name: "Asana Premium", price: 10.99, category: "Business", tag: "POPULAR", tagColor: "bg-yellow-500", description: "Project management.", image: "/images/asana.jpg" },
    { id: 23, name: "ExpressVPN", price: 6.67, category: "Security", tag: "HOT", tagColor: "bg-orange-500", description: "Ultra-fast VPN.", image: "/images/expressvpn.jpg" },
    { id: 24, name: "YouTube Premium", price: 13.99, category: "Entertainment", tag: "POPULAR", tagColor: "bg-yellow-500", description: "Ad-free YouTube.", image: "/images/youtube-premium.jpg" },
    { id: 25, name: "1Password", price: 2.99, category: "Security", tag: "POPULAR", tagColor: "bg-yellow-500", description: "Password manager.", image: "/images/1password.jpg" },
    { id: 26, name: "Monday.com Pro", price: 9.00, category: "Business", tag: "NEW", tagColor: "bg-cyan-500", description: "Visual work OS.", image: "/images/monday.jpg" },
    { id: 27, name: "Perplexity Pro", price: 20.00, category: "AI Tools", tag: "NEW", tagColor: "bg-cyan-500", description: "AI-powered search.", image: "/images/perplexity.jpg" },
    { id: 28, name: "Loom Business", price: 12.50, category: "Productivity", tag: "POPULAR", tagColor: "bg-yellow-500", description: "Async video messaging.", image: "/images/loom.jpg" },
    { id: 29, name: "Webflow CMS", price: 14.00, category: "Business", tag: "NEW", tagColor: "bg-cyan-500", description: "No-code website builder.", image: "/images/webflow.jpg" },
    { id: 30, name: "ElevenLabs Starter", price: 5.00, category: "AI Tools", tag: "NEW", tagColor: "bg-cyan-500", description: "AI voice cloning.", image: "/images/elevenlabs.jpg" }
  ];

  const filteredProducts = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory);

  // ✅ PAYMENT PROVIDERS DATA
  const paymentProviders = [
    { 
      id: 'razorpay', name: 'Razorpay', region: 'India', tag: 'INDIA PRIMARY', tagColor: 'text-blue-400', flag: '🇮🇳',
      description: "India's leading payment gateway. UPI, Cards, Net Banking, Wallets.",
      currencies: ['INR', 'USD'],
      methods: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallets'],
      buttonColor: 'bg-blue-600 hover:bg-blue-500'
    },
    { 
      id: 'alipay', name: 'Alipay', region: 'China', tag: 'CHINA PRIMARY', tagColor: 'text-blue-400', flag: '🇨🇳',
      description: "China's dominant digital wallet. Secure escrow payments.",
      currencies: ['CNY', 'USD'],
      methods: ['Alipay Wallet', 'Bank Card', 'Balance'],
      buttonColor: 'bg-blue-500 hover:bg-blue-400'
    },
    { 
      id: 'payoneer', name: 'Payoneer', region: 'USA', tag: 'USA PRIMARY', tagColor: 'text-orange-400', flag: '🇺🇸',
      description: "Global cross-border payments. B2B and freelancer focused.",
      currencies: ['USD', 'EUR', 'GBP'],
      methods: ['Payoneer Card', 'Bank Transfer', 'e-Wallet'],
      buttonColor: 'bg-orange-600 hover:bg-orange-500'
    },
    { 
      id: 'googlepay', name: 'Google Pay', region: 'Global', tag: 'GLOBAL', tagColor: 'text-blue-400', flag: '',
      description: "Fast, secure payments using your Google account.",
      currencies: ['USD', 'EUR', 'GBP', 'INR', 'ZAR'],
      methods: ['Credit Card', 'Debit Card', 'Bank Account'],
      buttonColor: 'bg-white text-black hover:bg-gray-100'
    },
    { 
      id: 'peach', name: 'Peach Payments', region: 'South Africa', tag: 'SA PRIMARY', tagColor: 'text-orange-400', flag: '🇦',
      description: "South Africa's trusted gateway. Visa, Mastercard, Capitec Pay.",
      currencies: ['ZAR', 'USD'],
      methods: ['Visa', 'Mastercard', 'Capitec Pay', 'EFT'],
      buttonColor: 'bg-cyan-500 hover:bg-cyan-400'
    },
    { 
      id: 'capitec', name: 'Capitec Bank', region: 'South Africa', tag: 'MANUAL', tagColor: 'text-gray-400', flag: '🏦',
      description: "Direct bank transfer. No fees. Manual verification.",
      currencies: ['ZAR'],
      methods: ['EFT', 'Instant EFT', 'Capitec App'],
      buttonColor: 'bg-blue-700 hover:bg-blue-600'
    }
  ];

  const activeProvider = paymentProviders.find(p => p.id === activePayment) || paymentProviders[0];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      
      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"/><path d="M10 4a6 6 0 016 6c0 1.5-.5 2.9-1.4 4L10 10l-4.6 4A5.96 5.96 0 014 10a6 6 0 016-6z"/></svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SUPER DIGITAL</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-sm text-gray-300 hover:text-white transition">Home</a>
              <a href="#products" className="text-sm text-gray-300 hover:text-white transition">Products</a>
              <a href="#payment-methods" className="text-sm text-gray-300 hover:text-white transition">How Do I Pay?</a>
              <div className="flex items-center gap-3 px-3 py-1.5 bg-green-500/20 rounded-full border border-green-500/30">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">LIVE</span>
              </div>
              <Link href="#products" className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 rounded-full text-sm font-semibold transition flex items-center gap-2 cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                Shop Now
              </Link>
            </div>
            <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
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
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&auto=format&fit=crop')" }}>
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
          <p className="text-lg text-gray-300 max-w-2xl mb-8">From AI tools to creative software — shop in USD, pay your way, receive instantly.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="#products" className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 rounded-full font-semibold text-lg transition transform hover:scale-105 text-center">Browse Products</Link>
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-full font-semibold text-lg transition backdrop-blur-sm border border-white/20">How It Works</button>
          </div>
        </div>
      </section>

      {/* LIVE SALES TRACKER */}
      <section className="py-20 bg-slate-950 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10">Live Sales Tracker</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {salesData.map((data) => (
              <div key={data.country} className="p-6 bg-slate-900/50 rounded-2xl border border-white/10">
                <div className={`text-sm font-semibold mb-2 ${data.color}`}>{data.country}</div>
                <div className="text-3xl font-bold text-white">{data.sales.toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div className="p-8 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-2xl border border-cyan-500/30">
            <div className="text-sm text-gray-400 mb-2">GLOBAL TOTAL</div>
            <div className="text-5xl font-bold text-blue-400">{totalSales.toLocaleString()}</div>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section id="products" className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10"><h2 className="text-4xl font-bold mb-4"><span className="text-white">Top Digital</span> <span className="text-yellow-400">Products</span></h2></div>
          <div className="flex flex-wrap gap-3 mb-10">{['All', 'AI Tools', 'Creative', 'Entertainment', 'Business', 'Productivity', 'Security'].map((cat) => (<button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-sm transition ${activeCategory === cat ? 'bg-cyan-500 text-white' : 'bg-white/5 text-gray-300'}`}>{cat}</button>))}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group bg-slate-900/50 rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/50 transition">
                <div className="relative h-64 overflow-hidden bg-slate-800">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60"></div>
                  {product.tag && (<div className={`absolute top-4 left-4 px-3 py-1 ${product.tagColor} rounded-full text-xs font-bold text-white`}>{product.tag}</div>)}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-cyan-400">${product.price.toFixed(2)}</span>
                    <Link href={`/checkout?product=${product.id}`} className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 rounded-full font-semibold transition flex items-center gap-2 cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECURE PAYMENT METHODS (NEW DESIGN) */}
      <section id="payment-methods" className="py-20 bg-slate-950 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Secure Payment Methods</h2>
            <p className="text-gray-400">Choose the best option for your region. All transactions are encrypted and secure.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: Provider List */}
            <div className="lg:col-span-2 space-y-3">
              {paymentProviders.map((provider) => (
                <button 
                  key={provider.id}
                  onClick={() => setActivePayment(provider.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition text-left ${
                    activePayment === provider.id 
                      ? 'bg-slate-900 border-cyan-500/50 shadow-lg shadow-cyan-500/10' 
                      : 'bg-slate-900/50 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{provider.flag}</span>
                    <div>
                      <div className="font-bold text-white">{provider.name}</div>
                      <div className="text-xs text-gray-400">{provider.region}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full border ${provider.id === 'capitec' ? 'bg-slate-800 border-slate-700 text-gray-400' : 'bg-slate-900 border-slate-800 ' + provider.tagColor}`}>
                      {provider.tag}
                    </span>
                    {activePayment === provider.id && (
                      <div className="w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Right: Active Provider Details */}
            <div className="lg:col-span-3">
              <div className="bg-slate-900 rounded-2xl p-8 border border-white/10 h-full">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{activeProvider.flag}</span>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{activeProvider.name}</h3>
                      <p className="text-gray-400">{activeProvider.region} Market</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border border-white/10">
                    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  </div>
                </div>

                <p className="text-gray-300 mb-6">{activeProvider.description}</p>

                <div className="mb-6">
                  <div className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">Currencies</div>
                  <div className="flex gap-2">
                    {activeProvider.currencies.map(c => (
                      <span key={c} className="px-3 py-1 bg-slate-800 rounded-full text-sm font-mono text-cyan-400 border border-cyan-500/20">{c}</span>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <div className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">Accepted Methods</div>
                  <div className="flex flex-wrap gap-2">
                    {activeProvider.methods.map(m => (
                      <div key={m} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg text-sm text-gray-300 border border-white/5">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        {m}
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (activeProvider.id === 'capitec') {
                      alert('Select a product first to see bank details!');
                    } else if (activeProvider.id === 'peach') {
                      alert('Select a product and go to Checkout to pay with Peach Payments!');
                    } else {
                      alert(`${activeProvider.name} integration coming soon!`);
                    }
                  }}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 ${activeProvider.buttonColor}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Pay with {activeProvider.name}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-slate-900 border-t border-white/10"><div className="text-center text-gray-400">© 2024 Super Digital Markets. All rights reserved.</div></footer>
    </div>
  );
}
