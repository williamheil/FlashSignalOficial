import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, BarChart3, Settings, Search, AlarmClock, User, LogOut, Globe, RefreshCw, Palette, Briefcase, ArrowLeftRight } from 'lucide-react';
import { clsx } from 'clsx';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/useStore';
import { translations } from '@/utils/i18n';

interface NavbarProps {
  user?: any;
}

export default function Navbar({ user }: NavbarProps) {
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const { language, setLanguage, theme, toggleTheme } = useStore();
  const t = translations[language].nav;

  useEffect(() => {
    if (theme === 'blue') {
      document.documentElement.classList.add('theme-blue');
    } else {
      document.documentElement.classList.remove('theme-blue');
    }
  }, [theme]);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'pt' : 'en');
  };

  return (
    <nav className="h-16 border-b border-border-primary bg-background-secondary flex items-center px-4 justify-between sticky top-0 z-50">
      {/* Left: Logo & Search */}
      <div className="flex items-center gap-8">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="relative flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="Flash Signal" 
              className="h-8 w-auto object-contain"
              onError={(e) => {
                // Fallback if local image not found
                e.currentTarget.src = "https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/prism-signal-logo.png";
              }} 
            />
            <div className="flex flex-col leading-none">
              <span className="font-bold text-lg text-white tracking-wide">Flash</span>
              <span className="font-bold text-xs text-[#2962FF] tracking-[0.2em] uppercase">Signal</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Center: Navigation */}
      <div className="hidden lg:flex items-center gap-1">
        {[
          { icon: LayoutDashboard, label: t.dashboard, path: '/dashboard' },
          { icon: TrendingUp, label: t.signals, path: '/signals' },
          { icon: ArrowLeftRight, label: 'Arbitrage', path: '/arbitrage' },
          { icon: Briefcase, label: 'Portfolio', path: '/portfolio' },
          { icon: AlarmClock, label: t.alarm, path: '/alerts' },
          { icon: RefreshCw, label: (t as any).p2p, path: '/p2p' },
          { icon: Settings, label: t.settings, path: '/settings' },
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive(item.path) 
                ? "bg-trading-blue/10 text-trading-blue" 
                : "text-text-secondary hover:text-text-primary hover:bg-background-tertiary"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        ))}
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 p-2 text-text-secondary hover:text-text-primary hover:bg-background-tertiary rounded-lg transition-colors"
          title="Switch Language"
        >
          <Globe className="w-4 h-4" />
          <span className="text-xs font-bold uppercase">{language}</span>
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-background-tertiary rounded-lg transition-colors"
            title="Switch Theme"
          >
            <Palette className="w-5 h-5" />
            {theme === 'blue' && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-trading-blue rounded-full border border-background-secondary" />
            )}
          </button>
          
          {showThemeMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-background-secondary border border-border-primary rounded-lg shadow-xl py-1 animate-in fade-in zoom-in-95 duration-200 z-50">
              <button
                onClick={() => {
                  if (theme !== 'default') toggleTheme();
                  setShowThemeMenu(false);
                }}
                className={clsx(
                  "w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-background-tertiary",
                  theme === 'default' ? "text-trading-blue" : "text-text-secondary"
                )}
              >
                <span>Dark Default</span>
                {theme === 'default' && <span className="w-2 h-2 bg-trading-blue rounded-full" />}
              </button>
              <button
                onClick={() => {
                  if (theme !== 'blue') toggleTheme();
                  setShowThemeMenu(false);
                }}
                className={clsx(
                  "w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-background-tertiary",
                  theme === 'blue' ? "text-trading-blue" : "text-text-secondary"
                )}
              >
                <span>Flash Theme</span>
                {theme === 'blue' && <span className="w-2 h-2 bg-trading-blue rounded-full" />}
              </button>
            </div>
          )}
        </div>

        {user ? (
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 pr-3 rounded-full border border-border-primary hover:bg-background-tertiary transition-colors"
            >
              <div className="w-8 h-8 bg-trading-blue rounded-full flex items-center justify-center text-white font-bold text-xs overflow-hidden">
                {user.avatar_url || user.user_metadata?.avatar_url ? (
                  <img src={user.avatar_url || user.user_metadata?.avatar_url} alt="User" className="w-full h-full object-cover" />
                ) : (
                  user.email?.[0].toUpperCase()
                )}
              </div>
              <span className="text-sm font-medium text-text-primary hidden sm:block">
                {user.username || user.user_metadata?.username || 'Trader'}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-background-secondary border border-border-primary rounded-lg shadow-xl py-1 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-2 border-b border-border-primary">
                  <p className="text-sm font-medium text-text-primary">{t.myAccount}</p>
                  <p className="text-xs text-text-secondary truncate">{user.email}</p>
                </div>
                <Link to="/settings" className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background-tertiary">
                  {t.settings}
                </Link>
                <Link to="/settings#subscription" className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background-tertiary">
                  {t.subscription}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-trading-red hover:bg-trading-red/10 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {t.logout}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-text-primary px-3 py-2">
              {t.login}
            </Link>
            <Link to="/register" className="text-sm font-medium bg-trading-green text-black px-4 py-2 rounded-lg hover:bg-green-500 transition-colors shadow-lg shadow-green-900/20">
              {t.signup}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
