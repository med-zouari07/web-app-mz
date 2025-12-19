import { MapPin, Phone, Smartphone, Mail } from 'lucide-react';

interface AboutProps {
  translations: any;
}

export default function About({ translations }: AboutProps) {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-8">
          {translations.about.title}
        </h2>

        <p className="text-lg text-gray-700 leading-relaxed mb-12 text-center max-w-4xl mx-auto">
          {translations.about.description}
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-gray-900 mb-1">
                {translations.about.address}
              </p>
              <p className="text-gray-700">{translations.about.addressValue}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <Phone className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-gray-900 mb-1">
                {translations.about.phone}
              </p>
              <p className="text-gray-700">0546051494</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <Smartphone className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-gray-900 mb-1">
                {translations.about.mobile}
              </p>
              <p className="text-gray-700">0666932107</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <Mail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-gray-900 mb-1">
                {translations.about.email}
              </p>
              <p className="text-gray-700 break-all">associationbonvoisinage@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
