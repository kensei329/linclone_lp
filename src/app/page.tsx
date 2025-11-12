import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import CloneProcessSection from '@/components/CloneProcessSection';
import DemoSection from '@/components/DemoSection';
import BetaSection from '@/components/BetaSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <CloneProcessSection />
      <DemoSection />
      <BetaSection />
      <Footer />
    </main>
  );
}
