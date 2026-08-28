// src/app/payment/page.tsx
import { Suspense } from 'react';
import PaymentForm from './PaymentForm';

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string; item?: string }>;
}) {
  const params = await searchParams;
  
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>}>
      <PaymentForm 
        initialAmount={params.amount || "54.99"}
        initialItem={params.item || "Digital Product"}
        whatsappNumber={process.env.WHATSAPP_NUMBER || "27821234567"}
      />
    </Suspense>
  );
}
