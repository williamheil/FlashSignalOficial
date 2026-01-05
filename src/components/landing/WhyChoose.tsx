import { motion } from 'framer-motion';
import { translations } from '@/utils/i18n';
import { useStore } from '@/store/useStore';
import { Brain, Zap, Layout, Activity, Users, Search, Clock, Layers, ShieldCheck } from 'lucide-react';

export default function WhyChoose() {
  const { language } = useStore();
  const t = translations[language].landing.whyChoose;

  const icons = [Brain, Zap, Layout, Activity, Users, Search, Clock, Layers, ShieldCheck];

  return (
    <section id="why-choose" className="py-24 bg-[#050810]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            {t.title}
          </motion.h2>
          <p className="text-xl text-gray-400">
            {t.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.items.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#0A0E1A] p-8 rounded-2xl border border-white/5 hover:border-[#2962FF]/50 transition-all hover:shadow-lg hover:shadow-[#2962FF]/10 group"
              >
                <div className="w-14 h-14 rounded-full bg-[#131722] border border-white/10 flex items-center justify-center mb-6 group-hover:bg-[#2962FF] group-hover:border-[#2962FF] transition-colors">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
