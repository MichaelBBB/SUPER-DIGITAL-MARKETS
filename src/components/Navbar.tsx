import Link from 'next/link';

// This is the complete function definition
export default function Navbar() {
  // We must provide a "return" statement so the component knows what to display
  return (
    <nav className="bg-slate-950 border-b border-slate-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        
        {/* Logo Area */}
        <Link href="/" className="text-xl font-bold text-cyan-400">
          SUPER DIGITAL
        </Link>

        {/* Navigation Menu */}
        <div className="flex items-center gap-6">
          <Link href="/products" className="text-gray-300 hover:text-white transition">
            Products
          </Link>
          
          <Link href="/checkout" className="text-gray-300 hover:text-white transition">
            Checkout
          </Link>
          
          {/* Call to Action Button */}
          <a 
            href="/products" 
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition font-medium"
          >
            Shop Now
          </a>
        </div>
      </div>
    </nav>
  ); // Closing parenthesis for the return
} // Closing brace for the function
