'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

function PaymentContent() {
  const searchParams = useSearchParams();
  const item = searchParams.get('item') || 'Digital Product';
  const amount = parseFloat(searchParams.get('amount') || '0.00');
  
  // YOUR DETAILS
  const phoneNumber = "27641061358";
  const capitecAccountName = "Super Digital Markets";
  const capitecAccountNumber = "YOUR_ACCOUNT_NUMBER"; // ← ADD YOUR NUMBER
  const capitecBranchCode = "470010";
  const orderRef = `ORDER-${Math.floor(Math.random() * 10000)}`;

  // Country selection
  const [selectedCountry, setSelectedCountry] = useState('south-africa');

  // Generate WhatsApp message based on country
  const getWhatsAppMessage = () => {
    if (selectedCountry === 'south-africa') {
      return `Hi Super Digital Markets! %0A%0A🛒 *ORDER DETAILS*%0AItem: ${encodeURIComponent(item)}%0AAmount: *$${amount.toFixed(2)}*%0AReference: ${orderRef}%0A%0A📋 *PAYMENT INSTRUCTIONS (EFT)*%0A%0A1. Open YOUR banking app (FNB, Standard Bank, Absa, etc.)%0A2. Select "Pay Beneficiary" or "Send Money"%0A3. Add NEW beneficiary with these details:%0A%0A   🏦 *Bank:* Capitec%0A   👤 *Account Name:* ${encodeURIComponent(capitecAccountName)}%0A   🔢 *Account Number:* ${capitecAccountNumber}%0A    *Branch Code:* ${capitecBranchCode}%0A%0A4. Enter amount: $${amount.toFixed(2)}%0A5. Reference: ${orderRef}%0A6. Select "Immediate Payment" (instant)%0A7. Send payment%0A%0A8. Reply here with proof of payment%0A%0A✅ You'll receive your download link immediately after verification!`;
    } else if (selectedCountry === 'usa') {
      return `Hi Super Digital Markets! %0A%0A *ORDER DETAILS*%0AItem: ${encodeURIComponent(item)}%0AAmount: *$${amount.toFixed(2)}%0AReference: ${orderRef}%0A%0A🌎 *INTERNATIONAL PAYMENT OPTIONS*%0A%0A*Option 1: Wise (Recommended)*%0A- Fast & low fees%0A- I'll send you my Wise details%0A%0A*Option 2: PayPal*%0A- Send to: your-paypal@email.com%0A- Reference: ${orderRef}%0A%0A*Option 3: International Wire*%0A- I'll provide SWIFT/BIC details%0A- Higher fees, 3-5 days%0A%0APlease let me know which method you prefer!`;
    } else if (selectedCountry === 'india') {
      return `Hi Super Digital Markets! %0A%0A🛒 *ORDER DETAILS*%0AItem: ${encodeURIComponent(item)}%0AAmount: *$${amount.toFixed(2)} (₹${(amount * 83).toFixed(0)})*%0AReference: ${orderRef}%0A%0A🇮🇳 *PAYMENT OPTIONS FOR INDIA*%0A%0A*Option 1: UPI (Recommended)*%0A- UPI ID: your-upi@bank%0A- Amount: ₹${(amount * 83).toFixed(0)}%0A- Reference: ${orderRef}%0A%0A*Option 2: Wise*%0A- Low international fees%0A%0A*Option 3: PayPal*%0A- Send to: your-paypal@email.com%0A%0APlease confirm your preferred method!`;
    } else if (selectedCountry === 'china') {
      return `Hi Super Digital Markets! %0A%0A🛒 *ORDER DETAILS*%0AItem: ${encodeURIComponent(item)}%0AAmount: *$${amount.toFixed(2)} (¥${(amount * 7).toFixed(0)})*%0AReference: ${orderRef}%0A%0A🇨🇳 *PAYMENT OPTIONS FOR CHINA*%0A%0A*Option 1: Alipay (Recommended)*%0A- Alipay ID: your-alipay-id%0A- Amount: ¥${(amount * 7).toFixed(0)}%0A%0A*Option 2: WeChat Pay*%0A- I'll send QR code%0A%0A*Option 3: Wise*%0A- International transfer%0A%0APlease let me know your preference!`;
    }
    return '';
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
          <p className="text-gray-400 mb-6">Choose your country for payment instructions</p>
          
          <div className="bg-black/50 p-6 rounded-xl mb-6">
            <p className="text-gray-400 text-sm uppercase tracking-wide">Item</p>
            <p className="text-xl font-semibold text-white mb-4">{item}</p>
            <div className="h-px bg-gray-800 my-4"></div>
            <p className="text-gray-400 text-sm uppercase tracking-wide">Total to Pay</p>
            <p className="text-5xl font-bold text-green-400">${amount.toFixed(2)}</p>
          </div>
        </div>

        {/* Country Selection */}
        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Select Your Country:
          </label>
          <select 
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="south-africa">🇿 South Africa (EFT to Capitec)</option>
            <option value="usa">🇺🇸 USA (Wise/PayPal)</option>
            <option value="india">🇮🇳 India (UPI/Wise)</option>
            <option value="china">🇨🇳 China (Alipay/WeChat)</option>
            <option value="other"> Other Country (Wise/Wire)</option>
          </select>
        </div>

        {/* WhatsApp Action Card */}
        <div className="bg-green-900/10 border border-green-600/50 p-8 rounded-2xl text-center shadow-lg shadow-green-900/20">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {selectedCountry === 'south-africa' ? 'Pay via EFT (Capitec)' : 'Pay via WhatsApp'}
          </h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            {selectedCountry === 'south-africa' 
              ? 'Click below to open WhatsApp with FULL payment instructions and Capitec banking details already included. Use YOUR bank app to send money.'
              : 'Click below to get international payment options (Wise, PayPal, Alipay, etc.) for your region.'}
          </p>
          
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-xl shadow-lg transition-all transform hover:scale-105"
          >
            {selectedCountry === 'south-africa' ? 'Get Capitec Banking Details' : 'Get Payment Options'}
          </a>
          
          <p className="text-xs text-gray-500 mt-4">
            🔒 Secure WhatsApp chat • Instant response
          </p>
        </div>

        {/* Instructions */}
        {selectedCountry === 'south-africa' && (
          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
            <h3 className="font-bold text-white mb-4"> How EFT Payment Works:</h3>
            <ol className="space-y-3 text-sm text-gray-400 list-decimal list-inside">
              <li>Click the green button above</li>
              <li>WhatsApp opens with YOUR Capitec details already in the message</li>
              <li>Open YOUR banking app (FNB, Standard Bank, Absa, Nedbank, TymeBank, etc.)</li>
              <li>Add us as a beneficiary using the Capitec details provided</li>
              <li>Send payment using "Immediate Payment" (instant)</li>
              <li>Send proof of payment in WhatsApp</li>
              <li>Receive your download link immediately!</li>
            </ol>
            <div className="mt-4 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
              <p className="text-sm text-blue-300">
                💡 <strong>Note:</strong> You don't need a Capitec app! Any South African bank works.
              </p>
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
