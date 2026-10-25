'use client';
import { useState } from 'react';

const products = [
  { name: 'ChatGPT Plus', price: 20.00, category: 'AI Tools', badge: 'HOT', desc: 'OpenAI\'s GPT-4 powered assistant. Advanced reasoning, image generation, and browsing included.', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&q=80' },
  { name: 'Adobe Creative Cloud', price: 54.99, category: 'Creative', badge: 'POPULAR', desc: 'Full suite of Adobe apps – Photoshop, Illustrator, Premiere Pro, and 20+ more.', image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=500&q=80' },
  { name: 'Netflix Premium', price: 22.99, category: 'Entertainment', badge: 'HOT', desc: '4K streaming, 4 simultaneous screens, offline downloads. 10,000+ titles worldwide.', image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80' },
  { name: 'Microsoft 365 Business', price: 12.50, category: 'Business', badge: 'POPULAR', desc: 'Word, Excel, PowerPoint, Teams, and 1TB OneDrive. For business and personal use.', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=80' },
  { name: 'Spotify Premium', price: 9.99, category: 'Entertainment', badge: 'POPULAR', desc: 'Ad-free music, offline listening, unlimited skips. 100M+ songs and podcasts.', image: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=500&q=80' },
  { name: 'NordVPN', price: 3.99, category: 'Security', badge: 'HOT', desc: 'Military-grade encryption, 5,500+ servers in 60 countries. No-logs policy.', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&q=80' },
  { name: 'Canva Pro', price: 12.99, category: 'Creative', badge: 'NEW', desc: 'Premium design templates, Brand Kit, background remover, and 100M+ stock assets.', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&q=80' },
  { name: 'Grammarly Premium', price: 12.00, category: 'Productivity', badge: 'POPULAR', desc: 'AI writing assistant with advanced grammar, clarity, and plagiarism detection.', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&q=80' },
  { name: 'Zoom Pro', price: 14.99, category: 'Business', badge: 'HOT', desc: 'Unlimited meetings up to 30 hours, 100 participants, cloud recording, admin controls.', image: 'https://images.unsplash.com/photo-1587614203976-365c74645e83?w=500&q=80' },
  { name: 'Notion Plus', price: 8.00, category: 'Productivity', badge: 'POPULAR', desc: 'All-in-one workspace for notes, wikis, databases, and project management.', image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500&q=80' },
  { name: 'Figma Professional', price: 12.00, category: 'Creative', badge: 'HOT', desc: 'Collaborative UI/UX design tool. Real-time multiplayer, unlimited projects, dev mode.', image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=500&q=80' },
  { name: 'Dropbox Plus', price: 9.99, category: 'Productivity', badge: 'POPULAR', desc: '2TB cloud storage, Smart Sync, version history, and secure file sharing.', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&q=80' },
  { name: 'LastPass Premium', price: 3.00, category: 'Security', badge: 'NEW', desc: 'Password manager with dark web monitoring and 1GB encrypted storage.', image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=500&q=80' },
  { name: 'Cursor AI Pro', price: 20.00, category: 'AI Tools', badge: 'HOT', desc: 'AI-powered code editor. Context-aware suggestions and pair programming.', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80' },
  { name: 'Midjourney Standard', price: 24.00, category: 'AI Tools', badge: 'POPULAR', desc: 'AI art generation with 15 fast GPU hours/month. Commercial usage rights.', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=80' },
  { name: 'GitHub Copilot', price: 10.00, category: 'AI Tools', badge: 'HOT', desc: 'AI pair programmer for VS Code. Real-time code suggestions and completions.', image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=500&q=80' },
  { name: 'Slack Pro', price: 7.25, category: 'Business', badge: 'POPULAR', desc: 'Unlimited message history, integrations, group video calls, and workflows.', image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=500&q=80' },
  { name: 'Dashlane Premium', price: 4.99, category: 'Security', badge: 'NEW', desc: 'Password manager with built-in VPN and dark web alerts.', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&q=80' },
  { name: 'Adobe Photoshop', price: 22.99, category: 'Creative', badge: 'HOT', desc: 'Industry-standard photo editing with Neural Filters and Generative Fill.', image: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=500&q=80' },
  { name: 'Claude Pro', price: 20.00, category: 'AI Tools', badge: 'POPULAR', desc: 'Advanced AI with 200K context window. 5x more usage than standard.', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&q=80' },
  { name: 'Adobe Premiere Pro', price: 22.99, category: 'Creative', badge: 'HOT', desc: 'Professional video editing with AI-powered text-based editing.', image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500&q=80' },
  { name: 'Asana Premium', price: 10.99, category: 'Business', badge: 'POPULAR', desc: 'Advanced project management with Gantt charts, automations, and portfolios.', image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=500&q=80' },
  { name: 'ExpressVPN', price: 6.67, category: 'Security', badge: 'HOT', desc: 'Ultra-fast VPN with 3,000+ servers. Secure Wi-Fi, bypass geo-blocks, stream 4K globally.', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&q=80' },
  { name: 'YouTube Premium', price: 13.99, category: 'Entertainment', badge: 'POPULAR', desc: 'Ad-free videos, background play, and YouTube Music included.', image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=500&q=80' },
  { name: '1Password', price: 2.99, category: 'Security', badge: 'NEW', desc: 'Secure password manager with Travel Mode and Watchtower alerts.', image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=500&q=80' },
  { name: 'Monday.com Pro', price: 9.00, category: 'Business', badge: 'POPULAR', desc: 'Visual work OS with time tracking, automations, and dashboards.', image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=500&q=80' },
  { name: 'Perplexity Pro', price: 20.00, category: 'AI Tools', badge: 'HOT', desc: 'AI search engine with Pro Search for deep, cited research. Unlimited queries.', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&q=80' },
  { name: 'Loom Business', price: 12.50, category: 'Business', badge: 'NEW', desc: 'Video messaging with AI summaries and unlimited recording for teams.', image: 'https://images.unsplash.com/photo-1587614203976-365c74645e83?w=500&q=80' },
  { name: 'Webflow CMS', price: 14.00, category: 'Creative', badge: 'POPULAR', desc: 'Advanced CMS items, site search, and premium hosting features.', image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=500&q=80' },
  { name: 'ElevenLabs Starter', price: 5.00, category: 'AI Tools', badge: 'NEW', desc: 'AI voice cloning and text-to-speech. Generate realistic voices in seconds. 30k chars/month.', image: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=500&q=80' },
];

export default function ProductsPage() {
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...new Set(products.map(p => p.category))];
  
  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pt-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Top 30 Digital Products</h1>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                filter === cat 
                  ? 'bg-cyan-600 text-white' 
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div key={p.name} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-cyan-500 transition-all duration-300 flex flex-col">
              <div className="h-48 overflow-hidden bg-slate-800 relative">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                {p.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-bold mb-2">{p.name}</h2>
                <p className="text-slate-400 text-sm mb-4 flex-grow">{p.desc}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold text-cyan-400">${p.price.toFixed(2)}</span>
                  <a 
                    href={`/payment?item=${encodeURIComponent(p.name)}&amount=${p.price}`} 
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-bold text-sm transition-colors"
                  >
                    Buy Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
