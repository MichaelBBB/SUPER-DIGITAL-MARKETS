
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const name = request.nextUrl.searchParams.get('name')?.trim();

    if (!name) {
      return NextResponse.json(
        { error: 'A product name is required.' },
        { status: 400 }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_URL;

    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      const missing: string[] = [];

      if (!supabaseUrl) {
        missing.push(
          'NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL'
        );
      }

      if (!supabaseKey) {
        missing.push(
          'SUPABASE_SERVICE_ROLE_KEY, ' +
          'NEXT_PUBLIC_SUPABASE_ANON_KEY, or ' +
          'SUPABASE_ANON_KEY'
        );
      }

      console.error(
        'Product lookup missing configuration:',
        missing
      );

      return NextResponse.json(
        {
          error: 'Product database configuration is incomplete.',
          missing,
        },
        {
          status: 500,
          headers: { 'Cache-Control': 'no-store' },
        }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    const { data, error } = await supabase
      .from('products')
      .select('id, name, price_usd')
      .eq('name', name)
      .limit(2);

    if (error) {
      console.error(
        'Product lookup database error:',
        error.message
      );

      return NextResponse.json(
        {
          error: 'Unable to retrieve the product from the database.',
        },
        {
          status: 500,
          headers: { 'Cache-Control': 'no-store' },
        }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          error: 'Product not found.',
          productName: name,
        },
        {
          status: 404,
          headers: { 'Cache-Control': 'no-store' },
        }
      );
    }

    if (data.length > 1) {
      return NextResponse.json(
        {
          error: 'Multiple products have this exact name.',
          productName: name,
        },
        {
          status: 409,
          headers: { 'Cache-Control': 'no-store' },
        }
      );
    }

    const product = data[0];
    const price = Number(product.price_usd);

    if (
      !product.id ||
      !product.name ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      console.error(
        'Product lookup returned invalid product data.'
      );

      return NextResponse.json(
        { error: 'The product database record is invalid.' },
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
