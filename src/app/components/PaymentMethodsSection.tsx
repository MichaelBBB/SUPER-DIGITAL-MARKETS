'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const PAYMENT_GATEWAYS = [
  {
    id: 'razorpay',
    name: 'Razorpay',
    region: 'India',
    flag: '🇮🇳',
    description: 'India\'s leading payment gateway. UPI, Cards, Net Banking, Wallets.',
    currencies: ['INR', 'USD'],
    color: '#3395FF',
    methods: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallets'],
    badge: 'INDIA PRIMARY',
  },
  {
    id: 'alipay',
    name: 'Alipay',
    region: 'China',
    flag: '🇨🇳',
    description: 'China\'s #1 payment platform. Scan QR, instant settlement.',
    currencies: ['CNY', 'USD'],
    color: '#1677FF',
    methods: ['QR Code', 'App Payment', 'Web Payment'],
    badge: 'CHINA PRIMARY',
  },
  {
    id: 'payoneer',
    name: 'Payoneer',
    region: 'USA',
    flag: '🇺🇸',
    description: 'Global payments for USA and international buyers.',
    currencies: ['USD', 'EUR', 'GBP'],
    color: '#FF4800',
    methods: ['Bank Transfer', 'Credit Card', 'Payoneer Balance'],
    badge: 'USA PRIMARY',
  },
  {
    id: 'googlepay',
    name: 'Google Pay',
    region: 'Global',
    flag: '🌍',
    description: 'Fast, secure payments with your Google account.',
    currencies: ['USD', 'INR', 'GBP', 'EUR'],
    color: '#4285F4',
    methods: ['Saved Cards', 'Bank Account', 'UPI (India)'],
    badge: 'GLOBAL',
  },
  {
    id: 'peachpayments',
    name: 'Peach Payments',
    region: 'South Africa',
    flag: '🇿🇦',
    description: 'South Africa\'s trusted payment gateway. Cards, EFT, Instant EFT.',
    currencies: ['ZAR', 'USD'],
    color: '#FF6B35',
    methods: ['Credit Card', 'Debit Card', 'EFT', 'Instant EFT', 'Capitec Pay'],
    badge: 'SA PRIMARY',
  },
  {
    id: 'capitec',
    name: 'Capitec Bank Transfer',
    region: 'South Africa',
    flag: '🇿🇦',
    description: 'Direct bank transfer to our Capitec account.',
    currencies: ['ZAR'],
    color: '#002855',
    methods: ['EFT', 'Internet Banking', 'Capitec App'],
    badge: 'MANUAL',
  },
];

export default function PaymentMethodsSection() {
  const [activeGateway, setActiveGateway] = useState('razorpay');

  const selected = PAYMENT_GATEWAYS.find((g) => g.id === activeGateway) || PAYMENT_GATEWAYS[0];

  return (
    <section className="py-20 bg-muted/10 relative overflow-hidden">
      <div className="absolute inset-0 blob-accent opacity-20" style={{ top: '30%', right: '0' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-accent tracking-widest uppercase block mb-2">
            Secure Checkout
          </span>
          <h2 className="text-section-xl font-extrabold text-foreground">
            Pay Your <span className="text-gradient-cyan">Way</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-base">
            Choose from 6 payment methods across USA, India, China, and South Africa.
            All transactions are encrypted and secure.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Gateway Selector */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {PAYMENT_GATEWAYS.map((gw) => (
              <button
                key={gw.id}
                onClick={() => setActiveGateway(gw.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left ${
                  activeGateway === gw.id
                    ? 'glass-card border-primary/40 bg-primary/5' :'border-border/50 hover:border-border hover:bg-card/30'
                }`}
              >
                <span className="text-2xl">{gw.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground text-sm">{gw.name}</span>
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded"
                      style={{ background: `${gw.color}20`, color: gw.color }}
                    >
                      {gw.badge}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{gw.region}</div>
                </div>
                {activeGateway === gw.id && (
                  <Icon name="CheckCircleIcon" size={20} className="text-primary flex-shrink-0" variant="solid" />
                )}
              </button>
            ))}
          </div>

          {/* Gateway Detail */}
          <div className="lg:col-span-3">
            <div
              className="glass-card rounded-2xl p-8 h-full border-2 transition-all duration-500"
              style={{ borderColor: `${selected.color}40`, boxShadow: `0 0 40px ${selected.color}20` }}
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">{selected.flag}</span>
                    <div>
                      <h3 className="text-2xl font-extrabold text-foreground">{selected.name}</h3>
                      <div className="text-sm text-muted-foreground">{selected.region} Market</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{selected.description}</p>
                </div>
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${selected.color}20`, border: `1px solid ${selected.color}40` }}
                >
                  <Icon name="CreditCardIcon" size={32} className="text-foreground" />
                </div>
              </div>

              {/* Supported Currencies */}
              <div className="mb-6">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Currencies</div>
                <div className="flex flex-wrap gap-2">
                  {selected.currencies.map((c) => (
                    <span key={c} className="font-mono-price px-3 py-1.5 rounded-lg text-sm font-bold"
                      style={{ background: `${selected.color}15`, color: selected.color, border: `1px solid ${selected.color}30` }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-8">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Accepted Methods</div>
                <div className="flex flex-wrap gap-2">
                  {selected.methods.map((m) => (
                    <span key={m} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold glass-card border border-border/50 text-foreground">
                      <Icon name="CheckIcon" size={12} className="text-green-400" />
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/checkout"
                className="w-full py-4 rounded-xl text-base font-bold flex items-center justify-center gap-3 transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${selected.color} 0%, ${selected.color}CC 100%)`,
                  color: '#fff',
                  boxShadow: `0 8px 30px ${selected.color}40`,
                }}
              >
                <Icon name="LockClosedIcon" size={18} variant="solid" />
                Pay with {selected.name}
              </Link>
            </div>
          </div>
        </div>

        {/* Security badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          {[
            { icon: 'LockClosedIcon', label: '256-bit SSL Encryption' },
            { icon: 'ShieldCheckIcon', label: 'PCI DSS Compliant' },
            { icon: 'BoltIcon', label: 'Instant Delivery' },
            { icon: 'ArrowPathIcon', label: '30-Day Refund Policy' },
          ].map((badge) => (
            <div key={badge.label} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name={badge.icon as 'LockClosedIcon'} size={16} className="text-primary" />
              <span className="font-medium">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Link({ href, children, className, style }: { href: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <a href={href} className={className} style={style}>
      {children}
    </a>
  );
}