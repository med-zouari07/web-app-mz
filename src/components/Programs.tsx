import { Language } from '../types';
import { campaigns } from '../data/campaigns';
import ProgramCard from './ProgramCard';

interface ProgramsProps {
  language: Language;
  translations: any;
}

export default function Programs({ language, translations }: ProgramsProps) {
  return (
    <section id="programs" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
          {translations.programs.title}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <ProgramCard key={campaign.id} campaign={campaign} language={language} />
          ))}
        </div>
      </div>
    </section>
  );
}
