import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ja from '@/locales/ja/translation.json';

// translation.jsonをそのまま使う
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNestedValue(obj: any, key: string): string {
  return key.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : key), obj);
}

export function useClientTranslation() {
  const { t, i18n } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const clientT = (key: string): string => {
    if (!isClient) {
      return getNestedValue(ja, key);
    }
    return t(key);
  };

  return {
    t: clientT,
    i18n,
    isClient,
  };
} 