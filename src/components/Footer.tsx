export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        
        {/* Logo Area */}
        <h2 className="text-2xl font-bold text-white mb-4 tracking-tighter">
          SUPER DIGITAL
        </h2>
        
        {/* Navigation Links */}
        <div className="flex justify-center gap-6 mb-6 text-sm text-gray-400">
          <a href="#" className="hover:text-cyan-400 transition">Terms</a>
          <a href="#" className="hover:text-cyan-400 transition">Privacy</a>
          <a href="#products" className="hover:text-cyan-400 transition">Shop Now</a>
        </div>

        {/* Copyright */}
        <p className="text-gray-500 text-xs">
          &copy; {currentYear} Super Digital Markets. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
