import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import PortfolioHeader from '@/components/portfolio/PortfolioHeader';
import PerformanceCards from '@/components/portfolio/PerformanceCards';
import PortfolioTable from '@/components/portfolio/PortfolioTable';
import PeriodFilter from '@/components/portfolio/PeriodFilter';
import TradeModal from '@/components/portfolio/TradeModal';
import { PortfolioTrade } from '@/types';
import { isWithinInterval, subWeeks, subMonths, startOfDay } from 'date-fns';

export default function PortfolioPage() {
  const { portfolioTrades, fetchPortfolioTrades, addPortfolioTrade, updatePortfolioTrade, deletePortfolioTrade } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<PortfolioTrade | null>(null);
  const [activePeriod, setActivePeriod] = useState<'week' | 'month' | 'semester' | 'all'>('all');

  useEffect(() => {
    fetchPortfolioTrades();
  }, []);

  const getFilteredTrades = () => {
    const now = new Date();
    return portfolioTrades.filter(trade => {
      const tradeDate = new Date(trade.date);
      
      switch (activePeriod) {
        case 'week':
          return isWithinInterval(tradeDate, { start: subWeeks(now, 1), end: now });
        case 'month':
          return isWithinInterval(tradeDate, { start: subMonths(now, 1), end: now });
        case 'semester':
          return isWithinInterval(tradeDate, { start: subMonths(now, 6), end: now });
        default:
          return true;
      }
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const filteredTrades = getFilteredTrades();

  const handleSaveTrade = (trade: PortfolioTrade) => {
    if (editingTrade) {
      updatePortfolioTrade(trade);
    } else {
      addPortfolioTrade(trade);
    }
    setEditingTrade(null);
  };

  const handleEditTrade = (trade: PortfolioTrade) => {
    setEditingTrade(trade);
    setIsModalOpen(true);
  };

  const handleAddTrade = () => {
    setEditingTrade(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <PortfolioHeader onAddTrade={handleAddTrade} trades={filteredTrades} />
      
      <PerformanceCards trades={filteredTrades} />
      
      <div className="space-y-4">
        <PeriodFilter activePeriod={activePeriod} onChange={setActivePeriod} />
        <PortfolioTable 
          trades={filteredTrades} 
          onEdit={handleEditTrade} 
          onDelete={deletePortfolioTrade} 
        />
      </div>

      <TradeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveTrade}
        initialData={editingTrade}
      />
    </div>
  );
}
