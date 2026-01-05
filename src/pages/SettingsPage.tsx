import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { translations } from '@/utils/i18n';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { User, Mail, Lock, Send, ExternalLink, Crown, Calendar, AlertTriangle, CheckCircle, Bell, Shield, Camera, Image as ImageIcon, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useLocation } from 'react-router-dom';

type Tab = 'profile' | 'security' | 'subscription' | 'notifications';

export default function SettingsPage() {
  const { user, checkSession, language } = useStore();
  const t = translations[language].settings;
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [loading, setLoading] = useState(false);
  
  // Profile Form State
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    avatar_url: '',
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // Telegram State
  const [subscriptionKey, setSubscriptionKey] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const isChatIdLocked = !!user?.telegram_chat_id;
  const isPremium = user?.subscription_status === 'premium';

  // Initialize data
  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || user.user_metadata?.username || '',
        email: user.email || '',
        avatar_url: user.avatar_url || user.user_metadata?.avatar_url || ''
      });
      setTelegramChatId(user.telegram_chat_id || '');
    }
  }, [user]);

  // Handle URL query params or hash to switch tabs
  useEffect(() => {
    if (location.hash === '#subscription') setActiveTab('subscription');
    else if (location.hash === '#notifications') setActiveTab('notifications');
    else if (location.hash === '#security') setActiveTab('security');
  }, [location]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error: metaError } = await supabase.auth.updateUser({
        data: { 
          username: profileData.username,
          avatar_url: profileData.avatar_url
        }
      });
      if (metaError) throw metaError;

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user?.id,
          username: profileData.username,
          avatar_url: profileData.avatar_url,
          updated_at: new Date().toISOString()
        });
      
      if (profileError) throw profileError;

      setMessage({ type: 'success', text: t.profile.success });
      checkSession();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || t.profile.error });
    } finally {
      setLoading(false);
    }
  };

  const handleActivateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriptionKey) return;
    
    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.rpc('activate_subscription', { key_code: subscriptionKey });
      
      if (error) throw error;
      
      setMessage({ type: 'success', text: t.subscription.success });
      setSubscriptionKey(''); // Clear input
      checkSession(); // Refresh user data
    } catch (error: any) {
      console.error('Activation error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to activate subscription' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: t.security.matchError });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });
      if (error) throw error;

      setMessage({ type: 'success', text: t.security.success });
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTelegram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isChatIdLocked) return;
    
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user?.id,
          telegram_chat_id: telegramChatId,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      checkSession();
      setMessage({ type: 'success', text: t.notifications.saveSuccess });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testTelegram = async () => {
    const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    if (!telegramChatId) {
      setMessage({ type: 'error', text: t.notifications.testError });
      return;
    }
    
    try {
      setLoading(true);
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: '🚀 *Test Message from Flash Signal*\n\nYour alerts are configured correctly!',
          parse_mode: 'Markdown'
        })
      });
      
      if (res.ok) setMessage({ type: 'success', text: t.notifications.testSuccess });
      else setMessage({ type: 'error', text: t.notifications.testError });
    } catch (e) {
      setMessage({ type: 'error', text: t.notifications.testError });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (dateString?: string) => {
    if (!dateString) return 0;
    const expiry = new Date(dateString);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = getDaysRemaining(user?.subscription_expires_at);

  const tabs = [
    { id: 'profile', label: t.tabs.profile, icon: User },
    { id: 'security', label: t.tabs.security, icon: Shield },
    { id: 'subscription', label: t.tabs.subscription, icon: Crown },
    { id: 'notifications', label: t.tabs.notifications, icon: Bell },
  ] as const;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">{t.title}</h1>
        <p className="text-[#787B86] mt-2">{t.subtitle}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 flex-1 min-h-0">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMessage(null);
              }}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium",
                activeTab === tab.id
                  ? "bg-[#2962FF] text-white shadow-lg shadow-blue-900/20"
                  : "text-[#B2B5BE] hover:bg-[#1E222D] hover:text-white"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[#1E222D] rounded-2xl border border-[#2B2B43] overflow-hidden flex flex-col shadow-xl">
          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-8 max-w-3xl mx-auto"
              >
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <>
                    <div className="flex items-center justify-between pb-6 border-b border-[#2B2B43]">
                      <div>
                        <h2 className="text-xl font-bold text-white mb-1">{t.profile.title}</h2>
                        <p className="text-sm text-[#787B86]">{t.profile.subtitle}</p>
                      </div>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-8">
                      {/* Avatar Section */}
                      <div className="flex flex-col sm:flex-row items-center gap-8">
                        <div className="relative group">
                          <div className="w-24 h-24 rounded-full bg-[#2A2E39] border-2 border-[#2B2B43] flex items-center justify-center overflow-hidden">
                            {profileData.avatar_url ? (
                              <img src={profileData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <div className="text-3xl font-bold text-[#2962FF]">
                                {profileData.email?.[0]?.toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        
                        <div className="flex-1 w-full space-y-4">
                          <Input 
                            label={t.profile.avatarUrl} 
                            placeholder="https://example.com/avatar.jpg"
                            value={profileData.avatar_url} 
                            onChange={e => setProfileData({...profileData, avatar_url: e.target.value})}
                            icon={<ImageIcon className="w-4 h-4" />}
                          />
                          <p className="text-xs text-[#787B86]">
                            {t.profile.avatarDesc}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-6">
                        <Input 
                          label={t.profile.username} 
                          value={profileData.username} 
                          onChange={e => setProfileData({...profileData, username: e.target.value})}
                          icon={<User className="w-4 h-4" />}
                        />
                        <Input 
                          label={t.profile.email} 
                          value={profileData.email} 
                          disabled 
                          className="opacity-50 cursor-not-allowed bg-[#131722]"
                          icon={<Mail className="w-4 h-4" />}
                        />
                      </div>
                      
                      <div className="pt-4 flex justify-end">
                        <Button type="submit" isLoading={loading} className="w-full sm:w-auto px-8">
                          {t.profile.save}
                        </Button>
                      </div>
                    </form>
                  </>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <>
                    <div className="pb-6 border-b border-[#2B2B43]">
                      <h2 className="text-xl font-bold text-white mb-1">{t.security.title}</h2>
                      <p className="text-sm text-[#787B86]">{t.security.subtitle}</p>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                      <div className="bg-[#131722]/50 p-4 rounded-lg border border-[#2B2B43]/50 mb-6">
                         <div className="flex items-start gap-3">
                           <Shield className="w-5 h-5 text-[#2962FF] mt-0.5" />
                           <div>
                             <h4 className="text-sm font-medium text-white">{t.security.passwordReq}</h4>
                             <ul className="text-xs text-[#787B86] mt-2 space-y-1 list-disc list-inside">
                               {t.security.reqList.map((req, i) => (
                                 <li key={i}>{req}</li>
                               ))}
                             </ul>
                           </div>
                         </div>
                      </div>

                      <Input 
                        label={t.security.newPassword} 
                        type="password" 
                        placeholder={t.security.newPassword}
                        value={passwordData.newPassword}
                        onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                        icon={<Lock className="w-4 h-4" />}
                      />
                      <Input 
                        label={t.security.confirmPassword} 
                        type="password" 
                        placeholder={t.security.confirmPassword}
                        value={passwordData.confirmPassword}
                        onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        icon={<Lock className="w-4 h-4" />}
                      />
                      
                      <div className="pt-4 flex justify-end">
                        <Button type="submit" isLoading={loading} disabled={!passwordData.newPassword} className="w-full sm:w-auto px-8">
                          {t.security.updatePassword}
                        </Button>
                      </div>
                    </form>
                  </>
                )}

                {/* Subscription Tab */}
                {activeTab === 'subscription' && (
                  <>
                    <div className="pb-6 border-b border-[#2B2B43]">
                      <h2 className="text-xl font-bold text-white mb-1">{t.subscription.title}</h2>
                      <p className="text-sm text-[#787B86]">{t.subscription.subtitle}</p>
                    </div>

                    <div className="space-y-6">
                      {/* Current Plan Card */}
                      <div className={clsx(
                        "relative overflow-hidden rounded-2xl border p-8 transition-all duration-300",
                        isPremium 
                          ? "bg-gradient-to-br from-[#FFD700]/20 via-[#FFA500]/10 to-transparent border-[#FFD700]/50 shadow-[0_0_30px_rgba(255,215,0,0.1)]" 
                          : "bg-[#131722] border-[#2B2B43]"
                      )}>
                        {/* Background Decoration */}
                        {isPremium && (
                          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FFD700]/10 rounded-full blur-3xl pointer-events-none" />
                        )}

                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                           <div className="flex items-start gap-5">
                             <div className={clsx(
                               "w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg",
                               isPremium 
                                 ? "bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-black ring-4 ring-[#FFD700]/20" 
                                 : "bg-[#2A2E39] text-[#B2B5BE]"
                             )}>
                               {isPremium ? <Crown className="w-8 h-8 fill-current" /> : <User className="w-8 h-8" />}
                             </div>
                             
                             <div>
                               <div className="flex items-center gap-3 mb-1">
                                 <h3 className={clsx(
                                   "text-2xl font-bold",
                                   isPremium ? "text-[#FFD700]" : "text-white"
                                 )}>
                                   {isPremium ? t.subscription.premium : t.subscription.free}
                                 </h3>
                                 {isPremium && (
                                   <span className="bg-[#FFD700] text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-[#FFD700]/20 uppercase tracking-wider">
                                     {t.subscription.active}
                                   </span>
                                 )}
                               </div>
                               <p className="text-[#B2B5BE] max-w-md text-base leading-relaxed">
                                 {isPremium 
                                   ? t.subscription.premiumDesc 
                                   : t.subscription.freeDesc}
                               </p>
                             </div>
                           </div>

                           {isPremium && (
                             <div className="flex flex-col items-end gap-2 bg-[#0A0B0E]/50 p-4 rounded-xl border border-[#FFD700]/20 backdrop-blur-sm">
                               <div className="flex items-center gap-2 text-sm text-[#B2B5BE]">
                                 <Calendar className="w-4 h-4 text-[#FFD700]" />
                                 <span>{t.subscription.expiresOn}</span>
                               </div>
                               <div className="text-xl font-mono font-bold text-white">
                                 {formatDate(user?.subscription_expires_at)}
                               </div>
                               <div className="text-xs font-medium text-[#FFD700] bg-[#FFD700]/10 px-2 py-1 rounded">
                                 {daysRemaining} {t.subscription.daysLeft}
                               </div>
                             </div>
                           )}
                        </div>
                      </div>

                      {/* Activation Form */}
                      {!isPremium && (
                        <div className="bg-[#131722] p-8 rounded-2xl border border-[#2B2B43] shadow-lg relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-[#2962FF]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-[#2962FF]/10 transition-colors duration-500" />
                          
                          <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="p-2 bg-[#2962FF]/10 rounded-lg">
                                <Key className="w-6 h-6 text-[#2962FF]" />
                              </div>
                              <h4 className="text-lg font-bold text-white">{t.subscription.activate}</h4>
                            </div>
                            
                            <form onSubmit={handleActivateSubscription} className="flex flex-col sm:flex-row gap-4">
                              <div className="flex-1">
                                <Input 
                                  placeholder={t.subscription.keyPlaceholder} 
                                  value={subscriptionKey}
                                  onChange={e => setSubscriptionKey(e.target.value)}
                                  className="uppercase font-mono text-lg tracking-widest bg-[#0A0B0E] border-[#2B2B43] focus:border-[#2962FF] h-12"
                                />
                              </div>
                              <Button 
                                type="submit" 
                                isLoading={loading} 
                                disabled={!subscriptionKey}
                                className="h-12 px-8 bg-[#2962FF] hover:bg-[#1E4BD9] text-white font-bold shadow-lg shadow-[#2962FF]/20"
                              >
                                {t.subscription.activateBtn}
                              </Button>
                            </form>
                            <p className="text-sm text-[#787B86] mt-4 flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              {t.subscription.keyDesc}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <>
                    <div className="pb-6 border-b border-[#2B2B43]">
                      <h2 className="text-xl font-bold text-white mb-1">{t.notifications.title}</h2>
                      <p className="text-sm text-[#787B86]">{t.notifications.subtitle}</p>
                    </div>

                    <div className="bg-[#131722] p-6 rounded-xl border border-[#2B2B43] mb-8 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-6 opacity-5">
                          <Bell className="w-24 h-24 text-white" />
                       </div>
                       <h3 className="font-medium text-white mb-4 relative z-10">{t.notifications.setup}</h3>
                       <ol className="space-y-4 relative z-10">
                         <li className="flex items-start gap-3 text-sm text-[#B2B5BE]">
                           <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2962FF]/20 text-[#2962FF] flex items-center justify-center font-bold text-xs">1</span>
                           <div className="mt-1">
                             {t.notifications.step1} 
                             <a href="https://t.me/RealSignalFlash_Bot" target="_blank" className="text-[#2962FF] hover:underline inline-flex items-center ml-1 font-medium">
                               @RealSignalFlash_Bot <ExternalLink className="w-3 h-3 ml-1"/>
                             </a>
                           </div>
                         </li>
                         <li className="flex items-start gap-3 text-sm text-[#B2B5BE]">
                           <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2962FF]/20 text-[#2962FF] flex items-center justify-center font-bold text-xs">2</span>
                           <div className="mt-1">
                             {t.notifications.step2} <code className="bg-[#0A0B0E] px-1.5 py-0.5 rounded text-white font-mono text-xs">{t.notifications.step2Code}</code> {t.notifications.step2End}
                           </div>
                         </li>
                         <li className="flex items-start gap-3 text-sm text-[#B2B5BE]">
                           <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2962FF]/20 text-[#2962FF] flex items-center justify-center font-bold text-xs">3</span>
                           <div className="mt-1">
                             {t.notifications.step3}
                           </div>
                         </li>
                       </ol>
                    </div>

                    <form onSubmit={handleUpdateTelegram} className="space-y-6">
                      <div className="space-y-4">
                        <Input 
                          label={t.notifications.chatId} 
                          placeholder="123456789"
                          value={telegramChatId}
                          onChange={e => setTelegramChatId(e.target.value)}
                          icon={<Send className="w-4 h-4" />}
                          disabled={isChatIdLocked}
                          className={clsx(isChatIdLocked && "opacity-50 cursor-not-allowed bg-[#131722]")}
                        />
                        {isChatIdLocked && (
                           <div className="flex items-center gap-2 text-xs text-[#FFD700] bg-[#FFD700]/10 p-3 rounded-lg border border-[#FFD700]/20">
                             <Lock className="w-3 h-3" />
                             <span>{t.notifications.locked} {t.notifications.contactSupport}</span>
                           </div>
                        )}
                      </div>

                      <div className="pt-4 flex items-center gap-4">
                        {!isChatIdLocked && (
                          <Button type="submit" isLoading={loading} disabled={!telegramChatId}>
                            {t.notifications.save}
                          </Button>
                        )}
                        <Button type="button" variant="secondary" onClick={testTelegram} disabled={!telegramChatId || loading}>
                          {t.notifications.test}
                        </Button>
                      </div>
                    </form>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Message Toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={clsx(
              "fixed bottom-8 right-8 px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 z-50",
              message.type === 'success' ? "bg-green-500 text-white" : "bg-red-500 text-white"
            )}
          >
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span className="font-medium">{message.text}</span>
            <button onClick={() => setMessage(null)} className="ml-2 opacity-70 hover:opacity-100">×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}