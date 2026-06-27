export type Language = 'ar' | 'fr' | 'en';

export type CampaignCategory =
  | 'orphans-widows'
  | 'health'
  | 'women-emergency'
  | 'youth-sports'
  | 'education'
  | 'ramadan'
  | 'seasonal'
  | 'general';

export interface Campaign {
  id: string;
  category: CampaignCategory;
  titleAr: string;
  titleFr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionFr: string;
  descriptionEn: string;
  image: string;
  detailAr?: string;
  detailFr?: string;
  detailEn?: string;
  goal?: number;
  beneficiariesAr?: string;
  beneficiariesFr?: string;
  beneficiariesEn?: string;
}

export interface CategoryInfo {
  id: CampaignCategory;
  titleAr: string;
  titleFr: string;
  titleEn: string;
  icon: string;
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
