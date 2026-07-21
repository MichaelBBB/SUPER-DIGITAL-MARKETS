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
  const [capitecSubmitted, setCapitecSubmitted] = useState(false);

  const methods = [
    { id: 'peach', name: 'Peach Payments', sub: 'CARD / INSTANT EFT', flag: '🇿🇦', status: 'temp-unavailable' },
    { id: 'capitec', name: 'Capitec Bank Transfer', sub: 'INSTANT VERIFICATION', flag: '🔵', status: 'active' },
    { id: 'googlepay', name: 'Google Pay', sub: 'COMING SOON', flag: '🌍', status: 'coming-soon' },
  ];

  const handlePeachPayment = () => {
    setProcessing(true);
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/api/peach-payment';
    
    const i1 = document.createElement('input'); i1.type='hidden'; i1.name='amount'; i1.value=product.price.toString();
    const i2 = document.createElement('input'); i2.type='hidden'; i2.name='orderId'; i2.value=`SD-${product.id}`;
    const i3 = document.createElement('input'); i3.type='hidden'; i3.name='productName'; i3.value=product.name;
    
    form.appendChild(i1); form.appendChild(i2); form.appendChild(i3);
    document.body.appendChild(form);
    form.submit();
  };

  const handleCapitecSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    // Auto-send email notification
    const formData = new FormData(e.target as HTMLFormElement);
    const customerEmail = formData.get('email') as string;
    const customerName = formData.get('name') as string;
    
    // Create mailto link with pre-filled details
    const subject = encodeURIComponent(`Payment Proof - Order SD-${product.id}`);
    const body = encodeURIComponent(
      `Hello,\n\nI have made payment for:\n\n` +
      `Product: ${product.name}\n` +
      `Amount: R${product.price.toFixed(2)}\n` +
      `Order ID: SD-${product.id}\n` +
      `Name: ${customerName}\n` +
      `Email: ${customerEmail}\n\n` +
      `Please find attached proof of payment.\n\n` +
      `Banking Details Used:\n` +
      `Account: 1975933441\n` +
      `Branch: 470010\n\n` +
      `Thank you!`
    );
    
    // Open email client
    window.location.href = `mailto:payments@superdigital.store?subject=${subject}&body=${body}`;
    
    setCapitecSubmitted(true);
    setProcessing(false);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white py-12 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <Link href="/products" className="text-cyan-400 hover:text-white mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest">← Back to Products</Link>
        <h1 className="text-4xl font-bold mb-2">Secure Checkout</h1>
        <p className="text-gray-400 mb-8">Order: <span className="text-white font-bold">{product.name}</span> — Total: <span className="text-cyan-400 font-bold">R{product.price.toFixed(2)}</span></p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-3">
            {methods.map((m) => (
              <button 
                key={m.id} 
                onClick={() => m.status === 'active' && setSelectedMethod(m.id)} 
                disabled={m.status !== 'active'}
                className={`w-full p-4 rounded-xl border transition text-left flex items-center justify-between ${
                  selectedMethod === m.id 
                    ? 'border-cyan-500 bg-[#0F172A] shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                    : m.status === 'active'
                    ? 'border-slate-700 bg-[#0F172A]/50 hover:border-slate-600'
                    : 'border-slate-800 bg-[#0F172A]/30 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{m.flag}</span>
                  <div>
                    <div className="font-bold text-sm">{m.name}</div>
                    <div className={`text-[10px] uppercase tracking-wider font-bold ${
                      m.status === 'active' ? 'text-green-400' : 'text-gray-500'
                    }`}>{m.sub}</div>
                  </div>
                </div>
                {selectedMethod === m.id && <span className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center text-xs text-white">✓</span>}
              </button>
            ))}
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* PANEL 1: STEPS */}
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800">
              <h3 className="text-lg font-bold mb-4 text-cyan-400">📋 Payment Steps</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-900/30 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">01</div>
                  <div><h4 className="font-bold text-sm">Choose Product</h4><p className="text-xs text-gray-400">You selected: {product.name}</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-900/30 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">02</div>
                  <div><h4 className="font-bold text-sm">Select Method</h4><p className="text-xs text-gray-400">Capitec Instant EFT</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-900/30 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">03</div>
                  <div><h4 className="font-bold text-sm">Complete Payment</h4><p className="text-xs text-gray-400">Transfer & email proof</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-900/30 border border-green-500/30 flex items-center justify-center text-green-400 font-bold text-sm">04</div>
                  <div><h4 className="font-bold text-sm">Instant Delivery</h4><p className="text-xs text-gray-400">Receive access within 1 hour</p></div>
                </div>
              </div>
            </div>

            {/* PANEL 2: PAYMENT DETAILS */}
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              <div className="relative z-10">
                
                {selectedMethod === 'capitec' && !capitecSubmitted && (
                  <>
                    <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-xl border border-blue-500">🔵</div>
                        <div>
                          <h2 className="text-xl font-bold">Capitec Bank Transfer</h2>
                          <p className="text-slate-400 text-sm">Instant Verification Available</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold">✓ Verified</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <span className="text-gray-500 text-[10px] block">ACCOUNT HOLDER</span>
                        <span className="font-bold">SUPER DIGITAL MARKETS</span>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <span className="text-gray-500 text-[10px] block">ACCOUNT NUMBER</span>
                        <span className="font-bold font-mono text-lg">1975933441</span>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <span className="text-gray-500 text-[10px] block">BRANCH CODE</span>
                        <span className="font-bold">470010</span>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <span className="text-gray-500 text-[10px] block">REFERENCE</span>
                        <span className="font-bold font-mono">SD-{product.id}</span>
                      </div>
                    </div>

                    <div className="bg-blue-900/20 border border-blue-800 p-4 rounded-lg mb-5">
                      <p className="text-sm text-blue-200 mb-2">
                        <strong>⚡ Fast-Track Your Order:</strong>
                      </p>
                      <p className="text-xs text-blue-300">
                        1. Transfer <strong>R{product.price.toFixed(2)}</strong> to the account above<br/>
                        2. Use reference: <strong>SD-{product.id}</strong><br/>
                        3. Click below to email your proof instantly
                      </p>
                    </div>

                    <form onSubmit={handleCapitecSubmit} className="space-y-3">
                      <input 
                        type="text" 
                        name="name" 
                        placeholder="Your Full Name" 
                        required
                        className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                      />
                      <input 
                        type="email" 
                        name="email" 
                        placeholder="Your Email Address" 
                        required
                        className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                      />
                      <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg transition shadow-lg shadow-blue-900/20 disabled:opacity-50"
                      >
                        {processing ? 'Processing...' : 'I've Made Payment - Send Proof'}
                      </button>
                    </form>

                    <p className="text-xs text-gray-500 mt-3 text-center">
                      ⏱️ Average activation time: 30-60 minutes during business hours
                    </p>
                  </>
                )}

                {capitecSubmitted && (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">✅</span>
                    </div>
                    <h3 className="text-2xl font-bold text-green-400 mb-2">Payment Proof Submitted!</h3>
                    <p className="text-gray-400 mb-6">Your email client should have opened. Please attach your proof of payment and send.</p>
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                      <p className="text-sm text-gray-300">
                        <strong>Order ID:</strong> SD-{product.id}<br/>
                        <strong>Amount:</strong> R{product.price.toFixed(2)}<br/>
                        <strong>Status:</strong> Awaiting Verification
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                      We'll activate your account within 1 hour of receiving proof.
                    </p>
                  </div>
                )}

                {selectedMethod === 'peach' && (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-2xl">🇿🇦</span>
                      <div>
                        <h2 className="text-xl font-bold">Peach Payments</h2>
                        <p className="text-slate-400 text-sm">Card / Instant EFT</p>
                      </div>
                    </div>
                    <div className="bg-orange-900/20 border border-orange-800 p-4 rounded-lg mb-5">
                      <p className="text-sm text-orange-300">
                        ⚠️ <strong>Temporarily Unavailable</strong><br/>
                        We're upgrading our payment system. Please use Capitec Transfer for instant processing.
                      </p>
                    </div>
                    <button disabled className="w-full py-4 bg-slate-700 rounded-xl font-bold text-lg cursor-not-allowed opacity-50">
                      Coming Soon
                    </button>
                  </>
                )}

                {selectedMethod === 'googlepay' && (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-2xl">🌍</span>
                      <div>
                        <h2 className="text-xl font-bold">Google Pay</h2>
                        <p className="text-slate-400 text-sm">Universal Payment</p>
                      </div>
                    </div>
                    <button disabled className="w-full py-4 bg-slate-700 rounded-xl font-bold text-lg cursor-not-allowed opacity-50">
                      Coming Soon
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
    <Suspense fallback={<div className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center">Loading...</div>}>
      <CheckoutInner />
    </Suspense>
  );
}
