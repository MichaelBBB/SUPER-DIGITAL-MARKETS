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
        
        {/* 1. ORDER SUMMARY */}
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

        {/* 2. WHATSAPP PAYMENT BLOCK - NOW DIRECTLY BELOW ORDER SUMMARY */}
        <div className="bg-green-900/10 border border-green-600/50 p-8 rounded-2xl text-center shadow-lg shadow-green-900/20">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Pay via WhatsApp (Recommended)</h2>
          <p className="text-gray-300 mb-6">Fastest method! Chat with us directly for instant payment instructions and order confirmation.</p>
          
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-xl shadow-lg transition-all transform hover:scale-105"
          >
            Chat to Buy Now
          </a>
          
          <p className="text-xs text-gray-500 mt-4">Available 24/7 • Instant Response</p>
        </div>

        {/* 3. COUNTRY SELECTOR */}
        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Select Your Country:
          </label>
          <select 
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="south-africa">🇿🇦 South Africa</option>
            <option value="usa">🇺 USA</option>
            <option value="india">🇮🇳 India</option>
            <option value="china">🇨🇳 China</option>
          </select>
        </div>

        {/* 4. BANKING DETAILS */}
        <div className="bg-blue-900/20 border border-blue-600/50 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center"> Capitec Banking Details</h2>
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
