'use client';

import { motion } from 'framer-motion';
import { CpuChipIcon, ChatBubbleLeftRightIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useClientTranslation } from '@/hooks/useClientTranslation';

export default function FeaturesSection() {
  const { t } = useClientTranslation();

  const features = [
    {
      icon: CpuChipIcon,
      title: t('features.aiClone.title'),
      description: t('features.aiClone.description'),
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: t('features.realtime.title'),
      description: t('features.realtime.description'),
    },
    {
      icon: ChartBarIcon,
      title: t('features.analytics.title'),
      description: t('features.analytics.description'),
    },
  ];

  return (
    <section className="py-20 bg-gray-50 min-h-screen flex items-center">
      <div className="max-w-full w-full mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-6xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight whitespace-pre-line tracking-tight">
            {t('features.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group flex flex-col items-center w-full min-w-0"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="w-full max-w-[600px]">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-left">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
} 