import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import SalesTracker from '@/components/SalesTracker';
import { Footer } from '@/components/Footer';

const allProducts = [
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

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 space-y-20">
        <Hero 
          title="Premium Digital Assets & Premium Accounts"
          subtitle="Access over 30+ top-tier software subscriptions, AI tools, and digital resources. All delivered instantly! No waiting, no delays."
          primaryAction="/products"
        />
        
        {/* Features Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 hover:border-cyan-500 transition duration-300 group">
              <div className="w-12 h-12 bg-cyan-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-900/50 transition-colors">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Instant Delivery</h3>
              <p className="text-gray-400">Products are delivered Instantly! You'll receive everything immediately after purchase.</p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 hover:border-cyan-500 transition duration-300 group">
              <div className="w-12 h-12 bg-cyan-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-900/50 transition-colors">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Transactions</h3>
              <p className="text-gray-400">All transactions are encrypted and secure via Peach Payments and major banking providers.</p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 hover:border-cyan-500 transition duration-300 group">
              <div className="w-12 h-12 bg-cyan-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-900/50 transition-colors">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Global Access</h3>
              <p className="text-gray-400">We accept Razorpay (India), Alipay (China), Payoneer (USA) and Peach (South Africa).</p>
            </div>
          </div>
        </section>
        
        <SalesTracker />
        <ProductGrid products={allProducts} />
      </main>
      <Footer />
    </div>
  );
}
