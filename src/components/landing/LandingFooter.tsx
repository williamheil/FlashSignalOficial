import { translations } from '@/utils/i18n';
import { useStore } from '@/store/useStore';

export default function LandingFooter() {
  const { language } = useStore();
  const t = translations[language].landing;

  return (
    <footer className="bg-black py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="text-gray-500 text-sm">
            {t.footer.copyright}
          </div>
          <div className="text-gray-600 text-xs max-w-2xl">
            <p>{t.footer.disclaimer}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
