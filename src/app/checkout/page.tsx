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
  const product = products.find(p => p.id === Number(searchParams.get('product')));
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('capitec');

  if (!product) return <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Product not found</div>;

  const handlePeachPayment = async () => {
    setProcessing(true);
    try {
      const res = await fetch('/api/peach-payment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: product.price, orderId: `SD-${product.id}` }) });
      const data = await res.json();
      if (data.success && data.checkoutUrl) window.location.href = data.checkoutUrl;
      else alert(`❌ Payment Error: ${data.error || data.message}`);
    } catch (e) { alert('Failed to connect to payment server.'); }
    finally { setProcessing(false); }
  };

  const handleCapitecConfirmation = async () => {
    setProcessing(true);
    try {
      const customerEmail = prompt('Please enter your email for instant delivery after approval:');
      if (!customerEmail) { alert('Email is required for delivery.'); return; }
      const res = await fetch('/api/payment/capitec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: product.price, orderId: `SD-${product.id}`, productName: product.name, customerEmail }) });
      const data = await res.json();
      alert(data.success ? '✅ Payment recorded! Admin will verify & deliver instantly.' : `❌ Error: ${data.error}`);
    } catch (e) { alert('Failed to connect to server.'); }
    finally { setProcessing(false); }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050B14', color: 'white', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Link href="/products" style={{ color: '#22d3ee', textDecoration: 'none', marginBottom: '30px', display: 'inline-block', fontWeight: 'bold' }}>← Back to Products</Link>
        
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px' }}>Secure Checkout</h1>
        <p style={{ color: '#94a3b8', marginBottom: '40px' }}>Order: <span style={{ color: 'white', fontWeight: 'bold' }}>{product.name}</span> — Total: <span style={{ color: '#22d3ee', fontWeight: 'bold' }}>${product.price.toFixed(2)}</span></p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
          
          {/* LEFT: PAYMENT STEPS GUIDE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '10px' }}>Payment Steps</h2>
            {[
              { num: '01', title: 'Choose Product', desc: 'Browse all 30 digital products and click "Buy Now".' },
              { num: '02', title: 'Select Method', desc: 'Choose from Razorpay, Alipay, Peach, or direct bank transfer.' },
              { num: '03', title: 'Complete Payment', desc: 'Follow the secure flow. Use Capitec details below for transfers.' },
              { num: '04', title: 'Instant Delivery', desc: 'Receive access immediately to your email after confirmation.' }
            ].map((step) => (
              <div key={step.num} style={{ padding: '15px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: step.num === '04' ? '#166534' : '#164e63', color: step.num === '04' ? '#4ade80' : '#22d3ee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px', flexShrink: 0 }}>{step.num}</span>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>{step.title}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{step.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: BANK DETAILS & ACTION */}
          <div style={{ backgroundColor: '#0B1120', padding: '30px', borderRadius: '20px', border: '1px solid #1e293b', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
            
            {selectedMethod === 'capitec' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                  <span style={{ fontSize: '32px' }}>🇿🇦</span>
                  <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Capitec Bank Transfer</h2>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>South Africa Market</p>
                  </div>
                  <span style={{ marginLeft: 'auto', padding: '4px 10px', backgroundColor: '#166534', color: '#4ade80', borderRadius: '50px', fontSize: '12px', fontWeight: 'bold' }}>✓ Verified</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
                  <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '12px', border: '1px solid #334155' }}>
                    <span style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}>Account Holder</span>
                    <div style={{ fontWeight: 'bold', marginTop: '5px' }}>SUPER DIGITAL</div>
                  </div>
                  <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '12px', border: '1px solid #334155' }}>
                    <span style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}>Account Number</span>
                    <div style={{ fontWeight: 'bold', marginTop: '5px', fontFamily: 'monospace' }}>1975933441</div>
                  </div>
                  <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '12px', border: '1px solid #334155' }}>
                    <span style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}>Swift Code</span>
                    <div style={{ fontWeight: 'bold', marginTop: '5px' }}>CABLZAJJ</div>
                  </div>
                  <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '12px', border: '1px solid #334155' }}>
                    <span style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}>Branch Code</span>
                    <div style={{ fontWeight: 'bold', marginTop: '5px' }}>470010</div>
                  </div>
                </div>

                <div style={{ backgroundColor: 'rgba(30, 58, 138, 0.2)', border: '1px solid #1e3a8a', padding: '15px', borderRadius: '12px', marginBottom: '30px' }}>
                  <p style={{ fontSize: '12px', color: '#bfdbfe', margin: 0 }}>
                    <strong>After payment:</strong> Email proof of payment to <a href="mailto:payments@superdigital.store" style={{ color: '#bfdbfe', textDecoration: 'underline' }}>payments@superdigital.store</a> with your order number.
                  </p>
                </div>

                <button 
                  onClick={handleCapitecConfirmation}
                  disabled={processing}
                  style={{ width: '100%', padding: '15px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? 0.7 : 1 }}
                >
                  {processing ? 'Processing...' : 'Pay with Capitec Bank Transfer'}
                </button>
                <p style={{ textAlign: 'center', marginTop: '15px', color: '#4ade80', fontSize: '12px', fontWeight: 'bold' }}>⚡ Instant delivery after payment confirmation</p>
              </div>
            )}

            {selectedMethod === 'peach' && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ width: '64px', height: '64px', backgroundColor: '#1e293b', borderRadius: '12px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>💳</div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Credit / Debit Card</h2>
                <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Securely powered by Peach Payments.</p>
                <button 
                  onClick={handlePeachPayment}
                  disabled={processing}
                  style={{ width: '100%', maxWidth: '300px', padding: '15px', backgroundColor: '#06b6d4', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: processing ? 'not-allowed' : 'pointer' }}
                >
                  {processing ? 'Processing...' : `Pay $${product.price.toFixed(2)} Securely`}
                </button>
              </div>
            )}

            {(selectedMethod !== 'capitec' && selectedMethod !== 'peach') && (
               <div style={{ textAlign: 'center', padding: '40px' }}>
                 <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', textTransform: 'capitalize' }}>{selectedMethod}</h3>
                 <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Coming soon.</p>
                 <button disabled style={{ padding: '10px 30px', backgroundColor: '#334155', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'not-allowed', opacity: 0.5 }}>Unavailable</button>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#050B14', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <CheckoutInner />
    </Suspense>
  );
}
