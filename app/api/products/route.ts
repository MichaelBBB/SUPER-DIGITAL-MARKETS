
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
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error(
        'Product lookup configuration is missing.'
      );

      return NextResponse.json(
        { error: 'Product lookup is temporarily unavailable.' },
        { status: 500 }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey,
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
        error.code
      );

      return NextResponse.json(
        { error: 'Unable to look up the selected product.' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          error:
            'This product is not yet listed in the payment database. Please contact the store before paying.',
        },
        { status: 404 }
      );
    }

    if (data.length > 1) {
      return NextResponse.json(
        {
          error:
            'Duplicate product entries were found. Please contact the store before paying.',
        },
        { status: 409 }
      );
    }

    const product = data[0];

    if (
      !product.id ||
      !product.name ||
      product.price_usd == null ||
      !Number.isFinite(Number(product.price_usd))
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
          price_usd: Number(product.price_usd),
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
    console.error(
      'Unexpected product lookup failure:',
      error instanceof Error ? error.message : 'Unknown error'
    );

    return NextResponse.json(
      { error: 'An unexpected product lookup error occurred.' },
      { status: 500 }
    );
  }
}

