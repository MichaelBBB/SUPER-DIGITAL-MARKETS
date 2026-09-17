import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
            alt="Background" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Super Digital Markets
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
            From AI tools to creative software — shop in USD, pay your way, receive instantly. Trusted by buyers across 3 continents.
          </p>
          
          {/* Buttons INSIDE the Hero Section */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-lg shadow-lg transition-transform hover:scale-105">
                Browse Products
              </button>
            </Link>
            
            <Link href="/payment?item=Test+Product&amount=10.99">
              <button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full text-lg shadow-lg transition-transform hover:scale-105">
                Test Payment
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-16">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold mb-3">Instant Delivery</h3>
              <p className="text-gray-400">Get your products immediately.</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold mb-3">Secure Payments</h3>
              <p className="text-gray-400">Card, WhatsApp, and Bank Transfer.</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold mb-3">Global Access</h3>
              <p className="text-gray-400">Trusted across 3 continents.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm">
        © 2026 Super Digital Markets. All rights reserved.
      </footer>
    </div>
  );
}
