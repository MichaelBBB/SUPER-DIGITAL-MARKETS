import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CheckoutFlow from '@/app/checkout/components/CheckoutFlow';

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <CheckoutFlow />
      <Footer />
    </main>
  );
}