export const paymentMethods = [
  {
    id: 'capitec',
    name: 'Capitec Bank Transfer',
    type: 'INSTANT DELIVERY',
    icon: '🇿🇦',
    description: 'Instant EFT via Capitec - Payment processed immediately.',
    currency: 'ZAR',
    badges: ['EFT', 'Internet Banking', 'Capitec App'],
    instantDelivery: true,
    color: 'blue'
  },
  {
    id: 'card',
    name: 'Credit / Debit Card',
    type: 'INSTANT DELIVERY',
    icon: '💳',
    description: 'Secure payment via Visa or Mastercard.',
    currency: 'ZAR',
    badges: ['Visa', 'Mastercard'],
    instantDelivery: true,
    color: 'orange'
  },
  {
    id: 'apple_pay',
    name: 'Apple Pay',
    type: 'DIGITAL WALLET',
    icon: '🍎',
    description: 'Fast checkout with TouchID or FaceID.',
    currency: 'ZAR',
    badges: ['Biometric'],
    instantDelivery: true,
    color: 'white'
  },
  {
    id: 'pay_by_bank',
    name: 'Pay by Bank',
    type: 'OPEN BANKING',
    icon: '🏦',
    description: 'Direct authorization from your banking app.',
    currency: 'ZAR',
    badges: ['Secure', 'No Card Needed'],
    instantDelivery: true,
    color: 'green'
  }
];
