// src/app/api/peach-checkout/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amount = body?.amount || '100.00';
    const currency = body?.currency || 'ZAR';

    const entityId = "8acda4cb9e1b546a019e1b5b39ee001c";
    const authToken = "58c4748b406945d8802cf0f7997456e0";
    
    // Try BOTH possible endpoints
    const endpoints = [
      "https://peachpayments.com/v1/checkouts",
      "https://secure.peachpayments.com/v1/checkouts",
      "https://test.peachpayments.com/v1/checkouts"
    ];

    for (const apiUrl of endpoints) {
      try {
        console.log(`Trying: ${apiUrl}`);
        
        const response = await fetch(apiUrl, {
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
            testMode: '0',
          }),
        });

        const responseText = await response.text();
        
        // Check if response is HTML (error page)
        if (responseText.trim().startsWith('<')) {
          console.error(`❌ ${apiUrl} returned HTML instead of JSON`);
          continue; // Try next endpoint
        }

        const data = responseText ? JSON.parse(responseText) : {};

        if (!response.ok) {
          console.error(`❌ ${apiUrl} failed:`, data);
          continue; // Try next endpoint
        }

        if (data.id) {
          console.log(`✅ Success with ${apiUrl}`);
          return NextResponse.json({ checkoutId: data.id });
        }

      } catch (endpointError) {
        console.error(`Error with ${apiUrl}:`, endpointError);
        continue; // Try next endpoint
      }
    }

    // All endpoints failed
    return NextResponse.json({ 
      error: 'All Peach Payments endpoints failed',
      tried: endpoints
    }, { status: 500 });

  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Internal Server Error',
      message: error.message
    }, { status: 500 });
  }
}
