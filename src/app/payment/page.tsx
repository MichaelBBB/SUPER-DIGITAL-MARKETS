import { Suspense } from 'react';
import PaymentForm from './PaymentForm';

export default async function PaymentPage({ searchParams }: any) {
  const params = await searchParams;
  
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>}>
      <PaymentForm 
        initialAmount={params?.amount?.toString() || "54.99"}
        initialItem={params?.item?.toString() || "Digital Product"}
        whatsappNumber={process.env.WHATSAPP_NUMBER || "27821234567"}
      />
    </Suspense>
  );
}
