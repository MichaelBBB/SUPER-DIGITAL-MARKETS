import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

/**
 * POST /app/api/peach/create-checkout
 * Expected JSON body: { priceId: string, quantity?: number, successUrl?: string, cancelUrl?: string }
 * Returns: { url: string, id: string }
 */
export async function POST({ request }) {
  try {
    const { priceId, quantity = 1, successUrl, cancelUrl } = await request.json();

    if (!priceId) {
      return new Response(JSON.stringify({ error: 'Missing priceId' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity }],
      success_url:
        successUrl || `${process.env.BASE_URL || 'https://your-site.example'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.BASE_URL || 'https://your-site.example'}/cancel`,
    });

    return new Response(JSON.stringify({ url: session.url, id: session.id }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    console.error('app/api/peach/create-checkout error', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
