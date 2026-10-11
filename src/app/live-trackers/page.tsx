'use client';
import { Suspense, useState, useEffect } from 'react';

interface Sale {
  orderRef: string;
  product: string;
  amount: number;
  currency: string;
  timestamp: string;
  paymentMethod: string;
  status: string;
}

function TrackersInner() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch('/api/sales');
        const data = await res.json();
        setSales(data.sales || []);
      } catch (error) {
        console.error('Failed to fetch sales:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
    // Refresh every 30 seconds
    const interval = setInterval(fetchSales, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalOrders = sales.length;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyan-400">Live Sales Trackers</h1>
          <p className="text-gray-400 mt-2">Real-time sales data</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <p className="text-gray-400 text-sm mb-2">Total Orders</p>
            <p className="text-4xl font-bold text-green-400">{totalOrders}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <p className="text-gray-400 text-sm mb-2">Total Revenue</p>
            <p className="text-4xl font-bold text-cyan-400">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <p className="text-gray-400 text-sm mb-2">Last Sale</p>
            <p className="text-2xl font-bold text-yellow-400">
              {sales.length > 0 ? sales[sales.length - 1].product : 'None'}
            </p>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-cyan-400 mb-6">Recent Sales</h2>
          
          {loading ? (
            <p className="text-gray-400 text-center py-8">Loading...</p>
          ) : sales.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No sales yet</p>
          ) : (
            <div className="space-y-4">
              {sales.slice().reverse().map((sale, index) => (
                <div key={index} className="bg-black/50 p-4 rounded-lg border border-gray-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white">{sale.product}</p>
                      <p className="text-gray-400 text-sm">Ref: {sale.orderRef}</p>
                      <p className="text-gray-500 text-xs">
                        {new Date(sale.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-400">${sale.amount}</p>
                      <p className="text-gray-400 text-sm">{sale.paymentMethod}</p>
                      <span className="inline-block px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded">
                        {sale.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center">
          <a href="/" className="text-gray-500 hover:text-white text-sm">
            ← Return to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center">Loading...</div>}>
      <TrackersInner />
    </Suspense>
  );
}
