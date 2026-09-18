'use client';

import { useState } from 'react';

export default function PaymentPage() {
  const [selectedCountry, setSelectedCountry] = useState('south-africa');

  const item = 'Digital Product';
  const amount = 10.99;
  const orderRef = `ORDER-${Math.floor(Math.random() * 10000)}`;
  
  const phoneNumber = "27641061358";
  const capitecAccountName = "MR MB BLUMENTHAL";
  const capitecAccountNumber = "1975933441";
  const capitecSwiftCode = "CABLZAJJ";
  
  const wiseEmail = "YOUR_WISE_EMAIL_HERE";
  const paypalEmail = "YOUR_PAYPAL_EMAIL_HERE";
  const upiId = "YOUR_UPI_ID_HERE";
  const alipayId = "YOUR_ALIPAY_ID_HERE";
  const weChatId = "YOUR_WECHAT_ID_HERE";

  const whatsappLink = `https://wa.me/${phoneNumber}?text=Order: ${item}, Amount: $${amount}, Ref: ${orderRef}`;

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Order Summary */}
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

        {/* WhatsApp Block */}
        <div className="bg-green-900/10 border border-green-600/50 p-8 rounded-2xl text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Pay via WhatsApp</h2>
          <p className="text-gray-300 mb-6">Fastest method! Chat with us directly.</p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
            className="inline-block w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl">
            Chat to Buy Now
          </a>
        </div>

        {/* Country Selector */}
        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
          <label className="block text-sm font-medium text-gray-300 mb-3">Select Your Country:</label>
          <select 
            value={selectedCountry} 
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white"
          >
            <option value="south-africa">🇿🇦 South Africa</option>
            <option value="usa">🇺 USA</option>
            <option value="india">🇮🇳 India</option>
            <option value="china">🇳 China</option>
          </select>
        </div>

        {/* Banking Details */}
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

        {/* USA Apps */}
        {selectedCountry === 'usa' && (
          <div className="bg-green-900/10 border border-green-600/50 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">🇺🇸 Faster Options for USA</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-black/40 p-3 rounded-lg">
                <p className="font-bold text-green-400">Wise (Recommended)</p>
                <p className="text-gray-300">Email: {wiseEmail}</p>
              </div>
              <div className="bg-black/40 p-3 rounded-lg">
                <p className="font-bold text-blue-400">PayPal</p>
               
