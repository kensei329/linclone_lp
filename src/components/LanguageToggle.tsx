'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useClientTranslation } from '@/hooks/useClientTranslation';

export default function LanguageToggle() {
  const { i18n, isClient } = useClientTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = isClient ? i18n.language : 'ja';

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium">
          {currentLanguage === 'ja' ? '日本語' : 'English'}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 w-32 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
          >
            <button
              type="button"
              onClick={() => handleLanguageChange('ja')}
              className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-sm cursor-pointer"
              aria-selected={currentLanguage === 'ja'}
            >
              日本語
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('en')}
              className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-sm cursor-pointer"
              aria-selected={currentLanguage === 'en'}
            >
              English
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 