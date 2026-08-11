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
    id: "chatgpt",
    name: "ChatGPT Plus",
    description: "OpenAI's GPT-4 powered assistant. Advanced reasoning, image generation, and browsing included.",
    priceZar: "$54.99",
    priceUsd: "$20.00",
    priceInr: "₹1,700",
    icon: "🤖",
    badge: "HOT",
    category: "AI Tools",
    image: "/images/chatgpt.jpg"
  },
  {
    id: "adobe-cc",
    name: "Adobe Creative Cloud",
    description: "Full suite of Adobe apps — Photoshop, Illustrator, Premiere Pro, and 20+ more.",
    priceZar: "$54.99",
    priceUsd: "$54.99",
    priceInr: "₹4,700",
    icon: "🎨",
    badge: "POPULAR",
    category: "Creative",
    image: "/images/adobe-cc.jpg"
  },
  {
    id: "netfix",  // FIXED: matches actual filename exactly
    name: "Netflix Premium",
    description: "4K streaming, 4 simultaneous screens, offline downloads. 10,000+ titles worldwide.",
    priceZar: "$22.99",
    priceUsd: "$22.99",
    priceInr: "₹1,950",
    icon: "",
    badge: "HOT",
    category: "Entertainment",
    image: "/images/netfix.jpg"  // FIXED!
  },
  {
    id: "microsoft365",
    name: "Microsoft 365 Business",
    description: "Word, Excel, PowerPoint, Teams, and 1TB OneDrive. For business and personal use.",
    priceZar: "$12.50",
    priceUsd: "$12.50",
    priceInr: "₹1,060",
    icon: "💼",
    badge: "POPULAR",
    category: "Business",
    image: "/images/microsoft365.jpg"
  },
  {
    id: "spotify",
    name: "Spotify Premium",
    description: "Ad-free music, offline listening, unlimited skips. 100M+ songs and podcasts.",
    priceZar: "$9.99",
    priceUsd: "$9.99",
    priceInr: "₹850",
    icon: "🎵",
    badge: "POPULAR",
    category: "Entertainment",
    image: "/images/spotify.jpg"
  },
  {
    id: "nordvpn",
    name: "NordVPN",
    description: "Military-grade encryption, 5,500+ servers in 60 countries. No-logs policy.",
    priceZar: "$3.99",
    priceUsd: "$3.99",
    priceInr: "₹340",
    icon: "🔒",
    badge: "HOT",
    category: "Security",
    image: "/images/nordvpn.jpg"
  },
  {
    id: "canva",
    name: "Canva Pro",
    description: "Premium design templates, Brand Kit, background remover, and 100M+ stock assets.",
    priceZar: "$12.99",
    priceUsd: "$12.99",
    priceInr: "₹1,100",
    icon: "✨",
    badge: "NEW",
    category: "Creative",
    image: "/images/canva.jpg"
  },
  {
    id: "grammarly",
    name: "Grammarly Premium",
    description: "AI writing assistant with advanced grammar, clarity, and plagiarism detection.",
    priceZar: "$12.00",
    priceUsd: "$12.00",
    priceInr: "₹1,020",
    icon: "✍️",
    badge: "POPULAR",
    category: "Productivity",
    image: "/images/grammarly.jpg"
  },
  {
    id: "zoom",
    name: "Zoom Pro",
    description: "Unlimited meetings up to 30 hours, 100 participants, cloud recording, admin controls.",
    priceZar: "$14.99",
    priceUsd: "$14.99",
    priceInr: "₹1,275",
    icon: "📹",
    badge: "HOT",
    category: "Business",
    image: "/images/zoom.jpg"
  },
  {
    id: "notion",
    name: "Notion Plus",
    description: "All-in-one workspace for notes, wikis, databases, and project management.",
    priceZar: "$8.00",
    priceUsd: "$8.00",
    priceInr: "₹680",
    icon: "📝",
    badge: "POPULAR",
    category: "Productivity",
    image: "/images/notion.jpg"
  },
  {
    id: "figma",
    name: "Figma Professional",
    description: "Collaborative UI/UX design tool. Real-time multiplayer, unlimited projects, dev mode.",
    priceZar: "$12.00",
    priceUsd: "$12.00",
    priceInr: "₹1,020",
    icon: "",
    badge: "HOT",
    category: "Creative",
    image: "/images/figma.jpg"
  },
  {
    id: "dropbox",
    name: "Dropbox Plus",
    description: "2TB cloud storage, Smart Sync, version history, and secure file sharing.",
    priceZar: "$9.99",
    priceUsd: "$9.99",
    priceInr: "₹850",
    icon: "☁️",
    badge: "POPULAR",
    category: "Productivity",
    image: "/images/dropbox.jpg"
  },
  {
    id: "lastpass",
    name: "LastPass Premium",
    description: "Secure password manager with dark web monitoring, 1GB encrypted storage.",
    priceZar: "$3.00",
    priceUsd: "$3.00",
    priceInr: "₹255",
    icon: "🔐",
    badge: "POPULAR",
    category: "Security",
    image: "/images/lastpass.jpg"
  },
  {
    id: "cursor",
    name: "Cursor AI Pro",
    description: "AI-first code editor built on VS Code. Write, edit, and debug with GPT-4 natively.",
    priceZar: "$20.00",
    priceUsd: "$20.00",
    priceInr: "₹1,700",
    icon: "👨‍💻",
    badge: "NEW",
    category: "AI Tools",
    image: "/images/cursor.jpg"
  },
  {
    id: "midjourney",
    name: "Midjourney Standard",
    description: "AI image generation. 15 GPU hours/month, unlimited relaxed generations.",
    priceZar: "$24.00",
    priceUsd: "$24.00",
    priceInr: "₹2,040",
    icon: "🎨",
    badge: "HOT",
    category: "AI Tools",
    image: "/images/midjourney.jpg"
  },
  {
    id: "asana",
    name: "Asana Premium",
    description: "Project management with Gantt charts, workflow automation, and advanced reporting.",
    priceZar: "$10.99",
    priceUsd: "$10.99",
    priceInr: "₹935",
    icon: "✅",
    badge: "POPULAR",
    category: "Business",
    image: "/images/asana.jpg"
  },
  {
    id: "expressvpn",
    name: "ExpressVPN",
    description: "Ultra-fast VPN with 3,000+ servers, split tunneling, and 24/7 support.",
    priceZar: "$6.67",
    priceUsd: "$6.67",
    priceInr: "₹570",
    icon: "",
    badge: "HOT",
    category: "Security",
    image: "/images/expressvpn.jpg"
  },
  {
    id: "youtube-premium",
    name: "YouTube Premium",
    description: "Ad-free YouTube, background play, offline downloads, and YouTube Music included.",
    priceZar: "$13.99",
    priceUsd: "$13.99",
    priceInr: "₹1,190",
    icon: "▶️",
    badge: "POPULAR",
    category: "Entertainment",
    image: "/images/youtube-premium.jpg"
  },
  {
    id: "1password",
    name: "1Password",
    description: "Password manager with Travel Mode, Watchtower security alerts, and family sharing.",
    priceZar: "$2.99",
    priceUsd: "$2.99",
    priceInr: "₹255",
    icon: "🔐",
    badge: "POPULAR",
    category: "Security",
    image: "/images/1password.jpg"
  },
  {
    id: "monday",
    name: "Monday.com Pro",
    description: "Visual work OS with automations, integrations, and real-time collaboration dashboards.",
    priceZar: "$9.00",
    priceUsd: "$9.00",
    priceInr: "₹765",
    icon: "📊",
    badge: "NEW",
    category: "Business",
    image: "/images/monday.jpg"
  },
  {
    id: "perplexity",
    name: "Perplexity Pro",
    description: "AI-powered search engine with real-time web access, citations, and image generation.",
    priceZar: "$20.00",
    priceUsd: "$20.00",
    priceInr: "₹1,700",
    icon: "🔍",
    badge: "NEW",
    category: "AI Tools",
    image: "/images/perplexity.jpg"
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    description: "AI pair programmer. Real-time code suggestions, multi-language support.",
    priceZar: "$10.00",
    priceUsd: "$10.00",
    priceInr: "₹850",
    icon: "👨‍💻",
    badge: "HOT",
    category: "AI Tools",
    image: "/images/github-copilot.jpg"
  },
  {
    id: "slack",
    name: "Slack Pro",
    description: "Team messaging with unlimited message history, Huddles, and 10+ app integrations.",
    priceZar: "$7.25",
    priceUsd: "$7.25",
    priceInr: "₹615",
    icon: "💬",
    badge: "POPULAR",
    category: "Business",
    image: "/images/slack.jpg"
  },
  {
    id: "dashlane",
    name: "Dashlane Premium",
    description: "Password manager with VPN, dark web monitoring, and phishing alerts.",
    priceZar: "$4.99",
    priceUsd: "$4.99",
    priceInr: "₹425",
    icon: "🛡️",
    badge: "POPULAR",
    category: "Security",
    image: "/images/dashlane.jpg"
  },
  {
    id: "photoshop",
    name: "Adobe Photoshop",
    description: "Industry-standard photo editing and compositing. AI-powered tools, Neural Filters.",
    priceZar: "$22.99",
    priceUsd: "$22.99",
    priceInr: "₹1,950",
    icon: "🎨",
    badge: "POPULAR",
    category: "Creative",
    image: "/images/photoshop.jpg"
  },
  {
    id: "claude",
    name: "Claude Pro",
    description: "Anthropic's advanced AI assistant. 200K context window, priority access.",
    priceZar: "$20.00",
    priceUsd: "$20.00",
    priceInr: "₹1,700",
    icon: "💬",
    badge: "NEW",
    category: "AI Tools",
    image: "/images/claude.jpg"
  },
  {
    id: "premiere",
    name: "Adobe Premiere Pro",
    description: "Professional video editing with AI auto-reframe, speech-to-text, and Lumetri color.",
    priceZar: "$22.99",
    priceUsd: "$22.99",
    priceInr: "₹1,950",
    icon: "🎬",
    badge: "HOT",
    category: "Creative",
    image: "/images/premiere.jpg"
  },
  {
    id: "loom",
    name: "Loom Business",
    description: "Async video messaging. Screen + cam recording, AI summaries, team workspace.",
    priceZar: "$12.50",
    priceUsd: "$12.50",
    priceInr: "₹1,060",
    icon: "🎥",
    badge: "POPULAR",
    category: "Productivity",
    image: "/images/loom.jpg"
  },
  {
    id: "webflow",
    name: "Webflow CMS",
    description: "No-code website builder with CMS, hosting, and custom domain. Export clean code.",
    priceZar: "$14.00",
    priceUsd: "$14.00",
    priceInr: "₹1,190",
    icon: "🌐",
    badge: "NEW",
    category: "Business",
    image: "/images/webflow.jpg"
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs Starter",
    description: "AI voice cloning and text-to-speech. 30,000 characters/month, 10+ voice styles.",
    priceZar: "$5.00",
    priceUsd: "$5.00",
    priceInr: "₹425",
    icon: "🗣️",
    badge: "NEW",
    category: "AI Tools",
    image: "/images/elevenlabs.jpg"
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
      {/* Navigation */}
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

      {/* Main Products Section */}
      <section className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6 text-center">All Digital Products</h1>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">Premium digital assets delivered instantly via email verification.</p>
        
        {/* Category Tabs */}
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
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="relative group cursor-pointer">
              {product.badge && (
                <div className="absolute top-3 left-3 z-10">
                  {product.badge === "HOT" ? (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Flame className="w-3 h-3" /> HOT
                    </span>
                  ) : product.badge === "POPULAR" ? (
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3" /> POPULAR
                    </span>
                  ) : (
                    <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      NEW
                    </span>
                  )}
                </div>
              )}
              
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-2xl mb-4" />
              
              <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
              <p className="text-sm text-gray-400 mb-2 line-clamp-2">{product.description}</p>
              <div className="text-cyan-400 font-bold text-lg mb-4">{product.priceUsd}</div>
              
              <button className="w-full bg-cyan-500 hover:bg-cyan-400 text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 transition transform hover:scale-105">
                <ShoppingBag className="w-4 h-4" /> Buy Now — {product.priceUsd}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-24 py-12 text-center text-gray-400 text-sm">
        © 2026 Super Digital Markets. All rights reserved. | Instant Delivery • Secure Payment • 24/7 Support • Global Market
      </footer>
    </div>
  );
}
