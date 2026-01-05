import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Info } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { translations } from '@/utils/i18n';
import ParticleBackground from './ParticleBackground';

export default function Hero() {
  const { language } = useStore();
  const t = translations[language].landing.hero;

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#050810]">
      <ParticleBackground />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050810]/50 to-[#050810] z-10 pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 mix-blend-overlay" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-0" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2962FF]/10 border border-[#2962FF]/20 text-[#2962FF] text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2962FF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2962FF]"></span>
              </span>
              AI-Powered Trading Intelligence
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
              {t.title}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2962FF] via-[#00C853] to-[#2962FF] bg-300% animate-gradient">
                {language === 'en' ? 'Smarter Crypto' : 'Cripto Inteligente'}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              {t.desc}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link 
                to="/dashboard"
                className="group flex items-center justify-center gap-3 bg-[#2962FF] hover:bg-[#1E40FF] text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-[#2962FF]/20 hover:shadow-[#2962FF]/40 transition-all duration-300 transform hover:scale-105 text-lg"
              >
                {t.startNow}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <a 
                href="#features"
                className="flex items-center justify-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 text-white font-semibold py-4 px-10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-lg"
              >
                <Info className="w-5 h-5" />
                {t.meetFlash}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
