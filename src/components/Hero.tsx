interface HeroProps {
  title: string;
  subtitle: string;
  primaryAction: string;
}

export default function Hero({ title, subtitle, primaryAction }: HeroProps) {
  return (
    <section className="py-20 text-center">
      <h1 className="text-5xl font-extrabold mb-6 leading-tight">
        {title}
      </h1>
      <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
        {subtitle}
      </p>
      
      <a 
        href={primaryAction}
        className="inline-block bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-4 px-8 rounded-xl text-lg transition transform hover:scale-105 shadow-lg shadow-cyan-500/20"
      >
        Browse Products
      </a>
    </section>
  );
}
