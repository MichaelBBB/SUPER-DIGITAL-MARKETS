
'use client';

import { useState } from 'react';

type Product = {
  name: string;
  price: number;
  category: string;
  badge: string;
  desc: string;
  image: string;
};

const products: Product[] = [
  {
    name: 'ChatGPT Plus',
    price: 20.00,
    category: 'AI Tools',
    badge: 'HOT',
    desc: "OpenAI's GPT-powered assistant for advanced reasoning, image generation, and browsing.",
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&q=80',
  },
  {
   
