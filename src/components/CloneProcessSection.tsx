'use client';

import { motion } from 'framer-motion';
import { useClientTranslation } from '@/hooks/useClientTranslation';

export default function CloneProcessSection() {
  const { t } = useClientTranslation();

  return (
    <section className="relative py-24 bg-gradient-to-br from-white via-purple-50 to-pink-50 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-24 -left-24 w-72 h-72 bg-purple-200/40 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-semibold text-xs uppercase tracking-wider">
            {t('productIntro.badge')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-6 mb-4 leading-tight">
            {t('productIntro.title')}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {t('productIntro.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/40 bg-white/80 backdrop-blur"
        >
          <div className="w-full aspect-video">
            <iframe
              className="w-full h-full"
              src={t('productIntro.videoUrl')}
              title={t('productIntro.videoTitle')}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        
        </motion.div>
      </div>
    </section>
  );
}

