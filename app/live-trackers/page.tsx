
'use client';

import { useCallback, useEffect, useState } from 'react';

type Sale = {
  product_name?: string | null;
  amount_usd?: number | string | null;
  status?: string | null;
  created_at?: string | null;
};

type SalesResponse = {
  sales?: Sale[];
  count?: number;
  revenueUSD?: number;
  error?: string;
};

const fmt = (n: number) =>
  n.toLocaleString('en-US', {
    maximumFractionDigits: 2,
  });

const MARKETS = [
  {
    code: 'ZA',
    flag: '🇿🇦',
    name: 'South Africa',
    tz: 'Africa/Johannesburg',
    city: 'Johannesburg',
    population: '45 000 000',
  },
  {
    code: 'US',
    flag: '🇺🇸',
    name: 'USA',
    tz: 'America/New_York',
    city: 'New York',
    population: '350 000 000',
  },
  {
    code: 'IN',
    flag: '🇮🇳',
    name: 'India',
    tz: 'Asia/Kolkata',
    city: 'Delhi',
    population: '1 400 000 000',
  },
  {
    code: 'CN',
    flag: '🇨🇳',
    name: 'China',
    tz: 'Asia/Shanghai',
    city: 'Beijing',
    population: '1 400 000 000',
  },
];

export default function LiveTrackersPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [count, setCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [now, setNow] = useState(new Date());
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSales = useCallback(async () => {
    try {
      const response = await fetch('/api/payments/status?mode=sales', {
        cache: 'no-store',
      });

      const result = (await response.json()) as SalesResponse;

      if (!response.ok) {
        throw new Error(
          result.error || 'Unable to load completed payments.'
        );
      }

      const completedSales = Array.isArray(result.sales)
        ? result.sales
        : [];

      setSales(completedSales);
      setCount(Number(result.count ?? completedSales.length));
      setRevenue(Number(result.revenueUSD ?? 0));
      setLastUpdate(new Date());
      setError('');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load completed payments.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSales();

    const clockInterval = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    const salesInterval = window.setInterval(() => {
      void loadSales();
    }, 10000);

    return () => {
      window.clearInterval(clockInterval);
      window.clearInterval(salesInterval);
    };
  }, [loadSales]);

  const clock = (tz: string) =>
    now.toLocaleTimeString('en-GB', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  return (
    <main className="min-h-screen bg-slate-950 p-6 pt-10 font-sans text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className={`h-3 w-3 rounded-full ${
                error ? 'bg-amber-400' : 'bg-green-500'
              }`}
            />
            <h1 className="text-2xl font-bold md:text-3xl">
              Live Sales Tracker
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="text-xs text-gray-400">
              {isLoading
                ? 'Loading completed payments...'
                : lastUpdate
                  ? `Updated ${lastUpdate.toLocaleTimeString()}`
                  : 'Waiting for data'}
            </span>
            <span className="text-xs text-gray-500">
              Refreshes every 10 seconds
            </span>
          </div>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-amber-400/40 bg-amber-950/30 p-4 text-amber-200"
          >
            Could not refresh sales data: {error}
          </div>
        )}

        <section className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
            <p className="mb-2 text-sm text-slate-400">
              Completed Payments
            </p>
            <p className="text-4xl font-bold text-green-400">
              {fmt(count)}
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
            <p className="mb-2 text-sm text-slate-400">
              Confirmed Payment Revenue
            </p>
            <p className="text-4xl font-bold text-cyan-400">
              ${fmt(revenue)}
            </p>
            <p className="mt-2 text-xs text-slate-500">USD</p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
            <p className="mb-2 text-sm text-slate-400">
              Data Source
            </p>
            <p className="text-xl font-bold text-fuchsia-300">
              Supabase Payments
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Records marked completed by the payment system
            </p>
          </div>
        </section>

        <h2 className="mb-8 text-center text-2xl font-bold">
          Global Market Reach — Live Local Time
        </h2>

        <section className="mb-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {MARKETS.map((market) => (
            <div
              key={market.code}
              className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-center"
            >
              <p className="mb-2 text-3xl">{market.flag}</p>
              <p className="font-bold">{market.name}</p>
              <p className="my-2 text-2xl font-extrabold text-cyan-400">
                {market.population}
              </p>
              <p className="mb-3 text-xs text-slate-500">
                addressable customers
              </p>
              <p className="font-mono text-lg text-green-400">
                {clock(market.tz)}
              </p>
              <p className="text-[10px] text-slate-500">
                Local time — {market.city}
              </p>
            </div>
          ))}
        </section>

        <h2 className="mb-8 text-center text-2xl font-bold">
          Recent Completed Payments
        </h2>

        <section className="rounded-lg border border-slate-800 bg-slate-900 p-6">
          {isLoading && sales.length === 0 ? (
            <p className="py-12 text-center text-slate-400">
              Loading payment records...
            </p>
          ) : sales.length === 0 ? (
            <div className="py-12 text-center">
              <p className="mb-2 text-sm text-slate-300">
                No completed payments recorded yet.
              </p>
              <p className="text-xs text-slate-500">
                Completed payment records will appear here after
                the payment system updates Supabase.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {sales.slice(0, 10).map((sale, index) => (
                <li
                  key={`${sale.created_at || 'sale'}-${index}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-black/40 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {sale.product_name || 'Digital product'}
                    </p>
                    <p className="mt-1 text-xs text-green-400">
                      Status: {sale.status || 'completed'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {sale.created_at
                        ? new Date(sale.created_at).toLocaleString()
                        : 'Time unavailable'}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-green-400">
                      ${Number(sale.amount_usd || 0).toFixed(2)}
                    </p>
                    <p className="text-[10px] text-slate-500">USD</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="py-8 text-center text-sm text-slate-400">
          <a
            href="/"
            className="inline-block rounded-full border border-slate-700 px-6 py-3 font-semibold text-cyan-300 hover:bg-slate-900"
          >
            ← Return to Homepage
          </a>
        </footer>
      </div>
    </main>
  );
}
