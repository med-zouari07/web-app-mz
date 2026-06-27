import { useState } from 'react';
import { Campaign, Language } from '../types';
import { X, Users, Target } from 'lucide-react';

interface ProgramCardProps {
  campaign: Campaign;
  language: Language;
  translations: any;
}

export default function ProgramCard({ campaign, language, translations }: ProgramCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const detail =
    language === 'ar'
      ? campaign.detailAr || campaign.descriptionAr
      : language === 'fr'
      ? campaign.detailFr || campaign.descriptionFr
      : campaign.detailEn || campaign.descriptionEn;

  const beneficiaries =
    language === 'ar'
      ? campaign.beneficiariesAr
      : language === 'fr'
      ? campaign.beneficiariesFr
      : campaign.beneficiariesEn;

  const isRTL = language === 'ar';

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        <div className="h-48 overflow-hidden relative group">
          <img
            src={campaign.image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white px-6 py-2 rounded-full text-gray-800 font-medium hover:bg-gray-100"
            >
              {translations.programs.readMore}
            </button>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />

            <div
              className="inline-block bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all my-8 align-middle max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header with Image */}
              <div className="relative h-64 sm:h-80">
                <img
                  src={campaign.image}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 transition-colors shadow-lg"
                  aria-label={translations.programs.close}
                >
                  <X className="h-6 w-6 text-gray-800" />
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {title}
                  </h2>
                  <p className="text-white/90 text-base sm:text-lg leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>

              {/* Modal Content */}
              <div className={`p-6 sm:p-8 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Goals and Beneficiaries */}
                {(campaign.goal || campaign.beneficiaries) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {campaign.goal && (
                      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                        <div className="flex items-center gap-3">
                          <div className="bg-emerald-500 rounded-lg p-2">
                            <Target className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-emerald-600 font-medium">
                              {translations.programs.goal}
                            </p>
                            <p className="text-2xl font-bold text-emerald-700">
                              {campaign.goal.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {beneficiaries && (
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-500 rounded-lg p-2">
                            <Users className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-blue-600 font-medium">
                              {translations.programs.beneficiaries}
                            </p>
                            <p className="text-lg font-bold text-blue-700">
                              {beneficiaries}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Detailed Description */}
                <div className="prose max-w-none">
                  <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                    {detail}
                  </p>
                </div>

                {/* Close Button */}
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
                  >
                    {translations.programs.close}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
