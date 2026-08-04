// This minimal code forces the page to load without complex imports
export default function Home() {
  return (
    <div style={{ padding: '100px', textAlign: 'center' }}>
      <h1>SYSTEM RELOADED</h1>
      <p>If you see this, the update worked.</p>
      <a href="/products">Go to Products</a>
    </div>
  );
}
