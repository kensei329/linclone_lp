"use client";

import { motion } from "framer-motion";
import { PlayIcon, SparklesIcon } from "@heroicons/react/24/solid";
import LanguageToggle from "./LanguageToggle";
import { useClientTranslation } from "@/hooks/useClientTranslation";
import { Montserrat } from "next/font/google";
import { useState, useEffect } from "react";

const montserrat = Montserrat({ subsets: ["latin"], weight: "700" });

// Floating particles component
const FloatingParticles = () => {
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; delay: number }>
  >([]);

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
const InteractiveOrb = ({
  className,
  delay = 0,
}: {
  className: string;
  delay?: number;
}) => {
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
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
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
          <motion.div
            className=" rounded-2xl px-4 py-2  flex items-center gap-1 sm:gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-3 mr-4">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <span
              className={`${montserrat.className} text-2xl sm:text-3xl font-bold text-white tracking-widest`}
            >
              LinClone
            </span>
          </motion.div>

          {/* Language Toggle with glassmorphism */}
          <motion.div
            className="rounded-2xl p-2 "
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
            {t('hero.betaBadge')}
          </span>
          <SparklesIcon className="w-5 h-5 text-yellow-300" />
        </motion.div>

        {/* Title with enhanced animations */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-4xl sm:text-6xl md:text-6xl font-bold text-white mb-8 leading-tight tracking-tight"
          style={{ whiteSpace: "pre-line" }}
        >
          <motion.span
            className="inline-block bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{ backgroundSize: "200% 200%" }}
          >
            {t("hero.title")}
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-2xl text-gray-200 mb-12 leading-relaxed max-w-3xl mx-auto"
          style={{ whiteSpace: "pre-line" }}
        >
          {t("hero.subtitle")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-5 items-center justify-center mb-16"
        >
          {/* Primary CTA */}
          <motion.button
            className="group relative flex items-center gap-3 px-8 py-4 bg-white text-purple-700 font-semibold rounded-3xl shadow-2xl hover:shadow-[0_20px_40px_-12px_rgba(168,85,247,0.5)] transition-all duration-300"
            whileHover={{ translateY: -4 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              const el = document.getElementById("beta-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <motion.span
              className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg"
              whileHover={{ rotate: 10 }}
            >
              <SparklesIcon className="w-5 h-5" />
            </motion.span>
            <span className="whitespace-nowrap">{t("hero.getStarted")}</span>
          </motion.button>

          {/* Secondary CTA */}
          <motion.button
            className="group flex items-center gap-3 px-8 py-4 bg-white/15 backdrop-blur-xl border border-white/30 text-white font-semibold rounded-3xl hover:bg-white/25 transition-all duration-300"
            whileHover={{ translateY: -4 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              const el = document.getElementById("demo-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <motion.span
              className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white/20 text-white"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <PlayIcon className="w-6 h-6" />
            </motion.span>
            <span className="whitespace-nowrap">{t("hero.tryDemo")}</span>
          </motion.button>
        </motion.div>
      </div>

      {isVideoOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
            <button
              aria-label="Close video"
              className="absolute -top-10 right-0 text-white/80 hover:text-white"
              onClick={() => setIsVideoOpen(false)}
            >
              ✕
            </button>
            <iframe
              className="w-full h-full"
              src={t("demo.videoUrl")}
              title="LinClone Demo Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
