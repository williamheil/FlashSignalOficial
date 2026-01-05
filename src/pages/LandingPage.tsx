import LandingNavbar from '@/components/landing/LandingNavbar';
import Hero from '@/components/landing/Hero';
import DashboardPreview from '@/components/landing/DashboardPreview';
import WhyChoose from '@/components/landing/WhyChoose';
import HowItWorks from '@/components/landing/HowItWorks';
import FinalCTA from '@/components/landing/FinalCTA';
import LandingFooter from '@/components/landing/LandingFooter';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="bg-[#050810] min-h-screen text-white selection:bg-[#2962FF] selection:text-white font-sans overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2962FF] to-[#00C853] origin-left z-[100]"
        style={{ scaleX }}
      />

      <LandingNavbar />
      
      <main>
        <Hero />
        <DashboardPreview />
        <WhyChoose />
        <HowItWorks />
        <FinalCTA />
      </main>

      <LandingFooter />
    </div>
  );
}
