import { Campaign, Language } from '../types';

interface ProgramCardProps {
  campaign: Campaign;
  language: Language;
}

export default function ProgramCard({ campaign, language }: ProgramCardProps) {
  const title =
    language === 'ar'
      ? campaign.titleAr
      : language === 'fr'
      ? campaign.titleFr
      : campaign.titleEn;

  const description =
    language === 'ar'
      ? campaign.descriptionAr
      : language === 'fr'
      ? campaign.descriptionFr
      : campaign.descriptionEn;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="h-48 overflow-hidden">
        <img
          src={campaign.image}
          alt={title}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
