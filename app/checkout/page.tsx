
'use client';

import { Suspense, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

type Product = {
  id: string;
  name: string;
  price_usd: number;
  image_url?: string | null;
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const productId = searchParams?.get('productId') ?? null;
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [productLoading, setProductLoading] = useState(true);
  const [country, setCountry] = useState('ZA');
  const [method, setMethod] = useState('peach');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      setProductLoading(true);
      setError('');

      if (!productId) {
        setError('No product was selected. Please return to the store.');
        setProductLoading(false);
        return;
      }

      const { data, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (cancelled) return;

      if (productError || !data) {
        setError('We could not load this product. Please return to the store.');
        setProduct(null);
      } else {
        setProduct(data as Product);
      }

      setProductLoading(false);
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  const handlePayment = async () => {
    if (!product || loading) return;

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid delivery email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          email: email.trim(),
          country,
          method,
          amount: product.price_usd
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || 'The payment request could not be processed.'
        );
      }

     
