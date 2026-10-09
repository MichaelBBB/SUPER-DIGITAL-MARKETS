'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function PaymentInner() {
  const params = useSearchParams();
  const urlItem = (params.get('item') || '').trim();
  const rawAmount = Number(params.get('amount') || 0);

  const itemName = ['', 'digital product', 'test product'].includes(urlItem.toLowerCase()) ? 'Digital Product' : urlItem;
  const amount = rawAmount > 0 && rawAmount !== 10.99 ? rawAmount : 0;
  
  const [orderRef, setOrderRef] = useState('');
  const [cardStatus, setCardStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  useEffect(() => {
    setOrderRef('ORD-' + Math.floor(Math.random() * 900000 + 100000));
  }, []);

  const startPeach = async () => {
    setCardStatus('loading');
    const payload = { item: itemName, amount };
    
    try {
      const res = await fetch('/api/peach-checkout', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      });
      
      if (!res.ok) {
        setCardStatus('error');
        return;
      }
      
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCardStatus('error');
      }
    } catch (err) {
      setCardStatus('error');
    }
  };

  // Universal WhatsApp Link (Works best on mobile, shows QR on desktop)
  const waMessage = `*ORDER CONFIRMED - SUPER DIGITAL MARKETS*\n\n*Ref:* ${orderRef}\n*Product:* ${itemName}\n*Total:* $${amount} USD\n\n--- HOW TO PAY ---\n\n🌍 INTERNATIONAL BUYERS:\nUse the "Pay Now by Card" button.\n\n SOUTH AFRICA (INSTANT EFT):\nBank: Capitec\nAcc: 1975933441\nBranch: 470010 / CABLZAJJ\nRef: ${orderRef}\n\nReply PAID after transfer.`;
  
  const waLink = `https://api.whatsapp.com/send?phone=27743868889&text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-block px-3 py-1 bg-green-900/30 border border-green-800 rounded-full text-green-400 text-xs font-bold mb-2">
              ✅ ORDER CONFIRMED
            </div>
            <span className="text-gray-400 text-sm ml-2">Ref: {orderRef || 'Generating...'}</span>
            <h1 className="text-3xl font-bold mt-2">Checkout: {itemName}</h1>
            <p className="text-gray-400">Choose your preferred instant payment method below.</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-cyan-400">${amount} USD</p>
            <p className="text-gray-500 text-sm">(SA customers: transfer ZAR equivalent)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-cyan-400 mb-2 flex items-center gap-2">
                🌍 Card Payment (USA, India, China, International)
              </h2>
              <p className="text-gray-400 text-sm mb-4">Visa / Mastercard accepted. Fully automated and instant.</p>
              
              <button 
                onClick={startPeach}
                disabled={cardStatus === 'loading'}
                className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50"
              >
                {cardStatus === 'loading' ? 'Connecting...' : 'Pay Now by Card'}
              </button>
              
              {cardStatus === 'error' && (
                <div className="mt-4 p-4 bg-red-900/30 border border-red-800 rounded-lg">
                  <p className="text-red-400 text-sm font-bold">Could not reach Peach Gateway.</p>
                  <p className="text-gray-400 text-xs mt-1">Please use WhatsApp or EFT below.</p>
                </div>
              )}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-green-400 mb-2 flex items-center gap-2">
                🇿 Instant EFT (South Africa)
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                Sends your confirmed order with instant payment instructions via WhatsApp.
              </p>
              
              <a 
                href={waLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-4 bg-gray-800 hover:bg-gray-700 border border-green-800 text-green-400 font-bold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                Send Confirmed Order on WhatsApp
              </a>
            </div>

          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 h-fit">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-cyan-400">CAPITEC BANK DETAILS</h2>
              <button 
                onClick={() => navigator.clipboard.writeText(`Capitec\nAcc: 1975933441\nBranch: 470010 / CABLZAJJ\nRef: ${orderRef}`)}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300"
              >
                Copy Details
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                <p className="font-bold text-yellow-400">{orderRef || 'Loading...'}</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-800/50 rounded-lg">
              <p className="text-yellow-200 text-sm">
                ⚡ SA customers: Select "Immediate Payment" in your bank app for delivery within minutes.
              </p>
            </div>
          </div>

        </div>
        
        <div className="text-center pt-8">
           <Link href="/" className="text-gray-500 hover:text-white text-sm">← Cancel and Return to Home</Link>
        </div>

      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center">Loading checkout...</div>}>
      <PaymentInner />
    </Suspense>
  );
}
