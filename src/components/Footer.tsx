interface FooterProps {
  translations: any;
}

export default function Footer({ translations }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <img
            src="/logo.png"
            alt="Association Bon Voisinage"
            className="h-16 w-auto mx-auto mb-4 brightness-0 invert"
          />
          <p className="text-gray-400">{translations.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
