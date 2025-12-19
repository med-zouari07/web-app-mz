export type Language = 'ar' | 'fr' | 'en';

export interface Campaign {
  id: string;
  titleAr: string;
  titleFr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionFr: string;
  descriptionEn: string;
  image: string;
}

export interface Translations {
  nav: {
    about: string;
    programs: string;
    donate: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  about: {
    title: string;
    description: string;
    address: string;
    addressValue: string;
    phone: string;
    mobile: string;
    email: string;
  };
  programs: {
    title: string;
  };
  donate: {
    title: string;
    subtitle: string;
    amount: string;
    customAmount: string;
    fullName: string;
    email: string;
    phone: string;
    message: string;
    selectCampaign: string;
    submit: string;
    processing: string;
  };
  footer: {
    copyright: string;
  };
}
