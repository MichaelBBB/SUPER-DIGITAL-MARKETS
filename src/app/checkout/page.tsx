"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const [status, setStatus] = useState("Processing...");
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("Redirecting to Success Page...");
      setTimeout(() => {
        window.location.href = "/success";
      }, 1500);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1115] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h1 className="text-2xl font-bold mb-4">{status}</h1>
        <p className="text-gray-400">Please wait while we process your order...</p>
        <Link href="/" className="inline-block mt-4 text-blue-400 hover:text-blue-300">
          ← Cancel & Return Home
        </Link>
      </div>
    </div>
  );
}
