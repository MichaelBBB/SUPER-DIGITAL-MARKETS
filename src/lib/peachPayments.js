import axios from 'axios';

const config = {
  entityID: process.env.NEXT_PUBLIC_PEACH_ENTITY_ID,
  username: process.env.PEACH_USERNAME,
  password: process.env.PEACH_PASSWORD,
  baseURL: process.env.NEXT_PUBLIC_PEACH_ENV === 'production' 
    ? 'https://api.peachpayments.com' 
    : 'https://test.peachpayments.com'
};

export async function initiatePayment(orderData) {
  try {
    const response = await axios.post(`${config.baseURL}/v1/checkouts`, {
      entityID: config.entityID,
      amount: orderData.amount,
      currency: orderData.currency,
      paymentType: 'DB',
      merchantTransactionId: `TXN-${Date.now()}`,
      description: 'Payment for order',
      customer: {
        givenName: orderData.firstName || 'Test',
        surname: orderData.lastName || 'User',
        email: orderData.email || 'test@example.com'
      }
    }, {
      auth: {
        username: config.username,
        password: config.password
      }
    });

    return {
      success: true,
      redirectUrl: response.data.redirectUrl,
      checkoutId: response.data.id
    };
  } catch (error) {
    console.error('Peach Payments Error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.result?.description || 'Payment initiation failed'
    };
  }
}
