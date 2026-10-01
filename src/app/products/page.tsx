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

// ✅ YOUR 30 PRODUCTS WITH REAL IMAGES & UPDATED BANK LOGIC READY
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
  { id: 19, name: 'Disney Premium', description: 'Marvel, Star Wars, Pixar & Nat Geo.', price: 13.99, badge: 'HOT', category: 'Entertainment', image: '/images/netflix.jpg' }, 
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

  // ✅ INSTANT WHATSAPP LINK GENERATOR (Updated Branch Code CABLZAJJ)
  const getWhatsAppLink = (product: Product) => {
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    
    // Constructing the message with CORRECTED Branch Code: CABLZAJJ
    const message = encodeURIComponent(
      `✅ *ORDER CONFIRMED - SUPER DIGITAL MARKETS*\n\n` +
      `*Ref:* ${orderId}\n` +
      `*Product:* ${product.name}\n` +
      `*Total:* $${product.price.toFixed(2)} USD\n\n` +
      `🌍 *INTERNATIONAL CARD PAYMENT*\nPay securely by Visa/Mastercard:\nhttps://super-digital-markets-co9n.vercel.app/payment?amount=${product.price}&item=${encodeURIComponent(product.name)}\n\n` +
      `🇿🇦 *SOUTH AFRICA (INSTANT EFT)*\nBank: Capitec\nAcc: 1975933441\nBranch: 470010 (Local)\nSWIFT/BIC: CABLZAJJ\nRef: ${orderId}\nUse "Immediate Payment" for instant delivery.\n\n⚡ Reply PAID for automatic delivery.`
    );
    
    // Your WhatsApp Number
    return `https://wa.me/27743868889?text=${message}`;
  };

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
            className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 flex flex-col h-full"
          >
            {/* Image Container */}
            <div className="relative w-full h-48 shrink-0 overflow-hidden bg-gray-800">
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

            {/* Content Area */}
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
              
              {/* FOOTER: Price + Buttons */}
              <div className="mt-auto pt-4 border-t border-gray-800 flex flex-col gap-3 w-full">
                
                {/* Price Row */}
                <div className="flex items-center justify-between">
                   <span className="text-xl font-bold text-cyan-400">${product.price.toFixed(2)}</span>
                   
                   {/* Direct Checkout Button (Clean Flow) */}
                   <a 
                     href={`/checkout?item=${encodeURIComponent(product.name)}&amount=${product.price}`}
                     className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-lg shadow-cyan-500/20 whitespace-nowrap"
                   >
                     Buy Now
                   </a>
                </div>

                {/* WhatsApp Quick Order Button (Instant Link) */}
                <a 
                  href={getWhatsAppLink(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all shadow-lg shadow-green-500/20"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.226 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp Order
                </a>

              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
