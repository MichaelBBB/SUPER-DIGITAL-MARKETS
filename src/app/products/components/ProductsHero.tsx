import React from 'react';
import AppImage from '@/components/ui/AppImage';

export default function ProductsHero() {
  return (
    <section className="relative pt-24 pb-12 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <AppImage
          src="https://img.rocket.new/generatedImages/rocket_gen_img_100aedebf-1772378258758.png"
          alt="Deep space galaxy with stars and nebula in dark blue and purple tones"
          fill
          priority
          className="object-cover object-center opacity-30"
          sizes="100vw" />
        
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <span className="text-xs font-bold text-primary tracking-widest uppercase block mb-3">
          Complete Catalog
        </span>
        <h1 className="text-hero-xl font-extrabold text-foreground mb-4">
          All <span className="text-gradient-cyan">30 Products</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Every top digital product in one place. Filter by category, pay in your currency.
        </p>
      </div>
    </section>);

}