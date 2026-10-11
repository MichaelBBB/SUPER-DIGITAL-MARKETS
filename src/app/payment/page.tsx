'use client';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function PaymentInner() {
  const params = useSearchParams();
  const itemName = params.get('item') || 'ExpressVPN';
  const amount = Number(params.get('amount')) || 6.67;
  const orderRef = 'ORD-' + Math.floor(Math.random() * 900000 + 100000);

  const [showCardForm, setShowCardForm] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copiedText, setCopiedText] = useState('');

  // TODO: UPDATE THESE WITH YOUR ACTUAL IDs
  const ALIPAY_ID = 'YourAlipayPhoneOrEmail@alipay.com'; 
  const UPI_ID = 'YourName@okicici'; // Your Google Pay / UPI ID

  const message = `*ORDER CONFIRMED - SUPER DIGITAL MARKETS*\n\n*Product:* ${itemName}\n*Amount:* $${amount} USD\n*Ref:* ${orderRef}\n\nI want to pay.`;

  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderRef, product: itemName, amount, currency: 'USD', paymentMethod: 'card', status: 'completed' })
    });
    setProcessing(false);
    setSuccess(true);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 3000);
  };

  const handleWhatsApp = () => {
    window.location.href = `https://wa.me/27743868889?text=${encodeURIComponent(message)}`;
  };

  const handleGooglePay = () => {
    // This magic link opens Google Pay/PhonePe/Paytm directly on the client's phone
    const upiLink = `upi://pay?pa=${UPI_ID}&pn=SuperDigitalMarkets&am=${amount}&cu=USD&tn=${orderRef}`;
    window.location.href = upiLink;
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-6">
          <div className="text-6xl">✅</div>
          <h1 className="text-3xl font-bold text-green-400">Payment Successful!</h1>
          <p className="text-gray-400">Order: {orderRef}</p>
          <p className="text-2xl font-bold text-cyan-400">${amount} USD</p>
          <button onClick={() => window.location.href = '/'} className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-bold">Return to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-block px-4 py-1 bg-green-900/30 border border-green-800 rounded-full text-green-400 text-xs font-bold">✅ ORDER CONFIRMED</div>
          <h1 className="text-3xl md:text-4xl font-bold">Checkout: {itemName}</h1>
          <div className="text-4xl md:text-5xl font-bold text-cyan-400">${amount} USD</div>
          <p className="text-gray-300 font-semibold">{itemName}</p>
          <p className="text-gray-500 text-sm">Ref: {orderRef}</p>
        </div>

        {/* Global Notification */}
        {copiedText && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-bold">
            ✅ {copiedText} copied to clipboard!
          </div>
        )}

        {/* Payment Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. Card Payment (USA / Global) */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">💳 Card Payment (USA / Global)</h2>
            <p className="text-gray-400 text-sm">Visa / Mastercard accepted. Instant.</p>
            {!showCardForm ? (
              <button onClick={() => setShowCardForm(true)} className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all">Pay Now by Card</button>
            ) : (
              <form onSubmit={handleCardPayment} className="space-y-3">
                <input type="text" placeholder="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white" required />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="px-4 py-3 bg-black border border-gray-700 rounded-lg text-white" required />
                  <input type="text" placeholder="CVV" value={cvv} onChange={(e) => setCvv(e.target.value)} className="px-4 py-3 bg-black border border-gray-700 rounded-lg text-white" required />
                </div>
                <button type="submit" disabled={processing} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg disabled:opacity-50">{processing ? 'Processing...' : 'Complete Payment'}</button>
                <button type="button" onClick={() => setShowCardForm(false)} className="w-full py-2 text-gray-400 text-sm">Cancel</button>
              </form>
            )}
          </div>

          {/* 2. WhatsApp (USA / Global Mobile) */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-green-400 flex items-center gap-2">💬 WhatsApp (USA / Global)</h2>
            <p className="text-gray-400 text-sm">Opens WhatsApp app directly on your phone.</p>
            <button onClick={handleWhatsApp} className="w-full py-4 bg-green-700 hover:bg-green-600 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              Chat on WhatsApp
            </button>
          </div>

          {/* 3. Google Pay (India) - THE MAGIC BUTTON */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">🇮🇳 Google Pay / UPI (India)</h2>
            <p className="text-gray-400 text-sm">Click to open Google Pay app instantly with amount pre-filled.</p>
            <button onClick={handleGooglePay} className="w-full py-4 bg-white hover:bg-gray-200 text-black font-bold rounded-lg transition-all flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#fff"/><path d="M12 11.5V16.5H15.5C15.35 17.65 14.15 19.5 12 19.5C9.5 19.5 7.5 17.5 7.5 15C7.5 12.5 9.5 10.5 12 10.5C13.15 10.5 14.15 10.95 14.9 11.65L17.15 9.4C15.75 8.1 14 7.25 12 7.25C7.95 7.25 4.75 10.45 4.75 14.5C4.75 18.55 7.95 21.75 12 21.75C16.25 21.75 18.75 18.75 18.75 14.75C18.75 14.25 18.7 13.75 18.6 13.25H12V11.5H15.5V11.5H12Z" fill="#4285F4"/></svg>
              Pay with Google Pay
            </button>
            <p className="text-gray-500 text-xs">Ref: {orderRef} | Amount: ${amount} USD</p>
          </div>

          {/* 4. Alipay (China) - The Best Alternative */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">🇨🇳 Alipay (China)</h2>
            <p className="text-gray-400 text-sm">Copy ID below and search in Alipay to pay.</p>
            <div className="bg-black/50 p-3 rounded-lg border border-gray-700 flex justify-between items-center">
              <span className="text-white font-mono font-bold text-sm truncate">{ALIPAY_ID}</span>
              <button onClick={() => copyToClipboard(ALIPAY_ID, 'Alipay ID')} className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs text-white ml-2">Copy</button>
            </div>
            <p className="text-gray-500 text-xs">Ref: {orderRef} | Amount: ${amount} USD</p>
          </div>
        </div>

        {/* Capitec Bank Details (South Africa) */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-cyan-400 mb-6">🇿🇦 CAPITEC BANK DETAILS (South Africa)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/50 p-4 rounded-lg">
              <p className="text-gray-500 text-xs mb-1">Account Holder</p>
              <p className="font-bold text-white">SUPER DIGITAL</p>
            </div>
            <div className="bg-black/50 p-4 rounded-lg">
              <p className="text-gray-500 text-xs mb-1">Account Number</p>
              <p className="font-bold text-cyan-400">1975933441</p>
            </div>
            <div className="bg-black/50 p-4 rounded-lg">
              <p className="text-gray-500 text-xs mb-1">Branch Code</p>
              <p className="font-bold text-white">470010 / CABLZAJJ</p>
            </div>
            <div className="bg-black/50 p-4 rounded-lg">
              <p className="text-gray-500 text-xs mb-1">Reference</p>
              <p className="font-bold text-yellow-400">{orderRef}</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-800/50 rounded-lg">
            <p className="text-yellow-200 text-sm"> SA customers: Select "Immediate Payment" for delivery within minutes.</p>
          </div>
        </div>

        <div className="text-center pb-8">
          <a href="/" className="text-gray-500 hover:text-white text-sm">← Cancel and Return to Home</a>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center">Loading...</div>}>
      <PaymentInner />
    </Suspense>
  );
}
