
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type Product = {
  id: string;
  name: string;
  price_usd: number;
  image_url?: string | null;
};

type PaymentMethod = {
  code: string;
  name: string;
  flag: string;
  val: string;
};

const paymentMethods: PaymentMethod[] = [
  { code: 'IN', name: 'Razorpay (India)', flag: '🇮🇳', val: 'razorpay' },
  { code: 'CN', name: 'Alipay (China)', flag: '🇨🇳', val: 'alipay' },
  { code: 'US', name: 'Payoneer (USA)', flag: '🇺🇸', val: 'payoneer' },
  { code: 'ZA', name: 'Peach Payments (SA)', flag: '🇿🇦', val: 'peach' },
  { code: 'ZA', name: 'Capitec EFT', flag: '🇿🇦', val: 'capitec' },
  { code: 'GLOBAL', name: 'Card / Google Pay', flag: '🌍', val: 'stripe' },
];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get('productId');

  const [product, setProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [country, setCountry] = useState('ZA');
  const [method, setMethod] = useState('peach');
  const [email, setEmail] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      if (!productId) {
        setError('No product was selected. Please return to the products page and choose a product.');
        setLoadingProduct(false);
        return;
      }

      try {
        // Load Supabase in the browser instead of during page prerendering.
        const { supabase } = await import('@/lib/supabase');

        const { data, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (productError) {
          throw new Error(productError.message);
        }

        if (!data) {
          throw new Error('The selected product could not be found.');
        }

        if (!cancelled) {
          setProduct(data as Product);
          setError('');
        }
      } catch (err) {
        console.error('Checkout product loading error:', err);

        if (!cancelled) {
          setError(
            'We could not load this product. Please check the Supabase configuration and try again.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingProduct(false);
        }
      }
    }

    void loadProduct();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  async function handlePayment() {
    if (!product || !productId) {
      setError('The selected product is not available.');
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid delivery email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          email: email.trim(),
          country,
          method,
          amount: product.price_usd,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.error === 'string'
            ? data.error
            : 'The payment request could not be completed.'
        );
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      if (data.eftDetails) {
        const details = data.eftDetails;

        alert(
          `Please make an EFT to:\nBank: ${details.bank}\nAccount: ${details.acc}\nReference: ${details.ref}`
        );

        if (data.orderId) {
          router.push(`/success?orderId=${encodeURIComponent(data.orderId)}`);
          return;
        }

        throw new Error('Bank transfer details were returned without an order reference.');
      }

      if (data.orderId) {
        router.push(`/success?orderId=${encodeURIComponent(data.orderId)}`);
        return;
      }

      throw new Error(
        'The payment service returned no checkout link or order reference. No successful payment has been confirmed.'
      );
    } catch (err) {
      console.error('Payment error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while starting the payment. Please try again.'
      );
      setLoading(false);
    }
  }

  if (loadingProduct) {
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center text-white p-6">
        Loading checkout details...
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center text-white p-6">
        <div className="max-w-lg w-full rounded-2xl border border-red-500/30 bg-slate-900 p-6">
          <h1 className="text-xl font-bold mb-3">Checkout unavailable</h1>
          <p className="text-red-300 mb-5">{error}</p>
          <button
            onClick={() => router.push('/products')}
            className="bg-cyan-600 hover:bg-cyan-500 rounded-xl px-5 py-3 font-bold"
          >
            Return to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center text-white p-6">
        The selected product is unavailable.
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen p-6 text-white font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          Checkout: {product.name}
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label htmlFor="delivery-email" className="block text-sm text-gray-400">
              Delivery Email
            </label>

            <input
              id="delivery-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="your@email.com"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500"
            />

            <div className="grid grid-cols-2 gap-3 mt-6">
              {paymentMethods.map((option) => (
                <button
                  type="button"
                  key={option.val}
                  onClick={() => {
                    setCountry(option.code);
                    setMethod(option.val);
                  }}
                  aria-pressed={method === option.val}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    method === option.val
                      ? 'border-cyan-500 bg-slate-800 ring-1 ring-cyan-500'
                      : 'border-slate-700 bg-slate-900 hover:border-slate-500'
                  }`}
                >
                  <div className="text-2xl mb-1">{option.flag}</div>
                  <div className="text-sm font-medium">{option.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 h-fit">
            <div className="flex gap-4 mb-4">
              <div className="w-20 h-20 shrink-0 bg-slate-800 rounded-lg flex items-center justify-center text-2xl overflow-hidden">
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
                <h2 className="font-bold text-lg">{product.name}</h2>
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

            {error && (
              <p role="alert" className="mt-4 text-sm text-red-300">
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
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-slate-950 min-h-screen flex items-center justify-center text-white p-6">
          Loading checkout...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
