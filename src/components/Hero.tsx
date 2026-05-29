interface HeroProps {
  translations: any;
}

export default function Hero({ translations }: HeroProps) {
  const scrollToDonate = () => {
    const element = document.getElementById('donate');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-[500px] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.pexels.com/photos/6647028/pexels-photo-6647028.jpeg?auto=compress&cs=tinysrgb&w=1600)',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>

      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
          {translations.hero.title}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 opacity-90">
          {translations.hero.subtitle}
        </p>
        <button
          onClick={scrollToDonate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
        >
          {translations.hero.cta}
        </button>
      </div>
    </section>
  );
}
