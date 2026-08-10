"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckCircle, Zap } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  priceZar: string;
  priceUsd: string;
  priceInr: string;
  description: string;
  icon: string;
  popular: boolean;
}

export default function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const handleSelect = (product: Product) => {
    setSelectedProduct(product);
    setShowCheckoutModal(true);
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-white">
      {/* HEADER */}
      <header className="border-b border-gray-800 sticky top-0 bg-[#0f1115]/90 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-cyan-400">SUPER DIGITAL</Link>
          <nav className="space-x-6 hidden md:flex">
            <Link href="/" className="hover:text-cyan-400 transition">Home</Link>
            <Link href="/products" className="text-cyan-400 font-medium">Products</Link>
            <Link href="/checkout" className="hover:text-cyan-400 transition">Checkout</Link>
          </nav>
          <Link href="/checkout" className="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-lg font-medium text-sm">
            Shop Now
          </Link>
        </div>
        <div className="container mx-auto px-4 py-2 text-xs text-center text-gray-400">
          LIVE GLOBAL MARKETPLACE • USA • India • China • South Africa
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4 text-center">Featured Products</h1>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">Premium digital assets delivered instantly via email verification.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(() => {
            const products: Product[] = [
              {
                id: "chatgpt-plus",
                name: "ChatGPT Plus",
                category: "AI Tools",
                priceZar: "54.99",
                priceUsd: "3.00",
                priceInr: "250",
                description: "Access GPT-4o, advanced voice mode, image generation & priority access.",
                icon: "🤖",
                popular: true
              },
              {
                id: "midjourney-premium",
                name: "Midjourney Premium",
                category: "Creative Software",
                priceZar: "54.99",
                priceUsd: "3.00",
                priceInr: "250",
                description: "Generate unlimited stunning images with our most powerful AI art generator.",
                icon: "🎨",
                popular: false
              },
              {
                id: "notion-team",
                name: "Notion Team License",
                category: "Productivity",
                priceZar: "129.99",
                priceUsd: "7.00",
                priceInr: "600",
                description: "Collaborate seamlessly with your team using enterprise-grade features.",
                icon: "📝",
                popular: false
              },
              {
                id: "canva-pro",
                name: "Canva Pro Lifetime",
                category: "Design Tools",
                priceZar: "89.99",
                priceUsd: "5.00",
                priceInr: "400",
                description: "Unlimited design assets, templates & brand kit access for professionals.",
                icon: "✨",
                popular: true
              }
            ];

            return products.map((product) => (
              <div key={product.id} 
                className={`bg-[#16191f] border ${selectedProduct?.id === product.id ? 'border-cyan-500' : 'border-gray-800'} rounded-2xl p-6 hover:border-cyan-400 transition cursor-pointer`}
                onClick={() => handleSelect(product)}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-4xl">{product.icon}</span>
                  {product.popular && (
                    <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded text-xs font-medium">POPULAR</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-sm text-gray-400 mb-4 min-h-[48px]">{product.description}</p>
                <div className="mb-4 space-y-1">
                  <div className="text-xs text-gray-500">South Africa:</div>
                  <div className="text-xl font-bold">R{product.priceZar}</div>
                  <div className="text-xs text-gray-500">USA:</div>
                  <div className="text-sm">USD ${product.priceUsd}</div>
                  <div className="text-xs text-gray-500">India:</div>
                  <div className="text-sm">INR ₹{product.priceInr}</div>
                </div>
                <Link href={`/payment?product=${product.id}&amount=${product.priceZar}`} className="block w-full bg-cyan-500 hover:bg-cyan-400 text-center py-2 rounded-lg font-medium transition">
                  Buy Now
                </Link>
              </div>
            ));
          })()}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 mt-24 py-12 text-center text-gray-400 text-sm">
        Instant Delivery • Secure Payment • 24/7 Support • Global Market
      </footer>

      {/* CHECKOUT MODAL */}
      {showCheckoutModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#16191f] border border-gray-700 rounded-2xl p-6 max-w-md w-full relative">
            <button onClick={() => setShowCheckoutModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="text-cyan-400 w-5 h-5"/> {selectedProduct.name}
            </h3>
            <div className="space-y-3 mb-6">
              <div className="text-sm text-gray-400">{selectedProduct.description}</div>
              <div className="text-2xl font-bold text-cyan-400">R{selectedProduct.priceZar}</div>
              <div className="text-xs text-gray-500">Price: R{selectedProduct.priceZar} • USD: ${selectedProduct.priceUsd} • INR: ₹{selectedProduct.priceInr}</div>
              <div className="bg-green-500/10 text-green-400 p-3 rounded-lg text-sm flex items-center gap-2">
                <Zap className="w-4 h-4" /> Instant Delivery After Confirmation
              </div>
            </div>
            <Link href={`/payment?product=${selectedProduct.id}&amount=${selectedProduct.priceZar}`} className="block w-full bg-cyan-500 hover:bg-cyan-400 text-white py-3 rounded-xl font-bold text-center">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
