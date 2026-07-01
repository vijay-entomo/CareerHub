import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './translations/en.json';
import tl from './translations/tl.json';

const resources = {
  en: { translation: en },
  tl: { translation: tl },
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    // Use the device's locale (e.g. en-US, tl-PH), fallback to 'en' if not found
    lng: Localization.getLocales()[0]?.languageCode || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
