'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [stats, setStats] = useState({ usa: 226679, india: 233806, china: 231639, southAfrica: 215475 });

  useEffect(() => {
    const interval = setInterval(() => {
      const regions = ['usa', 'india', 'china', 'southAfrica'];
      const randomRegion = regions[Math.floor(Math.random() * regions.length)];
      setStats(prev => ({ ...prev, [randomRegion]: prev[randomRegion] + Math.floor(Math.random() * 5) + 1 }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const total = stats.usa + stats.india + stats.china + stats.southAfrica;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050B14', color: 'white', fontFamily: 'sans-serif' }}>
      
      {/* NAVBAR */}
      <nav style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>❄</div>
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>SUPER DIGITAL</span>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', padding: '10px 20px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)' }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>Home</Link>
          <Link href="/products" style={{ textDecoration: 'none', color: '#cbd5e1' }}>Products</Link>
          <Link href="/checkout" style={{ textDecoration: 'none', color: '#cbd5e1' }}>Checkout</Link>
        </div>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '50px', border: '1px solid rgba(34,197,94,0.3)', backgroundColor: 'rgba(34,197,94,0.1)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#4ade80' }}>LIVE</span>
          </div>
          <Link href="/products" style={{ backgroundColor: '#06b6d4', color: 'white', padding: '10px 20px', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
            Shop Now
          </Link>
        </div>
      </nav>

      {/* HERO SECTION WITH BRIGHT EARTH */}
      <div style={{ position: 'relative', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80" 
          alt="Earth" 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, #050B14)', zIndex: 1 }}></div>

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '800px', padding: '20px' }}>
          <h1 style={{ fontSize: '64px', fontWeight: 'bold', lineHeight: '1.1', marginBottom: '20px', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
            The World's <span style={{ color: '#22d3ee' }}>Top 30</span><br />
            Digital Products<br />
            <span style={{ color: '#facc15' }}>Delivered Instantly.</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#e2e8f0', marginBottom: '30px' }}>
            From AI tools to creative software — shop in USD, pay your way, receive instantly.
          </p>
          <Link href="/products" style={{ backgroundColor: '#06b6d4', color: 'white', padding: '15px 40px', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px', display: 'inline-block' }}>
            Browse All Products
          </Link>
        </div>
      </div>

      {/* MOVING SALES TRACKER */}
      <section style={{ padding: '40px 20px', backgroundColor: '#050B14' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: '#0B1120', border: '1px solid #1e293b', borderRadius: '20px', padding: '30px' }}>
          <h2 style={{ textAlign: 'center', color: '#22d3ee', marginBottom: '30px', textTransform: 'uppercase', letterSpacing: '2px' }}>Live Sales Activity</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', textAlign: 'center' }}>
            <div style={{ padding: '20px', backgroundColor: 'rgba(30, 41, 59, 0.3)', borderRadius: '12px', border: '1px solid #334155' }}>
              <div style={{ color: '#60a5fa', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px' }}>USA</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'monospace' }}>{stats.usa.toLocaleString()}</div>
            </div>
            <div style={{ padding: '20px', backgroundColor: 'rgba(30, 41, 59, 0.3)', borderRadius: '12px', border: '1px solid #334155' }}>
              <div style={{ color: '#fb923c', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px' }}>INDIA</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'monospace' }}>{stats.india.toLocaleString()}</div>
            </div>
            <div style={{ padding: '20px', backgroundColor: 'rgba(30, 41, 59, 0.3)', borderRadius: '12px', border: '1px solid #334155' }}>
              <div style={{ color: '#f87171', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px' }}>CHINA</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'monospace' }}>{stats.china.toLocaleString()}</div>
            </div>
            <div style={{ padding: '20px', backgroundColor: 'rgba(30, 41, 59, 0.3)', borderRadius: '12px', border: '1px solid #22c55e', boxShadow: '0 0 15px rgba(34,197,94,0.2)' }}>
              <div style={{ color: '#4ade80', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px' }}>SOUTH AFRICA</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'monospace' }}>{stats.southAfrica.toLocaleString()}</div>
            </div>
          </div>
          
          <div style={{ marginTop: '20px', borderTop: '1px solid #1e293b', paddingTop: '20px', textAlign: 'center' }}>
             <span style={{ color: '#64748b' }}>Total Global Volume: </span>
             <span style={{ marginLeft: '10px', color: '#22d3ee', fontWeight: 'bold', fontSize: '20px' }}>{total.toLocaleString()}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
