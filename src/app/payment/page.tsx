'use client';

import { useSearchParams } from 'next/navigation';
import PeachCheckout from '@/components/PeachCheckout';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const item = searchParams.get('item') || 'Digital Product';
  const amount = parseFloat(searchParams.get('amount') || '10.99');

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Complete Your Purchase</h1>
        
        <div className="bg-gray-900 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">{item}</h2>
          <p className="text-3xl font-bold text-green-400">${amount.toFixed(2)}</p>
        </div>

        <div className="space-y-4">
          <PeachCheckout 
            amount={amount} 
            itemName={item}
            onSuccess={(data) => console.log('Payment successful:', data)}
            onError={(error) => console.error('Payment error:', error)}
          />
          
          {/* Keep your existing WhatsApp button */}
          <button className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg">
            Pay via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
