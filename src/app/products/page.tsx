export default function ProductsPage() {
  const products = [
    { name: 'ExpressVPN (12 Months)', price: 6.67, category: 'Security', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=60' },
    { name: 'NordVPN (2 Years)', price: 3.09, category: 'Security', img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=60' },
    { name: 'Disney Premium', price: 13.99, category: 'Streaming', img: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&auto=format&fit=crop&q=60' },
    { name: 'Netflix Premium', price: 15.99, category: 'Streaming', img: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=500&auto=format&fit=crop&q=60' },
    { name: 'Spotify Premium', price: 9.99, category: 'Music', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60' },
    { name: 'Adobe Creative Cloud', price: 54.99, category: 'Software', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60' },
    { name: 'Microsoft Office 365', price: 6.99, category: 'Software', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60' },
    { name: 'ChatGPT Plus', price: 20.00, category: 'AI Tools', img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&auto=format&fit=crop&q=60' },
    { name: 'Midjourney Subscription', price: 10.00, category: 'AI Tools', img: 'https://images.unsplash.com/photo-1686191128892-3b37add4c844?w=500&auto=format&fit=crop&q=60' },
    { name: 'Canva Pro', price: 12.99, category: 'Design', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&auto=format&fit=crop&q=60' },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-400">All Products</h1>
          <p className="text-gray-400">Premium digital products delivered instantly</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, idx) => (
            <div key={idx} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-cyan-600 transition-all flex flex-col">
              {/* Product Image */}
              <div className="h-48 w-full overflow-hidden">
                <img 
                  src={product.img} 
                  alt={product.name} 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              
              {/* Product Details */}
              <div className="p-6 space-y-4 flex-grow flex flex-col">
                <div className="text-xs text-cyan-400 font-bold uppercase">{product.category}</div>
                <h2 className="text-xl font-bold">{product.name}</h2>
                <p className="text-3xl font-bold text-cyan-400 mt-auto">${product.price} USD</p>
                <a 
                  href={`/payment?item=${encodeURIComponent(product.name)}&amount=${product.price}`}
                  className="block w-full text-center py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-bold transition-all mt-4"
                >
                  Buy Now
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-8 pb-12">
          <a href="/" className="text-gray-500 hover:text-white text-sm">← Back to Home</a>
        </div>
      </div>
    </div>
  );
}
