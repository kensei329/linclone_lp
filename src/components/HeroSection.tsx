'use client';

import { motion } from 'framer-motion';
import { PlayIcon, SparklesIcon } from '@heroicons/react/24/solid';
import LanguageToggle from './LanguageToggle';
import { useClientTranslation } from '@/hooks/useClientTranslation';
import { Montserrat } from 'next/font/google';
import { useState, useEffect } from 'react';

const montserrat = Montserrat({ subsets: ['latin'], weight: '700' });

// Floating particles component
const FloatingParticles = () => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-white/20 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [-20, -40, -20],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Interactive orb component
const InteractiveOrb = ({ className, delay = 0 }: { className: string; delay?: number }) => {
  return (
    <motion.div
      className={`absolute rounded-full ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.7, 0.3],
        rotate: 360,
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
};

export default function HeroSection() {
  const { t } = useClientTranslation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-purple-800/30 to-pink-800/30 transition-all duration-1000 ease-out"
          style={{
            backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
          }}
        />
        
        {/* Animated mesh gradient */}
        <motion.div
          className="absolute inset-0 opacity-50"
          animate={{
            background: [
              "radial-gradient(circle at 20% 80%, #8b5cf6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ec4899 0%, transparent 50%)",
              "radial-gradient(circle at 40% 40%, #8b5cf6 0%, transparent 50%), radial-gradient(circle at 60% 60%, #ec4899 0%, transparent 50%)",
              "radial-gradient(circle at 20% 80%, #8b5cf6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ec4899 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating Particles */}
      <FloatingParticles />
      
      {/* Interactive Orbs */}
      <InteractiveOrb 
        className="top-1/4 left-1/4 w-32 h-32 bg-purple-500/20 blur-xl" 
        delay={0}
      />
      <InteractiveOrb 
        className="bottom-1/4 right-1/4 w-24 h-24 bg-pink-500/20 blur-xl" 
        delay={2}
      />
      <InteractiveOrb 
        className="top-1/3 right-1/3 w-40 h-40 bg-blue-500/15 blur-2xl" 
        delay={4}
      />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between p-6">
          {/* Logo with glassmorphism */}
          <motion.div 
            className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/20"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className={`${montserrat.className} text-2xl sm:text-3xl font-bold text-white tracking-widest`}>
              LinClone
            </span>
          </motion.div>

          {/* Language Toggle with glassmorphism */}
          <motion.div 
            className="bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <LanguageToggle />
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-8 mt-10"
        >
          <SparklesIcon className="w-5 h-5 text-yellow-300" />
          <span className="text-white/90 text-sm font-medium">
            Now in Beta • Experience the Future
          </span>
          <SparklesIcon className="w-5 h-5 text-yellow-300" />
        </motion.div>

        {/* Title with enhanced animations */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-4xl sm:text-6xl md:text-6xl font-bold text-white mb-8 leading-tight tracking-tight"
        >
          <motion.span
            className="inline-block bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{ backgroundSize: "200% 200%" }}
          >
            {t('hero.title')}
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-2xl text-gray-200 mb-12 leading-relaxed max-w-3xl mx-auto"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* Enhanced Button Group */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col lg:flex-row gap-6 items-center justify-center mb-16"
        >
          {/* Primary CTA */}
          <motion.button
            className="group relative px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full overflow-hidden shadow-2xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const el = document.getElementById('beta-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ x: "100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10 flex items-center gap-2">
              <SparklesIcon className="w-5 h-5" />
              {t('hero.getStarted')}
            </span>
          </motion.button>
          
          {/* Secondary CTA */}
          <motion.button
            className="group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const el = document.getElementById('demo-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <motion.div
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <PlayIcon className="w-6 h-6 text-white ml-1" />
            </motion.div>
            <span>{t('hero.watchDemo')}</span>
          </motion.button>
        </motion.div>

        {/* Enhanced Download Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 max-w-md mx-auto mb-8"
        >
          <h3 className="text-white text-xl font-semibold mb-6 flex items-center justify-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              📱
            </motion.div>
            {t('download.title')}
          </h3>
          
          <div className="flex flex-col gap-4">
            {/* App Store Button */}
            <motion.button
              className="group flex items-center justify-center px-6 py-4 bg-black/80 backdrop-blur-sm text-white rounded-2xl hover:bg-black transition-all duration-300 border border-white/10"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open('https://apps.apple.com/app/linclone', '_blank')}
            >
              <div className="flex items-center space-x-4">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs opacity-75">Download on the</div>
                  <div className="text-lg font-semibold">App Store</div>
                </div>
                <motion.div
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ x: -10 }}
                  whileHover={{ x: 0 }}
                >
                  →
                </motion.div>
              </div>
            </motion.button>

            {/* Google Play Button */}
            <motion.button
              className="group flex items-center justify-center px-6 py-4 bg-black/80 backdrop-blur-sm text-white rounded-2xl hover:bg-black transition-all duration-300 border border-white/10"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open('https://play.google.com/store/apps/details?id=com.linclone.app', '_blank')}
            >
              <div className="flex items-center space-x-4">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs opacity-75">Get it on</div>
                  <div className="text-lg font-semibold">Google Play</div>
                </div>
                <motion.div
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ x: -10 }}
                  whileHover={{ x: 0 }}
                >
                  →
                </motion.div>
              </div>
            </motion.button>
          </div>
        </motion.div>


      </div>
    </section>
  );
} 