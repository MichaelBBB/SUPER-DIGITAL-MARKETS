import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  console.log("🔔 WEBHOOK RECEIVED!");
  console.log("📍 Method:", request.method);
  console.log("📍 URL:", request.url);
  console.log("📍 Headers:", Object.fromEntries(request.headers));

  try {
    // 1. Read raw body
    const rawBody = await request.text();
    console.log("📦 Raw Body:", rawBody);

    // 2. Parse body (handle both JSON and form data)
    let payload;
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      payload = JSON.parse(rawBody);
      console.log("📄 Parsed as JSON");
    } else {
      const params = new URLSearchParams(rawBody);
      payload = {};
      for (const [key, value] of params.entries()) {
        payload[key] = value;
      }
      console.log("📄 Parsed as Form Data");
    }

    console.log("📊 Payload:", JSON.stringify(payload, null, 2));

    // 3. Check payment status
    const status = (payload.status || payload.payment_status || '').toString().toUpperCase();
    console.log("💳 Payment Status:", status);

    if (!['SUCCESS', 'COMPLETED', 'PAID'].includes(status)) {
      console.log("⚠️ Ignoring non-successful payment");
      return NextResponse.json({ success: true, message: 'Ignored' });
    }

    // 4. Determine region
    const country = (payload.country || 'ZA').toString().toUpperCase();
    const regionMap: Record<string, string> = {
      'US': 'usa',
      'IN': 'india',
      'CN': 'china',
      'ZA': 'southAfrica'
    };
    const region = regionMap[country] || 'southAfrica';
    console.log("🌍 Region:", region);

    // 5. Update Supabase
    const { createClient } = await import('@supabase/supabase-js');
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

    console.log("✅ Sales Updated! New Count:", (current?.count || 0) + 1);

    return NextResponse.json({ 
      success: true, 
      message: 'Sales updated',
      region,
      newCount: (current?.count || 0) + 1
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

// Also handle GET requests for testing
export async function GET() {
  return NextResponse.json({ 
    message: 'Webhook endpoint is alive!',
    timestamp: new Date().toISOString()
  });
}
