import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-black font-bold text-xs group-hover:scale-110 transition-transform">SD</div>
            <span className="text-lg font-bold tracking-wide text-gray-200 group-hover:text-white">SUPER DIGITAL</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <Link href="/products" className="hover:text-cyan-400 transition-colors">Products</Link>
            <Link href="/checkout" className="hover:text-cyan-400 transition-colors">Checkout</Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-green-900/20 border border-green-500/30 text-xs text-green-400">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>LIVE
            </div>
            <Link href="/products"><button className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-full transition-all shadow-lg shadow-cyan-500/20">Shop Now</button></Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10"></div>
          <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" alt="Earth Background" className="w-full h-full object-cover opacity-60 scale-105 animate-[pulse_10s_ease-in-out_infinite]" />
        </div>
        <div className="relative z-20 text-center px-6 max-w-5xl mx-auto mt-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span></span>
            <span className="text-xs font-bold tracking-wider text-cyan-400 uppercase">Live Global Marketplace</span>
            <span className="mx-2 h-1 w-1 rounded-full bg-gray-500"></span>
            <span className="text-xs text-gray-400">USA • India • China • South Africa</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight leading-tight">
            <span className="block text-white">The World's Top 30</span>
            <span className="block text-white">Digital Products</span>
            <span className="block text-yellow-400 mt-2">Delivered Instantly.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">From AI tools to creative software — shop in USD, pay your way, receive instantly. Trusted by buyers across 3 continents.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/products"><button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full text-lg shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105">Browse Products</button></Link>
            <Link href="/payment?item=Test+Product&amount=10.99"><button className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full text-lg shadow-lg shadow-green-500/30 transition-all transform hover:scale-105">Go To Payment Page</button></Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 text-sm border-t border-white/5">
        <p>© 2026 Super Digital Markets. All rights reserved.</p>
      </footer>
    </div>
  );
}
