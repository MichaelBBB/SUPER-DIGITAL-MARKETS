import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.text();
  const params = new URLSearchParams(body);
  
  const status = params.get('result');
  const id = params.get('id');
  const customParams = JSON.parse(params.get('custom_parameters') || '{}');
  
  // Verify Signature (Crucial for security - check Peach docs for HMAC validation)
  // If signature is valid AND status is successful:
  if (status === 'SUCCESS' || status === 'PAID') {
    
    const { orderId, productName, whatsappNumber } = customParams;

    // ✅ AUTOMATE STEP 5 & 6: Send WhatsApp Message Automatically
    // You can use a service like Twilio or a simple WhatsApp Business API call here
    const whatsappMessage = `✅ *PAYMENT CONFIRMED!*\n\nOrder: ${orderId}\nProduct: ${productName}\nAmount Paid: Successfully received via Capitec.\n\nYour digital product link is being generated...`;
    
    // Example: Log it or send via an API like Twilio/Meta Graph API
    console.log(`Sending to ${whatsappNumber}: ${whatsappMessage}`);
    // await sendWhatsApp(whatsappNumber, whatsappMessage); 

    return NextResponse.json({ status: 'ok' });
  }

  return NextResponse.json({ status: 'ignored' });
}
