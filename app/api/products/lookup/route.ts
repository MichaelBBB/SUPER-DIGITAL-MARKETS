
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL;

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  const missing = [];

  if (!supabaseUrl) {
    missing.push('NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL');
  }

  if (!supabaseKey) {
    missing.push(
      'SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_ANON_KEY, or SUPABASE_ANON_KEY'
    );
  }

  console.error('Product lookup missing configuration:', missing);

  return NextResponse.json(
    {
      error: 'Product database configuration is incomplete.',
      missing,
    },
    { status: 500 }
  );
}
