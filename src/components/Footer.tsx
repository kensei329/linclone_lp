'use client';

import { useClientTranslation } from '@/hooks/useClientTranslation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HeartIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'], weight: '700' });

// Floating heart animation component
const FloatingHeart = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    animate={{
      y: [-5, -15, -5],
      rotate: [-5, 5, -5],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  >
    <HeartIcon className="w-4 h-4 text-pink-400/60" />
  </motion.div>
);

export default function Footer() {
  const { t } = useClientTranslation();

  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Demo", href: "#demo-section" },
        { name: "Pricing", href: "#pricing" },
        { name: "API", href: "#api" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Blog", href: "/blog" },
        { name: "Careers", href: "/careers" },
        { name: "Contact", href: "/contact" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "/docs" },
        { name: "Help Center", href: "/help" },
        { name: "Community", href: "/community" },
        { name: "Status", href: "/status" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: t('footer.privacyPolicy'), href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "GDPR", href: "/gdpr" }
      ]
    }
  ];

  const socialLinks = [
    {
      name: "Twitter",
      href: "https://twitter.com/linclone",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      )
    },
    {
      name: "Discord",
      href: "https://discord.gg/linclone",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z" />
        </svg>
      )
    },
    {
      name: "GitHub",
      href: "https://github.com/linclone",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      )
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/linclone",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating hearts */}
        <div className="absolute top-10 left-10">
          <FloatingHeart delay={0} />
        </div>
        <div className="absolute top-20 right-20">
          <FloatingHeart delay={1} />
        </div>
        <div className="absolute bottom-20 left-1/4">
          <FloatingHeart delay={2} />
        </div>
        
        {/* Background shapes */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        
        {/* Sparkles */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-1/4 right-1/4"
        >
          <SparklesIcon className="w-6 h-6 text-purple-400/30" />
        </motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Logo */}
              <motion.div
                className="flex items-center mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-3 mr-4">
                  <SparklesIcon className="w-8 h-8 text-white" />
                </div>
                <span className={`${montserrat.className} text-3xl font-bold text-white tracking-widest`}>
                  LinClone
                </span>
              </motion.div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Revolutionizing digital interaction through cutting-edge AI clone technology. 
                Create your digital twin and engage with your audience 24/7.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300"
                                         whileHover={{ 
                       scale: 1.1, 
                       y: -2,
                       boxShadow: "0 10px 20px -5px rgba(147, 51, 234, 0.3)",
                       transition: { type: "spring", stiffness: 300 }
                     }}
                     whileTap={{ scale: 0.95 }}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ 
                       duration: 0.6, 
                       delay: index * 0.1
                     }}
                    viewport={{ once: true }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (sectionIndex + 1) * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                                 {section.links.map((link) => (
                   <motion.li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300 block"
                    >
                      <motion.span
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="inline-block"
                      >
                        {link.name}
                      </motion.span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Download Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="border-t border-gray-700 pt-12 mb-12"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Get the LinClone App
            </h3>
            <p className="text-gray-400 mb-6">
              Download our app and start creating your AI clone today
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* App Store Button */}
            <motion.a
              href="https://apps.apple.com/app/linclone"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center px-6 py-3 bg-black/80 backdrop-blur-sm border border-gray-600 text-white rounded-2xl hover:bg-black transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center space-x-4">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs opacity-75">{t('footer.appStore').split(' ')[0]} {t('footer.appStore').split(' ')[1]} {t('footer.appStore').split(' ')[2]}</div>
                  <div className="text-lg font-semibold">{t('footer.appStore').split(' ').slice(3).join(' ')}</div>
                </div>
                <motion.div
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ x: -10 }}
                  whileHover={{ x: 0 }}
                >
                  →
                </motion.div>
              </div>
            </motion.a>

            {/* Google Play Button */}
            <motion.a
              href="https://play.google.com/store/apps/details?id=com.linclone.app"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center px-6 py-3 bg-black/80 backdrop-blur-sm border border-gray-600 text-white rounded-2xl hover:bg-black transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center space-x-4">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs opacity-75">{t('footer.playStore').split(' ')[0]} {t('footer.playStore').split(' ')[1]} {t('footer.playStore').split(' ')[2]}</div>
                  <div className="text-lg font-semibold">{t('footer.playStore').split(' ').slice(3).join(' ')}</div>
                </div>
                <motion.div
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ x: -10 }}
                  whileHover={{ x: 0 }}
                >
                  →
                </motion.div>
              </div>
            </motion.a>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            {t('footer.copyright')}
          </p>
          
          <motion.div
            className="flex items-center space-x-2 text-gray-400 text-sm"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span>Made with</span>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <HeartIcon className="w-4 h-4 text-red-400" />
            </motion.div>
            <span>by the LinClone team</span>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
} 