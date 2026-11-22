
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
  {
    name: 'ChatGPT Plus',
    price: 20,
    category: 'AI Tools',
    badge: 'HOT',
    desc: 'AI assistant with advanced reasoning, image generation, and browsing.',
    image: '/images/chatgpt.jpg',
  },
  {
    name: 'Adobe Creative Cloud',
    price: 54.99,
    category: 'Creative',
    badge: 'POPULAR',
    desc: 'Creative apps for design, photography, illustration, and video.',
    image: '/images/adobe-cc.jpg',
  },
  {
    name: 'Netflix Premium',
    price: 22.99,
    category: 'Entertainment',
    badge: 'HOT',
    desc: 'Premium streaming entertainment.',
    image: '/images/netflx.jpg',
  },
  {
    name: 'Spotify Premium',
    price: 9.99,
    category: 'Entertainment',
    badge: 'POPULAR',
    desc: 'Music and podcasts with premium listening features.',
    image: '/images/spotify.jpg',
  },
  {
    name: 'NordVPN',
    price: 3.99,
    category: 'Security',
    badge: 'HOT',
    desc: 'VPN service for private and secure internet access.',
    image: '/images/nordvpn.jpg',
  },
  {
    name: 'Canva Pro',
    price: 12.99,
    category: 'Creative',
    badge: 'NEW',
    desc: 'Design templates and creative tools for everyday projects.',
    image: '/images/canva.jpg',
  },
  {
    name: 'Grammarly Premium',
    price: 12,
    category: 'Productivity',
    badge: 'POPULAR',
    desc: 'Writing assistance for grammar, clarity, and style.',
    image: '/images/grammarly.jpg',
  },
  {
    name: 'Zoom Pro',
    price: 14.99,
    category: 'Business',
    badge: 'HOT',
    desc: 'Video meetings and collaboration tools.',
    image: '/images/zoom.jpg',
  },
  {
    name: 'Notion Plus',
    price: 8,
    category: 'Productivity',
    badge: 'POPULAR',
    desc: 'Workspace for notes, documents, databases, and projects.',
    image: '/images/notion.jpg',
  },
  {
    name: 'Figma Professional',
    price: 12,
    category: 'Creative',
    badge: 'HOT',
    desc: 'Collaborative interface and experience design tools.',
    image: '/images/figma.jpg',
  },
  {
    name: 'Dropbox Plus',
    price: 9.99,
    category: 'Productivity',
    badge: 'POPULAR',
    desc: 'Cloud storage, file syncing, and file sharing.',
    image: '/images/dropbox.jpg',
  },
  {
    name: 'LastPass Premium',
    price: 3,
    category: 'Security',
    badge: 'NEW',
    desc: 'Password management and secure credential storage.',
    image: '/images/lastpass.jpg',
  },
  {
    name: 'Cursor AI Pro',
    price: 20,
    category: 'AI Tools',
    badge: 'HOT',
    desc: 'AI-assisted coding and developer productivity tools.',
    image: '/images/cursor.jpg',
  },
  {
    name: 'Midjourney Standard',
    price: 24,
    category: 'AI Tools',
    badge: 'POPULAR',
    desc: 'AI image generation for creative projects.',
    image: '/images/midjourney.jpg',
  },
  {
    name: 'GitHub Copilot',
    price: 10,
    category: 'AI Tools',
    badge: 'HOT',
    desc: 'AI coding assistance for software developers.',
    image: '/images/github-copilot.jpg',
  },
  {
    name: 'Dashlane Premium',
    price: 4.99,
    category: 'Security',
    badge: 'NEW',
    desc: 'Password manager with security monitoring features.',
    image: '/images/dashlane.jpg',
  },
  {
    name: 'Adobe Photoshop',
    price: 22.99,
    category: 'Creative',
    badge: 'HOT',
    desc: 'Photo editing and digital image creation tools.',
    image: '/images/photoshop.jpg',
  },
  {
    name: 'Claude Pro',
    price: 20,
    category: 'AI Tools',
    badge: 'POPULAR',
    desc: 'AI assistant for writing, analysis, and problem solving.',
    image: '/images/claude.jpg',
  },
  {
    name: 'Adobe Premiere Pro',
    price: 22.99,
    category: 'Creative',
    badge: 'HOT',
    desc: 'Professional video editing and production tools.',
    image: '/images/premiere.jpg',
  },
  {
    name: 'Asana Premium',
    price: 10.99,
    category: 'Business',
    badge: 'POPULAR',
    desc: 'Project management and team task coordination.',
    image: '/images/asana.jpg',
  },
  {
    name: 'ExpressVPN',
    price: 6.67,
    category: 'Security',
    badge: 'HOT',
    desc: 'VPN service for private internet browsing.',
    image: '/images/expressvpn.jpg',
  },
  {
    name: 'YouTube Premium',
    price: 13.99,
    category: 'Entertainment',
    badge: 'POPULAR',
    desc: 'Premium video viewing and music features.',
    image: '/images/youtube-premium.jpg',
  },
  {
    name: '1Password',
    price: 2.99,
    category: 'Security',
    badge: 'NEW',
    desc: 'Password manager for secure logins and credentials.',
    image: '/images/1password.jpg',
  },
  {
    name: 'Monday.com Pro',
    price: 9,
    category: 'Business',
    badge: 'POPULAR',
    desc: 'Visual project management and team workflows.',
    image: '/images/monday.jpg',
  },
  {
    name: 'Perplexity Pro',
    price: 20,
    category: 'AI Tools',
    badge: 'HOT',
    desc: 'AI-powered search and research assistance.',
    image: '/images/perplexity.jpg',
  },
  {
    name: 'Loom Business',
    price: 12.5,
    category: 'Business',
    badge: 'NEW',
    desc: 'Video messaging and team communication tools.',
    image: '/images/loom.jpg',
  },
  {
    name: 'Webflow CMS',
    price: 14,
    category: 'Creative',
    badge: 'POPULAR',
    desc: 'Visual website building and content management.',
    image: '/images/webflow.jpg',
  },
  {
    name: 'ElevenLabs Starter',
    price: 5,
    category: 'AI Tools',
    badge: 'NEW',
    desc: 'AI voice generation and text-to-speech tools.',
    image: '/images/elevenlabs.jpg',
  },
  {
    name: 'Disney Premium',
    price: 13.99,
    category: 'Entertainment',
    badge: 'POPULAR',
    desc: 'Premium Disney streaming entertainment.',
    image: '/images/disney-premium.jpg',
  },
  {
    name: 'Linux Zorin OS Pro',
    price: 47.99,
    category: 'Software',
    badge: 'NEW',
    desc: 'Zorin OS Pro desktop operating system with premium desktop layouts and additional software.',
    image: '/images/zorin-os.JPG',
  },
];

export default function ProductsPage() {
  const [filter, setFilter] = useState('All');

  const categories = [
    'All',
    ...Array.from(
      new Set(products.map((product) => product.category))
    ),
  ];

  const filteredProducts =
    filter === 'All'
      ? products
      : products.filter((product) => product.category === filter);

  function getPaymentUrl(product: Product) {
    return `/payment?item=${encodeURIComponent(product.name)}&amount=${product.price}`;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
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
              aria-pressed={filter === category}
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
            <a
              key={product.name}
              href={getPaymentUrl(product)}
              aria-label={`Buy ${product.name} for US$${product.price.toFixed(2)}`}
              className="group block h-full rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition-colors group-hover:border-cyan-500 group-focus-visible:border-cyan-400">
                <div className="relative h-48 overflow-hidden bg-slate-800">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                    {product.badge}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h2 className="mb-2 text-xl font-bold">
                    {product.name}
                  </h2>

                  <p className="mb-4 flex-1 text-sm text-slate-400">
                    {product.desc}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-3">
                    <span className="text-2xl font-bold text-cyan-400">
                      ${product.price.toFixed(2)}
                    </span>

                    <span className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-bold text-white transition-colors group-hover:bg-cyan-500">
                      Buy Now
                    </span>
                  </div>
                </div>
              </article>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
