
'use client';

import { Suspense, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

type Product = {
  id: string;
  name: string;
  price_usd: number;
  image_url?: string | null;
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const productId = searchParams?.get('productId') ?? null;
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [productLoading, setProductLoading] = useState(true);
  const [country, setCountry] = useState('ZA');
  const [method, setMethod] = useState('peach');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      setProductLoading(true);
      setError('');
      if (!productId) {
        setError('No product was selected. Please return to the store.');
        setProductLoading(false);
        return;
      }

      const { data, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (cancelled) return;
      if (productError || !data) {
        setError('We could not load this product. Please return to the store.');
        setProduct(null);
      } else {
        setProduct(data as Product);
      }

      setProductLoading(false);
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  const handlePayment = async () => {
    if (!product || loading) return;
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid delivery email address.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          email: email.trim(),
          country,
          method,
          amount: product.price_usd
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || 'The payment request could not be processed.'
        );
      }
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      if (data.eftDetails) {
        const details = data.eftDetails;

        alert(
          `Please make an EFT to:\n` +
          `Bank: ${details.bank}\n` +
          `Account: ${details.acc}\n` +
          `Reference: ${details.ref}`
        );

        if (data.orderId) {
          router.push(`/success?orderId=${encodeURIComponent(data.orderId)}`);
          return;
        }
        throw new Error(
          'Bank details were provided, but the order reference is missing.'
        );
      }

      if (data.orderId) {
        router.push(`/success?orderId=${encodeURIComponent(data.orderId)}`);
        return;
      }

      throw new Error(
        'The payment service did not return a checkout link or order reference.'
      );
    } catch (err) {
      console.error('Payment error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred. Please try again.'
      );

      setLoading(false);
    }
  };

  if (productLoading) {
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center text-white">
        Loading checkout details...
      </div>
    );
  }
  if (!product) {
    return (
      <div className="bg-slate-950 min-h-screen p-6 flex flex-col items-center justify-center text-white">
        <p className="text-center mb-4">
          {error || 'This product could not be found.'}
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-xl font-bold"
        >
          Return to Store
        </button>
      </div>
    );
  }
  return (
    <div className="bg-slate-950 min-h-screen p-6 text-white font-sans max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Checkout: {product.name}
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
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
                key={opt.name}
                type="button"
                onClick={() => {
                  setCountry(opt.code);
                  setMethod(opt.val);
                  setError('');
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
                ${product.price_usd.toFixed(2)} USD
              </p>
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
          {error && (
            <p role="alert" className="mt-4 text-sm text-red-400">
              {error}
            </p>
          )}
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
export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-slate-950 min-h-screen flex items-center justify-center text-white">
          Loading checkout...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
