import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, orderId, productName, customerEmail } = body;

    // ✅ YOUR EXISTING EMAIL/WEBHOOK LOGIC GOES HERE IF NEEDED
    // (This route now safely triggers the sales counter regardless)

    // 🔢 INCREMENT SALES COUNTER FOR SOUTH AFRICA
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://super-digital-markets-co9n.vercel.app';
    await fetch(`${baseUrl}/api/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ region: 'southAfrica' })
    });

    return NextResponse.json({
      success: true,
      message: '✅ Payment recorded! Admin will verify & deliver instantly.',
      orderId,
      amount
    });
  } catch (error) {
    console.error('Capitec payment error:', error);
    return NextResponse.json({ success: false, error: 'Payment processing failed' }, { status: 500 });
  }
}
