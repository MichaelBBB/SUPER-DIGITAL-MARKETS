'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; // ✅ MUST BE HERE

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

      {/* STATS & SALES TRACKER (Shortened for brevity, keep your existing code here) */}
      <section className="py-12 bg-slate-900/50 border-y border-white/10"><div className="max-w-7xl mx-auto px-6"><div className="grid grid-cols-2 md:grid-cols-4 gap-8"><div className="text-center"><div className="text-3xl font-bold text-cyan-400 mb-1">30+</div><div className="text-sm text-gray-400">PRODUCTS</div></div><div className="text-center"><div className="text-3xl font-bold text-cyan-400 mb-1">4</div><div className="text-sm text-gray-400">COUNTRIES</div></div><div className="text-center"><div className="text-3xl font-bold text-cyan-400 mb-1">8+</div><div className="text-sm text-gray-400">PAYMENTS</div></div><div className="text-center"><div className="text-3xl font-bold text-cyan-400 mb-1">100%</div><div className="text-sm text-gray-400">INSTANT</div></div></div></div></section>
      
      <section className="py-20 bg-slate-950"><div className="max-w-7xl mx-auto px-6"><h2 className="text-3xl font-bold mb-10">Live Sales Tracker</h2><div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">{salesData.map((data) => (<div key={data.country} className="p-6 bg-slate-900/50 rounded-2xl border border-white/10"><div className={`text-sm font-semibold mb-2 ${data.color}`}>{data.country}</div><div className="text-3xl font-bold text-white">{data.sales.toLocaleString().replace(',', ' ')}</div></div>))}</div><div className="p-8 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-2xl border border-cyan-500/30"><div className="text-sm text-gray-400 mb-2">GLOBAL TOTAL</div><div className="text-5xl font-bold text-blue-400">{totalSales.toLocaleString().replace(',', ' ')}</div></div></div></section>

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
                    {/* ✅ FIXED: This MUST be a Link */}
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
      
      {/* PAYMENT SECTIONS (Keep your existing Payment Methods & Guide sections here) */}
      <footer className="py-12 bg-slate-900 border-t border-white/10"><div className="text-center text-gray-400">© 2024 Super Digital Markets</div></footer>
    </div>
  );
}
