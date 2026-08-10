import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* BRIGHT EARTH BACKGROUND IMAGE */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* DARK OVERLAY - LIGHTER TO Keep Background BRIGHT */}
      <div className="absolute inset-0 z-0 bg-black opacity-50"></div>

      {/* CONTENT LAYER (above background) */}
      <div className="relative z-10 flex flex-col">
        
        {/* NAVIGATION BAR */}
        <nav className="border-b border-gray-800 sticky top-0 bg-[#0b0f14]/95 backdrop-blur-md z-50">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="font-bold text-xl text-cyan-400 flex items-center gap-2">
              <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center">
                <span className="text-[#0b0f14] font-bold text-xs">S</span>
              </div>
              SUPER DIGITAL
            </Link>
            
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="hover:text-cyan-400 transition font-medium">Home</Link>
              <Link href="/products" className="hover:text-cyan-400 transition font-medium">Products</Link>
              <Link href="/checkout" className="hover:text-cyan-400 transition font-medium">Checkout</Link>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/30 font-semibold">
                ● LIVE
              </span>
              <Link 
                href="/products" 
                className="bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-2 rounded-lg text-sm font-semibold transition shadow-lg"
              >
                Shop Now
              </Link>
            </div>
          </div>
          
          {/* COUNTRY BANNER UNDER NAV */}
          <div className="container mx-auto px-6 py-2 text-xs text-center">
            <span className="text-green-400 font-bold">●</span> 
            <span className="text-green-400">LIVE GLOBAL MARKETPLACE</span> 
            <span className="mx-2 text-gray-600">•</span> 
            <span className="text-gray-400">USA • India • China • South Africa</span>
          </div>
        </nav>

        {/* MAIN HERO CONTENT */}
        <main className="container mx-auto px-4 py-16 text-center flex-grow">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight">
            <span className="text-white">The World&apos;s</span><br />
            <span className="text-cyan-400">Top 30</span><br />
            <span className="text-white">Digital Products</span><br />
            <span className="text-yellow-400">Delivered Instantly.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto px-4">
            From AI tools to creative software — shop in USD, pay your way, receive instantly. Trusted by buyers across 3 continents.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-center max-w-md mx-auto">
            <Link 
              href="/products" 
              className="bg-cyan-500 hover:bg-cyan-400 text-white px-10 py-5 rounded-full text-lg font-bold transition transform hover:scale-105 shadow-xl shadow-cyan-500/40"
            >
              Browse All Products
            </Link>
            <Link 
              href="/checkout" 
              className="bg-gray-800 hover:bg-gray-700 text-white px-10 py-5 rounded-full text-lg font-bold transition border border-gray-600"
            >
              Go to Checkout
            </Link>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="text-center text-gray-400 pb-12 relative z-10">
          © 2026 Super Digital Markets. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
