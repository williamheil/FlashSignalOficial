import { useState, useEffect } from 'react';
import { PortfolioTrade } from '@/types';
import { useStore } from '@/store/useStore';
import { translations } from '@/utils/i18n';
import { X, Save, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trade: PortfolioTrade) => void;
  initialData?: PortfolioTrade | null;
}

export default function TradeModal({ isOpen, onClose, onSave, initialData }: TradeModalProps) {
  const { language } = useStore();
  const t = translations[language].portfolio.modal;

  const [formData, setFormData] = useState<Partial<PortfolioTrade>>({
    symbol: '',
    type: 'Long',
    entryPrice: 0,
    exitPrice: 0,
    quantity: 0,
    date: new Date().toISOString().slice(0, 16), // datetime-local format
  });

  const [preview, setPreview] = useState({ profit: 0, roi: 0 });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date: new Date(initialData.date).toISOString().slice(0, 16)
      });
    } else {
      setFormData({
        symbol: '',
        type: 'Long',
        entryPrice: 0,
        exitPrice: 0,
        quantity: 0,
        date: new Date().toISOString().slice(0, 16),
      });
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    if (formData.entryPrice && formData.exitPrice && formData.quantity) {
      const entry = Number(formData.entryPrice);
      const exit = Number(formData.exitPrice);
      const qty = Number(formData.quantity);
      
      const profit = (exit - entry) * qty * (formData.type === 'Long' ? 1 : -1);
      const roi = ((exit - entry) / entry) * 100 * (formData.type === 'Long' ? 1 : -1);
      
      setPreview({ profit, roi });
    } else {
      setPreview({ profit: 0, roi: 0 });
    }
  }, [formData.entryPrice, formData.exitPrice, formData.quantity, formData.type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.symbol || !formData.entryPrice || !formData.quantity || !formData.date) return;

    onSave({
      id: initialData?.id || crypto.randomUUID(),
      symbol: formData.symbol.toUpperCase(),
      type: formData.type as 'Long' | 'Short',
      entryPrice: Number(formData.entryPrice),
      exitPrice: Number(formData.exitPrice) || 0,
      quantity: Number(formData.quantity),
      date: new Date(formData.date).toISOString(),
      notes: formData.notes
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"
          >
            <div className="bg-background-secondary border border-border-primary rounded-2xl w-full max-w-lg shadow-2xl pointer-events-auto overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-border-primary">
                <h2 className="text-xl font-bold text-white">
                  {initialData ? t.editTitle : t.title}
                </h2>
                <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">{t.symbol}</label>
                    <input
                      type="text"
                      value={formData.symbol}
                      onChange={e => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                      className="w-full bg-background-primary border border-border-primary rounded-lg px-3 py-2 text-white placeholder:text-text-muted focus:outline-none focus:border-trading-blue uppercase"
                      placeholder="BTCUSDT"
                      required
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">{t.type}</label>
                    <div className="flex bg-background-primary p-1 rounded-lg border border-border-primary">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'Long' })}
                        className={clsx(
                          "flex-1 py-1.5 rounded-md text-sm font-medium transition-colors",
                          formData.type === 'Long' ? "bg-trading-green text-white" : "text-text-secondary hover:text-white"
                        )}
                      >
                        {t.long}
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'Short' })}
                        className={clsx(
                          "flex-1 py-1.5 rounded-md text-sm font-medium transition-colors",
                          formData.type === 'Short' ? "bg-trading-red text-white" : "text-text-secondary hover:text-white"
                        )}
                      >
                        {t.short}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={t.entry}
                    type="number"
                    step="any"
                    value={formData.entryPrice}
                    onChange={e => setFormData({ ...formData, entryPrice: parseFloat(e.target.value) || 0 })}
                    required
                  />
                  <Input
                    label={t.exit}
                    type="number"
                    step="any"
                    value={formData.exitPrice}
                    onChange={e => setFormData({ ...formData, exitPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={t.quantity}
                    type="number"
                    step="any"
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">{t.date}</label>
                    <input
                      type="datetime-local"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-background-primary border border-border-primary rounded-lg px-3 py-2 text-white placeholder:text-text-muted focus:outline-none focus:border-trading-blue"
                      required
                    />
                  </div>
                </div>

                {/* Live Preview */}
                {formData.entryPrice && formData.exitPrice && (
                  <div className="bg-background-primary p-4 rounded-xl border border-border-primary flex items-center justify-between">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Calculator className="w-4 h-4" />
                      <span className="text-sm">Preview</span>
                    </div>
                    <div className="text-right">
                      <div className={clsx("font-bold text-lg", preview.profit >= 0 ? "text-trading-green" : "text-trading-red")}>
                        {preview.profit >= 0 ? '+' : ''}${preview.profit.toFixed(2)}
                      </div>
                      <div className={clsx("text-xs font-medium", preview.roi >= 0 ? "text-trading-green" : "text-trading-red")}>
                        {preview.roi >= 0 ? '+' : ''}{preview.roi.toFixed(2)}% ROI
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-border-primary">
                  <Button variant="outline" onClick={onClose} type="button">
                    {t.cancel}
                  </Button>
                  <Button type="submit" className="bg-trading-blue hover:bg-blue-600">
                    <Save className="w-4 h-4 mr-2" />
                    {t.save}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
