'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { useEffect } from 'react';

interface ClientProviderProps {
  children: React.ReactNode;
}

export default function ClientProvider({ children }: ClientProviderProps) {
  useEffect(() => {
    const updateHtmlLang = () => {
      if (typeof document !== 'undefined') {
        document.documentElement.lang = i18n.language || 'ja';
      }
    };
    updateHtmlLang();
    i18n.on('languageChanged', updateHtmlLang);
    return () => {
      i18n.off('languageChanged', updateHtmlLang);
    };
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
} 