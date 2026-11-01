
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const productId = searchParams?.get('productId') ?? null;
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [country, setCountry] = useState('ZA');
  const [method, setMethod] = useState('peach');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productId) {
      supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()
        .then(({ data }) => setProduct(data));
    }
  }, [productId]);

  const handlePayment = async () => {
    if (!email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!product || !productId) {
      alert('Product details are not available. Please return to the products page
