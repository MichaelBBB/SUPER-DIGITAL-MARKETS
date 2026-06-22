'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { DIGITAL_PRODUCTS } from '@/app/data/products';

const CATEGORIES = ['All', 'AI Tools', 'Creative', 'Entertainment', 'Business', 'Productivity', 'Security'];

export default function FeaturedProducts() {
  const [activeCategory, setActiveCategory] = useState('All');
  const featured = DIGITAL_PRODUCTS.slice(0, 9);
  const filtered = activeCategory === 'All'
    ? featured
    : featured.filter((p) => p.category === activeCategory);

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold text-primary tracking-widest uppercase block mb-2">
              Featured Selection
            </span>
            <h2 className="text-section-xl font-extrabold text-foreground">
              Top Digital <span className="text-gradient-gold">Products</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md">
              Handpicked bestsellers across every category. Instant delivery worldwide.
            </p>
          </div>
          <Link
            href="/products"
            className="btn-secondary px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 flex-shrink-0"
          >
            View All 30
            <Icon name="ArrowRightIcon" size={16} />
          </Link>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 flex-wrap mb-10 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex-shrink-0 ${
                activeCategory === cat
                  ? 'payment-tab-active border' :'glass-card hover:border-primary/30 hover:text-foreground text-muted-foreground border border-border/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="btn-primary px-10 py-4 rounded-full text-base font-bold inline-flex items-center gap-3"
          >
            <Icon name="Squares2X2Icon" size={20} variant="solid" />
            Browse All 30 Digital Products
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, index }: { product: typeof DIGITAL_PRODUCTS[0]; index: number }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      className="glass-card rounded-2xl overflow-hidden card-hover group border border-border/50"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden">
        <AppImage
          src={product.image}
          alt={product.imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />

        {/* Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            product.badge === 'HOT' ? 'product-badge-hot' :
            product.badge === 'NEW'? 'product-badge-new' : 'product-badge-popular'
          }`}>
            {product.badge}
          </span>
        </div>

        {/* Category */}
        <div className="absolute top-3 right-3">
          <span className="glass-card px-2.5 py-1 rounded-full text-xs font-medium text-muted-foreground border border-border/50">
            {product.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-bold text-foreground text-base leading-tight">{product.name}</h3>
          <div className="font-mono-price text-primary font-extrabold text-lg flex-shrink-0">
            ${product.price}
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-4 leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* Markets */}
        <div className="flex items-center gap-1.5 mb-4">
          {product.markets.map((m) => (
            <span key={m} className="text-base" title={m}>{m === 'USA' ? '🇺🇸' : m === 'India' ? '🇮🇳' : m === 'China' ? '🇨🇳' : '🇿🇦'}</span>
          ))}
          <span className="text-xs text-muted-foreground ml-1">Available in these markets</span>
        </div>

        {/* Add to Cart */}
        <Link
          href={`/checkout?product=${product.id}`}
          onClick={handleAdd}
          className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
            added
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' :'btn-primary'
          }`}
        >
          {added ? (
            <>
              <Icon name="CheckIcon" size={16} variant="solid" />
              Added to Cart
            </>
          ) : (
            <>
              <Icon name="ShoppingCartIcon" size={16} variant="solid" />
              Buy Now — ${product.price}
            </>
          )}
        </Link>
      </div>
    </div>
  );
}