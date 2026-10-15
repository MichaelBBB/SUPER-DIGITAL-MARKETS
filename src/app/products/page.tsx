'use client';
import { useState } from 'react';

const products = [
  { name: 'ChatGPT Plus', price: 20.00, category: 'AI Tools', badge: 'HOT', desc: 'Advanced AI assistant with GPT-4, DALL-E, browsing, and plugins.', flags: ['🇺🇸','🇮🇳','🇨🇳'] },
  { name: 'Adobe Creative Cloud', price: 54.99, category: 'Creative', badge: 'POPULAR', desc: 'Full suite of creative apps: Photoshop, Illustrator, Premiere, and more.', flags: ['🇺🇸','🇿🇦','🇨🇳'] },
  { name: 'Netflix Premium', price: 22.99, category: 'Entertainment', badge: 'HOT', desc: '4K streaming on 4 screens. Unlimited movies, shows, and documentaries.', flags: ['🇿🇦','🇮🇳','🇿🇦'] },
  { name: 'Microsoft 365 Business', price: 12.50, category: 'Business', badge: 'POPULAR', desc: 'Word, Excel, PowerPoint, Teams, and 1TB OneDrive. For business and personal use.', flags: ['🇿🇦','🇮🇳','🇿🇦'] },
  { name: 'Spotify Premium', price: 9.99, category: 'Entertainment', badge: 'POPULAR', desc: 'Ad-free music, offline listening, unlimited skips. 100M+ songs and podcasts.', flags: ['🇺🇸','🇮🇳','🇨🇳'] },
  { name: 'NordVPN', price: 3.99, category: 'Security', badge: 'HOT', desc: 'Military-grade encryption, 5,500+ servers in 60 countries. No-logs policy.', flags: ['🇿🇦','🇮🇳','🇿🇦'] },
  { name: 'Canva Pro', price: 12.99, category: 'Creative', badge: 'NEW', desc: 'Premium design templates, Brand Kit, background remover, and 100M+ stock assets.', flags: ['🇺🇸','🇿🇦','🇨🇳'] },
  { name: 'Grammarly Premium', price: 12.00, category: 'Productivity', badge: 'POPULAR', desc: 'AI writing assistant with advanced grammar, clarity, and plagiarism detection.', flags: ['🇺🇸','🇿🇦','🇨🇳'] },
  { name: 'Zoom Pro', price: 14.99, category: 'Business', badge: 'HOT', desc: 'Unlimited meetings up to 30 hours, 100 participants, cloud recording, admin controls.', flags: ['🇺🇸','🇮🇳','🇿🇦'] },
  { name: 'Notion Plus', price: 8.00, category: 'Productivity', badge: 'POPULAR', desc: 'All-in-one workspace for notes, wikis, databases, and project management.', flags: ['🇺🇸','🇮🇳','🇨🇳'] },
  { name: 'Figma Professional', price: 12.00, category: 'Creative', badge: 'HOT', desc: 'Collaborative UI/UX design tool. Real-time multiplayer, unlimited projects, dev mode.', flags: ['🇺🇸','🇿🇦','🇨🇳'] },
  { name: 'Dropbox Plus', price: 9.99, category: 'Productivity', badge: 'POPULAR', desc: '2TB cloud storage, Smart Sync, version history, and secure file sharing.', flags: ['🇿🇦','🇮🇳','🇨🇳'] },
  { name: 'LastPass Premium', price: 3.00, category: 'Security', badge: 'POPULAR', desc: 'Secure password manager with dark web monitoring, 1GB encrypted storage.', flags: ['🇺🇸','🇮🇳','🇨🇳'] },
  { name: 'Cursor AI Pro', price: 20.00, category: 'AI Tools', badge: 'NEW', desc: 'AI-first code editor built on VS Code. Write, edit, and debug with GPT-4 natively.', flags: ['🇺🇸','🇿🇦','🇨🇳'] },
  { name: 'Midjourney Standard', price: 24.00, category: 'AI Tools', badge: 'HOT', desc: 'AI image generation. 15 GPU hours/month, unlimited relaxed generations.', flags: ['🇺🇸','🇮🇳','🇨🇳'] },
  { name: 'GitHub Copilot', price: 10.00, category: 'AI Tools', badge: 'HOT', desc: 'AI pair programmer. Real-time code suggestions, multi-language support.', flags: ['🇺🇸','🇿🇦','🇨🇳'] },
  { name: 'Slack Pro', price: 7.25, category: 'Business', badge: 'POPULAR', desc: 'Team messaging with unlimited message history, Huddles, and 10+ app integrations.', flags: ['🇿🇦','🇮🇳','🇨🇳'] },
  { name: 'Dashlane Premium', price: 4.99, category: 'Security', badge: 'POPULAR', desc: 'Password manager with VPN, dark web monitoring, and phishing alerts.', flags: ['🇿🇦','🇮🇳','🇿🇦'] },
  { name: 'Adobe Photoshop', price: 22.99, category: 'Creative', badge: 'POPULAR', desc: 'Industry-standard photo editing and compositing. AI-powered tools, Neural Filters.', flags: ['🇺🇸','🇮🇳','🇿🇦'] },
  { name: 'Claude Pro', price: 20.00, category: 'AI Tools', badge: 'NEW', desc: "Anthropic's advanced AI assistant. 200K context window, priority access.", flags: ['🇺🇸','🇮🇳','🇨🇳'] },
  { name: 'Adobe Premiere Pro', price: 22.99, category: 'Creative', badge: 'HOT', desc: 'Professional video editing with AI auto-reframe, speech-to-text, and Lumetri color.', flags: ['🇺🇸','🇿🇦','🇨🇳'] },
  { name: 'Asana Premium', price: 10.99, category: 'Business', badge: 'POPULAR', desc: 'Project management with Gantt charts, workflow automation, and advanced reporting.', flags: ['🇺🇸','🇿🇦','🇨🇳'] },
  { name: 'ExpressVPN', price: 6.67, category: 'Security', badge: 'HOT', desc: 'Ultra-fast VPN with 3,000+ servers, split tunneling, and 24/7 support.', flags: ['🇺🇸','🇮🇳','🇨🇳'] },
  { name: 'YouTube Premium', price: 13.99, category: 'Entertainment', badge: 'POPULAR', desc: 'Ad-free YouTube, background play, offline downloads, and YouTube Music included.', flags: ['🇺🇸','🇮🇳','🇨🇳'] },
  { name: '1Password', price: 2.99, category: 'Security', badge: 'POPULAR', desc: 'Password manager with Travel Mode, Watchtower security alerts, and family sharing.', flags: ['🇺🇸','🇮🇳','🇨🇳'] },
  { name: 'Monday.com Pro', price: 9.00, category: 'Business', badge: 'NEW', desc: 'Visual work OS with automations, integrations, and real-time collaboration dashboards.', flags: ['🇺🇸','🇿🇦','🇨🇳'] },
  { name: 'Perplexity Pro', price: 20.00, category: 'AI Tools', badge: 'NEW', desc: 'AI-powered search engine with real-time web access, citations, and image generation.', flags: ['🇺🇸','🇮🇳','🇨🇳'] },
  { name: 'Loom Business', price: 12.50, category: 'Productivity', badge: 'POPULAR', desc: 'Async video messaging. Screen + cam recording, AI summaries, team workspace.', flags: ['🇿🇦','🇮🇳','🇨🇳'] },
  { name: 'Webflow CMS', price: 14.00, category: 'Business', badge: 'NEW', desc: 'No-code website builder with CMS, hosting, and custom domain. Export clean code.', flags: ['🇺🇸','🇮🇳','🇨🇳'] },
  { name: 'ElevenLabs Starter', price: 5.00, category: 'AI Tools', badge: 'NEW', desc: 'AI voice cloning and text-to-speech. 30,000 characters/month, 10+ voice styles.', flags: ['🇺🇸','🇮🇳','🇨🇳'] },
];

const categoryImages: Record<string, string> = {
  'AI Tools': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&auto=format&fit=crop&q=60',
  'Creative': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&auto=format&fit=crop&q=60',
  'Entertainment': 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=500&auto=format&fit=crop&q=60',
  'Business': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&auto=format&fit=crop&q=60',
  'Productivity': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500&auto=format&fit=crop&q=60',
  'Security': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=60',
};

const categories = ['All', 'AI Tools', 'Creative', 'Entertainment', 'Business', 'Productivity', 'Security'];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const badgeColor = (badge: string) => {
    if (badge === 'HOT') return 'bg-orange-500 text-white';
    if (badge === 'POPULAR') return 'bg-yellow-400 text-black';
    if (badge === 'NEW') return 'bg-cyan-500 text-white';
    return 'bg-gray-700 text-white';
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <p className="text-cyan-400 text-sm font-bold tracking-wider mb-2">FEATURED SELECTION</p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold">
              Top Digital <span className="text-yellow-400">Products</span>
            </h1>
            <p className="text-gray-400 mt-3 max-w-md">
              Handpicked bestsellers across every category. Instant delivery worldwide.
            </p>
          </div>
          <a href="/live-trackers" className="px-6 py-3 border border-cyan-600 text-cyan-400 rounded-full font-bold hover:bg-cyan-600 hover:text-white transition-all inline-flex items-center gap-2">
            View All 30 →
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="flex flex-wrap gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full font-medium text-sm transition-all ${
                activeCategory === cat
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-900 border border-gray-800 text-gray-300 hover:border-cyan-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product, idx) => (
            <div key={idx} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-cyan-600 transition-all flex flex-col">
              <div className="relative h-56 overflow-hidden bg-gray-800">
                <img 
                  src={categoryImages[product.category]} 
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${badgeColor(product.badge)}`}>
                  {product.badge}
                </div>
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-gray-900/80 backdrop-blur text-gray-300">
                  {product.category}
                </div>
                <div className="absolute top-4 right-4 mt-8">
                  <span className="text-2xl font-bold text-cyan-400 drop-shadow-lg">${product.price.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{product.category}</p>
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-400 text-sm mb-4 flex-grow">{product.desc}</p>
                
                <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                  <span>{product.flags.join(' ')}</span>
                  <span>Available in these markets</span>
                </div>

                <a 
                  href={`/payment?item=${encodeURIComponent(product.name)}&amount=${product.price}`}
                  className="block w-full text-center py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 rounded-full font-bold transition-all flex items-center justify-center gap-2"
                >
                  🛒 Buy Now — ${product.price.toFixed(2)}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pb-12">
        <a href="/" className="text-gray-500 hover:text-white text-sm">← Back to Home</a>
      </div>
    </div>
  );
}
