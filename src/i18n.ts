import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
// import translations directly
import common_en from './locales/en/common.json';
import common_fr from './locales/fr/common.json';

// Initialize i18n with static resources
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: common_en },
      fr: { common: common_fr },
    },
    supportedLngs: ['en', 'fr'],
    fallbackLng: 'en',
    defaultNS: 'common',
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie'],
    },
    react: { useSuspense: false },
    returnObjects: true,
    interpolation: { escapeValue: false },
  });

export default i18n;