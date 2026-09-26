'use client';

import { useState } from 'react';

const ACCESS = 'sdm2026tap';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export default function TapPage() {
  const [key, setKey] = useState('');
  const [region, setRegion] = useState('southafrica');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  async function tap() {
    if (key !== ACCESS) { setStatus('WRONG KEY'); return; }
    if (!SUPABASE_URL || !ANON) { setStatus('SUPABASE ENV MISSING'); return; }
    setBusy(true);
    setStatus('...');
    try {
      const h = { apikey: ANON, Authorization: 'Bearer ' + ANON, 'Content-Type': 'application/json' };
      const r = await fetch(SUPABASE_URL + '/rest/v1/sales_counts?region=eq.' + region + '&select=count', { headers: h });
      const rows = await r.json();
      const cur = Array.isArray(rows) && rows[0] ? Number(rows[0].count) || 0 : 0;
      const next = cur + 1;
      let w;
      if (Array.isArray(rows) && rows.length) {
        w = await fetch(SUPABASE_URL + '/rest/v1/sales_counts?region=eq.' + region, {
          method: 'PATCH', headers: { ...h, Prefer: 'return=minimal' }, body: JSON.stringify({ count: next }),
        });
      } else {
        w = await fetch(SUPABASE_URL + '/rest/v1/sales_counts', {
          method: 'POST', headers: { ...h, Prefer: 'return=minimal' }, body: JSON.stringify([{ region, count: 1 }]),
        });
      }
      if (!w.ok) { const t = await w.text(); setStatus('WRITE FAIL: ' + t.slice(0, 80)); }
      else setStatus('OK - ' + region + ' now ' + next);
    } catch (e) {
      // FIXED LINE: Type-safe error handling
      setStatus('NETWORK: ' + (e instanceof Error ? e.message : 'err'));
    }
    setBusy(false);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#111', border: '1px solid #333', borderRadius: 16, padding: 32, width: '100%', maxWidth: 420 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 20 }}>Record Manual Sale</h1>
        <label style={{ display: 'block', fontSize: 13, color: '#9ca3af', marginBottom: 6 }}>Key</label>
        <input value={key} onChange={(e) => setKey(e.target.value)} type="password" placeholder="enter key"
          style={{ width: '100%', boxSizing: 'border-box', background: '#000', border: '1px solid #374151', borderRadius: 8, padding: '10px 14px', color: '#fff', marginBottom: 16 }} />
        <label style={{ display: 'block', fontSize: 13, color: '#9ca3af', marginBottom: 6 }}>Country</label>
        <select value={region} onChange={(e) => setRegion(e.target.value)}
          style={{ width: '100%', boxSizing: 'border-box', background: '#000', border: '1px solid #374151', borderRadius: 8, padding: '10px 14px', color: '#fff', marginBottom: 20 }}>
          <option value="southafrica">South Africa</option>
          <option value="usa">USA</option>
          <option value="india">India</option>
          <option value="china">China</option>
        </select>
        <button onClick={tap} disabled={busy}
          style={{ width: '100%', padding: '14px 0', background: busy ? '#374151' : '#16a34a', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 10, cursor: busy ? 'default' : 'pointer' }}>
          {busy ? 'Recording...' : 'Record Sale (+1)'}
        </button>
        {status && <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, fontWeight: 600, color: status.startsWith('OK') ? '#4ade80' : '#f87171' }}>{status}</p>}
      </div>
    </div>
  );
}
