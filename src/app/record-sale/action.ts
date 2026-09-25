'use server';

import { createClient } from '@supabase/supabase-js';

export async function recordSale(formData: FormData) {
  const key = formData.get('key') as string;
  const region = formData.get('region') as string;

  if (key !== process.env.RECORD_KEY) {
    return { success: false, error: 'Invalid record key' };
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const normalizedRegion = region.toLowerCase().replace(/\s/g, '');

  const { data: current, error: fetchError } = await supabase
    .from('sales_counts')
    .select('count')
    .eq('region', normalizedRegion)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    return { success: false, error: fetchError.message };
  }

  const newCount = (current?.count || 0) + 1;

  const { error: updateError } = await supabase
    .from('sales_counts')
    .upsert({ region: normalizedRegion, count: newCount }, { onConflict: 'region' });

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  return { success: true, newCount };
}
