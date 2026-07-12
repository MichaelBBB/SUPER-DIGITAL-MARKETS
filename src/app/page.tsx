import Link from 'next/link';

const products = [
  { id: 1, name: "ChatGPT Plus", price: 20.00 },
  { id: 2, name: "Adobe Creative Cloud", price: 54.99 },
  { id: 3, name: "Netflix Premium", price: 22.99 },
  { id: 4, name: "Microsoft 365 Business", price: 12.50 },
  { id: 5, name: "Spotify Premium", price: 9.99 },
  { id: 6, name: "NordVPN", price: 3.99 },
  { id: 7, name: "Notion Plus", price: 8.00 },
  { id: 8, name: "Figma Professional", price: 12.00 },
  { id: 9, name: "Dropbox Plus", price: 9.99 },
  { id: 10, name: "Canva Pro", price: 12.99 },
  { id: 11, name: "Grammarly Premium", price: 12.00 },
  { id: 12, name: "Zoom Pro", price: 14.99 },
  { id: 13, name: "LastPass Premium", price: 3.00 },
  { id: 14, name: "Cursor AI Pro", price: 20.00 },
  { id: 15, name: "Midjourney Standard", price: 24.00 },
  { id: 16, name: "GitHub Copilot", price: 10.00 },
  { id: 17, name: "Slack Pro", price: 7.25 },
  { id: 18, name: "Dashlane Premium", price: 4.99 },
  { id: 19, name: "Adobe Photoshop", price: 22.99 },
  { id: 20, name: "Claude Pro", price: 20.00 },
  { id: 21, name: "Adobe Premiere Pro", price: 22.99 },
  { id: 22, name: "Asana Premium", price: 10.99 },
  { id: 23, name: "ExpressVPN", price: 6.67 },
  { id: 24, name: "YouTube Premium", price: 13.99 },
  { id: 25, name: "1Password", price: 2.99 },
  { id: 26, name: "Monday.com Pro", price: 9.00 },
  { id: 27, name: "Perplexity Pro", price: 20.00 },
  { id: 28, name: "Loom Business", price: 12.50 },
  { id: 29, name: "Webflow CMS", price: 14.00 },
  { id: 30, name: "ElevenLabs Starter", price: 5.00 }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B1120] text-white relative overflow-hidden flex flex-col">
      
      {/* EARTH BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80"
          alt="Earth Background"
          className="w-full h-full object-cover brightness-110 contrast-110 saturate-110"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(11,17,32,0.85)_100%)]" />
      </div>

      {/* NAVBAR */}
      <nav className="relative z-10 flex items-center justify-between px-10 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="text-lg">❄️</span>
          </div>
          <span className="text-2xl font-bold tracking-tight">SUPER DIGITAL</span>
        </div>

        <div className="flex items-center gap-8 px-8 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <Link href="/" className="text-base font-medium hover:text-cyan-400 transition">Home</Link>
          <Link href="/products" className="text-base font-medium hover:text-cyan-400 transition">Products</Link>
          <Link href="/checkout" className="text-base font-medium hover:text-cyan-400 transition">Checkout</Link>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/40 backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-green-400 uppercase tracking-wider">LIVE</span>
          </div>
          <Link href="/products" className="bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-3 rounded-xl font-bold text-base transition flex items-center gap-2 shadow-lg shadow-cyan-500/25">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Shop Now
          </Link>
        </div>
      </nav>

      {/* GLOBAL MARKETPLACE BADGE */}
      <div className="absolute top-24 left-10 z-10">
        <div className="flex items-center gap-4 px-5 py-3 rounded-full bg-black/40 backdrop-blur-md border border-cyan-500/30 shadow-lg">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">LIVE GLOBAL MARKETPLACE</span>
          <span className="text-xs text-gray-300">USA • India • China • South Africa</span>
        </div>
      </div>

      {/* HERO SECTION */}
      <main className="relative z-10 flex-1 container mx-auto px-10 pt-36 pb-24 flex flex-col justify-center">
        <h1 className="text-6xl md:text-7xl font-extrabold leading-[1.05] mb-8 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] max-w-5xl">
          The World's <span className="text-cyan-400">Top 30</span><br />
          Digital Products<br />
          <span className="text-yellow-400">Delivered Instantly.</span>
        </h1>
        <p className="text-lg text-gray-300 max-w-3xl mb-12 leading-relaxed drop-shadow-md">
          From AI tools to creative software — shop in USD, pay your way, receive instantly. Trusted by buyers across 3 continents.
        </p>
        <Link 
          href="/products" 
          className="inline-flex items-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-5 px-10 rounded-xl text-xl transition transform hover:scale-[1.02] shadow-lg shadow-cyan-500/30 w-fit"
        >
          Browse All Products
        </Link>
      </main>

      {/* SALES TRACKER */}
      <section className="relative z-10 container mx-auto px-10 pb-20">
        <div className="bg-slate-900/80 backdrop-blur-lg p-10 rounded-3xl border border-slate-800 shadow-2xl">
          <h2 className="text-3xl font-bold text-center mb-10">Live Global Sales Tracker</h2>
          <div className="grid grid-cols-4 gap-8 text-center">
            <div className="p-6 bg-slate-800/50 rounded-2xl"><div className="text-blue-400 text-sm font-bold mb-3 uppercase tracking-wider">USA</div><div className="text-4xl font-bold text-white">226,679</div></div>
            <div className="p-6 bg-slate-800/50 rounded-2xl"><div className="text-orange-400 text-sm font-bold mb-3 uppercase tracking-wider">INDIA</div><div className="text-4xl font-bold text-white">233,806</div></div>
            <div className="p-6 bg-slate-800/50 rounded-2xl"><div className="text-red-400 text-sm font-bold mb-3 uppercase tracking-wider">CHINA</div><div className="text-4xl font-bold text-white">231,639</div></div>
            <div className="p-6 bg-slate-800/50 rounded-2xl border border-cyan-900/50"><div className="text-green-400 text-sm font-bold mb-3 uppercase tracking-wider">SOUTH AFRICA</div><div className="text-4xl font-bold text-white">215,475</div></div>
          </div>
          <div className="mt-10 text-center">
            <div className="inline-block bg-cyan-900/30 px-10 py-5 rounded-full border border-cyan-800 shadow-lg">
              <span className="text-cyan-400 text-sm font-bold uppercase tracking-widest mr-3">GLOBAL TOTAL</span>
              <span className="text-white font-bold text-3xl">907,599</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS PREVIEW */}
      <section className="relative z-10 container mx-auto px-10 pb-20">
        <div className="flex justify-between items-end mb-10">
          <div><h2 className="text-3xl font-bold mb-2">Latest Products</h2><p className="text-gray-400 text-lg">Premium digital assets delivered instantly.</p></div>
          <Link href="/products" className="text-cyan-400 hover:underline text-lg font-medium">View All &rarr;</Link>
        </div>
        <div className="grid grid-cols-4 gap-6">
          {products.slice(0, 8).map((p) => (
            <div key={p.id} className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/50 transition group shadow-lg">
              <img 
                src={`https://placehold.co/400x225/0f172a/06b6d4?text=${encodeURIComponent(p.name.split(' ')[0])}`}
                alt={p.name}
                className="w-full rounded-xl mb-5 object-cover shadow-md"
              />
              <h3 className="font-bold text-xl mb-2">{p.name}</h3>
              <div className="flex justify-between items-center mt-4">
                <span className="text-cyan-400 font-bold text-xl">${p.price.toFixed(2)}</span>
                <Link href={`/checkout?product=${p.id}`} className="bg-slate-800 hover:bg-cyan-500 hover:text-white text-white text-sm px-5 py-2.5 rounded-lg transition font-medium">Buy Now</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 py-10 text-center text-gray-400 text-sm">
        <h2 className="text-2xl font-bold text-white mb-6 tracking-tighter">SUPER DIGITAL</h2>
        <div className="flex justify-center gap-8 mb-6 text-base">
          <a href="#" className="hover:text-cyan-400 transition">Terms</a>
          <a href="#" className="hover:text-cyan-400 transition">Privacy</a>
          <Link href="/products" className="hover:text-cyan-400 transition">Shop Now</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} Super Digital Markets. All rights reserved.</p>
      </footer>
    </div>
  );
}
