// src/app/api/peach-checkout/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amountZAR = parseFloat(body.amount);
    const amountInCents = Math.round(amountZAR * 100); // Peach requires integer cents
    
    const merchantTransactionId = `SDM-${Date.now()}`;
    const nonce = `nonce-${Math.random().toString(36).substring(2, 15)}`;
    
    // ⚠️ CRITICAL: This Entity ID MATCHES the Bearer Token below. Do not change one without the other.
    const entityId = "9e65f2c5950c4b8483ffbd225bd6f027"; 
    
    // ⚠️ CRITICAL: This is the token Peach Support provided. 
    // If you want to use your other Entity ID, you MUST generate a new token for it in the Peach Dashboard.
    const authToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjIwMjEtMDktMDYifQ.eyJlbnRpdHlJRCI6IjllNjVmMmM1OTUwYzRiODQ4M2ZmYmQyMjViZDZmMDI3IiwicGFydG5lciI6ZmFsc2UsInNpZCI6IjAyNjE0YWUyMjMwZTk3MjZhOWEwIiwibWVyY2hhbnRJZCI6IjllNjVmMmM1OTUwYzRiODQ4M2ZmYmQyMjViZDZmMDI3IiwiaWF0IjoxNzg3OTE0NjA2LCJuYmYiOjE3ODc5MTQ2MDYsImV4cCI6MTc4NzkyOTAwNiwiYXVkIjoiaHR0cHM6Ly9tMm0ucGVhY2hwYXltZW50cy5jb20iLCJpc3MiOiJodHRwczovL2Rhc2hib2FyZC5wZWFjaHBheW1lbnRzLmNvbS8iLCJzdWIiOiIxYTg3MDE0MGVhMTJiZWNjNjI4YjZlOTkzNjllOTgifQ.bslhEmbPvNbB-bsfkUn0ajj_UwdrvQCeG2hazSt34qoySoAnGtyLNDAva07oGdWz2UGGB3epSbg-fLHdwSJHvtJh_hIiPvR_roPyrDcPg0bnZtGf8Jx6iMR5Af5YRXxvlOza1gOhkrAw3a9nZmiSqaXTElZxS4ybz8ZHde-miLmdNon0i5uleGSCDY0BWHpCeygo5oPWm7-8gX8gBOOWt5q7TucOgK1Y8jksLTnBnCgFoRWvWfcfeKuDqJID4hY1oHK1YjtRXDuzFLVQfvjYEB266oUeISk9arrcS1vsEp8s6SPGUIf6FRJ9l8JujgxqyOa4W2KDbNxm95QT44LaoRKgfGwCHbJppiqe6cfqrNjO6AIs8T26NBOW_N0wEY1w4it58S7MePXLlz4ly1M_dpXBFwLW5uITIfeEJyZD8socN8DUkMd8lMYpmAF10KaoPc9Y0xe_cX2T1zVddUr-3r3qKXJHA64N8LzSqq6UPh1HpcoicOHpRyRbVaWdoNg4e2FtjQTnzad2QN4kyBYRvM7aTKZV0eftCcip2jrxXIeENt45j80WKY4KpAMNQCv1qf2OhL_4DNk8oRQHD49zZKDB_kG1E44wp72Wg0m6bNqTl4aWL1I-JzmJtqAJ9Mn94Yyn9dy84l3lWqKSfUw6YuysmGnH0W59xPDwytYl-pA";
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';

    const response = await fetch('https://secure.peachpayments.com/v2/checkout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Referer': baseUrl,
        'accept': 'application/json',
      },
      body: JSON.stringify({
        'authentication.entityId': entityId, // Must match the token's internal entityID
        merchantTransactionId: merchantTransactionId,
        amount: amountInCents,
        currency: body.currency || 'ZAR',
        paymentType: 'DB',
        nonce: nonce,
        shopperResultUrl: `${baseUrl}/payment/success`,
        cancelUrl: `${baseUrl}/payment/cancelled`,
        notificationUrl: `${baseUrl}/api/webhooks/peach`,
        forceDefaultMethod: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Peach API Error:', data);
      return NextResponse.json({ 
        error: data.message || 'Payment initialization failed',
        details: data.description || 'Unknown error'
      }, { status: response.status });
    }

    if (!data.id) {
      return NextResponse.json({ error: 'No checkout ID returned', response: data }, { status: 500 });
    }

    return NextResponse.json({ checkoutId: data.id });

  } catch (error: any) {
    console.error('💥 API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
  }
}
