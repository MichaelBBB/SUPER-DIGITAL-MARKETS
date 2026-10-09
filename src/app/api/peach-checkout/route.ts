import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Find every environment variable with 'PEACH' in the name
  const peachKeys = Object.keys(process.env).filter(key => 
    key.toUpperCase().includes('PEACH')
  );

  // Return the list to the browser
  return NextResponse.json({
    debug: true,
    message: "These are the Peach keys Vercel can see:",
    keysFound: peachKeys,
    instruction: "Look at the Network Tab 'Response' to see this list."
  }, { status: 200 });
}
