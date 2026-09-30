'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentForm() {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [peachLoading, setPeachLoading] = useState(false);

  const amount = parseFloat(searchParams.get('amount') || '0');
  const itemName = searchParams.get('item') || 'Digital Product';
  // Generate a short, easy-to-read Order ID for WhatsApp references
  const orderId = `ORD-${Date.now().toString().slice(-6)}`; 
  
  // Replace with your actual WhatsApp number (with country code, no +)
  const YOUR_WHATSAPP = '27821234567'; 

  // ⚡ UPDATED: High-Priority Instant Payment Message
  const handleWhatsAppOrder = () => {
    const message = `⚡ *INSTANT ORDER: SUPER DIGITAL MARKETS* ⚡%0A%0A*Product:* ${itemName}%0A*Amount:* R${amount.toFixed(2)} ZAR%0A*Ref:* ${orderId}%0A%0A*🔥 HOW TO PAY INSTANTLY 🔥*%0APlease use your banking app's *"Immediate Payment"* (RTC) feature to ensure I receive this NOW.%0A%0A*Bank:* Capitec%0A*Account:* 1975933441%0A*Branch:* 470010%0A*Ref:* ${orderId}%0A%0A_Reply "PAID" once sent for immediate delivery!_`;
    
    window.open(`https://wa.me/${YOUR_WHATSAPP}?text=${message}`, '_blank');
  };

  const copyAccountDetails = () => {
    const text = `Capitec Bank\nAccount Holder: SUPER DIGITAL\nAccount Number: 1975933441\nBranch Code: 470010\nReference: ${orderId}\nAmount: R${amount.toFixed(2)} ZAR\n\n(Use "Immediate Payment" for instant delivery)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePeachPayment = async () => {
    setPeachLoading(true);
    try {
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency: 'ZAR', productName: itemName, orderId })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.details?.message || data.error || 'Payment failed');
      } else if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      alert(`Peach Payments Error:\n\n${error.message}\n\nPlease use the WhatsApp option below for instant service.`);
    } finally {
      setPeachLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8">
        <div>
          <a href="/products" className="text-blue-400 hover:text-blue-300 mb-6 inline-block flex items-center gap-1">
            ← Return to Products
          </a>
          <h2 className="text-3xl font-bold mb-8">How to Pay</h2>
          
          {/* Peach Option (Still there, but secondary now) */}
          <div 
            onClick={handlePeachPayment}
            className={`bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6 cursor-pointer transition-all hover:bg-gray-800 ${peachLoading ? 'opacity-70 pointer-events-none' : ''}`}
          >
            <h3 className="text-xl font-bold text-gray-300 mb-2">Option 1: Card Payment</h3>
            <p className="text-gray-400 text-sm">Standard processing (1-2 days settlement).</p>
          </div>

          {/* WHATSAPP OPTION - NOW THE STAR OF THE SHOW */}
          <div className="bg-green-900/20 border-2 border-green-500 rounded-xl p-6 mb-6 shadow-lg shadow-green-500/10">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.226 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <h3 className="text-2xl font-bold text-green-400">⚡ Option 2: Instant EFT (Recommended)</h3>
            </div>
            <p className="text-white mb-4">
              Click below to open WhatsApp. The message includes instructions for <strong>Immediate Payment</strong> so I receive the funds instantly.
            </p>
            <button 
              onClick={handleWhatsAppOrder}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-6 rounded-lg transition-all flex justify-center items-center gap-3 shadow-lg hover:shadow-green-500/25 hover:scale-[1.02]"
            >
              Start Instant Order on WhatsApp
            </button>
          </div>
        </div>

        <div>
          <div className="text-center mb-8">
            <p className="text-gray-400 uppercase tracking-wider text-sm mb-2">Total Amount</p>
            <div className="text-5xl font-extrabold text-cyan-400 mb-2">
              R{amount.toFixed(2)} ZAR
            </div>
          </div>

          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative bg-gray-950 px-4 text-sm text-gray-500">
              OR COPY BANK DETAILS
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative">
            <h3 className="text-cyan-400 font-bold text-lg mb-4">CAPITEC BANK DETAILS</h3>
            <button 
              onClick={copyAccountDetails}
              className="absolute top-6 right-6 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all flex items-center gap-2"
            >
              {copied ? 'Copied!' : 'Copy Details'}
            </button>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-gray-950/50 p-4 rounded-lg border border-gray-800">
                <p className="text-gray-500 text-xs mb-1">Account Holder</p>
                <p className="font-semibold text-white">SUPER DIGITAL</p>
              </div>
              <div className="bg-gray-950/50 p-4 rounded-lg border border-gray-800">
                <p className="text-gray-500 text-xs mb-1">Account Number</p>
                <p className="font-mono text-cyan-400">1975933441</p>
              </div>
              <div className="bg-gray-950/50 p-4 rounded-lg border border-gray-800">
                <p className="text-gray-500 text-xs mb-1">Branch Code</p>
                <p className="font-mono text-white">470010</p>
              </div>
              <div className="bg-gray-950/50 p-4 rounded-lg border border-gray-800">
                <p className="text-gray-500 text-xs mb-1">Reference</p>
                <p className="font-mono text-yellow-400">{orderId}</p>
              </div>
            </div>
            
            <div className="mt-6 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded text-sm text-yellow-200">
              ⚡ <strong>Tip:</strong> Select "Immediate Payment" in your bank app to ensure delivery within minutes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
