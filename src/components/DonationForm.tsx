import { useState } from 'react';
import { Heart, CreditCard } from 'lucide-react';
import { Language } from '../types';
import { campaigns } from '../data/campaigns';

interface DonationFormProps {
  language: Language;
  translations: any;
}

const predefinedAmounts = [100, 200, 500, 1000, 2000, 5000];

export default function DonationForm({ language, translations }: DonationFormProps) {
  const [amount, setAmount] = useState<number | string>(500);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAmountClick = (value: number) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (value) {
      setAmount(parseFloat(value) || 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const finalAmount = customAmount ? parseFloat(customAmount) : (typeof amount === 'number' ? amount : parseFloat(String(amount)));

    if (!finalAmount || finalAmount < 10) {
      alert(language === 'ar' ? 'الحد الأدنى للتبرع هو 10 درهم' : language === 'fr' ? 'Le don minimum est de 10 MAD' : 'Minimum donation is 10 MAD');
      setIsProcessing(false);
      return;
    }

    if (!fullName || !email || !phone) {
      alert(language === 'ar' ? 'الرجاء ملء جميع الحقول المطلوبة' : language === 'fr' ? 'Veuillez remplir tous les champs requis' : 'Please fill all required fields');
      setIsProcessing(false);
      return;
    }

    const donationData = {
      amount: finalAmount,
      campaign: selectedCampaign,
      fullName,
      email,
      phone,
      message,
      language,
      timestamp: new Date().toISOString(),
    };

    console.log('Donation Data:', donationData);

    setTimeout(() => {
      alert(
        language === 'ar'
          ? 'شكراً لك! يرجى الاتصال بنا على 0666932107 لإتمام التبرع'
          : language === 'fr'
          ? 'Merci! Veuillez nous contacter au 0666932107 pour finaliser votre don'
          : 'Thank you! Please contact us at 0666932107 to complete your donation'
      );
      setIsProcessing(false);
      setAmount(500);
      setCustomAmount('');
      setSelectedCampaign('');
      setFullName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 1500);
  };

  return (
    <section id="donate" className="py-16 bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white mb-12">
          <Heart className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {translations.donate.title}
          </h2>
          <p className="text-xl opacity-90">{translations.donate.subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-3">
                {translations.donate.amount}
              </label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {predefinedAmounts.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleAmountClick(value)}
                    className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                      amount === value && !customAmount
                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {value} MAD
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={customAmount}
                onChange={handleCustomAmountChange}
                placeholder={translations.donate.customAmount}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="10"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                {translations.donate.selectCampaign}
              </label>
              <select
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">
                  {language === 'ar'
                    ? 'حدد حملة (اختياري)'
                    : language === 'fr'
                    ? 'Sélectionner (optionnel)'
                    : 'Select (optional)'}
                </option>
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {language === 'ar'
                      ? campaign.titleAr
                      : language === 'fr'
                      ? campaign.titleFr
                      : campaign.titleEn}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  {translations.donate.fullName} *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  {translations.donate.email} *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                {translations.donate.phone} *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                {translations.donate.message}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>{translations.donate.processing}</>
              ) : (
                <>
                  <CreditCard className="w-6 h-6" />
                  {translations.donate.submit}
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              {language === 'ar'
                ? 'الدفع الآمن عبر CMI - البنك التجاري وفا بنك'
                : language === 'fr'
                ? 'Paiement sécurisé via CMI - Attijariwafa Bank'
                : 'Secure payment via CMI - Attijariwafa Bank'}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
