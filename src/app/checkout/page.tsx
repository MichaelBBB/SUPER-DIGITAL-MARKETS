'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// TypeScript interface for products
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

// Product database (matches homepage)
const products: Product[] = [
  { id: 1, name: "ChatGPT Plus", price: 20.00, description: "OpenAI's GPT-4 powered assistant" },
  { id: 2, name: "Adobe Creative Cloud", price: 54.99, description: "Full suite of Adobe apps" },
  { id: 3, name: "Netflix Premium", price: 22.99, description: "4K streaming service" },
  { id: 4, name: "Microsoft 365 Business", price: 12.50, description: "Office apps + 1TB OneDrive" },
  { id: 5, name: "Spotify Premium", price: 9.99, description: "Ad-free music streaming" },
  { id: 6, name: "NordVPN", price: 3.99, description: "Military-grade encryption" },
  { id: 7, name: "Notion Plus", price: 8.00, description: "All-in-one workspace" },
  { id: 8, name: "Figma Professional", price: 12.00, description: "Collaborative UI/UX design" },
  { id: 9, name: "Dropbox Plus", price: 9.99, description: "2TB cloud storage" },
  { id: 10, name: "Canva Pro", price: 12.99, description: "Premium design templates" },
  { id: 11, name: "Grammarly Premium", price: 12.00, description: "AI writing assistant" },
  { id: 12, name: "Zoom Pro", price: 14.99, description: "Unlimited meetings" },
  { id: 13, name: "LastPass Premium", price: 3.00, description: "Secure password manager" },
  { id: 14, name: "Cursor AI Pro", price: 20.00, description: "AI-first code editor" },
  { id: 15, name: "Midjourney Standard", price: 24.00, description: "AI image generation" },
  { id: 16, name: "GitHub Copilot", price: 10.00, description: "AI pair programmer" },
  { id: 17, name: "Slack Pro", price: 7.25, description: "Team messaging" },
  { id: 18, name: "Dashlane Premium", price: 4.99, description: "Password manager + VPN" },
  { id: 19, name: "Adobe Photoshop", price: 22.99, description: "Industry-standard photo editing" },
  { id: 20, name: "Claude Pro", price: 20.00, description: "Advanced AI assistant" },
  { id: 21, name: "Adobe Premiere Pro", price: 22.99, description: "Professional video editing" },
  { id: 22, name: "Asana Premium", price: 10.99, description: "Project management" },
  { id: 23, name: "ExpressVPN", price: 6.67, description: "Ultra-fast VPN" },
  { id: 24, name: "YouTube Premium", price: 13.99, description: "Ad-free YouTube" },
  { id: 25, name: "1Password", price: 2.99, description: "Password manager" },
  { id: 26, name: "Monday.com Pro", price: 9.00, description: "Visual work OS" },
  { id: 27, name: "Perplexity Pro", price: 20.00, description: "AI-powered search" },
  { id: 28, name: "Loom Business", price: 12.50, description: "Async video messaging" },
  { id: 29, name: "Webflow CMS", price: 14.00, description: "No-code website builder" },
  { id: 30, name: "ElevenLabs Starter", price: 5.00, description: "AI voice cloning" }
];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = searchParams.get('product');
    if (id) {
      const found = products.find(p => p.id === parseInt(id));
      setProduct(found || null);
    }
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Product not found</p>
          <Link href="/" className="px-6 py-3 bg-cyan-500 rounded-full font-semibold hover:bg-cyan-400 transition">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 mb-4 inline-block text-sm">
            ← Back to Products
          </Link>
          <h1 className="text-3xl font-bold mb-2">Secure Checkout</h1>
          <p className="text-gray-400">Complete your payment for {product.name}</p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{product.name}</h2>
            <span className="text-2xl font-bold text-cyan-400">${product.price.toFixed(2)}</span>
          </div>
          <p className="text-gray-400 text-sm">{product.description}</p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <h3 className="text-lg font-bold mb-4">Select Payment Method</h3>
          
          <button className="w-full p-4 bg-slate-800 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition text-left mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl"></span>
                <div>
                  <div className="font-semibold">Credit/Debit Card</div>
                  <div className="text-xs text-gray-400">Visa, Mastercard via Peach Payments</div>
                </div>
              </div>
              <div className="text-cyan-400 font-bold">${product.price.toFixed(2)}</div>
            </div>
          </button>

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
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
