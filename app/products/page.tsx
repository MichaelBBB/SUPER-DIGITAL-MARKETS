
'use client';

import { useState } from 'react';

type Product = {
  name: string;
  price: number;
  category: string;
  badge: string;
  desc: string;
  image: string;
};

const products: Product[] = [
  { name: 'ChatGPT Plus', price: 20, category: 'AI Tools', badge: 'HOT', desc: 'AI assistant with advanced reasoning, image generation, and browsing.', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&q=80' },
  { name: 'Adobe Creative Cloud', price: 54.99, category: 'Creative', badge: 'POPULAR', desc: 'Creative apps for design, photography, illustration, and video.', image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=500&q=80' },
  { name: 'Netflix Premium', price: 22.99, category: 'Entertainment', badge: 'HOT', desc: 'Premium streaming entertainment.', image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80' },
  { name: 'Microsoft 365 Business', price: 12.50, category: 'Business', badge: 'POPULAR', desc: 'Word, Excel, PowerPoint, Teams, and OneDrive.', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=80' },
  { name: 'Spotify Premium', price: 9.99, category: 'Entertainment', badge: 'POPULAR', desc: 'Music and podcasts with premium listening features.', image: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=500&q=80' },
  { name: 'NordVPN', price: 3.99, category: 'Security', badge: 'HOT', desc: 'VPN service for private and secure internet access.', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&q=80' },
  { name: 'Canva Pro', price: 12.99, category: 'Creative', badge: 'NEW', desc: 'Design templates and creative tools for everyday projects.', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&q=80' },
  { name: 'Grammarly Premium', price: 12, category: 'Productivity', badge: 'POPULAR', desc: 'Writing assistance for grammar, clarity, and style.', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&q=80' },
  { name: 'Zoom Pro', price: 14.99, category: 'Business', badge: 'HOT', desc: 'Video meetings and collaboration tools.', image: 'https://images.unsplash.com/photo-1587614203976-365c74645e83?w=500&q=80' },
  { name: 'Notion Plus', price: 8, category: 'Productivity', badge: 'POPULAR', desc: 'Workspace for notes, documents, databases, and projects.', image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500&q=80' },
  { name: 'Figma Professional', price: 12, category: 'Creative', badge: 'HOT', desc: 'Collaborative interface and experience design tools.', image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=500&q=80' },
  { name: 'Dropbox Plus', price: 9.99, category: 'Productivity', badge: 'POPULAR', desc: 'Cloud storage, file syncing, and file sharing.', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&q=80' },
  { name: 'LastPass Premium', price: 3, category: 'Security', badge: 'NEW', desc: 'Password management and secure credential storage.', image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=500&q=80' },
  { name: 'Cursor AI Pro', price: 20, category: 'AI Tools', badge: 'HOT', desc: 'AI-assisted coding and developer productivity tools.', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80' },
  { name: 'Midjourney Standard', price: 24, category: 'AI Tools', badge: 'POPULAR', desc: 'AI image generation for creative projects.', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=80' },
  { name: 'GitHub Copilot', price: 10, category: 'AI Tools', badge: 'HOT', desc: 'AI coding assistance for software developers.', image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=500&q=80' },
  { name: 'Slack Pro', price: 7.25, category: 'Business', badge: 'POPULAR', desc: 'Team messaging, collaboration, and workflow tools.', image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=500&q=80' },
  { name: 'Dashlane Premium', price: 4.99, category: 'Security', badge: 'NEW', desc: 'Password manager with security monitoring features.', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&q=80' },
  { name: 'Adobe Photoshop', price: 22.99, category: 'Creative', badge: 'HOT', desc: 'Photo editing and digital image creation tools.', image: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=500&q=80' },
  { name: 'Claude Pro', price: 20, category: 'AI Tools', badge: 'POPULAR', desc: 'AI assistant for writing, analysis, and problem solving.', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&q=80' },
  { name: 'Adobe Premiere Pro', price: 22.99, category: 'Creative', badge: 'HOT', desc: 'Professional video editing and production tools.', image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500&q=80' },
  { name: 'Asana Premium', price: 10.99, category: 'Business', badge: 'POPULAR', desc: 'Project management and team task coordination.', image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=500&q=80' },
  { name: 'ExpressVPN', price: 6.67, category: 'Security', badge: 'HOT', desc: 'VPN service for private internet browsing.', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&q=80' },
  { name: 'YouTube Premium', price: 13.99, category: 'Entertainment', badge: 'POPULAR', desc: 'Premium video viewing and music features.', image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=500&q=80' },
  { name: '1Password', price: 2.99, category: 'Security', badge: 'NEW', desc: 'Password manager for secure logins and credentials.', image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=500&q=80' },
  { name: 'Monday.com Pro', price: 9, category: 'Business', badge: 'POPULAR', desc: 'Visual project management and team workflows.', image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=500&q=80' },
  { name: 'Perplexity Pro', price: 20, category: 'AI Tools', badge: 'HOT', desc: 'AI-powered search and research assistance.', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&q=80' },
  { name: 'Loom Business', price: 12.50, category: 'Business', badge: 'NEW', desc: 'Video messaging and team communication tools.', image: 'https://images.unsplash.com/photo-1587614203976-365c74645e83?w=500&q=80' },
  { name: 'Webflow CMS', price: 14, category: 'Creative', badge: 'POPULAR', desc: 'Visual website building and content management.', image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=500&q=80' },
  { name: 'ElevenLabs Starter', price: 5, category: 'AI Tools', badge: 'NEW', desc: 'AI voice generation and text-to-speech tools.', image: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=500&q=80' },
];

export default function ProductsPage() {
  const [filter, setFilter] = useState('All');

  const categories = [
    'All',
    ...Array.from(new Set(products.map((product) => product.category))),
  ];

  const filteredProducts =
    filter === 'All'
      ? products
      : products.filter((product) => product.category === filter);

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Top 30 Digital Products
        </h1>

        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                filter === category
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <article
              key={product.name}
              className="flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition-colors hover:border-cyan-500"
            >
              <div className="relative h-48 overflow-hidden bg-slate-800">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                  {product.badge}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h2 className="mb-2 text-xl font-bold">{product.name}</h2>
                <p className="mb-4 flex-1 text-sm text-slate-400">
                  {product.desc}
                </p>

                <div className="mt-auto flex items-center justify-between gap-3">
                  <span className="text-2xl font-bold text-cyan-400">
                    ${product.price.toFixed(2)}
                  </span>

                  <a
                    href={`/payment?item=${encodeURIComponent(product.name)}&amount=${product.price}`}
                    className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-bold transition-colors hover:bg-cyan-500"
                  >
                    Buy Now
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
