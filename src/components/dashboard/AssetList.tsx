import { useState, useEffect } from 'react';
import { Asset } from '@/types';
import { clsx } from 'clsx';
import { useStore } from '@/store/useStore';
import { translations } from '@/utils/i18n';
import { Star, TrendingUp, TrendingDown, Search, Filter, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AssetListProps {
  assets: Asset[];
}

const ITEMS_PER_PAGE = 15;

type SortKey = 'change_24h' | 'current_price' | 'volume_24h';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
  labelKey: string;
}

const SORT_OPTIONS: SortConfig[] = [
  { key: 'change_24h', direction: 'desc', labelKey: 'topGainers' },
  { key: 'change_24h', direction: 'asc', labelKey: 'topLosers' },
  { key: 'current_price', direction: 'desc', labelKey: 'priceHighLow' },
  { key: 'current_price', direction: 'asc', labelKey: 'priceLowHigh' },
  { key: 'volume_24h', direction: 'desc', labelKey: 'volumeHighLow' },
];

// Simple sparkline component
const Sparkline = ({ data, color }: { data: number[], color: string }) => {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 60;
    const y = 20 - ((d - min) / range) * 20;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="60" height="20" className="opacity-80">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
};

export default function AssetList({ assets }: AssetListProps) {
  const { setSelectedAsset, selectedAsset, language } = useStore();
  const t = translations[language].market;
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>(() => {
    try {
      const saved = localStorage.getItem('assetListSortConfig');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse sort config from local storage', e);
    }
    return SORT_OPTIONS[0];
  });
  const [showFilters, setShowFilters] = useState(false);

  // Save to local storage whenever sortConfig changes
  useEffect(() => {
    localStorage.setItem('assetListSortConfig', JSON.stringify(sortConfig));
  }, [sortConfig]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredAssets = assets.filter(asset => 
    (asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    const multiplier = sortConfig.direction === 'asc' ? 1 : -1;
    return (a[sortConfig.key] - b[sortConfig.key]) * multiplier;
  });

  const totalPages = Math.ceil(sortedAssets.length / ITEMS_PER_PAGE);
  const paginatedAssets = sortedAssets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Pagination Logic to show a window of pages
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3; // Reduced for narrow sidebar
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col h-full bg-background-secondary border-r border-border-primary w-[280px]">
      {/* Header */}
      <div className="p-4 border-b border-border-primary">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-text-primary">{t.title}</h2>
          <div className="relative">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={clsx(
                "p-1.5 rounded transition-colors",
                showFilters ? "bg-trading-blue text-white" : "hover:bg-background-tertiary text-text-secondary"
              )}
            >
              <Filter className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {showFilters && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowFilters(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-background-secondary border border-border-primary rounded-lg shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-1 space-y-0.5">
                      <div className="text-[10px] font-semibold text-text-muted px-2 py-1.5 uppercase tracking-wider">
                        {t.filter.sortBy}
                      </div>
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={`${option.key}-${option.direction}`}
                          onClick={() => {
                            setSortConfig(option);
                            setShowFilters(false);
                          }}
                          className={clsx(
                            "w-full text-left px-2 py-1.5 text-sm rounded flex items-center justify-between transition-colors",
                            sortConfig.key === option.key && sortConfig.direction === option.direction
                              ? "bg-trading-blue/10 text-trading-blue font-medium"
                              : "text-text-secondary hover:bg-background-tertiary hover:text-white"
                          )}
                        >
                          <span>{t.filter[option.labelKey as keyof typeof t.filter]}</span>
                          {sortConfig.key === option.key && sortConfig.direction === option.direction && (
                            <Check className="w-3.5 h-3.5" />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text" 
            placeholder={t.searchPlaceholder}
            className="w-full bg-background-primary border border-border-primary rounded-lg py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-trading-blue"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {paginatedAssets.map((asset, index) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            key={asset.symbol} 
            onClick={() => setSelectedAsset(asset.symbol)}
            className={clsx(
              "group p-3 rounded-lg cursor-pointer border transition-all duration-200",
              selectedAsset === asset.symbol 
                ? "bg-background-tertiary border-trading-green/50 shadow-lg shadow-trading-green/5" 
                : "bg-transparent border-transparent hover:bg-background-tertiary hover:border-border-accent"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <button className="text-text-muted hover:text-trading-amber transition-colors">
                  <Star className="w-3.5 h-3.5" />
                </button>
                <div>
                  <div className="font-bold text-sm text-text-primary group-hover:text-white transition-colors">
                    {asset.symbol}
                  </div>
                  <div className="text-[10px] text-text-muted font-medium">
                    {asset.name}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm text-text-primary">
                  {asset.current_price < 1 
                    ? asset.current_price.toFixed(6) 
                    : asset.current_price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace('$', '')}
                </div>
                <div className={clsx("flex items-center justify-end gap-1 text-xs font-medium", asset.change_24h >= 0 ? "text-trading-green" : "text-trading-red")}>
                  {asset.change_24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(asset.change_24h).toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-dashed border-border-accent/30 mt-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-text-muted uppercase tracking-wider">{t.vol}</span>
                <span className="text-xs text-text-secondary font-medium">{(asset.volume_24h / 1000000).toFixed(1)}M</span>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                 {/* Mock sparkline data based on change */}
                 <Sparkline 
                   data={[10, 15, 12, 20, 18, 25, 22, 30, asset.change_24h > 0 ? 35 : 5]} 
                   color={asset.change_24h >= 0 ? '#00C853' : '#FF1744'} 
                 />
              </div>
            </div>
            
            {/* Signal Strength Badge */}
            <div className="mt-2 flex justify-between items-center">
               <span className="text-[10px] text-text-muted">{t.signalStrength}</span>
               <span className={clsx(
                 "text-[10px] px-2 py-0.5 rounded-full font-bold",
                 asset.strength === 'very_strong' || asset.strength === 'strong' 
                   ? "bg-trading-green/20 text-trading-green" 
                   : asset.strength === 'weak' || asset.strength === 'very_weak'
                   ? "bg-trading-red/20 text-trading-red"
                   : "bg-trading-blue/20 text-trading-blue"
               )}>
                 {asset.strength?.replace('_', ' ').toUpperCase()}
               </span>
            </div>
          </motion.div>
        ))}
        {filteredAssets.length === 0 && (
          <div className="p-8 text-center text-text-muted flex flex-col items-center">
            <Search className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">{t.noAssets}</p>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-2 border-t border-border-primary flex items-center justify-between gap-1 bg-background-secondary">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="p-1 text-text-muted hover:text-white disabled:opacity-30 disabled:hover:text-text-muted"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 text-text-muted hover:text-white disabled:opacity-30 disabled:hover:text-text-muted"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 overflow-hidden">
            {getPageNumbers().map((page, i) => (
              <button
                key={i}
                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                disabled={page === '...'}
                className={clsx(
                  "w-6 h-6 flex items-center justify-center rounded text-xs font-medium transition-colors",
                  currentPage === page 
                    ? "bg-trading-blue text-white" 
                    : page === '...' 
                      ? "text-text-muted cursor-default" 
                      : "text-text-secondary hover:bg-background-tertiary hover:text-white"
                )}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 text-text-muted hover:text-white disabled:opacity-30 disabled:hover:text-text-muted"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1 text-text-muted hover:text-white disabled:opacity-30 disabled:hover:text-text-muted"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
