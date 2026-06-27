import { Mail, MapPin, Phone, Facebook, Twitter, Linkedin } from 'lucide-react';

interface FooterProps {
  translations: any;
}

export default function Footer({ translations }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center md:text-left">
            <img
              src="/logo.png"
              alt="Association Bon Voisinage"
              className="h-16 w-auto mx-auto md:mx-0 mb-4 brightness-0 invert"
            />
            <p className="text-gray-400 text-sm">{translations.footer.copyright}</p>
          </div>

          <div className="text-center">
            <h3 className="font-bold text-lg mb-4">{translations.footer.contact}</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-gray-300">
                <MapPin size={18} />
                <span className="text-sm">{translations.about.addressValue}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-300">
                <Phone size={18} />
                <span className="text-sm">+212 5 24 85 24 18</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-300">
                <Mail size={18} />
                <span className="text-sm">info@bonvoisinage.org</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="font-bold text-lg mb-4">{translations.footer.followUs}</h3>
            <div className="flex justify-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                <Twitter size={24} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
          <img
            src="/logo.png"
            alt="Association Bon Voisinage"
            className="h-14 w-auto mx-auto mb-3 brightness-0 invert"
          />
          <p>{translations.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
