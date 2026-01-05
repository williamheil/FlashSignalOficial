import { PortfolioTrade } from '@/types';
import { useStore } from '@/store/useStore';
import { translations } from '@/utils/i18n';
import { DollarSign, TrendingUp, Activity, CheckCircle, XCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface PerformanceCardsProps {
  trades: PortfolioTrade[];
}

export default function PerformanceCards({ trades }: PerformanceCardsProps) {
  const { language } = useStore();
  const t = translations[language].portfolio.stats;

  const calculateStats = () => {
    let totalProfit = 0;
    let totalInvested = 0;
    let positiveTrades = 0;
    let negativeTrades = 0;

    trades.forEach(trade => {
      if (!trade.exitPrice) return; // Skip open trades for PnL
      
      const profit = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.type === 'Long' ? 1 : -1);
      totalProfit += profit;
      totalInvested += trade.entryPrice * trade.quantity;

      if (profit > 0) positiveTrades++;
      else if (profit < 0) negativeTrades++;
    });

    const totalRoi = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

    return {
      totalProfit,
      totalRoi,
      totalTrades: trades.length,
      positiveTrades,
      negativeTrades
    };
  };

  const stats = calculateStats();

  const cards = [
    {
      label: t.totalProfit,
      value: stats.totalProfit >= 0 
        ? `$${stats.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : `-$${Math.abs(stats.totalProfit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: stats.totalProfit >= 0 ? 'text-trading-green' : 'text-trading-red',
      bg: stats.totalProfit >= 0 ? 'bg-trading-green/10' : 'bg-trading-red/10',
      border: stats.totalProfit >= 0 ? 'border-trading-green/20' : 'border-trading-red/20',
    },
    {
      label: t.totalRoi,
      value: `${stats.totalRoi >= 0 ? '+' : ''}${stats.totalRoi.toFixed(2)}%`,
      icon: TrendingUp,
      color: stats.totalRoi >= 0 ? 'text-trading-green' : 'text-trading-red',
      bg: stats.totalRoi >= 0 ? 'bg-trading-green/10' : 'bg-trading-red/10',
      border: stats.totalRoi >= 0 ? 'border-trading-green/20' : 'border-trading-red/20',
    },
    {
      label: t.totalTrades,
      value: stats.totalTrades,
      icon: Activity,
      color: 'text-trading-blue',
      bg: 'bg-trading-blue/10',
      border: 'border-trading-blue/20',
    },
    {
      label: t.positiveTrades,
      value: stats.positiveTrades,
      icon: CheckCircle,
      color: 'text-trading-green',
      bg: 'bg-trading-green/10',
      border: 'border-trading-green/20',
    },
    {
      label: t.negativeTrades,
      value: stats.negativeTrades,
      icon: XCircle,
      color: 'text-trading-red',
      bg: 'bg-trading-red/10',
      border: 'border-trading-red/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className={clsx(
            "p-4 rounded-xl border bg-background-secondary flex flex-col justify-between hover:shadow-lg transition-all duration-300",
            card.border
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary font-medium">{card.label}</span>
            <div className={clsx("p-2 rounded-lg", card.bg)}>
              <card.icon className={clsx("w-4 h-4", card.color)} />
            </div>
          </div>
          <div className={clsx("text-xl font-bold", card.color)}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}
