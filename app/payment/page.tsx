
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type Product = {
  id: string;
  name: string;
  price_usd: number;
};

type PaymentStatus = {
  status: string;
  amountUSD: number;
};

function PaymentContent() {
  const searchParams = useSearchParams();
  const item = searchParams?.get('item') || '';
  const sessionId = searchParams?.get('session_id') || '';

  const [product, setProduct] = useState<Product | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatus | null>(null);
  const [statusMessage, setStatusMessage] = useState(
    'Checking your payment status...'
  );

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  const upiId = process.env.NEXT_PUBLIC_UPI_ID || '';
  const alipayId = process.env.NEXT_PUBLIC_ALIPAY_ID || '';
  const bankName = process.env.NEXT_PUBLIC_CAPITEC_BANK_NAME || '';
  const accountName =
    process.env.NEXT_PUBLIC_CAPITEC_ACCOUNT_NAME || '';
  const accountNumber =
    process.env.NEXT_PUBLIC_CAPITEC_ACCOUNT_NUMBER || '';

  useEffect(() => {
    let cancelled = false;

    async function checkPaymentStatus() {
      if (!sessionId) return;

      try {
        const response = await fetch(
          `/api/payments/status?session_id=${encodeURIComponent(sessionId)}`,
          { cache: 'no-store' }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            typeof result.error === 'string'
              ? result.error
              : 'Unable to retrieve payment status.'
          );
        }

        if (!cancelled) {
          setPaymentStatus({
            status: String(result.status || 'pending'),
            amountUSD: Number(result.amountUSD || 0),
          });
          setStatusMessage('Payment status retrieved.');
        }
      } catch (err) {
        if (!cancelled) {
          setStatusMessage(
            err instanceof Error
              ? err.message
              : 'Unable to retrieve payment status.'
          );
        }
      }
    }

    void checkPaymentStatus();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      if (sessionId) {
        setLoading(false);
        return;
      }

      if (!item) {
        setError(
          'No product was selected. Please return to Products and choose an item.'
        );
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/products/lookup?name=${encodeURIComponent(item)}`,
          { cache: 'no-store' }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            typeof result.error === 'string'
              ? result.error
              : 'Unable to load the selected product.'
          );
        }

        const data = result.product as Product | undefined;

        if (
          !data ||
          !data.id ||
          !data.name ||
          !Number.isFinite(Number(data.price_usd))
        ) {
          throw new Error(
            'The product lookup returned an incomplete product record.'
          );
        }

        if (!cancelled) {
          setProduct({
            id: data.id,
            name: data.name,
            price_usd: Number(data.price_usd),
          });
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
  }, [item, sessionId]);

  async function payByCard() {
    if (!product) {
      setError('Please select a valid product before paying.');
      return;
    }

    if (
      !email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      setError('Please enter a valid email address.');
      return;
    }

    setPaying(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          email: email.trim(),
          method: 'peach',
          country: 'ZA',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof result.error === 'string'
            ? result.error
            : 'Unable to start checkout. Please try again.'
        );
      }

      if (
        typeof result.redirectUrl !== 'string' ||
        !result.redirectUrl
      ) {
        throw new Error(
          'The payment provider did not return a checkout link.'
        );
      }

      window.location.assign(result.redirectUrl);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to start checkout. Please try again.'
      );
      setPaying(false);
    }
  }

  if (sessionId) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-xl rounded-2xl border border-white/15 bg-white/5 p-8">
          <h1 className="text-3xl font-bold">Payment Status</h1>
          <p className="mt-4 text-slate-300">{statusMessage}</p>

          {paymentStatus && (
            <div className="mt-6 space-y-3">
              <p>
                Status:{' '}
                <strong className="capitalize">
                  {paymentStatus.status}
                </strong>
              </p>
              <p>
                Amount: ${paymentStatus.amountUSD.toFixed(2)} USD
              </p>
            </div>
          )}

          <a
            href="/"
            className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Return to Home
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Secure Payment
          </h1>
          <p className="mt-3 text-slate-300">
            Complete your purchase securely.
          </p>
        </header>

        <section className="rounded-2xl border border-white/15 bg-white/5 p-6 shadow-xl sm:p-8">
          <h2 className="text-xl font-semibold">Your Order</h2>

          {loading ? (
            <p className="mt-4 text-slate-300">
              Loading selected product...
            </p>
          ) : product ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-black/20 p-4">
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="mt-1 text-sm text-slate-300">
                  Digital product
                </p>
              </div>
              <p className="text-xl font-bold">
                ${product.price_usd.toFixed(2)} USD
              </p>
            </div>
          ) : null}

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-400/40 bg-red-950/40 p-4 text-red-200"
            >
              {error}
            </div>
          )}

          {message && (
            <p className="mt-4 rounded-xl bg-white/10 p-4 text-slate-200">
              {message}
            </p>
          )}

          <div className="mt-8 border-t border-white/15 pt-6">
            <h2 className="text-xl font-semibold">
              Pay securely by card
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Checkout is processed through Peach Payments.
            </p>

            <label
              htmlFor="payment-email"
              className="mt-5 block text-sm font-medium"
            >
              Email address
            </label>
            <input
              id="payment-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-xl border border-white/20 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-400"
            />

            <button
              type="button"
              onClick={payByCard}
              disabled={loading || paying || !product}
              className="mt-5 w-full rounded-xl bg-blue-600 px-6 py-4 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {paying
                ? 'Connecting to Peach Payments...'
                : 'Pay Now by Card'}
            </button>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">
            Other Payment Options
          </h2>

          {whatsapp && (
            <div className="mt-5 border-t border-white/10 pt-5">
              <h3 className="font-semibold">WhatsApp Assistance</h3>
              <p className="mt-2 text-sm text-slate-300">
                Contact us for help with your purchase.
              </p>
              <a
                href={`https://wa.me/${whatsapp.replace(/[^\d]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block rounded-xl bg-green-700 px-5 py-3 font-semibold hover:bg-green-600"
              >
                Contact Us on WhatsApp
              </a>
            </div>
          )}

          {upiId && (
            <div className="mt-5 border-t border-white/10 pt-5">
              <h3 className="font-semibold">Google Pay / UPI</h3>
              <p className="mt-2 text-slate-300">
                UPI ID: {upiId}
              </p>
            </div>
          )}

          {alipayId && (
            <div className="mt-5 border-t border-white/10 pt-5">
              <h3 className="font-semibold">Alipay</h3>
              <p className="mt-2 text-slate-300">
                Alipay payment reference: {alipayId}
              </p>
            </div>
          )}

          <div className="mt-5 border-t border-white/10 pt-5">
            <h3 className="font-semibold">Capitec Bank Transfer</h3>

            {bankName && accountName && accountNumber ? (
              <div className="mt-3 space-y-2 text-slate-200">
                <p>Bank: {bankName}</p>
                <p>Account name: {accountName}</p>
                <p>Account number: {accountNumber}</p>
                <p className="mt-3 text-sm text-slate-300">
                  Use your order details as the payment reference and
                  confirm receipt before delivery.
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-amber-200">
                Bank details have not been configured for display.
                Configure the verified Capitec display variables in
                Vercel before using this option.
              </p>
            )}
          </div>
        </section>

        <footer className="py-8 text-center text-sm text-slate-400">
          <a href="/" className="underline hover:text-white">
            Return to Home
          </a>
        </footer>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 px-6 py-12 text-center text-white">
          Loading secure payment page...
        </main>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
