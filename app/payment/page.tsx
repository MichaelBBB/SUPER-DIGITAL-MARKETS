
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type Product = {
  id: string;
  name: string;
  price_usd: number;
};

function PaymentContent() {
  const searchParams = useSearchParams();
  const item = searchParams?.get('item') || '';

  const [product, setProduct] = useState<Product | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  const upiId = process.env.NEXT_PUBLIC_UPI_ID || '';
  const alipayId = process.env.NEXT_PUBLIC_ALIPAY_ID || '';
  const bankName = process.env.NEXT_PUBLIC_CAPITEC_BANK_NAME || '';
  const accountName = process.env.NEXT_PUBLIC_CAPITEC_ACCOUNT_NAME || '';
  const accountNumber = process.env.NEXT_PUBLIC_CAPITEC_ACCOUNT_NUMBER || '';

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      if (!item) {
        setError('No product was selected. Please return to Products.');
        setLoading(false);
        return;
      }

      try {
        const { supabase } = await import('@/lib/supabase');

        const { data, error: lookupError } = await supabase
          .from('products')
          .select('id, name, price_usd')
          .eq('name', item)
          .maybeSingle();

        if (lookupError) {
          throw lookupError;
        }

        if (!data) {
          throw new Error(
            'This product is not yet listed in the payment database. Please contact the store before paying.'
          );
        }

        if (!cancelled) {
          setProduct(data as Product);
          setError('');
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load the selected product.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProduct();

    return () => {
      cancelled = true;
    };
  }, [item]);

  async function payByCard() {
    if (!product) {
      setError('The selected product is unavailable.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address for your order.');
      return;
    }

    setPaying(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          email: email.trim(),
          method: 'peach',
          country: 'ZA',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.error === 'string'
            ? data.error
            : 'Peach Payments could not start checkout.'
        );
      }

      if (
        !data.redirectUrl ||
        typeof data.redirectUrl !== 'string' ||
        !data.redirectUrl.startsWith('https://')
      ) {
        throw new Error('Peach did not return a valid checkout link.');
      }

      window.location.href = data.redirectUrl;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to start card payment. Please try again.'
      );
      setPaying(false);
    }
  }

  async function copyValue(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setMessage(`${label} copied.`);
      setError('');
    } catch {
      setMessage(`Please copy this ${label}: ${value}`);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black p-8 text-white">
        Loading payment details...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-2 text-white sm:p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-3 text-2xl font-bold text-cyan-400 sm:text-3xl">
          Secure Payment
        </h1>

        {product && (
          <div className="mb-6 border border-slate-700 bg-slate-900 p-4">
            <p className="text-gray-300">Selected product</p>
            <p className="text-xl font-semibold">{product.name}</p>
            <p className="text-lg text-cyan-300">
              US${Number(product.price_usd).toFixed(2)}
            </p>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-5 border border-red-500 bg-red-950 p-4 text-red-200"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="mb-5 border border-cyan-500 bg-slate-800 p-4 text-cyan-200"
          >
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <section className="border border-slate-700 bg-slate-900 p-6">
            <h2 className="mb-4 text-xl text-cyan-400">
              💳 Card Payment
            </h2>
            <p className="mb-4 text-sm text-gray-400">
              Visa / Mastercard. Checkout is handled by Peach Payments.
            </p>

            <label
              htmlFor="delivery-email"
              className="mb-2 block text-sm"
            >
              Delivery email address
            </label>

            <input
              id="delivery-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="mb-4 w-full border border-slate-600 bg-black p-3 text-white"
            />

            <button
              type="button"
              onClick={payByCard}
              disabled={!product || paying}
              className="w-full bg-cyan-600 p-4 font-semibold hover:bg-cyan-500 disabled:opacity-50"
            >
              {paying ? 'Connecting to Peach...' : 'Pay Now by Card'}
            </button>
          </section>

          <section className="border border-slate-700 bg-slate-900 p-6">
            <h2 className="mb-4 text-xl text-green-400">
              💬 WhatsApp
            </h2>
            <p className="mb-6 text-sm text-gray-400">
              Contact the store to arrange your order.
            </p>

            {whatsapp ? (
              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                  `Hello, I would like to order ${product?.name || item} for US$${
                    product
                      ? Number(product.price_usd).toFixed(2)
                      : ''
                  }.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="block bg-green-600 p-4 text-center font-semibold hover:bg-green-500"
              >
                Open WhatsApp to Chat
              </a>
            ) : (
              <p className="text-sm text-amber-300">
                WhatsApp is not activated yet. The store&apos;s real WhatsApp
                number must be configured.
              </p>
            )}
          </section>

          <section className="bg-yellow-400 p-6 text-black">
            <h2 className="mb-4 text-xl">
              🇮🇳 Google Pay (India)
            </h2>
            <p className="mb-6 text-sm">
              Copy the store&apos;s UPI ID.
            </p>

            {upiId ? (
              <button
                type="button"
                onClick={() => copyValue(upiId, 'UPI ID')}
                className="w-full bg-black p-4 font-semibold text-white"
              >
                Copy UPI ID
              </button>
            ) : (
              <p className="text-sm font-semibold">
                UPI ID must be configured before accepting payments.
              </p>
            )}
          </section>

          <section className="bg-red-600 p-6 text-white">
            <h2 className="mb-4 text-xl">
              🇨🇳 Alipay (China)
            </h2>
            <p className="mb-6 text-sm">
              Copy the store&apos;s Alipay ID.
            </p>

            {alipayId ? (
              <button
                type="button"
                onClick={() => copyValue(alipayId, 'Alipay ID')}
                className="w-full bg-white p-4 font-semibold text-red-700"
              >
                Copy Alipay ID
              </button>
            ) : (
              <p className="text-sm font-semibold">
                Alipay ID must be configured before accepting payments.
              </p>
            )}
          </section>
        </div>

        <section className="mt-8 border border-slate-700 bg-slate-900 p-6">
          <h2 className="mb-4 text-xl text-cyan-400">
            🏦 CAPITEC BANK DETAILS
          </h2>

          {bankName && accountName && accountNumber ? (
            <div className="space-y-2 text-gray-200">
              <p>Bank: {bankName}</p>
              <p>Account holder: {accountName}</p>
              <p>Account number: {accountNumber}</p>
              <p className="text-sm text-amber-300">
                Please wait for confirmation of cleared funds before treating
                an order as paid.
              </p>
            </div>
          ) : (
            <p className="text-gray-300">
              Bank details have not been configured for display. Add the
              verified account details in Vercel environment variables before
              using this option.
            </p>
          )}
        </section>

        <div className="mt-8 text-center">
          <a href="/products" className="text-cyan-300 underline">
            Return to Products
          </a>
        </div>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black p-8 text-white">
          Loading payment page...
        </main>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
