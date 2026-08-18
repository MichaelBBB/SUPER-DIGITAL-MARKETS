"use client";

import { useState, useEffect } from "react";

const recentPurchases = [
  { name: "Alex M.", product: "ElevenLabs Starter", time: "2 min ago" },
  { name: "Sarah K.", product: "Asana Premium", time: "5 min ago" },
  { name: "Jordan T.", product: "Dashlane Premium", time: "8 min ago" },
  { name: "Casey R.", product: "Notion AI", time: "12 min ago" },
];

export default function SocialProofBanner() {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Show after 3 seconds
    const showTimer = setTimeout(() => setVisible(true), 3000);
    
    // Rotate every 6 seconds
    const rotateTimer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % recentPurchases.length);
    }, 6000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(rotateTimer);
    };
  }, []);

  const purchase = recentPurchases[currentIndex];

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 transition-all duration-500 transform ${
        visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
    >
      <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl p-4 shadow-2xl max-w-sm flex items-center gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {purchase.name} just purchased
          </p>
          <p className="text-xs text-gray-400 truncate">
            {purchase.product} • {purchase.time}
          </p>
        </div>

        <button
          onClick={() => setVisible(false)}
          className="flex-shrink-0 text-gray-500 hover:text-white transition-colors p-1"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
