import { Suspense } from 'react';
import PaymentForm from './PaymentForm';

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: { amount?: string; item?: string };
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>}>
      <PaymentForm 
        initialAmount={searchParams?.amount || "54.99"}
        initialItem={searchParams?.item || "Digital Product"}
        whatsappNumber={process.env.WHATSAPP_NUMBER || "27821234567"}
      />
    </Suspense>
  );
}
