export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">⚡</span>
            </div>
            <span className="text-xl font-bold">SUPER DIGITAL</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-300 hover:text-white">Home</a>
            <a href="/products" className="text-gray-300 hover:text-white">Products</a>
            <a href="#" className="text-gray-300 hover:text-white">Checkout</a>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-900/30 border border-green-600 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">LIVE</span>
            </div>
            <button className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-full font-semibold">
              Shop Now
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80')"
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/60 border border-cyan-500/50 rounded-full mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-cyan-400 text-sm">LIVE GLOBAL MARKETPLACE</span>
            <span className="text-gray-400 text-sm">USA • India • China • South Africa</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white">The World's </span>
            <span className="text-cyan-400">Top 30</span>
            <br />
            <span className="text-white">Digital Products</span>
            <br />
            <span className="text-yellow-400">Delivered Instantly</span>.
          </h1>

          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-8">
            From AI tools to creative software — shop in USD, pay your way, receive instantly. Trusted by buyers across 3 continents.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/products" className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 rounded-full font-bold text-lg transition">
              Browse Products
            </a>
            <a href="/payment?item=Test&amount=10.99" className="px-8 py-4 bg-green-600 hover:bg-green-700 rounded-full font-bold text-lg transition">
              Test Payment
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🚀</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Instant Delivery</h3>
            <p className="text-gray-400">Receive your digital products immediately after payment</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💳</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Multiple Payment Options</h3>
            <p className="text-gray-400">Pay via Card, Instant EFT, or WhatsApp</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🌍</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Global Marketplace</h3>
            <p className="text-gray-400">Trusted by buyers across 3 continents</p>
          </div>
        </div>
      </div>
    </div>
  );
}
