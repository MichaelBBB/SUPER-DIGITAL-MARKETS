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
        // Redirect to Peach Payments checkout
        window.location.href = data.checkoutUrl;
        
        if (onSuccess) {
          onSuccess(data);
        }
      } else {
        throw new Error('No checkout URL received');
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
        className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-105"
      >
        {loading ? 'Processing...' : `Pay $${amount.toFixed(2)} with Peach Payments`}
      </button>
      
      {error && (
        <div className="p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
          {error}
        </div>
      )}
      
      <div className="text-xs text-gray-400 text-center">
        Secure payment powered by Peach Payments
      </div>
    </div>
  );
}
