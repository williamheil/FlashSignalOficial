import { PortfolioTrade } from '@/types';
import { useStore } from '@/store/useStore';
import { translations } from '@/utils/i18n';
import { Edit2, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { clsx } from 'clsx';
import { format } from 'date-fns';

interface PortfolioTableProps {
  trades: PortfolioTrade[];
  onEdit: (trade: PortfolioTrade) => void;
  onDelete: (id: string) => void;
}

export default function PortfolioTable({ trades, onEdit, onDelete }: PortfolioTableProps) {
  const { language } = useStore();
  const t = translations[language].portfolio.table;

  if (trades.length === 0) {
    return (
      <div className="bg-background-secondary border border-border-primary rounded-xl p-12 text-center">
        <p className="text-text-muted text-lg">{t.empty}</p>
      </div>
    );
  }

  return (
    <div className="bg-background-secondary border border-border-primary rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-background-tertiary border-b border-border-primary">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">{t.date}</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">{t.symbol}</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">{t.type}</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">{t.entry}</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">{t.exit}</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">{t.quantity}</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">{t.resultUsd}</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">{t.resultPct}</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-text-secondary uppercase tracking-wider">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-primary">
            {trades.map((trade) => {
              const isClosed = !!trade.exitPrice;
              const result = isClosed ? (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.type === 'Long' ? 1 : -1) : 0;
              const resultPct = isClosed ? ((trade.exitPrice - trade.entryPrice) / trade.entryPrice) * 100 * (trade.type === 'Long' ? 1 : -1) : 0;
              
              return (
                <tr key={trade.id} className="group hover:bg-background-tertiary/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                    {format(new Date(trade.date), 'MMM dd, yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold text-sm text-white">{trade.symbol}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={clsx(
                      "px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-fit",
                      trade.type === 'Long' ? "bg-trading-green/20 text-trading-green" : "bg-trading-red/20 text-trading-red"
                    )}>
                      {trade.type === 'Long' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {trade.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono text-text-primary">
                    ${trade.entryPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono text-text-secondary">
                    {isClosed ? `$${trade.exitPrice.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono text-text-secondary">
                    {trade.quantity}
                  </td>
                  <td className={clsx(
                    "px-6 py-4 whitespace-nowrap text-sm text-right font-mono font-bold",
                    !isClosed ? "text-text-muted" : result >= 0 ? "text-trading-green" : "text-trading-red"
                  )}>
                    {isClosed ? `${result >= 0 ? '+' : ''}$${result.toFixed(2)}` : '-'}
                  </td>
                  <td className={clsx(
                    "px-6 py-4 whitespace-nowrap text-sm text-right font-mono font-bold",
                    !isClosed ? "text-text-muted" : resultPct >= 0 ? "text-trading-green" : "text-trading-red"
                  )}>
                    {isClosed ? `${resultPct >= 0 ? '+' : ''}${resultPct.toFixed(2)}%` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEdit(trade)}
                        className="p-1.5 text-text-secondary hover:text-trading-blue hover:bg-trading-blue/10 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(trade.id)}
                        className="p-1.5 text-text-secondary hover:text-trading-red hover:bg-trading-red/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
