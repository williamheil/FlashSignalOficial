import { motion } from 'framer-motion';
import { translations } from '@/utils/i18n';
import { useStore } from '@/store/useStore';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  const { language } = useStore();
  const t = translations[language].landing;

  return (
    <section className="py-32 relative overflow-hidden bg-[#2962FF]">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#000000]/40 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {t.finalCta.title}
          </h2>
          
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto">
            {t.finalCta.subtitle}
          </p>

          <Link 
            to="/dashboard"
            className="inline-flex items-center justify-center gap-3 bg-white text-[#2962FF] font-bold py-5 px-12 rounded-full shadow-2xl hover:shadow-white/20 transition-all duration-300 transform hover:scale-105 text-lg md:text-xl"
          >
            {t.finalCta.cta}
            <ArrowRight className="w-6 h-6" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
