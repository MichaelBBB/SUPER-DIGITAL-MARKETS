import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/app/components/HeroSection';
import LiveSalesTracker from '@/app/components/LiveSalesTracker';
import FeaturedProducts from '@/app/components/FeaturedProducts';
import PaymentMethodsSection from '@/app/components/PaymentMethodsSection';
import HowToPayPanel from '@/app/components/HowToPayPanel';
import CtaSection from '@/app/components/CtaSection';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <HeroSection />
      <LiveSalesTracker />
      <FeaturedProducts />
      <PaymentMethodsSection />
      <HowToPayPanel />
      <CtaSection />
      <Footer />
    </main>
  );
}