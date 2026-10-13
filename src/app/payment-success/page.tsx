'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to homepage after 5 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-8 text-center">
        
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-green-400 mb-2">Payment Successful!</h1>
        <p className="text-gray-300 mb-6">
          Thank you for your purchase. Your digital product will be delivered instantly.
        </p>

        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-400">Redirecting to homepage in 5 seconds...</p>
        </div>

        <Link
          href="/"
          className="block w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-bold transition-colors"
        >
          Return to Homepage Now
        </Link>
      </div>
    </div>
  );
}
