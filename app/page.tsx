
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
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70" />
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
      />

      {/* NAV
