'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { useClientTranslation } from '@/hooks/useClientTranslation';

export default function BetaSection() {
  const { t } = useClientTranslation();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // シミュレート
    setIsSubmitted(true);
    setEmail('');
    
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <section id="beta-section" className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-6xl md:text-6xl font-bold text-white mb-6 leading-tight whitespace-pre-line tracking-tight">
            {t('beta.title')}
          </h2>
          <p className="text-xs sm:text-sm text-red-400 italic mb-8 text-center">
            {t('beta.subtitle')}
            <span className="block text-left sm:text-center">&nbsp;</span>
          </p>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/20 border border-green-500/30 rounded-lg p-6 max-w-md mx-auto"
            >
              <p className="text-green-200 text-lg">
                {t('beta.success')}
              </p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <div className="relative flex-1">
                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('beta.emailPlaceholder')}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                {t('beta.joinBeta')}
              </button>
            </motion.form>
          )}
        </motion.div>
      </div>
    </section>
  );
} 