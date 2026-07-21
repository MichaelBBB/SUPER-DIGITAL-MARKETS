import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const logs: string[] = [];
  const log = (msg: string) => {
    console.log(msg);
    logs.push(msg);
  };

  try {
    log("🚀 Payment Request Started");

    const entityId = process.env.PEACH_ENTITY_ID?.trim();
    const clientSecret = process.env.PEACH_CLIENT_SECRET?.trim();

    log(`🔑 Entity ID: ${entityId ? 'Present' : 'MISSING'}`);
    log(`🔑 Secret: ${clientSecret ? 'Present' : 'MISSING'}`);

    if (!entityId || !clientSecret) {
      return new Response(JSON.stringify({ error: "Missing Credentials", logs }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const authString = `${entityId}:${clientSecret}`;
    const auth = Buffer.from(authString).toString('base64');
    log(`🔐 Auth Created: ${auth.substring(0, 20)}...`);

    const formData = await request.formData();
    const amount = parseFloat(formData.get('amount')?.toString() || '0');
    const amountCents = Math.round(amount * 100);
    const orderId = formData.get('orderId')?.toString() || `SD-${Date.now()}`;
    const productName = formData.get('productName')?.toString() || 'Product';

    log(`💰 Amount: ${amountCents} cents`);
    log(`📦 Order: ${orderId}`);

    if (amountCents <= 0) {
      return new Response(JSON.stringify({ error: "Invalid Amount", logs }), { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';
    const peachApiUrl = 'https://sandbox.checkout.peachpayments.com/api/v1/sessions';

    log(`📍 Calling: ${peachApiUrl}`);

    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    let response;
    try {
      response = await fetch(peachApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          amount: amountCents,
          currency: 'ZAR',
          orderReference: orderId,
          description: productName,
          returnUrl: `${baseUrl}/checkout?status=success`,
          cancelUrl: `${baseUrl}/checkout?status=cancelled`,
          webhook: `${baseUrl}/api/webhooks/peach`
        }),
        signal: controller.signal
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      log(`💥 Fetch Error: ${fetchError.message}`);
      return new Response(JSON.stringify({ 
        error: "Network Error", 
        message: fetchError.message,
        logs 
      }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    clearTimeout(timeoutId);
    log(`📡 Status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      log(`❌ Peach Error: ${errorText}`);
      
      return new Response(JSON.stringify({ 
        error: `Gateway Rejected (${response.status})`,
        message: errorText.substring(0, 500),
        logs 
      }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const data = await response.json();
    log(`✅ Response: ${JSON.stringify(data).substring(0, 100)}`);
    
    if (data.checkoutUrl) {
      return NextResponse.redirect(data.checkoutUrl);
    }

    return new Response(JSON.stringify({ error: "No checkout URL", logs }), { status: 500 });

  } catch (error: any) {
    log(`💥 System Error: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message, logs }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
