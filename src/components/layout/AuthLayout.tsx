import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background-primary">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-trading-green/5 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-trading-blue/5 blur-[120px] animate-pulse-slow delay-1000" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10 px-4"
      >
        <div className="glass-card rounded-2xl p-8 shadow-2xl border border-border-accent">
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 mb-2"
            >
              <img 
                src="/logo.png" 
                alt="Flash Signal" 
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden w-10 h-10 bg-gradient-to-tr from-trading-green to-trading-blue rounded-lg rotate-45 flex-shrink-0" />
              <h1 className="text-2xl font-bold font-mono tracking-tight flex items-baseline gap-2">
                <span className="text-white text-3xl">Flash</span>
                <span className="text-trading-blue text-lg">SIGNAL</span>
              </h1>
            </motion.div>
            <h2 className="text-xl font-semibold text-white mt-4">{title}</h2>
            <p className="text-text-secondary text-sm mt-2">{subtitle}</p>
          </div>
          
          {children}
        </div>
      </motion.div>
    </div>
  );
}
