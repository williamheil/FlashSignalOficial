import { Link } from 'react-router-dom';
import { translations } from '@/utils/i18n';
import { useStore } from '@/store/useStore';
import { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, toggleLanguage } = useStore();
  const t = translations[language].landing;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#050810]/90 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-center gap-2">
              <img 
                src="/logo.png" 
                alt="Flash Signal" 
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.src = "https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/prism-signal-logo.png";
                }} 
              />
              <div className="flex flex-col leading-none">
                <span className="font-bold text-xl text-white tracking-wide">Flash</span>
                <span className="font-bold text-xs text-[#2962FF] tracking-[0.2em] uppercase">Signal</span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {t.header.menu.map((item, index) => (
              <a 
                key={index}
                href={item.href}
                className="text-gray-300 hover:text-white hover:text-[#2962FF] transition-colors text-sm font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Actions (Lang + CTA) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all border border-white/5"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{language === 'en' ? 'EN' : 'PT'}</span>
            </button>

            <Link 
              to="/dashboard"
              className="bg-[#2962FF] hover:bg-[#1E40FF] text-white font-bold py-2.5 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-[#2962FF]/20 hover:shadow-[#2962FF]/40 text-sm"
            >
              {t.header.cta}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 right-0 bg-[#0A0E1A] border-b border-white/5 p-4 flex flex-col gap-4 shadow-2xl"
        >
          {t.header.menu.map((item, index) => (
            <a 
              key={index}
              href={item.href}
              className="text-gray-300 hover:text-white py-2 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          
          <div className="h-px bg-white/10 my-2" />
          
          <button
            onClick={() => {
              toggleLanguage();
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 text-gray-300 hover:text-white py-2"
          >
            <Globe className="w-4 h-4" />
            <span>{language === 'en' ? 'Switch to Portuguese' : 'Mudar para Inglês'}</span>
          </button>

          <Link 
            to="/dashboard"
            className="bg-[#2962FF] text-white font-bold py-3 px-6 rounded-lg text-center"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t.header.cta}
          </Link>
        </motion.div>
      )}
    </nav>
  );
}
