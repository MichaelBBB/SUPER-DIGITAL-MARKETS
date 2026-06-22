import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductsGrid from '@/app/products/components/ProductsGrid';
import ProductsHero from '@/app/products/components/ProductsHero';

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <ProductsHero />
      <ProductsGrid />
      <Footer />
    </main>
  );
}