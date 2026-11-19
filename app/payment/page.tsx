
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type Product = {
  id: string;
  name: string;
  price_usd: number;
};

function PaymentContent() {
  const searchParams = useSearchParams();
  const item = searchParams?.get('item') || '';

  const [product, setProduct] = useState<Product | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  const upiId = process.env.NEXT_PUBLIC_UPI_ID || '';
  const alipayId = process.env.NEXT_PUBLIC_ALIPAY_ID || '';
  const bankName = process.env.NEXT_PUBLIC_CAPITEC_BANK_NAME || '';
  const accountName = process.env.NEXT_PUBLIC_CAPITEC_ACCOUNT_NAME || '';
  const accountNumber =
    process.env.NEXT_PUBLIC_CAPITEC_ACCOUNT_NUMBER || '';

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      if (!item) {
        setError('No product was selected. Please return to Products.');
        setLoading(false);
        return;
      }

      try {
        const { supabase } = await import('@/lib/supabase');

        const { data, error: lookupError } = await supabase
          .from('products')
          .select('id, name, price_usd')
          .eq('name', item)
          .maybeSingle();

        if (lookupError) throw lookupError;

        if (!data) {
          throw
