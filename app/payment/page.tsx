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
  const orderReference = searchParams?.get('reference') || '';

  const [product, setProduct] = useState<Product | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [statusMessage, setStatusMessage] = useState('Checking your payment status...');

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  const bankName = process.env.NEXT_PUBLIC_CAPITEC_BANK_NAME || '';
  const accountName = process.env.NEXT_PUBLIC_CAPITEC_ACCOUNT_NAME || '';
  const accountNumber = process.env.NEXT_PUBLIC_CAPITEC_ACCOUNT_NUMBER || '';
  const branchCode = process.env.NEXT_PUBLIC_CAPITEC_BRANCH_CODE || '';
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || '';

  const whatsappUrl = whatsapp
    ? `https://wa.me/${whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
        `Hello SUPER DIGITAL MARKETS, I need help paying for ${product?.name || item || 'a digital product'}.`
      )}`
    : '';

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
      <main className="min-h-screen bg-black px-5 py-12 text-white">
        <div className="mx-auto max-w-xl rounded-xl border border-cyan-300/20 bg-slate-900 p-8">
          <div className="mb-5 inline-flex rounded-full bg-cyan-400/15 px-4 py-2 text-sm font-bold text-cyan-200">ORDER UPDATE</div>
          <h1 className="text-3xl font-black">Payment Status</h1>
          <p className="mt-4 text-slate-300">{statusMessage}</p>
          {paymentStatus && (
            <div className="mt-6 rounded-xl bg-slate-950 p-5">
              <p>Status: <strong className="capitalize">{paymentStatus.status}</strong></p>
              <p className="mt-2">Amount: ${paymentStatus.amountUSD.toFixed(2)} USD</p>
            </div>
          )}
          <a href="/" className="mt-8 inline-block rounded-lg bg-cyan-500 px-6 py-3 font-bold text-slate-950">Return to Home</a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-3 py-5 text-white sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-300">SUPER DIGITAL MARKETS</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">Choose How You Pay</h1>
          <p className="mt-2 text-slate-300">Secure payment options for your digital products. Prices are shown in USD.</p>
        </header>

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-xl font-medium text-cyan-300">💳 Card Payment</h2>
            <p className="mt-4 text-sm text-slate-300">Visa / Mastercard accepted through secure Peach Payments checkout.</p>
            <label htmlFor="payment-email" className="mt-4 block text-sm text-slate-300">Email address for your order</label>
            <input
              id="payment-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full border border-slate-600 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-400"
            />
            {product && <p className="mt-3 text-sm text-slate-300">Order: <strong>{product.name}</strong> — ${product.price_usd.toFixed(2)} USD</p>}
            <button
              type="button"
              onClick={payByCard}
              disabled={loading || paying || !product}
              className="mt-4 w-full bg-cyan-600 px-4 py-3 font-medium text-white hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {paying ? 'Connecting to Peach…' : 'Pay Now by Card'}
            </button>
          </div>

          <div className="border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-xl font-medium text-green-400">💬 WhatsApp</h2>
            <p className="mt-4 text-sm text-slate-300">Contact us for purchase assistance or a secure payment link.</p>
            {whatsappUrl ? (
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-6 block bg-green-600 px-4 py-3 text-center font-medium text-white hover:bg-green-500">Open WhatsApp to Chat</a>
            ) : (
              <p className="mt-6 border border-green-700/60 bg-slate-950 p-3 text-sm text-slate-300">WhatsApp contact details have not yet been configured.</p>
            )}
          </div>

          <div className="border-t-8 border-yellow-400 bg-yellow-400 p-6 text-slate-950">
            <h2 className="text-xl font-medium">🇮🇳 Google Pay / UPI (India)</h2>
            <p className="mt-4 text-sm">For customers in India. Google Pay / UPI must be enabled through an eligible merchant payment provider.</p>
            {whatsappUrl ? (
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-5 block bg-black px-4 py-3 text-center font-medium text-white hover:bg-slate-800">Ask About Google Pay / UPI</a>
            ) : (
              <p className="mt-5 bg-black/10 p-3 text-sm">Please use secure Peach card checkout while merchant eligibility is confirmed.</p>
            )}
            <p className="mt-3 text-center text-xs">No unverified UPI ID is displayed or copied.</p>
          </div>

          <div className="border-t-8 border-red-600 bg-red-600 p-6 text-white">
            <h2 className="text-xl font-medium">🇨🇳 Alipay / WeChat Pay (China)</h2>
            <p className="mt-4 text-sm">For customers in China. Merchant onboarding and supported payment processing must be confirmed before accepting payments.</p>
            {whatsappUrl ? (
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-5 block bg-white px-4 py-3 text-center font-medium text-red-700 hover:bg-red-50">Ask About Alipay / WeChat Pay</a>
            ) : (
              <p className="mt-5 bg-black/10 p-3 text-sm">Please use secure Peach card checkout while merchant eligibility is confirmed.</p>
            )}
            <p className="mt-3 text-center text-xs">No unverified Alipay ID or QR code is displayed.</p>
          </div>
        </section>

        <section className="mt-8 border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-xl font-medium text-cyan-300">🇿🇦 CAPITEC BANK DETAILS</h2>
          {bankName && accountName && accountNumber ? (
            <>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-slate-950 p-4"><p className="text-xs text-slate-400">Bank</p><p className="mt-1 font-medium">{bankName}</p></div>
                <div className="bg-slate-950 p-4"><p className="text-xs text-slate-400">Account Holder</p><p className="mt-1 font-medium">{accountName}</p></div>
                <div className="bg-slate-950 p-4"><p className="text-xs text-slate-400">Account Number</p><p className="mt-1 break-all font-medium text-cyan-300">{accountNumber}</p></div>
                <div className="bg-slate-950 p-4"><p className="text-xs text-slate-400">Branch Code</p><p className="mt-1 font-medium">{branchCode || 'Confirm with Capitec'}</p></div>
              </div>
              <p className="mt-4 text-sm text-slate-300">Use your order reference in the bank transfer description. Bank transfers must be verified before an order is marked paid or digital products are delivered.</p>
              {orderReference && <p className="mt-2 text-sm">Order reference: <strong className="text-yellow-300">{orderReference}</strong></p>}
            </>
          ) : (
            <p className="mt-3 text-sm text-slate-300">Bank details will appear here when the verified Capitec display details are configured in Vercel.</p>
          )}
        </section>

        {error && <div role="alert" className="mt-5 break-words border border-red-500 bg-red-950 p-4 text-sm text-red-100">{error}</div>}

        <footer className="py-8 text-center text-sm text-slate-400">
          <a href="/" className="underline underline-offset-4 hover:text-white">Return to Home</a>
          {supportEmail && <p className="mt-2">Support: {supportEmail}</p>}
        </footer>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-black px-6 py-12 text-center text-white">Loading secure payment page…</main>}>
      <PaymentContent />
    </Suspense>
  );
}
