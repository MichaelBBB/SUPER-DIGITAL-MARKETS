export const dynamic = 'force-dynamic';

async function getRealSales() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!url || !key) return { totalOrders: 0, totalRevenue: 0, regions: [] };

  try {
    const res = await fetch(`${url}/rest/v1/sales_counts?select=*`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: 'no-store'
    });
    const data = await res.json();
    
    let totalOrders = 0;
    let totalRevenue = 0;
    const regions = (data || []).map((row: any) => {
      const count = Number(row.count) || 0;
      totalOrders += count;
      totalRevenue += count * 5; 
      return { region: row.region, count };
    });
    
    return { totalOrders, totalRevenue, regions };
  } catch {
    return { totalOrders: 0, totalRevenue: 0, regions: [] };
  }
}

export default async function LiveTrackersPage() {
  const { totalOrders, totalRevenue, regions } = await getRealSales();

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyan-400">Live Sales Trackers</h1>
          <p className="text-gray-400 mt-2">Bank-Mirror Mode: Real Deposits Only</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <p className="text-gray-400 text-sm">Total Real Orders</p>
            <p className="text-5xl font-bold text-green-400 mt-2">{totalOrders.toLocaleString()}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <p className="text-gray-400 text-sm">Total Real Revenue</p>
            <p className="text-5xl font-bold text-green-400 mt-2">${totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Global Breakdown</h2>
          <div className="space-y-3">
            {regions.length > 0 ? regions.map((r: any) => (
              <div key={r.region} className="flex justify-between items-center border-b border-gray-800 pb-2">
                <span className="capitalize text-gray-300">{r.region.replace('_', ' ')}</span>
                <span className="font-mono text-cyan-400">{r.count} orders</span>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-4">Waiting for first real sale...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
