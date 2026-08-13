// src/app/payment/page.tsx
import { Suspense } from 'react';
import PaymentForm from './PaymentForm';

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading Payment...</div>}>
      <PaymentForm />
    </Suspense>
  );
}
