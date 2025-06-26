'use client';

import { motion } from 'framer-motion';
import { PlayIcon } from '@heroicons/react/24/solid';
import LanguageToggle from './LanguageToggle';
import { useClientTranslation } from '@/hooks/useClientTranslation';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'], weight: '700' });

export default function HeroSection() {
  const { t } = useClientTranslation();

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center overflow-hidden">
      {/* ロゴ */}
      <div className="absolute top-6 left-6 z-50">
        <span className={`${montserrat.className} text-2xl sm:text-3xl font-bold text-white tracking-widest drop-shadow-lg select-none`}>LinClone</span>
      </div>

      {/* 背景アニメーション */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-pink-800/20 animate-pulse"></div>
      
      {/* 言語切替ボタン */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageToggle />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-6xl md:text-6xl font-bold text-white mb-6 leading-tight whitespace-pre-line tracking-tight"
        >
          {t('hero.title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-sm md:text-xl text-gray-200 mb-12 leading-relaxed italic"
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col gap-6 items-center w-full max-w-xs mx-auto"
        >
          <button
            className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            onClick={() => {
              const el = document.getElementById('beta-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {t('hero.getStarted')}
          </button>
          
          <button
            className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300"
            onClick={() => {
              const el = document.getElementById('demo-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="w-auto flex items-center">
              <PlayIcon className="w-5 h-5 mr-2" />
              <span className="text-center">{t('hero.watchDemo')}</span>
            </span>
          </button>
        </motion.div>
      </div>

      {/* 装飾的な要素 */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-bounce"></div>
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-xl animate-pulse"></div>
    </section>
  );
} 