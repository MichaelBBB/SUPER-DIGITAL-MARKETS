'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Checkout() {
  const searchParams = useSearchParams();
  const [productId, setProductId] = useState('');
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Product database (same as homepage)
  const products = [
    { id: 1, name: "ChatGPT Plus", price: 20.00, description: "OpenAI's GPT-4 powered assistant" },
    { id: 2, name: "Adobe Creative Cloud", price: 54.99, description: "Full suite of Adobe apps" },
    { id: 3, name: "Netflix Premium", price: 22.99, description: "4K streaming service" },
    // Add all 30 products here or fetch from API
  ];

  useEffect(() => {
    const id = searchParams.get('product');
    if (id) {
      setProductId(id);
      const foundProduct = products.find(p => p.id === parseInt(id));
      setProduct(foundProduct);
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading secure checkout...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Product not found</p>
          <Link href="/" className="px-6 py-3 bg-cyan-500 rounded-full font-semibold">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white py-20 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 mb-4 inline-block">
            ← Back to Products
          </Link>
          <h1 className="text-3xl font-bold mb-2">Secure Checkout</h1>
          <p className="text-gray-400">Complete your payment for {product.name}</p>
        </div>

        {/* Product Summary */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{product.name}</h2>
            <span className="text-2xl font-bold text-cyan-400">${product.price.toFixed(2)}</span>
          </div>
          <p className="text-gray-400 text-sm">{product.description}</p>
        </div>

        {/* Payment Options */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 mb-6">
          <h3 className="text-lg font-bold mb-4">Select Payment Method</h3>
          
          <div className="space-y-3">
            {/* Capitec Bank Transfer */}
            <button className="w-full p-4 bg-slate-800 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏦</span>
                  <div>
                    <div className="font-semibold">Capitec Bank Transfer</div>
                    <div className="text-xs text-gray-400">Direct bank transfer</div>
                  </div>
                </div>
                <div className="text-cyan-400 font-bold">${product.price.toFixed(2)}</div>
              </div>
            </button>

            {/* Peach Payments - Card */}
            <button className="w-full p-4 bg-slate-800 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💳</span>
                  <div>
                    <div className="font-semibold">Credit/Debit Card</div>
                    <div className="text-xs text-gray-400">Visa, Mastercard via Peach Payments</div>
                  </div>
                </div>
                <div className="text-cyan-400 font-bold">${product.price.toFixed(2)}</div>
              </div>
            </button>
          </div>
        </div>

        {/* Bank Details (Show if Capitec selected) */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <h3 className="text-lg font-bold mb-4">Banking Details</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-xs text-gray-500 mb-1">Account Holder</div>
              <div className="font-bold">SUPER DIGITAL</div>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-xs text-gray-500 mb-1">Account Number</div>
              <div className="font-bold font-mono">1975933441</div>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-xs text-gray-500 mb-1">Branch Code</div>
              <div className="font-bold font-mono">470010</div>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-xs text-gray-500 mb-1">Reference</div>
              <div className="font-bold">ORDER-{productId}</div>
            </div>
          </div>

          <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl mb-6">
            <p className="text-sm text-orange-200 mb-2 font-semibold">After Payment:</p>
            <p className="text-xs text-gray-300">
              Email proof of payment to <span className="text-cyan-400">payments@superdigital.store</span> with your order number.
            </p>
          </div>

          <button className="w-full py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-lg transition">
            I've Made the Payment
          </button>
        </div>

      </div>
    </div>
  );
}
