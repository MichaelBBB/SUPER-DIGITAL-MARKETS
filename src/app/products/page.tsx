'use client';
import { useState } from 'react';

const products = [
  { name: 'ChatGPT Plus', price: 20.00, category: 'AI Tools', badge: 'HOT', desc: 'Advanced AI assistant with GPT-4, DALL-E, browsing, and plugins.', flags: ['🇺🇸','🇳','🇿'], img: '/images/ChatGPTPlus.jpg' },
  { name: 'Adobe Creative Cloud', price: 54.99, category: 'Creative', badge: 'POPULAR', desc: 'Full suite of creative apps: Photoshop, Illustrator, Premiere, and more.', flags: ['🇸','🇮','🇿🇦'], img: '/images/AdobeCreativeCloud.jpg' },
  { name: 'Netflix Premium', price: 22.99, category: 'Entertainment', badge: 'HOT', desc: '4K streaming on 4 screens. Unlimited movies, shows, and documentaries.', flags: ['🇺🇸','🇮🇳','🇦'], img: '/images/NetFlixPremium.jpg' },
  { name: 'Microsoft 365 Business', price: 12.50, category: 'Business', badge: 'POPULAR', desc: 'Word, Excel, PowerPoint, Teams, and 1TB OneDrive. For business and personal use.', flags: ['🇺🇸','🇮','🇿🇦'], img: '/images/Microsoft-365-Business.jpg' },
  { name: 'Spotify Premium', price: 9.99, category: 'Entertainment', badge: 'POPULAR', desc: 'Ad-free music, offline listening, unlimited skips. 100M+ songs and podcasts.', flags: ['🇸','🇮🇳','🇿🇦'], img: '/images/SpotifyPremium.jpg' },
  { name: 'NordVPN', price: 3.99, category: 'Security', badge: 'POPULAR', desc: 'Military-grade encryption, 5,500+ servers in 60 countries. No-logs policy.', flags: ['🇺🇸','🇮🇳','🇿'], img: '/images/NordVPN.jpg' },
  { name: 'Canva Pro', price: 12.99, category: 'Creative', badge: 'NEW', desc: 'Premium design templates, Brand Kit, background remover, and 100M+ stock assets.', flags: ['🇺🇸','🇮🇳','🇦'], img: '/images/CanvaPro.jpg' },
  { name: 'Grammarly Premium', price: 12.00, category: 'Productivity', badge: 'POPULAR', desc: 'AI writing assistant with advanced grammar, clarity, and plagiarism detection.', flags: ['🇺🇸','🇮','🇿🇦'], img: '/images/GrammarlyPremium.jpg' },
  { name: 'Zoom Pro', price: 14.99, category: 'Business', badge: 'HOT', desc: 'Unlimited meetings up to 30 hours, 100 participants, cloud recording, admin controls.', flags: ['🇺🇸','🇮🇳','🇦'], img: '/images/ZoomPro.jpg' },
  { name: 'Notion Plus', price: 8.00, category: 'Productivity', badge: 'POPULAR', desc: 'All-in-one workspace for notes, wikis, databases, and project management.', flags: ['🇸','🇮','🇿🇦'], img: '/images/NotionPlus.jpg' },
  { name: 'Figma Professional', price: 12.00, category: 'Creative', badge: 'HOT', desc: 'Collaborative UI/UX design tool. Real-time multiplayer, unlimited projects, dev mode.', flags: ['🇺🇸','🇳','🇿'], img: '/images/FigmaProfessional.jpg' },
  { name: 'Dropbox Plus', price: 9.99, category: 'Productivity', badge: 'POPULAR', desc: '2TB cloud storage, Smart Sync, version history, and secure file sharing.', flags: ['🇺','🇮🇳','🇿🇦'], img: '/images/DropBoxPlus.jpg' },
  { name: 'LastPass Premium', price: 3.00, category: 'Security', badge: 'POPULAR', desc: 'Secure password manager with dark web monitoring, 1GB encrypted storage.', flags: ['🇺🇸','🇮🇳','🇦'], img: '/images/LastPassPremium.jpg' },
  { name: 'Cursor AI Pro', price: 20.00, category: 'AI Tools', badge: 'NEW', desc: 'AI-first code editor built on VS Code. Write, edit, and debug with GPT-4 natively.', flags: ['🇺🇸','🇳','🇿🇦'], img: '/images/Cursor AI Pro.jpg' },
  { name: 'Midjourney Standard', price: 24.00, category: 'AI Tools', badge: 'HOT', desc: 'AI image generation. 15 GPU hours/month, unlimited relaxed generations.', flags: ['🇺🇸','🇳','🇿🇦'], img: '/images/MidjourneyStandard.jpg' },
  { name: 'GitHub Copilot', price: 10.00, category: 'AI Tools', badge: 'HOT', desc: 'AI pair programmer. Real-time code suggestions, multi-language support.', flags: ['🇺🇸','🇮🇳','🇦'], img: '/images/GitHub-CoPilot.jpg' },
  { name: 'Slack Pro', price: 7.25, category: 'Business', badge: 'POPULAR', desc: 'Team messaging with unlimited message history, Huddles, and 10+ app integrations.', flags: ['🇺🇸','🇳','🇿🇦'], img: '/images/SlackPro.jpg' },
  { name: 'Dashlane Premium', price: 4.99, category: 'Security', badge: 'POPULAR', desc: 'Password manager with VPN, dark web monitoring, and phishing alerts.', flags: ['🇺🇸','🇮🇳','🇿🇦'], img: '/images/DashLanePremium.jpg' },
  { name: 'Adobe Photoshop', price: 22.99, category: 'Creative', badge: 'POPULAR', desc: 'Industry-standard photo editing and compositing. AI-powered tools, Neural Filters.', flags: ['🇺🇸','🇮🇳','🇦'], img: '/images/AdobePhotoshop.jpg' },
  { name: 'Claude Pro', price: 20.00, category: 'AI Tools', badge: 'NEW', desc: "Anthropic's advanced AI assistant. 200K context window, priority access.", flags: ['🇸','🇮','🇿🇦'], img: '/images/ClaudePro.jpg' },
  { name: 'Adobe Premiere Pro', price: 22.99, category: 'Creative', badge: 'HOT', desc: 'Professional video editing with AI auto-reframe, speech-to-text, and Lumetri color.', flags: ['🇺🇸','🇮🇳','🇿🇦'], img: '/images/AdobePremierePro.jpg' },
  { name: 'Asana Premium', price: 10.99, category: 'Business', badge: 'POPULAR', desc: 'Project management with Gantt charts, workflow automation, and advanced reporting.', flags: ['🇺🇸','🇳','🇿🇦'], img: '/images/Asana Premium.jpg' },
  { name: 'ExpressVPN', price: 6.67, category: 'Security', badge: 'HOT', desc: 'Ultra-fast VPN with 3,000+ servers, split tunneling, and 24/7 support.', flags: ['🇺🇸','🇳','🇿🇦'], img: '/images/ExpressVPN.jpg' },
  { name: 'YouTube Premium', price: 13.99, category: 'Entertainment', badge: 'POPULAR', desc: 'Ad-free YouTube, background play, offline downloads, and YouTube Music included.', flags: ['🇺🇸','🇮🇳','🇿🇦'], img: '/images/YouTubePremium.jpg' },
  { name: '1Password', price: 2.99, category: 'Security', badge: 'POPULAR', desc: 'Password manager with Travel Mode, Watchtower security alerts, and family sharing.', flags: ['🇺🇸','🇮','🇿🇦'], img: '/images/1Password.jpg' },
  { name: 'Monday.com Pro', price: 9.00, category: 'Business', badge: 'NEW', desc: 'Visual work OS with automations, integrations, and real-time collaboration dashboards.', flags: ['🇺🇸','🇮🇳','🇿🇦'], img: '/images/Monday.comPro.jpg' },
  { name: 'Perplexity Pro', price: 20.00, category: 'AI Tools', badge: 'NEW', desc: 'AI-powered search engine with real-time web access, citations, and image generation.', flags: ['🇺🇸','🇮🇳','🇦'], img: '/images/PerplexityPro.jpg' },
  { name: 'Loom Business', price: 12.50, category: 'Productivity', badge: 'POPULAR', desc: 'Async video messaging. Screen + cam recording, AI summaries, team workspace.', flags: ['🇺🇸','🇮','🇿🇦'], img: '/images/Loom Business.jpg' },
  { name: 'Webflow CMS', price: 14.00, category: 'Business', badge: 'NEW', desc: 'No-code website builder with CMS, hosting, and custom domain. Export clean code.', flags: ['🇺🇸','🇳','🇿'], img: '/images/Webflow CMS.jpg' },
  { name: 'ElevenLabs Starter', price: 5.00, category: 'AI Tools', badge: 'NEW', desc: 'AI voice cloning and text-to-speech. 30,000 characters/month, 10+ voice styles.', flags: ['🇺🇸','🇮','🇿🇦'], img: '/images/ElevenLabs Starter.jpg' },
];

const categories = ['All', 'AI Tools', 'Creative', 'Entertainment', 'Business', 'Productivity', 'Security'];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const getBadgeStyle = (badge: string) => {
    if (badge === 'HOT') return 'bg-orange-500 text-white';
    if (badge === 'POPULAR') return 'bg-yellow-400 text-black';
    if (badge === 'NEW') return 'bg-cyan-500 text-white';
    return 'bg-slate-700 text-white';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="text-cyan-400 text-sm font-bold tracking-widest uppercase mb-2">Featured Selection</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Top Digital <span className="text-yellow-400">Products</span>
            </h1>
            <p className="text-slate-400 mt-3 max-w-lg">
              Handpicked bestsellers across every category. Instant delivery worldwide.
            </p>
          </div>
          <button className="px-6 py-3 border border-slate-700 rounded-full text-sm font-semibold text-slate-300 hover:bg-slate-900 transition-all flex items-center gap-2">
            View All 30 <span className="text-cyan-400">→</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col group">
              
              {/* Image Area */}
              <div className="relative h-48 overflow-hidden bg-slate-800">
                <img 
                  src={product.img} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Badge (Top Left) */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${getBadgeStyle(product.badge)}`}>
                  {product.badge}
                </div>

                {/* Category Tag (Top Right) */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-slate-900/80 backdrop-blur text-slate-300 border border-slate-700/50">
                  {product.category}
                </div>

                {/* Price (Floating Right) */}
                <div className="absolute bottom-4 right-4">
                  <span className="text-xl font-bold text-cyan-400 drop-shadow-lg">${product.price.toFixed(2)}</span>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-5 flex-grow flex flex-col">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{product.category}</p>
                <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                <p className="text-slate-400 text-sm mb-4 flex-grow leading-relaxed">{product.desc}</p>
                
                {/* Flags */}
                <div className="flex items-center gap-2 mb-5 text-xs text-slate-500">
                  <span className="text-sm">{product.flags.join(' ')}</span>
                  <span>Available in these markets</span>
                </div>

                {/* Buy Button */}
                <a 
                  href={`/payment?item=${encodeURIComponent(product.name)}&amount=${product.price}`}
                  className="block w-full text-center py-3 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 rounded-full font-bold text-slate-950 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20"
                >
                  🛒 Buy Now — ${product.price.toFixed(2)}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Link */}
        <div className="text-center mt-16">
          <a href="/" className="text-slate-500 hover:text-cyan-400 text-sm transition-colors">← Back to Home</a>
        </div>
      </div>
    </div>
  );
}
