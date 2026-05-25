import { useState } from 'react';
import { Heart, Building2, Copy, Check } from 'lucide-react';
import { Language } from '../types';

interface DonationFormProps {
  language: Language;
  translations: any;
}

export default function DonationForm({ language, translations }: DonationFormProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const ribInfo = {
    bank: 'Attijariwafa Bank',
    agency: 'Ouled Berhil',
    rib: '007 780 0001234000000015 78',
    iban: 'MA64 007 780 0001234000000015 78',
    swift: 'MAFAMABCXXX',
  };

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const isRTL = language === 'ar';

  return (
    <section id="donate" className="py-16 bg-gradient-to-br from-emerald-600 to-teal-700">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white mb-12">
          <Heart className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {translations.donate.title}
          </h2>
          <p className="text-xl opacity-90">{translations.donate.subtitle}</p>
        </div>

        {/* RIB Information Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 mb-8">
          <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Building2 className="w-8 h-8 text-emerald-600" />
            <h3 className="text-2xl font-bold text-gray-900">
              {language === 'ar' ? 'معلومات الحساب البنكي' :
               language === 'fr' ? 'Informations Bancaires' :
               'Bank Account Information'}
            </h3>
          </div>

          <div className={`space-y-4 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Bank Name */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                {language === 'ar' ? 'البنك' : language === 'fr' ? 'Banque' : 'Bank'}
              </label>
              <p className="text-lg font-bold text-gray-900">{ribInfo.bank}</p>
            </div>

            {/* Agency */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                {language === 'ar' ? 'الوكالة' : language === 'fr' ? 'Agence' : 'Agency'}
              </label>
              <p className="text-lg font-bold text-gray-900">{ribInfo.agency}</p>
            </div>

            {/* RIB */}
            <div className="bg-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
              <div className={`flex items-start justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-emerald-700 mb-1">
                    {language === 'ar' ? 'رقم الحساب البنكي (RIB)' :
                     language === 'fr' ? 'RIB' : 'Bank Account Number (RIB)'}
                  </label>
                  <p className="text-xl font-bold text-emerald-900 font-mono tracking-wide">
                    {ribInfo.rib}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(ribInfo.rib, 'rib')}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
                  title={language === 'ar' ? 'نسخ' : language === 'fr' ? 'Copier' : 'Copy'}
                >
                  {copied === 'rib' ? (
                    <>
                      <Check className="w-5 h-5" />
                      {language === 'ar' ? 'تم النسخ' : language === 'fr' ? 'Copié!' : 'Copied!'}
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      {language === 'ar' ? 'نسخ' : language === 'fr' ? 'Copier' : 'Copy'}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* IBAN */}
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
              <div className={`flex items-start justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-blue-700 mb-1">
                    IBAN
                  </label>
                  <p className="text-lg font-bold text-blue-900 font-mono tracking-wide">
                    {ribInfo.iban}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(ribInfo.iban, 'iban')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                  title={language === 'ar' ? 'نسخ' : language === 'fr' ? 'Copier' : 'Copy'}
                >
                  {copied === 'iban' ? (
                    <>
                      <Check className="w-5 h-5" />
                      {language === 'ar' ? 'تم النسخ' : language === 'fr' ? 'Copié!' : 'Copied!'}
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      {language === 'ar' ? 'نسخ' : language === 'fr' ? 'Copier' : 'Copy'}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* SWIFT/BIC */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className={`flex items-start justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    SWIFT/BIC
                  </label>
                  <p className="text-lg font-bold text-gray-900 font-mono tracking-wide">
                    {ribInfo.swift}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(ribInfo.swift, 'swift')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
                  title={language === 'ar' ? 'نسخ' : language === 'fr' ? 'Copier' : 'Copy'}
                >
                  {copied === 'swift' ? (
                    <>
                      <Check className="w-5 h-5" />
                      {language === 'ar' ? 'تم النسخ' : language === 'fr' ? 'Copié!' : 'Copied!'}
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      {language === 'ar' ? 'نسخ' : language === 'fr' ? 'Copier' : 'Copy'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className={`mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded ${isRTL ? 'border-r-4 border-l-0' : ''}`}>
            <p className="text-gray-700 text-base leading-relaxed">
              {language === 'ar'
                ? 'يمكنكم إيداع تبرعاتكم مباشرة في حسابنا البنكي. يرجى إرسال إيصال التحويل عبر الواتساب على الرقم 0666932107 لأجل التعامل مع تبرعكم وتوجيهه للبرنامج المطلوب.'
                : language === 'fr'
                ? 'Vous pouvez déposer vos dons directement sur notre compte bancaire. Veuillez envoyer le reçu de virement par WhatsApp au 0666932107 pour que nous puissions traiter votre don et l\'affecter au programme souhaité.'
                : 'You can deposit your donations directly into our bank account. Please send the transfer receipt via WhatsApp to 0666932107 so we can process your donation and direct it to the desired program.'}
            </p>
          </div>
        </div>

        {/* Alternative Contact Info */}
        <div className="text-center text-white">
          <p className="text-lg font-semibold mb-2">
            {language === 'ar' ? 'للاستفسارات والأسئلة' :
             language === 'fr' ? 'Pour toute question' :
             'For inquiries and questions'}
          </p>
          <p className="text-base opacity-90">
            {language === 'ar' ? 'اتصل بنا على: ' :
             language === 'fr' ? 'Contactez-nous au: ' :
             'Contact us at: '}
            <a href="tel:+212666932107" className="font-bold hover:underline">
              0666932107
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
