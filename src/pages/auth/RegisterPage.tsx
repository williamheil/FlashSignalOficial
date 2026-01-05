import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/useStore';
import { translations } from '@/utils/i18n';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { language } = useStore();
  const t = translations[language].auth;

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError(t.passMatchError);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            // access_key requirement removed
          }
        }
      });

      if (error) throw error;
      
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error("Registration error:", err);
      // Supabase Auth generic error for trigger exceptions
      if (err.message?.includes("Database error saving new user") || err.status === 500) {
        setError(t.genericError);
      } else {
        setError(err.message || t.genericError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title={t.createAccount}
      subtitle={t.joinSubtitle}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Input
            type="text"
            label={t.username}
            placeholder={t.usernamePlaceholder}
            icon={<User className="w-4 h-4" />}
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
        </motion.div>

        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
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
          transition={{ delay: 0.5 }}
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
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Input
            type="password"
            label={t.confirmPassword}
            placeholder={t.confirmPlaceholder}
            icon={<Lock className="w-4 h-4" />}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            required
          />
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
          transition={{ delay: 0.7 }}
        >
          <Button 
            type="submit" 
            className="w-full"
            isLoading={isLoading}
          >
            {t.signUp}
          </Button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-sm text-text-secondary mt-6"
        >
          {t.hasAccount}{' '}
          <Link to="/login" className="text-trading-green hover:text-trading-green/80 font-medium transition-colors">
            {t.signIn}
          </Link>
          <div className="mt-4 pt-4 border-t border-border-primary/50">
            <Link to="/" className="text-xs text-text-muted hover:text-white transition-colors">
              {(t as any).backToHome}
            </Link>
          </div>
        </motion.div>
      </form>

      <AnimatePresence>
        {showSuccessModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"
            >
              <div className="bg-[#1E222D] border border-[#2B2B43] rounded-2xl w-full max-w-sm p-8 shadow-2xl pointer-events-auto text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6 ring-4 ring-green-500/5">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">
                    {(t as any).successModal?.title || 'Registration Successful!'}
                  </h3>
                  
                  <p className="text-[#B2B5BE] mb-2">
                    {(t as any).successModal?.message || 'Your account has been created successfully.'}
                  </p>
                  
                  <p className="text-sm text-green-400 font-medium mb-8 bg-green-400/10 px-3 py-1.5 rounded-lg border border-green-400/20">
                    {(t as any).successModal?.action || 'Please confirm your email address to continue.'}
                  </p>
                  
                  <Button 
                    onClick={() => navigate('/login')}
                    className="w-full bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20"
                  >
                    {(t as any).successModal?.button || 'Go to Login'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}
