import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import DemoSection from '@/components/DemoSection';
import BetaSection from '@/components/BetaSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <BetaSection />
      <Footer />
    </main>
  );
}
