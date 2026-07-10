'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const products = [
  { id: 1, name: "ChatGPT Plus", price: 20.00 },
  { id: 2, name: "Adobe Creative Cloud", price: 54.99 },
  { id: 3, name: "Netflix Premium", price: 22.99 },
  { id: 4, name: "Microsoft 365 Business", price: 12.50 },
  { id: 5, name: "Spotify Premium", price: 9.99 },
  { id: 6, name: "NordVPN", price: 3.99 },
  { id: 7, name: "Notion Plus", price: 8.00 },
  { id: 8, name: "Figma Professional", price: 12.00 },
  { id: 9, name: "Dropbox Plus", price: 9.99 },
  { id: 10, name: "Canva Pro", price: 12.99 },
  { id: 11, name: "Grammarly Premium", price: 12.00 },
  { id: 12, name: "Zoom Pro", price: 14.99 },
  { id: 13, name: "LastPass Premium", price: 3.00 },
  { id: 14, name: "Cursor AI Pro", price: 20.00 },
  { id: 15, name: "Midjourney Standard", price: 24.00 },
  { id: 16, name: "GitHub Copilot", price: 10.00 },
  { id: 17, name: "Slack Pro", price: 7.25 },
  { id: 18, name: "Dashlane Premium", price: 4.99 },
  { id: 19, name: "Adobe Photoshop", price: 22.99 },
  { id: 20, name: "Claude Pro", price: 20.00 },
  { id: 21, name: "Adobe Premiere Pro", price: 22.99 },
  { id: 22, name: "Asana Premium", price: 10.99 },
  { id: 23, name: "ExpressVPN", price: 6.67 },
  { id: 24, name: "YouTube Premium", price: 13.99 },
  { id: 25, name: "1Password", price: 2.99 },
  { id: 26, name: "Monday.com Pro", price: 9.00 },
  { id: 27, name: "Perplexity Pro", price: 20.00 },
  { id: 28, name: "Loom Business", price: 12.50 },
  { id: 29, name: "Webflow CMS", price: 14.00 },
  { id: 30, name: "ElevenLabs Starter", price: 5.00 }
];

function CheckoutInner() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');
  const product = products.find(p => p.id === Number(productId));
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('capitec');

  if (!product) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center"><p className="text-red-400">Product not found</p></div>;
  }

  const handlePeachPayment = async () => {
    setProcessing(true);
    try {
      const res = await fetch('/api/peach-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: product.price, orderId: `SD-${product.id}` })
      });
      
      const data = await res.json();
      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert(`❌ Payment Error: ${data.error || data.message}`);
      }
    } catch (e) {
      alert('Failed to connect to payment server.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCapitecPayment = async () => {
    setProcessing(true);
    try {
      const res = await fetch('/api/payment/capitec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: product.price, orderId: `SD-${product.id}`, productName: product.name })
      });
      
      const data = await res.json();
      if (data.success) {
        alert('✅ Payment recorded! Product will be delivered within 2 hours.');
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (e) {
      alert('Failed to connect to server.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-cyan-400 mb-6 block">← Back to Products</Link>
        <h1 className="text-3xl font-bold mb-6">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="space-y-3">
            <button onClick={() => setSelectedMethod('razorpay')} className={`w-full p-4 rounded-xl border-2 transition text-left ${selectedMethod === 'razorpay' ? 'border-cyan-500 bg-slate-900' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}>
              <div className="flex items-center gap-3"><span className="text-2xl">🇮🇳</span><div><div className="font-bold">Razorpay</div><div className="text-xs text-blue-400">INDIA PRIMARY</div></div></div>
            </button>

            <button onClick={() => setSelectedMethod('alipay')} className={`w-full p-4 rounded-xl border-2 transition text-left ${selectedMethod === 'alipay' ? 'border-cyan-500 bg-slate-900' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}>
              <div className="flex items-center gap-3"><span className="text-2xl">🇳</span><div><div className="font-bold">Alipay</div><div className="text-xs text-blue-400">CHINA PRIMARY</div></div></div>
            </button>

            <button onClick={() => setSelectedMethod('payoneer')} className={`w-full p-4 rounded-xl border-2 transition text-left ${selectedMethod === 'payoneer' ? 'border-cyan-500 bg-slate-900' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}>
              <div className="flex items-center gap-3"><span className="text-2xl">🇺🇸</span><div><div className="font-bold">Payoneer</div><div className="text-xs text-red-400">USA PRIMARY</div></div></div>
            </button>

            <button onClick={() => setSelectedMethod('googlepay')} className={`w-full p-4 rounded-xl border-2 transition text-left ${selectedMethod === 'googlepay' ? 'border-cyan-500 bg-slate-900' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}>
              <div className="flex items-center gap-3"><span className="text-2xl"></span><div><div className="font-bold">Google Pay</div><div className="text-xs text-blue-400">GLOBAL</div></div></div>
            </button>

            <button onClick={() => setSelectedMethod('peach')} className={`w-full p-4 rounded-xl border-2 transition text-left ${selectedMethod === 'peach' ? 'border-cyan-500 bg-slate-900' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}>
              <div className="
