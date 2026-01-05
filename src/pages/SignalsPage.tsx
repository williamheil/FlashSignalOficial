import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/useStore';
import { TradingOpportunity, ActiveTrade, TradeHistory } from '@/types';
import { Lock, TrendingUp, History, Activity, ArrowUp, ArrowDown, DollarSign, Percent, AlertCircle, Clock, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { translations } from '@/utils/i18n';

export default function SignalsPage() {
  const { user, language } = useStore();
  const t = translations[language].signalsPage;
  const [activeTab, setActiveTab] = useState<'active' | 'opportunities' | 'history'>('active');

  const [opportunities, setOpportunities] = useState<TradingOpportunity[]>([]);
  const [activeTrades, setActiveTrades] = useState<ActiveTrade[]>([]);
  const [history, setHistory] = useState<TradeHistory[]>([]);
  
  const isPremium = user?.subscription_status === 'premium';

  // Fetch initial data
  useEffect(() => {
    fetchHistory();
    if (isPremium) {
      fetchActiveTrades();
      fetchOpportunities();
    }
  }, [isPremium]);

  // Real-time subscriptions
  useEffect(() => {
    if (!isPremium) return;

    const channel = supabase
      .channel('signals_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'active_trades' }, (payload) => {
        fetchActiveTrades();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trading_opportunities' }, (payload) => {
        fetchOpportunities();
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'trade_history' }, (payload) => {
        fetchHistory();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isPremium]);

  // For Free users, poll history every minute
  useEffect(() => {
    if (isPremium) return;
    const interval = setInterval(fetchHistory, 60000);
    return () => clearInterval(interval);
  }, [isPremium]);

  const fetchActiveTrades = async () => {
    const { data } = await supabase.from('active_trades').select('*').order('entry_time', { ascending: false });
    if (data) setActiveTrades(data);
  };

  const fetchOpportunities = async () => {
    const { data } = await supabase.from('trading_opportunities').select('*').order('score', { ascending: false }).limit(10);
    if (data) setOpportunities(data);
  };

  const fetchHistory = async () => {
    const { data } = await supabase.from('trade_history').select('*').order('exit_time', { ascending: false });
    if (data) {
      setHistory(data);
    }
  };

  if (!user) return (
    <div className="flex items-center justify-center min-h-[500px]">
      <div className="text-text-secondary animate-pulse">Loading signals...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background-primary p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{t.title}</h1>
            <p className="text-text-secondary mt-2">{t.subtitle}</p>
          </div>
          
          {/* Stats/Status */}
          <div className="flex items-center gap-4">
            {isPremium ? (
              <div className="flex items-center space-x-2 text-xs font-medium text-trading-green bg-trading-green/10 px-4 py-2 rounded-full border border-trading-green/20">
                <div className="w-2 h-2 rounded-full bg-trading-green animate-pulse" />
                <span>{t.realTimeActive}</span>
              </div>
            ) : (
              <Link to="/settings" className="flex items-center space-x-2 text-xs font-medium text-trading-amber bg-trading-amber/10 px-4 py-2 rounded-full border border-trading-amber/20 hover:bg-trading-amber/20 transition-colors">
                <Lock className="w-3 h-3" />
                <span>{t.upgrade}</span>
              </Link>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-border-primary">
          <div className="flex space-x-8">
            <TabButton active={activeTab === 'active'} onClick={() => setActiveTab('active')} icon={<Activity className="w-4 h-4" />}>
              {t.tabs.active}
              {isPremium && activeTrades.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold bg-trading-blue text-white rounded-full">
                  {activeTrades.length}
                </span>
              )}
            </TabButton>
            <TabButton active={activeTab === 'opportunities'} onClick={() => setActiveTab('opportunities')} icon={<TrendingUp className="w-4 h-4" />}>
              {t.tabs.opportunities}
            </TabButton>
            <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<History className="w-4 h-4" />}>
              {t.tabs.history}
            </TabButton>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="min-h-[400px]">
          {activeTab === 'active' && (
            isPremium ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {activeTrades.map(trade => (
                  <ActiveTradeCard key={trade.id} trade={trade} t={t} />
                ))}
                {activeTrades.length === 0 && <EmptyState message={t.empty.active} />}
              </div>
            ) : (
              <PremiumLock 
                title={t.premium.activeTitle} 
                message={t.premium.activeDesc}
                btnText={t.premium.unlock}
              />
            )
          )}

          {activeTab === 'opportunities' && (
            isPremium ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {opportunities.map(opp => (
                  <OpportunityCard key={opp.id} opportunity={opp} t={t} />
                ))}
                {opportunities.length === 0 && <EmptyState message={t.empty.opportunities} />}
              </div>
            ) : (
              <PremiumLock 
                title={t.premium.oppTitle} 
                message={t.premium.oppDesc}
                btnText={t.premium.unlock}
              />
            )
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              {!isPremium && (
                <div className="bg-background-secondary border border-trading-amber/20 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-trading-amber" />
                    <p className="text-sm text-text-secondary">{t.premium.historyDelay} <span className="text-white font-medium">{t.premium.delayTime}</span>.</p>
                  </div>
                  <Link to="/settings" className="text-sm font-medium text-trading-amber hover:text-white transition-colors">{t.upgrade}</Link>
                </div>
              )}
              
              <div className="bg-background-secondary rounded-xl border border-border-primary overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-background-tertiary border-b border-border-primary">
                        <th className="py-4 pl-6 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">{t.table.time}</th>
                        <th className="py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">{t.table.symbol}</th>
                        <th className="py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">{t.table.side}</th>
                        <th className="py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">{t.table.setup}</th>
                        <th className="py-4 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">{t.table.entry}</th>
                        <th className="py-4 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">{t.table.exit}</th>
                        <th className="py-4 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">{t.table.pnl}</th>
                        <th className="py-4 pr-6 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">{t.table.status}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-primary">
                      {history.map(trade => (
                        <HistoryRow key={trade.id} trade={trade} t={t} />
                      ))}
                    </tbody>
                  </table>
                </div>
                {history.length === 0 && <div className="p-8 text-center text-text-secondary">{t.empty.history}</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-components

function TabButton({ children, active, onClick, icon }: { children: React.ReactNode, active: boolean, onClick: () => void, icon?: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "pb-4 text-sm font-medium transition-all relative flex items-center gap-2",
        active ? "text-white" : "text-text-secondary hover:text-white"
      )}
    >
      {icon}
      {children}
      {active && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-trading-blue rounded-t-full shadow-[0_0_10px_rgba(33,150,243,0.5)]" />}
    </button>
  );
}

function ActiveTradeCard({ trade, t }: { trade: ActiveTrade, t: any }) {
  const isProfit = trade.pnl >= 0;
  return (
    <div className="group bg-background-secondary hover:bg-background-tertiary border border-border-primary hover:border-trading-blue/30 p-6 rounded-xl transition-all duration-300 relative overflow-hidden shadow-lg">
      <div className={clsx(
        "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br rounded-bl-full opacity-10 transition-transform group-hover:scale-110",
        isProfit ? "from-trading-green to-transparent" : "from-trading-red to-transparent"
      )} />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-background-tertiary flex items-center justify-center font-bold text-xs text-text-primary border border-border-primary">
               {trade.symbol.substring(0, 3)}
             </div>
             <div>
               <h3 className="text-lg font-bold text-white flex items-center gap-2">
                 {trade.symbol}
                 <span className={clsx(
                   "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border",
                   trade.side === 'LONG' 
                     ? "bg-trading-green/10 text-trading-green border-trading-green/20" 
                     : "bg-trading-red/10 text-trading-red border-trading-red/20"
                 )}>
                   {trade.side}
                 </span>
               </h3>
               <p className="text-xs text-text-secondary mt-0.5 font-medium">{trade.setup.replace(/_/g, ' ')}</p>
             </div>
          </div>
          <div className="text-right">
            <div className={clsx("text-2xl font-bold tracking-tight", isProfit ? "text-trading-green" : "text-trading-red")}>
              {isProfit ? '+' : ''}{trade.pnl.toFixed(2)}%
            </div>
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{t.cards.currentPnl}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 bg-background-primary/50 rounded-lg border border-border-primary">
          <div>
            <p className="text-text-secondary text-[10px] uppercase font-bold tracking-wider mb-1">{t.cards.entry}</p>
            <p className="text-white font-mono font-medium">${trade.entry_price.toFixed(trade.entry_price < 1 ? 6 : 2)}</p>
          </div>
          <div>
            <p className="text-text-secondary text-[10px] uppercase font-bold tracking-wider mb-1">{t.cards.mark}</p>
            <p className={clsx("font-mono font-medium", trade.current_price > trade.entry_price ? "text-trading-green" : "text-trading-red")}>
              ${trade.current_price.toFixed(trade.current_price < 1 ? 6 : 2)}
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-xs text-text-muted">
           <span>{new Date(trade.entry_time).toLocaleTimeString()}</span>
           <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> {t.cards.live}</span>
        </div>
      </div>
    </div>
  );
}

function OpportunityCard({ opportunity, t }: { opportunity: TradingOpportunity, t: any }) {
  const isLong = opportunity.signal === 'LONG';
  return (
    <div className="group bg-background-secondary hover:bg-background-tertiary border border-border-primary hover:border-trading-blue/30 p-5 rounded-xl transition-all duration-300 relative overflow-hidden shadow-lg">
      <div className={clsx(
        "absolute top-0 right-0 w-24 h-24 bg-gradient-to-br rounded-bl-full opacity-10 transition-transform group-hover:scale-110",
        isLong ? "from-trading-green to-transparent" : "from-trading-red to-transparent"
      )} />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-background-tertiary flex items-center justify-center font-bold text-xs text-text-secondary group-hover:text-white transition-colors border border-border-primary">
              {opportunity.symbol.substring(0, 3)}
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">{opportunity.symbol}</h3>
              <span className={clsx(
                "text-[10px] font-bold uppercase tracking-wider",
                isLong ? "text-trading-green" : "text-trading-red"
              )}>
                {opportunity.signal} Signal
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex flex-col items-end">
               <div className="text-xl font-bold text-trading-blue">{opportunity.score}</div>
               <div className="h-1.5 w-16 bg-background-tertiary rounded-full mt-1 overflow-hidden">
                 <div className="h-full bg-trading-blue rounded-full" style={{ width: `${opportunity.score}%` }} />
               </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3 mt-4 pt-4 border-t border-border-primary">
          <div className="flex justify-between items-center text-xs">
            <span className="text-text-secondary font-medium">{t.cards.strategy}</span>
            <span className="text-white font-bold bg-white/5 px-2 py-1 rounded border border-white/5">{opportunity.setup.split('_').join(' ')}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-text-secondary font-medium">{t.cards.strength}</span>
            <span className="text-white font-medium">{opportunity.strength}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-text-secondary font-medium">{t.cards.volatility}</span>
            <span className="text-white">{opportunity.volatility}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoryRow({ trade, t }: { trade: TradeHistory, t: any }) {
  const isProfit = trade.pnl >= 0;
  return (
    <tr className="hover:bg-background-tertiary/50 transition-colors">
      <td className="py-4 pl-6 text-sm text-text-secondary font-mono">
        {new Date(trade.exit_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </td>
      <td className="py-4 text-sm font-bold text-white">{trade.symbol}</td>
      <td className="py-4 text-sm">
        <span className={clsx(
          "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
          trade.side === 'LONG' ? "bg-trading-green/10 text-trading-green" : "bg-trading-red/10 text-trading-red"
        )}>
          {trade.side}
        </span>
      </td>
      <td className="py-4 text-xs text-text-secondary font-medium">{trade.setup.replace(/_/g, ' ')}</td>
      <td className="py-4 text-sm font-mono text-right text-text-secondary">${trade.entry_price.toFixed(2)}</td>
      <td className="py-4 text-sm font-mono text-right text-text-secondary">${trade.exit_price.toFixed(2)}</td>
      <td className={clsx("py-4 text-sm font-bold text-right", isProfit ? "text-trading-green" : "text-trading-red")}>
        {isProfit ? '+' : ''}{trade.pnl.toFixed(2)}%
      </td>
      <td className="py-4 pr-6 text-right">
        <span className={clsx(
          "text-[10px] px-2 py-1 rounded border uppercase font-bold",
          isProfit ? "border-trading-green/20 text-trading-green" : "border-trading-red/20 text-trading-red"
        )}>
          {isProfit ? t.table.win : t.table.loss}
        </span>
      </td>
    </tr>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-background-secondary rounded-xl border border-border-primary border-dashed">
      <div className="w-16 h-16 bg-background-tertiary rounded-full flex items-center justify-center mb-4">
        <Activity className="w-8 h-8 text-text-muted" />
      </div>
      <p className="text-text-secondary font-medium">{message}</p>
    </div>
  );
}

function PremiumLock({ title, message, btnText }: { title: string, message: string, btnText: string }) {
  return (
    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-background-secondary rounded-xl border border-border-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background-primary/50" />
      <div className="relative z-10 max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-trading-amber/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-trading-amber/20">
          <Lock className="w-8 h-8 text-trading-amber" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-text-secondary mb-8">{message}</p>
        <Link to="/settings">
          <button className="px-8 py-3 bg-trading-blue hover:bg-trading-blue/90 text-white font-bold rounded-lg transition-all shadow-lg shadow-trading-blue/20">
            {btnText}
          </button>
        </Link>
      </div>
    </div>
  );
}
