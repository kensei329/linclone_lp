'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useClientTranslation } from '@/hooks/useClientTranslation';

export default function DemoSection() {
  const { t } = useClientTranslation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai'; text: string }>>([]);

  return (
    <section id="demo-section" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-6xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight whitespace-pre-line tracking-tight">
            {t('demo.title')}
          </h2>
          <p className="text-xl text-gray-600">
            {t('demo.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gray-50 rounded-2xl p-8 shadow-xl"
        >
          {/* YouTubeデモ動画エリア */}
          <div className="w-full mb-8">
            <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-xl shadow-lg">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="デモ動画"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 