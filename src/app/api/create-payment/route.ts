// Inside your POST function, replace the payloadData section with this:

    // Ensure amount is a string with 2 decimal places (e.g., "10.99")
    const formattedAmount = parseFloat(amount).toFixed(2);

    const payloadData: Record<string, string> = {
      entity_id: ENTITY_ID,
      merchant_id: MERCHANT_ID,
      amount: formattedAmount, 
      currency: currency.toUpperCase(), // Ensure USD is uppercase
      paymentType: 'DB', 
      transactionMode: PEACH_MODE === 'LIVE' ? 'LIVE' : 'TEST',
      billingMode: 'B2C',
      resultUrl: `${BASE_URL}/payment/success`,
      errorUrl: `${BASE_URL}/payment/fail`,
      shopper_resultUrl: `${BASE_URL}/payment/success`,
      custom_parameters: JSON.stringify({
        orderId: orderId,
        productName: productName,
        whatsappNumber: WHATSAPP_NUMBER
      })
    };
