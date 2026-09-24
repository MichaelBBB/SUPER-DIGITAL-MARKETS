'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PaymentContent() {
  const searchParams = useSearchParams();
  const item = searchParams.get('product') || 'Digital Product';
  const amount = parseFloat(searchParams.get('price') || '10.99');
  const orderRef = `ORDER-${Math.floor(Math.random() * 10000)}`;

  const phoneNumber = "27743868889";
  const capitecBank = "Capitec";
  const capitecAccountName = "MR MB BLUMENTHAL";
  const capitecAccountNumber = "1975933441";
  const capitecSwiftCode = "CABLZAJJ";

  const message = encodeURIComponent(`Hi! Order: ${item}, Amount: $${amount.toFixed(2)}, Ref: ${orderRef}. Ready to pay.`);
  const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
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

        <div className="bg-green-900/10 border border-green-600/50 p-8 rounded-2xl text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Pay via WhatsApp</h2>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-block w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl">
            Chat to Buy Now
          </a>
        </div>

        <div className="bg-blue-900/10 border border-blue-600/50 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">Option 2: Manual Bank Transfer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/40 p-6 rounded-xl border border-blue-800/50">
              <h3 className="font-bold text-lg mb-4">Banking Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-800 pb-2"><span className="text-gray-400">Bank:</span><span className="text-white font-bold">{capitecBank}</span></div>
                <div className="flex justify-between border-b border-gray-800 pb-2"><span className="text-gray-400">Account Name:</span><span className="text-white">{capitecAccountName}</span></div>
                <div className="flex justify-between border-b border-gray-800 pb-2"><span className="text-gray-400">Account Number:</span><span className="text-green-400 font-mono">{capitecAccountNumber}</span></div>
                <div className="flex justify-between border-b border-gray-800 pb-2"><span className="text-gray-400">SWIFT Code:</span><span className="text-green-400 font-mono font-bold">{capitecSwiftCode}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Reference:</span><span className="text-yellow-400 font-mono">{orderRef}</span></div>
              </div>
            </div>
            <div className="bg-black/40 p-6 rounded-xl'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PaymentContent() {
  const searchParams = useSearchParams();
  const item = searchParams.get('product') || 'Digital Product';
  const amount = parseFloat(searchParams.get('price') || '10.99');
  const orderRef = `ORDER-${Math.floor(Math.random() * 10000)}`;

  const phoneNumber = "27743868889";
  const capitecBank = "Capitec";
  const capitecAccountName = "MR MB BLUMENTHAL";
  const capitecAccountNumber = "1975933441";
  const capitecSwiftCode = "CABLZAJJ";

  const wiseEmail = "YOUR_WISE_EMAIL_HERE";
  const paypalEmail = "YOUR_PAYPAL_EMAIL_HERE";
  const upiId = "YOUR_UPI_ID_HERE";
  const alipayId = "YOUR_ALIPAY_ID_HERE";
  const weChatId = "YOUR_WECHAT_ID_HERE";

  const message = encodeURIComponent(`Hi! Order: ${item}, Amount: $${amount.toFixed(2)}, Ref: ${orderRef}. Ready to pay.`);
  const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

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

        <div className="bg-green-900/10 border border-green-600/50 p-8 rounded-2xl text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Pay via WhatsApp (Recommended)</h2>
          <p className="text-gray-300 mb-6">Fastest method! Chat with us directly for instant payment instructions.</p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
            className="inline-block w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all">
            Chat to Buy Now
          </a>
        </div>

        <div className="bg-blue-900/10 border border-blue-600/50 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">Option 2: Manual Bank Transfer</h2>
          <p className="text-gray-400 mb-6">Transfer funds directly. Send proof via WhatsApp.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-black/40 p-6 rounded-xl border border-blue-800/50">
                <h3 className="font-bold text-lg mb-4">Banking Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Bank:</span>
                    <span className="text-white font-bold">{capitecBank}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Account Name:</span>
                    <span className="text-white">{capitecAccountName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Account Number:</span>
                    <span className="text-green-400 font-mono">{capitecAccountNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">SWIFT Code:</span>
                    <span className="text-green-400 font-mono font-bold">{capitecSwiftCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reference:</span>
                    <span className="text-yellow-400 font-mono">{orderRef}</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 p-6 rounded-xl border border-gray-800">
                <h3 className="font-bold text-lg mb-3">How to Pay</h3>
                <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                  <li>Open your banking app</li>
                  <li>Select "International Transfer" or "SWIFT"</li>
                  <li>Enter the Capitec details above</li>
                  <li>Use SWIFT code: <strong className="text-green-400">CABLZAJJ</strong></li>
                  <li>Use the Reference number exactly as shown</li>
                  <li>Send payment and save proof</li>
                  <li>Click WhatsApp button to send proof</li>
                </ol>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-black/40 p-6 rounded-xl border border-green-800/50">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2"><span>🇺🇸</span> USA - Faster Options</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-green-900/20 p-3 rounded-lg">
                    <p className="font-bold text-green-400">Wise</p>
                    <p className="text-gray-300 text-xs mt-1">Email: <span className="font-mono">{wiseEmail}</span></p>
                  </div>
                  <div className="bg-blue-900/20 p-3 rounded-lg">
                    <p className="font-bold text-blue-400">PayPal</p>
                    <p className="text-gray-300 text-xs mt-1">Email: <span className="font-mono">{paypalEmail}</span></p>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 p-6 rounded-xl border border-green-800/50">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2"><span>🇮🇳</span> India - Faster Options</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-green-900/20 p-3 rounded-lg">
                    <p className="font-bold text-green-400">UPI</p>
                    <p className="text-gray-300 text-xs mt-1">UPI ID: <span className="font-mono">{upiId}</span></p>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 p-6 rounded-xl border border-green-800/50">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2"><span>🇨🇳</span> China - Faster Options</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-green-900/20 p-3 rounded-lg">
                    <p className="font-bold text-green-400">Alipay</p>
                    <p className="text-gray-300 text-xs mt-1">Alipay ID: <span className="font-mono">{alipayId}</span></p>
                  </div>
                  <div className="bg-blue-900/20 p-3 rounded-lg">
                    <p className="font-bold text-blue-400">WeChat Pay</p>
                    <p className="text-gray-300 text-xs mt-1">WeChat ID: <span className="font-mono">{weChatId}</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all">
              Send Proof of Payment on WhatsApp
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading payment details...</div>}>
      <PaymentContent />
    </Suspense>
  );
}use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PaymentContent() {
  const searchParams = useSearchParams();
  const item = searchParams.get('product') || 'Digital Product';
  const amount = parseFloat(searchParams.get('price') || '10.99');
  const orderRef = `ORDER-${Math.floor(Math.random() * 10000)}`;

  const phoneNumber = "27743868889";
  const capitecBank = "Capitec";
  const capitecAccountName = "MR MB BLUMENTHAL";
  const capitecAccountNumber = "1975933441";
  const capitecSwiftCode = "CABLZAJJ";

  const wiseEmail = "YOUR_WISE_EMAIL_HERE";
  const paypalEmail = "YOUR_PAYPAL_EMAIL_HERE";
  const upiId = "YOUR_UPI_ID_HERE";
  const alipayId = "YOUR_ALIPAY_ID_HERE";
  const weChatId = "YOUR_WECHAT_ID_HERE";

  const message = encodeURIComponent(`Hi! Order: ${item}, Amount: $${amount.toFixed(2)}, Ref: ${orderRef}. Ready to pay.`);
  const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

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

        <div className="bg-green-900/10 border border-green-600/50 p-8 rounded-2xl text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Pay via WhatsApp (Recommended)</h2>
          <p className="text-gray-300 mb-6">Fastest method! Chat with us directly for instant payment instructions.</p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
            className="inline-block w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all">
            Chat to Buy Now
          </a>
        </div>

        <div className="bg-blue-900/10 border border-blue-600/50 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">Option 2: Manual Bank Transfer</h2>
          <p className="text-gray-400 mb-6">Transfer funds directly. Send proof via WhatsApp.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-black/40 p-6 rounded-xl border border-blue-800/50">
                <h3 className="font-bold text-lg mb-4">Banking Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Bank:</span>
                    <span className="text-white font-bold">{capitecBank}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Account Name:</span>
                    <span className="text-white">{capitecAccountName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Account Number:</span>
                    <span className="text-green-400 font-mono">{capitecAccountNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">SWIFT Code:</span>
                    <span className="text-green-400 font-mono font-bold">{capitecSwiftCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reference:</span>
                    <span className="text-yellow-400 font-mono">{orderRef}</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 p-6 rounded-xl border border-gray-800">
                <h3 className="font-bold text-lg mb-3">How to Pay</h3>
                <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                  <li>Open your banking app</li>
                  <li>Select "International Transfer" or "SWIFT"</li>
                  <li>Enter the Capitec details above</li>
                  <li>Use SWIFT code: <strong className="text-green-400">CABLZAJJ</strong></li>
                  <li>Use the Reference number exactly as shown</li>
                  <li>Send payment and save proof</li>
                  <li>Click WhatsApp button to send proof</li>
                </ol>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-black/40 p-6 rounded-xl border border-green-800/50">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2"><span>🇺🇸</span> USA - Faster Options</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-green-900/20 p-3 rounded-lg">
                    <p className="font-bold text-green-400">Wise</p>
                    <p className="text-gray-300 text-xs mt-1">Email: <span className="font-mono">{wiseEmail}</span></p>
                  </div>
                  <div className="bg-blue-900/20 p-3 rounded-lg">
                    <p className="font-bold text-blue-400">PayPal</p>
                    <p className="text-gray-300 text-xs mt-1">Email: <span className="font-mono">{paypalEmail}</span></p>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 p-6 rounded-xl border border-green-800/50">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2"><span>🇮🇳</span> India - Faster Options</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-green-900/20 p-3 rounded-lg">
                    <p className="font-bold text-green-400">UPI</p>
                    <p className="text-gray-300 text-xs mt-1">UPI ID: <span className="font-mono">{upiId}</span></p>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 p-6 rounded-xl border border-green-800/50">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2"><span>🇨🇳</span> China - Faster Options</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-green-900/20 p-3 rounded-lg">
                    <p className="font-bold text-green-400">Alipay</p>
                    <p className="text-gray-300 text-xs mt-1">Alipay ID: <span className="font-mono">{alipayId}</span></p>
                  </div>
                  <div className="bg-blue-900/20 p-3 rounded-lg">
                    <p className="font-bold text-blue-400">WeChat Pay</p>
                    <p className="text-gray-300 text-xs mt-1">WeChat ID: <span className="font-mono">{weChatId}</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all">
              Send Proof of Payment on WhatsApp
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading payment details...</div>}>
      <PaymentContent />
    </Suspense>
  );
}'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PaymentContent() {
  // Get product info from URL parameters
  const searchParams = useSearchParams();
  const item = searchParams.get('product') || 'Digital Product';
  const amount = parseFloat(searchParams.get('price') || '10.99');
  const orderRef = `ORDER-${Math.floor(Math.random() * 10000)}`;

  // Contact & Banking
  const phoneNumber = "27743868889";
  const capitecBank = "Capitec";
  const capitecAccountName = "MR MB BLUMENTHAL";
  const capitecAccountNumber = "1975933441";
  const capitecSwiftCode = "CABLZAJJ";

  // Payment Apps
  const wiseEmail = "YOUR_WISE_EMAIL_HERE";
  const paypalEmail = "YOUR_PAYPAL_EMAIL_HERE";
  const upiId = "YOUR_UPI_ID_HERE";
  const alipayId = "YOUR_ALIPAY_ID_HERE";
  const weChatId = "YOUR_WECHAT_ID_HERE";

  // WhatsApp Link with dynamic price
  const message = encodeURIComponent(`Hi! Order: ${item}, Amount: $${amount.toFixed(2)}, Ref: ${orderRef}. Ready to pay.`);
  const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

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
          <h2 className="text-2xl font-bold text-white mb-2">Pay via WhatsApp (Recommended)</h2>
          <p className="text-gray-300 mb-6">Fastest method! Chat with us directly for instant payment instructions and order confirmation.</p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
            className="inline-block w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all">
            Chat to Buy Now
          </a>
          <p className="text-xs text-gray-500 mt-4">Available 24/7 • Instant Response</p>
        </div>

        {/* Option 2: Manual Bank Transfer - SIDE BY SIDE LAYOUT */}
        <div className="bg-blue-900/10 border border-blue-600/50 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">Option 2: Manual Bank Transfer</h2>
          <p className="text-gray-400 mb-6">Transfer funds directly to our account. Send proof of payment via WhatsApp for activation.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* LEFT COLUMN: Banking Details & Instructions */}
            <div className="space-y-4">
              <div className="bg-black/40 p-6 rounded-xl border border-blue-800/50">
                <h3 className="font-bold text-lg mb-4">Banking Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Bank:</span>
                    <span className="text-white font-bold">{capitecBank}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Account Name:</span>
                    <span className="text-white">{capitecAccountName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Account Number:</span>
                    <span className="text-green-400 font-mono">{capitecAccountNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">SWIFT Code:</span>
                    <span className="text-green-400 font-mono font-bold">{capitecSwiftCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reference:</span>
                    <span className="text-yellow-400 font-mono">{orderRef}</span>
                  </div>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="bg-black/40 p-6 rounded-xl border border-gray-800">
                <h3 className="font-bold text-lg mb-3">How to Pay</h3>
                <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                  <li>Open your banking app (any bank, any country)</li>
                  <li>Select "International Transfer" or "SWIFT"</li>
                  <li>Enter the Capitec details shown above</li>
                  <li>Use SWIFT code: <strong className="text-green-400">CABLZAJJ</strong></li>
                  <li>Use the Reference number exactly as shown</li>
                  <li>Send payment and save proof</li>
                  <li>Click WhatsApp button to send proof</li>
                </ol>
              </div>
            </div>

            {/* RIGHT COLUMN: Country Payment Apps */}
            <div className="space-y-4">
              {/* USA Apps */}
              <div className="bg-black/40 p-6 rounded-xl border border-green-800/50">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span>🇺🇸</span> USA - Faster Options
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-green-900/20 p-3 rounded-lg">
                    <p className="font-bold text-green-400">Wise (Recommended)</p>
                    <p className="text-gray-300 text-xs mt-1">Email: <span className="font-mono">{wiseEmail}</span></p>
                    <p className="text-gray-500 text-xs mt-1">Fast & low fees</p>
                  </div>
                  <div className="bg-blue-900/20 p-3 rounded-lg">
                    <p className="font-bold text-blue-400">PayPal</p>
                    <p className="text-gray-300 text-xs mt-1">Email: <span className="font-mono">{paypalEmail}</span></p>
                    <p className="text-gray-500 text-xs mt-1">Secure instant payment</p>
                  </div>
                </div>
              </div>

              {/* India Apps */}
              <div className="bg-black/40 p-6 rounded-xl border border-green-800/50">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span>🇮🇳</span> India - Faster Options
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-green-900/20 p-3 rounded-lg">
                    <p className="font-bold text-green-400">UPI (Recommended)</p>
                    <p className="text-gray-300 text-xs mt-1">UPI ID: <span className="font-mono">{upiId}</span></p>
                    <p className="text-gray-500 text-xs mt-1">Instant via GPay, PhonePe</p>
                  </div>
                  <div className="bg-blue-900/20 p-3 rounded-lg">
                    <p className="font-bold text-blue-400">Wise</p>
                    <p className="text-gray-300 text-xs mt-1">Email: <span className="font-mono">{wiseEmail}</span></p>
                    <p className="text-gray-500 text-xs mt-1">International transfer</p>
                  </div>
                </div>
              </div>

              {/* China Apps */}
              <div className="bg-black/40 p-6 rounded-xl border border-green-800/50">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span>🇨🇳</span> China - Faster Options
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-green-900/20 p-3 rounded-lg">
                    <p className="font-bold text-green-400">Alipay (Recommended)</p>
                    <p className="text-gray-300 text-xs mt-1">Alipay ID: <span className="font-mono">{alipayId}</span></p>
                    <p className="text-gray-500 text-xs mt-1">Fast payment via app</p>
                  </div>
                  <div className="bg-blue-900/20 p-3 rounded-lg">
                    <p className="font-bold text-blue-400">WeChat Pay</p>
                    <p className="text-gray-300 text-xs mt-1">WeChat ID: <span className="font-mono">{weChatId}</span></p>
                    <p className="text-gray-500 text-xs mt-1">Scan QR code</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Send Proof Button */}
          <div className="mt-6 text-center">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all">
              Send Proof of Payment on WhatsApp
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

// Main component wrapped in Suspense to satisfy Next.js requirements
export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading payment details...</div>}>
      <PaymentContent />
    </Suspense>
  );
}'use client';

import { useSearchParams } from 'next/navigation';

export default function PaymentPage() {
  // Get product info from URL parameters
  const searchParams = useSearchParams();
  const item = searchParams.get('product') || 'Digital Product';
  const amount = parseFloat(searchParams.get('price') || '10.99');
  const orderRef = `ORDER-${Math.floor(Math.random() * 10000)}`;

  // Contact & Banking
  const phoneNumber = "27743868889";
  const capitecBank = "Capitec";
  const capitecAccountName = "MR MB BLUMENTHAL";
  const capitecAccountNumber = "1975933441";
  const capitecSwiftCode = "CABLZAJJ";

  // Payment Apps
  const wiseEmail = "YOUR_WISE_EMAIL_HERE";
  const paypalEmail = "YOUR_PAYPAL_EMAIL_HERE";
  const upiId = "YOUR_UPI_ID_HERE";
  const alipayId = "YOUR_ALIPAY_ID_HERE";
  const weChatId = "YOUR_WECHAT_ID_HERE";

  // WhatsApp Link with dynamic price
  const message = encodeURIComponent(`Hi! Order: ${item}, Amount: $${amount.toFixed(2)}, Ref: ${orderRef}. Ready to pay.`);
  const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

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
          <h2 className="text-2xl font-bold text-white mb-2">Pay via WhatsApp (Recommended)</h2>
          <p className="text-gray-300 mb-6">Fastest method! Chat with us directly for instant payment instructions and order confirmation.</p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
            className="inline-block w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all">
            Chat to Buy Now
          </a>
          <p className="text-xs text-gray-500 mt-4">Available 24/7 • Instant Response</p>
        </div>

        {/* Option 2: Manual Bank Transfer - SIDE BY SIDE LAYOUT */}
        <div className="bg-blue-900/10 border border-blue-600/50 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">Option 2: Manual Bank Transfer</h2>
          <p className="text-gray-400 mb-6">Transfer funds directly to our account. Send proof of payment via WhatsApp for activation.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* LEFT COLUMN: Banking Details & Instructions */}
            <div className="space-y-4">
              <div className="bg-black/40 p-6 rounded-xl border border-blue-800/50">
                <h3 className="font-bold text-lg mb-4">Banking Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Bank:</span>
                    <span className="text-white font-bold">{capitecBank}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Account Name:</span>
                    <span className="text-white">{capitecAccountName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Account Number:</span>
                    <span className="text-green-400 font-mono">{capitecAccountNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">SWIFT Code:</span>
                    <span className="text-green-400 font-mono font-bold">{capitecSwiftCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reference:</span>
                    <span className="text-yellow-400 font-mono">{orderRef}</span>
                  </div>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="bg-black/40 p-6 rounded-xl border border-gray-800">
                <h3 className="font-bold text-lg mb-3">How to Pay</h3>
                <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                  <li>Open your banking app (any bank, any country)</li>
                  <li>Select "International Transfer" or "SWIFT"</li>
                  <li>Enter the Capitec details shown above</li>
                  <li>Use SWIFT code: <strong className="text-green-400">CABLZAJJ</strong></li>
                  <li>Use the Reference number exactly as shown</li>
                  <li>Send payment and save proof</li>
                  <li>Click WhatsApp button to send proof</li>
                </ol>
              </div>
            </div>

            {/* RIGHT COLUMN: Country Payment Apps */}
            <div className="space-y-4">
              {/* USA Apps */}
              <div className="bg-black/40 p-6 rounded-xl border border-green-800/50">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span>🇺🇸</span> USA - Faster Options
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-green-900/20 p-3 rounded-lg">
                    <p className="font-bold text-green-400">Wise (Recommended)</p>
                    <p className="text-gray-300 text-xs mt-1">Email: <span className="font-mono">{wiseEmail}</span></p>
                    <p className="text-gray-500 text-xs mt-1">Fast & low fees</p>
                  </div>
                  <div className="bg-blue-900/20 p-3 rounded-lg">
                    <p className="font-bold text-blue-400">PayPal</p>
                    <p className="text-gray-300 text-xs mt-1">Email: <span className="font-mono">{paypalEmail}</span></p>
                    <p className="text-gray-500 text-xs mt-1">Secure instant payment</p>
                  </div>
                </div>
              </div>

              {/* India Apps */}
              <div className="bg-black/40 p-6 rounded-xl border border-green-800/50">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span>🇮🇳</span> India - Faster Options
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-green-900/20 p-3 rounded-lg">
                    <p className="font-bold text-green-400">UPI (Recommended)</p>
                    <p className="text-gray-300 text-xs mt-1">UPI ID: <span className="font-mono">{upiId}</span></p>
                    <p className="text-gray-500 text-xs mt-1">Instant via GPay, PhonePe</p>
                  </div>
                  <div className="bg-blue-900/20 p-3 rounded-lg">
                    <p className="font-bold text-blue-400">Wise</p>
                    <p className="text-gray-300 text-xs mt-1">Email: <span className="font-mono">{wiseEmail}</span></p>
                    <p className="text-gray-500 text-xs mt-1">International transfer</p>
                  </div>
                </div>
              </div>

              {/* China Apps */}
              <div className="bg-black/40 p-6 rounded-xl border border-green-800/50">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span>🇨</span> China - Faster Options
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-green-900/20 p-3 rounded-lg">
                    <p className="font-bold text-green-400">Alipay (Recommended)</p>
                    <p className="text-gray-300 text-xs mt-1">Alipay ID: <span className="font-mono">{alipayId}</span></p>
                    <p className="text-gray-500 text-xs mt-1">Fast payment via app</p>
                  </div>
                  <div className="bg-blue-900/20 p-3 rounded-lg">
                    <p className="font-bold text-blue-400">WeChat Pay</p>
                    <p className="text-gray-300 text-xs mt-1">WeChat ID: <span className="font-mono">{weChatId}</span></p>
                    <p className="text-gray-500 text-xs mt-1">Scan QR code</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Send Proof Button */}
          <div className="mt-6 text-center">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all">
              Send Proof of Payment on WhatsApp
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
