export const dynamic = 'force-dynamic'; // Forces this route to run on every request, not at build time

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase for updating sales counts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    console.log('Peach Webhook Received:', payload);

    // Verify this is a valid webhook from Peach Payments
    // (In production, you should verify the signature)
    
    const { event, data } = payload;

    if (event === 'payment.completed' || event === 'transaction.successful') {
      // Update sales count in Supabase
      if (supabase) {
        // Determine country from customer data or IP (simplified here to South Africa for testing)
        // In a real app, you would extract this from data.customer.country or request headers
        const country = 'southAfrica'; 
        
        // Increment the count
        const { data: currentData, error: fetchError } = await supabase
          .from('sales_counts')
          .select('count')
          .eq('region', country)
          .single();

        if (!fetchError && currentData) {
          const newCount = (currentData.count || 0) + 1;
          
          await supabase
            .from('sales_counts')
            .update({ count: newCount })
            .eq('region', country);
            
          console.log(`Updated ${country} count to ${newCount}`);
        } else {
          // Create new record if it doesn't exist
          await supabase
            .from('sales_counts')
            .insert([{ region: country, count: 1 }]);
          console.log(`Created new record for ${country} with count 1`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
