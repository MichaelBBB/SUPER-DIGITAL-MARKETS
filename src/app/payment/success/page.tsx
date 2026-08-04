'use client';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <div className="text-green-400 text-8xl mb-8">✓</div>
        <h1 className="text-5xl font-bold text-white mb-6">Payment Successful!</h1>
        <p className="text-xl text-gray-300 mb-8">Thank you for your transaction.</p>
        <Link href="/" className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl inline-block font-semibold">
          Return Home
        </Link>
      </div>
    </div>
  );
}
