export default function ProductsPage() {
  const products = [
    { name: 'ExpressVPN (12 Months)', price: 6.67, category: 'Security' },
    { name: 'NordVPN (2 Years)', price: 3.09, category: 'Security' },
    { name: 'Disney Premium', price: 13.99, category: 'Streaming' },
    { name: 'Netflix Premium', price: 15.99, category: 'Streaming' },
    { name: 'Spotify Premium', price: 9.99, category: 'Music' },
    { name: 'Adobe Creative Cloud', price: 54.99, category: 'Software' },
    { name: 'Microsoft Office 365', price: 6.99, category: 'Software' },
    { name: 'ChatGPT Plus', price: 20.00, category: 'AI Tools' },
    { name: 'Midjourney Subscription', price: 10.00, category: 'AI Tools' },
    { name: 'Canva Pro', price: 12.99, category: 'Design' },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-400">All Products</h1>
          <p className="text-gray-400">Premium digital products delivered instantly</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, idx) => (
            <div key={idx} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4 hover:border-cyan-600 transition-all">
              <div className="text-xs text-cyan-400 font-bold uppercase">{product.category}</div>
              <h2 className="text-xl font-bold">{product.name}</h2>
              <p className="text-3xl font-bold text-cyan-400">${product.price} USD/mo</p>
              <a 
                href={`/payment?item=${encodeURIComponent(product.name)}&amount=${product.price}`}
                className="block w-full text-center py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-bold transition-all"
              >
                Buy Now
              </a>
            </div>
          ))}
        </div>

        <div className="text-center pt-8">
          <a href="/" className="text-gray-500 hover:text-white text-sm">← Back to Home</a>
        </div>
      </div>
    </div>
  );
}
