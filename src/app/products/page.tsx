export default function ProductsPage() {
  const products = [
    { name: 'ExpressVPN (12 Months)', price: 6.67, category: 'Security', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=60' },
    { name: 'NordVPN (2 Years)', price: 3.09, category: 'Security', img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=60' },
    { name: 'Disney Premium', price: 13.99, category: 'Streaming', img: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&auto=format&fit=crop&q=60' },
    { name: 'Netflix Premium', price: 15.99, category: 'Streaming', img: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=500&auto=format&fit=crop&q=60' },
    { name: 'Spotify Premium', price: 9.99, category: 'Music', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60' },
    { name: 'Adobe Creative Cloud', price: 54.99, category: 'Software', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60' },
    { name: 'Microsoft Office 365', price: 6.99, category: 'Software', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60' },
    { name: 'ChatGPT Plus', price: 20.00, category: 'AI Tools', img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&auto=format&fit=crop&q=60' },
    { name: 'Midjourney Subscription', price: 10.00, category: 'AI Tools', img: 'https://images.unsplash.com/photo-1686191128892-3b37add4c844?w=500&auto=format&fit=crop&q=60' },
    { name: 'Canva Pro', price: 12.99, category: 'Design', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&auto=format&fit=crop&q=60' },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-400">All Products</h1>
          <p className="text-gray-400">Premium digital products delivered instantly</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, idx) => (
            <div key={idx} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-cyan-600 transition-all flex flex-col">
              {/* Product Image */}
              <div className="h-48 w-full overflow-hidden">
                <img 
                  src={product.img} 
                  alt={product.name} 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              
              {/* Product Details */}
              <div className="p-6 space-y-4 flex-grow flex flex-col">
                <div className="text-xs text-cyan-400 font-bold uppercase">{product.category}</div>
                <h2 className="text-xl font-bold">{product.name}</h2>
                <p className="text-3xl font-bold text-cyan-400 mt-auto">${product.price} USD</p>
                <a 
                  href={`/payment?item=${encodeURIComponent(product.name)}&amount=${product.price}`}
                  className="block w-full text-center py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-bold transition-all mt-4"
                >
                  Buy Now
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-8 pb-12">
          <a href="/" className="text-gray-500 hover:text-white text-sm">← Back to Home</a>
        </div>
      </div>
    </div>
  );
}
export default function Home() {
  return (
    <div className="min-h-screen text-white relative overflow-hidden font-sans">
      {/* Earth Background with Dusk Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop')" }}
      >
        {/* Dusk Gradient: Darker at top and bottom, slightly lighter in middle to simulate dusk and highlight the earth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-md">
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

      {/* Sub-header Banner */}
      <div className="relative z-10 flex justify-center py-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-xs font-semibold tracking-wider">
          <span className="text-cyan-400">● LIVE GLOBAL MARKETPLACE</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-300">USA • India • China • South Africa</span>
        </div>
      </div>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-16 pb-32 max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 drop-shadow-2xl">
          The World's <span className="text-cyan-400">Top 30</span><br />
          Digital Products<br />
          <span className="text-yellow-400">Delivered Instantly.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed drop-shadow-lg">
          From AI tools to creative software — shop in USD, pay your way,
          receive instantly. Trusted by buyers across 3 continents.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a href="/products" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-full font-bold text-lg transition-all shadow-lg shadow-blue-900/20">
            Browse Products
          </a>
          <a href="/payment?item=ExpressVPN&amount=6.67" className="px-8 py-4 bg-green-600 hover:bg-green-500 rounded-full font-bold text-lg transition-all shadow-lg shadow-green-900/20">
            Complete Your Purchase
          </a>
        </div>
      </main>
    </div>
  );
}
