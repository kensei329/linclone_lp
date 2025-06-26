'use client';

import { useClientTranslation } from '@/hooks/useClientTranslation';

export default function Footer() {
  const { t } = useClientTranslation();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* 下部のコピーライト */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
} 