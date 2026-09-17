'use client'; // CRITICAL: Must be at the very top

import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

function PaymentContent() {
  const searchParams = useSearchParams();
  const item = searchParams.get('item') || 'Digital Product';
  const amount = parseFloat(searchParams.get('amount') || '0.00');
  
  // --- YOUR REAL CAPITEC DETAILS ---
  const phoneNumber = "27641061358"; 
  const capitecAccountName = "MR MB BLUMENTHAL";
  const capitecAccountNumber = "1975933441";
  
  // SA Only
  const capitecBranchCode = "470010"; 
  
  // International Only (Exactly as typed)
  const capitecSwiftCode = "CABLZAJJ"; 
  const capitecBankAddress = "1 Neutron Street, Techno Park, Stellenbosch, 7600, South Africa";
  
  const orderRef = `ORDER-${Math.floor(Math.random() * 10000)}`;

  // Country Selection State
  const [selectedCountry, setSelectedCountry] = useState('south-africa');

  // Generate WhatsApp Message Based on Country
  const getWhatsAppMessage = () => {
    const base = `Hi Super Digital Markets! %0A%0A🛒 *ORDER DETAILS*%0AItem: ${encodeURIComponent(item)}%0AAmount: *$${amount.toFixed(2)}%0AReference: ${orderRef}%0A%0A`;
    
    if (selectedCountry === 'south-africa') {
      return base + `📋 *PAYMENT METHOD: EFT (Capitec)*%0A%0AI have made the payment via EFT.%0A%0A📎 Attached is my proof of payment.%0A✅ Please send my download link.`;
    } else {
      return base + `📋 *PAYMENT METHOD: International Wire (SWIFT)*%0A%0AI have sent the money via SWIFT/Wire to your Capitec account.%0A%0A📎 Attached is my proof of payment.%0A✅ Please send my download link.`;
    }
  };

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${getWhatsAppMessage()}`;

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      {/* Header */}
      <nav className="mb-8 border-b border-gray-800 pb-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <span className="text-xl font-bold text-cyan-400">SUPER DIGITAL</span>
          <a href="/" className="text-sm text-gray-400 hover:text-white">Back Home</a>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Order Summary */}
        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 text-center">
          <h1 className="text-3xl font-bold mb-2">Complete Your Purchase</h1>
          <p className="text-gray-400 mb-6">Select your country for payment instructions</p>
          
          <div className="bg-black/50 p-6 rounded-xl mb-6">
            <p className="text-gray-400 text-sm uppercase tracking-wide">Item</p>
            <p className="text-xl font-semibold text-white mb-4">{item}</p>
            <div className="h-px bg-gray-800 my-4"></div>
            <p className="text-gray-400 text-sm uppercase tracking-wide">Total to Pay</p>
            <p className="text-5xl font-bold text-green-400">${amount.toFixed(2)}</p>
          </div>
        </div>

        {/* Country Selector */}
        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            🌍 Select Your Country:
          </label>
          <select 
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="south-africa">🇿🇦 South Africa (Local EFT)</option>
            <option value="usa">🇺🇸 USA (International Wire)</option>
            <option value="india">🇮🇳 India (International Wire)</option>
            <option value="china">🇨🇳 China (International Wire)</option>
          </select>
        </div>

        {/* --- SOUTH AFRICA: LOCAL CAPITEC DETAILS (BRANCH CODE) --- */}
        {selectedCountry === 'south-africa' && (
          <div className="bg-blue-900/20 border border-blue-600/50 p-8 rounded-2xl shadow-lg shadow-blue-900/20 animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">🏦 Capitec Banking Details (SA)</h2>
            
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
                <span className="text-gray-400">Branch Code:</span>
                <span className="text-white font-mono">{capitecBranchCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Payment Reference:</span>
                <span className="text-yellow-400 font-mono">{orderRef}</span>
              </div>
            </div>

            <div className="mt-6 bg-blue-900/30 p-4 rounded-lg border border-blue-700/50">
              <h3 className="font-bold text-blue-200 mb-2">📝 EFT Payment Instructions:</h3>
              <ol className="text-sm text-blue-100 space-y-2 list-decimal list-inside">
                <li>Open YOUR banking app (FNB, Standard Bank, Absa, etc.)</li>
                <li>Select "Pay Beneficiary" or "Send Money"</li>
                <li>Enter the Capitec details shown above</li>
                <li>Use the <strong>Payment Reference</strong> exactly as shown</li>
                <li>Select "Immediate Payment" for instant delivery</li>
                <li>Click the green WhatsApp button below to send proof</li>
              </ol>
            </div>
          </div>
        )}

        {/* --- INTERNATIONAL: CAPITEC SWIFT DETAILS (USA, INDIA, CHINA) --- */}
        {selectedCountry !== 'south-africa' && (
          <div className="bg-blue-900/20 border border-blue-600/50 p-8 rounded-2xl shadow-lg shadow-blue-900/20 animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">🌍 International Wire Details (SWIFT)</h2>
            <p className="text-center text-gray-400 mb-6 text-sm">Send money directly to our Capitec Account via SWIFT</p>
            
            <div className="space-y-4 bg-black/40 p-6 rounded-xl border border-blue-800/50">
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <span className="text-gray-400">Bank Name:</span>
                <span className="text-white font-bold text-lg">Capitec Bank</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <span className="text-gray-400">SWIFT/BIC Code:</span>
                <span className="text-green-400 font-mono text-lg">CABLZAJJ</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <span className="text-gray-400">Bank Address:</span>
                <span className="text-white text-sm text-right">{capitecBankAddress}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <span className="text-gray-400">Account Name:</span>
                <span className="text-white font-bold">{capitecAccountName}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <span className="text-gray-400">Account Number:</span>
                <span className="text-green-400 font-mono text-xl">{capitecAccountNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Payment Reference:</span>
                <span className="text-yellow-400 font-mono">{orderRef}</span>
              </div>
            </div>

            <div className="mt-6 bg-blue-900/30 p-4 rounded-lg border border-blue-700/50">
              <h3 className="font-bold text-blue-200 mb-2">📝 International Payment Instructions:</h3>
              <ol className="text-sm text-blue-100 space-y-2 list-decimal list-inside">
                <li>Open YOUR banking app (USA/India/China Bank)</li>
                <li>Select <strong>"International Wire Transfer"</strong> or <strong>"SWIFT"</strong></li>
                <li>Enter the Capitec SWIFT details shown above</li>
                <li>Use the <strong>Payment Reference</strong> exactly as shown</li>
                <li>Note: Your bank may charge a wire fee (usually $20-$50)</li>
                <li>Click the green WhatsApp button below to send proof</li>
              </ol>
              {selectedCountry === 'usa' && (
                <p className="text-xs text-yellow-400 mt-2">
                  ⚠️ USA Clients: Do NOT select "ACH". Select "International Wire" using the SWIFT code above.
                </p>
              )}
            </div>
          </div>
        )}

        {/* WhatsApp Button */}
        <div className="bg-green-900/10 border border-green-600/50 p-8 rounded-2xl text-center shadow-lg shadow-green-900/20">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Send Proof of Payment</h2>
          <p className="text-gray-300 mb-6">
            Once you've paid, click below to send the proof to us on WhatsApp. We'll verify and send your download link instantly!
          </p>
          
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-xl shadow-lg transition-all transform hover:scale-105"
          >
            Send Proof on WhatsApp
          </a>
          
          <p className="text-xs text-gray-500 mt-4">
            💡 Works on Windows 7 (Opens WhatsApp Web)
          </p>
        </div>

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
