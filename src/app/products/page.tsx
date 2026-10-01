'use client';

import { useState } from 'react';

type Product = {
  name: string;
  description: string;
  price: number;
  badge?: 'HOT' | 'POPULAR' | 'NEW';
  category: string;
  domain: string;
  slug?: string;
  emoji: string;
};

const PRODUCTS: Product[] = [
  { name: 'ChatGPT Plus', description: "OpenAI's GPT-4 powered assistant.", price: 20.0, badge: 'HOT', category: 'AI Tools', domain: 'openai.com', slug: 'openai', emoji: '🤖' },
  { name: 'Adobe Creative Cloud', description: 'Full suite of Adobe apps.', price: 54.99, badge: 'POPULAR', category: 'Creative', domain: 'adobe.com', slug: 'adobe', emoji: '🎨' },
  { name: 'Asana Premium', description: 'Project management with Gantt charts.', price: 10.99, badge: 'POPULAR', category: 'Business', domain: 'asana.com', slug: 'asana', emoji: '📋' },
  { name: 'Canva Pro', description: 'Premium design templates and assets.', price: 12.99, badge: 'NEW', category: 'Creative', domain: 'canva.com', slug: 'canva', emoji: '🖌️' },
  { name: 'Claude Pro', description: "Anthropic's advanced AI assistant.", price: 20.0, badge: 'NEW', category: 'AI Tools', domain: 'anthropic.com', slug: 'anthropic', emoji: '🧠' },
  { name: 'Cursor AI Pro', description: 'AI-first code editor built on VS Code.', price: 20.0, badge: 'NEW', category: 'AI Tools', domain: 'cursor.com', slug: 'cursor', emoji: '⌨️' },
  { name: 'Dashlane Premium', description: 'Password manager with VPN.', price: 4.99, badge: 'POPULAR', category: 'Security', domain: 'dashlane.com', slug: 'dashlane', emoji: '🔐' },
  { name: 'Dropbox Plus', description: '2TB cloud storage.', price: 9.99, badge: 'POPULAR', category: 'Productivity', domain: 'dropbox.com', slug: 'dropbox', emoji: '📦' },
  { name: 'ElevenLabs Starter', description: 'AI voice cloning and text-to-speech.', price: 5.0, badge: 'NEW', category: 'AI Tools', domain: 'elevenlabs.io', slug: 'elevenlabs', emoji: '🎙️' },
  { name: 'ExpressVPN', description: 'Ultra-fast VPN with 3,000+ servers.', price: 6.67, badge: 'HOT', category: 'Security', domain: 'expressvpn.com', slug: 'expressvpn', emoji: '🛡️' },
  { name: 'Figma Professional', description: 'Collaborative UI/UX design tool.', price: 12.0, badge: 'HOT', category: 'Creative', domain: 'figma.com', slug: 'figma', emoji: '✏️' },
  { name: 'GitHub Copilot', description: 'AI pair programmer.', price: 10.0, badge: 'HOT', category: 'AI Tools', domain: 'github.com', slug: 'githubcopilot', emoji: '🐙' },
  { name: 'Grammarly Premium', description: 'AI writing assistant.', price: 12.0, badge: 'POPULAR', category: 'AI Tools', domain: 'grammarly.com', slug: 'grammarly', emoji: '✍️' },
  { name: 'LastPass Premium', description: 'Secure password manager.', price: 3.0, badge: 'POPULAR', category: 'Security', domain: 'lastpass.com', slug: 'lastpass', emoji: '🔑' },
  { name: 'Loom Business', description: 'Async video messaging.', price: 12.5, badge: 'POPULAR', category: 'Business', domain: 'loom.com', slug: 'loom', emoji: '🎥' },
  { name: 'Microsoft 365 Business', description: 'Word, Excel, PowerPoint, Teams.', price: 12.5, badge: 'POPULAR', category: 'Business', domain: 'microsoft.com', slug: 'microsoft', emoji: '💼' },
  { name: 'Midjourney Standard', description: 'AI image generation.', price: 24.0, badge: 'HOT', category: 'AI Tools', domain: 'midjourney.com', slug: 'midjourney', emoji: '🌌' },
  { name: 'Monday.com Pro', description: 'Visual work OS.', price: 9.0, badge: 'NEW', category: 'Business', domain: 'monday.com', slug: 'mondaydotcom', emoji: '📅' },
  { name: 'Disney Premium', description: 'Marvel, Star Wars, Pixar & National Geographic. 4K streaming, 4 screens.', price: 13.99, badge: 'HOT', category: 'Entertainment', domain: 'disneyplus.com', slug: 'disneyplus', emoji: '🏰' },
  { name: 'NordVPN', description: 'Military-grade encryption.', price: 3.99, badge: 'HOT', category: 'Security', domain: 'nordvpn.com', slug: 'nordvpn', emoji: '🧊' },
  { name: 'Notion Plus', description: 'All-in-one workspace.', price: 8.0, badge: 'POPULAR', category: 'Productivity', domain: 'notion.so', slug: 'notion', emoji: '📝' },
  { name: 'Perplexity Pro', description: 'AI-powered search engine.', price: 20.0, badge: 'NEW', category: 'AI Tools', domain: 'perplexity.ai', slug: 'perplexity', emoji: '🔎' },
  { name: 'Adobe Photoshop', description: 'Industry-standard photo editing.', price: 22.99, badge: 'POPULAR', category: 'Creative', domain: 'adobe.com', slug: 'adobephotoshop', emoji: '🖼️' },
  { name: 'Adobe Premiere Pro', description: 'Professional video editing.', price: 22.99, badge: 'HOT', category: 'Creative', domain: 'adobe.com', slug: 'adobepremierepro', emoji: '🎬' },
  { name: 'Slack Pro', description: 'Team messaging platform.', price: 7.25, badge: 'POPULAR', category: 'Business', domain: 'slack.com', slug: 'slack', emoji: '💬' },
  { name: 'Spotify Premium', description: 'Ad-free music streaming.', price: 9.99, badge: 'POPULAR', category: 'Entertainment', domain: 'spotify.com', slug: 'spotify', emoji: '🎵' },
  { name: 'Webflow CMS', description: 'No-code website builder.', price: 14.0, badge: 'NEW', category: 'Creative', domain: 'webflow.com', slug: 'webflow', emoji: '🌐' },
  { name: 'YouTube Premium', description: 'Ad-free YouTube.', price: 13.99, badge: 'POPULAR', category: 'Entertainment', domain: 'youtube.com', slug: 'youtube', emoji: '▶️' },
  { name: 'Zoom Pro', description: 'HD video conferencing.', price: 14.0, badge: 'HOT', category: 'Business', domain: 'zoom.us', slug: 'zoom', emoji: '📹' },
  { name: '1Password', description: 'Password manager with family sharing.', price: 2.99, badge: 'POPULAR', category: 'Security', domain: '1password.com', slug: '1password', emoji: '🗝️' },
];

const CATEGORIES = ['All', 'AI Tools', 'Creative', 'Entertainment', 'Business', 'Productivity', 'Security'];

const CATEGORY_GRADIENTS: Record<string, string> = {
  'AI Tools': 'from-purple-900/70 to-gray-900',
  Creative: 'from-pink-900/70 to-gray-900',
  Entertainment: 'from-blue-900/70 to-gray-900',
  Business: 'from-emerald-900/70 to-gray-900',
  Productivity: 'from-amber-900/70 to-gray-900',
  Security: 'from-cyan-900/70 to-gray-900',
};

// ✅ BULLETPROOF PICTURE: logo → backup logo → designed brand tile (never broken)
function ProductImage({ product }: { product: Product }) {
  const sources = [
    `https://t3.gstatic.com/faviconV2?client=SOCIAL&url=https://${product.domain}&size=128`,
    ...(product.slug ? [`https://cdn.simpleicons.org/${product.slug}`] : []),
  ];
  const [idx, setIdx] = useState(0);
  const allFailed = idx >= sources.length;

  return (
    <div
      className={`relative h-36 bg-gradient-to-br ${CATEGORY_GRADIENTS[product.category] || 'from-gray-800 to-gray-900'} flex items-center justify-center overflow-hidden`}
    >
      <span className="absolute text-7xl opacity-30 select-none">{product.emoji}</span>
      {!allFailed && (
        <img
          src={sources[idx]}
          alt={`${product.name} logo`}
          width={88}
          height={88}
          referrerPolicy="no-referrer"
          className="relative w-[88px] h-[88px] object-contain drop-shadow-2xl"
          onError={() => setIdx((i) => i + 1)}
        />
      )}
    </div>
  );
}

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
            <div
              key={p.name}
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col hover:border-cyan-500/50 transition-all"
            >
              <div className="relative">
                <ProductImage product={p} />
                {p.badge && (
                  <span
                    className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded ${
                      p.badge === 'HOT'
                        ? 'bg-red-900/70 text-red-400'
                        : p.badge === 'NEW'
                        ? 'bg-green-900/70 text-green-400'
                        : 'bg-blue-900/70 text-blue-400'
                    }`}
                  >
                    {p.badge}
                  </span>
                )}
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold mb-2">{p.name}</h3>
                <p className="text-gray-400 text-sm mb-4 flex-1">{p.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-cyan-400">${p.price.toFixed(2)}</span>
                  <a
                    href={`/checkout?item=${encodeURIComponent(p.name)}&amount=${p.price}`}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-all"
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
