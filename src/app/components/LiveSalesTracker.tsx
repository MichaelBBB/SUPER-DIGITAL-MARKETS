"use client";

import { useState } from "react";

interface CountryStats {
  country: string;
  salesCount: number;
  currencySymbol: string;
  revenue: number;
  borderColor: string;
}

export default function LiveSalesTracker() {
  const [stats] = useState<CountryStats[]>([
    {
      country: "USA",
      salesCount: 230640,
      currencySymbol: "$",
      revenue: 230640,
      borderColor: "#0ea5e9"
    },
    {
      country: "INDIA",
      salesCount: 237424,
      currencySymbol: "₹",
      revenue: 237424,
      borderColor: "#f59e0b"
    },
    {
      country: "CHINA",
      salesCount: 235353,
      currencySymbol: "¥",
      revenue: 235353,
      borderColor: "#ef4444"
    },
    {
      country: "SOUTH AFRICA",
      salesCount: 219173,
      currencySymbol: "R",
      revenue: 219173,
      borderColor: "#22c55e"
    }
  ]);

  return (
    <div className="bg-[#0b0f14]/95 backdrop-blur-sm rounded-xl p-6 mb-4 border border-gray-800">
      {/* HEADER */}
      <h3 className="text-cyan-400 font-bold text-center mb-6 text-lg tracking-wide">
        LIVE SALES ACTIVITY
      </h3>
      
      {/* COUNTRY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {stats.map((stat) => (
          <div
            key={stat.country}
            className={`bg-[#16191f] border rounded-lg p-5 flex flex-col items-center justify-center transition hover:scale-105 ${
              stat.borderColor === "#22c55e" 
                ? 'border-green-500/50' 
                : 'border-gray-700'
            }`}
          >
            <span
              className="text-xs uppercase tracking-wider mb-2 block"
              style={{ color: stat.borderColor }}
            >
              {stat.country}
            </span>
            <div className="text-2xl md:text-3xl font-bold text-white">
              {stat.salesCount.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      
      {/* GLOBAL TOTAL */}
      <div className="pt-4 border-t border-gray-800">
        <div className="flex items-center justify-center gap-2">
          <span className="text-gray-400 text-sm">Total Global Volume:</span>
          <span className="text-cyan-400 font-bold text-xl">
            {stats.reduce((acc, curr) => acc + curr.salesCount, 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
