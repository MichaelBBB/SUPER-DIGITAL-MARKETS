import { NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { getProductDelivery } from '@/lib/product-licenses';
import crypto from 'crypto';

export const runtime = 'nodejs';

// 🔹 Simple in-memory pending orders (upgrade to Vercel KV for production)
const pendingOrders: Record<string, any> = {};

export async function POST(req: Request) {
  try {
    const { amount, orderId, productName, customerEmail } = await req.json();
    
    if (!amount || !orderId) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    // 🔹 Generate secure approval token
    const approvalToken = crypto.randomBytes(32).toString('hex');
    const adminEmail = 'admin@superdigital.store'; // 🔹 CHANGE TO YOUR EMAIL

    // Store pending order
    pendingOrders[approvalToken] = { orderId, productName, customerEmail, amount, createdAt: new Date().toISOString() };

    // 🔹 Send approval email to admin
    const approvalLink = `https://superdigital.store/api/admin/approve?token=${approvalToken}`;
    
    await resend.emails.send({
      from: 'Super Digital Notifications <alerts@superdigital.store>',
      to: [adminEmail],
      subject: `🔔 New Capitec Payment: ${productName} ($${amount})`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #fff; padding: 24px; border-radius: 12px;">
          <h2 style="color: #f59e0b;">New Capitec Bank Transfer Received</h2>
          <p><strong>Product:</strong> ${productName}</p>
          <p><strong>Order Ref:</strong> ${orderId}</p>
          <p><strong>Amount:</strong> $${amount}</p>
          <p><strong>Customer Email:</strong> ${customerEmail || 'Not provided'}</p>
          <p style="margin-top: 16px;">Please verify the payment in your Capitec app. Once confirmed, click below to deliver instantly:</p>
          <a href="${approvalLink}" style="display: inline-block; background: #06b6d4; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 12px;">✅ Approve & Deliver Instantly</a>
        </div>
      `,
    });

    console.log(`📧 Capitec approval email sent to ${adminEmail}`);
    return NextResponse.json({ success: true, message: 'Payment recorded. Admin notified for approval.' });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
