"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Star, Flame } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  priceUsd: string;
  category: string;
  image: string;
  badge?: string;
}

const allProducts: Product[] = [
  { id: "chatgpt", name: "ChatGPT Plus", description: "OpenAI's GPT-4 powered assistant.", priceUsd: "$20.00", category: "AI Tools", image: "/images/chatgpt.jpg", badge: "HOT" },
  { id: "adobe-cc", name: "Adobe Creative Cloud", description: "Full suite of Adobe apps.", priceUsd: "$54.99", category: "Creative", image: "/images/adobe-cc.jpg", badge: "POPULAR" },
  { id: "asana", name: "Asana Premium", description: "Project management with Gantt charts.", priceUsd: "$10.99", category: "Business", image: "/images/asana.jpg", badge: "POPULAR" },
  { id: "canva", name: "Canva Pro", description: "Premium design templates and assets.", priceUsd: "$12.99", category: "Creative", image: "/images/canva.jpg", badge: "NEW" },
  { id: "claude", name: "Claude Pro", description: "Anthropic's advanced AI assistant.", priceUsd: "$20.00", category: "AI Tools", image: "/images/claude.jpg", badge: "NEW" },
  { id: "cursor", name: "Cursor AI Pro", description: "AI-first code editor built on VS Code.", priceUsd: "$20.00", category: "AI Tools", image: "/images/cursor.jpg", badge: "NEW" },
  { id: "dashlane", name: "Dashlane Premium", description: "Password manager with VPN.", priceUsd: "$4.99", category: "Security", image: "/images/dashlane.jpg", badge: "POPULAR" },
  { id: "dropbox", name: "Dropbox Plus", description: "2TB cloud storage.", priceUsd: "$9.99", category: "Productivity", image: "/images/dropbox.jpg", badge: "POPULAR" },
  { id: "elevenlabs", name: "ElevenLabs Starter", description: "AI voice cloning and text-to-speech.", priceUsd: "$5.00", category: "AI Tools", image: "/images/elevenlabs.jpg", badge: "NEW" },
  { id: "expressvpn", name: "ExpressVPN", description: "Ultra-fast VPN with 3,000+ servers.", priceUsd: "$6.67", category: "Security", image: "/images/expressvpn.jpg", badge: "HOT" },
  { id: "figma", name: "Figma Professional", description: "Collaborative UI/UX design tool.", priceUsd: "$12.00", category: "Creative", image: "/images/figma.jpg", badge: "HOT" },
  { id: "github-copilot", name: "GitHub Copilot", description: "AI pair programmer.", priceUsd: "$10.00", category: "AI Tools", image: "/images/github-copilot.jpg", badge: "HOT" },
  { id: "grammarly", name: "Grammarly Premium", description: "AI writing assistant.", priceUsd: "$12.00", category: "Productivity", image: "/images/grammarly.jpg", badge: "POPULAR" },
  { id: "lastpass", name: "LastPass Premium", description: "Secure password manager.", priceUsd: "$3.00", category: "Security", image: "/images/lastpass.jpg", badge: "POPULAR" },
  { id: "loom", name: "Loom Business", description: "Async video messaging.", priceUsd: "$12.50", category: "Productivity", image: "/images/loom.jpg", badge: "POPULAR" },
  { id: "microsoft365", name: "Microsoft 365 Business", description: "Word, Excel, PowerPoint, Teams.", priceUsd: "$12.50", category: "Business", image: "/images/microsoft365.jpg", badge: "POPULAR" },
  { id: "midjourney", name: "Midjourney Standard", description: "AI image generation.", priceUsd: "$24.00", category: "AI Tools", image: "/images/midjourney.jpg", badge: "HOT" },
  { id: "monday", name: "Monday.com Pro", description: "Visual work OS.", priceUsd: "$9.00", category: "Business", image: "/images/monday.jpg", badge: "NEW" },
  
  // ✅ REPLACED NETFLIX WITH DISNEY+ (Uses reliable external image)
  { 
    id: "disney-plus", 
    name: "Disney+ Premium", 
    description: "Marvel, Star Wars, Pixar & National Geographic. 4K streaming, 4 screens.", 
    priceUsd: "$13.99", 
    category: "Entertainment", 
    image: "https://images.unsplash.com/photo-1626245595304-8f5e9a11287d?q=80&w=800&auto=format&fit=crop", 
    badge: "HOT" 
  },
  
  { id: "nordvpn", name: "NordVPN", description: "Military-grade encryption.", priceUsd: "$3.99", category: "Security", image: "/images/nordvpn.jpg", badge: "HOT" },
  { id: "notion", name: "Notion Plus", description: "All-in-one workspace.", priceUsd: "$8.00", category: "Productivity", image: "/images/notion.jpg", badge: "POPULAR" },
  { id: "perplexity", name: "Perplexity Pro", description: "AI-powered search engine.", priceUsd: "$20.00", category: "AI Tools", image: "/images/perplexity.jpg", badge: "NEW" },
  { id: "photoshop", name: "Adobe Photoshop", description: "Industry-standard photo editing.", priceUsd: "$22.99", category: "Creative", image: "/images/photoshop.jpg", badge: "POPULAR" },
  { id: "premiere", name: "Adobe Premiere Pro", description: "Professional video editing.", priceUsd: "$22.99", category: "Creative", image: "/images/premiere.jpg", badge: "HOT" },
  { id: "slack", name: "Slack Pro", description: "Team messaging platform.", priceUsd: "$7.25", category: "Business", image: "/images/slack.jpg", badge: "POPULAR" },
  { id: "spotify", name: "Spotify Premium", description: "Ad-free music streaming.", priceUsd: "$9.99", category: "Entertainment", image: "/images/spotify.jpg", badge: "POPULAR" },
  { id: "webflow", name: "Webflow CMS", description: "No-code website builder.", priceUsd: "$14.00", category: "Business", image: "/images/webflow.jpg", badge: "NEW" },
  { id: "youtube-premium", name: "YouTube Premium", description: "Ad-free YouTube.", priceUsd: "$13.99", category: "Entertainment", image: "/images/youtube-premium.jpg", badge: "POPULAR" },
  { id: "zoom", name: "Zoom Pro", description: "HD video conferencing.", priceUsd: "$14.99", category: "Business", image: "/images/zoom.jpg", badge: "HOT" },
  { id: "1password", name: "1Password", description: "Password manager with family sharing.", priceUsd: "$2.99", category: "Security", image: "/images/1password.jpg", badge: "POPULAR" }
];

const categories = ["All", "AI Tools", "Creative", "Entertainment", "Business", "Productivity", "Security"];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const filteredProducts = selectedCategory === "All" 
    ? allProducts 
    : allProducts.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white">
      {/* NAV */}
      <nav className="border-b border-gray-800 sticky top-0 bg-[#0a0e17]/95 backdrop-blur-md z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-cyan-400">SUPER DIGITAL</Link>
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="hover:text-cyan-400">Home</Link>
            <Link href="/products" className="text-cyan-400 font-bold">Products</Link>
            <Link href="/payment" className="hover:text-cyan-400">Checkout</Link>
          </div>
          <Link href="/products" className="bg-cyan-500 text-white px-6 py-2 rounded-full font-bold">Shop Now</Link>
        </div>
      </nav>

      {/* CONTENT */}
      <section className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">All Digital Products</h1>
        
        {/* FILTERS */}
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} 
              className={`px-6 py-2 rounded-full font-medium transition ${selectedCategory === cat ? "bg-cyan-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="relative group bg-[#16191f] border border-gray-800 rounded-2xl overflow-hidden hover:border-cyan-500 transition">
              {product.badge && (
                <div className="absolute top-3 left-3 z-10">
                  <span className={`px-2 py-1 rounded text-xs font-bold text-white ${product.badge === 'HOT' ? 'bg-red-500' : product.badge === 'POPULAR' ? 'bg-yellow-500' : 'bg-blue-500'}`}>
                    {product.badge}
                  </span>
                </div>
              )}
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1">{product.name}</h3>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{product.description}</p>
                <div className="text-cyan-400 font-bold text-xl mb-4">{product.priceUsd}</div>
                {/* BUY NOW BUTTON LINKS TO PAYMENT */}
                <Link href="/payment" className="w-full bg-cyan-500 hover:bg-cyan-400 text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 transition">
                  <ShoppingBag className="w-4 h-4" /> Buy Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
