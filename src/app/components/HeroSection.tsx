'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const STATS = [
{ label: 'Products Available', value: '30', suffix: '+' },
{ label: 'Countries Served', value: '3', suffix: '' },
{ label: 'Payment Methods', value: '8', suffix: '+' },
{ label: 'Instant Delivery', value: '100', suffix: '%' }];


const FEATURED_CATEGORIES = [
{ icon: 'SparklesIcon', label: 'AI Tools', count: 8 },
{ icon: 'PaintBrushIcon', label: 'Creative', count: 7 },
{ icon: 'FilmIcon', label: 'Entertainment', count: 6 },
{ icon: 'BriefcaseIcon', label: 'Business', count: 9 }];


export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typedText, setTypedText] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  const prompts = [
  'Find me the best AI writing tool...',
  'I need a VPN for privacy...',
  'Looking for video editing software...',
  'Best productivity suite for teams...'];

  const [promptIndex, setPromptIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = prompts[promptIndex];
    const speed = isDeleting ? 40 : 70;

    const timer = setTimeout(() => {
      if (!isDeleting && charIndex < current.length) {
        setTypedText(current.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      } else if (!isDeleting && charIndex === current.length) {
        setTimeout(() => setIsDeleting(true), 1800);
      } else if (isDeleting && charIndex > 0) {
        setTypedText(current.slice(0, charIndex - 1));
        setCharIndex((c) => c - 1);
      } else {
        setIsDeleting(false);
        setPromptIndex((i) => (i + 1) % prompts.length);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, promptIndex, prompts]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5
      });
    };
    const el = heroRef.current;
    el?.addEventListener('mousemove', handleMouseMove);
    return () => el?.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden">
      
      {/* Background: Earth from Space */}
      <div className="absolute inset-0 z-0">
        <AppImage
          src="https://img.rocket.new/generatedImages/rocket_gen_img_17b15c78b-1772674898277.png"
          alt="Earth from space at night showing city lights, deep black space background with stars"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw" />
        
        {/* Multi-layer scrim for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
        {/* Noise texture */}
        <div className="absolute inset-0 noise-overlay opacity-40" />
      </div>

      {/* Animated blobs */}
      <div
        className="absolute blob-primary w-96 h-96 rounded-full opacity-60"
        style={{
          top: '20%',
          left: '5%',
          transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 15}px)`,
          transition: 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }} />
      
      <div
        className="absolute blob-accent w-80 h-80 rounded-full opacity-40"
        style={{
          bottom: '20%',
          right: '10%',
          transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -10}px)`,
          transition: 'transform 1s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }} />
      

      {/* Star field overlay */}
      <div className="absolute inset-0 star-field opacity-60 z-0" />

      {/* Scan line effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
        <div className="scan-line absolute w-full h-32" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-fade-in-up">
            <span className="live-dot" />
            <span className="text-xs font-bold text-primary tracking-widest uppercase">
              Live Global Marketplace
            </span>
            <span className="text-xs text-muted-foreground">
              USA · India · China · South Africa
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-hero-xl font-extrabold text-foreground mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            The World&apos;s{' '}
            <span className="shimmer-text">Top 30</span>
            <br />
            Digital Products
            <br />
            <span className="text-gradient-gold">Delivered Instantly.</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            From AI tools to creative software — shop in USD, pay your way, receive instantly.
            Trusted by buyers across 3 continents.
          </p>

          {/* Natural Language Search Prompt */}
          <div className="relative max-w-2xl mb-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="glass-card rounded-2xl p-1 flex items-center gap-3 glow-cyan">
              <div className="flex-1 flex items-center gap-3 px-4 py-3">
                <Icon name="MagnifyingGlassIcon" size={20} className="text-primary flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={typedText + '|'}
                  className="flex-1 bg-transparent text-foreground text-sm outline-none placeholder-muted-foreground font-sans"
                  aria-label="Search digital products with natural language" />
                
              </div>
              <Link
                href={`/products${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`}
                className="btn-primary px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 flex-shrink-0">
                
                <Icon name="BoltIcon" size={16} variant="solid" />
                Find Product
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-2 ml-4">
              Ask in plain language — e.g., &quot;best tool for editing videos on a budget&quot;
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link href="/products" className="btn-primary px-8 py-4 rounded-full text-base font-bold flex items-center gap-2">
              <Icon name="ShoppingBagIcon" size={20} variant="solid" />
              Browse All 30 Products
            </Link>
            <a href="#payment-panel" className="btn-secondary px-8 py-4 rounded-full text-base font-semibold flex items-center gap-2">
              <Icon name="CreditCardIcon" size={20} />
              How to Pay
            </a>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-3 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            {FEATURED_CATEGORIES.map((cat) =>
            <Link
              key={cat.label}
              href={`/products?category=${cat.label}`}
              className="flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-border/60 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 group">
              
                <Icon name={cat.icon as 'SparklesIcon'} size={14} className="text-primary" />
                <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                  {cat.label}
                </span>
                <span className="text-xs font-mono text-primary/60">{cat.count}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="glass-nav border-t border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map((stat) =>
              <div key={stat.label} className="text-center">
                  <div className="font-mono-price text-2xl font-bold text-primary">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                    {stat.label}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>);

}