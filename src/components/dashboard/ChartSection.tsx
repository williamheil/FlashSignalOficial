import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, SeriesMarker } from 'lightweight-charts';
import { useStore } from '@/store/useStore';
import { binanceApi } from '@/services/binance';
import { clsx } from 'clsx';
import { BarChart2, Layers, Settings2, Share2, Maximize2, Activity } from 'lucide-react';
import IndicatorPanel from './IndicatorPanel';
import OrderBookPanel from './OrderBookPanel';
import { translations } from '@/utils/i18n';

// Helper to convert timeframe string to seconds
const getTimeframeSeconds = (tf: string): number => {
  const unit = tf.slice(-1);
  const value = parseInt(tf.slice(0, -1));
  if (isNaN(value)) return 3600;
  
  switch (unit) {
    case 'm': return value * 60;
    case 'h': return value * 3600;
    case 'd': return value * 86400;
    case 'w': return value * 604800;
    default: return 3600;
  }
};

export default function ChartSection() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  
  const { selectedAsset, assets, activeTrades, tradeHistory, user, language } = useStore();
  const t = translations[language].chart;
  const [timeframe, setTimeframe] = useState('1h');
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [stats24h, setStats24h] = useState({
    high: 0,
    low: 0,
    volume: 0,
    change: 0,
    changePercent: 0,
  });

  const asset = assets.find(a => a.symbol === selectedAsset);

  // Initialize Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#131722' }, // TradingView Standard Dark
        textColor: '#D9D9D9',
      },
      grid: {
        vertLines: { color: '#2B2B43' },
        horzLines: { color: '#2B2B43' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#2B2B43',
      },
      rightPriceScale: {
        borderColor: '#2B2B43',
      },
      crosshair: {
        vertLine: {
          color: '#758696',
          labelBackgroundColor: '#4c525e',
        },
        horzLine: {
          color: '#758696',
          labelBackgroundColor: '#4c525e',
        },
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#089981', // TradingView Green
      downColor: '#F23645', // TradingView Red
      borderVisible: false,
      wickUpColor: '#089981',
      wickDownColor: '#F23645',
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Update Markers based on Active Trades and Trade History
  useEffect(() => {
    if (!seriesRef.current) return;

    const tfSeconds = getTimeframeSeconds(timeframe);
    const markers: SeriesMarker<any>[] = [];

    // Process Active Trades (Entries only)
    const processedIds = new Set<string>();
    
    // Helper to check if a marker exists at the exact same time and type
    const isDuplicateMarker = (time: number, type: 'ENTRY' | 'EXIT') => {
      return markers.some(m => m.time === time as any && m.text === type);
    };

    // 1. Process Active Trades (Entries)
    activeTrades.forEach(trade => {
      if (trade.symbol !== selectedAsset && !selectedAsset.startsWith(trade.symbol) && !trade.symbol.startsWith(selectedAsset)) return;

      if (trade.entry_time) {
        // Prevent duplicate processing of same trade ID
        if (processedIds.has(trade.id)) return;
        processedIds.add(trade.id);

        const entryTime = new Date(trade.entry_time).getTime() / 1000;
        const snappedEntryTime = Math.floor(entryTime / tfSeconds) * tfSeconds;

        // Prevent visual duplication at same timestamp
        if (!isDuplicateMarker(snappedEntryTime, 'ENTRY')) {
          markers.push({
            time: snappedEntryTime as any,
            position: 'belowBar',
            color: '#089981', // Green
            shape: 'arrowUp',
            text: 'ENTRY',
            size: 2,
          });
        }
      }
    });

    // 2. Process Trade History (Exits primarily, but also Entries if needed)
    tradeHistory.forEach(trade => {
      if (trade.symbol !== selectedAsset && !selectedAsset.startsWith(trade.symbol) && !trade.symbol.startsWith(selectedAsset)) return;

      // ENTRY Logic for History
      // Even though user said "ENTRY from active", we must show entry for closed trades too.
      // But we check if ID was already processed (unlikely if disjoint) OR if time slot is taken.
      if (trade.entry_time) {
         if (!processedIds.has(trade.id)) {
            const entryTime = new Date(trade.entry_time).getTime() / 1000;
            const snappedEntryTime = Math.floor(entryTime / tfSeconds) * tfSeconds;

            if (!isDuplicateMarker(snappedEntryTime, 'ENTRY')) {
               markers.push({
                 time: snappedEntryTime as any,
                 position: 'belowBar',
                 color: '#089981',
                 shape: 'arrowUp',
                 text: 'ENTRY',
                 size: 2,
               });
               processedIds.add(trade.id);
            }
         }
      }

      // EXIT Logic for History
      if (trade.exit_time) {
        const exitTime = new Date(trade.exit_time).getTime() / 1000;
        const snappedExitTime = Math.floor(exitTime / tfSeconds) * tfSeconds;

        if (!isDuplicateMarker(snappedExitTime, 'EXIT')) {
          markers.push({
            time: snappedExitTime as any,
            position: 'aboveBar',
            color: '#F23645', // Red
            shape: 'arrowDown',
            text: 'EXIT',
            size: 2,
          });
        }
      }
    });
    
    // Sort markers by time
    markers.sort((a, b) => (a.time as number) - (b.time as number));

    seriesRef.current.setMarkers(markers);
  }, [activeTrades, tradeHistory, selectedAsset, timeframe, user]);

  // Fetch Data and Subscribe to WS when Asset/Interval changes
  useEffect(() => {
    if (!seriesRef.current || !selectedAsset) return;

    const loadData = async () => {
      // 1. Fetch Historical Klines
      const klines = await binanceApi.getKlines(selectedAsset, timeframe);
      const formattedData = klines.map(k => ({
        time: k.openTime / 1000 as any,
        open: parseFloat(k.open),
        high: parseFloat(k.high),
        low: parseFloat(k.low),
        close: parseFloat(k.close),
      }));
      
      seriesRef.current?.setData(formattedData);
      
      // Set current price from last close
      if (formattedData.length > 0) {
        setCurrentPrice(formattedData[formattedData.length - 1].close);
      }
    };

    loadData();

    // 3. WebSocket Subscription for Klines (Real-time Chart Updates)
    const wsKline = binanceApi.subscribeToKline(selectedAsset, timeframe, (data) => {
      const kline = data.k;
      seriesRef.current?.update({
        time: kline.t / 1000 as any,
        open: parseFloat(kline.o),
        high: parseFloat(kline.h),
        low: parseFloat(kline.l),
        close: parseFloat(kline.c),
      });
      setCurrentPrice(parseFloat(kline.c));
    });

    return () => {
      wsKline.close();
    };
  }, [selectedAsset, timeframe]);

  return (
    <div className="flex flex-col h-full bg-background-secondary overflow-hidden">
      {/* Chart Header */}
      <div className="px-6 py-4 border-b border-border-primary flex flex-col gap-4">
        {/* Top Row: Asset Info & Price */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <h1 className="text-2xl font-bold text-[#D9D9D9]">{asset?.name || selectedAsset}</h1>
                <span className="text-sm font-medium text-[#787B86]">/ USDT</span>
              </div>
              <div className="flex items-center gap-4 text-xs mt-1">
                <span className="text-[#787B86]">{t.vol}: <span className="text-[#B2B5BE] font-mono">
                  {(stats24h.volume ? stats24h.volume / 1000000 : (asset?.volume_24h ? asset.volume_24h / 1000000 : 0)).toFixed(2)}M
                </span></span>
                <span className="text-[#787B86]">{t.high}: <span className="text-[#089981] font-mono">
                  ${stats24h.high.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span></span>
                <span className="text-[#787B86]">{t.low}: <span className="text-[#F23645] font-mono">
                  ${stats24h.low.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span></span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className={clsx(
              "text-3xl font-mono font-bold tracking-tight",
              (stats24h.changePercent || asset?.change_24h || 0) >= 0 ? "text-[#089981]" : "text-[#F23645]"
            )}>
              ${currentPrice < 1 ? currentPrice.toFixed(6) : currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className={clsx(
              "text-sm font-medium flex items-center justify-end gap-1", 
              (stats24h.changePercent || asset?.change_24h || 0) >= 0 ? "text-[#089981]" : "text-[#F23645]"
            )}>
              {(stats24h.changePercent || asset?.change_24h || 0) > 0 ? '+' : ''}
              {(stats24h.changePercent || asset?.change_24h || 0).toFixed(2)}%
              <span className="text-[#787B86] ml-1">
                ({(stats24h.change || 0) > 0 ? '+' : ''}${(stats24h.change || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Row: Controls */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 bg-[#1E222D] p-1 rounded-lg border border-[#2B2B43]">
            {['5m', '15m', '1h', '4h', '1d', '1w'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={clsx(
                  "px-3 py-1 rounded text-xs font-semibold uppercase transition-all",
                  timeframe === t 
                    ? "bg-[#2962FF] text-white shadow-sm" 
                    : "text-[#B2B5BE] hover:text-[#D9D9D9] hover:bg-[#2A2E39]"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-[#B2B5BE] hover:text-[#D9D9D9] hover:bg-[#2A2E39] rounded-lg transition-colors" title={t.indicators}>
              <Activity className="w-4 h-4" />
            </button>
            <button className="p-2 text-[#B2B5BE] hover:text-[#D9D9D9] hover:bg-[#2A2E39] rounded-lg transition-colors" title={t.style}>
              <BarChart2 className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-[#2B2B43] mx-1" />
            <button className="p-2 text-[#B2B5BE] hover:text-[#D9D9D9] hover:bg-[#2A2E39] rounded-lg transition-colors">
              <Settings2 className="w-4 h-4" />
            </button>
            <button className="p-2 text-[#B2B5BE] hover:text-[#D9D9D9] hover:bg-[#2A2E39] rounded-lg transition-colors">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Scrollable Container for Charts */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
        {/* Main Price Chart */}
        <div className="relative w-full h-[500px]" ref={chartContainerRef}>
          {/* Chart Overlays / Watermark */}
          <div className="absolute top-4 left-4 z-10 pointer-events-none opacity-50">
             <div className="flex items-center gap-2">
               <div className="w-4 h-4 bg-gradient-to-tr from-[#089981] to-[#2962FF] rounded-sm" />
               <span className="font-bold text-[#787B86] text-xs">Flash Signal</span>
             </div>
          </div>
        </div>

        {/* Separated Indicators Section */}
        <IndicatorPanel symbol={selectedAsset} interval={timeframe} />

        {/* New Advanced Order Book & Tape Section */}
        <OrderBookPanel symbol={selectedAsset} />
      </div>
    </div>
  );
}
