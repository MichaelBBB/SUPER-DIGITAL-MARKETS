import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-8 text-center">
          Super Digital Markets
        </h1>
        <p className="text-xl text-gray-300 text-center mb-12">
          From AI tools to creative software — shop globally. Instant delivery in USD, ZAR, INR.
        </p>
        
        {/* Navigation Links */}
        <div className="flex flex-col gap-4 text-center max-w-md mx-auto">
          <Link 
            href="/payment" 
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-lg font-semibold transition-all"
          >
            Payment Methods
          </Link>
          
          <Link 
            href="/products" 
            className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-lg text-lg font-semibold transition-all"
          >
            Shop Products
          </Link>
          
          <Link 
            href="/checkout" 
            className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg text-lg font-semibold transition-all"
          >
            Checkout
          </Link>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="text-center text-gray-400 mt-20 pb-8">
        © 2026 Super Digital Markets. All rights reserved.
      </footer>
    </div>
  );
}
