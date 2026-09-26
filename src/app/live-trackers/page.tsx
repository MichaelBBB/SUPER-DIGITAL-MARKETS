'use client';

import { useState, useEffect, useRef } from 'react';

type CountryKey = 'southafrica' | 'usa' | 'india' | 'china';

interface Buyer {
  name: string;
  product: string;
  time: string;
}

interface CountryMeta {
  key: CountryKey;
  flag: string;
  label: string;
}

const COUNTRIES: CountryMeta[] = [
  { key: 'southafrica', flag: '🇿🇦', label: 'South Africa' },
  { key: 'usa', flag: '🇺', label: 'USA' },
  { key: 'india', flag: '🇮🇳', label: 'India' },
  { key: 'china', flag: '🇨', label: 'China' },
];

const NAMES = [
  'Thabo M.', 'Nomsa K.', 'Mike R.', 'Priya S.', 'Zhang L.',
  'Sipho D.', 'Lerato P.', 'James O.', 'Anika R.', 'Wei C.',
  'Kagiso T.', 'Divya N.', 'Chen W.', 'Bongani M.',
];

const PRODUCTS = [
  'AI Writing Assistant', 'Social Media Toolkit', 'Logo Maker Pro',
  'SEO Masterclass', 'Email Funnel Pack', 'Brand Kit Deluxe',
  'Video Template Bundle', 'Copy Swipe File',
];

const INITIAL_REVENUE: Record<CountryKey, number> = {
  southafrica: 65422,
  usa: 76559,
  india: 64479,
  china: 64931,
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function LiveTrackersPage() {
  const [revenue, setRevenue] = useState<Record<CountryKey, number>>(INITIAL_REVENUE);
  const [buyers, setBuyers] = useState<Record<CountryKey, Buyer[]>>({
    southafrica: [],
    usa: [],
    india: [],
    china: [],
  });
  const tick = useRef(0);

  useEffect(() => {
    const id: ReturnType<typeof setInterval> = setInterval(() => {
      const meta = COUNTRIES[tick.current % COUNTRIES.length];
      tick.current += 1;
      const key = meta.key;

      setRevenue((prev) => ({
        ...prev,
        [key]: prev[key] + (8 + Math.floor(Math.random() * 38)),
      }));

      setBuyers((prev) => {
        const existing = prev[key];
        const aged = existing.map((b, i) => ({
          ...b,
          time: i === 0 ? '1m ago' : b.time,
        }));
        const fresh: Buyer = {
          name: pick(NAMES),
          product: pick(PRODUCTS),
          time: 'Just now',
        };
        return { ...prev, [key]: [fresh, ...aged].slice(0, 2) };
      });
    }, 2500);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Live Revenue by Country (USD)</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COUNTRIES.map((c) => {
            const list = buyers[c.key];
            return (
              <div
                key={c.key}
                className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden"
              >
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl leading-none">{c.flag}</span>
                    <div>
                      <h3 className="font-bold text-lg">{c.label}</h3>
                      <p className="text-xs text-slate-400">Live Revenue (USD)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-400">
                      ${revenue[c.key].toLocaleString()}
                    </p>
                    <p className="text-xs text-green-500 flex items-center justify-end gap-1 mt-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      Updating live
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-xs uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full" />
                    Recent Buyers
                  </p>

                  {list.length === 0 ? (
                    <p className="text-center text-slate-500 text-sm py-6">
                      Waiting for next purchase...
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {list.map((b, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-cyan-900/50 text-cyan-300 flex items-center justify-center text-sm font-bold shrink-0">
                            {b.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{b.name}</p>
                            <p className="text-xs text-slate-400 truncate">{b.product}</p>
                          </div>
                          <p className="text-xs text-green-400 ml-auto shrink-0">{b.time}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
