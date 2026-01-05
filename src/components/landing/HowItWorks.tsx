import { motion } from 'framer-motion';
import { translations } from '@/utils/i18n';
import { useStore } from '@/store/useStore';

export default function HowItWorks() {
  const { language } = useStore();
  const t = translations[language].landing;

  return (
    <section id="how-it-works" className="py-24 bg-[#0A0E1A] relative overflow-hidden">
       {/* Background Grid */}
       <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            {t.howItWorks.title}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-[#2962FF]/20 via-[#2962FF] to-[#2962FF]/20 -z-10" />

          {t.howItWorks.steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 rounded-full bg-[#050810] border-4 border-[#131722] flex items-center justify-center mb-6 relative group-hover:border-[#2962FF] transition-colors duration-500">
                <span className="text-3xl font-bold text-[#2962FF]">{step.number}</span>
                <div className="absolute inset-0 rounded-full bg-[#2962FF]/10 scale-0 group-hover:scale-100 transition-transform duration-500" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">
                {step.title}
              </h3>
              <p className="text-gray-400 text-sm max-w-[200px]">
                {step.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
