import Link from 'next/link';

const products = [
  { id: 1, name: "ChatGPT Plus", price: 20.00 },
  { id: 2, name: "Adobe Creative Cloud", price: 54.99 },
  { id: 3, name: "Netflix Premium", price: 22.99 },
  { id: 4, name: "Microsoft 365 Business", price: 12.50 },
  { id: 5, name: "Spotify Premium", price: 9.99 },
  { id: 6, name: "NordVPN", price: 3.99 },
  { id: 7, name: "Notion Plus", price: 8.00 },
  { id: 8, name: "Figma Professional", price: 12.00 },
  { id: 9, name: "Dropbox Plus", price: 9.99 },
  { id: 10, name: "Canva Pro", price: 12.99 },
  { id: 11, name: "Grammarly Premium", price: 12.00 },
  { id: 12, name: "Zoom Pro", price: 14.99 },
  { id: 13, name: "LastPass Premium", price: 3.00 },
  { id: 14, name: "Cursor AI Pro", price: 20.00 },
  { id: 15, name: "Midjourney Standard", price: 24.00 },
  { id: 16, name: "GitHub Copilot", price: 10.00 },
  { id: 17, name: "Slack Pro", price: 7.25 },
  { id: 18, name: "Dashlane Premium", price: 4.99 },
  { id: 19, name: "Adobe Photoshop", price: 22.99 },
  { id: 20, name: "Claude Pro", price: 20.00 },
  { id: 21, name: "Adobe Premiere Pro", price: 22.99 },
  { id: 22, name: "Asana Premium", price: 10.99 },
  { id: 23, name: "ExpressVPN", price: 6.67 },
  { id: 24, name: "YouTube Premium", price: 13.99 },
  { id: 25, name: "1Password", price: 2.99 },
  { id: 26, name: "Monday.com Pro", price: 9.00 },
  { id: 27, name: "Perplexity Pro", price: 20.00 },
  { id: 28, name: "Loom Business", price: 12.50 },
  { id: 29, name: "Webflow CMS", price: 14.00 },
  { id: 30, name: "ElevenLabs Starter", price: 5.00 }
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="text-cyan-400 hover:underline mb-6 inline-block">&larr; Back to Home</Link>
        <h1 className="text-4xl font-bold mb-8">All Digital Products</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/50 transition group">
              <img 
                src={`https://placehold.co/400x225/0f172a/06b6d4?text=${encodeURIComponent(p.name.split(' ')[0])}`}
                alt={p.name}
                className="aspect-video w-full rounded-xl mb-4 object-cover"
                loading="lazy"
              />
              <h3 className="font-bold text-lg mb-2">{p.name}</h3>
              <div className="flex justify-between items-center mt-4">
                <span className="text-cyan-400 font-bold">${p.price.toFixed(2)}</span>
                <Link 
                  href={`/checkout?product=${p.id}`} 
                  className="bg-slate-800 hover:bg-cyan-500 hover:text-white text-white text-sm px-4 py-2 rounded-lg transition"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
