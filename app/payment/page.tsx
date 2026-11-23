
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type Product = {
  id: string;
  name: string;
  price_usd: number;
};

type PaymentStatus = {
  status: string;
  amountUSD: number;
};

function PaymentContent() {
  const searchParams = useSearchParams();
  const item = searchParams?.get('item') || '';
  const sessionId = searchParams?.get('session_id') || '';

  const [product, setProduct] = useState<Product | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatus | null>(null);
  const [statusMessage, setStatusMessage] = useState(
    'Checking your payment status...'
  );

  const whatsapp = process
