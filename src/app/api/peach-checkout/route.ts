// src/app/api/peach-checkout/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amount = body.amount; // Already in ZAR from frontend conversion
    const currency = body.currency || 'ZAR';

    // ✅ YOUR LIVE ENTITY ID
    const entityId = "8acda4cb9e1b546a019e1b5b39ee001c";
    
    // ✅ USE YOUR SECRET TOKEN (not the Access Token)
    const authToken = "58c4748b406945d8802cf0f7997456e0";
    
    // ✅ CORRECT V1 ENDPOINT (not v2)
    const apiUrl = "https://peachpayments.com/v1/checkouts";

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount,
        currency: currency,
        entityid: entityId, // lowercase 'd' as per v1 API
        paymentType: 'DB',
        testMode: '0', // 0 for Live, 1 for Test
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Peach API Error:', data);
      return NextResponse.json({ 
        error: data.description || 'Payment initialization failed'
      }, { status: response.status });
    }

    if (!data.id) {
      return NextResponse.json({ error: 'No checkout ID returned' }, { status: 500 });
    }

    return NextResponse.json({ checkoutId: data.id });

  } catch (error: any) {
    console.error('💥 API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
