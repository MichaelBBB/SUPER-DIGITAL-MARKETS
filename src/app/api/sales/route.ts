import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// Helper to get a key name
const getKey = (region: string) => `sales:${region}`;

export async function GET() {
  try {
    // Fetch all counts from KV. If they don't exist yet, default to 0.
    const [usa, india, china, southAfrica] = await Promise.all([
      kv.get<number>(getKey('usa')) || 0,
      kv.get<number>(getKey('india')) || 0,
      kv.get<number>(getKey('china')) || 0,
      kv.get<number>(getKey('southAfrica')) || 0,
    ]);

    return NextResponse.json({ usa, india, china, southAfrica });
  } catch (error) {
    console.error('Error fetching sales:', error);
    // Return zeros if KV fails so the UI doesn't break
    return NextResponse.json({ usa: 0, india: 0, china: 0, southAfrica: 0 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { region } = body;

    if (!region || !['usa', 'india', 'china', 'southAfrica'].includes(region)) {
      return NextResponse.json({ error: 'Invalid region' }, { status: 400 });
    }

    // Increment the count for this region
    const key = getKey(region);
    const currentCount = await kv.get<number>(key) || 0;
    const newCount = currentCount + 1;
    
    await kv.set(key, newCount);

    return NextResponse.json({ success: true, newCount });
  } catch (error) {
    console.error('Error updating sales:', error);
    return NextResponse.json({ error: 'Failed to update sales' }, { status: 500 });
  }
}
