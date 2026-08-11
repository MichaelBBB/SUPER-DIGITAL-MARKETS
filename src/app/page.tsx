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
        {/* NAVIGATION */}
        <nav className="border-b border-gray-800 sticky top-0 bg-[#0b0f14]/95 backdrop-blur-md z-50">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="font-bold text-xl text-cyan-400 flex items-center gap-2">
              <div className="w-7 h-7 bg-cyan-400 rounded-full flex items-center justify-center">
                <span className="text-black font-bold">S</span>
              </div>
              SUPER DIGITAL
            </Link>
            
            <div className="hidden md:flex space-x-10">
              <Link href="/" className="text-white hover:text-cyan-400">Home</Link>
              <Link href="/products" className="text-white hover:text-cyan-400">Products</Link>
              <Link href="/payment" className="text-white hover:text-cyan-400">Checkout</Link>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500">● LIVE</span>
              <Link href="/products" className="bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-2 rounded-full font-bold">Shop Now</Link>
            </div>
          </div>
        </nav>

        {/* HERO SECTION */}
        <main className="container mx-auto px-4 py-20 text-center flex-grow">
          <h1 className="text-6xl md:text-8xl font-extrabold mb-6 leading-tight">
            <span className="text-white">The World&apos;s</span><br />
            <span className="text-cyan-400">Top 30</span><br />
            <span className="text-white">Digital Products</span><br />
            <span className="text-yellow-400">Delivered Instantly.</span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            From AI tools to creative software — shop globally. Pay in USD/ZAR/INR, receive instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/products" className="bg-cyan-500 hover:bg-cyan-400 text-white px-10 py-5 rounded-full text-lg font-bold shadow-xl shadow-cyan-500/40 transform hover:scale-105 transition">
              Browse All Products
            </Link>
            <Link href="/payment" className="bg-gray-800 hover:bg-gray-700 text-white px-10 py-5 rounded-full text-lg font-bold border border-gray-600">
              Go to Checkout
            </Link>
          </div>
        </main>

        {/* LIVE SALES TRACKER SECTION */}
        <section className="container mx-auto px-4 pb-20">
          <div className="bg-[#0b0f14]/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 shadow-2xl">
            <h2 className="text-cyan-400 font-bold text-center text-2xl mb-8 tracking-wider">LIVE SALES ACTIVITY</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* USA */}
              <div className="bg-[#16191f] p-6 rounded-xl text-center border border-gray-700">
                <div className="text-blue-400 text-sm font-bold mb-2">USA</div>
                <div className="text-3xl font-bold text-white">226,805</div>
              </div>
              {/* INDIA */}
              <div className="bg-[#16191f] p-6 rounded-xl text-center border border-gray-700">
                <div className="text-orange-400 text-sm font-bold mb-2">INDIA</div>
                <div className="text-3xl font-bold text-white">233,953</div>
              </div>
              {/* CHINA */}
              <div className="bg-[#16191f] p-6 rounded-xl text-center border border-gray-700">
                <div className="text-red-400 text-sm font-bold mb-2">CHINA</div>
                <div className="text-3xl font-bold text-white">231,752</div>
              </div>
              {/* SOUTH AFRICA */}
              <div className="bg-[#16191f] p-6 rounded-xl text-center border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                <div className="text-green-400 text-sm font-bold mb-2">SOUTH AFRICA</div>
                <div className="text-3xl font-bold text-white">215,595</div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-800 text-center">
              <span className="text-gray-400 mr-2">Total Global Volume:</span>
              <span className="text-cyan-400 font-bold text-2xl">908,105</span>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="text-center text-gray-500 pb-8">
          © 2026 Super Digital Markets.
        </footer>
      </div>
    </div>
  );
}
