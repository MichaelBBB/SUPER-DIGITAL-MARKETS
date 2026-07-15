import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize the Supabase Client
// These environment variables were added in the Vercel Dashboard earlier
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

// GET: Fetches current sales counts from the database
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('sales_counts')
      .select('region, count');

    if (error) throw error;

    // Format the data into the object structure our frontend expects
    const stats = { usa: 0, india: 0, china: 0, southAfrica: 0 };
    if (data) {
      data.forEach((item) => {
        // Use type assertion to safely map regions
        const regionKey = item.region as keyof typeof stats;
        stats[regionKey] = item.count;
      });
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching sales:', error);
    // Return zeros if database connection fails, so site doesn't crash
    return NextResponse.json({ usa: 0, india: 0, china: 0, southAfrica: 0 });
  }
}

// POST: Increments the sales count for a specific region
export async function POST(request: Request) {
  try {
    const { region } = await request.json();

    // Validate that the requested region is valid
    if (!region || !['usa', 'india', 'china', 'southAfrica'].includes(region)) {
      return NextResponse.json({ error: 'Invalid region' }, { status: 400 });
    }

    // 1. Get the current count
    const { data: currentRow } = await supabase
      .from('sales_counts')
      .select('count')
      .eq('region', region)
      .single();

    const currentCount = currentRow?.count || 0;

    // 2. Update the count in the database
    const { error } = await supabase
      .from('sales_counts')
      .update({ count: currentCount + 1 })
      .eq('region', region);

    if (error) throw error;

    return NextResponse.json({ success: true, newCount: currentCount + 1 });
  } catch (error) {
    console.error('Error updating sales:', error);
    return NextResponse.json({ error: 'Failed to update sales' }, { status: 500 });
  }
}
