export default function Home() {
  return (
    <div className="min-h-screen text-white relative overflow-hidden font-sans">
      
      {/* NIGHT EARTH — double-layered so it can never disappear */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundColor: '#04060f',
            backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop'), url('https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=2072&auto=format&fit=crop')"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70"></div>
      </div>

      {/* SATELLITE — built into the code */}
      <div className="absolute top-0 right-0 w-[520px] h-[520px] z-10 opacity-95 pointer-events-none">
        <svg viewBox="0 0 500 500" className="w-full h-full" style={{ transform: 'rotate(24deg)' }}>
          <defs>
            <linearGradient id="panelGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#b3b7e6" />
              <stop offset="100%" stopColor="#7d81c0" />
            </linearGradient>
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#d7dadd" />
              <stop offset="50%" stopColor="#9aa0a6" />
              <stop offset="100%" stopColor="#5f6368" />
            </linearGradient>
          </defs>
          <rect x="30" y="215" width="150" height="80" fill="url(#panelGrad)" stroke="#4c4f69" strokeWidth="4" />
          <line x1="80" y1="215" x2="80" y2="295" stroke="#4c4f69" strokeWidth="3" />
          <line x1="130" y1="215" x2="130" y2="295" stroke="#4c4f69" strokeWidth="3" />
          <line x1="30" y1="255" x2="180" y2="255" stroke="#4c4f69" strokeWidth="3" />
          <rect x="320" y="215" width="150" height="80" fill="url(#panelGrad)" stroke="#4c4f69" strokeWidth="4" />
          <line x1="370" y1="215" x2="370" y2="295" stroke="#4c4f69" strokeWidth="3" />
          <line x1="420" y1="215" x2="420" y2="295" stroke="#4c4f69" strokeWidth="3" />
          <line x1="320" y1="255" x2="470" y2="255" stroke="#4c4f69" strokeWidth="3" />
          <rect x="180" y="245" width="40" height="20" fill="#6b6f74" />
          <rect x="280" y="245" width="40" height="20" fill="#6b6f74" />
          <rect x="215" y="195" width="70" height="120" rx="26" fill="url(#bodyGrad)" stroke="#43464a" strokeWidth="3" />
          <line x1="250" y1="315" x2="250" y2="350" stroke="#6b6f74" strokeWidth="8" />
          <ellipse cx="250" cy="375" rx="55" ry="30" fill="#c8ccd0" stroke="#43464a" strokeWidth="3" />
          <ellipse cx="250" cy="370" rx="38" ry="18" fill="#8f9499" />
          <line x1="250" y1="370" x2="250" y2="340" stroke="#43464a" strokeWidth="4" />
          <circle cx="250" cy="338" r="6" fill="#e8eaed" />
        </svg>
      </div>

      <nav className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-md bg-black/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-xs font-bold text-black">SD</div>
          <span className="font-bold text-lg tracking-wide">SUPER DIGITAL</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="/" className="text-white hover:text-cyan-400 transition-colors">Home</a>
          <a href="/products" className="hover:text-cyan-400 transition-colors">Products</a>
          <a href="/payment?item=ExpressVPN&amount=6.67" className="hover:text-cyan-400 transition-colors">Checkout</a>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            LIVE
          </div>
          <a href="/products" className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-full text-sm font-bold transition-all">
            Shop Now
          </a>
        </div>
      </nav>

      <div className="relative z-10 flex justify-center py-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-xs font-semibold tracking-wider">
          <span className="text-cyan-400">● LIVE GLOBAL MARKETPLACE</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-300">USA • India • China • South Africa</span>
        </div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-16 pb-16 max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 drop-shadow-2xl">
          The World's <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">Top 30</span><br />
          Digital Products<br />
          <span className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]">Delivered Instantly.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-10 leading-relaxed drop-shadow-lg">
          From AI tools to creative software — shop in USD, pay your way,
          receive instantly. Trusted by buyers across 4 continents.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="/products" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-full font-bold text-lg transition-all shadow-lg shadow-blue-900/40 hover:scale-105">
            Browse Products
          </a>
          <a href="/payment?item=ExpressVPN&amount=6.67" className="px-8 py-4 bg-green-600 hover:bg-green-500 rounded-full font-bold text-lg transition-all shadow-lg shadow-green-900/40 hover:scale-105">
            Complete Your Purchase
          </a>
        </div>
      </main>

      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
          <h2 className="text-2xl md:text-3xl font-bold">Live Sales Trackers</h2>
          <a href="https://super-digital-markets-co9n.vercel.app/live-trackers" className="ml-auto text-xs text-cyan-400 hover:text-cyan-300">
            Open full screen →
          </a>
        </div>
        <iframe 
          src="https://super-digital-markets-co9n.vercel.app/live-trackers" 
          title="Live Sales Trackers"
          className="w-full rounded-2xl border border-slate-800 bg-slate-950"
          style={{ height: '1000px' }}
        ></iframe>
      </section>
    </div>
  );
}
