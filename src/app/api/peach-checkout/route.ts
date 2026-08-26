// src/app/api/peach-checkout/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amount = body.amount;
    const currency = body.currency || 'ZAR';

    // 1. Explicitly log what we are sending (Check Vercel Function Logs later if needed)
    console.log(' Attempting Peach Checkout:', { amount, currency });

    // 2. Construct the EXACT payload Peach expects
    // Note: Peach usually expects 'entityid' (lowercase d), not 'entityId'
    const payload = {
      amount: amount.toString(),
      currency: currency,
      entityid: process.env.PEACH_ENTITY_ID, 
      paymentType: 'DB', // Debit
      testMode: '1',     // Force Test Mode explicitly
    };

    console.log('🔑 Using Entity ID:', process.env.PEACH_ENTITY_ID ? 'Present' : 'MISSING');
    console.log(' Using Token:', process.env.PEACH_SECRET_TOKEN ? 'Present' : 'MISSING');

    // 3. Call Peach API
    // IMPORTANT: Ensure URL matches your environment (test. vs live.)
    const peachUrl = 'https://test.peachpayments.com/v1/checkouts'; 
    
    const response = await fetch(peachUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PEACH_SECRET_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // 4. CRITICAL: If Peach returns an error, forward it EXACTLY to the frontend
    if (!response.ok) {
      console.error('❌ Peach API Error:', data);
      return NextResponse.json({ 
        error: 'Peach Payment Failed', 
        details: data, // This will show up in your Network tab!
        status: response.status 
      }, { status: response.status });
    }

    // 5. Success
    if (!data.id) {
       throw new Error('Peach returned no ID');
    }

    return NextResponse.json({ checkoutId: data.id });

  } catch (error: any) {
    console.error('💥 Unexpected Crash:', error);
    return NextResponse.json({ 
      error: 'Server Crash', 
      message: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
