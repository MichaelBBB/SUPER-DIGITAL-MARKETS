import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white">
      {/* HERO SECTION */}
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 text-center">
          The World's <span className="text-cyan-400">Top 30</span> Digital Products<br />
          <span className="text-yellow-400">Delivered Instantly.</span>
        </h1>
        
        <p className="text-xl text-gray-300 text-center mb-12 max-w-3xl mx-auto">
          From AI tools to creative software — shop globally. Pay in USD/ZAR/INR, receive instantly. Trusted by buyers across 3 continents.
        </p>
        
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center text-center max-w-md mx-auto">
          <Link href="/products" className="bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-4 rounded-xl text-lg font-bold transition transform hover:scale-105">
            Browse All Products
          </Link>
          <Link href="/checkout" className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition border border-gray-600">
            Go to Checkout
          </Link>
        </div>
      </main>
      
      {/* FOOTER */}
      <footer className="text-center text-gray-400 mt-24 pb-12">
        © 2026 Super Digital Markets. All rights reserved. | Trusted by global buyers
      </footer>
    </div>
  );
}
