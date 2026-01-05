import { Asset, ActiveTrade, TradeHistory } from '@/types';
import { Lock, Clock, History, Activity } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import AssetDetailsModal from '@/components/modals/AssetDetailsModal';
import { useStore } from '@/store/useStore';
import { translations } from '@/utils/i18n';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';

interface SignalPanelProps {
  assets: Asset[];
}

export default function SignalPanel({ assets }: SignalPanelProps) {
  const [selectedSignal, setSelectedSignal] = useState<string | null>(null);
  const { language, user } = useStore();
  const t = translations[language].signals;
  const tPage = translations[language].signalsPage; // Use shared translations for some keys
  
  const [activeTab, setActiveTab] = useState<'actives' | 'history'>('actives');
  const [activeTrades, setActiveTrades] = useState<ActiveTrade[]>([]);
  const [historyTrades, setHistoryTrades] = useState<TradeHistory[]>([]);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (user) {
      checkPremiumStatus();
      fetchActiveTrades();
      fetchHistoryTrades();
    }
  }, [user]);

  // Real-time updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('dashboard_signals')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'active_trades' }, () => {
        fetchActiveTrades();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trade_history' }, () => {
        fetchHistoryTrades();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const checkPremiumStatus = async () => {
    if (!user) return;
    const { data } = await supabase.from('profiles').select('subscription_status, premium_until').eq('id', user.id).single();
    if (data) {
      const isPrem = data.subscription_status === 'premium' || 
                    (data.premium_until && new Date(data.premium_until) > new Date());
      setIsPremium(isPrem);
    }
  };

  const fetchActiveTrades = async () => {
    const { data } = await supabase.from('active_trades').select('*').order('entry_time', { ascending: false });
    if (data) setActiveTrades(data);
  };

  const fetchHistoryTrades = async () => {
    const { data } = await supabase.from('trade_history').select('*').order('exit_time', { ascending: false }).limit(20);
    if (data) setHistoryTrades(data);
  };

  return (
    <>
      <div className="flex flex-col h-full bg-background-secondary border-l border-border-primary w-[320px]">
        {/* Header */}
        <div className="p-4 border-b border-border-primary">
          <h2 className="font-bold text-text-primary mb-3">{t.activeTitle}</h2>
          <div className="flex bg-background-tertiary p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('actives')}
              className={clsx(
                "flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5",
                activeTab === 'actives'
                  ? "bg-background-primary text-trading-accent shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              <Activity className="w-3.5 h-3.5" />
              {tPage.tabs.active}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={clsx(
                "flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5",
                activeTab === 'history'
                  ? "bg-background-primary text-trading-accent shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              <History className="w-3.5 h-3.5" />
              {tPage.tabs.history}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-3">
          
          {/* ACTIVES TAB */}
          {activeTab === 'actives' && (
            <>
              {!isPremium ? (
                <div className="p-2">
                  <div className="relative overflow-hidden rounded-xl border border-trading-amber/30 bg-gradient-to-br from-trading-amber/10 to-transparent p-6 text-center">
                    <div className="flex justify-center mb-3">
                      <div className="p-3 rounded-full bg-trading-amber/20">
                        <Lock className="w-6 h-6 text-trading-amber" />
                      </div>
                    </div>
                    <h3 className="font-bold text-trading-amber mb-2">{t.unlockTitle}</h3>
                    <p className="text-xs text-text-secondary mb-4">{t.unlockDesc}</p>
                    <Link to="/settings">
                      <Button size="sm" className="w-full bg-trading-amber hover:bg-amber-600 text-black border-none font-bold">
                        {t.upgrade}
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                activeTrades.length === 0 ? (
                  <div className="text-center py-8 text-text-secondary text-sm">
                    {tPage.empty.active}
                  </div>
                ) : (
                  activeTrades.map((trade, index) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={trade.id} 
                      className="group relative overflow-hidden rounded-xl border border-border-primary bg-background-primary p-4 hover:border-border-accent transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <div className={clsx(
                        "absolute top-0 left-0 w-1 h-full",
                        trade.pnl >= 0 ? "bg-trading-green" : "bg-trading-red"
                      )} />
                      
                      <div className="flex justify-between items-start mb-3 pl-2">
                        <div className="flex items-center gap-2">
                          <span className={clsx(
                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                            trade.side === 'LONG' ? "bg-trading-green/20 text-trading-green" : "bg-trading-red/20 text-trading-red"
                          )}>
                            {trade.side}
                          </span>
                          <span className="font-bold text-sm text-text-primary">{trade.symbol}</span>
                        </div>
                        <span className="text-[10px] text-text-muted flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(trade.entry_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3 pl-2">
                        <div>
                          <p className="text-[10px] text-text-muted uppercase">{t.entry}</p>
                          <p className="text-sm font-mono text-text-primary">
                            {trade.entry_price.toFixed(trade.entry_price < 1 ? 6 : 2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-text-muted uppercase">{t.current}</p>
                          <p className={clsx("text-sm font-mono font-bold", trade.pnl >= 0 ? "text-trading-green" : "text-trading-red")}>
                            {trade.current_price.toFixed(trade.current_price < 1 ? 6 : 2)}
                          </p>
                        </div>
                      </div>

                      <div className="pl-2 mb-3">
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-text-muted">{t.confidence}</span>
                          <span className="text-text-primary font-bold">{trade.score}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-background-tertiary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-trading-green to-trading-blue rounded-full" 
                            style={{ width: `${trade.score}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pl-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full text-xs h-8"
                          onClick={() => setSelectedSignal(trade.symbol)}
                        >
                          {t.details}
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )
              )}
            </>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
             historyTrades.length === 0 ? (
              <div className="text-center py-8 text-text-secondary text-sm">
                {tPage.empty.history}
              </div>
            ) : (
              historyTrades.map((trade, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={trade.id} 
                  className="group relative overflow-hidden rounded-xl border border-border-primary bg-background-primary p-4 hover:border-border-accent transition-all duration-300"
                >
                  <div className={clsx(
                    "absolute top-0 left-0 w-1 h-full",
                    trade.pnl >= 0 ? "bg-trading-green" : "bg-trading-red"
                  )} />
                  
                  <div className="flex justify-between items-start mb-2 pl-2">
                    <div className="flex items-center gap-2">
                      <span className={clsx(
                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                        trade.side === 'LONG' ? "bg-trading-green/20 text-trading-green" : "bg-trading-red/20 text-trading-red"
                      )}>
                        {trade.side}
                      </span>
                      <span className="font-bold text-sm text-text-primary">{trade.symbol}</span>
                    </div>
                    <span className={clsx(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded",
                      (trade.result === 'WIN' || trade.result === 'TAKE_PROFIT') ? "bg-trading-green/10 text-trading-green" : "bg-trading-red/10 text-trading-red"
                    )}>
                      {trade.result === 'WIN' || trade.result === 'TAKE_PROFIT' ? tPage.table.win : tPage.table.loss}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pl-2 mb-1">
                    <div>
                      <p className="text-[10px] text-text-muted uppercase">{t.entry}</p>
                      <p className="text-xs font-mono text-text-primary">
                        {trade.entry_price.toFixed(trade.entry_price < 1 ? 6 : 2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-text-muted uppercase">Exit</p>
                      <p className="text-xs font-mono text-text-primary">
                        {trade.exit_price.toFixed(trade.exit_price < 1 ? 6 : 2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pl-2 mt-2 pt-2 border-t border-border-primary/50">
                     <span className="text-[10px] text-text-muted">
                        {new Date(trade.exit_time).toLocaleDateString()}
                     </span>
                     <span className={clsx("text-xs font-bold font-mono", trade.pnl >= 0 ? "text-trading-green" : "text-trading-red")}>
                        {trade.pnl > 0 ? '+' : ''}{trade.pnl}%
                     </span>
                  </div>
                </motion.div>
              ))
            )
          )}
        </div>
      </div>

      <AssetDetailsModal 
        isOpen={!!selectedSignal} 
        onClose={() => setSelectedSignal(null)} 
        symbol={selectedSignal || ''} 
      />
    </>
  );
}
