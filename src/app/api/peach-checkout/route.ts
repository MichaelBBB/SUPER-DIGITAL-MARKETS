// src/app/api/peach-checkout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // ✅ TEMPORARY: Return a test checkout ID to verify UI works
    // Remove this once we confirm environment variables are correct
    return NextResponse.json({ 
      checkoutId: '8a8294174b7ecb28014b36c577015263' // Test ID from Peach docs
    });
    
    /* REAL CODE (commented out for now):
    const body = await request.json();
    const amount = body.amount;
    const currency = body.currency || 'ZAR';
    
    const entityId = process.env.PEACH_ENTITY_ID;
    const authToken = process.env.PEACH_SECRET_TOKEN;
    
    if (!entityId || !authToken) {
      return NextResponse.json(
        { error: 'Configuration missing', details: { hasEntityId: !!entityId, hasToken: !!authToken } },
        { status: 500 }
      );
    }
    
    const response = await fetch('https://test.peachpayments.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount,
        currency: currency,
        entityid: entityId,
        paymentType: 'DB',
        testMode: '1',
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Peach error', details: data }, { status: response.status });
    }
    
    return NextResponse.json({ checkoutId: data.id });
    */
    
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Crash', 
      message: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
