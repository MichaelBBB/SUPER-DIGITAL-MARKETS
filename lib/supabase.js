import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Realtime subscription for Live Dashboard
export function subscribeToLiveOrders(callback) {
  const channel = supabase
    .channel('orders-realtime')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
      if (payload.new.status === 'completed') callback(payload.new);
    })
    .subscribe();
  return () => supabase.removeChannel(channel);
}
