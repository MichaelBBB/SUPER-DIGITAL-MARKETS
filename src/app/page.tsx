'use client';

import { useState } from 'react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Sample product data - replace with your actual products later
  const products = [
    { id: 1, name: "AI Business Automation Suite", price: 299, category: "Software" },
    { id: 2, name: "Digital Marketing Masterclass", price: 149, category: "Course" },
    { id: 3, name: "E-commerce Growth Toolkit", price: 199, category: "Template" },
    { id: 4, name: "Social Media Content Pack", price: 79, category: "Design" },
    { id: 5, name: "SEO Optimization Guide", price: 49, category: "Guide" },
    { id: 6, name: "Email Marketing Templates", price: 39, category: "Template" }
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* NAVIGATION */}
      <nav className="bg-slate-900 text-white py-4 px-6 fixed w-full z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-400">Super Digital</div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <a href="#" className="hover:text-blue-400 transition">Home</a>
            <a href="#products" className="hover:text-blue-400 transition">Products</a>
            <a href="#" className="hover:text-blue-400 transition">Contact</a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            <a href="#" className="block hover:text-blue-400">Home</a>
            <a href="#products" className="block hover:text-blue-400">Products</a>
            <a href="#" className="block hover:text-blue-400">Contact</a>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Sales Of The Top 30 <span className="text-blue-400">Digital Products</span><br/>Worldwide!!
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Premium digital assets, courses, and tools designed to help you scale your business faster than ever before.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#products" 
              className="px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-full font-bold text-lg transition transform hover:scale-105 shadow-lg inline-block"
            >
              Browse Products
            </a>
          </div>
        </div>
      </section>

      {/* PRODUCT GRID SECTION */}
      <section id="products" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Featured Digital Products</h2>
            <p className="text-gray-600 text-lg">Hand-picked resources for serious entrepreneurs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
                {/* Placeholder Image Box */}
                <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                  <span className="text-sm">Product Image</span>
                </div>
                
                <div className="p-6">
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-wide">{product.category}</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-2 mb-2">{product.name}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-2xl font-bold text-slate-900">${product.price}</span>
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-blue-600 transition">
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>&copy; 2024 Super Digital Markets. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
