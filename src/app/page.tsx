import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B1120] text-white relative overflow-hidden flex flex-col">
      
      {/* EARTH & SPACE BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80"
          alt="Earth Background"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1120]/90 via-[#0B1120]/60 to-[#0B1120]" />
        {/* Subtle star/space overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
      </div>

      {/* NAVBAR */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <span className="text-lg">❄️</span>
          </div>
          <span className="text-xl font-bold tracking-tight">SUPER DIGITAL</span>
        </div>

        {/* Center Nav Pills */}
        <div className="hidden md:flex items-center gap-6 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
          <Link href="/" className="text-sm font-medium hover:text-cyan-400 transition">Home</Link>
          <Link href="/products" className="text-sm font-medium hover:text-cyan-400 transition">Products</Link>
          <Link href="/checkout" className="text-sm font-medium hover:text-cyan-400 transition">Checkout</Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-green-400">LIVE</span>
          </div>
          <Link href="/products" className="bg-cyan-500 hover:bg-cyan-400 text-white px-5 py-2 rounded-full font-bold text-sm transition flex items-center gap-2 shadow-lg shadow-cyan-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Shop Now
          </Link>
        </div>
      </nav>

      {/* LIVE GLOBAL MARKETPLACE BADGE */}
      <div className="absolute top-20 left-6 z-10">
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-cyan-500/30">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">LIVE GLOBAL MARKETPLACE</span>
          <span className="text-xs text-gray-300">USA • India • China • South Africa</span>
        </div>
      </div>

      {/* HERO SECTION */}
      <main className="relative z-10 flex-1 container mx-auto px-6 pt-28 pb-20 flex flex-col justify-center">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1.1] mb-6 drop-shadow-2xl">
          The World's <span className="text-cyan-400">Top 30</span><br />
          Digital Products<br />
          <span className="text-yellow-400">Delivered Instantly.</span>
        </h1>
        <p className="text-base md:text-lg text-gray-300 max-w-2xl mb-10 leading-relaxed">
          From AI tools to creative software — shop in USD, pay your way, receive instantly. Trusted by buyers across 3 continents.
        </p>
        <Link 
          href="/products" 
          className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-4 px-8 rounded-xl text-lg transition transform hover:scale-105 shadow-lg shadow-cyan-500/25 w-fit"
        >
          Browse Products
        </Link>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 py-6 text-center text-gray-500 text-xs">
        <p>&copy; {new Date().getFullYear()} Super Digital Markets. All rights reserved.</p>
      </footer>
    </div>
  );
}
