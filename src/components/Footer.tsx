'use client';

import { useClientTranslation } from '@/hooks/useClientTranslation';

export default function Footer() {
  const { t } = useClientTranslation();

  const footerSections = [
    {
      title: t('footer.product'),
      links: [
        { name: t('footer.features'), href: '#features' },
        { name: t('footer.demo'), href: '#demo' },
        { name: t('footer.pricing'), href: '#pricing' },
      ],
    },
    {
      title: t('footer.company'),
      links: [
        { name: t('footer.about'), href: '#about' },
        { name: t('footer.blog'), href: '#blog' },
        { name: t('footer.careers'), href: '#careers' },
      ],
    },
    {
      title: t('footer.support'),
      links: [
        { name: t('footer.help'), href: '#help' },
        { name: t('footer.contact'), href: '#contact' },
        { name: t('footer.privacy'), href: '#privacy' },
      ],
    },
  ];

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