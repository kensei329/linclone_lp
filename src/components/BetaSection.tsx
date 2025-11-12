'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnvelopeIcon, CheckCircleIcon, RocketLaunchIcon, UserIcon, BuildingOfficeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { SparklesIcon, StarIcon } from '@heroicons/react/24/solid';
import { useClientTranslation } from '@/hooks/useClientTranslation';

interface FormState {
  email: string;
  name: string;
  company: string;
  useCase: string;
}

type SubmissionState = 'idle' | 'loading' | 'success' | 'error';

// Floating elements for background decoration
const FloatingElement = ({ children, delay = 0, duration = 4 }: { children: React.ReactNode; delay?: number; duration?: number }) => (
  <motion.div
    animate={{
      y: [-10, 10, -10],
      rotate: [-5, 5, -5],
      scale: [1, 1.05, 1],
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  >
    {children}
  </motion.div>
);

// Success confetti component
const SuccessConfetti = () => {
  const confettiElements = Array.from({ length: 12 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
      initial={{ 
        x: 0, 
        y: 0, 
        opacity: 1,
        scale: 0
      }}
      animate={{
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        opacity: 0,
        scale: [0, 1, 0],
        rotate: 360
      }}
      transition={{
        duration: 1.5,
        delay: i * 0.1,
        ease: "easeOut"
      }}
      style={{
        left: '50%',
        top: '50%',
      }}
    />
  ));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {confettiElements}
    </div>
  );
};

// Loading spinner component
const LoadingSpinner = () => (
  <motion.div
    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  />
);

// Form field component
const FormField = ({ 
  icon: Icon, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  required = false,
  error = false,
  label,
  id,
  errorMessage
}: {
  icon: React.ComponentType<{ className?: string }>;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: boolean;
  label: string;
  id: string;
  errorMessage?: string;
}) => (
  <motion.div
    className="relative"
    whileFocus={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <label htmlFor={id} className="block text-left text-white font-semibold mb-2">
      {label}
    </label>
    <div className="relative">
      <Icon className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
        error ? 'text-red-400' : 'text-gray-400'
      }`} />
      <motion.input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border-2 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-0 transition-all duration-300 ${
          error 
            ? 'border-red-400 focus:border-red-300' 
            : 'border-white/20 focus:border-purple-400 hover:border-white/30'
        }`}
        whileFocus={{ 
          boxShadow: error 
            ? "0 0 0 3px rgba(239, 68, 68, 0.1)" 
            : "0 0 0 3px rgba(147, 51, 234, 0.1)"
        }}
      />
    </div>
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute -bottom-6 left-0 text-red-300 text-sm"
        >
          {errorMessage}
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default function BetaSection() {
  const { t } = useClientTranslation();
  const [formData, setFormData] = useState<FormState>({
    email: '',
    name: '',
    company: '',
    useCase: ''
  });
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [showConfetti, setShowConfetti] = useState(false);

  const updateField = (field: keyof FormState) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = true;
    }
    if (!formData.name.trim()) {
      newErrors.name = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmissionState('loading');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setSubmissionState('success');
    setShowConfetti(true);
    
    // Reset form after success
    setTimeout(() => {
      setFormData({ email: '', name: '', company: '', useCase: '' });
      setSubmissionState('idle');
      setShowConfetti(false);
    }, 4000);
  };

  const resetForm = () => {
    setSubmissionState('idle');
    setErrors({});
    setShowConfetti(false);
  };

  return (
    <section id="beta-section" className="relative py-32 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating elements */}
        <FloatingElement delay={0} duration={6}>
          <div className="absolute top-20 left-10 w-4 h-4 bg-purple-400/30 rounded-full blur-sm" />
        </FloatingElement>
        <FloatingElement delay={2} duration={8}>
          <div className="absolute top-1/3 right-20 w-6 h-6 bg-pink-400/20 rounded-full blur-sm" />
        </FloatingElement>
        <FloatingElement delay={4} duration={5}>
          <StarIcon className="absolute bottom-1/4 left-1/4 w-8 h-8 text-yellow-400/30" />
        </FloatingElement>
        <FloatingElement delay={1} duration={7}>
          <SparklesIcon className="absolute top-1/2 right-10 w-6 h-6 text-purple-400/40" />
        </FloatingElement>
        
        {/* Background gradients */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-8 mt-10"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <RocketLaunchIcon className="w-5 h-5 text-purple-300" />
            <span className="text-white/90 text-sm font-semibold">
              {t('beta.headerBadge')}
            </span>
          </motion.div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-8 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              {t('beta.title')}
            </span>
          </h2>
          
          <p className="text-lg text-purple-100 mb-4 max-w-2xl mx-auto leading-relaxed">
            {t('beta.subtitle')}
          </p>
          
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative"
        >
          <AnimatePresence mode="wait">
            {submissionState === 'success' ? (
              // Success State
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12"
              >
                {showConfetti && <SuccessConfetti />}
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircleIcon className="w-12 h-12 text-white" />
                </motion.div>
                
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold text-white mb-4"
                >
                  {t('beta.successTitle')}
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-green-200 text-lg mb-6"
                >
                  {t('beta.success')}
                </motion.p>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  onClick={resetForm}
                  className="text-purple-300 hover:text-purple-200 transition-colors duration-300 text-sm"
                >
                  {t('beta.submitAnother')}
                </motion.button>
              </motion.div>
            ) : (
              // Form State
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      icon={EnvelopeIcon}
                      type="email"
                      placeholder={t('beta.emailPlaceholder')}
                      value={formData.email}
                      onChange={updateField('email')}
                      required
                      error={errors.email}
                      label={t('beta.labels.email')}
                      id="beta-email"
                      errorMessage={t('beta.requiredField')}
                    />
                    
                    <FormField
                      icon={UserIcon}
                      placeholder={t('beta.namePlaceholder')}
                      value={formData.name}
                      onChange={updateField('name')}
                      required
                      error={errors.name}
                      label={t('beta.labels.name')}
                      id="beta-name"
                      errorMessage={t('beta.requiredField')}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      icon={BuildingOfficeIcon}
                      placeholder={t('beta.companyPlaceholder')}
                      value={formData.company}
                      onChange={updateField('company')}
                      label={t('beta.labels.company')}
                      id="beta-company"
                    />
                    
                    <FormField
                      icon={DocumentTextIcon}
                      placeholder={t('beta.useCasePlaceholder')}
                      value={formData.useCase}
                      onChange={updateField('useCase')}
                      label={t('beta.labels.useCase')}
                      id="beta-use-case"
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={submissionState === 'loading'}
                    className="group relative w-full md:w-auto mx-auto px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                    whileHover={{ 
                      scale: submissionState === 'loading' ? 1 : 1.05,
                      boxShadow: "0 25px 50px -12px rgba(147, 51, 234, 0.5)"
                    }}
                    whileTap={{ scale: submissionState === 'loading' ? 1 : 0.95 }}
                  >
                    {/* Button background animation */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500"
                      initial={{ x: "100%" }}
                      whileHover={{ x: submissionState === 'loading' ? "100%" : "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {submissionState === 'loading' ? (
                        <>
                          <LoadingSpinner />
                          {t('beta.processing')}
                        </>
                      ) : (
                        <>
                          <RocketLaunchIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                          {t('beta.joinBeta')}
                        </>
                      )}
                    </span>
                  </motion.button>

                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
} 