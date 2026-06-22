'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function CtaSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
        <div className="blob-primary absolute w-96 h-96 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 border border-primary/20">
          <span className="live-dot" />
          <span className="text-xs font-bold text-primary tracking-widest uppercase">
            Available Right Now — Instant Access
          </span>
        </div>

        <h2 className="text-hero-xl font-extrabold text-foreground mb-6">
          Your digital world,{' '}
          <span className="text-gradient-cyan">one click away.</span>
        </h2>

        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          Shop 30 premium digital products, pay in your local currency, and get instant delivery.
          Trusted by buyers in the USA, India, China, and South Africa.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/products"
            className="btn-primary px-10 py-5 rounded-full text-lg font-bold flex items-center justify-center gap-3"
          >
            <Icon name="ShoppingBagIcon" size={22} variant="solid" />
            Shop All 30 Products
          </Link>
          <a
            href="#payment-panel"
            className="btn-secondary px-10 py-5 rounded-full text-lg font-semibold flex items-center justify-center gap-3"
          >
            <Icon name="QuestionMarkCircleIcon" size={22} />
            How to Pay
          </a>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-lg">🇺🇸</span>
            <span className="font-medium">USA</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-lg">🇮🇳</span>
            <span className="font-medium">India</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-lg">🇨🇳</span>
            <span className="font-medium">China</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-lg">🇿🇦</span>
            <span className="font-medium">South Africa</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <Icon name="LockClosedIcon" size={14} className="text-primary" variant="solid" />
            <span className="font-medium">256-bit Encrypted</span>
          </div>
        </div>
      </div>
    </section>
  );
}