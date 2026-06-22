'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { DIGITAL_PRODUCTS } from '@/app/data/products';

type Step = 'cart' | 'payment' | 'confirm';

const CURRENCIES = [
  { code: 'USD', symbol: '$', flag: '🇺🇸', label: 'US Dollar', rate: 1 },
  { code: 'INR', symbol: '₹', flag: '🇮🇳', label: 'Indian Rupee', rate: 83.5 },
  { code: 'CNY', symbol: '¥', flag: '🇨🇳', label: 'Chinese Yuan', rate: 7.25 },
  { code: 'ZAR', symbol: 'R', flag: '🇿🇦', label: 'South African Rand', rate: 18.6 },
];

const PAYMENT_METHODS = [
  { id: 'razorpay', name: 'Razorpay', region: 'India', flag: '🇮🇳', color: '#3395FF', description: 'UPI, Cards, Net Banking' },
  { id: 'alipay', name: 'Alipay', region: 'China', flag: '🇨🇳', color: '#1677FF', description: 'QR Code, App Payment' },
  { id: 'payoneer', name: 'Payoneer', region: 'USA', flag: '🇺🇸', color: '#FF4800', description: 'Bank Transfer, Cards' },
  { id: 'googlepay', name: 'Google Pay', region: 'Global', flag: '🌍', color: '#4285F4', description: 'Saved Cards, UPI' },
  { id: 'peachpayments', name: 'Peach Payments', region: 'South Africa', flag: '🇿🇦', color: '#FF6B35', description: 'Cards, EFT, Instant EFT' },
  { id: 'banktransfer', name: 'Bank Transfer', region: 'South Africa', flag: '🇿🇦', color: '#002855', description: 'Capitec EFT / SWIFT' },
];

export default function CheckoutFlow() {
  const [step, setStep] = useState<Step>('cart');
  const [selectedProduct, setSelectedProduct] = useState(DIGITAL_PRODUCTS[0]);
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [email, setEmail] = useState('');
  const [orderCode, setOrderCode] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const productId = params.get('product');
      if (productId) {
        const found = DIGITAL_PRODUCTS.find((p) => p.id === productId);
        if (found) setSelectedProduct(found);
      }
    }
  }, []);

  const convertedPrice = (parseFloat(selectedProduct.price) * currency.rate).toFixed(2);
  const fee = (parseFloat(selectedProduct.price) * 0.029 + 0.30).toFixed(2);
  const total = (parseFloat(selectedProduct.price) + parseFloat(fee)).toFixed(2);
  const totalConverted = (parseFloat(total) * currency.rate).toFixed(2);

  const handleConfirm = () => {
    const id = `SD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setOrderId(id);
    setConfirmed(true);
    setStep('confirm');
  };

  const STEPS: { key: Step; label: string }[] = [
    { key: 'cart', label: 'Product' },
    { key: 'payment', label: 'Payment' },
    { key: 'confirm', label: 'Confirm' },
  ];

  return (
    <section className="pt-24 pb-20 min-h-screen relative">
      <div className="absolute inset-0 z-0">
        <div className="blob-primary absolute w-96 h-96 rounded-full opacity-20" style={{ top: '20%', left: '10%' }} />
        <div className="blob-accent absolute w-80 h-80 rounded-full opacity-15" style={{ bottom: '20%', right: '10%' }} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Page title */}
        <div className="text-center mb-10">
          <h1 className="text-section-xl font-extrabold text-foreground">
            Secure <span className="text-gradient-cyan">Checkout</span>
          </h1>
          <p className="text-muted-foreground mt-2">Encrypted · Instant Delivery · Multi-Currency</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.key}>
              <button
                onClick={() => !confirmed && setStep(s.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  step === s.key
                    ? 'payment-tab-active border'
                    : confirmed && s.key === 'confirm' ?'bg-green-500/20 text-green-400 border border-green-500/30' :'glass-card border border-border/50 text-muted-foreground'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-extrabold ${
                  step === s.key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {i + 1}
                </span>
                {s.label}
              </button>
              {i < STEPS.length - 1 && (
                <div className="w-8 h-px bg-border" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step: Cart */}
        {step === 'cart' && (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Product Selector */}
            <div className="lg:col-span-3">
              <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
                <Icon name="ShoppingBagIcon" size={20} className="text-primary" variant="solid" />
                Select Product
              </h2>
              <div className="grid sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {DIGITAL_PRODUCTS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
                      selectedProduct.id === p.id
                        ? 'border-primary/50 bg-primary/10' :'border-border/50 glass-card hover:border-border'
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <AppImage
                        src={p.image}
                        alt={p.imageAlt}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs text-foreground truncate">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.category}</div>
                    </div>
                    <div className="font-mono-price text-sm font-bold text-primary flex-shrink-0">
                      ${p.price}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
                <Icon name="ReceiptPercentIcon" size={20} className="text-accent" />
                Order Summary
              </h2>
              <div className="glass-card rounded-2xl p-5 border border-border/50 mb-5">
                <div className="relative h-32 rounded-xl overflow-hidden mb-4">
                  <AppImage
                    src={selectedProduct.image}
                    alt={selectedProduct.imageAlt}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      selectedProduct.badge === 'HOT' ? 'product-badge-hot' :
                      selectedProduct.badge === 'NEW'? 'product-badge-new' : 'product-badge-popular'
                    }`}>
                      {selectedProduct.badge}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-foreground text-base mb-1">{selectedProduct.name}</h3>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                  {selectedProduct.description}
                </p>

                {/* Currency Selector */}
                <div className="mb-4">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Currency</div>
                  <div className="grid grid-cols-2 gap-2">
                    {CURRENCIES.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => setCurrency(c)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${
                          currency.code === c.code
                            ? 'border-primary/50 bg-primary/10 text-primary' :'border-border/50 glass-card text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <span>{c.flag}</span>
                        <span>{c.code}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 border-t border-border/50 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Product</span>
                    <span className="font-mono-price text-foreground font-semibold">
                      {currency.symbol}{convertedPrice}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Processing fee</span>
                    <span className="font-mono-price text-muted-foreground">
                      {currency.symbol}{(parseFloat(fee) * currency.rate).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t border-border/50 pt-2 mt-2">
                    <span className="text-foreground">Total</span>
                    <span className="font-mono-price text-primary text-lg">
                      {currency.symbol}{totalConverted}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep('payment')}
                className="btn-primary w-full py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2"
              >
                Continue to Payment
                <Icon name="ArrowRightIcon" size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step: Payment */}
        {step === 'payment' && (
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
                <Icon name="CreditCardIcon" size={20} className="text-primary" />
                Payment Method
              </h2>

              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {PAYMENT_METHODS.map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm)}
                    className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-300 ${
                      paymentMethod.id === pm.id
                        ? 'border-primary/50 bg-primary/10' :'border-border/50 glass-card hover:border-border'
                    }`}
                  >
                    <span className="text-2xl flex-shrink-0">{pm.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-foreground">{pm.name}</div>
                      <div className="text-xs text-muted-foreground">{pm.description}</div>
                      <div
                        className="text-xs font-bold mt-1"
                        style={{ color: pm.color }}
                      >
                        {pm.region}
                      </div>
                    </div>
                    {paymentMethod.id === pm.id && (
                      <Icon name="CheckCircleIcon" size={18} className="text-primary flex-shrink-0 mt-0.5" variant="solid" />
                    )}
                  </button>
                ))}
              </div>

              {/* Email field */}
              <div className="mb-6">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                  Delivery Email
                </label>
                <div className="relative">
                  <Icon name="EnvelopeIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-9 pr-4 py-3 bg-card/60 border border-border/60 rounded-xl text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary/50 transition-colors"
                    aria-label="Email address for product delivery"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Your digital product will be delivered to this email instantly.
                </p>
              </div>

              {/* Promo / Order Code field */}
              <div className="mb-6">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                  Promo Code (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={orderCode}
                    onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
                    placeholder="Enter code e.g. SUPER10"
                    className="flex-1 px-4 py-3 bg-card/60 border border-border/60 rounded-xl text-sm font-mono-price text-foreground placeholder-muted-foreground outline-none focus:border-primary/50 transition-colors uppercase"
                    aria-label="Promo or discount code"
                  />
                  <button className="btn-secondary px-5 py-3 rounded-xl text-sm font-bold flex-shrink-0">
                    Apply
                  </button>
                </div>
              </div>

              {/* Bank Transfer Details (shown when bank transfer selected) */}
              {paymentMethod.id === 'banktransfer' && (
                <div
                  className="p-5 rounded-2xl border mb-6"
                  style={{ background: 'rgba(0,40,85,0.15)', borderColor: 'rgba(0,40,85,0.4)' }}
                >
                  <h4 className="font-bold text-foreground text-sm mb-3 flex items-center gap-2">
                    <Icon name="BuildingLibraryIcon" size={16} className="text-accent" />
                    Capitec Bank Transfer Details
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { label: 'Bank', value: 'Capitec Bank' },
                      { label: 'Account', value: '1975933441' },
                      { label: 'SWIFT', value: 'CABLZAJJ' },
                      { label: 'Branch Code', value: '470010' },
                    ].map((f) => (
                      <div key={f.label} className="bg-muted/30 rounded-lg p-2.5">
                        <div className="text-muted-foreground font-semibold mb-0.5">{f.label}</div>
                        <div className="font-mono-price font-bold text-foreground">{f.value}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                    Use your order ID as payment reference. Email proof of payment to{' '}
                    <span className="text-primary">payments@superdigital.store</span>
                  </p>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
                <Icon name="ReceiptPercentIcon" size={20} className="text-accent" />
                Order Summary
              </h2>
              <div className="glass-card rounded-2xl p-5 border border-border/50 mb-5">
                <div className="flex items-center gap-3 pb-4 border-b border-border/50 mb-4">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                    <AppImage
                      src={selectedProduct.image}
                      alt={selectedProduct.imageAlt}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-sm">{selectedProduct.name}</div>
                    <div className="text-xs text-muted-foreground">{selectedProduct.category}</div>
                    <div className="font-mono-price text-primary font-bold text-sm mt-0.5">
                      {currency.symbol}{convertedPrice} {currency.code}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-4 border-b border-border/50 mb-4">
                  <span className="text-2xl">{paymentMethod.flag}</span>
                  <div>
                    <div className="text-xs text-muted-foreground">Payment via</div>
                    <div className="font-bold text-foreground text-sm">{paymentMethod.name}</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-mono-price font-semibold">{currency.symbol}{convertedPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fee</span>
                    <span className="font-mono-price text-muted-foreground">{currency.symbol}{(parseFloat(fee) * currency.rate).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t border-border/50 pt-2">
                    <span>Total</span>
                    <span className="font-mono-price text-primary">{currency.symbol}{totalConverted}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 rounded-xl bg-muted/30">
                  <Icon name="BoltIcon" size={12} className="text-primary" variant="solid" />
                  Instant delivery to your email after payment
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleConfirm}
                  disabled={!email}
                  className={`w-full py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                    email
                      ? 'btn-primary' :'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  <Icon name="LockClosedIcon" size={18} variant="solid" />
                  Complete Purchase
                </button>
                <button
                  onClick={() => setStep('cart')}
                  className="btn-secondary w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <Icon name="ArrowLeftIcon" size={16} />
                  Back
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step: Confirmation */}
        {step === 'confirm' && confirmed && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="glass-card rounded-3xl p-10 border border-green-500/30 glow-cyan mb-8"
              style={{ boxShadow: '0 0 60px rgba(0,255,136,0.1)' }}>
              {/* Success Icon */}
              <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                <Icon name="CheckIcon" size={40} className="text-green-400" variant="solid" />
              </div>

              <h2 className="text-3xl font-extrabold text-foreground mb-2">
                Order <span className="text-gradient-cyan">Confirmed!</span>
              </h2>
              <p className="text-muted-foreground mb-6">
                Your payment is being processed. Product delivery is on its way.
              </p>

              {/* Order ID */}
              <div className="glass-card rounded-2xl p-4 border border-border/50 mb-6">
                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Order ID</div>
                <div className="font-mono-price text-xl font-extrabold text-primary">{orderId}</div>
                <div className="text-xs text-muted-foreground mt-1">Save this for your records</div>
              </div>

              {/* Details Grid */}
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="glass-card rounded-xl p-4 border border-border/50">
                  <div className="text-xs text-muted-foreground mb-1">Product</div>
                  <div className="font-bold text-foreground text-sm">{selectedProduct.name}</div>
                </div>
                <div className="glass-card rounded-xl p-4 border border-border/50">
                  <div className="text-xs text-muted-foreground mb-1">Total Paid</div>
                  <div className="font-mono-price font-bold text-primary text-sm">
                    {currency.symbol}{totalConverted} {currency.code}
                  </div>
                </div>
                <div className="glass-card rounded-xl p-4 border border-border/50">
                  <div className="text-xs text-muted-foreground mb-1">Payment</div>
                  <div className="font-bold text-foreground text-sm">{paymentMethod.name}</div>
                </div>
              </div>

              {/* Delivery info */}
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 mb-8 text-left">
                <div className="flex items-start gap-3">
                  <Icon name="EnvelopeIcon" size={18} className="text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-foreground text-sm mb-1">Delivery Details</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      Your product will be delivered to <span className="text-foreground font-medium">{email}</span> within
                      minutes of payment confirmation. Check your spam folder if not received.
                      {paymentMethod.id === 'banktransfer' && (
                        <span className="block mt-1 text-accent">
                          For bank transfer: Email your proof of payment with order ID <strong>{orderId}</strong> to payments@superdigital.store
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/products"
                  className="btn-primary px-8 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Icon name="ShoppingBagIcon" size={16} variant="solid" />
                  Shop More Products
                </Link>
                <Link
                  href="/"
                  className="btn-secondary px-8 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <Icon name="HomeIcon" size={16} />
                  Back to Home
                </Link>
              </div>
            </div>

            {/* Security note */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Icon name="LockClosedIcon" size={12} className="text-primary" variant="solid" />
                <span>256-bit encrypted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Icon name="ShieldCheckIcon" size={12} className="text-green-400" variant="solid" />
                <span>PCI DSS compliant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Icon name="BoltIcon" size={12} className="text-accent" variant="solid" />
                <span>Instant delivery</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}