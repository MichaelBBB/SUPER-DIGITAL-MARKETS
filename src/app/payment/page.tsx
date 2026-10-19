'use client';
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

function PaymentInner() {
  const params = useSearchParams();
  const itemName = params.get('item') || 'Digital Product';
  const amount = Number(params.get('amount')) || 0;
  const orderRef = 'ORD-' + Math.floor(Math.random() * 900000 + 100000);

  const [showCardForm, setShowCardForm] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copiedText, setCopiedText] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  }, []);

  const ALIPAY_ID = 'YourAlipayPhoneOrEmail@alipay.com';
  const UPI_ID = 'YourName@okicici';

  const handleCardPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setSuccess(true); }, 2000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 3000);
  };

  const handleWhatsApp = () => {
    const phone = '27743868889';
    if (isMobile) { window.location.href = `https://wa.me/${phone}`; }
    else { window.open(`https://web.whatsapp.com/send?phone=${phone}`, '_blank'); }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-6">
          <div className="text-6xl">✅</div>
          <h1 className="text-3xl font-bold text-green-400">Payment Successful!</h1>
          <p className="text-gray-400">Order: {orderRef}</p>
          <p className="text-2xl font-bold text-cyan-400">${amount.toFixed(2)} USD</p>
          <div className="flex flex-col gap-4 pt-4">
            <a href="/" className="block w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-bold">Return to Home</a>
            <a href="/products" className="block w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-bold">Return to Products</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6 relative">
      {copiedText && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-bold animate-pulse">
          ✅ {copiedText} copied!
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-3 pt-4">
          <div className="inline-block px-4 py-1 bg-green-900/30 border border-green-800 rounded-full text-green-400 text-xs font-bold">✅ ORDER CONFIRMED</div>
          <h1 className="text-3xl md:text-4xl font-bold">Checkout: {itemName}</h1>
          <div className="text-4xl md:text-5xl font-bold text-cyan-400">${amount.toFixed(2)} USD</div>
          <p className="text-gray-500 text-sm">Ref: {orderRef}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">💳 Card Payment</h2>
            <p className="text-gray-400 text-sm">Visa / Mastercard accepted. Instant.</p>
            {!showCardForm ? (
              <button onClick={() => setShowCardForm(true)} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all">Pay Now by Card</button>
            ) : (
              <form onSubmit={handleCardPayment} className="space-y-3">
                <input type="text" placeholder="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white" required />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="px-4 py-3 bg-black border border-gray-700 rounded-lg text-white" required />
                  <input type="text" placeholder="CVV" value={cvv} onChange={(e) => setCvv(e.target.value)} className="px-4 py-3 bg-black border border-gray-700 rounded-lg text-white" required />
                </div>
                <button type="submit" disabled={processing} className="w-full py-3 bg-cyan-600 text-white font-bold rounded-lg disabled:opacity-50">{processing ? 'Processing...' : 'Complete Payment'}</button>
                <button type="button" onClick={() => setShowCardForm(false)} className="w-full py-2 text-gray-400 text-sm">Cancel</button>
              </form>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-green-400 flex items-center gap-2">💬 WhatsApp</h2>
            <p className="text-gray-400 text-sm">{isMobile ? 'Opens your installed WhatsApp app' : 'Opens WhatsApp Web chat screen'}</p>
            <button onClick={handleWhatsApp} className="w-full py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-lg transition-all">Open WhatsApp to Chat</button>
          </div>

          <div className="bg-yellow-400 border border-yellow-500 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-black flex items-center gap-2">🇮🇳 Google Pay (India)</h2>
            <p className="text-black text-sm font-medium">Click to copy UPI ID</p>
            <button onClick={() => copyToClipboard(UPI_ID, 'Google Pay UPI ID')} className="w-full py-3 bg-black hover:bg-gray-900 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 text-lg">
              <span className="text-2xl font-bold">G</span> <span className="text-xl">Pay</span>
            </button>
            <p className="text-black text-xs font-medium text-center">ID: {UPI_ID}</p>
          </div>

          <div className="bg-red-600 border border-red-700 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">🇨🇳 Alipay (China)</h2>
            <p className="text-white text-sm font-medium">Click to copy Alipay ID</p>
            <button onClick={() => copyToClipboard(ALIPAY_ID, 'Alipay ID')} className="w-full py-3 bg-white hover:bg-gray-200 text-red-600 font-bold rounded-lg transition-all text-lg">Copy Alipay ID</button>
            <p className="text-white text-xs font-medium text-center">ID: {ALIPAY_ID}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-cyan-400 mb-6 flex items-center gap-2">🇿🇦 CAPITEC BANK DETAILS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/50 p-4 rounded-lg"><p className="text-gray-500 text-xs mb-1">Account Holder</p><p className="font-bold text-white">SUPER DIGITAL</p></div>
            <div className="bg-black/50 p-4 rounded-lg"><p className="text-gray-500 text-xs mb-1">Account Number</p><p className="font-bold text-cyan-400">1975933441</p></div>
            <div className="bg-black/50 p-4 rounded-lg"><p className="text-gray-500 text-xs mb-1">Branch Code</p><p className="font-bold text-white">470010 / CABLZAJJ</p></div>
            <div className="bg-black/50 p-4 rounded-lg"><p className="text-gray-500 text-xs mb-1">Reference</p><p className="font-bold text-yellow-400">{orderRef}</p></div>
          </div>
        </div>

        <div className="text-center pb-8 space-y-3 pt-4">
          <a href="/" className="block text-gray-400 hover:text-white text-sm transition-colors">← Cancel and Return to Home</a>
          <a href="/products" className="block text-cyan-400 hover:text-cyan-300 text-sm transition-colors">← Return to Products</a>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
      <PaymentInner />
    </Suspense>
  );
}
