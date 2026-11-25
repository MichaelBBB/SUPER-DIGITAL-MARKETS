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
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [statusMessage, setStatusMessage] = useState('Checking your payment status...');

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  const upiId = process.env.NEXT_PUBLIC_UPI_ID || '';
  const alipayId = process.env.NEXT_PUBLIC_ALIPAY_ID || '';
  const bankName = process.env.NEXT_PUBLIC_CAPITEC_BANK_NAME || '';
  const accountName = process.env.NEXT_PUBLIC_CAPITEC_ACCOUNT_NAME || '';
  const accountNumber = process.env.NEXT_PUBLIC_CAPITEC_ACCOUNT_NUMBER || '';

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
          throw new Error(typeof result.error === 'string' ? result.error : 'Unable to retrieve payment status.');
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
          setStatusMessage(err instanceof Error ? err.message : 'Unable to retrieve payment status.');
        }
      }
    }

    void checkPaymentStatus();
    return () => { cancelled = true; };
  }, [sessionId]);

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      if (sessionId) {
        setLoading(false);
        return;
      }
      if (!item) {
        setError('No product was selected. Please return to Products and choose an item.');
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
          const missing = Array.isArray(result.missing) ? ` Missing settings: ${result.missing.join(', ')}.` : '';
          throw new Error((typeof result.error === 'string' ? result.error : 'Unable to load the selected product.') + missing);
        }

        const data = result.product as Product | undefined;
        if (!data || !data.id || !data.name || !Number.isFinite(Number(data.price_usd))) {
          throw new Error('The product lookup returned an incomplete product record.');
        }
        if (!cancelled) {
          setProduct({ id: data.id, name: data.name, price_usd: Number(data.price_usd) });
          setError('');
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unable to load the selected product.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadProduct();
    return () => { cancelled = true; };
  }, [item, sessionId]);

  async function payByCard() {
    if (!product) {
      setError('Please select a valid product before paying.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setPaying(true);
    setError('');
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
        const details = typeof result.details === 'string' ? ` ${result.details}` : '';
        throw new Error((typeof result.error === 'string' ? result.error : 'Unable to start checkout. Please try again.') + details);
      }
      if (typeof result.redirectUrl !== 'string' || !result.redirectUrl.startsWith('https://')) {
        throw new Error('The payment provider did not return a valid secure checkout link.');
      }
      window.location.assign(result.redirectUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to start checkout. Please try again.');
      setPaying(false);
    }
  }

  if (sessionId) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-950 to-cyan-950 px-5 py-12 text-white">
        <div className="mx-auto max-w-xl rounded-3xl border border-cyan-300/30 bg-slate-900/80 p-8 shadow-2xl">
          <div className="mb-5 inline-flex rounded-full bg-cyan-400/15 px-4 py-2 text-sm font-bold text-cyan-200">ORDER UPDATE</div>
          <h1 className="text-3xl font-black">Payment Status</h1>
          <p className="mt-4 text-slate-300">{statusMessage}</p>
          {paymentStatus && (
            <div className="mt-6 rounded-2xl bg-gradient-to-r from-blue-950 to-violet-950 p-5">
              <p>Status: <strong className="capitalize">{paymentStatus.status}</strong></p>
              <p className="mt-2">Amount: ${paymentStatus.amountUSD.toFixed(2)} USD</p>
            </div>
          )}
          <a href="/" className="mt-8 inline-block rounded-xl bg-cyan-500 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-300">Return to Home</a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 py-8 text-white sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 text-center">
          <div className="mb-3 inline-flex rounded-full border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.22em] text-cyan-200">Super Digital Markets</div>
          <h1 className="bg-gradient-to-r from-cyan-300 via-blue-300 to-fuchsia-300 bg-clip-text text-3xl font-black text-transparent sm:text-5xl">Choose How You Pay</h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">Secure checkout for your digital products. Prices are shown in USD.</p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-2xl backdrop-blur">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 sm:p-8">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-100">Your Order</p>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">{loading ? 'Loading your product…' : product?.name || 'Order details'}</h2>
              <p className="mt-2 text-blue-100">Instant digital delivery after payment confirmation.</p>
            </div>
            <div className="p-6 sm:p-8">
              {loading ? (
                <p className="text-slate-300">Loading selected product…</p>
              ) : product ? (
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-cyan-300/20 bg-slate-950/60 p-5">
                  <div>
                    <p className="font-bold">{product.name}</p>
                    <p className="mt-1 text-sm text-slate-400">Digital product</p>
                  </div>
                  <p className="whitespace-nowrap text-2xl font-black text-cyan-300">${product.price_usd.toFixed(2)} <span className="text-xs">USD</span></p>
                </div>
              ) : (
                <p className="text-slate-300">Select a product from the Products page to begin checkout.</p>
              )}

              {error && <div role="alert" className="mt-5 break-words rounded-xl border border-red-400/40 bg-red-950/60 p-4 text-sm text-red-100">{error}</div>}

              <label htmlFor="payment-email" className="mt-7 block text-sm font-bold text-slate-200">Email address for your order</label>
              <input
                id="payment-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-white/20 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
              />

              <button
                type="button"
                onClick={payByCard}
                disabled={loading || paying || !product}
                className="mt-5 w-full rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 px-6 py-4 text-lg font-black text-white shadow-lg shadow-blue-950/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {paying ? 'Connecting securely to Peach…' : 'Pay Securely by Card'}
              </button>
              <p className="mt-3 text-center text-xs text-slate-400">Card checkout is handled by Peach Payments. Your card details are entered on Peach’s secure checkout page.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-green-300/25 bg-gradient-to-br from-green-950/80 to-emerald-900/40 p-6 shadow-xl">
              <div className="mb-3 inline-flex rounded-full bg-green-400/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-200">Green • Assistance</div>
              <h2 className="text-xl font-black">WhatsApp Assistance</h2>
              <p className="mt-2 text-sm text-green-100/80">Contact us if you need help with your purchase.</p>
              {whatsapp ? (
                <a href={`https://wa.me/${whatsapp.replace(/[^\d]/g, '')}`} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-xl bg-green-500 px-5 py-3 font-bold text-green-950 hover:bg-green-300">Chat on WhatsApp</a>
              ) : <p className="mt-3 text-sm text-green-100/70">WhatsApp contact is not configured.</p>}
            </div>

            <div className="rounded-3xl border border-amber-300/25 bg-gradient-to-br from-amber-950/80 to-orange-900/40 p-6 shadow-xl">
              <div className="mb-3 inline-flex rounded-full bg-amber-300/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-200">Yellow • UPI</div>
              <h2 className="text-xl font-black">Google Pay / UPI</h2>
              <p className="mt-2 text-sm text-amber-100/80">Coming soon. Google Pay / UPI payments are not available yet. Please use the secure Peach Payments checkout above.</p>
            </div>

            <div className="rounded-3xl border border-rose-300/25 bg-gradient-to-br from-rose-950/80 to-red-900/40 p-6 shadow-xl">
              <div className="mb-3 inline-flex rounded-full bg-rose-300/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-200">Red • Alipay</div>
              <h2 className="text-xl font-black">Alipay</h2>
              <p className="mt-2 text-sm text-rose-100/80">Coming soon. Alipay merchant onboarding and payment integration are not yet complete. Please use the secure Peach Payments checkout above.</p>
            </div>

            <div className="rounded-3xl border border-sky-300/25 bg-gradient-to-br from-sky-950/80 to-blue-900/40 p-6 shadow-xl">
              <div className="mb-3 inline-flex rounded-full bg-sky-300/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-200">Blue • Bank Transfer</div>
              <h2 className="text-xl font-black">Capitec Bank Transfer</h2>
              {bankName && accountName && accountNumber ? (
                <div className="mt-3 space-y-2 break-words text-sm text-sky-100">
                  <p>Bank: <strong>{bankName}</strong></p>
                  <p>Account name: <strong>{accountName}</strong></p>
                  <p>Account number: <strong>{accountNumber}</strong></p>
                  <p className="pt-2 text-xs text-sky-100/70">Bank transfers require manual confirmation before an order can be marked paid or delivered.</p>
                </div>
              ) : <p className="mt-2 text-sm text-sky-100/80">Verified Capitec display details have not been configured.</p>}
            </div>
          </div>
        </section>

        <footer className="py-8 text-center text-sm text-slate-400">
          <a href="/" className="underline decoration-cyan-400 underline-offset-4 hover:text-white">Return to Home</a>
        </footer>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-950 px-6 py-12 text-center text-white">Loading secure payment page…</main>}>
      <PaymentContent />
    </Suspense>
  );
}
