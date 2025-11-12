import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ja from '@/locales/ja/translation.json';

// translation.jsonをそのまま使う
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNestedValue(obj: any, key: string): string {
  return key.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : key), obj);
}

function applyInterpolation(template: string, options?: Record<string, string | number>): string {
  if (!options) return template;
  return template.replace(/\{([^}]+)\}/g, (_, match) => {
    const value = options[match.trim()];
    return value !== undefined ? String(value) : `{${match}}`;
  });
}

export function useClientTranslation() {
  const { t, i18n } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const clientT = (key: string, options?: Record<string, string | number>): string => {
    if (!isClient) {
      const template = getNestedValue(ja, key);
      return applyInterpolation(template, options);
    }
    return options ? t(key, options) : t(key);
  };

  return {
    t: clientT,
    i18n,
    isClient,
  };
}