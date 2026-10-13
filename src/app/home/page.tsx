export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 pt-8">SUPER DIGITAL MARKETS</h1>
        <p className="text-gray-400">Premium digital products delivered instantly</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
            <h2 className="text-xl font-bold text-white">ExpressVPN (12 Months)</h2>
            <p className="text-gray-400 text-sm">Full activation, instant delivery</p>
            <p className="text-3xl font-bold text-cyan-400">$6.67 USD</p>
            <a href="/payment?item=ExpressVPN&amount=6.67" className="block w-full text-center py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-bold">
              CLICK HERE TO PAY
            </a>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
            <h2 className="text-xl font-bold text-white">Custom Order</h2>
            <p className="text-gray-400 text-sm">Any product, any quantity — order via WhatsApp</p>
            <a href="https://wa.me/27743868889" className="block w-full text-center py-3 bg-green-600 hover:bg-green-500 rounded-lg font-bold">
              Order on WhatsApp
            </a>
          </div>
        </div>

        <a href="/live-trackers" className="inline-block text-gray-500 hover:text-white text-sm underline">
          View Live Sales Trackers
        </a>
      </div>
    </div>
  );
}
