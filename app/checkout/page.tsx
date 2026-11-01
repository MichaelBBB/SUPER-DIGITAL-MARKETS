
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const productId = searchParams?.get('productId') ?? null;
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [country, setCountry] = useState('ZA');
  const [method, setMethod] = useState('peach');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      return;
    }

    let cancelled = false;

    async function loadProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (cancelled) return;

      if (error) {
        console.error('Product loading error:', error);
        setProduct(null);
        return;
      }

      setProduct(data);
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  const handlePayment = async () => {
    if (!email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!product || !productId) {
      alert('Product details are not available. Please return to the products page and try again.');
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

      if (!res.ok) {
        throw new Error(data.error || 'Payment could not be started.');
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      if (data.eftDetails) {
        alert(
          `Please make an EFT to:\nBank: ${data.eftDetails.bank}\nAccount: ${data.eftDetails.acc}\nReference: ${data.eftDetails.ref}`
        );

        if (data.orderId) {
          router.push(`/success?orderId=${encodeURIComponent(data.orderId)}`);
        } else {
          setLoading(false);
        }

        return;
      }

      if (data.orderId) {
        router.push(`/success?orderId=${encodeURIComponent(data.orderId)}`);
        return;
      }

      throw new Error('The payment service did not return a valid response.');
    } catch (error) {
      console.error('Payment error:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'An error occurred. Please try again.'
      );
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center text-white p-6">
        <div className="text-center">
          <p className="text-lg mb-3">Unable to load checkout details.</p>
          <p className="text-sm text-slate-400">
            Please return to the products page and select a product again.
          </p>
          <button
            onClick={() => router.push('/')}
            className="mt-5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-5 py-3 rounded-xl"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen p-6 text-white font-sans max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Checkout: {product.name}
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* LEFT: Payment Selection */}
        <div className="space-y-4">
          <label className="block text-sm text-gray-400">
            Delivery Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            autoComplete="email"
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
                type="button"
                key={opt.name}
                onClick={() => {
                  setCountry(opt.code);
                  setMethod(opt.val);
                }}
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
            <div className="w-20 h-20 bg-slate-800 rounded-lg flex items-center justify-center text-2xl overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                '📦'
              )}
            </div>

            <div>
              <h3 className="font-bold text-lg">{product.name}</h3>
              <p className="text-cyan-400 font-mono">
                ${Number(product.price_usd).toFixed(2)} USD
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-400 border-t border-slate-700 pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${Number(product.price_usd).toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Processing Fee</span>
              <span>$0.88</span>
            </div>

            <div className="flex justify-between text-lg font-bold text-cyan-400 pt-2 border-t border-slate-700 mt-2">
              <span>Total</span>
              <span>
                ${(Number(product.price_usd) + 0.88).toFixed(2)}
              </span>
            </div>
          </div>

          <button
            type="button"
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
}
