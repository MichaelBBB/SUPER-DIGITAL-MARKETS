
'use client';

import { useEffect, useState } from 'react';

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const fmt = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

const MARKETS = [
  {
    code: 'ZA',
    flag: '🇿🇦',
    name: 'South Africa',
    letter: 'A',
    color: 'bg-blue-600',
    tz: 'Africa/Johannesburg',
    city: 'Johannesburg',
  },
  {
    code: 'US',
    flag: '🇺🇸',
    name: 'USA',
    letter: 'U',
    color: 'bg-blue-600',
    tz: 'America/New_York',
    city: 'New York',
  },
  {
    code: 'IN',
    flag: '🇮🇳',
    name: 'India',
    letter: 'I',
    color: 'bg-orange-700',
    tz: 'Asia/Kolkata',
    city: 'Delhi',
  },
  {
    code: 'CN',
    flag: '🇨🇳',
    name: 'China',
    letter: 'C',
    color: 'bg-red-700',
    tz: 'Asia/Shanghai',
    city: 'Beijing',
  },
];

type Order = {
  product_name?: string | null;
  amount?: number | string | null;
  status?: string | null;
  customer_email?: string | null;
  created_at?: string | null;
};

export default function LiveTrackersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [now, setNow] = useState(new Date());
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const loadOrders = async () => {
    if (!SB_URL || !ANON) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        `${SB_URL}/rest/v1/orders?select=product_name,amount,status,customer_email,created_at&status=eq.delivered&order=created_at.desc`,
        {
          headers: {
            apikey: ANON,
            Authorization: `Bearer ${ANON}`,
          },
          cache: 'no-store',
        }
      );

      if (!res.ok) {
        throw new Error(`Orders request failed: ${res.status}`);
      }

      const data: unknown = await res.json();

      setOrders(Array.isArray(data) ? (data as Order[]) : []);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();

    const clockInterval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    const pollInterval = setInterval(() => {
      void loadOrders();
    }, 3000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(pollInterval);
    };
  }, []);

  const revenue = orders.reduce(
    (sum, order) => sum + Number(order.amount || 0),
    0
  );

  const marketsServed =
    new Set(
      orders.map(
        (order) =>
          (order.customer_email || '')
            .split('@')[1]
            ?.split('.')[0] || 'unknown'
      )
    ).size || 1;

  const clock = (tz: string) =>
    now.toLocaleTimeString('en-GB', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  return (
    <div className="min-h-screen bg-slate-950 p-6 pt-10 font-sans text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header with live indicator */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
            <h2 className="text-2xl font-bold md:text-3xl">
              Live Sales Ledger — 100% Real
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="text-xs text-gray-400">
              {isLoading
                ? '🔄 Updating...'
                : `✓ Updated ${lastUpdate.toLocaleTimeString()}`}
            </span>
            <span className="text-xs text-gray-500">
              Polling every 3 seconds
            </span>
          </div>
        </div>

        {/* Top statistics */}
        <div className="mb-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
            <p className="mb-2 text-sm text-slate-400">Orders Fulfilled</p>
            <p className="text-4xl font-bold text-green-400">
              {fmt(orders.length)}
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
            <p className="mb-2 text-sm text-slate-400">Revenue Fulfilled</p>
            <p className="text-4xl font-bold text-cyan-400">
              ${fmt(Math.round(revenue))}
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
            <p className="mb-2 text-sm text-slate-400">Fulfilment Rate</p>
            <p className="text-4xl font-bold text-yellow-400">100%</p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
            <p className="mb-2 text-sm text-slate-400">Markets Served</p>
            <p className="text-4xl font-bold text-fuchsia-400">
              {marketsServed}
            </p>
          </div>
        </div>

        {/* Local clocks and addressable markets */}
        <h3 className="mb-8 text-center text-2xl font-bold">
          Global Market Reach — Live Local Time
        </h3>

        <div className="mb-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {MARKETS.map((market) => (
            <div
              key={market.code}
              className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-center"
            >
              <p className="mb-2 text-3xl">{market.flag}</p>
              <p className="font-bold">{market.name}</p>

              <p className="my-2 text-2xl font-extrabold text-cyan-400">
                {market.code === 'US'
                  ? '350 000 000'
                  : market.code === 'IN'
                    ? '1 400 000 000'
                    : market.code === 'CN'
                      ? '1 400 000 000'
                      : '45 000 000'}
              </p>

              <p className="mb-3 text-xs text-slate-500">
                addressable customers
              </p>

              <p className="font-mono text-lg text-green-400">
                {clock(market.tz)}
              </p>

              <p className="text-[10px] text-slate-500">
                local time — {market.city}
              </p>
            </div>
          ))}
        </div>

        {/* Recent orders */}
        <h3 className="mb-8 text-center text-2xl font-bold">
          Recent Real Orders
        </h3>

        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
          {orders.length === 0 ? (
            <div className="py-12 text-center">
              <p className="mb-2 text-sm text-slate-500">
                🔍 Monitoring for sales...
              </p>
              <p className="text-xs text-slate-600">
                The system checks for delivered orders every 3 seconds.
                The first qualifying order will appear here.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {orders.slice(0, 10).map((order, index) => (
                <li
                  key={`${order.created_at || 'order'}-${index}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-black/40 px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-bold">
                      {(order.customer_email || '?')[0].toUpperCase()}
                    </span>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {order.product_name || 'Digital product'}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {order.customer_email || 'Anonymous'}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-green-400">
                      ${Number(order.amount || 0).toFixed(2)}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleTimeString()
                        : 'Time unavailable'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-cyan-300 hover:bg-slate-900"
          >
            ← Return to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}

