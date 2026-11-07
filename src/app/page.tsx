
export default function Home() {
  return (
    <div className="min-h-screen text-white relative overflow-hidden font-sans">

      {/* EARTH BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70"></div>
      </div>

      {/* SATELLITE */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] z-10 opacity-90 pointer-events-none"
        style={{
          backgroundImage:
            "url('https://pngimg.com/uploads/satellite/satellite_PNG13.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top right",
        }}
      ></div>

      {/* NAVIGATION */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-md bg-black/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-xs font-bold text-black">
            SD
          </div>
          <span className="font-bold text-lg tracking-wide">
            SUPER DIGITAL
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="/" className="text-white hover:text-cyan-400 transition-colors">
            Home
          </a>
          <a href="/products" className="hover:text-cyan-400 transition-colors">
            Products
          </a>
          <a href="/products" className="hover:text-cyan-400 transition-colors">
            Checkout
