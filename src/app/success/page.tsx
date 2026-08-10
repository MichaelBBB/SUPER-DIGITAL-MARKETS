"use client";

import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-white flex items-center justify-center p-6">
      <div className="text-center max-w-md px-6">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl">✅</span>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-400 mb-8">
          Thank you for your payment. Your digital products will be delivered instantly.
          Activation time: 30-60 minutes during business hours.
        </p>
        
        <div className="flex flex-col gap-3">
          <Link href="/products" className="bg-blue-600 hover:bg-blue-500 text-white py-3 px-8 rounded-xl font-bold">Browse Products</Link>
          <Link href="/" className="bg-gray-800 hover:bg-gray-700 text-white py-3 px-8 rounded-xl font-bold">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
