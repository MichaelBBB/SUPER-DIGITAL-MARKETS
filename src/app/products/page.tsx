'use client';
import { useState } from 'react';

const products = [
  { 
    name: 'ChatGPT Plus', 
    price: 20.00, 
    category: 'AI Tools', 
    badge: 'HOT', 
    desc: 'Advanced AI assistant with GPT-4, DALL-E, browsing, and plugins.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop',
    flags: ['🇸','🇮🇳','🇿🇦'] 
  },
  { 
    name: 'Adobe Creative Cloud', 
    price: 54.99, 
    category: 'Creative', 
    badge: 'POPULAR', 
    desc: 'Full suite of creative apps: Photoshop, Illustrator, Premiere, and more.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop',
    flags: ['🇺🇸','🇮🇳','🇿🇦'] 
  },
  { 
    name: 'Netflix Premium', 
    price: 22.99, 
    category: 'Entertainment', 
    badge: 'HOT', 
    desc: '4K streaming on 4 screens. Unlimited movies, shows, and documentaries.',
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format&fit=crop',
    flags: ['🇺🇸','🇮🇳','🇦'] 
  },
  { 
    name: 'Microsoft 365 Business', 
    price: 12.50, 
    category: 'Business', 
    badge: 'POPULAR', 
    desc: 'Word, Excel, PowerPoint, Teams, and 1TB OneDrive.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop',
    flags: ['🇺🇸','🇮🇳','🇦'] 
  },
  { 
    name: 'Spotify Premium', 
    price: 9.99, 
    category: 'Entertainment', 
    badge: 'POPULAR', 
    desc: 'Ad-free music, offline listening, unlimited skips. 100M+ songs.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop',
    flags: ['🇸','🇮','🇿🇦'] 
  },
  { 
    name: 'NordVPN', 
    price: 3.99, 
    category: 'Security', 
    badge: 'POPULAR', 
    desc: 'Military-grade encryption, 5,500+ servers in 60 countries.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop',
    flags: ['🇺🇸','🇮🇳','🇦'] 
  },
  { 
    name: 'Canva Pro', 
    price: 12.99, 
    category: 'Creative', 
    badge: 'NEW', 
    desc: 'Premium design templates, Brand Kit, background remover.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop',
    flags: ['🇺🇸','🇮','🇿🇦'] 
  },
  { 
    name: 'Grammarly Premium', 
    price: 12.00, 
    category: 'Productivity', 
    badge: 'POPULAR', 
    desc: 'AI writing assistant with advanced grammar and plagiarism detection.',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop',
    flags: ['🇺','🇮🇳','🇦'] 
  },
  { 
    name: 'Zoom Pro', 
    price: 14.99, 
    category: 'Business', 
    badge: 'HOT', 
    desc: 'Unlimited meetings up to 30 hours, 100 participants.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop',
    flags: ['🇺🇸','🇮🇳','🇿🇦'] 
  },
  { 
    name: 'Notion Plus', 
    price: 8.00, 
    category: 'Productivity', 
    badge: 'POPULAR', 
    desc: 'All-in-one workspace for notes, wikis, databases.',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop',
    flags: ['🇸','🇮','🇿🇦'] 
  },
];

const categories = ['All', 'AI Tools', 'Creative', 'Entertainment', 'Business', 'Productivity', 'Security'];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const getBadgeColor = (badge: string) => {
    if (badge === 'HOT') return 'bg-orange-500';
    if (badge === 'POPULAR') return 'bg-yellow-400 text-black';
    if (badge === 'NEW') return 'bg-cyan-500';
    return 'bg-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <p className="text-cyan-400 text-sm font-bold tracking-wider">FEATURED SELECTION</p>
          <h1 className="text-4xl md:text-6xl font-bold">
            Top Digital <span className="text-yellow-400">Products</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Handpicked bestsellers across every category. Instant delivery worldwide.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3">
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product, idx) => (
            <div key={idx} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-cyan-600 transition-all group">
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white ${getBadgeColor(product.badge)}`}>
                  {product.badge}
                </div>
                {/* Category Tag */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs bg-gray-900/80 backdrop-blur text-gray-300">
                  {product.category}
                </div>
                {/* Price */}
                <div className="absolute bottom-4 right-4">
                  <span className="text-2xl font-bold text-cyan-400 drop-shadow-lg">${product.price.toFixed(2)}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-400 text-sm">{product.desc}</p>
                </div>
                
                {/* Flags */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{product.flags.join(' ')}</span>
                  <span>Available in these markets</span>
                </div>

                {/* Buy Button */}
                <a 
                  href={`/payment?item=${encodeURIComponent(product.name)}&amount=${product.price}`}
                  className="block w-full text-center py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 rounded-full font-bold transition-all"
                >
                  🛒 Buy Now — ${product.price.toFixed(2)}
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pb-12">
          <a href="/" className="text-gray-500 hover:text-white text-sm">← Back to Home</a>
        </div>
      </div>
    </div>
  );
}
