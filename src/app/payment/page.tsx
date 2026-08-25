// src/app/payment/page.tsx
import { Suspense } from 'react';
import CheckoutForm from './CheckoutForm';

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string; item?: string }>;
}) {
  const params = await searchParams;
  const amount = params.amount || "54.99";
  const item = params.item || "Digital Product";
  const whatsappNumber = process.env.WHATSAPP_NUMBER || "27821234567";

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-600 font-medium">Loading secure checkout...</div>
        </div>
      }>
        <CheckoutForm 
          initialAmount={amount}
          initialItem={item}
          whatsappNumber={whatsappNumber}
        />
      </Suspense>
    </div>
  );
}
