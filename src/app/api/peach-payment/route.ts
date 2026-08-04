import { NextResponse } from 'next/server';
import crypto from 'crypto';
import axios from 'axios';

const PEACH_AUTH_SERVICE = process.env.NODE_ENV === 'production' 
  ? 'https://auth-service.peachpayments.com'
  : process.env.PEACH_AUTH_SERVICE;

const PEACH_API_BASE = process.env.NODE_ENV === 'production'
  ? process.env.PEACH_API_BASE
  : process.env.PEACH_SANDBOX_BASE;

export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, currency = 'ZAR', reference, customerName, phoneNumber, paymentMethod = 'card' } = body;

    // ✅ Step 1: Generate Access Token (Fixes 404 - Missing Auth) [[13]]
    const tokenResponse = await axios.post(`${PEACH_AUTH_SERVICE}/api/oauth/token`, {
      clientId: process.env.PEACH_CLIENT_ID,
      clientSecret: process.env.PEACH_CLIENT_SECRET,
      merchantId: process.env.PEACH_ENTITY_ID
    });
    
    const { access_token } = tokenResponse.data;

    // ✅ Step 2: Create Checkout Instance
    const checkoutResponse = await axios.post(
      `${PEACH_API_BASE}/v2/checkout`,
      {
        entity_id: process.env.PEACH_ENTITY_ID,
        amount: parseInt(amount),
        currency: currency,
        reference: reference,
        // ✅ Skip Email Collection - Use Phone Instead [[17]]
        contact_method: {
          type: 'phone',
          value: phoneNumber
        },
        payment_methods: [paymentMethod],
        redirect_url: `${process.env.NEXT_PUBLIC_VERCEL_URL}/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_VERCEL_URL}/payment/cancel`,
        // Custom success messages
        return_message: `Thank you ${customerName}! Payment successful.`
      },
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // ✅ Step 3: Generate Signature (HMAC SHA256) [[9]]
    const paramsToSign = Object.keys(checkoutResponse.data)
      .sort()
      .map(key => `${key}${checkoutResponse.data[key]}`)
      .join('');
    
    const signature = crypto.createHmac('sha256', process.env.PEACH_SECRET_TOKEN)
      .update(paramsToSign)
      .digest('base64');

    // Return checkout data to frontend
    return NextResponse.json({
      success: true,
      checkoutId: checkoutResponse.data.checkoutId,
      checkoutUrl: checkoutResponse.data.redirect_url,
      signature: signature,
      nonce: Date.now().toString() // Unique nonce for duplicate prevention [[9]]
    });

  } catch (error) {
    console.error('Peach Payment Error:', error.response?.data || error.message);
    
    // Handle common 404 scenarios
    if (error.response?.status === 404) {
      return NextResponse.json(
        { 
          error: 'API Endpoint Not Found', 
          message: 'Verify your PEACH_API_BASE URL matches your environment (sandbox vs production)'
        }, 
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Payment initialization failed', 
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}

// GET method for health check
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    endpoint: '/api/peach-payment',
    supported_payment_methods: ['card', 'capitec_transfer', 'eft', 'internet_banking']
  });
}
