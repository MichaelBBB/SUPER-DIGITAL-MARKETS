// Add these to the params object:
const params: Record<string, string> = {
  "amount": parseFloat(amount).toFixed(2),
  "authentication.entityId": ENTITY_ID,
  "currency": currency.toUpperCase(),
  "defaultPaymentMethod": "CARD",
  "merchantTransactionId": orderId,
  "nonce": `UNQ${Date.now()}`,
  "paymentType": "DB",
  "shopperResultUrl": `${cleanBaseUrl}/success`,
  
  // ✅ PRE-FILL CUSTOMER DATA (Reduces manual entry)
  "customer.givenName": "Customer", // Get from user session
  "customer.surname": "Order",
  "customer.email": "customer@email.com", // Get from checkout form
  "customer.mobile": "+27123456789", // Get from checkout form
  "billing.country": "ZA",
  "billing.street1": "Street Address", // Get from form
  "billing.city": "City",
  "billing.postcode": "1234",
  
  "merchantInvoiceId": orderId,
  "cancelUrl": `${cleanBaseUrl}/payment?cancelled=true`,
  "notificationUrl": `${cleanBaseUrl}/api/webhook/peach`,
  "customParameters[orderId]": orderId,
  "customParameters[productName]": productName,
};
