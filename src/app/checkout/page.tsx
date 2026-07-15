'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const products = [
  { id: 1, name: "ChatGPT Plus", price: 20.00 }, { id: 2, name: "Adobe Creative Cloud", price: 54.99 }, { id: 3, name: "Netflix Premium", price: 22.99 },
  { id: 4, name: "Microsoft 365 Business", price: 12.50 }, { id: 5, name: "Spotify Premium", price: 9.99 }, { id: 6, name: "NordVPN", price: 3.99 },
  { id: 7, name: "Notion Plus", price: 8.00 }, { id: 8, name: "Figma Professional", price: 12.00 }, { id: 9, name: "Dropbox Plus", price: 9.99 },
  { id: 10, name: "Canva Pro", price: 12.99 }, { id: 11, name: "Grammarly Premium", price: 12.00 }, { id: 12, name: "Zoom Pro", price: 14.99 },
  { id: 13, name: "LastPass Premium", price: 3.00 }, { id: 14, name: "Cursor AI Pro", price: 20.00 }, { id: 15, name: "Midjourney Standard", price: 24.00 },
  { id: 16, name: "GitHub Copilot", price: 10.00 }, { id: 17, name: "Slack Pro", price: 7.25 }, { id: 18, name: "Dashlane Premium", price: 4.99 },
  { id: 19, name: "Adobe Photoshop", price: 22.99 }, { id: 20, name: "Claude Pro", price: 20.00 }, { id: 21, name: "Adobe Premiere Pro", price: 22.99 },
  { id: 22, name: "Asana Premium", price: 10.99 }, { id: 23, name: "ExpressVPN", price: 6.67 }, { id: 24, name: "YouTube Premium", price: 13.99 },
  { id: 25, name: "1Password", price: 2.99 }, { id: 26, name: "Monday.com Pro", price: 9.00 }, { id: 27, name: "Perplexity Pro", price: 20.00 },
  { id: 28, name: "Loom Business", price: 12.50 }, { id: 29, name: "Webflow CMS", price: 14.00 }, { id: 30, name: "ElevenLabs Starter", price: 5.00 }
];

function CheckoutInner() {
  const searchParams = useSearchParams();
  const productId = Number(searchParams.get('product')) || 1;
  const product = products.find(p => p.id === productId) || products[0];
  const [selectedMethod, setSelectedMethod] = useState('capitec');
  const [processing, setProcessing] = useState(false);

  const handleCapitecConfirm = async () => {
    setProcessing(true);
    try {
      const email = prompt('Enter your email for instant delivery:');
      if (!email) { alert('Email required.'); return; }
      const res = await fetch('/api/payment/capitec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: product.price, orderId: `SD-${product.id}`, productName: product.name, customerEmail: email })
      });
      const data = await res.json();
      alert(data.success ? '✅ Payment recorded! Admin will verify & deliver instantly.' : `❌ ${data.error}`);
    } catch (e) { alert('Server error.'); }
    finally { setProcessing(false); }
  };

  const handlePeachPay = async () => {
    setProcessing(true);
    try {
      const res = await fetch('/api/peach-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: product.price, orderId: `SD-${product.id}` })
      });
      const data = await res.json();
      if (data.success && data.checkoutUrl) window.location.href = data.checkoutUrl;
      else alert(`❌ ${data.error || 'Payment failed'}`);
    } catch (e) { alert('Server error.'); }
    finally { setProcessing(false); }
  };

  const handleExternal = (name: string) => {
    alert(`Redirecting to ${name}...\nPlease use Order ID: SD-${product.id} as reference.`);
  };

  const methods = [
    { id: 'razorpay', name: 'Razorpay', sub: 'INDIA PRIMARY', flag: '🇮🇳', color: '#60a5fa' },
    { id: 'alipay', name: 'Alipay', sub: 'CHINA PRIMARY', flag: '🇨🇳', color: '#60a5fa' },
    { id: 'payoneer', name: 'Payoneer', sub: 'USA PRIMARY', flag: '🇺', color: '#f97316' },
    { id: 'googlepay', name: 'Google Pay', sub: 'GLOBAL', flag: '🌍', color: '#60a5fa' },
    { id: 'peach', name: 'Peach Payments', sub: 'SA PRIMARY', flag: '🇿🇦', color: '#f97316' },
    { id: 'capitec', name: 'Capitec Bank Transfer', sub: 'MANUAL', flag: '🇿', color: '#06b6d4' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B1120', color: '#fff', padding: '48px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Link href="/products" style={{ color: '#22d3ee', textDecoration: 'none', marginBottom: '32px', display: 'inline-block', fontWeight: 'bold', fontSize: '14px' }}>
          &larr; Back to Products
        </Link>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>Secure Checkout</h1>
        <p style={{ color: '#94a3b8', marginBottom: '32px', fontSize: '16px' }}>
          Order: <span style={{ color: '#fff', fontWeight: 'bold' }}>{product.name}</span> — Total: <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>${product.price.toFixed(2)}</span>
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
          
          {/* LEFT: INTERACTIVE BUTTONS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {methods.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMethod(m.id)}
                style={{
                  width: '100%', padding: '14px', borderRadius: '12px', border: selectedMethod === m.id ? '2px solid #06b6d4' : '1px solid #334155',
                  backgroundColor: selectedMethod === m.id ? '#0F172A' : 'rgba(15, 23, 42, 0.5)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: 'all 0.2s', boxShadow: selectedMethod === m.id ? '0 0 15px rgba(6,182,212,0.2)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>{m.flag}</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#fff' }}>{m.name}</div>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', color: m.color, letterSpacing: '0.5px' }}>{m.sub}</div>
                  </div>
                </div>
                {selectedMethod === m.id && <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#fff' }}>✓</span>}
              </button>
            ))}
          </div>

          {/* RIGHT: TWO EXPLICIT SEPARATE PANELS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* PANEL 1: PAYMENT STEPS GUIDE */}
            <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              <h3 style={{ color: '#22d3ee', fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid #1E293B', paddingBottom: '12px' }}>📋 Payment Steps</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                {[
                  { n: '01', t: 'Choose Product', d: `You selected: ${product.name}`, c: '#06b6d4' },
                  { n: '02', t: 'Select Method', d: methods.find(m => m.id === selectedMethod)?.name, c: '#06b6d4' },
                  { n: '03', t: 'Complete Payment', d: 'Use details below or follow provider flow.', c: '#06b6d4' },
                  { n: '04', t: 'Instant Delivery', d: 'Receive access immediately via email.', c: '#22c55e' }
                ].map(step => (
                  <div key={step.n} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `${step.c}20`, border: `1px solid ${step.c}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: step.c, fontWeight: 'bold', fontSize: '14px', flexShrink: 0 }}>{step.n}</div>
                    <div>
                      <h4 style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px', color: '#fff' }}>{step.t}</h4>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* VISUAL DIVIDER */}
            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #334155, transparent)', margin: '0 16px' }}></div>

            {/* PANEL 2: PAYMENT DETAILS (DYNAMIC) */}
            <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }}></div>
              
              <div style={{ position: 'relative', zIndex: 10 }}>
                {selectedMethod === 'capitec' && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #1E293B' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', border: '1px solid #334155' }}>🇿🇦</div>
                        <div>
                          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#fff' }}>Capitec Bank Transfer</h2>
                          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>South Africa • Direct EFT</p>
                        </div>
                      </div>
                      <span style={{ padding: '4px 10px', borderRadius: '50px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', fontSize: '12px', fontWeight: 'bold' }}>✓ Verified</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                      {[
                        { label: 'ACCOUNT HOLDER', val: 'SUPER DIGITAL' },
                        { label: 'ACCOUNT NUMBER', val: '1975933441', mono: true },
                        { label: 'SWIFT CODE', val: 'CABLZAJJ' },
                        { label: 'BRANCH CODE', val: '470010' }
                      ].map(field => (
                        <div key={field.label} style={{ background: '#0B1120', padding: '12px', borderRadius: '12px', border: '1px solid #1E293B' }}>
                          <span style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>{field.label}</span>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '14px', fontFamily: field.mono ? 'monospace' : 'inherit', color: '#fff' }}>{field.val}</span>
                            <button onClick={() => navigator.clipboard.writeText(field.val)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '14px' }}>📋</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: 'rgba(30,58,138,0.2)', border: '1px solid rgba(30,58,138,0.4)', padding: '12px', borderRadius: '12px', marginBottom: '20px' }}>
                      <p style={{ fontSize: '12px', color: '#bfdbfe', margin: 0, lineHeight: '1.5' }}>
                        <strong style={{ color: '#dbeafe' }}>After payment:</strong> Email your proof of payment to <a href="mailto:payments@superdigital.store" style={{ color: '#60a5fa', textDecoration: 'underline' }}>payments@superdigital.store</a> with your order number. Reference <strong>SD-{product.id}</strong> in the payment description.
                      </p>
                    </div>
                    <button onClick={handleCapitecConfirm} disabled={processing} style={{ width: '100%', padding: '14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      {processing ? 'Processing...' : 'Pay with Capitec Bank Transfer'}
                    </button>
                  </>
                )}

                {selectedMethod === 'peach' && (
                  <>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
                      <span style={{ fontSize: '24px' }}>💳</span>
                      <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#fff' }}>Credit / Debit Card</h2>
                        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Powered by Peach Payments</p>
                      </div>
                    </div>
                    <button onClick={handlePeachPay} disabled={processing} style={{ width: '100%', padding: '14px', background: '#0891b2', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? 0.7 : 1 }}>
                      {processing ? 'Processing...' : `Pay $${product.price.toFixed(2)} Securely`}
                    </button>
                  </>
                )}

                {!['capitec', 'peach'].includes(selectedMethod) && (
                  <>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
                      <span style={{ fontSize: '24px' }}>{methods.find(m => m.id === selectedMethod)?.flag}</span>
                      <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#fff', textTransform: 'capitalize' }}>{selectedMethod}</h2>
                        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>International Payment Method</p>
                      </div>
                    </div>
                    <button onClick={() => handleExternal(selectedMethod)} style={{ width: '100%', padding: '14px', background: '#475569', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
                      Proceed to {selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1)}
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#0B1120', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>Loading Checkout...</div>}>
      <CheckoutInner />
    </Suspense>
  );
}
