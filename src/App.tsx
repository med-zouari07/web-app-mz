import { useState, useEffect } from 'react';
import { Language } from './types';
import { translations } from './i18n/translations';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Programs from './components/Programs';
import DonationForm from './components/DonationForm';
import Footer from './components/Footer';

function App() {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';

    if (language === 'ar') {
      document.body.style.fontFamily = "'Cairo', sans-serif";
    } else {
      document.body.style.fontFamily = "'Montserrat', sans-serif";
    }
  }, [language]);

  const t = translations[language];

  return (
    <div className="min-h-screen bg-white">
      <Header language={language} setLanguage={setLanguage} translations={t} />
      <Hero translations={t} />
      <About translations={t} />
      <Programs language={language} translations={t} />
      <DonationForm language={language} translations={t} />
      <Footer translations={t} />
    </div>
  );
}

export default App;
