'use client';

import React, { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

interface CountryData {
  flag: string;
  country: string;
  code: string;
  currency: string;
  color: string;
  glowColor: string;
  baseCount: number;
  recentSales: string[];
}

const COUNTRIES: CountryData[] = [
  {
    flag: '🇺🇸',
    country: 'United States',
    code: 'USA',
    currency: 'USD',
    color: 'text-blue-400',
    glowColor: 'rgba(59,130,246,0.3)',
    baseCount: 14872,
    recentSales: ['Adobe CC', 'ChatGPT Plus', 'Spotify', 'Microsoft 365'],
  },
  {
    flag: '🇮🇳',
    country: 'India',
    code: 'IND',
    currency: 'INR',
    color: 'text-orange-400',
    glowColor: 'rgba(251,146,60,0.3)',
    baseCount: 22341,
    recentSales: ['Canva Pro', 'Netflix', 'NordVPN', 'Grammarly'],
  },
  {
    flag: '🇨🇳',
    country: 'China',
    code: 'CHN',
    currency: 'CNY',
    color: 'text-red-400',
    glowColor: 'rgba(248,113,113,0.3)',
    baseCount: 18654,
    recentSales: ['Zoom Pro', 'Notion', 'Figma', 'LastPass'],
  },
  {
    flag: '🇿🇦',
    country: 'South Africa',
    code: 'ZAF',
    currency: 'ZAR',
    color: 'text-green-400',
    glowColor: 'rgba(74,222,128,0.3)',
    baseCount: 3421,
    recentSales: ['Dropbox', 'Adobe CC', 'Spotify', 'Grammarly'],
  },
];

const RECENT_TRANSACTIONS = [
  { flag: '🇺🇸', product: 'ChatGPT Plus', price: '$20.00', time: '2s ago' },
  { flag: '🇮🇳', product: 'Canva Pro', price: '$12.99', time: '5s ago' },
  { flag: '🇨🇳', product: 'Zoom Pro', price: '$14.99', time: '8s ago' },
  { flag: '🇿🇦', product: 'Spotify Premium', price: '$9.99', time: '12s ago' },
  { flag: '🇺🇸', product: 'Adobe Creative Cloud', price: '$54.99', time: '15s ago' },
  { flag: '🇮🇳', product: 'NordVPN', price: '$3.99', time: '19s ago' },
];

function useCounter(target: number, isVisible: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const duration = 2000;
    const step = 16;
    const increment = target / (duration / step);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [target, isVisible]);

  return count;
}

function CounterCard({ data, isVisible }: { data: CountryData; isVisible: boolean }) {
  const count = useCounter(data.baseCount, isVisible);
  const [live, setLive] = useState(data.baseCount);
  const [lastProduct, setLastProduct] = useState(data.recentSales[0]);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 3) + 1;
      setLive((prev) => prev + increment);
      setLastProduct(data.recentSales[Math.floor(Math.random() * data.recentSales.length)]);
    }, 2000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [isVisible, data.recentSales]);

  const displayCount = isVisible ? live : count;

  return (
    <div
      className="glass-card rounded-2xl p-6 card-hover relative overflow-hidden"
      style={{ boxShadow: `0 0 30px ${data.glowColor}` }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
        style={{ background: `radial-gradient(circle, ${data.glowColor.replace('0.3', '1')} 0%, transparent 70%)`, filter: 'blur(20px)' }}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{data.flag}</span>
            <div>
              <div className="font-bold text-foreground text-sm">{data.country}</div>
              <div className="text-xs text-muted-foreground font-mono">{data.currency}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
            <span className="live-dot" style={{ width: '6px', height: '6px' }} />
            <span className="text-xs font-bold text-green-400">LIVE</span>
          </div>
        </div>

        <div className={`font-mono-price text-4xl font-extrabold mb-1 ${data.color}`}>
          {displayCount.toLocaleString()}
        </div>
        <div className="text-xs text-muted-foreground mb-4">Total sales today</div>

        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-1.5 mb-3">
          <div
            className="h-1.5 rounded-full transition-all duration-1000"
            style={{
              width: `${Math.min((displayCount / 25000) * 100, 100)}%`,
              background: `linear-gradient(90deg, ${data.glowColor.replace('0.3', '0.8')}, ${data.glowColor.replace('0.3', '1')})`,
            }}
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon name="BoltIcon" size={12} className="text-accent" variant="solid" />
          <span>Latest: <span className="text-foreground font-medium">{lastProduct}</span></span>
        </div>
      </div>
    </div>
  );
}

export default function LiveSalesTracker() {
  const [isVisible, setIsVisible] = useState(false);
  const [txIndex, setTxIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setTxIndex((i) => (i + 1) % RECENT_TRANSACTIONS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="py-20 bg-muted/20 relative overflow-hidden">
      <div className="absolute inset-0 blob-primary opacity-30" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="live-dot" />
              <span className="text-xs font-bold text-green-400 tracking-widest uppercase">Real-Time Data</span>
            </div>
            <h2 className="text-section-xl font-extrabold text-foreground">
              Live Sales <span className="text-gradient-cyan">Tracker</span>
            </h2>
            <p className="text-muted-foreground mt-2 text-base">
              Watch purchases happen across the globe in real time.
            </p>
          </div>

          {/* Latest Transaction Ticker */}
          <div className="glass-card rounded-2xl px-5 py-4 min-w-64">
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Latest Sale</div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{RECENT_TRANSACTIONS[txIndex].flag}</span>
              <div>
                <div className="font-bold text-foreground text-sm">{RECENT_TRANSACTIONS[txIndex].product}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono-price text-primary text-sm font-bold">{RECENT_TRANSACTIONS[txIndex].price}</span>
                  <span className="text-xs text-muted-foreground">{RECENT_TRANSACTIONS[txIndex].time}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Country Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COUNTRIES.map((country) => (
            <CounterCard key={country.code} data={country} isVisible={isVisible} />
          ))}
        </div>

        {/* Total Bar */}
        <div className="mt-8 glass-card rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Global Total (Today)</div>
              <div className="font-mono-price text-3xl font-extrabold text-gradient-cyan">59,288+</div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Revenue (USD)</div>
                <div className="font-mono-price font-bold text-accent text-lg">$847,320</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Avg. Order</div>
                <div className="font-mono-price font-bold text-foreground text-lg">$14.29</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Uptime</div>
                <div className="font-mono-price font-bold text-green-400 text-lg">99.9%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}