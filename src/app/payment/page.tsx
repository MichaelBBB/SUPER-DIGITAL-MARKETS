'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

function PaymentContent() {
  const searchParams = useSearchParams();
  const item = searchParams.get('item') || 'Digital Product';
  const amount = parseFloat(searchParams.get('amount') || '0.00');
  
  // YOUR CAPITEC DETAILS (SAME FOR ALL COUNTRIES)
  const phoneNumber = "27641061358"; 
  const capitecAccountName = "MR MB BLUMENTHAL";
  const capitecAccountNumber = "1975933441";
  const capitecSwiftCode = "CABLZAJJ"; // WORKS FOR EVERYONE!
  const capitecBankAddress = "1 Neutron Street, Techno Park, Stellenbosch, 7600, South Africa";
  
  // App Placeholders
  const wiseEmail = "YOUR_WISE_EMAIL_HERE";
  const upiId = "YOUR_UPI_ID_HERE";
  const alipayId = "YOUR_ALIPAY_ID_HERE";
  
  const orderRef = `ORDER-${Math.floor(Math.random() * 10000)}`;
  const [selectedCountry, setSelectedCountry] = useState('south-africa');

  const getWhatsAppMessage = () => {
    const base = `Hi Super Digital Markets! %0A%0A🛒 *ORDER*%0AItem: ${encodeURIComponent(item)}%0AAmount: $${amount.toFixed(2)}%0ARef: ${orderRef}%0A%0A✅ Payment sent via details shown below.`;
    return base;
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
        
        {/* Order Summary */}
        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 text-center">
          <h1 className="text-3xl font-bold mb-2">Complete Purchase</h1>
          <div className="bg-black/50 p-6 rounded-xl mt-6">
            <p className="text-gray-400 text-sm">Item</p>
            <p className="text-xl font-semibold text-white mb-2">{item}</p>
            <div className="h-px bg-gray-800 my-3"></div>
            <p className="text-gray-400 text-sm">Total</p>
            <p className="text-5xl font-bold text-green-400">${amount.toFixed(2)}</p>
          </div>
        </div>

        {/* Country Selector (For Recommended Apps Only) */}
        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
          <label className="block text-sm font-medium text-gray-300 mb-3">Your Country (For App Recommendations):</label>
          <select 
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white"
          >
            <option value="south-africa">🇿🇦 South Africa</option>
            <option value="usa">🇺🇸 USA</option>
            <option value="india">🇮🇳 India</option>
            <option value="china">🇨🇳 China</option>
            <option value="other">🌍 Other</option>
          </select>
        </div>

        {/* UNIVERSAL BANKING DETAILS - SAME FOR ALL */}
        <div className="bg-blue-900/20 border border-blue-600/50 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center"> Capitec Banking Details</h2>
          <p className="text-center text-gray-400 mb-6 text-sm">Use these details from ANY country</p>
          
          <div className="space-y-4 bg-black/40 p-6 rounded-xl border border-blue-800/50">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <span className="text-gray-400">Bank:</span>
              <span className="text-white font-bold text-lg">Capitec</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <span className="text-gray-400">Account Name:</span>
              <span className="text-white font-bold">{capitecAccountName}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <span className="text-gray-400">Account Number:</span>
              <span className="text-green-400 font-mono text-xl">{capitecAccountNumber}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <span className="text-gray-400">SWIFT/BIC Code:</span>
              <span className="text-green-400 font-mono font-bold text-lg">CABLZAJJ</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <span className="text-gray-400">Bank Address:</span>
              <span className="text-white text-xs text-right max-w-[250px]">{capitecBankAddress}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Payment Reference:</span>
              <span className="text-yellow-400 font-mono">{orderRef}</span>
            </div>
          </div>

          <div className="mt-6 bg-blue-900/30 p-4 rounded-lg border border-blue-700/50">
            <h3 className="font-bold text-blue-200 mb-2">📝 How to Pay:</h3>
            <ol className="text-sm text-blue-100 space-y-2 list-decimal list-inside">
              <li>Open YOUR banking app (any bank, any country)</li>
              <li>Select "International Transfer" or "SWIFT"</li>
              <li>Enter the Capitec details shown above</li>
              <li>Use the Payment Reference exactly as shown</li>
              <li>Click WhatsApp button below to send proof</li>
            </ol>
          </div>
        </div>

        {/* RECOMMENDED APPS BY COUNTRY */}
        <div className="bg-green-900/10 border border-green-600/50 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-4">⭐ Faster/Cheaper Options (Optional)</h3>
          {selectedCountry === 'south-africa' && (
            <p className="text-gray-300 text-sm">Use your local bank app for instant EFT (Branch Code: 470010)</p>
          )}
          {selectedCountry === 'usa' && (
            <div className="text-gray-300 text-sm space-y-2">
              <p><strong>Wise:</strong> {wiseEmail}</p>
              <p><strong>PayPal:</strong> YOUR_PAYPAL_EMAIL</p>
            </div>
          )}
          {selectedCountry === 'india' && (
            <div className="text-gray-300 text-sm space-y-2">
              <p><strong>UPI:</strong> {upiId}</p>
              <p><strong>Wise:</strong> {wiseEmail}</p>
            </div>
          )}
          {selectedCountry === 'china' && (
            <div className="text-gray-300 text-sm space-y-2">
              <p><strong>Alipay:</strong> {alipayId}</p>
              <p><strong>WeChat:</strong> YOUR_WECHAT_ID</p>
            </div>
          )}
        </div>

        {/* WhatsApp Button */}
        <a 
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-xl text-center shadow-lg transition-all"
        >
          Send Proof on WhatsApp
        </a>
        <p className="text-xs text-gray-500 text-center">Works on Windows 7 (Opens WhatsApp Web)</p>

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
