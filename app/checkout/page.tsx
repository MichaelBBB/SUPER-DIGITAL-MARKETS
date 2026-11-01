
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
  const productId = searchParams.get('productId');
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [productLoading, setProductLoading] = useState(true);
  const [country, setCountry] = useState('ZA');
  const [method, setMethod] = useState('peach');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = use
