'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

function PaymentContent() {
  const searchParams = useSearchParams();
  const item = searchParams.get('item') || 'Digital Product';
  const amount = parseFloat(searchParams.get('amount') || '0.00');
  
  const [selectedCountry, setSelectedCountry] = useState('south-africa');

  const phoneNumber = "27641061358"; 
  const capitecAccountName = "MR MB BLUMENTHAL";
  const capitecAccountNumber = "1975933441";
  const capitecSwiftCode = "CABLZAJJ";
  
  const wiseEmail = "YOUR_WISE_EMAIL_HERE";
  const paypalEmail = "YOUR_PAYPAL_EMAIL_HERE";
  const upiId = "YOUR_UPI_ID_HERE";
  const alipayId = "YOUR_ALIPAY_ID_HERE";
  const weChatId = "YOUR_WECHAT_ID_HERE";
  
  const orderRef = `ORDER-${Math.floor(Math.random() * 10000)}`;

  const getWhatsAppMessage = () => {
    return `Hi! Order: ${item}, Amount: $${amount}, Ref: ${orderRef}. Payment sent!`;
  };

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${getWhatsAppMessage()}`;

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <nav className="mb-8 border-b border-gray-800 pb-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <span className="text-xl font-bold text-cyan-400">SUPER DIGITAL</span>
          <a href="/" className="text-sm text-gray-400 hover:text-white">Back Home</a>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* ORDER SUMMARY */}
        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 text-center">
          <h1 className="text-3xl font-bold mb-2">Complete Your Purchase</h1>
          <div className="bg-black/50 p-6 rounded-xl mt-6">
            <p className="text-gray-400 text-sm">Item</p>
            <p className="text-xl font-semibold text-white mb-2">{item}</p>
            <div className="h-px bg-gray-800 my-3"></div>
            <p className="text-gray-400 text-sm">Total</p>
            <p className="text-5xl font-bold text-green-400">${amount.toFixed(2)}</p>
          </div>
        </div>

        {/* WHATSAPP BLOCK */}
        <div className="bg-green-900/10 border border-green-600/50 p-8 rounded-2xl text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Pay via WhatsApp</h2>
          <p className="text-gray-300 mb-6">Fastest method! Chat with us directly.</p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
            className="inline-block w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl">
            Chat to Buy Now
          </a>
        </div>

        {/* COUNTRY SELECTOR */}
        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
          <label className="block text-sm font-medium text-gray-300 mb-3">Select Your Country:</label>
          <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white">
            <option value="south-africa">🇿🇦 South Africa</option>
            <option value="usa">🇺🇸 USA</option>
            <option value="india">🇮🇳 India</option>
            <option value="china">🇨🇳 China</option>
          </select>
        </div>

        {/* BANKING DETAILS */}
        <div className="bg-blue-900/20 border border-blue-600/50 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Capitec Banking Details</h2>
          <div className="space-y-4 bg-black/40 p-6 rounded-xl border border-blue-800/50">
            <div className="flex justify-between border-b border-gray-800 pb-3">
              <span className="text-gray-400">Bank:</span>
              <span className="text-white font-bold">Capitec</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-3">
              <span className="text-gray-400">Account Name:</span>
              <span className="text-white font-bold">{capitecAccountName}</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-3">
              <span className="text-gray-400">Account Number:</span>
              <span className="text-green-400 font-mono">{capitecAccountNumber}</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-3">
              <span className="text-gray-400">SWIFT Code:</span>
              <span className="text-green-400 font-mono font-bold">{capitecSwiftCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Reference:</span>
              <span className="text-yellow-400 font-mono">{orderRef}</span>
            </div>
          </div>
        </div>

        {/* USA APPS */}
        {selectedCountry === 'usa' && (
          <div className="bg-green-900/10 border border-green-600/50 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">🇺🇸 Faster Options for USA</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-black/40 p-3 rounded-lg">
                <p className="font-bold text-green-400">Wise</p>
                <p className="text-gray-300">Email: {wiseEmail}</p>
              </div>
              <div className="bg-black/40 p-3 rounded-lg">
                <p className="font-bold text-blue-400">PayPal</p>
                <p className="text-gray-300">Email: {paypalEmail}</p>
              </div>
            </div>
          </div>
        )}

        {/* INDIA APPS */}
        {selectedCountry === 'india' && (
          <div className="bg-green-900/10 border border-green-600/50 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">🇮🇳 Faster Options for India</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-black/40 p-3 rounded-lg">
                <p className="font-bold text-green-400">UPI</p>
                <p className="text-gray-300">UPI ID: {upiId}</p>
              </div>
              <div className="bg-black/40 p-3 rounded-lg">
                <p className="font-bold text-blue-400">Wise</p>
                <p className="text-gray-300">Email: {wiseEmail}</p>
              </div>
            </div>
          </div>
        )}

        {/* CHINA APPS */}
        {selectedCountry === 'china' && (
          <div className="bg-green-900/10 border border-green-600/50 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">🇨🇳 Faster Options for China</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-black/40 p-3 rounded-lg">
                <p className="font-bold text-green-400">Alipay</p>
                <p className="text-gray-300">Alipay ID: {alipayId}</p>
              </div>
              <div className="bg-black/40 p-3 rounded-lg">
                <p className="font-bold text-blue-400">WeChat</p>
                <p className="text-gray-300">WeChat ID: {weChatId}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
