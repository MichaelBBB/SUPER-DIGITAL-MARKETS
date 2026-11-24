
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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    // Prefer the server-side service key. If it is not available,
    // use the public anon key for this read-only product lookup.
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Product lookup configuration missing.', {
        supabaseUrlPresent: Boolean(supabaseUrl),
        serviceRoleKeyPresent: Boolean(
          process.env.SUPABASE_SERVICE_ROLE_KEY
        ),
        anonKeyPresent: Boolean(
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ),
      });

      return NextResponse.json(
        { error: 'Product database configuration is incomplete.' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
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
      // Log diagnostic information only; never log keys.
      console.error('Supabase product lookup query failed.', {
        code: error.code,
        message: error.message,
        hint: error.hint,
      });

      return NextResponse.json(
        {
          error:
            error.code === '42501'
              ? 'Product database access is blocked by permissions.'
              : 'Unable to retrieve the selected product from the database.',
        },
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
      !Number.isFinite(price) ||
      price <= 0
    ) {
      console.error('Product record is incomplete or invalid.', {
        productIdPresent: Boolean(product.id),
        productNamePresent: Boolean(product.name),
        priceValid: Number.isFinite(price) && price > 0,
      });

      return NextResponse.json(
        { error: 'The product record is incomplete or invalid.' },
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
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Unexpected product lookup failure.', {
      message:
        error instanceof Error
          ? error.message
          : 'Unknown server error',
    });

    return NextResponse.json(
      { error: 'An unexpected product lookup error occurred.' },
      { status: 500 }
    );
  }
}
