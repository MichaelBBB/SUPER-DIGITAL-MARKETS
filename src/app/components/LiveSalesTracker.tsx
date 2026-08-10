"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Users, DollarSign } from "lucide-react";

interface SaleStats {
  totalSales: number;
  activeBuyers: number;
  revenueZAR: string;
  lastSaleProduct: string;
}

export default function LiveSalesTracker() {
  const [stats, setStats] = useState<SaleStats>({
    totalSales: 847,
    activeBuyers: 23,
    revenueZAR: "R2,894,650",
    lastSaleProduct: "ChatGPT Plus"
  });

  useEffect(() => {
    // Simulate live updates every 10 seconds
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalSales: prev.totalSales + Math.floor(Math.random() * 3),
        activeBuyers: prev.activeBuyers + Math.floor(Math.random() * 5) - 2,
        revenueZAR: formatCurrency(prev.revenueZAR)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: string) => value;

  return (
    <div className="bg-[#16191f] border border-gray-700 rounded-xl p-4 mb-4">
      <h4 className="font-semibold mb-3 flex items-center gap-2 text-cyan-400">
        <TrendingUp className="w-4 h-4" /> LIVE SALES TRACKER
      </h4>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-xs text-gray-400">Total Sold</div>
          <div className="font-bold text-lg">{stats.totalSales}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Online Now</div>
          <div className="font-bold text-lg">{stats.activeBuyers}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Revenue Today</div>
          <div className="font-bold text-cyan-400">{stats.revenueZAR}</div>
        </div>
      </div>
      
      {/* Last Sale Notification */}
      <div className="mt-4 pt-3 border-t border-gray-700 text-left">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Last purchase:</span>
          <span className="text-white font-medium">{stats.lastSaleProduct}</span>
        </div>
        <div className="flex items-center justify-between mt-1 text-xs">
          <span className="text-gray-500">Verified payment</span>
          <span className="text-green-400">✓ Instant</span>
        </div>
      </div>
    </div>
  );
}
