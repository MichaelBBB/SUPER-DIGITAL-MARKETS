export default function ProductsPage() {
  const products = [
    { name: 'ChatGPT Plus', price: 20.00, image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80', desc: 'Access GPT-4 for advanced reasoning, coding, and creative writing. 2x faster response times. Instant account activation.' },
    { name: 'Adobe Creative Cloud', price: 54.99, image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80', desc: 'Full suite including Photoshop, Premiere, Illustrator, and 20+ apps. Cloud storage included. Instant setup guide provided.' },
    { name: 'Netflix Premium', price: 22.99, image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=80', desc: 'Stream in 4K Ultra HD on 4 screens simultaneously. No ads, instant login provided. Includes Quick Start Guide.' },
    { name: 'Microsoft 365 Business', price: 12.50, image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', desc: 'Word, Excel, Teams, and 1TB OneDrive storage. Premium business features. Instant activation and setup support.' },
    { name: 'Spotify Premium', price: 9.99, image: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=800&q=80', desc: 'Ad-free music, offline downloads, and unlimited skips. Works on up to 6 devices. Instant login details sent.' },
    { name: 'NordVPN', price: 3.99, image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80', desc: 'Secure your Wi-Fi with 5,500+ servers worldwide. No logs, military-grade encryption. Instant setup guide included.' },
    { name: 'Canva Pro', price: 12.99, image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80', desc: 'Access 100M+ premium assets, Brand Kit, and background remover. Perfect for creators. Instant account access.' },
    { name: 'Grammarly Premium', price: 12.00, image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80', desc: 'AI-powered writing assistant for tone, clarity, and advanced grammar. Works everywhere you type. Instant setup.' },
    { name: 'Zoom Pro', price: 14.99, image: 'https://images.unsplash.com/photo-1587614203976-365c74645e83?w=800&q=80', desc: 'Host meetings up to 30 hours with 100 participants. Cloud recording and admin features. Instant activation.' },
    { name: 'Notion Plus', price: 8.00, image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80', desc: 'Unlimited file uploads, version history, and guest access. The ultimate workspace. Instant login provided.' },
    { name: 'Figma Professional', price: 12.00, image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&q=80', desc: 'Unlimited professional projects, advanced prototyping, and team libraries. Instant account setup.' },
    { name: 'Dropbox Plus', price: 9.99, image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80', desc: '2TB of secure cloud storage with Smart Sync and file recovery. Instant access to your upgraded account.' },
    { name: 'LastPass Premium', price: 3.00, image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80', desc: 'Secure password manager with dark web monitoring and 1GB encrypted storage. Instant setup guide.' },
    { name: 'Cursor AI Pro', price: 20.00, image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', desc: 'AI code editor built for pair programming. Fast, secure, and context-aware. Instant activation.' },
    { name: 'Midjourney Standard', price: 24.00, image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80', desc: 'Generate stunning AI art with 15 fast GPU hours/month. Commercial usage rights included. Instant setup.' },
    { name: 'GitHub Copilot', price: 10.00, image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80', desc: 'AI pair programmer that suggests code in real-time. Works in VS Code. Instant account activation.' },
    { name: 'Slack Pro', price: 7.25, image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&q=80', desc: 'Unlimited message history, integrations, and group video calls. Instant setup for your team.' },
    { name: 'Dashlane Premium', price: 4.99, image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80', desc: 'Password manager with built-in VPN and dark web alerts. Secure your digital life instantly.' },
    { name: 'Adobe Photoshop', price: 22.99, image: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800&q=80', desc: 'Industry-standard photo editing with Neural Filters and Generative Fill. Instant account access.' },
    { name: 'Claude Pro', price: 20.00, image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80', desc: 'Advanced AI with a 200K context window for large documents. 5x more usage than standard. Instant login.' },
    { name: 'Adobe Premiere Pro', price: 22.99, image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80', desc: 'Professional video editing with AI-powered text-based editing. Instant setup guide included.' },
    { name: 'Asana Premium', price: 10.99, image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&q=80', desc: 'Advanced project management with Gantt charts, automations, and portfolios. Instant activation.' },
    { name: 'ExpressVPN', price: 6.67, image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80', desc: 'Ultra-fast VPN with 3,000+ servers. Secure Wi-Fi, bypass geo-blocks, and stream 4K globally. No logs.' },
    { name: 'YouTube Premium', price: 13.99, image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80', desc: 'Ad-free videos, background play, and YouTube Music included. Instant account login provided.' },
    { name: '1Password', price: 2.99, image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80', desc: 'Secure password manager with Travel Mode and Watchtower alerts. Instant setup guide included.' },
    { name: 'Monday.com Pro', price: 9.00, image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&q=80', desc: 'Visual work OS with time tracking, automations, and dashboards. Instant account activation.' },
    { name: 'Perplexity Pro', price: 20.00, image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80', desc: 'AI search engine with Pro Search for deep, cited research. Unlimited queries. Instant login.' },
    { name: 'Loom Business', price: 12.50, image: 'https://images.unsplash.com/photo-1587614203976-365c74645e83?w=800&q=80', desc: 'Video messaging with AI summaries and unlimited recording for teams. Instant setup.' },
    { name: 'Webflow CMS', price: 14.00, image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80', desc: 'Advanced CMS items, site search, and premium hosting features. Instant account access.' },
    { name: 'ElevenLabs Starter', price: 5.00, image: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=800&q=80', desc: 'AI voice cloning and text-to-speech. Generate realistic voices in seconds. 30k characters/month. Instant setup.' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pt-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Top 30 Digital Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.name} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-cyan-500 transition-all duration-300 flex flex-col">
              <div className="h-48 overflow-hidden bg-slate-800">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-bold mb-2">{p.name}</h2>
                <p className="text-slate-400 text-sm mb-4 flex-grow">{p.desc}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold text-cyan-400">${p.price.toFixed(2)}</span>
                  <a href={`/payment?item=${encodeURIComponent(p.name)}&amount=${p.price}`} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-bold text-sm transition-colors">
                    Buy Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
