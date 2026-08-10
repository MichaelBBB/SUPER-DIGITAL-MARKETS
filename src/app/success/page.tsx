"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Download, Mail, Copy, CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("payments@superdigital.store");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-white flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        {/* SUCCESS ICON */}
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-400 fill-green-500" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        
        {/* INSTANT DELIVERY MESSAGE - ZERO BUSINESS HOURS MENTION */}
        <p className="text-gray-400 mb-8">
          Thank you for your payment. Your digital product will be delivered <span className="text-cyan-400 font-semibold">INSTANTLY</span> to your email address after verification.
        </p>

        {/* DELIVERY INFO */}
        <div className="bg-[#16191f] border border-gray-700 rounded-2xl p-6 mb-6 text-left">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-cyan-400" /> Delivery Information
          </h3>
          
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-green-400 font-medium">Completed ✓</span>
            </div>
            <div className="flex justify-between">
              <span>Processing Time:</span>
              <span className="text-yellow-400 font-medium">Instant</span>
            </div>
            <div className="bg-cyan-500/10 border border-cyan-500/30 p-3 rounded-lg mb-4">
              <p className="text-cyan-400 text-xs font-medium">⚡ YOUR PRODUCT WILL ARRIVE IN YOUR EMAIL WITHIN SECONDS OF PAYMENT VERIFICATION.</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="text-xs text-gray-500 mb-2">Need help?</div>
              <div className="flex items-center justify-between bg-[#0f1115] p-3 rounded-lg">
                <span className="truncate">payments@superdigital.store</span>
                <button onClick={copyEmail} className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">
                  {copiedEmail ? "✓ Copied!" : <Copy className="w-4 h-4"/>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="space-y-3">
          <Link href="/products" className="block w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold">
            Browse Products
          </Link>
          <Link href="/" className="block w-full bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-xl font-bold">
            ← Back to Home
          </Link>
        </div>
        
        {/* TRUST BADGES */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-400" /> Encrypted Payment
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-400" /> Instant Delivery
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-400" /> Secure Processing
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
