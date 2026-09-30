'use client';

import { useState } from 'react';

type Product = { name: string; description: string; price: number; badge?: string; category: string };

const PRODUCTS: Product[] = [
  { name: 'ChatGPT Plus', description: "OpenAI's GPT-4 powered assistant.", price: 20.0, badge: 'HOT', category: 'AI Tools' },
  { name: 'Adobe Creative Cloud', description: 'Full suite of Adobe apps.', price: 54.99, badge: 'POPULAR', category: 'Creative' },
  { name: 'Asana Premium', description: 'Project management with Gantt charts.', price: 10.99, badge: 'POPULAR', category: 'Business' },
  { name: 'Canva Pro', description: 'Premium design templates and assets.', price: 12.99, badge: 'NEW', category: 'Creative' },
  { name: 'Claude Pro', description: "Anthropic's advanced AI assistant.", price: 20.0, badge: 'NEW', category: 'AI Tools' },
  { name: 'Cursor AI Pro', description: 'AI-first code editor built on VS Code.', price: 20.0, badge: 'NEW', category: 'AI Tools' },
  { name: 'Dashlane Premium', description: 'Password manager with VPN.', price: 4.99, badge: 'POPULAR', category: 'Security' },
  { name: 'Dropbox Plus', description: '2TB cloud storage.', price: 9.99, badge: 'POPULAR', category: 'Productivity' },
  { name: 'ElevenLabs Starter', description: 'AI voice cloning and text-to-speech.', price: 5.0, badge: 'NEW', category: 'AI Tools' },
  { name: 'ExpressVPN', description: 'Ultra-fast VPN with 3,000+ servers.', price: 6.67, badge: 'HOT', category: 'Security' },
  { name: 'Figma Professional', description: 'Collaborative UI/UX design tool.', price: 12.0, badge: 'HOT', category: 'Creative' },
  { name: 'GitHub Copilot', description: 'AI pair programmer.', price: 10.0, badge: 'HOT', category: 'AI Tools' },
  { name: 'Grammarly Premium', description: 'AI writing assistant.', price: 12.0, badge: 'POPULAR', category: 'AI Tools' },
  { name: 'LastPass Premium', description: 'Secure password manager.', price: 3.0, badge: 'POPULAR', category: 'Security' },
  { name: 'Loom Business', description: 'Async video messaging.', price: 12.5, badge: 'POPULAR', category: 'Business' },
  { name: 'Microsoft 365 Business', description: 'Word, Excel, PowerPoint, Teams.', price: 12.5, badge: 'POPULAR', category: 'Business' },
  { name: 'Midjourney Standard', description: 'AI image generation.', price: 24.0, badge: 'HOT', category: 'AI Tools' },
  { name: 'Monday.com Pro', description: 'Visual work OS.', price: 9.0, badge: 'NEW', category: 'Business' },
  { name: 'Disney Premium', description: 'Marvel, Star Wars, Pixar & National Geographic. 4K streaming, 4 screens.', price: 13.99, badge: 'HOT', category: 'Entertainment' },
  { name: 'NordVPN', description: 'Military-grade encryption.', price: 3.99, badge: 'HOT', category: 'Security' },
  { name: 'Notion Plus', description: 'All-in-one workspace.', price: 8.0, badge: 'POPULAR', category: 'Productivity' },
  { name: 'Perplexity Pro', description: 'AI-powered search engine.', price: 20.0, badge: 'NEW', category: 'AI Tools' },
  { name: 'Adobe Photoshop', description: 'Industry-standard photo editing.', price: 22.99, badge: 'POPULAR', category: 'Creative' },
  { name: 'Adobe Premiere Pro', description: 'Professional video editing.', price: 22.99, badge: 'HOT', category: 'Creative' },
  { name: 'Slack Pro', description: 'Team messaging platform.', price: 7.25, badge: 'POPULAR', category: 'Business' },
  { name: 'Spotify Premium', description: 'Ad-free music streaming.', price: 9.99, badge: 'POPULAR', category: 'Entertainment' },
  { name: 'Webflow CMS', description: 'No-code website builder.', price: 14.0, badge: 'NEW', category: 'Creative' },
  { name: 'YouTube Premium', description: 'Ad-free YouTube.', price: 13.99, badge: 'POPULAR', category: 'Entertainment' },
  { name: 'Zoom Pro', description: 'HD video conferencing.', price: 14.0, badge: 'HOT', category: 'Business' },
  { name: '1Password', description: 'Password manager with family sharing.', price: 2.99, badge: 'POPULAR', category: 'Security' },
];

const CATEGORIES = ['All', 'AI Tools', 'Creative', 'Entertainment', 'Business', 'Productivity', 'Security'];

export default function ProductsPage() {
  const [category, setCategory] = useState('All');
  const filtered = category === 'All' ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">All Digital Products</h1>
        <p className="text-gray-400 mb-8">Instant delivery. Pay by card (worldwide) or Instant EFT (South Africa).</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                category === c ? 'bg-cyan-600 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <div key={p.name} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col hover:border-cyan-500/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold">{p.name}</h3>
                {p.badge && (
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                    p.badge === 'HOT' ? 'bg-red-900/50 text-red-400' : p.badge === 'NEW' ? 'bg-green-900/50 text-green-400' : 'bg-blue-900/50 text-blue-400'
                  }`}>
                    {p.badge}
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm mb-4 flex-1">{p.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-extrabold text-cyan-400">${p.price.toFixed(2)}</span>
                {/* ✅ Buy Now goes to the NEW confirmed checkout - NO old WhatsApp links! */}
                <a
                  href={`/checkout?item=${encodeURIComponent(p.name)}&amount=${p.price}`}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-all"
                >
                  Buy Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
