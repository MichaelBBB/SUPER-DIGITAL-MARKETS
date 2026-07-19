import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. Get raw body text
    const rawBody = await request.text();
    
    let payload;
    const contentType = request.headers.get('content-type') || '';

    // 2. Parse Body based on Content-Type
    // THIS IS THE FIX: Peach sends URL-encoded data, not JSON
    if (contentType.includes('application/json')) {
      try {
        payload = JSON.parse(rawBody);
      } catch (e) {
        console.error("Invalid JSON:", e);
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
      }
    } else {
      // Handle URL-encoded form data (e.g., "amount=22.99&status=success")
      // This fixes the "Unexpected token 'a'" error seen in your logs
      const params = new URLSearchParams(rawBody);
      payload = {};
      for (const [key, value] of params.entries()) {
        payload[key] = value;
      }
    }

    // 3. Verify Signature (Optional but recommended)
    const signature = request.headers.get('x-peach-signature') || '';
    const clientSecret = process.env.PEACH_CLIENT_SECRET || '';
    
    if (signature && clientSecret) {
      const hmac = crypto.createHmac('sha256', clientSecret).update(rawBody).digest('hex');
      if (signature !== hmac) {
        console.warn("Signature mismatch");
      }
    }

    // 4. Check Payment Status
    const status = (payload.status || payload.payment_status || '').toString().toUpperCase();
    
    if (!['SUCCESS', 'COMPLETED', 'PAID'].includes(status)) {
      return NextResponse.json({ success: true, message: 'Ignored non-successful payment' });
    }

    // 5. Determine Region
    const country = (payload.country || payload.source?.country || 'ZA').toString().toUpperCase();
    const regionMap: Record<string, string> = { 
      'US': 'usa', 
      'IN': 'india', 
      'CN': 'china', 
      'ZA': 'southAfrica' 
    };
    const region = regionMap[country] || 'southAfrica';

    // 6. Update Supabase Sales Counter
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    
    const { data: current } = await supabase
      .from('sales_counts')
      .select('count')
      .eq('region', region)
      .single();
      
    await supabase
      .from('sales_counts')
      .update({ count: (current?.count || 0) + 1 })
      .eq('region', region);

    console.log(`Sales updated for ${region}. New count: ${(current?.count || 0) + 1}`);

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
