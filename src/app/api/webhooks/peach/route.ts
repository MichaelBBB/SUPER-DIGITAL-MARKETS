import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // Log everything
    console.log("🔔 WEBHOOK RECEIVED");
    console.log("📍 Method:", request.method);
    
    // Read body
    const rawBody = await request.text();
    console.log("📦 Body:", rawBody);
    
    // Parse body
    let payload;
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      payload = JSON.parse(rawBody);
    } else {
      const params = new URLSearchParams(rawBody);
      payload = {};
      for (const [key, value] of params.entries()) {
        payload[key] = value;
      }
    }
    
    console.log("📊 Payload:", JSON.stringify(payload));
    
    // Check status
    const status = (payload.status || payload.payment_status || '').toUpperCase();
    console.log("💳 Status:", status);
    
    if (!['SUCCESS', 'COMPLETED', 'PAID'].includes(status)) {
      return NextResponse.json({ success: true, message: 'Ignored non-success' });
    }
    
    // Get region
    const country = (payload.country || 'ZA').toUpperCase();
    const regionMap: Record<string, string> = {
      'US': 'usa', 'IN': 'india', 'CN': 'china', 'ZA': 'southAfrica'
    };
    const region = regionMap[country] || 'southAfrica';
    
    // Update Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data: current } = await supabase
      .from('sales_counts')
      .select('count')
      .eq('region', region)
      .single();
    
    await supabase
      .from('sales_counts')
      .update({ count: (current?.count || 0) + 1 })
      .eq('region', region);
    
    console.log("✅ Sales Updated:", region, "New Count:", (current?.count || 0) + 1);
    
    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error("💥 ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
