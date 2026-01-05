import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, ExternalLink, Hash, DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';
import { coinGeckoApi, CoinDetails } from '@/services/coingecko';
import { useStore } from '@/store/useStore';
import { translations } from '@/utils/i18n';

interface AssetDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
}

export default function AssetDetailsModal({ isOpen, onClose, symbol }: AssetDetailsModalProps) {
  const [details, setDetails] = useState<CoinDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const { language } = useStore();
  const t = translations[language].details;

  useEffect(() => {
    if (isOpen && symbol) {
      const fetchDetails = async () => {
        setLoading(true);
        // Clean symbol (remove USDT)
        const coinSymbol = symbol.replace('USDT', '');
        const data = await coinGeckoApi.getCoinDetails(coinSymbol);
        setDetails(data);
        setLoading(false);
      };
      fetchDetails();
    }
  }, [isOpen, symbol]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog static open={isOpen} onClose={onClose} className="relative z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-[#131722] border border-[#2B2B43] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#2B2B43] bg-[#1E222D]">
                <div className="flex items-center gap-4">
                  {details?.image?.large ? (
                    <img src={details.image.large} alt={details.name} className="w-12 h-12 rounded-full" />
                  ) : (
                    <div className="w-12 h-12 bg-[#2B2B43] rounded-full animate-pulse" />
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      {details?.name || symbol}
                      <span className="text-sm font-normal text-[#787B86] bg-[#2A2E39] px-2 py-0.5 rounded">
                        {details?.symbol?.toUpperCase() || symbol}
                      </span>
                    </h2>
                    {details && (
                      <div className="flex items-center gap-3 text-xs text-[#B2B5BE] mt-1">
                        <span className="flex items-center gap-1 bg-[#2A2E39] px-2 py-0.5 rounded">
                          <Hash className="w-3 h-3" /> {t.rank} #{details.market_cap_rank}
                        </span>
                        {details.links?.homepage?.[0] && (
                          <a 
                            href={details.links.homepage[0]} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-1 hover:text-[#2962FF] transition-colors"
                          >
                            <Globe className="w-3 h-3" /> {t.website} <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 text-[#787B86] hover:text-white hover:bg-[#2A2E39] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto custom-scrollbar">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="w-8 h-8 border-2 border-[#2962FF] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[#787B86]">{t.loading}</p>
                  </div>
                ) : details ? (
                  <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-[#1E222D] p-3 rounded-lg border border-[#2B2B43]">
                        <p className="text-xs text-[#787B86] mb-1">Price</p>
                        <p className="text-lg font-mono font-bold text-white">
                          ${details.market_data.current_price.usd.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-[#1E222D] p-3 rounded-lg border border-[#2B2B43]">
                        <p className="text-xs text-[#787B86] mb-1">{t.marketCap}</p>
                        <p className="text-lg font-mono font-bold text-white">
                          ${(details.market_data.market_cap.usd / 1e9).toFixed(2)}B
                        </p>
                      </div>
                      <div className="bg-[#1E222D] p-3 rounded-lg border border-[#2B2B43]">
                        <p className="text-xs text-[#787B86] mb-1">24h High</p>
                        <p className="text-lg font-mono font-bold text-[#089981]">
                          ${details.market_data.high_24h.usd.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-[#1E222D] p-3 rounded-lg border border-[#2B2B43]">
                        <p className="text-xs text-[#787B86] mb-1">24h Low</p>
                        <p className="text-lg font-mono font-bold text-[#F23645]">
                          ${details.market_data.low_24h.usd.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-3">{t.about} {details.name}</h3>
                      <div 
                        className="text-[#B2B5BE] text-sm leading-relaxed prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ 
                          // Truncate description if too long
                          __html: details.description.en 
                            ? (details.description.en.split('. ').slice(0, 5).join('. ') + '.') 
                            : 'No description available.' 
                        }} 
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-[#787B86]">
                    Failed to load asset details.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
