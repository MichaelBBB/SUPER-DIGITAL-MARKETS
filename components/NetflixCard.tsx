'use client';

import { useState, useRef } from 'react';

export default function NetflixCard() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/audio/netflix.mp3');
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleBuyNow = () => {
    // Add your Peach Payments / WhatsApp logic here later
    console.log('Buy Now clicked for Netflix');
  };

  return (
    <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-2xl max-w-sm border border-gray-800">
      {/* HOT Badge */}
      <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider z-10 shadow-md">
        HOT
      </div>

      {/* Price Badge */}
      <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold z-10 shadow-md">
        $22.99
      </div>

      {/* Netflix Image Area */}
      <div className="relative h-56 bg-black flex items-center justify-center overflow-hidden">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" 
          alt="Netflix Premium"
          className="w-32 h-32 object-contain"
        />
      </div>

      {/* Content Area */}
      <div className="p-6">
        <div className="text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold">
          Entertainment
        </div>
        <h3 className="text-white text-2xl font-bold mb-3">
          Netflix Premium
        </h3>
        <p className="text-gray-300 text-sm mb-5 leading-relaxed">
          4K Ultra HD streaming, 4 simultaneous screens, and offline downloads. Access 10,000+ titles worldwide.
        </p>

        {/* Region Flags */}
        <div className="flex gap-3 mb-6 text-2xl">
          <span title="USA">🇺🇸</span>
          <span title="South Africa">🇿🇦</span>
        </div>

        {/* Music Play Button */}
        <button
          onClick={handlePlayMusic}
          className="w-full mb-3 py-3 px-4 rounded-lg font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
          style={{
            backgroundColor: isPlaying ? '#ef4444' : '#10b981',
            color: 'white'
          }}
        >
          {isPlaying ? (
            <>
              <span>⏸️</span> Stop Preview
            </>
          ) : (
            <>
              <span>🎵</span> Play Preview
            </>
          )}
        </button>

        {/* Buy Now Button */}
        <button
          onClick={handleBuyNow}
          className="w-full py-4 px-4 rounded-lg font-bold text-base transition-all duration-200 shadow-lg hover:opacity-90"
          style={{
            backgroundColor: '#06b6d4',
            color: 'white'
          }}
        >
          🛒 Buy Now
        </button>
      </div>
    </div>
  );
}
