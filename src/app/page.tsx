'use client';

import Image from 'next/image';

export default function ChofetzStudyPage() {
  return (
    <div className="min-h-screen bg-[#0a1128] text-amber-50 font-serif relative overflow-hidden selection:bg-amber-900/40">
      
      {/* MANUSCRIPT BACKGROUND TEXTURE */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
        <Image 
          src="/manuscript-bg.jpg" 
          alt="Manuscript texture" 
          fill 
          className="object-cover"
          priority
          quality={60}
        />
      </div>

      {/* MAIN LAYOUT */}
      <div className="relative z-10 flex flex-col md:flex-row min-h-screen">
        
        {/* SIDEBAR */}
        <aside className="w-full md:w-72 bg-[#0d1530] border-r border-amber-900/30 p-6 flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-amber-700/20 rounded-lg flex items-center justify-center">
              <span className="text-amber-400 text-lg">📖</span>
            </div>
            <div>
              {/* TEXT FIXED HERE */}
              <h1 className="font-semibold text-amber-100">Chofetz Chaim Study</h1>
              <p className="text-xs text-amber-400/70">Sacred Text Platform</p>
            </div>
          </div>

          {/* FOUR SAGES IMAGE - Sidebar Header */}
          <div className="relative w-full h-32 rounded-lg overflow-hidden border border-amber-800/30 mb-2">
            <Image 
              src="/four-sages.jpg" 
              alt="Traditional scholars" 
              fill 
              className="object-cover opacity-80 hover:opacity-100 transition"
              unoptimized // Added this to prevent Next.js optimization errors on local files
            />
          </div>

          <nav className="flex flex-col gap-2 text-sm">
            <button className="flex items-center gap-3 px-4 py-3 bg-amber-900/30 border border-amber-700/40 rounded-lg text-amber-100">
              <span>📚</span> Text Library
            </button>
            <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg text-amber-200/80 transition">
              <span>⚖️</span> Side-by-Side Study
            </button>
            <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg text-amber-200/80 transition">
              <span>🔍</span> Search Texts
            </button>
            <div className="h-px bg-amber-900/30 my-2" />
            <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg text-amber-200/80 transition">
              <span>🔖</span> Bookmarks <span className="ml-auto bg-amber-800/40 text-xs px-2 py-0.5 rounded-full">7</span>
            </button>
            <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg text-amber-200/80 transition">
              <span>📂</span> Collections
            </button>
          </nav>

          <div className="mt-auto pt-4 border-t border-amber-900/30">
            <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-amber-900/50 flex items-center justify-center text-amber-300 text-sm">N</div>
              <div className="flex-1">
                <p className="text-sm text-amber-100">Rabbi M. Goldstein</p>
                <p className="text-xs text-amber-400/70">Educator Account</p>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-8 md:p-12 flex flex-col items-center justify-center text-center">
          
          {/* CHOFETZ CHAIM PORTRAIT */}
          <div className="relative w-40 h-40 md:w-56 md:h-56 mb-8">
            <div className="absolute inset-0 bg-amber-700/20 rounded-full blur-xl" />
            <Image 
              src="/chofetz-chaim.jpg" 
              alt="Rabbi Yisrael Meir Kagan (Chofetz Chaim)" 
              fill 
              className="object-cover rounded-full border-4 border-amber-800/50 shadow-2xl relative z-10"
              priority
              unoptimized // Added this to prevent Next.js optimization errors
            />
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            <span className="inline-block px-4 py-1.5 bg-amber-900/30 border border-amber-700/40 rounded-full text-xs font-medium tracking-wide text-amber-300 uppercase">
              Sacred Text Library
            </span>
            
            <h1 className="text-3xl md:text-5xl font-bold text-amber-50 leading-tight">
              The Complete Writings of<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">the Chofetz Chaim</span>
            </h1>
            
            <p className="text-lg md:text-xl text-amber-200/80 font-light">
              &amp; All Six Chapters of Pirkei Avot
            </p>
            
            <p className="text-amber-200/60 max-w-lg mx-auto">
              A scholarly platform for Rabbis and educators — full text search, side-by-side comparison, and passage bookmarking for lesson preparation.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-full transition shadow-lg shadow-amber-900/30 flex items-center gap-2">
                <span>📖</span> Open Side-by-Side Study
              </button>
              <button className="px-6 py-3 border border-amber-700/50 hover:bg-amber-900/20 text-amber-200 font-medium rounded-full transition flex items-center gap-2">
                <span>🔍</span> Search All Texts
              </button>
            </div>

            <div className="flex justify-center gap-8 pt-8 text-sm text-amber-400/70">
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-300">8</p>
                <p>Works by Chofetz Chaim</p>
              </div>
              <div className="w-px bg-amber-900/40" />
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-300">6</p>
                <p>Pirkei Avot Chapters</p>
              </div>
              <div className="w-px bg-amber-900/40" />
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-300">543+</p>
                <p>Indexed Passages</p>
              </div>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}
