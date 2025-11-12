'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { CpuChipIcon, ChatBubbleLeftRightIcon, ChartBarIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { SparklesIcon, StarIcon } from '@heroicons/react/24/solid';
import { useClientTranslation } from '@/hooks/useClientTranslation';
import { useRef } from 'react';

// Floating icon component
const FloatingIcon = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  return (
    <motion.div
      animate={{
        y: [-5, 5, -5],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
};

// Feature card component
interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
  const Icon = feature.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.2,
        ease: "easeOut"
      }}
      viewport={{ once: true, margin: "-100px" }}
      className="group relative"
    >
      {/* Card */}
      <motion.div
        className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100 overflow-hidden h-full"
        whileHover={{ 
          y: -8, 
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Background gradient on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          initial={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1, opacity: 1 }}
        />
        
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
          <SparklesIcon className="w-8 h-8 text-purple-500" />
        </div>
        
        {/* Icon container */}
        <div className="relative mb-6">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg"
            whileHover={{ 
              scale: 1.1, 
              rotate: 5,
              boxShadow: "0 20px 40px -12px rgba(147, 51, 234, 0.4)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FloatingIcon delay={index * 0.5}>
              <Icon className="w-8 h-8 text-white" />
            </FloatingIcon>
          </motion.div>
          
          {/* Icon glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30"
            transition={{ duration: 0.5 }}
          />
        </div>
        
        {/* Content */}
        <div className="relative">
          <motion.h3 
            className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-700 transition-colors duration-300"
            layout
          >
            {feature.title}
          </motion.h3>
          
          <motion.p 
            className="text-gray-600 leading-relaxed mb-6"
            layout
          >
            {feature.description}
          </motion.p>
          
        </div>
        
        {/* Card border animation */}
        <motion.div
          className="absolute inset-0 rounded-3xl border-2 border-transparent"
          whileHover={{
            borderImage: "linear-gradient(135deg, #8b5cf6, #ec4899) 1"
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default function FeaturesSection() {
  const { t } = useClientTranslation();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

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
    <section ref={ref} className="relative py-32 bg-gradient-to-br from-gray-50 via-white to-purple-50 overflow-hidden">
      {/* Animated background elements */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        {/* Background shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-purple-100/10 to-pink-100/10 rounded-full blur-3xl" />
      </motion.div>
      
      {/* Floating decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-1/4 left-10 w-4 h-4 bg-purple-400/30 rounded-full"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            rotate: { duration: 15, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-3/4 right-20 w-6 h-6 bg-pink-400/30 rounded-full"
        />
        <motion.div
          animate={{ 
            y: [-10, 10, -10],
            x: [-5, 5, -5],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-10"
        >
          <StarIcon className="w-8 h-8 text-yellow-400/40" />
        </motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          style={{ y: textY }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-purple-100 border border-purple-200 rounded-full px-6 py-3 mb-8"
          >
            <SparklesIcon className="w-5 h-5 text-purple-600" />
            <span className="text-purple-800 text-sm font-semibold">
              {t('features.headerBadge')}
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight tracking-tight"
          >
            <span className="bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent">
              {t('features.title')}
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            {t('features.subtitleText')}
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <motion.button
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 25px 50px -12px rgba(147, 51, 234, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const el = document.getElementById('demo-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>{t('features.cta')}</span>
            <motion.div
              className="flex items-center justify-center w-6 h-6 bg-white/20 rounded-full"
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowRightIcon className="w-4 h-4" />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
} 