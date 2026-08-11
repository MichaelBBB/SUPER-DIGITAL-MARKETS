import Link from "next/link";

export default function Home() {
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
        {/* NAVIGATION BAR */}
        <nav className="border-b border-gray-800 sticky top-0 bg-[#0b0f14]/95 backdrop-blur-md z-50">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="font-bold text-xl text-cyan-400 flex items-center gap-2">
              <div className="w-7 h-7 bg-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#0b0f14]">
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              SUPER DIGITAL
            </Link>
            
            <div className="hidden md:flex space-x-10">
              <Link href="/" className="text-white hover:text-cyan-400 transition font-medium">Home</Link>
              <Link href="/products" className="text-white hover:text-cyan-400 transition font-medium">Products</Link>
              <Link href="/payment" className="text-white hover:text-cyan-400 transition font-medium">Checkout</Link>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="bg-green-500/20 text-green-400 text-xs px-4 py-2 rounded-full border border-green-500/40 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                LIVE
              </span>
              <Link href="/products" className="bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition shadow-lg shadow-cyan-500/40">
                Shop Now
              </Link>
            </div>
          </div>
          
          <div className="container mx-auto px-6 py-3 text-xs text-center">
            <div className="inline-flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full border border-gray-700">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-cyan-400 font-semibold">LIVE GLOBAL MARKETPLACE</span> 
              <span className="mx-2 text-gray-600">•</span> 
              <span className="text-gray-400">USA • India • China • South Africa</span>
            </div>
          </div>
        </nav>

        {/* MAIN HERO CONTENT */}
        <main className="container mx-auto px-4 py-20 text-center flex-grow">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight">
            <span className="text-white">The World&apos;s</span><br />
            <span className="text-cyan-400">Top 30</span><br />
            <span className="text-white">Digital Products</span><br />
            <span className="text-yellow-400">Delivered Instantly.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto px-4">
            From AI tools to creative software — shop globally. Pay in USD/ZAR/INR, receive instantly. Trusted by buyers across 3 continents.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-center max-w-md mx-auto mb-16">
            <Link href="/products" className="bg-cyan-500 hover:bg-cyan-400 text-white px-10 py-5 rounded-full text-lg font-bold transition transform hover:scale-105 shadow-xl shadow-cyan-500/40">
              Browse All Products
            </Link>
            <Link href="/payment" className="bg-gray-800 hover:bg-gray-700 text-white px-10 py-5 rounded-full text-lg font-bold transition border border-gray-600">
              Go to Checkout
            </Link>
          </div>
        </main>

        {/* LIVE SALES TRACKER ON HOME PAGE */}
        <section className="container mx-auto px-4 pb-16">
          <div className="bg-[#0b0f14]/95 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <h2 className="text-cyan-400 font-bold text-center mb-6 text-lg tracking-wide">
              LIVE SALES ACTIVITY
            </h2>
            
            {/* COUNTRY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="bg-[#16191f] border border-gray-700 rounded-lg p-5 flex flex-col items-center justify-center">
                <span className="text-blue-400 text-xs uppercase tracking-wider mb-2 block">USA</span>
                <div className="text-2xl md:text-3xl font-bold text-white">226,805</div>
              </div>
              
              <div className="bg-[#16191f] border border-gray-700 rounded-lg p-5 flex flex-col items-center justify-center">
                <span className="text-orange-400 text-xs uppercase tracking-wider mb-2 block">INDIA</span>
                <div className="text-2xl md:text-3xl font-bold text-white">233,953</div>
              </div>
              
              <div className="bg-[#16191f] border border-gray-700 rounded-lg p-5 flex flex-col items-center justify-center">
                <span className="text-red-400 text-xs uppercase tracking-wider mb-2 block">CHINA</span>
                <div className="text-2xl md:text-3xl font-bold text-white">231,752</div>
              </div>
              
              <div className="bg-[#16191f] border border-green-500/50 rounded-lg p-5 flex flex-col items-center justify-center shadow-lg shadow-green-500/20">
                <span className="text-green-400 text-xs uppercase tracking-wider mb-2 block">SOUTH AFRICA</span>
                <div className="text-2xl md:text-3xl font-bold text-white">215,595</div>
              </div>
            </div>
            
            {/* GLOBAL TOTAL */}
            <div className="pt-4 border-t border-gray-800">
              <div className="flex items-center justify-center gap-2">
                <span className="text-gray-400 text-sm">Total Global Volume:</span>
                <span className="text-cyan-400 font-bold text-xl">908,105</span>
              </div>
            </div>
          </div>
        </section>

        <footer className="text-center text-gray-400 pb-12 relative z-10">
          © 2026 Super Digital Markets. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
