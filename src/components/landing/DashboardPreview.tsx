import { motion } from 'framer-motion';
import { translations } from '@/utils/i18n';
import { useStore } from '@/store/useStore';
import { Activity, BarChart2, Bell, TrendingUp, Wallet, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function DashboardPreview() {
  const { language } = useStore();
  const t = translations[language].landing.dashboardPreview;

  const features = [
    { icon: Activity, ...t.items[0], color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: TrendingUp, ...t.items[1], color: 'text-green-500', bg: 'bg-green-500/10' },
    { icon: BarChart2, ...t.items[2], color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { icon: Bell, ...t.items[3], color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { icon: Wallet, ...t.items[4], color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { icon: Clock, ...t.items[5], color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <section id="features" className="py-24 bg-[#050810] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#2962FF]/50 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#2962FF]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            {t.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400"
          >
            {t.subtitle}
          </motion.p>
        </div>

        {/* Dashboard Mockup / Feature Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Interactive Preview (Simplified UI Mockup) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-[#0A0E1A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-[#2962FF]/10">
              {/* Fake Header */}
              <div className="h-12 border-b border-white/5 bg-[#131722] flex items-center px-4 gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="ml-4 h-6 w-32 bg-white/5 rounded-full" />
              </div>

              {/* Fake Content */}
              <div className="p-6 space-y-4">
                {/* Chart Area */}
                <div className="h-48 bg-gradient-to-b from-[#2962FF]/10 to-transparent rounded-lg border border-[#2962FF]/20 flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 flex items-end justify-around px-4 pb-4 opacity-30">
                      {[40, 60, 45, 70, 50, 80, 65, 85].map((h, i) => (
                        <div key={i} className="w-4 bg-[#2962FF]" style={{ height: `${h}%` }} />
                      ))}
                   </div>
                   <span className="text-[#2962FF] font-mono text-sm relative z-10 bg-[#0A0E1A]/80 px-3 py-1 rounded-full border border-[#2962FF]/30">
                     AI Analysis Active
                   </span>
                </div>

                {/* Signal Rows */}
                <div className="space-y-3">
                  {[
                    { pair: 'BTC/USDT', type: 'LONG', price: '45,230.50', pnl: '+12.5%' },
                    { pair: 'ETH/USDT', type: 'SHORT', price: '2,840.10', pnl: '+8.2%' },
                    { pair: 'SOL/USDT', type: 'LONG', price: '120.45', pnl: '+5.7%' },
                  ].map((trade, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-8 rounded-full ${trade.type === 'LONG' ? 'bg-[#00C853]' : 'bg-red-500'}`} />
                        <div>
                          <div className="text-white font-bold">{trade.pair}</div>
                          <div className={`text-xs font-bold ${trade.type === 'LONG' ? 'text-[#00C853]' : 'text-red-500'}`}>
                            {trade.type}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-mono">{trade.price}</div>
                        <div className="text-[#00C853] text-sm">{trade.pnl}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 bg-[#131722] border border-[#00C853]/30 p-4 rounded-xl shadow-xl z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00C853]/20 flex items-center justify-center">
                  <ArrowUpRight className="text-[#00C853]" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Signal Strength</div>
                  <div className="text-[#00C853] font-bold text-lg">98.5%</div>
                </div>
              </div>
            </motion.div>

             <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-6 -left-6 bg-[#131722] border border-red-500/30 p-4 rounded-xl shadow-xl z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <ArrowDownRight className="text-red-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Risk Level</div>
                  <div className="text-red-500 font-bold text-lg">Low</div>
                </div>
              </div>
            </motion.div>

          </motion.div>

          {/* Right: Features List */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-[#0A0E1A] border border-white/5 hover:border-[#2962FF]/30 hover:bg-[#131722] transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
