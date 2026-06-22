'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const BANK_DETAILS = {
  bankName: 'Capitec Bank',
  country: 'South Africa',
  accountHolder: 'SUPER DIGITAL',
  accountNumber: '1975933441',
  swiftCode: 'CABLZAJJ',
  branch: 'Capitec Head Office',
  branchCode: '470010',
  accountType: 'Savings Account',
};

const STEPS = [
  {
    step: '01',
    title: 'Choose Your Product',
    detail: 'Browse all 30 digital products and click "Buy Now" on your selection.',
    icon: 'ShoppingBagIcon',
  },
  {
    step: '02',
    title: 'Select Payment Method',
    detail: 'Choose from Razorpay (India), Alipay (China), Payoneer (USA), Google Pay, Peach Payments, or direct bank transfer.',
    icon: 'CreditCardIcon',
  },
  {
    step: '03',
    title: 'Complete Payment',
    detail: 'Follow the secure checkout flow. For bank transfers, use the Capitec details below and email your proof of payment.',
    icon: 'LockClosedIcon',
  },
  {
    step: '04',
    title: 'Instant Delivery',
    detail: 'Your digital product is delivered immediately to your email after payment confirmation.',
    icon: 'BoltIcon',
  },
];

export default function HowToPayPanel() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (value: string, key: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <section id="payment-panel" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 blob-primary opacity-20" style={{ bottom: '0', left: '50%', transform: 'translateX(-50%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-bold text-primary tracking-widest uppercase block mb-2">
            Payment Guide
          </span>
          <h2 className="text-section-xl font-extrabold text-foreground">
            How Do I <span className="text-gradient-cyan">Pay?</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Multiple ways to pay — from your local payment method to direct bank transfer.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Steps */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <Icon name="ListBulletIcon" size={20} className="text-primary" />
              Payment Steps
            </h3>
            <div className="flex flex-col gap-4">
              {STEPS.map((step, i) => (
                <div
                  key={step.step}
                  className="flex gap-5 p-5 glass-card rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 group"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <Icon name={step.icon as 'ShoppingBagIcon'} size={22} className="text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono-price text-xs text-primary font-bold">{step.step}</span>
                      <h4 className="font-bold text-foreground text-sm">{step.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bank Details */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <Icon name="BuildingLibraryIcon" size={20} className="text-accent" />
              Direct Bank Transfer — Capitec SA
            </h3>

            <div
              className="glass-card rounded-2xl p-6 border-2 glow-gold"
              style={{ borderColor: 'rgba(255,179,71,0.3)' }}
            >
              {/* Bank Header */}
              <div className="flex items-center gap-4 mb-6 pb-5 border-b border-border/50">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: 'rgba(0,40,85,0.4)', border: '1px solid rgba(0,40,85,0.6)' }}>
                  🇿🇦
                </div>
                <div>
                  <div className="font-extrabold text-foreground text-lg">{BANK_DETAILS.bankName}</div>
                  <div className="text-sm text-muted-foreground">{BANK_DETAILS.country} · {BANK_DETAILS.accountType}</div>
                </div>
                <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)' }}>
                  <Icon name="ShieldCheckIcon" size={12} className="text-green-400" variant="solid" />
                  <span className="text-xs font-bold text-green-400">Verified</span>
                </div>
              </div>

              {/* Bank Details Grid */}
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {[
                  { label: 'Account Holder', value: BANK_DETAILS.accountHolder, key: 'holder' },
                  { label: 'Account Number', value: BANK_DETAILS.accountNumber, key: 'account', mono: true },
                  { label: 'SWIFT Code', value: BANK_DETAILS.swiftCode, key: 'swift', mono: true },
                  { label: 'Branch Code', value: BANK_DETAILS.branchCode, key: 'branch', mono: true },
                ].map((field) => (
                  <div key={field.key} className="bg-muted/30 rounded-xl p-3 border border-border/30">
                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                      {field.label}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-foreground font-bold text-sm ${field.mono ? 'font-mono-price' : ''}`}>
                        {field.value}
                      </span>
                      <button
                        onClick={() => copyToClipboard(field.value, field.key)}
                        className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0 p-1 rounded hover:bg-primary/10"
                        aria-label={`Copy ${field.label}`}
                        title={`Copy ${field.label}`}
                      >
                        {copied === field.key
                          ? <Icon name="CheckIcon" size={14} className="text-green-400" />
                          : <Icon name="ClipboardDocumentIcon" size={14} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-xl border border-accent/20" style={{ background: 'rgba(255,179,71,0.05)' }}>
                <div className="flex items-start gap-3">
                  <Icon name="InformationCircleIcon" size={18} className="text-accent flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">After payment:</strong> Email your proof of payment to{' '}
                    <a href="mailto:payments@superdigital.store" className="text-primary hover:underline">
                      payments@superdigital.store
                    </a>{' '}
                    with your order number. Products are delivered within 2 hours of payment confirmation.
                    Reference your order number in the payment description.
                  </div>
                </div>
              </div>
            </div>

            {/* Supported Gateways Summary */}
            <div className="mt-5 glass-card rounded-2xl p-4 border border-border/50">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                All Accepted Payment Methods
              </div>
              <div className="flex flex-wrap gap-2">
                {['Razorpay 🇮🇳', 'Alipay 🇨🇳', 'Payoneer 🇺🇸', 'Google Pay 🌍', 'Peach Payments 🇿🇦', 'Capitec EFT 🇿🇦'].map((gw) => (
                  <span key={gw} className="px-3 py-1.5 rounded-lg text-xs font-semibold glass-card border border-border/50 text-foreground">
                    {gw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}