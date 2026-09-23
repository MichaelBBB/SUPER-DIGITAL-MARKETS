export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const payload = JSON.parse(rawBody);
    
    const signature = request.headers.get('x-webhook-signature');
    const timestamp = request.headers.get('x-webhook-timestamp');
    const webhookId = request.headers.get('x-webhook-id');
    const algorithm = request.headers.get('x-webhook-signature-algorithm') || 'sha256';
    
    console.log('📥 Peach Webhook Received:', payload);

    // Verify signature if secret is provided
    if (signature && process.env.PEACH_WEBHOOK_SECRET) {
      const signedPayload = `${timestamp}.${webhookId}.${rawBody}`;
      const expectedSignature = crypto.createHmac(algorithm, process.env.PEACH_WEBHOOK_SECRET).update(signedPayload).digest('hex');

      if (signature !== expectedSignature) {
        console.error('❌ Invalid webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const { event, data, event_type, result } = payload;
    const isSuccessful = event === 'payment.completed' || event === 'transaction.successful' || event_type === 'payment.successful' || result?.code === '000.000.000' || result?.code === '0';

    if (isSuccessful) {
      console.log('✅ Payment successful - updating sales count');
      
      const metadata = data?.metadata || payload.metadata || {};
      let country = (metadata.country || metadata.region || 'southafrica').toLowerCase().replace(/\s/g, '');
      
      const countryMap: Record<string, string> = {
        'za': 'southafrica', 'southafrica': 'southafrica', 'south africa': 'southafrica',
        'usa': 'usa', 'unitedstates': 'usa',
        'india': 'india',
        'china': 'china', 'cn': 'china'
      };
      
      const normalizedCountry = countryMap[country] || 'southafrica';

      if (supabase) {
        const { data: currentData } = await supabase.from('sales_counts').select('count').eq('region', normalizedCountry).single();
        
        if (currentData) {
          const newCount = (currentData.count || 0) + 1;
          await supabase.from('sales_counts').update({ count: newCount }).eq('region', normalizedCountry);
          console.log(`🚀 SUCCESS: Updated ${normalizedCountry} count to ${newCount}`);
        } else {
          await supabase.from('sales_counts').insert([{ region: normalizedCountry, count: 1 }]);
          console.log(`✅ Created new record for ${normalizedCountry}`);
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('❌ Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 200 });
  }
}
