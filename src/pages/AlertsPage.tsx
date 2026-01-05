import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { translations } from '@/utils/i18n';
import { AlarmClock, Plus, Trash2, TrendingUp, TrendingDown, AlertTriangle, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function AlertsPage() {
  const { user, alerts, fetchAlerts, createAlert, deleteAlert, assets, language } = useStore();
  const t = translations[language].alerts;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [newAlert, setNewAlert] = useState({
    symbol: 'BTCUSDT',
    target_price: '',
    condition: 'above',
    description: ''
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!user?.telegram_chat_id) {
        throw new Error('Please configure Telegram Chat ID in Settings first.');
      }

      await createAlert({
        symbol: newAlert.symbol,
        target_price: parseFloat(newAlert.target_price),
        condition: newAlert.condition as 'above' | 'below',
        description: newAlert.description
      });
      
      setNewAlert(prev => ({ ...prev, target_price: '', description: '' }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(t.deleteConfirm)) {
      await deleteAlert(id);
    }
  };

  const isFree = user?.subscription_status === 'free';
  const alertCount = alerts.length;
  const maxAlerts = isFree ? 5 : Infinity;

  return (
    <div className="min-h-screen bg-background-primary p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
             <h1 className="text-3xl font-bold text-white tracking-tight">{t.title}</h1>
             <p className="text-text-secondary mt-2">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-sm font-medium text-white">
                  <span className={clsx(
                    "text-lg font-bold",
                    alertCount >= maxAlerts ? "text-trading-red" : "text-trading-green"
                  )}>{alertCount}</span>
                  <span className="text-text-secondary mx-1">/</span>
                  <span className="text-text-secondary">{isFree ? 5 : '∞'} {t.active}</span>
                </p>
                {isFree && alertCount >= 5 && (
                  <p className="text-xs text-trading-red mt-1">{t.limitReached}</p>
                )}
             </div>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-trading-red/10 border border-trading-red/20 text-trading-red p-4 rounded-xl flex items-center gap-3"
          >
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">{error}</span>
          </motion.div>
        )}

        {/* Create Alert Card */}
        <div className="bg-background-secondary border border-border-primary rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-trading-blue/5 rounded-bl-full pointer-events-none" />
          
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-trading-blue/10 flex items-center justify-center">
              <Plus className="w-5 h-5 text-trading-blue" />
            </div>
            {t.create}
          </h2>

          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end relative z-10">
            <div className="md:col-span-3 space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t.asset}</label>
              <div className="relative">
                <select 
                  className="w-full bg-background-tertiary border border-border-primary rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-trading-blue focus:ring-1 focus:ring-trading-blue transition-all appearance-none cursor-pointer hover:border-text-secondary/30"
                  value={newAlert.symbol}
                  onChange={e => setNewAlert({...newAlert, symbol: e.target.value})}
                >
                  {assets.map(a => (
                    <option key={a.symbol} value={a.symbol}>{a.symbol}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
                  <Search className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t.condition}</label>
              <div className="relative">
                <select 
                  className="w-full bg-background-tertiary border border-border-primary rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-trading-blue focus:ring-1 focus:ring-trading-blue transition-all appearance-none cursor-pointer hover:border-text-secondary/30"
                  value={newAlert.condition}
                  onChange={e => setNewAlert({...newAlert, condition: e.target.value})}
                >
                  <option value="above">{t.priceAbove}</option>
                  <option value="below">{t.priceBelow}</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
                  {newAlert.condition === 'above' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                </div>
              </div>
            </div>

            <div className="md:col-span-4 space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t.targetPrice}</label>
              <Input 
                type="number" 
                step="any"
                placeholder="e.g. 65000"
                value={newAlert.target_price}
                onChange={e => setNewAlert({...newAlert, target_price: e.target.value})}
                required
                className="bg-background-tertiary border-border-primary h-[46px] rounded-xl focus:border-trading-blue"
              />
            </div>

            <div className="md:col-span-2">
              <Button 
                type="submit" 
                className="w-full h-[46px] bg-trading-blue hover:bg-trading-blue/90 text-white font-bold rounded-xl shadow-lg shadow-trading-blue/20 transition-all"
                isLoading={loading} 
                disabled={isFree && alertCount >= 5}
              >
                {t.createButton}
              </Button>
            </div>
          </form>
        </div>

        {/* Active Alerts List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <AlarmClock className="w-5 h-5 text-trading-green" /> {t.active}
          </h2>
          
          {alerts.length === 0 ? (
            <div className="text-center py-16 text-text-secondary bg-background-secondary rounded-2xl border border-border-primary border-dashed">
              <div className="w-16 h-16 bg-background-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
                <AlarmClock className="w-8 h-8 text-text-muted" />
              </div>
              <p className="font-medium">{t.noActive}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence>
                {alerts.map(alert => (
                  <motion.div 
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-background-secondary p-5 rounded-xl border border-border-primary flex justify-between items-center group hover:border-trading-blue/50 transition-all hover:shadow-lg hover:shadow-black/20"
                  >
                    <div className="flex items-center gap-5">
                      <div className={clsx(
                        "w-12 h-12 rounded-xl flex items-center justify-center border",
                        alert.condition === 'above' 
                          ? "bg-trading-green/10 text-trading-green border-trading-green/20" 
                          : "bg-trading-red/10 text-trading-red border-trading-red/20"
                      )}>
                        {alert.condition === 'above' ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-white text-lg">{alert.symbol}</span>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-background-tertiary text-text-secondary border border-border-primary">
                            {alert.condition === 'above' ? t.crossesAbove : t.crossesBelow}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-text-secondary">{t.target}:</span>
                          <span className="font-mono font-bold text-white text-lg">${alert.target_price.toLocaleString()}</span>
                        </div>
                        {alert.description && (
                          <p className="text-xs text-text-secondary mt-1 italic border-l-2 border-border-primary pl-2">{alert.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleDelete(alert.id)}
                      className="p-3 text-text-secondary hover:text-trading-red hover:bg-trading-red/10 rounded-xl transition-colors border border-transparent hover:border-trading-red/20"
                      title="Delete Alert"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}