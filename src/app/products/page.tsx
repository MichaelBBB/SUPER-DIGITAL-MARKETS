"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ShoppingBag, Star, Flame } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  priceZar: string;
  priceUsd: string;
  priceInr: string;
  icon: string;
  badge?: string;
  category: string;
  image: string;
}

const allProducts: Product[] = [
  // AI TOOLS CATEGORY
  {
    id: "chatgpt-plus",
    name: "ChatGPT Plus",
    description: "OpenAI's GPT-4 powered assistant. Advanced reasoning, image analysis, voice conversations, custom GPTs creation & priority access during peak times.",
    priceZar: "R54.99",
    priceUsd: "$20.00",
    priceInr: "₹1,700",
    icon: "🤖",
    badge: "HOT",
    category: "AI Tools",
    image: "https://images.unsplash.com/photo-1681580910373-b7e2a7e1c9b4?w=500&h=300&fit=crop"
  },
  {
    id: "midjourney-premium",
    name: "Midjourney Premium",
    description: "Generate unlimited stunning images with our most powerful AI art generator. Professional quality results every time.",
    priceZar: "R54.99",
    priceUsd: "$20.00",
    priceInr: "₹1,700",
    icon: "🎨",
    badge: "POPULAR",
    category: "AI Tools",
    image: "https://images.unsplash.com/photo-1618331835155-5e782857fd49?w=500&h=300&fit=crop"
  },
  {
    id: "claude-pro",
    name: "Claude Pro",
    description: "Anthropic's advanced AI for writing, research & analysis. Faster responses, higher usage limits, priority support.",
    priceZar: "R35.00",
    priceUsd: "$15.00",
    priceInr: "₹1,275",
    icon: "💬",
    badge: undefined,
    category: "AI Tools",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop"
  },
  {
    id: "perplexity-pro",
    name: "Perplexity Pro",
    description: "AI-powered search engine with real-time web browsing, source citations & advanced conversation capabilities.",
    priceZar: "R40.00",
    priceUsd: "$20.00",
    priceInr: "₹1,700",
    icon: "🔍",
    badge: undefined,
    category: "AI Tools",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop"
  },
  
  // CREATIVE SOFTWARE CATEGORY
  {
    id: "canva-pro",
    name: "Canva Pro Lifetime",
    description: "Unlimited design assets, templates & brand kit access for professionals. Magic Resize, Background Remover & more.",
    priceZar: "R89.99",
    priceUsd: "$12.99",
    priceInr: "₹1,100",
    icon: "✨",
    badge: "POPULAR",
    category: "Creative",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&h=300&fit=crop"
  },
  {
    id: "adobe-creative-cloud",
    name: "Adobe Creative Cloud",
    description: "Full suite of Adobe apps — Photoshop, Illustrator, Premiere Pro, After Effects, InDesign & more. Desktop + mobile license.",
    priceZar: "R54.99",
    priceUsd: "$54.99",
    priceInr: "₹4,700",
    icon: "🎨",
    badge: "POPULAR",
    category: "Creative",
    image: "https://images.unsplash.com/photo-1626785774573-4b799312afc2?w=500&h=300&fit=crop"
  },
  {
    id: "procreate-ipad",
    name: "Procreate iPad",
    description: "Professional digital painting app for iPad. Industry standard for digital artists worldwide. One-time purchase.",
    priceZar: "R150.00",
    priceUsd: "$12.99",
    priceInr: "₹1,100",
    icon: "🖌️",
    badge: undefined,
    category: "Creative",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&h=300&fit=crop"
  },
  {
    id: "sketch-lifetime",
    name: "Sketch Lifetime",
    description: "Vector design tool
