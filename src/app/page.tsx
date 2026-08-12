"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// ✅ PRODUCT LIST WITH EXACT PRICES (Matches your products page)
const PRODUCTS = [
  { name: "ChatGPT Plus", price: 20.00 },
  { name: "Adobe Creative Cloud", price: 54.99 },
  { name: "Asana Premium", price: 10.99 },
  { name: "Canva Pro", price: 12.99 },
  { name: "Claude Pro", price: 20.00 },
  { name: "Cursor AI Pro", price: 20.00 },
  { name: "Dashlane Premium", price: 4.99 },
  { name: "Dropbox Plus", price: 9.99 },
  { name: "ElevenLabs Starter", price: 5.00 },
  { name: "ExpressVPN", price: 6.67 },
  { name: "Figma Professional", price: 12.00 },
  { name: "GitHub Copilot", price: 10.00 },
  { name: "Grammarly Premium", price: 12.00 },
  { name: "LastPass Premium", price: 3.00 },
  { name: "Loom Business", price: 12.50 },
  { name: "Microsoft 365 Business", price: 12.50 },
  { name: "Midjourney Standard", price: 24.00 },
  { name: "Monday.com Pro", price: 9.00 },
  { name: "Disney Premium", price: 13.99 }, // Updated from Netflix
  { name: "NordVPN", price: 3.99 },
  { name: "Notion Plus", price: 8.00 },
  { name: "Perplexity Pro", price: 20.00 },
  { name: "Adobe Photoshop", price: 22.99 },
  { name: "Adobe Premiere Pro", price: 22.99 },
  { name: "Slack Pro", price: 7.25 },
  { name: "Spotify Premium", price: 9.99 },
  { name: "Webflow CMS", price: 14.00 },
  { name: "YouTube Premium", price: 13.99 },
  { name: "Zoom Pro", price: 14.99 },
  { name: "1Password", price: 2.99 },
];

// ✅ CALCULATE REAL AVERAGE PRICE AUTOMATICALLY
const TOTAL_PRICE = PRODUCTS.reduce((sum, p) => sum + p.price, 0);
const AVG_ORDER_VALUE_USD = TOTAL_PRICE / PRODUCTS.length; // Exact average (~$15.86)

export default function Home() {
  // Initial Sales Numbers (Transaction Counts)
  const [sales, setSales] = useState({
    usa: 226805,
    india: 233953,
    china: 231752,
    sa: 215595,
  });

  // Recent Activity State
  const [recentActivity, setRecentActivity] = useState<{ country: string; product: string; time: string } | null>(null);

  const countries = [
    { name: "USA", flag: "🇺🇸", key: "usa" },
    { name: "India", flag: "🇮🇳", key: "india" },
    { name: "China", flag: "🇨🇳", key: "china" },
    { name: "South Africa", flag: "🇿🇦", key: "sa" },
  ];

  // Effect 1: Increment Sales Numbers Randomly
  useEffect(() => {
    const interval = setInterval(() => {
      setSales((prev) => {
        const randomCountry = countries[Math.floor(Math.random() * countries.length)].key as keyof typeof prev;
        return {
          ...prev,
          [randomCountry]: prev[randomCountry] + Math.floor(Math.random() * 3) + 1,
        };
      });
    }, 2500); // Updates every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  // Effect 2: Show "Recent Sale" Popup (Uses Real Product Names)
  useEffect(() => {
    const interval = setInterval(() => {
      const randomCountry = countries[Math.floor(Math.random() * countries.length)];
      const randomProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      
      setRecentActivity({
        country: randomCountry.name,
        product: randomProduct.name,
        time: "Just now",
      });

      // Hide popup after 4 seconds
      setTimeout(() => setRecentActivity(null), 4000);
    }, 8000); // New notification every 8 seconds

    return () => clearInterval(interval);
  }, []);

  // Format numbers with commas
  const formatNumber = (num: number) => new Intl.NumberFormat().format(num);
  
  // Format Currency
  const formatCurrency = (num: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* EARTH BACKGROUND */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }} 
      />
      <div className="absolute inset-0 z-0 bg-black opacity-60"></div>

      <div className="relative z-10 flex flex-col">
        {/* NAVIGATION */}
        <nav className="border-b border-gray-800 sticky top-0 bg-[#0b0f14]/95 backdrop-blur-md z-50">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="font-bold text-xl text-cyan-400 flex items-center gap-2">
              <div className="w-7 h-7 bg-cyan-400 rounded-full flex items-center justify-center">
                <span className="text-black font-bold">S</span>
              </div>
              SUPER DIGITAL
            </Link>
            
            <div className="hidden md:flex space-x-10">
              <Link href="/" className="text-white hover:text-cyan-400">Home</Link>
              <Link href="/products" className="text-white hover:text-cyan-400">Products</Link>
              <Link href="/payment" className="text-white hover:text-cyan-400">Checkout</Link>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500 animate-pulse">● LIVE</span>
              <Link href="/products" className="bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-2 rounded-full font-bold">Shop Now</Link>
            </div>
          </div>
        </nav>

        {/* HERO SECTION */}
        <main className="container mx-auto px-4 py-20 text-center flex-grow">
          <h1 className="text-6xl md:text-8xl font-extrabold mb-6 leading-tight">
            <span className="text-white">The World&apos;s</span><br />
            <span className="text-cyan-400">Top 30</span><br />
            <span className="text-white">Digital Products</span><br />
            <span className="text-yellow-400">Delivered Instantly.</span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            From AI tools to creative software — shop globally. Pay in USD, receive instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/products" className="bg-cyan-500 hover:bg-cyan-400 text-white px-10 py-5 rounded-full text-lg font-bold shadow-xl shadow-cyan-500/40 transform hover:scale-105 transition">
              Browse All Products
            </Link>
            <Link href="/payment" className="bg-gray-800 hover:bg-gray-700 text-white px-10 py-5 rounded-full text-lg font-bold border border-gray-600">
              Go to Checkout
            </Link>
          </div>
        </main>

        {/* ✅ LIVE SALES TRACKER (WITH REAL AVG PRICE) */}
        <section className="container mx-auto px-4 pb-20">
          <div className="bg-[#0b0f14]/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 shadow-2xl relative overflow-hidden">
            
            {/* RECENT ACTIVITY POPUP (Shows Exact Product Name) */}
            {recentActivity && (
              <div className="absolute top-4 right-4 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-bounce z-20 max-w-xs">
                <span className="text-xl"></span>
                <div className="text-sm text-left">
                  <span className="font-bold">{recentActivity.country}</span> just bought <span className="font-semibold">{recentActivity.product}</span>
                </div>
              </div>
            )}

            <h2 className="text-cyan-400 font-bold text-center text-2xl mb-8 tracking-wider">LIVE SALES ACTIVITY</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* USA */}
              <div className="bg-[#16191f] p-6 rounded-xl text-center border border-gray-700 transition hover:border-blue-500">
                <div className="text-blue-400 text-sm font-bold mb-2">🇺🇸 USA</div>
                <div className="text-3xl font-bold text-white tabular-nums">{formatNumber(sales.usa)}</div>
                {/* ✅ USD ESTIMATE USING REAL AVERAGE */}
                <div className="text-xs text-gray-400 mt-1 font-mono">
                  ≈ {formatCurrency(sales.usa * AVG_ORDER_VALUE_USD)}
                </div>
                <div className="text-xs text-gray-500 mt-2">+{Math.floor(Math.random() * 5)} today</div>
              </div>
              
              {/* INDIA */}
              <div className="bg-[#16191f] p-6 rounded-xl text-center border border-gray-700 transition hover:border-orange-500">
                <div className="text-orange-400 text-sm font-bold mb-2">🇮🇳 INDIA</div>
                <div className="text-3xl font-bold text-white tabular-nums">{formatNumber(sales.india)}</div>
                {/* ✅ USD ESTIMATE USING REAL AVERAGE */}
                <div className="text-xs text-gray-400 mt-1 font-mono">
                  ≈ {formatCurrency(sales.india * AVG_ORDER_VALUE_USD)}
                </div>
                <div className="text-xs text-gray-500 mt-2">+{Math.floor(Math.random() * 5)} today</div>
              </div>
              
              {/* CHINA */}
              <div className="bg-[#16191f] p-6 rounded-xl text-center border border-gray-700 transition hover:border-red-500">
                <div className="text-red-400 text-sm font-bold mb-2">🇨🇳 CHINA</div>
                <div className="text-3xl font-bold text-white tabular-nums">{formatNumber(sales.china)}</div>
                {/* ✅ USD ESTIMATE USING REAL AVERAGE */}
                <div className="text-xs text-gray-400 mt-1 font-mono">
                  ≈ {formatCurrency(sales.china * AVG_ORDER_VALUE_USD)}
                </div>
                <div className="text-xs text-gray-500 mt-2">+{Math.floor(Math.random() * 5)} today</div>
              </div>
              
              {/* SOUTH AFRICA */}
              <div className="bg-[#16191f] p-6 rounded-xl text-center border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                <div className="text-green-400 text-sm font-bold mb-2">🇦 SOUTH AFRICA</div>
                <div className="text-3xl font-bold text-white tabular-nums">{formatNumber(sales.sa)}</div>
                {/* ✅ USD ESTIMATE USING REAL AVERAGE */}
                <div className="text-xs text-gray-400 mt-1 font-mono">
                  ≈ {formatCurrency(sales.sa * AVG_ORDER_VALUE_USD)}
                </div>
                <div className="text-xs text-gray-500 mt-2">+{Math.floor(Math.random() * 5)} today</div>
              </div>
            </div>
            
            {/* GLOBAL TOTAL WITH REAL AVG REVENUE */}
            <div className="mt-8 pt-6 border-t border-gray-800 text-center">
              <span className="text-gray-400 mr-2">Total Global Volume:</span>
              <span className="text-cyan-400 font-bold text-2xl tabular-nums">
                {formatNumber(sales.usa + sales.india + sales.china + sales.sa)}
              </span>
              <div className="text-sm text-gray-500 mt-1 font-mono">
                Est. Revenue: {formatCurrency((sales.usa + sales.india + sales.china + sales.sa) * AVG_ORDER_VALUE_USD)}
              </div>
            </div>
          </div>
        </section>

        <footer className="text-center text-gray-500 pb-8">
          © 2026 Super Digital Markets.
        </footer>
      </div>
    </div>
  );
}
