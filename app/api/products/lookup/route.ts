
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const name = request.nextUrl.searchParams.get('name')?.trim();

    if (!name) {
      return NextResponse.json(
        { error: 'A product name is required.' },
        { status: 400 }
      );
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      return NextResponse.json(
        { error: 'Product lookup is temporarily unavailable.' },
        { status: 500 }
      );
    }

    const supabase = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data, error } = await supabase
      .from('products')
      .select('id, name, price_usd')
      .eq('name', name)
      .limit(2);

    if (error) {
      console.error('Product lookup failed:', error.code);
      return NextResponse.json(
        { error: 'Unable to look up the selected product.' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Product not found in the payment database.' },
        { status: 404 }
      );
    }

    if (data.length > 1) {
      return NextResponse.json(
        { error: 'Duplicate product entries were found.' },
        { status: 409 }
      );
    }

    const product = data[0];
    const price = Number(product.price_usd);

    if (
      !product.id ||
      !product.name ||
      product.price_usd == null ||
      !Number.isFinite(price)
    ) {
      return NextResponse.json(
        { error: 'The product record is incomplete.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        product: {
          id: product.id,
          name: product.name,
          price_usd: price,
        },
      },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store' },
      }
    );
  } catch (error) {
    console.error(
      'Unexpected product lookup error:',
      error instanceof Error ? error.message : 'Unknown error'
    );

    return NextResponse.json(
      { error: 'An unexpected product lookup error occurred.' },
      { status: 500 }
    );
  }
}
