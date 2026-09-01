'use client'; // ️ CRITICAL: Must be at the very top for useState/useEffect to work

import Link from 'next/link';
import { useState, useEffect } from 'react';

// Mock data for live sales tracker
const initialCountryData = [
  { country: 'South Africa', revenue: 45678, currency: 'R', flag: '🇦' },
  { country: 'USA', revenue: 128470, currency: '$', flag: '🇺🇸' },
  { country: 'India', revenue: 89234, currency: '₹', flag: '🇮🇳' },
  { country: 'China', revenue: 156789, currency: '¥', flag: '🇳' },
];

const mockBuyers = [
  { name: 'Thabo M.', product: 'AI Writing Assistant', country: 'South Africa' },
  { name: 'Sarah J.', product: 'Video Editor Pro', country: 'USA' },
  { name: 'Raj P.', product: 'Photo Enhancement Suite', country: 'India' },
  { name: 'Li W.', product: 'Code Generator AI', country: 'China' },
  { name: 'Nomsa K.', product: 'Social Media Toolkit', country: 'South Africa' },
  { name: 'Mike R.', product: 'AI Writing Assistant', country: 'USA' },
  { name: 'Priya S.', product: 'Logo Maker Pro', country: 'India' },
  { name: 'Zhang L.', product: 'Video Editor Pro', country: 'China' },
];

export default function HomePage() {
  const [countryData, setCountryData] = useState(initialCountryData);
  const [recentBuyers, setRecentBuyers] = useState(mockBuyers.slice(0, 4));

  // Simulate live revenue updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCountryData(prev => 
        prev.map(item => ({
          ...item,
          revenue: item.revenue + Math.floor(Math.random() * 500) + 100
        }))
      );
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Simulate new buyers appearing
  useEffect(() => {
    const interval = setInterval(() => {
      const randomBuyer = mockBuyers[Math.floor(Math.random() * mockBuyers.length)];
      setRecentBuyers(prev => [randomBuyer, ...prev.slice(0, 3)]);
    }, 5000); // New buyer every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 px-6 py-4 sticky top-0 z-50 bg-black/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">⚡</span>
            </div>
            <span className="text-xl font-bold tracking-tight">SUPER DIGITAL</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-300 hover:text-white font-medium transition">Home</Link>
            <Link href="/products" className="text-gray-300 hover:text-white font-medium transition">Products</Link>
            <Link href="/checkout" className="text-gray-300 hover:text-white font-medium transition">Checkout</Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-900/30 border border-green-500 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400 font-semibold">LIVE</span>
            </div>
            
            <Link 
              href="/products" 
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-sm shadow-lg shadow-blue-500/30 transition transform hover:scale-105"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80')"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/50 border border-cyan-500/50 rounded-full mb-8 backdrop-blur-md">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-cyan-400 text-sm font-bold uppercase tracking-wider">Live Global Marketplace</span>
            <span className="text-gray-300 text-sm">•</span>
            <span className="text-gray-300 text-sm">USA • India • China • South Africa</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight tracking-tight">
            <span className="text-white block">The World's</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 block">Top 30</span>
            <span className="text-white block">Digital Products</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 block mt-2">Delivered Instantly.</span>
          </h1>

          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            From AI tools to creative software — shop in USD, pay your way, receive instantly. Trusted by buyers across 3 continents.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link 
              href="/products" 
              className="w-full sm:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg shadow-xl shadow-blue-600/30 transition-all transform hover:-translate-y-1 hover:shadow-2xl"
            >
              Browse Products
            </Link>
            <Link 
              href="/payment?item=Test&amount=10.99" 
              className="w-full sm:w-auto px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-lg shadow-xl shadow-emerald-600/30 transition-all transform hover:-translate-y-1 hover:shadow-2xl"
            >
              Test Payment
            </Link>
          </div>
        </div>
      </div>

      {/* First Live Sales Tracker - Overall Stats */}
      <div className="py-16 px-6 bg-gray-900 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Live Sales Activity</h2>
            <p className="text-gray-400">Real-time statistics from our global marketplace</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-green-500 transition-colors group">
              <div className="text-4xl font-bold text-green-400 mb-2 group-hover:scale-110 transition-transform">247</div>
              <div className="text-gray-400 font-medium">Orders Today</div>
              <div className="mt-2 text-xs text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Live
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-cyan-500 transition-colors group">
              <div className="text-4xl font-bold text-cyan-400 mb-2 group-hover:scale-110 transition-transform">$12,847</div>
              <div className="text-gray-400 font-medium">Revenue Today</div>
              <div className="mt-2 text-xs text-cyan-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span> +12% vs yesterday
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-yellow-500 transition-colors group">
              <div className="text-4xl font-bold text-yellow-400 mb-2 group-hover:scale-110 transition-transform">98.5%</div>
              <div className="text-gray-400 font-medium">Success Rate</div>
              <div className="mt-2 text-xs text-yellow-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span> Excellent
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-purple-500 transition-colors group">
              <div className="text-4xl font-bold text-purple-400 mb-2 group-hover:scale-110 transition-transform">1,247</div>
              <div className="text-gray-400 font-medium">Active Users</div>
              <div className="mt-2 text-xs text-purple-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span> Online now
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Live Sales Tracker - By Country with Buyers */}
      <div className="py-16 px-6 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Live Revenue by Country</h2>
            <p className="text-gray-400">Real-time earnings and recent buyers from each region</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {countryData.map((country, index) => (
              <div key={country.country} className="bg-gray-900 rounded-2xl border border-gray-700 overflow-hidden hover:border-cyan-500/50 transition-colors">
                {/* Country Header */}
                <div className="p-6 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{country.flag}</span>
                      <div>
                        <h3 className="text-xl font-bold text-white">{country.country}</h3>
                        <p className="text-sm text-gray-400">Live Revenue</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-400">
                        {country.currency}{country.revenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-green-500 flex items-center justify-end gap-1 mt-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Updating live
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Buyers */}
                <div className="p-6">
                  <h4 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
                    Recent Buyers
                  </h4>
                  
                  <div className="space-y-3">
                    {recentBuyers
                      .filter(buyer => buyer.country === country.country)
                      .slice(0, 3)
                      .map((buyer, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-cyan-400">{buyer.name.charAt(0)}</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">{buyer.name}</div>
                              <div className="text-xs text-gray-400">{buyer.product}</div>
                            </div>
                          </div>
                          <div className="text-xs text-green-400 font-medium">
                            Just now
                          </div>
                        </div>
                      ))}
                    
                    {recentBuyers.filter(buyer => buyer.country === country.country).length === 0 && (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        Waiting for next purchase...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="py-20 px-6 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Selling?</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of successful digital entrepreneurs. List your products, accept payments globally, and deliver instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products" 
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full font-bold text-lg shadow-xl shadow-cyan-600/30 transition-all transform hover:-translate-y-1"
            >
              Browse Products
            </Link>
            <Link 
              href="/payment?item=Starter+Package&amount=29.99" 
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold text-lg shadow-xl shadow-green-600/30 transition-all transform hover:-translate-y-1"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
