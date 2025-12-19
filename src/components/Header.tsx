import { Globe } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: any;
}

export default function Header({ language, setLanguage, translations }: HeaderProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <img
              src="/logo.png"
              alt="Association Bon Voisinage"
              className="h-16 sm:h-20 w-auto"
            />
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('about')}
              className="text-gray-700 hover:text-blue-600 font-semibold transition-colors"
            >
              {translations.nav.about}
            </button>
            <button
              onClick={() => scrollToSection('programs')}
              className="text-gray-700 hover:text-blue-600 font-semibold transition-colors"
            >
              {translations.nav.programs}
            </button>
            <button
              onClick={() => scrollToSection('donate')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              {translations.nav.donate}
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-gray-600" />
            <div className="flex gap-1">
              {(['ar', 'fr', 'en'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                    language === lang
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <nav className="md:hidden flex justify-around pb-3 border-t pt-3">
          <button
            onClick={() => scrollToSection('about')}
            className="text-gray-700 hover:text-blue-600 font-semibold text-sm"
          >
            {translations.nav.about}
          </button>
          <button
            onClick={() => scrollToSection('programs')}
            className="text-gray-700 hover:text-blue-600 font-semibold text-sm"
          >
            {translations.nav.programs}
          </button>
          <button
            onClick={() => scrollToSection('donate')}
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
          >
            {translations.nav.donate}
          </button>
        </nav>
      </div>
    </header>
  );
}
