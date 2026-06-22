'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { DIGITAL_PRODUCTS, Product } from '@/app/data/products';

const CATEGORIES = ['All', 'AI Tools', 'Creative', 'Entertainment', 'Business', 'Productivity', 'Security'];
const SORT_OPTIONS = ['Popular', 'Price: Low to High', 'Price: High to Low', 'Newest'];
const MARKETS = ['All Markets', 'USA', 'India', 'China'];

export default function ProductsGrid() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeMarket, setActiveMarket] = useState('All Markets');
  const [sortBy, setSortBy] = useState('Popular');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let items = [...DIGITAL_PRODUCTS];

    if (activeCategory !== 'All') {
      items = items.filter((p) => p.category === activeCategory);
    }
    if (activeMarket !== 'All Markets') {
      items = items.filter((p) => p.markets.includes(activeMarket));
    }
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((p) =>
        p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'Price: Low to High':
        items.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'Price: High to Low':
        items.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'Newest':
        items = items.filter((p) => p.badge === 'NEW').concat(items.filter((p) => p.badge !== 'NEW'));
        break;
      default:
        items.sort((a, b) => a.rank - b.rank);
    }

    return items;
  }, [activeCategory, activeMarket, sortBy, search]);

  return (
    <section className="pb-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Filters Bar */}
        <div className="sticky top-16 z-30 glass-nav border-b border-border/50 py-4 mb-8 -mx-4 px-4 sm:-mx-6 sm:px-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2.5 bg-card/60 border border-border/60 rounded-xl text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary/50 transition-colors"
                aria-label="Search digital products"
              />
            </div>

            {/* Category filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 flex-nowrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 flex-shrink-0 ${
                    activeCategory === cat
                      ? 'payment-tab-active border' :'glass-card border border-border/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-card border border-border/60 rounded-xl px-3 py-2.5 text-xs font-semibold text-foreground outline-none cursor-pointer flex-shrink-0"
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o} value={o} className="bg-card text-foreground">{o}</option>
              ))}
            </select>
          </div>

          {/* Market filter */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
            {MARKETS.map((m) => (
              <button
                key={m}
                onClick={() => setActiveMarket(m)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex-shrink-0 flex items-center gap-1.5 ${
                  activeMarket === m
                    ? 'bg-accent/20 border border-accent/40 text-accent' :'glass-card border border-border/40 text-muted-foreground hover:text-foreground'
                }`}
              >
                {m === 'USA' ? '🇺🇸' : m === 'India' ? '🇮🇳' : m === 'China' ? '🇨🇳' : '🌍'}
                {m}
              </button>
            ))}
            <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
              {filtered.length} product{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product, index) => (
              <ProductCardFull key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProductCardFull({ product, index }: { product: Product; index: number }) {
  return (
    <div
      className="glass-card rounded-2xl overflow-hidden card-hover group border border-border/50 flex flex-col"
      style={{ animationDelay: `${(index % 12) * 0.05}s` }}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden flex-shrink-0">
        <AppImage
          src={product.image}
          alt={product.imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/10 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
            product.badge === 'HOT' ? 'product-badge-hot' :
            product.badge === 'NEW'? 'product-badge-new' : 'product-badge-popular'
          }`}>
            {product.badge}
          </span>
        </div>
        <div className="absolute top-3 right-3 font-mono-price text-lg font-extrabold text-primary">
          ${product.price}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-1">
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
            {product.category}
          </span>
        </div>
        <h3 className="font-bold text-foreground text-sm mb-2 leading-tight">{product.name}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed flex-1 line-clamp-2 mb-3">
          {product.description}
        </p>

        {/* Markets */}
        <div className="flex items-center gap-1 mb-3">
          {product.markets.map((m) => (
            <span key={m} className="text-sm" title={m}>
              {m === 'USA' ? '🇺🇸' : m === 'India' ? '🇮🇳' : m === 'China' ? '🇨🇳' : '🇿🇦'}
            </span>
          ))}
        </div>

        <Link
          href={`/checkout?product=${product.id}`}
          className="btn-primary w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 mt-auto"
        >
          <Icon name="ShoppingCartIcon" size={14} variant="solid" />
          Buy Now
        </Link>
      </div>
    </div>
  );
}