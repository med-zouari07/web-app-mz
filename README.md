# Deployment 
 # 1. Build the image
docker build -t bonvoisinage .

# 2. Tag it with your Docker Hub repository and version
docker tag bonvoisinage:latest zouarimed07/bonvoisinage:1.0

# 3. Push it
docker push zouarimed07/bonvoisinage:1.0

# Association Bon Voisinage - Charity Donation Platform

A modern, multilingual charity donation platform for Association Bon Voisinage (جمعية حسن الجوار) in Ouled Berhil, Taroudant Province, Morocco.

## Features

- **Multilingual Support**: Full support for Arabic (AR), French (FR), and English (EN)
- **RTL Support**: Right-to-left layout for Arabic language
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Modern UI**: Beautiful, professional design with smooth transitions
- **Donation System**: Ready for CMI payment gateway integration
- **Campaign Management**: Multiple charity campaigns (Orphan Support, Clothing & Food Aid, Blood Donation, Breakfast During Exams, Children's Celebrations, Community Week, Sports Field, Emergency Relief)

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Fonts**: Cairo (Arabic), Montserrat (English/French)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Navigation header with language switcher
│   ├── Hero.tsx        # Hero section
│   ├── About.tsx       # About section with contact info
│   ├── Programs.tsx    # Programs overview
│   ├── ProgramCard.tsx # Individual program card
│   ├── DonationForm.tsx# Donation form
│   └── Footer.tsx      # Footer component
├── data/
│   └── campaigns.ts    # Campaign data
├── i18n/
│   └── translations.ts # All translations (AR/FR/EN)
├── types/
│   └── index.ts        # TypeScript type definitions
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Language Support

The application starts in Arabic by default and supports seamless switching between:
- Arabic (AR) - RTL layout
- French (FR) - LTR layout
- English (EN) - LTR layout

All content, including navigation, hero text, about section, and form labels, is fully translated.

## Organization Information

**Association Bon Voisinage للأعمال الاجتماعية**

- **Address**: Ouled Berhil – Grand Mosque Street, Ouled Abou, Taroudant Province
- **Phone**: 0546051494
- **Mobile**: 0666932107
- **Email**: associationbonvoisinage@gmail.com

## Payment Integration

The platform is prepared for CMI (Centre Monétique Interbancaire) payment gateway integration with Attijariwafa Bank.

For detailed integration instructions, see [CMI_INTEGRATION_GUIDE.md](./CMI_INTEGRATION_GUIDE.md)

### Current Implementation

The donation form currently:
- Collects donor information (name, email, phone)
- Allows selection of donation amount (predefined or custom)
- Supports campaign selection
- Displays contact information for completing donations

### Next Steps for Payment

1. Obtain CMI merchant credentials from Attijariwafa Bank
2. Implement backend payment processing (see CMI_INTEGRATION_GUIDE.md)
3. Add Supabase Edge Function for payment handling
4. Update frontend to submit to CMI gateway
5. Implement success/failure callback handlers

## Deployment

This application can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

Make sure to:
1. Build the project: `npm run build`
2. Deploy the `dist` directory
3. Configure your domain and SSL certificate
4. Set up backend services for payment processing

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Customization

### Adding New Campaigns

Edit `src/data/campaigns.ts`:

```typescript
{
  id: 'new-campaign',
  titleEn: 'Campaign Title',
  titleFr: 'Titre de la campagne',
  titleAr: 'عنوان الحملة',
  descriptionEn: 'Description...',
  descriptionFr: 'Description...',
  descriptionAr: 'الوصف...',
  image: 'https://your-image-url.jpg',
}
```

### Modifying Translations

Edit `src/i18n/translations.ts` to update or add new translations.

### Changing Colors

The project uses Tailwind CSS. Main colors:
- Primary: Blue (blue-600, blue-700)
- Background: White, Gray-50
- Text: Gray-900, Gray-700

To change colors, update the classes in component files or modify `tailwind.config.js`.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is created for Association Bon Voisinage.

## Contact

For technical support or questions about this platform:
- Email: associationbonvoisinage@gmail.com
- Phone: 0666932107
