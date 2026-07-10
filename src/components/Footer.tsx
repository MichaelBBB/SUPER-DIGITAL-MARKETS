export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          <span className="text-xl font-bold text-white">SUPER DIGITAL</span>
        </div>
        
        <p className="text-gray-400 mb-4">Your trusted source for premium digital assets.</p>
        
        <div className="flex justify-center gap-6 mb-6 text-sm">
          <a href="#" className="text-gray-400 hover:text-cyan-400 transition">Terms of Service</a>
          <a href="#" className="text-gray-400 hover:text-cyan-400 transition">Privacy Policy</a>
          <a href="#" className="text-gray-400 hover:text-cyan-400 transition">Refund Policy</a>
        </div>

        <p className="text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} Super Digital Markets. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
