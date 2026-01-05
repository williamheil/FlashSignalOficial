import { clsx } from 'clsx';
import { useStore } from '@/store/useStore';
import { translations } from '@/utils/i18n';

interface PeriodFilterProps {
  activePeriod: 'week' | 'month' | 'semester' | 'all';
  onChange: (period: 'week' | 'month' | 'semester' | 'all') => void;
}

export default function PeriodFilter({ activePeriod, onChange }: PeriodFilterProps) {
  const { language } = useStore();
  const t = translations[language].portfolio.filters;

  const periods = [
    { id: 'week', label: t.week },
    { id: 'month', label: t.month },
    { id: 'semester', label: t.semester },
    { id: 'all', label: t.all },
  ] as const;

  return (
    <div className="flex items-center gap-2 bg-background-secondary p-1 rounded-lg border border-border-primary w-fit mb-6">
      {periods.map((period) => (
        <button
          key={period.id}
          onClick={() => onChange(period.id)}
          className={clsx(
            "px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
            activePeriod === period.id
              ? "bg-trading-blue text-white shadow-sm"
              : "text-text-secondary hover:text-text-primary hover:bg-background-tertiary"
          )}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
