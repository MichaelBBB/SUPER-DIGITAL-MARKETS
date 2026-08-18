"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  price: number;
}

export default function AddToCartButton({ productId, productName, price }: AddToCartButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");
  const router = useRouter();

  const handleClick = () => {
    setState("loading");
    // Simulate cart action, then redirect to payment
    setTimeout(() => {
      setState("success");
      setTimeout(() => {
        router.push(`/payment?amount=${price}&item=${encodeURIComponent(productName)}`);
      }, 600);
    }, 400);
  };

  return (
    <button
      onClick={handleClick}
      disabled={state !== "idle"}
      className="relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 px-4 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-80"
    >
      {/* Background Animation */}
      <span className={`absolute inset-0 bg-white/20 translate-y-full transition-transform duration-500 ${state === "success" ? "translate-y-0" : ""}`} />
      
      {/* Text / Icons */}
      <span className="relative flex items-center justify-center gap-2">
        {state === "idle" && (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Buy Now
          </>
        )}
        
        {state === "loading" && (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </>
        )}
        
        {state === "success" && (
          <>
            <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Redirecting...
          </>
        )}
      </span>
    </button>
  );
}
