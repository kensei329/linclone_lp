'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Montserrat } from 'next/font/google';
import { 
  ChevronDownIcon, 
  ChevronUpIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon,
  CogIcon,
  UserIcon,
  CreditCardIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const montserrat = Montserrat({ subsets: ['latin'], weight: '700' });

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'account' | 'billing' | 'technical' | 'privacy';
}

const faqData: FAQItem[] = [
  {
    id: '1',
    category: 'general',
    question: 'What is LinClone?',
    answer: 'LinClone is an innovative AI platform that allows you to create your own AI clone. Your AI clone can engage with your fans 24/7, handle video calls, and help you monetize your content through subscription-based fan interactions.'
  },
  {
    id: '2',
    category: 'general',
    question: 'How does the AI clone creation process work?',
    answer: 'Creating your AI clone is simple: 1) Sign up for early access, 2) Have a video conversation with our AI system to train your clone, 3) Your AI clone learns your speaking patterns, personality, and responses, 4) Start engaging with your fans through your AI clone.'
  },
  {
    id: '3',
    category: 'account',
    question: 'How do I create an account?',
    answer: 'Currently, LinClone is in beta with limited access. You can apply for early access through our website by entering your email address. We\'ll contact you when your access is approved.'
  },
  {
    id: '4',
    category: 'account',
    question: 'Can I delete my account and data?',
    answer: 'Yes, you have full control over your account and data. You can request account deletion at any time, and we will permanently remove all your personal data and AI clone information from our systems within 30 days.'
  },
  {
    id: '5',
    category: 'billing',
    question: 'What are the pricing plans?',
    answer: 'LinClone offers flexible subscription plans for creators. During the beta period, early access users can explore the platform with special pricing. Detailed pricing information will be provided when your access is approved.'
  },
  {
    id: '6',
    category: 'billing',
    question: 'How do I cancel my subscription?',
    answer: 'You can cancel your subscription at any time through your account settings or by contacting our support team. Your AI clone will remain active until the end of your current billing period.'
  },
  {
    id: '7',
    category: 'technical',
    question: 'What devices and platforms are supported?',
    answer: 'LinClone is available on iOS and Android devices. We also provide a web interface for managing your AI clone. The app requires iOS 14.0+ or Android 8.0+ for optimal performance.'
  },
  {
    id: '8',
    category: 'technical',
    question: 'Is my data secure?',
    answer: 'Yes, we take data security very seriously. All conversations and personal data are encrypted both in transit and at rest. We follow industry-standard security practices and comply with international data protection regulations.'
  },
  {
    id: '9',
    category: 'privacy',
    question: 'How is my personal information used?',
    answer: 'Your personal information is used solely to create and improve your AI clone experience. We do not sell your data to third parties. Please review our Privacy Policy for detailed information about data collection and usage.'
  },
  {
    id: '10',
    category: 'privacy',
    question: 'Can I control what my AI clone says?',
    answer: 'Yes, you have full control over your AI clone\'s responses. You can set guidelines, approve responses, and modify your clone\'s behavior through our management dashboard.'
  }
];

const categoryIcons = {
  general: QuestionMarkCircleIcon,
  account: UserIcon,
  billing: CreditCardIcon,
  technical: CogIcon,
  privacy: ShieldCheckIcon
};

const categoryNames = {
  general: 'General Questions',
  account: 'Account Management',
  billing: 'Billing & Subscriptions',
  technical: 'Technical Support',
  privacy: 'Privacy & Security'
};

export default function SupportPage() {
  const [activeCategory, setActiveCategory] = useState<string>('general');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  });

  const filteredFAQs = faqData.filter(faq => faq.category === activeCategory);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
                alert('Thank you for contacting us! We&apos;ll get back to you within 24 hours.');
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: '',
      priority: 'medium'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
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
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={`${montserrat.className} text-5xl md:text-6xl font-bold text-white mb-6`}>
              How can we help you?
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Get support for LinClone, find answers to common questions, or contact our team directly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Contact Cards */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300"
            >
              <EnvelopeIcon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Email Support</h3>
              <p className="text-gray-300 mb-4">Get help via email within 24 hours</p>
              <a 
                href="mailto:support@linclone.com"
                className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
              >
                support@linclone.com
              </a>
            </motion.div>

         
          </div>
               
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className={`${montserrat.className} text-4xl font-bold text-white mb-4`}>
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-300">
              Find quick answers to the most common questions about LinClone
            </p>
          </motion.div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {Object.entries(categoryNames).map(([key, name]) => {
              const IconComponent = categoryIcons[key as keyof typeof categoryIcons];
              return (
                <motion.button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full border transition-all duration-300 ${
                    activeCategory === key
                      ? 'bg-purple-500 border-purple-500 text-white'
                      : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/15'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{name}</span>
                </motion.button>
              );
            })}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="text-white font-semibold">{faq.question}</span>
                  {expandedFAQ === faq.id ? (
                    <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {expandedFAQ === faq.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-6 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className={`${montserrat.className} text-4xl font-bold text-white mb-4`}>
              Still need help?
            </h2>
            <p className="text-xl text-gray-300">
              Send us a message and we&apos;ll get back to you as soon as possible
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleContactSubmit}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-white font-semibold mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-white font-semibold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="subject" className="block text-white font-semibold mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  required
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="What can we help you with?"
                />
              </div>
              <div>
                <label htmlFor="priority" className="block text-white font-semibold mb-2">
                  Priority
                </label>
                <select
                  id="priority"
                  value={contactForm.priority}
                  onChange={(e) => setContactForm({...contactForm, priority: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="low" className="bg-gray-800">Low</option>
                  <option value="medium" className="bg-gray-800">Medium</option>
                  <option value="high" className="bg-gray-800">High</option>
                  <option value="urgent" className="bg-gray-800">Urgent</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-white font-semibold mb-2">
                Message *
              </label>
              <textarea
                id="message"
                required
                rows={6}
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-vertical"
                placeholder="Please describe your issue or question in detail..."
              />
            </div>

            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-4 px-8 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Send Message
            </motion.button>
          </motion.form>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className={`${montserrat.className} text-4xl font-bold text-white mb-4`}>
              Additional Resources
            </h2>
            <p className="text-xl text-gray-300">
              Explore more ways to get help and stay updated
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.a
              href="/privacy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300 group"
            >
              <ShieldCheckIcon className="w-12 h-12 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-white mb-2">Privacy Policy</h3>
              <p className="text-gray-300 text-sm">Learn how we protect your data</p>
            </motion.a>

            <motion.a
              href="/terms"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300 group"
            >
              <ExclamationTriangleIcon className="w-12 h-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-white mb-2">Terms of Service</h3>
              <p className="text-gray-300 text-sm">Read our terms and conditions</p>
            </motion.a>

            <motion.a
              href="https://discord.gg/linclone"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300 group"
            >
              <ChatBubbleLeftRightIcon className="w-12 h-12 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-white mb-2">Community</h3>
              <p className="text-gray-300 text-sm">Join our Discord community</p>
            </motion.a>

            <motion.a
              href="/delete-user"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300 group"
            >
              <UserIcon className="w-12 h-12 text-red-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-white mb-2">Delete Account</h3>
              <p className="text-gray-300 text-sm">Request account deletion</p>
            </motion.a>
          </div>
        </div>
      </section>
    </div>
  );
}
