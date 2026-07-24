import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    console.log("🔔 WEBHOOK RECEIVED FROM PEACH");
    
    // Read raw body
    const rawBody = await request.text();
    console.log("📦 Raw Body:", rawBody);
    
    // Parse body (Peach sends form-urlencoded)
    let payload: any = {};
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      payload = JSON.parse(rawBody);
    } else {
      const params = new URLSearchParams(rawBody);
      for (const [key, value] of params.entries()) {
        payload[key] = value;
      }
    }
    
    console.log("📊 Parsed Payload:", JSON.stringify(payload, null, 2));
    
    // ✅ CHECK PEACH SUCCESS CODES (not status field)
    const resultCode = payload['result.code'] || payload['result_code'] || '';
    const resultDescription = payload['result.description'] || payload['result_description'] || '';
    const eventType = payload['eventType'] || payload['event_type'] || '';
    
    console.log("💳 Result Code:", resultCode);
    console.log("📝 Result Description:", resultDescription);
    console.log("🎯 Event Type:", eventType);
    
    // Peach success codes start with "000"
    const isSuccess = resultCode.startsWith('000') || 
                      resultDescription.toLowerCase().includes('successfully');
    
    console.log("✅ Is Success:", isSuccess);
    
    if (!isSuccess) {
      console.log("⚠️ Ignoring non-successful payment");
      return NextResponse.json({ success: true, message: 'Ignored non-success' });
    }
    
    // ✅ Determine region from country code
    const country = (payload['country'] || 'ZA').toString().toUpperCase();
    const regionMap: Record<string, string> = {
      'US': 'usa',
      'IN': 'india',
      'CN': 'china',
      'ZA': 'southAfrica'
    };
    const region = regionMap[country] || 'southAfrica';
    
    console.log("🌍 Region:", region);
    
    // ✅ Update Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data: current } = await supabase
      .from('sales_counts')
      .select('count')
      .eq('region', region)
      .single();
    
    console.log("📈 Current Count:", current?.count || 0);
    
    await supabase
      .from('sales_counts')
      .update({ count: (current?.count || 0) + 1 })
      .eq('region', region);
    
    const newCount = (current?.count || 0) + 1;
    console.log("✅ SALES UPDATED! New Count:", newCount);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Sales updated successfully',
      region,
      newCount
    });
    
  } catch (error: any) {
    console.error("💥 WEBHOOK ERROR:", error.message);
    console.error("💥 Stack:", error.stack);
    return NextResponse.json({ 
      error: error.message,
      success: false 
    }, { status: 500 });
  }
}
