'use client';

import { useState } from 'react';
import PaymentTracker from '@/components/PaymentTracker';

const CHATGPT_PRODUCT = {
  id: 'prod_1',
  name: 'ChatGPT Plus',
  category: 'AI Tools',
  price: 20.00,
  image: 'https://cdn-icons-png.flaticon.com/512/6643/6643389.png'
};

export default function CheckoutPage() {
  const [isPaying, setIsPaying] = useState(false);

  return (
    <div className="min-h-screen bg-[#05080F] flex items-center justify-center p-4">
      {isPaying ? (
        <PaymentTracker 
          product={CHATGPT_PRODUCT} 
          processingFee={0.88}
          sessionId="sess_123456789" 
          whatsappNumber="27123456789" 
          onClose={() => setIsPaying(false)}
        />
      ) : (
        <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 text-white w-full max-w-[400px]">
           <h2 className="text-xl font-bold mb-6">Order Summary</h2>
           
           <div className="flex items-center gap-4 mb-6">
             <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden">
               <img src={CHATGPT_PRODUCT.image} alt="Product" className="w-full h-full object-cover" />
             </div>
             <div className="flex-1">
               <h3 className="text-white font-semibold text-sm">{CHATGPT_PRODUCT.name}</h3>
               <p className="text-slate-500 text-xs">{CHATGPT_PRODUCT.category}</p>
             </div>
             <div className="text-right">
               <p className="text-cyan-400 font-bold text-sm">${CHATGPT_PRODUCT.price.toFixed(2)}</p>
             </div>
           </div>

           <div className="space-y-2 text-sm mb-6">
            <div className="flex justify-between text-slate-400">
              <span>Processing fee</span>
              <span>$0.88</span>
            </div>
            <div className="flex justify-between text-white font-bold pt-2 border-t border-slate-800 mt-2">
              <span className="text-base">Total</span>
              <span className="text-cyan-400 text-lg">$20.88</span>
            </div>
          </div>

           <button 
             onClick={() => setIsPaying(true)}
             className="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-cyan-500/20"
           >
             Continue to Payment
           </button>
        </div>
      )}
    </div>
  );
}
