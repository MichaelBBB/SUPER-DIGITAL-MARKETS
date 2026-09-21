'use client';

import { useState } from 'react';

export default function PaymentPage() {
  const [country, setCountry] = useState('sa');

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Order Summary */}
        <div className="bg-gray-900 p-6 rounded-xl text-center">
          <h1 className="text-2xl font-bold">Complete Your Purchase</h1>
          <p className="text-3xl font-bold text-green-400 mt-4">$10.99</p>
        </div>

        {/* WhatsApp Button */}
        <a href="https://wa.me/27641061358" target="_blank" rel="noopener noreferrer"
          className="block w-full py-4 bg-green-600 text-white font-bold rounded-xl text-center">
          Chat to Buy Now
        </a>

        {/* Country Selector */}
        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
          <label className="block text-sm mb-2">Select Your Country:</label>
          <select 
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white"
          >
            <option value="sa">🇿🇦 South Africa</option>
            <option value="usa">🇺 USA</option>
            <option value="india">🇮🇳 India</option>
            <option value="china">🇨🇳 China</option>
          </select>
        </div>

        {/* Banking Details - SWIFT FOR ALL */}
        <div className="bg-blue-900/20 border border-blue-600/50 p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Capitec Banking Details</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Bank:</strong> Capitec</p>
            <p><strong>Account:</strong> MR MB BLUMENTHAL</p>
            <p><strong>Number:</strong> 1975933441</p>
            <p><strong>SWIFT:</strong> CABLZAJJ</p>
            <p><strong>Reference:</strong> ORDER-1234</p>
          </div>
          
          {/* SHORT INSTRUCTIONS FOR SA CLIENTS */}
          <div className="mt-4 pt-4 border-t border-blue-800">
            <h3 className="font-bold text-sm mb-2">How to Pay:</h3>
            <ol className="text-xs space-y-1 list-decimal list-inside text-gray-300">
              <li>Open your bank app (FNB, Standard Bank, etc.)</li>
              <li>Select "Pay Beneficiary" or "Send Money"</li>
              <li>Enter the Capitec details above</li>
              <li>Use SWIFT code: <strong>CABLZAJJ</strong></li>
              <li>Use the Reference number shown</li>
              <li>Select "Immediate Payment"</li>
              <li>Click WhatsApp button to send proof</li>
            </ol>
          </div>
        </div>

        {/* USA PANEL */}
        {country === 'usa' && (
          <div className="bg-green-900/20 border border-green-600 p-6 rounded-xl">
            <h3 className="font-bold mb-2">🇺 Faster Options for USA</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Wise:</strong> YOUR_WISE_EMAIL</p>
              <p><strong>PayPal:</strong> YOUR_PAYPAL_EMAIL</p>
              <p className="text-xs text-gray-400 mt-2">Or use SWIFT CABLZAJJ above</p>
            </div>
          </div>
        )}

        {/* INDIA PANEL */}
        {country === 'india' && (
          <div className="bg-green-900/20 border border-green-600 p-6 rounded-xl">
            <h3 className="font-bold mb-2">🇮🇳 Faster Options for India</h3>
            <div className="space-y-2 text-sm">
              <p><strong>UPI:</strong> YOUR_UPI_ID</p>
              <p><strong>Wise:</strong> YOUR_WISE_EMAIL</p>
              <p className="text-xs text-gray-400 mt-2">Or use SWIFT CABLZAJJ above</p>
            </div>
          </div>
        )}

        {/* CHINA PANEL */}
        {country === 'china' && (
          <div className="bg-green-900/20 border border-green-600 p-6 rounded-xl">
            <h3 className="font-bold mb-2">🇳 Faster Options for China</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Alipay:</strong> YOUR_ALIPAY_ID</p>
              <p><strong>WeChat:</strong> YOUR_WECHAT_ID</p>
              <p className="text-xs text-gray-400 mt-2">Or use SWIFT CABLZAJJ above</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
