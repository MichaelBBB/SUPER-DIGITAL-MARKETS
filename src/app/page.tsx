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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      
      {/* NAVBAR */}
      <nav className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-cyan-400 tracking-tight">SUPER DIGITAL</Link>
          <div className="flex items-center gap-6">
            <Link href="/products" className="text-gray-300 hover:text-white transition">Products</Link>
            <Link href="/checkout" className="text-gray-300 hover:text-white transition">Checkout</Link>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-900/30 border border-green-700">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-green-400">LIVE</span>
            </div>
            <Link href="/products" className="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-lg transition font-medium">
              Shop Now
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 relative overflow-hidden">
        {/* EARTH BACKGROUND (Guaranteed to load) */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80"
            alt="Earth Background"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/70 to-slate-950 pointer-events-none"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-8 space-y-20">
          
          {/* HERO */}
          <section className="py-20 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg">
              The World's Top 30<br />Digital Products<br />
              <span className="text-cyan-400">Delivered Instantly.</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              From AI tools to creative software — shop in USD. Pay your way. Receive instantly. Trusted by buyers across 3 continents.
            </p>
            <Link href="/products" className="inline-block bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-4 px-8 rounded-xl text-lg transition transform hover:scale-105 shadow-lg shadow-cyan-500/20">
              Browse Products
            </Link>
          </section>

          {/* SALES TRACKER */}
          <section className="bg-slate-900/90 backdrop-blur p-10 rounded-3xl border border-slate-800">
            <h2 className="text-3xl font-bold text-center mb-10">Live Global Sales Tracker</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4 bg-slate-800/50 rounded-xl"><div className="text-blue-400 text-sm font-bold mb-2">USA</div><div className="text-3xl font-bold text-white">226,679</div></div>
              <div className="p-4 bg-slate-800/50 rounded-xl"><div className="text-orange-400 text-sm font-bold mb-2">INDIA</div><div className="text-3xl font-bold text-white">233,806</div></div>
              <div className="p-4 bg-slate-800/50 rounded-xl"><div className="text-red-400 text-sm font-bold mb-2">CHINA</div><div className="text-3xl font-bold text-white">231,639</div></div>
              <div className="p-4 bg-slate-800/50 rounded-xl border border-cyan-900/50"><div className="text-green-400 text-sm font-bold mb-2">SOUTH AFRICA</div><div className="text-3xl font-bold text-white">215,475</div></div>
            </div>
            <div className="mt-8 text-center">
              <div className="inline-block bg-cyan-900/30 px-8 py-4 rounded-full border border-cyan-800">
                <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest mr-2">GLOBAL TOTAL</span>
                <span className="text-white font-bold text-2xl">907,599</span>
              </div>
            </div>
          </section>

          {/* FEATURED PRODUCTS */}
          <section id="products" className="mb-20">
            <div className="flex justify-between items-end mb-8">
              <div><h2 className="text-3xl font-bold mb-2">Latest Products</h2><p className="text-gray-400">Premium digital assets delivered instantly.</p></div>
              <Link href="/products" className="text-cyan-400 hover:underline">View All &rarr;</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.slice(0, 8).map((p) => (
                <div key={p.id} className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/50 transition group">
                  <img 
                    src={`https://placehold.co/400x225/0f172a/06b6d4?text=${encodeURIComponent(p.name.split(' ')[0])}`}
                    alt={p.name}
                    className="aspect-video w-full rounded-xl mb-4 object-cover"
                    loading="lazy"
                  />
                  <h3 className="font-bold text-lg mb-2">{p.name}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-cyan-400 font-bold">${p.price.toFixed(2)}</span>
                    <Link href={`/checkout?product=${p.id}`} className="bg-slate-800 hover:bg-cyan-500 hover:text-white text-white text-sm px-4 py-2 rounded-lg transition">Buy Now</Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-800 py-8 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4 tracking-tighter">SUPER DIGITAL</h2>
          <div className="flex justify-center gap-6 mb-6 text-sm text-gray-400">
            <a href="#" className="hover:text-cyan-400 transition">Terms</a>
            <a href="#" className="hover:text-cyan-400 transition">Privacy</a>
            <Link href="/products" className="hover:text-cyan-400 transition">Shop Now</Link>
          </div>
          <p className="text-gray-500 text-xs">&copy; {new Date().getFullYear()} Super Digital Markets. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
