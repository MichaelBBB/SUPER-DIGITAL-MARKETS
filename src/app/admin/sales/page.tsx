// src/app/admin/sales/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function SalesTracker() {
  const [sales, setSales] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    // Load sales data
    fetchSales();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchSales, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSales = async () => {
    try {
      const res = await fetch('/api/sales');
      const data = await res.json();
      setSales(data.sales || []);
      
      // Calculate total revenue
      const total = data.sales?.reduce((sum: number, sale: any) => sum + sale.amount, 0) || 0;
      setTotalRevenue(total);
    } catch (error) {
      console.error('Error loading sales:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">💰 Live Sales Tracker</h1>
        
        {/* Revenue Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/30 rounded-xl p-6">
            <h3 className="text-gray-400 mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-400">ZAR {totalRevenue.toFixed(2)}</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-gray-400 mb-2">Total Sales</h3>
            <p className="text-3xl font-bold text-blue-400">{sales.length}</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-gray-400 mb-2">Avg Order Value</h3>
            <p className="text-3xl font-bold text-purple-400">
              ZAR {sales.length ? (totalRevenue / sales.length).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-2xl font-bold">Recent Transactions</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-950">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {sales.slice().reverse().map((sale: any) => (
                  <tr key={sale.id} className="hover:bg-gray-800/50">
                    <td className="px-6 py-4 font-mono text-sm">{sale.orderId}</td>
                    <td className="px-6 py-4 font-bold text-green-400">ZAR {sale.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs">
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(sale.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {sales.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No sales yet. Make your first sale! 🚀
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
