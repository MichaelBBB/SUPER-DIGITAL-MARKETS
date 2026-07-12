'use client';

import { useState } from 'react';
import Link from 'next/link';

const categories = ['All', 'AI Tools', 'Creative', 'Entertainment', 'Business', 'Productivity', 'Security'];

const products = [
  { id: 1, name: "ChatGPT Plus", price: 20.00, category: "AI Tools", badge: "HOT", description: "OpenAI's GPT-4 powered assistant. Advanced reasoning, image generation, and browsing included.", markets: ["🇺", "🇮", "🇿"], image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80" },
  { id: 2, name: "Adobe Creative Cloud", price: 54.99, category: "Creative", badge: "POPULAR", description: "Full suite of Adobe apps — Photoshop, Illustrator, Premiere Pro, and 20+ more.", markets: ["🇺", "🇮", "🇿", "🇨"], image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80" },
  { id: 3, name: "Netflix Premium", price: 22.99, category: "Entertainment", badge: "HOT", description: "4K streaming, 4 simultaneous screens, offline downloads. 10,000+ titles worldwide.", markets: ["🇺", "🇮", "🇿"], image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=800&q=80" },
  { id: 4, name: "Microsoft 365 Business", price: 12.50, category: "Business", badge: "POPULAR", description: "Word, Excel, PowerPoint, Teams, and 1TB OneDrive. For business and personal use.", markets: ["🇺", "", "🇿"], image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80" },
  { id: 5, name: "Spotify Premium", price: 9.99, category: "Entertainment", badge: "POPULAR", description: "Ad-free music, offline listening, unlimited skips. 100M+ songs and podcasts.", markets: ["🇺", "🇮", "🇿"], image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&w=800&q=80" },
  { id: 6, name: "NordVPN", price: 3.99, category: "Security", badge: "HOT", description: "Military-grade encryption, 5,500+ servers in 60 countries. No-logs policy.", markets: ["🇺", "🇮", "🇿"], image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80" },
  { id: 7, name: "Notion Plus", price: 8.00, category: "Productivity", badge: "POPULAR", description: "All-in-one workspace for notes, wikis, databases, and project management.", markets: ["🇺", "🇮", "🇿"], image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80" },
  { id: 8, name: "Figma Professional", price: 12.00, category: "Creative", badge: "HOT", description: "Collaborative UI/UX design tool. Real-time multiplayer, unlimited projects, dev mode.", markets: ["🇺", "🇮", "🇿"], image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80" },
  { id: 9, name: "Dropbox Plus", price: 9.99, category: "Productivity", badge: null, description: "2TB cloud storage, Smart Sync, version history, and secure file sharing.", markets: ["🇺", "🇮", "🇿"], image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=800&q=80" },
  { id: 10, name: "Canva Pro", price: 12.99, category: "Creative", badge: "NEW", description: "Premium design templates, Brand Kit, background remover, and 100M+ stock assets.", markets: ["🇺", "🇮", "🇿"], image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80" },
  { id: 11, name: "Grammarly Premium", price: 12.00, category: "Productivity", badge: "POPULAR", description: "AI writing assistant with advanced grammar, clarity, and plagiarism detection.", markets: ["🇺", "🇮", "🇿"], image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80" },
  { id: 12, name: "Zoom Pro", price: 14.99, category: "Business", badge: "HOT", description: "Unlimited meetings up to 30 hours, 100 participants, cloud recording, admin controls.", markets: ["🇺", "🇮", "🇿"], image: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=800&q=80" },
  { id: 13, name: "LastPass Premium", price: 3.00, category: "Security", badge: null, description: "Password manager, secure sharing, identity monitoring, and unlimited devices.", markets: ["🇺", "🇮", "🇿"], image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80" },
  { id: 14, name: "Cursor AI Pro", price: 20.00, category: "AI Tools", badge: null, description: "AI-powered code editor with autocomplete, chat, and codebase understanding.", markets: ["🇺", "🇮", "🇿"], image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80" },
  { id: 15, name: "Midjourney Standard", price: 24.00, category: "AI Tools", badge: null, description: "Industry-leading AI image generation. Fast generations, private mode, 4K output.", markets: ["🇺", "🇮", "🇿"], image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80" },
  { id: 16, name: "GitHub Copilot", price: 10.00, category: "AI Tools", badge: null, description: "AI pair programmer for VS Code, JetBrains, and CLI. Write code 55% faster.", markets: ["🇺", "🇮", ""], image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80" },
  { id: 17, name: "Slack Pro", price: 7.25, category: "Business", badge: null, description: "Team communication, 10k+ messages, 100+ apps, voice/video calls, guest access.", markets: ["🇺", "🇮", ""], image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=800&q=80" },
  { id: 18, name: "Dashlane Premium", price: 4.99, category: "Security", badge: null, description: "Password manager, digital wallet, VPN, and identity theft protection.", markets: ["🇺", "🇮", ""], image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80" },
  { id: 19, name: "Adobe Photoshop", price: 22.99, category: "Creative", badge: null, description: "Industry-standard photo editing, AI features, generative fill, and pro tools.", markets: ["🇺", "🇮", "🇿"], image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80" },
  { id: 20, name: "Claude Pro", price: 20.00, category: "AI Tools", badge: null, description: "Advanced AI reasoning, document analysis, and creative writing. 24/7 access.", markets: ["🇺", "🇮", ""], image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80" },
  { id: 21, name: "Adobe Premiere Pro", price: 22.99, category: "Creative", badge: null, description: "Professional video editing, color grading, motion graphics, and cloud collaboration.", markets: ["🇺", "🇮", ""], image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80" },
  { id: 22, name: "Asana Premium", price: 10.99, category: "Business", badge: null, description: "Project management, timelines, portfolios, custom fields, and automation.", markets: ["🇺", "🇮", ""], image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80" },
  { id: 23, name: "ExpressVPN", price: 6.67, category: "Security", badge: null, description: "Premium VPN, 3,000+ servers, No-Logs policy, and Kill Switch protection.", markets: ["🇺", "🇮", ""], image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80" },
  { id: 24, name: "YouTube Premium", price: 13.99, category: "Entertainment", badge: null, description: "Ad-free videos, background play, offline downloads, and YouTube Music.", markets: ["🇺", "🇮", "🇿"], image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80" },
  { id: 25, name: "1Password", price: 2.99, category: "Security", badge: null, description: "Secure password manager, watchtower monitoring, and family sharing.", markets: ["🇺", "", "🇿"], image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80" },
  { id: 26, name: "Monday.com Pro", price: 9.00, category: "Business", badge: null, description: "Work OS, automation, time tracking, and visual project boards.", markets: ["🇺", "", "🇿"], image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80" },
  { id: 27, name: "Perplexity Pro", price: 20.00, category: "AI Tools", badge: null, description: "AI search engine with real-time answers, citations, and deep research mode.", markets: ["🇺", "🇮", "🇿"], image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80" },
  { id: 28, name: "Loom Business", price: 12.50, category: "Business", badge: null, description: "Video messaging, AI summaries, transcription, and team library.", markets: ["🇺", "🇮", "🇿"], image: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=800&q=80" },
  { id: 29, name: "Webflow CMS", price: 14.00, category: "Creative", badge: null, description: "Visual web design, CMS, e-commerce, and responsive hosting.", markets: ["🇺", "🇮", "🇿"], image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80" },
  { id: 30, name: "ElevenLabs Starter", price: 5.00, category: "AI Tools", badge: null, description: "AI voice generation, cloning, and text-to-speech with 10k+ characters/month.", markets: ["🇺", "🇮", ""], image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80" }
];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0B1120] text-white py-12 px-10">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="text-cyan-400 hover:underline mb-6 inline-block text-base font-medium">← Back to Home</Link>
        <h1 className="text-4xl font-bold mb-8 tracking-tight">All Digital Products</h1>
        
        <div className="flex gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat 
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25' 
                  : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div key={p.id} className="bg-[#0F172A] border border-slate-800/50 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 group">
              <div className="relative h-48 overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                {p.badge && (
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${p.badge === 'HOT' ? 'bg-red-500' : p.badge === 'NEW' ? 'bg-green-500' : 'bg-yellow-500'}`}>{p.badge}</span>
                )}
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-cyan-300 backdrop-blur-sm">{p.category}</span>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg leading-tight">{p.name}</h3>
                  <span className="text-cyan-400 font-bold text-xl">${p.price.toFixed(2)}</span>
                </div>
                <p className="text-gray-400 text-sm mb-5 line-clamp-2">{p.description}</p>
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-xs text-gray-500">Available in:</span>
                  <div className="flex gap-1 text-sm">{p.markets.map((flag, i) => <span key={i}>{flag}</span>)}</div>
                </div>
                <Link href={`/checkout?product=${p.id}`} className="w-full bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20 hover:shadow-cyan-500/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  Buy Now — ${p.price.toFixed(2)}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
