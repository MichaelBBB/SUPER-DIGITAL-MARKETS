'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

export default function Footer() {
  const [year, setYear] = useState('');

  useEffect(() => {
    setYear(new Date()?.getFullYear()?.toString());
  }, []);

  return (
    <footer className="border-t border-border/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo + Brand */}
          <div className="flex items-center gap-2.5">
            <AppLogo size={32} />
            <span className="font-extrabold text-base tracking-tight">
              <span className="text-gradient-cyan">SUPER</span>
              <span className="text-foreground ml-1">DIGITAL</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link href="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Products</Link>
            <Link href="/checkout" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Checkout</Link>
            <a href="#payment-panel" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How to Pay</a>
            <a href="#privacy" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
            <a href="#terms" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Terms</a>
          </div>

          {/* Social + Copyright */}
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
              <Icon name="GlobeAltIcon" size={18} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Email">
              <Icon name="EnvelopeIcon" size={18} />
            </a>
            <span className="text-muted-foreground text-sm font-medium">
              {year && `© ${year}`} SUPER DIGITAL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}