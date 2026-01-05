import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { translations } from '@/utils/i18n';

export default function PremiumGate({ children }: { children: React.ReactNode }) {
  const { user, language } = useStore();
  const t = translations[language].premiumGate;
  const navigate = useNavigate();

  if (user?.subscription_status === 'premium') {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-[#131722] rounded-xl border border-[#2B2B43] m-4">
      <div className="w-16 h-16 bg-[#F23645]/10 rounded-full flex items-center justify-center mb-6">
        <Lock className="w-8 h-8 text-[#F23645]" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">{t.title}</h2>
      <p className="text-[#B2B5BE] max-w-md mb-8">
        {t.description}
      </p>
      <div className="flex gap-4">
        <Button 
          variant="secondary" 
          onClick={() => navigate('/settings')}
        >
          {t.viewPlans}
        </Button>
      </div>
    </div>
  );
}
