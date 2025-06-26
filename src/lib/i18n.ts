import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Cookies from 'js-cookie';

import jaTranslation from '@/locales/ja/translation.json';
import enTranslation from '@/locales/en/translation.json';

// Cookie から言語を取得、なければブラウザ言語、それもなければ日本語
const getInitialLanguage = (): string => {
  // サーバーサイドでは常に日本語を返す（Hydration Mismatch防止）
  if (typeof window === 'undefined') {
    return 'ja';
  }
  
  // クライアントサイドでのみCookieやブラウザ言語を確認
  const cookieLang = Cookies.get('i18next');
  if (cookieLang) return cookieLang;
  
  // ブラウザ言語から取得
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'ja' ? 'ja' : 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ja: { translation: jaTranslation },
      en: { translation: enTranslation },
    },
    lng: getInitialLanguage(),
    fallbackLng: 'ja',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

// 言語変更時にCookieに保存
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    Cookies.set('i18next', lng, { expires: 365 });
  }
});

// クライアントサイドでCookieから言語を再読み込み
if (typeof window !== 'undefined') {
  const cookieLang = Cookies.get('i18next');
  if (cookieLang && cookieLang !== i18n.language) {
    i18n.changeLanguage(cookieLang);
  }
}

export default i18n; 