
export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 font-sans text-white">
      {/* Earth background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-slate-950" />

      {/* Satellite */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 z-0 h-64 w-64 bg-contain bg-right-top bg-no-repeat opacity-80 sm:h-96 sm:w-96"
        style={{
          backgroundImage:
            "url('https://pngimg.com/uploads/satellite/satellite_PNG13.png')",
        }}
      />

      {/* Navigation */}
      <nav className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-black/40 px-5 py-4 backdrop-blur-md sm:px-8">
        <a href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 font-extrabold text-slate-950">
            SD
          </span>
          <span className="font-bold tracking-wide">
            SUPER DIGITAL MARKETS
          </span>
        </a>

        <div className="flex flex-wrap items-center gap-4 text-sm sm:gap-6">
          <a href="/" className="text-white hover:text-cyan-300">
            Home
          </a>
          <a href="/products" className="text-white hover:text-cyan-300">
            Products
          </a>
          <a href="/checkout" className="text-white hover:text-cyan-300">
            Checkout
          </a>
        </div>

        <span className="rounded-full border border-green-400/40 bg-green-500/10 px-3 py-2 text-xs font-bold text-green-300">
          ● GLOBAL MARKETPLACE
        </span>
      </nav>

      {/* Main headline */}
      <main className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-5 pb-20 pt-20 text-center sm:pt-28">
        <div className="mb-6 rounded-full border border-cyan-300/30 bg-black/40 px-4 py-2 text-xs font-semibold tracking-wider text-cyan-200 sm:text-sm">
          USA · INDIA · CHINA · SOUTH AFRICA
        </div>

        <h1 className="mb-6 text-4xl font-extrabold leading-tight drop-shadow-2xl sm:text-6xl md:text-7xl">
          The World&apos;s
          <span className="text-cyan-300"> Top 30</span>
          <br />
          Digital Products
          <br />
          <span className="text-yellow-300">Delivered Instantly.</span>
        </h1>

        <p className="mb-10 max-w-3xl text-base leading-relaxed text-slate-100 sm:text-xl">
          From AI tools to creative software — shop in USD, pay your way, and
          receive your digital purchase. Trusted by buyers across four
          continents.
        </p>

        <div className="flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
          <a
            href="/products"
            className="rounded-full bg-blue-600 px-8 py-4 text-center text-lg font-bold shadow-lg transition hover:bg-blue-500"
          >
            Browse Products
          </a>

          <a
            href="/checkout"
            className="rounded-full bg-green-600 px-8 py-4 text-center text-lg font-bold shadow-lg transition hover:bg-green-500"
          >
            Complete Your Purchase
          </a>
        </div>
      </main>

      {/* Live sales tracker */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold sm:text-3xl">
            <span className="mr-3 inline-block h-3 w-3 rounded-full bg-red-500" />
            Live Sales Trackers
          </h2>

          <a
            href="/live-trackers"
            className="text-sm font-semibold text-cyan-300 hover:text-cyan-100"
          >
            Open full screen →
          </a>
        </div>

        <iframe
          src="/live-trackers"
          title="Live Sales Trackers"
          className="w-full rounded-2xl border border-slate-700 bg-slate-950"
          style={{ height: 700 }}
        />
      </section>

      <footer className="relative z-10 border-t border-white/10 bg-black/40 px-5 py-6 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} SUPER DIGITAL MARKETS · Prices shown in
        USD
      </footer>
    </div>
  );
}
