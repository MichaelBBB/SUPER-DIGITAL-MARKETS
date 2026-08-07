"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white flex items-center justify-center py-16 px-4">
      <div className="max-w-2xl w-full space-y-8 text-center">
        
        {/* Success Icon */}
        <div className="mb-8 animate-pulse">
          <svg className="w-24 h-24 mx-auto text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
        </div>
        
        {/* Title Card */}
        <div className="bg-gray-800 rounded-lg p-12 shadow-xl">
          <h1 className="text-4xl font-bold mb-4 text-green-400">Payment Confirmed!</h1>
          <p className="text-xl text-gray-300 mb-8">
            Thank you for your order. Your digital product will be delivered instantly!
          </p>
          
          {/* Order Summary */}
          <div className="bg-gray-700 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 text-blue-300">Order Details</h2>
            <div className="space-y-3 text-left">
              <div className="flex justify-between border-b border-gray-600 pb-2">
                <span className="text-gray-400">Status</span>
                <span className="text-green-400 font-medium">✔ Verified & Complete</span>
              </div>
              <div className="flex justify-between border-b border-gray-600 pb-2">
                <span className="text-gray-400">Delivery Time</span>
                <span className="text-white font-medium">Instant Now ✨</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Processing</span>
                <span className="text-white font-medium">Automatic Payment Gate</span>
              </div>
            </div>
          </div>
          
          {/* Download Button */}
          <Link href="/download">
            <button className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-lg transition-all transform hover:scale-105 mb-4">
              📥 Download Your Product Now
            </button>
          </Link>
          
          {/* Additional Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <Link href="/products">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                Continue Shopping
              </button>
            </Link>
            
            <Link href="/">
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                Return Home
              </button>
            </Link>
          </div>
          
          {/* Support Note */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              🔒 Need help? Contact support at info@superdigitalmarkets.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
