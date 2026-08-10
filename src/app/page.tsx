import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white">
      {/* NAVIGATION BAR */}
      <nav className="border-b border-gray-800 sticky top-0 bg-[#0f1115]/95 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-cyan-400 flex items-center gap-2">
            <div className="w-6 h-6 bg-cyan-400 rounded-full"></div>
            SUPER DIGITAL
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="hover:text-cyan-400 transition font-medium">Home</Link>
            <Link href="/products" className="hover:text-cyan-400 transition font-medium">Products</Link>
            <Link href="/checkout" className="hover:text-cyan-400 transition font-medium">Checkout</Link>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">LIVE</span>
            <Link href="/products" className="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
              Shop Now
            </Link>
          </div>
        </div>
        
        {/* COUNTRY BANNER */}
        <div className="container mx-auto px-4 py-2 text-xs text-center text-gray-400">
          <span className="text-green-400">●</span> LIVE GLOBAL MARKETPLACE • USA • India • China • South Africa
        </div>
      </nav>

      {/* MAIN HERO CONTENT */}
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 text-center leading-tight">
          The World&apos;s <span className="text-cyan-400">Top 30</span><br />
          Digital Products<br />
          <span className="text-yellow-400">Delivered Instantly.</span>
        </h1>
        
        <p className="text-xl text-gray-300 text-center mb-12 max-w-3xl mx-auto">
          From AI tools to creative software — shop globally. Pay in USD/ZAR/INR, receive instantly. Trusted by buyers across 3 continents.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-center max-w-md mx-auto">
          <Link 
            href="/products" 
            className="bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-4 rounded-xl text-lg font-bold transition transform hover:scale-105"
          >
            Browse All Products
          </Link>
          <Link 
            href="/checkout" 
            className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition border border-gray-600"
          >
            Go to Checkout
          </Link>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center text-gray-400 mt-24 pb-12">
        © 2026 Super Digital Markets. All rights reserved.
      </footer>
    </div>
  );
}
