'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      
      const response = await fetch('/api/peach-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      if (!response.ok) throw new Error('Failed to initialize payment');

      const data = await response.json();
      
      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.message || 'Invalid response');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 flex items-center justify-center p-4">
        <div className="bg-red-900/80 border border-red-700 p-8 rounded-2xl max-w-md text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Payment Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <Link href="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg inline-block">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🔐 Secure Checkout</h1>
          <p className="text-gray-400">Pay securely via Capitec Bank Transfer</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800/80 rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Full Name *</label>
              <input name="customerName" required type="text" placeholder="John Doe" 
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Phone Number *</label>
              <input name="phoneNumber" required type="tel" placeholder="+27 82 123 4567" 
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Amount (ZAR) *</label>
            <input name="amount" required type="number" min="10" step="0.01" defaultValue="1000" 
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-2xl font-bold focus:outline-none focus:border-blue-500" />
          </div>

          <button disabled={loading} type="submit"
            className={`w-full py-4 font-bold rounded-lg transition-all ${
              loading ? 'bg-gray-600 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
            }`}>
            {loading ? 'Processing...' : 'Proceed to Pay Securely'}
          </button>

          <Link href="/" className="block text-center text-gray-400 hover:text-gray-300 text-sm mt-4">
            ← Cancel and Return Home
          </Link>

          <div className="text-center text-gray-500 text-xs mt-4">
            🔒 Powered by Peach Payments | SECURE SSL ENCRYPTED
          </div>
        </form>
      </div>
    </main>
  );
}
