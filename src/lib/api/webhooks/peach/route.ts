import { NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { getProductDelivery } from '@/lib/product-licenses';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, shopperEmail, amount, status } = body;

    if (status !== 'SUCCESS' && status !== 'CAPTURED') {
      return NextResponse.json({ received: true });
    }

    // 🔹 Extract product ID from order reference (format: SD-{productId})
    const productId = Number(orderId.split('-')[1]);
    const delivery = getProductDelivery(productId, orderId);

    // 🔹 Send Instant Delivery Email
    await resend.emails.send({
      from: 'Super Digital <deliveries@superdigital.store>',
      to: [shopperEmail || 'customer@example.com'],
      subject: `🚀 Instant Delivery: ${delivery.name}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #fff; padding: 32px; border-radius: 16px;">
          <h1 style="color: #06b6d4; margin-bottom: 16px;">🚀 Your ${delivery.name} is Ready!</h1>
          <p style="color: #94a3b8; line-height: 1.6;">Thank you for your purchase. Your access details are ready instantly:</p>
          
          <div style="background: #1e293b; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #334155;">
            <p style="margin: 8px 0;"><strong>Order Reference:</strong> ${orderId}</p>
            <p style="margin: 8px 0;"><strong>License/Access Code:</strong><br/><code style="background: #0f172a; padding: 6px 12px; border-radius: 6px; color: #06b6d4; font-size: 16px; display: block; margin-top: 4px;">${delivery.license}</code></p>
            <p style="margin: 8px 0;"><strong>Access Link:</strong> <a href="${delivery.link}" style="color: #06b6d4; text-decoration: none;">${delivery.link}</a></p>
          </div>

          <p style="color: #cbd5e1; line-height: 1.6;">${delivery.instructions}</p>
          
          <hr style="border: none; border-top: 1px solid #334155; margin: 24px 0;">
          <p style="color: #64748b; font-size: 12px;">Need help? Reply to this email or contact support@superdigital.store</p>
        </div>
      `,
    });

    console.log(`✅ Instant delivery sent: ${orderId} → ${shopperEmail}`);
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Webhook error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
