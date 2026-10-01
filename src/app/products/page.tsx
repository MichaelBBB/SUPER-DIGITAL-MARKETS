'use client';

import { useState } from 'react';

// ✅ TYPE DEFINITION
type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  badge?: 'HOT' | 'POPULAR' | 'NEW';
  category: string;
  image: string; // Local path from public/images
};

// ✅ YOUR 30 PRODUCTS WITH YOUR REAL IMAGE FILES
const PRODUCTS: Product[] = [
  { id: 1, name: 'ChatGPT Plus', description: "OpenAI's GPT-4 powered assistant.", price: 20.00, badge: 'HOT', category: 'AI Tools', image: '/images/chatgpt.jpg' },
  { id: 2, name: 'Adobe Creative Cloud', description: 'Full suite of Adobe apps.', price: 54.99, badge: 'POPULAR', category: 'Creative', image: '/images/adobe-cc.jpg' },
  { id: 3, name: 'Asana Premium', description: 'Project management with Gantt charts.', price: 10.99, badge: 'POPULAR', category: 'Business', image: '/images/asana.jpg' },
  { id: 4, name: 'Canva Pro', description: 'Premium design templates and assets.', price: 12.99, badge: 'NEW', category: 'Creative', image: '/images/canva.jpg' },
  { id: 5, name: 'Claude Pro', description: "Anthropic's advanced AI assistant.", price: 20.00, badge: 'NEW', category: 'AI Tools', image: '/images/claude.jpg' },
  { id: 6, name: 'Cursor AI Pro', description: 'AI-first code editor built on VS Code.', price: 20.00, badge: 'NEW', category: 'AI Tools', image: '/images/cursor.jpg' },
  { id: 7, name: 'Dashlane Premium', description: 'Password manager with VPN.', price: 4.99, badge: 'POPULAR', category: 'Security', image: '/images/dashlane.jpg' },
  { id: 8, name: 'Dropbox Plus', description: '2TB cloud storage.', price: 9.99, badge: 'POPULAR', category: 'Productivity', image: '/images/dropbox.jpg' },
  { id: 9, name: 'ElevenLabs Starter', description: 'AI voice cloning and text-to-speech.', price: 5.00, badge: 'NEW', category: 'AI Tools', image: '/images/elevenlabs.jpg' },
  { id: 10, name: 'ExpressVPN', description: 'Ultra-fast VPN with 3,000+ servers.', price: 6.67, badge: 'HOT', category: 'Security', image: '/images/expressvpn.jpg' },
  { id: 11, name: 'Figma Professional', description: 'Collaborative UI/UX design tool.', price: 12.00, badge: 'HOT', category: 'Creative', image: '/images/figma.jpg' },
  { id: 12, name: 'GitHub Copilot', description: 'AI pair programmer.', price: 10.00, badge: 'HOT', category: 'AI Tools', image: '/images/github-copilot.jpg' },
  { id: 13, name: 'Grammarly Premium', description: 'AI writing assistant.', price: 12.00, badge: 'POPULAR', category: 'AI Tools', image: '/images/grammarly.jpg' },
  { id: 14, name: 'LastPass Premium', description: 'Secure password manager.', price: 3.00, badge: 'POPULAR', category: 'Security', image: '/images/lastpass.jpg' },
  { id: 15, name: 'Loom Business', description: 'Async video messaging.', price: 12.50, badge: 'POPULAR', category: 'Business', image: '/images/loom.jpg' },
  { id: 16, name: 'Microsoft 365 Business', description: 'Word, Excel, PowerPoint, Teams.', price: 12.50, badge: 'POPULAR', category: 'Business', image: '/images/microsoft365.jpg' },
  { id: 17, name: 'Midjourney Standard', description: 'AI image generation.', price: 24.00, badge: 'HOT', category: 'AI Tools', image: '/images/midjourney.jpg' },
  { id: 18, name: 'Monday.com Pro', description: 'Visual work OS.', price: 9.00, badge: 'NEW', category: 'Business', image: '/images/monday.jpg' },
  { id: 19, name: 'Disney Premium', description: 'Marvel, Star Wars, Pixar & Nat Geo.', price: 13.99, badge: 'HOT', category: 'Entertainment', image: '/images/disney-premium.jpg' },
  { id: 20, name: 'NordVPN', description: 'Military-grade encryption.', price: 3.99, badge: 'HOT', category: 'Security', image: '/images/nordvpn.jpg' },
  { id: 21, name: 'Notion Plus', description: 'All-in-one workspace.', price: 8.00, badge: 'POPULAR', category: 'Productivity', image: '/images/notion.jpg' },
  { id: 22, name: 'Perplexity Pro', description: 'AI-powered search engine.', price: 20.00, badge: 'NEW', category: 'AI Tools', image: '/images/perplexity.jpg' },
  { id: 23, name: 'Adobe Photoshop', description: 'Industry-standard photo editing.', price: 22.99, badge: 'POPULAR', category: 'Creative', image: '/images/photoshop.jpg' },
  { id: 24, name: 'Adobe Premiere Pro', description: 'Professional video editing.', price: 22.99, badge: 'HOT', category: 'Creative', image: '/images/premiere.jpg' },
  { id: 25, name: 'Slack Pro', description: 'Team messaging platform.', price: 7.25, badge: 'POPULAR', category: 'Business', image: '/images/slack.jpg' },
  { id: 26, name: 'Spotify Premium', description: 'Ad-free music streaming.', price: 9.99, badge: 'POPULAR', category: 'Entertainment', image: '/images/spotify.jpg' },
  { id: 27, name: 'Webflow CMS', description: 'No-code website builder.', price: 14.00, badge: 'NEW', category: 'Creative', image: '/images/webflow.jpg' },
  { id: 28, name: 'YouTube Premium', description: 'Ad-free YouTube.', price: 13.99, badge: 'POPULAR', category: 'Entertainment', image: '/images/youtube-premium.jpg' },
  { id: 29, name: 'Zoom Pro', description: 'HD video conferencing.', price: 14.00, badge: 'HOT', category: 'Business', image: '/images/zoom.jpg' },
  { id: 30, name: '1Password', description: 'Password manager with family sharing.', price: 2.99, badge: 'POPULAR', category: 'Security', image: '/images/1password.jpg' },
];

const CATEGORIES = ['All', 'AI Tools', 'Creative', 'Entertainment', 'Business', 'Productivity', 'Security'];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = activeCategory === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Header */}
      <header className="border-b border-gray-800 sticky top-0 z-50 bg-gray-950/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tighter text-cyan-400">SUPER DIGITAL</h1>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <a href="/products" className="text-white underline decoration-cyan-400 decoration-2">Products</a>
            <a href="/checkout" className="hover:text-white transition-colors">Checkout</a>
          </nav>
          <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-lg shadow-cyan-500/20">
            Shop Now
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          All Digital Products
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Instant delivery. Secure payments via Peach (Global) or Capitec EFT (South Africa).
        </p>
      </section>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10"
          >
            {/* Image Container - Uses LOCAL FILE PATH */}
            <div className="relative aspect-video w-full overflow-hidden bg-gray-800">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              
              {/* Badge Overlay */}
              {product.badge && (
                <span className={`absolute top-3 left-3 px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded ${
                  product.badge === 'HOT' ? 'bg-red-600 text-white' :
                  product.badge === 'NEW' ? 'bg-green-600 text-white' :
                  'bg-blue-600 text-white'
                }`}>
                  {product.badge}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col h-full">
              <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
              
              <div className="mt-auto pt-4 border-t border-gray-800 flex items-center justify-between">
                <span className="text-xl font-bold text-cyan-400">${product.price.toFixed(2)}</span>
                
                {/* THE SMART BUY BUTTON - Links to Checkout */}
                <a 
                  href={`/checkout?item=${encodeURIComponent(product.name)}&amount=${product.price}`}
                  className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-cyan-500/20"
                >
                  Buy Now
                </a>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
