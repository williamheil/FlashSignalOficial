import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthLayout from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/useStore';
import { translations } from '@/utils/i18n';

export default function LoginPage() {
  const navigate = useNavigate();
  const { language } = useStore();
  const t = translations[language].auth;
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // For mock/demo purposes, we might want to bypass real auth if supabase is not fully configured with users
      // But let's try real auth first
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;
      
      navigate('/dashboard');
    } catch (err: any) {
      // Fallback for demo if auth fails (optional, remove for prod)
      if (formData.email === 'demo@prism.com' && formData.password === 'demo') {
        navigate('/dashboard');
      } else {
        setError(err.message || t.genericError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title={t.welcomeBack}
      subtitle={t.signInSubtitle}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Input
            type="email"
            label={t.email}
            placeholder={t.emailPlaceholder}
            icon={<Mail className="w-4 h-4" />}
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </motion.div>

        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              label={t.password}
              placeholder={t.passwordPlaceholder}
              icon={<Lock className="w-4 h-4" />}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-text-muted hover:text-text-primary transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-between text-xs"
        >
          <label className="flex items-center gap-2 text-text-secondary cursor-pointer hover:text-white transition-colors">
            <input type="checkbox" className="rounded border-border-accent bg-background-tertiary text-trading-blue focus:ring-trading-blue/20" />
            <span>Remember me</span>
          </label>
          <a href="#" className="text-trading-blue hover:text-trading-blue/80 transition-colors">Forgot password?</a>
        </motion.div>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button 
            type="submit" 
            className="w-full"
            isLoading={isLoading}
          >
            {t.signIn}
          </Button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-sm text-text-secondary mt-6"
        >
          {t.noAccount}{' '}
          <Link to="/register" className="text-trading-green hover:text-trading-green/80 font-medium transition-colors">
            {t.createAccount}
          </Link>
          <div className="mt-4 pt-4 border-t border-border-primary/50">
            <Link to="/" className="text-xs text-text-muted hover:text-white transition-colors">
              {(t as any).backToHome}
            </Link>
          </div>
        </motion.div>
      </form>
    </AuthLayout>
  );
}
