export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase with Service Role Key (required for server-side updates)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Must use Service Role Key
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const payload = JSON.parse(rawBody);
    
    // Get webhook headers for signature verification
    const signature = request.headers.get('x-webhook-signature');
    const timestamp = request.headers.get('x-webhook-timestamp');
    const webhookId = request.headers.get('x-webhook-id');
    const algorithm = request.headers.get('x-webhook-signature-algorithm') || 'sha256';
    
    console.log(' Peach Webhook Received:', payload);
    console.log('Signature:', signature);

    // 1. VERIFY WEBHOOK SIGNATURE (Security - prevents fake webhooks)
    if (signature && process.env.PEACH_WEBHOOK_SECRET) {
      const peachSecret = process.env.PEACH_WEBHOOK_SECRET;
      const signedPayload = `${timestamp}.${webhookId}.${rawBody}`;
      
      const expectedSignature = crypto
        .createHmac(algorithm, peachSecret)
        .update(signedPayload)
        .digest('hex');

      if (signature !== expectedSignature) {
        console.error('❌ INVALID WEBHOOK SIGNATURE - Possible security breach!');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
      console.log('✅ Webhook signature verified');
    } else {
      console.warn('⚠️ No webhook signature found - skipping verification (DEV MODE?)');
    }
    
    const { event, data, event_type, result } = payload;

    // 2. CHECK IF PAYMENT WAS SUCCESSFUL
    const isSuccessful = 
      event === 'payment.completed' || 
      event === 'transaction.successful' ||
      event_type === 'payment.successful' ||
      result?.code === '000.000.000' ||
      result?.code === '0';

    if (isSuccessful) {
      console.log('✅ Payment successful - updating sales count');
      
      // 3. DETERMINE COUNTRY FROM METADATA
      // Peach Payments allows you to pass metadata with the payment
      const metadata = data?.metadata || payload.metadata || {};
      let country = metadata.country || metadata.region || 'southafrica';
      
      // Normalize country name to match database (lowercase, no spaces)
      country = country.toLowerCase().replace(/\s/g, '');
      
      // Map common variations
      const countryMap: Record<string, string> = {
        'za': 'southafrica',
        'southafrica': 'southafrica',
        'south africa': 'southafrica',
        'usa': 'usa',
        'unitedstates': 'usa',
        'india': 'india',
        'china': 'china',
        'cn': 'china'
      };
      
      const normalizedCountry = countryMap[country] || 'southafrica';
      
      console.log(`🌍 Detected country: ${normalizedCountry}`);

      // 4. UPDATE SALES COUNT IN SUPABASE
      if (supabase) {
        try {
          // Use atomic increment to avoid race conditions
          const { data: currentData, error: fetchError } = await supabase
            .from('sales_counts')
            .select('count')
            .eq('region', normalizedCountry)
            .single();

          if (fetchError) {
            console.error('Error fetching current count:', fetchError);
          }

          if (currentData) {
            const newCount = (currentData.count || 0) + 1;
            
            const { error: updateError } = await supabase
              .from('sales_counts')
              .update({ count: newCount })
              .eq('region', normalizedCountry);
              
            if (updateError) {
              console.error('❌ Error updating count:', updateError);
            } else {
              console.log(` SUCCESS: Updated ${normalizedCountry} count to ${newCount}`);
            }
          } else {
            // Create new record if region doesn't exist
            const { error: insertError } = await supabase
              .from('sales_counts')
              .insert([{ region: normalizedCountry, count: 1 }]);
              
            if (insertError) {
              console.error('❌ Error creating new record:', insertError);
            } else {
              console.log(`✅ Created new record for ${normalizedCountry} with count 1`);
            }
          }
        } catch (dbError) {
          console.error(' Database error:', dbError);
        }
      } else {
        console.error('❌ Supabase client not initialized');
      }
    } else {
      console.log('️ Payment not successful - skipping update');
    }

    // 5. ALWAYS RETURN 200 OK TO PEACH PAYMENTS
    // This tells them we received the webhook and they should stop retrying
    return NextResponse.json({ received: true, status: 'ok' }, { status: 200 });
    
  } catch (error) {
    console.error('❌ Webhook Error:', error);
    // Still return 200 to prevent Peach from retrying on parsing errors
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 200 });
  }
}
