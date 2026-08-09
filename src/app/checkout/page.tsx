"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = "/success";
    }, 2000);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1115] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h1 className="text-2xl font-bold mb-4">Processing...</h1>
        <p className="text-gray-400">Please wait while we process your order...</p>
        <Link href="/" className="inline-block mt-4 text-blue-400 hover:text-blue-300">← Cancel & Return Home</Link>
      </div>
    </div>
  );
}
