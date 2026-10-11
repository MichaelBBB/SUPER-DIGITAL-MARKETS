'use client';
import { Suspense, useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  }, []);

  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderRef,
        product: itemName,
        amount,
        currency: 'USD',
        paymentMethod: 'card',
        status: 'completed'
      })
    });
    
    setProcessing(false);
    setSuccess(true);
  };

  const handleWhatsApp = () => {
    const message = `*ORDER CONFIRMED - SUPER DIGITAL MARKETS*\n\n*Product:* ${itemName}\n*Amount:* $${amount} USD\n*Ref:* ${orderRef}\n\nI want to pay via Instant EFT.`;
    
    if (isMobile) {
      window.location.href = `whatsapp://send?phone=27743868889&text=${encodeURIComponent(message)}`;
    } else {
      // Desktop: Copy to clipboard AND open WhatsApp Web directly (no alert)
      navigator.clipboard.writeText(message);
      window.open(`https://web.whatsapp.com/send?phone=27743868889&text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-6">
          <div className="text-6xl">✅</div>
          <h1 className="text-3xl font-bold text-green-400">Payment Successful!</h1>
          <p className="text-gray-400">Order: {orderRef}</p>
          <p className="text-gray-400">Product: {itemName}</p>
          <p className="text-2xl font-bold text-cyan-400">${amount} USD</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-bold"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-block px-4 py-2 bg-green-900/30 border border-green-800 rounded-full text-green-400 text-sm font-bold">
            ✅ ORDER CONFIRMED
          </div>
          <h1 className="text-4xl font-bold">Checkout: {itemName}</h1>
          <div className="text-5xl font-bold text-cyan-400">${amount} USD</div>
          <p className="text-gray-300 font-semibold">{itemName}</p>
          <p className="text-gray-500 text-sm">Ref: {orderRef}</p>
        </div>

        {/* Payment Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card Payment */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
               Card Payment
            </h2>
            <p className="text-gray-400 text-sm">Visa / Mastercard accepted</p>
            
            {!showCardForm ? (
              <button 
                onClick={() => setShowCardForm(true)}
                className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all"
              >
                Pay Now by Card
              </button>
            ) : (
              <form onSubmit={handleCardPayment} className="space-y-4">
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="px-4 py-3 bg-black border border-gray-700 rounded-lg text-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="px-4 py-3 bg-black border border-gray-700 rounded-lg text-white"
                    required
                  />
                </div>
                {/* FIXED: Now BLUE (cyan-600) instead of green */}
                <button 
                  type="submit"
                  disabled={processing}
                  className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Complete Payment'}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowCardForm(false)}
                  className="w-full py-2 text-gray-400 text-sm"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>

          {/* WhatsApp */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-green-400 flex items-center gap-2">
              🇦 Instant EFT (South Africa)
            </h2>
            <p className="text-gray-400 text-sm">
              {isMobile ? 'Opens WhatsApp app directly' : 'Copies message + opens WhatsApp Web'}
            </p>
            <button 
              onClick={handleWhatsApp}
              className="w-full py-4 bg-gray-800 hover:bg-gray-700 border border-green-800 text-green-400 font-bold rounded-lg transition-all"
            >
              Send Order on WhatsApp
            </button>
          </div>
        </div>

        {/* Capitec Bank Details */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-cyan-400 mb-6">CAPITEC BANK DETAILS</h2>
          
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
            <p className="text-yellow-200 text-sm">
               SA customers: Select "Immediate Payment" for delivery within minutes.
            </p>
          </div>
        </div>

        <div className="text-center">
          <a href="/" className="text-gray-500 hover:text-white text-sm">
            ← Cancel and Return to Home
          </a>
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
