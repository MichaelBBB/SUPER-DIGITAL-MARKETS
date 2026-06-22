'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Checkout', href: '/checkout' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      const close = () => setMobileOpen(false);
      window.addEventListener('scroll', close, { passive: true, once: true });
    }
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'glass-nav border-b border-border' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <AppLogo
            size={36}
            className="group-hover:scale-105 transition-transform duration-300"
          />
          <span className="font-sans text-lg font-800 tracking-tight text-foreground hidden sm:block">
            <span className="text-gradient-cyan font-extrabold">SUPER</span>
            <span className="text-foreground font-bold ml-1">DIGITAL</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-muted/40 px-2 py-1.5 rounded-full border border-border/50 backdrop-blur-sm">
          {navLinks?.map((link) => (
            <Link
              key={link?.href}
              href={link?.href}
              className="px-5 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-card/60 transition-all duration-200"
            >
              {link?.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/40 border border-border/50">
            <span className="live-dot" />
            <span className="text-xs font-semibold text-muted-foreground">LIVE</span>
          </div>
          <Link
            href="/products"
            className="btn-primary px-5 py-2.5 rounded-full text-sm hidden sm:flex items-center gap-2"
          >
            <Icon name="ShoppingBagIcon" size={16} variant="solid" />
            Shop Now
          </Link>
          <button
            className="md:hidden text-foreground p-2 rounded-lg hover:bg-card/60 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <Icon name={mobileOpen ? 'XMarkIcon' : 'Bars3Icon'} size={24} />
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ background: 'rgba(5,10,20,0.97)', backdropFilter: 'blur(24px)' }}
      >
        <div className="flex flex-col gap-1 px-4 py-4 border-t border-border">
          {navLinks?.map((link) => (
            <Link
              key={link?.href}
              href={link?.href}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:text-primary hover:bg-card/40 transition-all duration-200"
            >
              {link?.label}
            </Link>
          ))}
          <Link
            href="/checkout"
            onClick={() => setMobileOpen(false)}
            className="btn-primary mt-2 px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
          >
            <Icon name="ShoppingBagIcon" size={16} variant="solid" />
            Shop Now
          </Link>
        </div>
      </div>
    </header>
  );
}