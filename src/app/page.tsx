import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e17] via-[#0f1420] to-[#1a2230] text-white">
      {/* NAVIGATION BAR */}
      <nav className="border-b border-gray-800 sticky top-0 bg-[#0f1420]/95 backdrop-blur-sm z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-cyan-400 flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center">
              <span className="text-[#0f1420] font-bold text-xs">S</span>
            </div>
            SUPER DIGITAL
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="hover:text-cyan-400 transition font-medium">Home</Link>
            <Link href="/products" className="hover:text-cyan-400 transition font-medium">Products</Link>
            <Link href="/checkout" className="hover:text-cyan-400 transition font-medium">Checkout</Link>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/30">
              ● LIVE
            </span>
            <Link 
              href="/products" 
              className="bg-cyan-500 hover:bg-cyan-400 text-white px-5 py-2 rounded-lg text-sm font-semibold transition shadow-lg"
            >
              Shop Now
            </Link>
          </div>
        </div>
        
        {/* COUNTRY BANNER UNDER NAV */}
        <div className="container mx-auto px-6 py-2 text-xs text-center">
          <span className="text-green-400 font-bold">●</span> 
          <span className="text-green-400">LIVE GLOBAL MARKETPLACE</span> 
          <span className="text-gray-500">•</span> 
          <span className="text-gray-400">USA • India • China • South Africa</span>
        </div>
      </nav>

      {/* MAIN HERO CONTENT WITH EARTH BACKGROUND */}
      <main className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
          <span className="text-white">The World&apos;s</span><br />
          <span className="text-cyan-400">Top 30</span><br />
          <span className="text-white">Digital Products</span><br />
          <span className="text-yellow-400">Delivered Instantly.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto px-4">
          From AI tools to creative software — shop in USD, pay your way, receive instantly. Trusted by buyers across 3 continents.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-center max-w-md mx-auto">
          <Link 
            href="/products" 
            className="bg-cyan-500 hover:bg-cyan-400 text-white px-10 py-4 rounded-xl text-lg font-bold transition transform hover:scale-105 shadow-lg shadow-cyan-500/30"
          >
            Browse All Products
          </Link>
          <Link 
            href="/checkout" 
            className="bg-gray-800 hover:bg-gray-700 text-white px-10 py-4 rounded-xl text-lg font-bold transition border border-gray-600"
          >
            Go to Checkout
          </Link>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center text-gray-400 pb-12">
        © 2026 Super Digital Markets. All rights reserved.
      </footer>
    </div>
  );
}
