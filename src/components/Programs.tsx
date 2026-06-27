import { Language, CampaignCategory } from '../types';
import { campaigns, categories } from '../data/campaigns';
import ProgramCard from './ProgramCard';
import { Heart, Activity, Shield, Trophy, GraduationCap, Moon, Gift, HandHeart } from 'lucide-react';

interface ProgramsProps {
  language: Language;
  translations: any;
}

const iconMap: Record<string, any> = {
  Heart,
  Activity,
  Shield,
  Trophy,
  GraduationCap,
  Moon,
  Gift,
  HandHeart,
};

export default function Programs({ language, translations }: ProgramsProps) {
  const isRTL = language === 'ar';

  return (
    <section id="programs" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
          {translations.programs.title}
        </h2>

        <div className="space-y-16">
          {categories.map((category) => {
            const categoryCampaigns = campaigns.filter(
              (c) => c.category === category.id
            );
            if (categoryCampaigns.length === 0) return null;

            const categoryTitle =
              language === 'ar'
                ? category.titleAr
                : language === 'fr'
                ? category.titleFr
                : category.titleEn;

            const Icon = iconMap[category.icon] || Heart;

            return (
              <div key={category.id} className="scroll-mt-20">
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-8" dir={isRTL ? 'rtl' : 'ltr'}>
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-600 text-white shadow-md flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {categoryTitle}
                    </h3>
                    <div className="h-1 w-20 bg-emerald-500 rounded-full mt-2" />
                  </div>
                </div>

                {/* Campaign Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryCampaigns.map((campaign) => (
                    <ProgramCard
                      key={campaign.id}
                      campaign={campaign}
                      language={language}
                      translations={translations}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
