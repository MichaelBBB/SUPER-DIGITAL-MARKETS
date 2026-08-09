"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [status, setStatus] = useState("Initializing...");
  
  useEffect(() => {
    // Handle checkout session logic here
    // Redirect to success page after processing
    const timer = setTimeout(() => {
      setStatus("Redirecting to Success...");
      setTimeout(() => {
        window.location.href = "/success";
      }, 1500);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1115] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">{status}</h1>
        <p className="text-gray-400">Please wait while we process your order...</p>
      </div>
    </div>
  );
}
