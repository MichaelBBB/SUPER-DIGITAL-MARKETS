const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface DeliveryParams {
  productName: string;
  orderRef: string;
  amount: number;
  customerEmail: string;
  customerPhone: string;
}

export async function deliverProduct(params: DeliveryParams): Promise<boolean> {
  const { productName, orderRef, amount, customerEmail, customerPhone } = params;

  try {
    // 1. Find the product and its specific Quick Start Guide (notes)
    const findRes = await fetch(`${SB_URL}/rest/v1/credentials?select=*&product_name=eq.${encodeURIComponent(productName)}&available=eq.true&limit=1`, {
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` }
    });
    const credentials = await findRes.json();

    if (!credentials || credentials.length === 0) {
      console.error(`OUT OF STOCK: ${productName}`);
      return false;
    }

    const item = credentials[0];

    // 2. Mark it as sold
    await fetch(`${SB_URL}/rest/v1/credentials?id=eq.${item.id}`, {
      method: 'PATCH',
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ available: false, sold_to: customerEmail || customerPhone, sold_at: new Date().toISOString() })
    });

    // 3. Build the INSTANT, BRIEF delivery message
    const message = `
✅ ORDER CONFIRMED: ${orderRef}
PRODUCT: ${productName}
AMOUNT: $${amount.toFixed(2)}

🔑 YOUR LOGIN DETAILS:
Email: ${item.email}
Password: ${item.password}

⚡ QUICK START GUIDE:
${item.notes || '1. Go to the provider website. 2. Log in with the details above. 3. Enjoy!'}

Need help? Reply to this message.
`.trim();

    // 4. Send Email (Instant)
    if (customerEmail && process.env.RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Super Digital <noreply@superdigitalmarkets.co.za>',
          to: customerEmail,
          subject: `✅ Instant Delivery: ${productName}`,
          text: message
        })
      }).catch(err => console.error('Email failed:', err));
    }

    // 5. Log the sale for the Live Tracker
    await fetch(`${SB_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: orderRef,
        product_name: productName,
        amount: amount,
        customer_email: customerEmail,
        status: 'delivered',
        created_at: new Date().toISOString()
      })
    });

    return true;
  } catch (error) {
    console.error('Delivery error:', error);
    return false;
  }
}
