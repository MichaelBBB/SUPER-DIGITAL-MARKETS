'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [country, setCountry] = useState('ZA');
  const [method, setMethod] = useState('peach');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productId) {
      supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()
        .then(({ data }) => setProduct(data));
    }
  }, [productId]);

  const handlePayment = async () => {
    if (!email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    
    setLoading(true);

    try {
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productId, 
          email, 
          country, 
          method, 
          amount: product.price_usd 
        })
      });

      const data = await res.json();
      
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else if (data.eftDetails) {
        alert(`Please make an EFT to:\nBank: ${data.eftDetails.bank}\nAccount: ${data.eftDetails.acc}\nReference: ${data.eftDetails.ref}`);
        router.push(`/success?orderId=${data.orderId}`);
      } else {
        router.push(`/success?orderId=${data.orderId}`);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center text-white">
        Loading checkout details...
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen p-6 text-white font-sans max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout: {product.name}</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* LEFT: Payment Selection */}
        <div className="space-y-4">
          <label className="block text-sm text-gray-400">Delivery Email</label>
          <input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="your@email.com" 
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500" 
          />

          <div className="grid grid-cols-2 gap-3 mt-6">
            {[
              { code: 'IN', name: 'Razorpay (India)', flag: '🇮🇳', val: 'razorpay' },
              { code: 'CN', name: 'Alipay (China)', flag: '🇨🇳', val: 'alipay' },
              { code: 'US', name: 'Payoneer (USA)', flag: '🇺🇸', val: 'payoneer' },
              { code: 'ZA', name: 'Peach Payments (SA)', flag: '🇿🇦', val: 'peach' },
              { code: 'ZA', name: 'Capitec EFT', flag: '🇿🇦', val: 'capitec' },
              { code: 'GLOBAL', name: 'Card / Google Pay', flag: '🌍', val: 'stripe' }
            ].map((opt) => (
              <button 
                key={opt.name} 
                onClick={() => { setCountry(opt.code); setMethod(opt.val); }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  method === opt.val 
                    ? 'border-cyan-500 bg-slate-800 ring-1 ring-cyan-500' 
                    : 'border-slate-700 bg-slate-900 hover:border-slate-500'
                }`}
              >
                <div className="text-2xl mb-1">{opt.flag}</div>
                <div className="text-sm font-medium">{opt.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 h-fit">
          <div className="flex gap-4 mb-4">
            <div className="w-20 h-20 bg-slate-800 rounded-lg flex items-center justify-center text-2xl">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-lg" />
              ) : '📦'}
            </div>
            <div>
              <h3 className="font-bold text-lg">{product.name}</h3>
              <p className="text-cyan-400 font-mono">${product.price_usd.toFixed(2)} USD</p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-gray-400 border-t border-slate-700 pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${product.price_usd.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Processing Fee</span>
              <span>$0.88</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-cyan-400 pt-2 border-t border-slate-700 mt-2">
              <span>Total</span>
              <span>${(product.price_usd + 0.88).toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            onClick={handlePayment} 
            disabled={loading} 
            className="w-full mt-6 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all"
          >
            {loading ? 'Processing...' : 'Complete Purchase'}
          </button>
        </div>
      </div>
    </div>
  );
}'use client';

import { useState } from 'react';
import PaymentTracker from '@/components/PaymentTracker';

const CHATGPT_PRODUCT = {
  id: 'prod_1',
  name: 'ChatGPT Plus',
  category: 'AI Tools',
  price: 20.00,
  image: 'https://cdn-icons-png.flaticon.com/512/6643/6643389.png'
};

export default function CheckoutPage() {
  const [isPaying, setIsPaying] = useState(false);

  return (
    <div className="min-h-screen bg-[#05080F] flex items-center justify-center p-4">
      {isPaying ? (
        <PaymentTracker 
          product={CHATGPT_PRODUCT} 
          processingFee={0.88}
          sessionId="sess_123456789" 
          whatsappNumber="27123456789" 
          onClose={() => setIsPaying(false)}
        />
      ) : (
        <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 text-white w-full max-w-[400px]">
           <h2 className="text-xl font-bold mb-6">Order Summary</h2>
           
           <div className="flex items-center gap-4 mb-6">
             <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden">
               <img src={CHATGPT_PRODUCT.image} alt="Product" className="w-full h-full object-cover" />
             </div>
             <div className="flex-1">
               <h3 className="text-white font-semibold text-sm">{CHATGPT_PRODUCT.name}</h3>
               <p className="text-slate-500 text-xs">{CHATGPT_PRODUCT.category}</p>
             </div>
             <div className="text-right">
               <p className="text-cyan-400 font-bold text-sm">${CHATGPT_PRODUCT.price.toFixed(2)}</p>
             </div>
           </div>

           <div className="space-y-2 text-sm mb-6">
            <div className="flex justify-between text-slate-400">
              <span>Processing fee</span>
              <span>$0.88</span>
            </div>
            <div className="flex justify-between text-white font-bold pt-2 border-t border-slate-800 mt-2">
              <span className="text-base">Total</span>
              <span className="text-cyan-400 text-lg">$20.88</span>
            </div>
          </div>

           <button 
             onClick={() => setIsPaying(true)}
             className="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-cyan-500/20"
           >
             Continue to Payment
           </button>
        </div>
      )}
    </div>
  );
}
