"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ShoppingBag, Star, Flame } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  priceZar: string;
  priceUsd: string;
  priceInr: string;
  icon: string;
  badge?: string;
  category: string;
  image: string;
}

const allProducts: Product[] = [
  {
    id: "chatgpt-plus",
    name: "ChatGPT Plus",
    description: "OpenAI's GPT-4 powered assistant. Advanced reasoning, image analysis & priority access.",
    priceZar: "$54.99",
    priceUsd: "$20.00",
    priceInr: "₹1,700",
    icon: "🤖",
    badge: "HOT",
    category: "AI Tools",
    image: "https://images.unsplash.com/photo-1681580910373-b7e2a7e1c9b4?w=500&h=300&fit=crop"
  },
  {
    id: "midjourney-premium",
    name: "Midjourney Premium",
    description: "Generate unlimited stunning images with our most powerful AI art generator.",
    priceZar: "$54.99",
    priceUsd: "$20.00",
    priceInr: "₹1,700",
    icon: "🎨",
    badge: "POPULAR",
    category: "AI Tools",
    image: "https://images.unsplash.com/photo-1618331835155-5e782857fd49?w=500&h=300&fit=crop"
  },
  {
    id: "claude-pro",
    name: "Claude Pro",
    description: "Anthropic's advanced AI for writing, research & analysis.",
    priceZar: "$35.00",
    priceUsd: "$15.00",
    priceInr: "₹1,275",
    icon: "💬",
    badge: undefined,
    category: "AI Tools",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop"
  },
  {
    id: "perplexity-pro",
    name: "Perplexity Pro",
    description: "AI-powered search engine with real-time web browsing.",
    priceZar: "$40.00",
    priceUsd: "$20.00",
    priceInr: "₹1,700",
    icon: "🔍",
    badge: undefined,
    category: "AI Tools",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop"
  },
  {
    id: "canva-pro",
    name: "Canva Pro Lifetime",
    description: "Unlimited design assets, templates & brand kit access.",
    priceZar: "$89.99",
    priceUsd: "$12.99",
    priceInr: "₹1,100",
    icon: "✨",
    badge: "POPULAR",
    category: "Creative",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&h=300&fit=crop"
  },
  {
    id: "adobe-creative-cloud",
    name: "Adobe Creative Cloud",
    description: "Full suite of Adobe apps — Photoshop, Illustrator, Premiere Pro.",
    priceZar: "$54.99",
    priceUsd: "$54.99",
    priceInr: "₹4,700",
    icon: "🎨",
    badge: "POPULAR",
    category: "Creative",
    image: "https://images.unsplash.com/photo-1626785774573-4b799312afc2?w=500&h=300&fit=crop"
  },
  {
    id: "procreate-ipad",
    name: "Procreate iPad",
    description: "Professional digital painting app for iPad.",
    priceZar: "$150.00",
    priceUsd: "$12.99",
    priceInr: "₹1,100",
    icon: "🖌️",
    badge: undefined,
    category: "Creative",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&h=300&fit=crop"
  },
  {
    id: "sketch-lifetime",
    name: "Sketch Lifetime",
    description: "Vector design tool for Mac. Industry-standard UI/UX platform.",
    priceZar: "$199.00",
    priceUsd: "$99.00",
    priceInr: "₹8,400",
    icon: "",
    badge: "HOT",
    category: "Creative",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&h=300&fit=crop"
  },
  {
    id: "netflix-premium",
    name: "Netflix Premium",
    description: "4K streaming, 4 simultaneous screens, offline downloads.",
    priceZar: "$22.99",
    priceUsd: "$22.99",
    priceInr: "₹1,950",
    icon: "",
    badge: "HOT",
    category: "Entertainment",
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&h=300&fit=crop"
  },
  {
    id: "spotify-premium",
    name: "Spotify Premium",
    description: "Ad-free music streaming, high quality audio, offline listening.",
    priceZar: "$35.00",
    priceUsd: "$9.99",
    priceInr: "₹850",
    icon: "🎵",
    badge: undefined,
    category: "Entertainment",
    image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=500&h=300&fit=crop"
  },
  {
    id: "premier-league-pass",
    name: "Premier League Pass",
    description: "Watch every live match, highlights, exclusive content.",
    priceZar: "$40.00",
    priceUsd: "$11.00",
    priceInr: "₹935",
    icon: "⚽",
    badge: "HOT",
    category: "Entertainment",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&h=300&fit=crop"
  },
  {
    id: "disney-plus",
    name: "Disney+ Premium",
    description: "All Disney content including Marvel, Star Wars & National Geographic.",
    priceZar: "$28.00",
    priceUsd: "$9.99",
    priceInr: "₹850",
    icon: "🏰",
    badge: undefined,
    category: "Entertainment",
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&h=300&fit=crop"
  },
  {
    id: "microsoft-365-business",
    name: "Microsoft 365 Business",
    description: "Word, Excel, PowerPoint, Teams, OneDrive, Outlook for business use.",
    priceZar: "$12.50",
    priceUsd: "$12.50",
    priceInr: "₹1,060",
    icon: "💼",
    badge: "POPULAR",
    category: "Business",
    image: "https://images.unsplash.com/photo-1668645812236-89c0e7c8e3dc?w=500&h=300&fit=crop"
  },
  {
    id: "grammarly-premium",
    name: "Grammarly Premium",
    description: "Advanced grammar checking, plagiarism detection, tone adjustments.",
    priceZar: "$45.00",
    priceUsd: "$12.00",
    priceInr: "₹1,020",
    icon: "✍️",
    badge: undefined,
    category: "Business",
    image: "https://images.unsplash.com/photo-1516321318423-f06f05eaa740?w=500&h=300&fit=crop"
  },
  {
    id: "dropbox-pro",
    name: "Dropbox Professional",
    description: "2TB cloud storage, file sharing, collaboration tools.",
    priceZar: "$59.99",
    priceUsd: "$16.99",
    priceInr: "₹1,440",
    icon: "☁️",
    badge: undefined,
    category: "Business",
    image: "https://images.unsplash.com/photo-1669255911061-7bb3e4f1a8a0?w=500&h=300&fit=crop"
  },
  {
    id: "zoom-subsidiary",
    name: "Zoom Subscriber",
    description: "HD video conferencing, screen sharing, recording.",
    priceZar: "$65.00",
    priceUsd: "$15.00",
    priceInr: "₹1,275",
    icon: "📹",
    badge: undefined,
    category: "Business",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&h=300&fit=crop"
  },
  {
    id: "notion-team",
    name: "Notion Team License",
    description: "Collaborate seamlessly with your team using enterprise-grade features.",
    priceZar: "$129.99",
    priceUsd: "$7.00",
    priceInr: "₹600",
    icon: "📝",
    badge: undefined,
    category: "Productivity",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4f8e?w=500&h=300&fit=crop"
  },
  {
    id: "evernote-business",
    name: "Evernote Business",
    description: "Team workspace, shared notebooks, advanced search.",
    priceZar: "$42.00",
    priceUsd: "$8.99",
    priceInr: "₹765",
    icon: "📋",
    badge: undefined,
    category: "Productivity",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4f8e?w=500&h=300&fit=crop"
  },
  {
    id: "trello-business-class",
    name: "Trello Business Class",
    description: "Visual project management with boards, cards, lists.",
    priceZar: "$48.00",
    priceUsd: "$12.00",
    priceInr: "₹1,020",
    icon: "🗂️",
    badge: undefined,
    category: "Productivity",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4f8e?w=500&h=300&fit=crop"
  },
  {
    id: "asana-premium",
    name: "Asana Premium",
    description: "Project management with timeline view, dependencies.",
    priceZar: "$56.00",
    priceUsd: "$13.99",
    priceInr: "₹1,190",
    icon: "✅",
    badge: undefined,
    category: "Productivity",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4f8e?w=500&h=300&fit=crop"
  },
  {
    id: "nordvpn-premium",
    name: "NordVPN Premium",
    description: "Top-rated VPN with military-grade encryption, no-logs policy.",
    priceZar: "$30.00",
    priceUsd: "$11.99",
    priceInr: "₹1,020",
    icon: "🔒",
    badge: "POPULAR",
    category: "Security",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&h=300&fit=crop"
  },
  {
    id: "expressvpn-premium",
    name: "ExpressVPN Premium",
    description: "Ultra-fast VPN with server in 94 countries, split tunneling.",
    priceZar: "$40.00",
    priceUsd: "$16.67",
    priceInr: "₹1,420",
    icon: "",
    badge: undefined,
    category: "Security",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&h=300&fit=crop"
  },
  {
    id: "malwarebytes-premium",
    name: "Malwarebytes Premium",
    description: "Advanced malware protection, ransomware defense.",
    priceZar: "$50.00",
    priceUsd: "$39.99",
    priceInr: "₹3,400",
    icon: "🛡️",
    badge: "HOT",
    category: "Security",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&h=300&fit=crop"
  },
  {
    id: "lastpass-family",
    name: "LastPass Family",
    description: "Password manager for up to 6 family members.",
    priceZar: "$35.00",
    priceUsd: "$12.00",
    priceInr: "₹1,020",
    icon: "🔐",
    badge: undefined,
    category: "Security",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&h=300&fit=crop"
  },
  {
    id: "youtube-studio-premium",
    name: "YouTube Studio Premium",
    description: "Advanced analytics, custom thumbnails, audience insights.",
    priceZar: "$45.00",
    priceUsd: "$13.99",
    priceInr: "₹1,190",
    icon: "▶️",
    badge: "POPULAR",
    category: "AI Tools",
    image: "https://images.unsplash.com/photo-1681580910373-b7e2a7e1c9b4?w=500&h=300&fit=crop"
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    description: "AI pair programmer for developers. Autocomplete code.",
    priceZar: "$35.00",
    priceUsd: "$10.00",
    priceInr: "₹850",
    icon: "👨‍💻",
    badge: undefined,
    category: "AI Tools",
    image: "https://images.unsplash.com/photo-1681580910373-b7e2a7e1c9b4?w=500&h=300&fit=crop"
  },
  {
    id: "figma-teams",
    name: "Figma Teams",
    description: "Professional design collaboration with unlimited projects.",
    priceZar: "$80.00",
    priceUsd: "$15.00",
    priceInr: "₹1,275",
    icon: "",
    badge: undefined,
    category: "Creative",
    image: "https://images.unsplash.com/photo-1626785774573-4b799312afc2?w=500&h=300&fit=crop"
  },
  {
    id: "airtable-enterprise",
    name: "Airtable Enterprise",
    description: "Database-as-a-platform for complex workflows.",
    priceZar: "$75.00",
    priceUsd: "$20.00",
    priceInr: "₹1,700",
    icon: "",
    badge: undefined,
    category: "Productivity",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4f8e?w=500&h=300&fit=crop"
  },
  {
    id: "unity-pro-license",
    name: "Unity Pro License",
    description: "Professional game development engine. Remove Unity branding.",
    priceZar: "$250.00",
    priceUsd: "$200.00",
    priceInr: "₹17,000",
    icon: "🎮",
    badge: undefined,
    category: "Creative",
    image: "https://images.unsplash.com/photo-1618331835155-5e782857fd49?w=500&h=300&fit=crop"
  },
  {
    id: "blender-courses",
    name: "Blender Pro Courses",
    description: "Complete 3D modeling & animation training bundle.",
    priceZar: "$95.00",
    priceUsd: "$79.99",
    priceInr: "₹6,800",
    icon: "🎨",
    badge: "NEW",
    category: "Creative",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&h=300&fit=crop"
  }
];

const categories = ["All", "AI Tools", "Creative", "Entertainment", "Business", "Productivity", "Security"];
type Category = typeof categories[number];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");

  const filteredProducts = selectedCategory === "All" 
    ? allProducts 
    : allProducts.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white">
      <nav className="border-b border-gray-800 sticky top-0 bg-[#0a0e17]/95 backdrop-blur-md z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-cyan-400 flex items-center gap-2">
            <div className="w-7 h-7 bg-cyan-400 rounded-full flex items-center justify-center shadow-lg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#0a0e17]">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            SUPER DIGITAL
          </Link>
          
          <div className="hidden md:flex space-x-10">
            <Link href="/" className="text-white hover:text-cyan-400 transition font-medium">Home</Link>
            <Link href="/products" className="text-cyan-400 font-medium">Products</Link>
            <Link href="/checkout" className="text-white hover:text-cyan-400 transition font-medium">Checkout</Link>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="bg-green-500/20 text-green-400 text-xs px-4 py-2 rounded-full border border-green-500/40 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              LIVE
            </span>
            <Link 
              href="/products" 
              className="bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition shadow-lg shadow-cyan-500/40"
            >
              Shop Now
            </Link>
          </div>
        </div>
        
        <div className="container mx-auto px-6 py-3 text-xs text-center">
          <div className="inline-flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full border border-gray-700">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-cyan-400 font-semibold">LIVE GLOBAL MARKETPLACE</span> 
            <span className="mx-2 text-gray-600">•</span> 
            <span className="text-gray-400">USA • India • China • South Africa</span>
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6 text-center">All Digital Products</h1>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">Premium digital assets delivered instantly via email verification.</p>
        
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition ${
                selectedCategory === category
                  ? "bg-cyan-500 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="relative group cursor-pointer">
              {product.badge && (
                <div className="absolute top-3 left-3 z-10">
                  {product.badge === "HOT" ? (
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                      <Flame className="w-3 h-3" /> HOT
                    </span>
                  ) : product.badge === "POPULAR" ? (
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3" /> POPULAR
                    </span>
                  ) : (
                    <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
                      NEW
                    </span>
                  )}
                </div>
              )}
              
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-t-2xl mb-4" />
              
              <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
              <p className="text-sm text-gray-400 mb-2 line-clamp-2">{product.description}</p>
              <div className="text-cyan-400 font-bold text-lg mb-4">{product.priceUsd}</div>
              
              <button className="w-full bg-cyan-500 hover:bg-cyan-400 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition">
                <ShoppingBag className="w-4 h-4" /> Buy Now — {product.priceUsd}
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-800 mt-24 py-12 text-center text-gray-400 text-sm">
        © 2026 Super Digital Markets. All rights reserved. | Instant Delivery • Secure Payment • 24/7 Support • Global Market
      </footer>
    </div>
  );
}
