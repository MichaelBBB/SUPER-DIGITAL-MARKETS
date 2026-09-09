'use client';

import { useState } from 'react';

interface PeachCheckoutProps {
  amount: number;
  itemName: string;
  currency?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export default function PeachCheckout({ 
  amount, 
  itemName, 
  currency = 'USD',
  onSuccess,
  onError 
}: PeachCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/peach-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          item: itemName,
          currency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      if (data.success && data.checkoutUrl) {
        // Redirect to Peach Payments secure checkout
        window.location.href = data.checkoutUrl;
        
        if (onSuccess) {
          onSuccess(data);
        }
      } else {
        throw new Error('No checkout URL received from server');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Checkout failed';
      setError(errorMessage);
      
      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold rounded-lg shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            Pay ${amount.toFixed(2)} with Card
          </>
        )}
      </button>
      
      {error && (
        <div className="p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm text-center">
          ⚠️ {error}
        </div>
      )}
      
      <div className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Secured by Peach Payments
      </div>
    </div>
  );
}
