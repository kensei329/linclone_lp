'use client';

import React from 'react';
import Link from 'next/link';
import { Montserrat } from 'next/font/google';
import { useClientTranslation } from '@/hooks/useClientTranslation';

const montserrat = Montserrat({ subsets: ['latin'], weight: '700' });

const sectionOrder = ['introduction', 'usage', 'payments', 'contact'] as const;

export default function TermsPage() {
  const { t } = useClientTranslation();
  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <header className="relative z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className={`${montserrat.className} text-2xl font-bold text-white tracking-widest`}>
              LinClone
            </span>
          </Link>
          <Link
            href="/"
            className="text-white/80 hover:text-white transition-colors duration-300"
          >
            ← {t('terms.back')}
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/20">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('terms.title')}
          </h1>
          <p className="text-gray-300 mb-8">
            {t('terms.lastUpdated', { date: currentDate })}
          </p>

          <div className="space-y-8">
            {sectionOrder.map((key) => (
              <section key={key}>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  {t(`terms.sections.${key}.title`)}
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {t(`terms.sections.${key}.content`)}
                </p>
              </section>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              ← {t('terms.back')}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

