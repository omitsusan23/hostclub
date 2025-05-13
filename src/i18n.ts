// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ja from './locales/ja.json';
import en from './locales/en.json';

i18n
  .use(initReactI18next)   // React バインディング
  .init({
    resources: {
      ja: { translation: ja },
      en: { translation: en },
    },
    lng: 'ja',              // 初期言語
    fallbackLng: 'en',      // 訳がないキーは英語を使う
    interpolation: {
      escapeValue: false,   // React は自動でエスケープしてくれる
    },
  });

export default i18n;
