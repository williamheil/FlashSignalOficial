import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts';
import { kiyotakaApi, PointInterval } from '@/services/kiyotaka';
import { useStore } from '@/store/useStore';
import { translations } from '@/utils/i18n';

interface IndicatorPanelProps {
  symbol: string;
  interval: string;
}

// Map binance interval string to Kiyotaka PointInterval
const getKiyotakaInterval = (i: string): PointInterval => {
  switch(i) {
    case '1m': return PointInterval.MINUTE;
    case '5m': return PointInterval.FIVE_MINUTES;
    case '15m': return PointInterval.FIFTEEN_MINUTES;
    case '1h': return PointInterval.HOUR;
    case '4h': return PointInterval.FOUR_HOURS;
    case '1d': return PointInterval.DAY;
    default: return PointInterval.HOUR;
  }
};

function SingleIndicatorChart({ 
  title, 
  color, 
  type, 
  data, 
  height = 100 
}: { 
  title: string, 
  color: string, 
  type: 'Line' | 'Histogram', 
  data: any[],
  height?: number 
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Line" | "Histogram"> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' }, // Use transparent background
        textColor: '#D9D9D9',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      width: containerRef.current.clientWidth,
      height: height,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderVisible: false,
      },
      rightPriceScale: {
        visible: true,
        borderColor: '#1f2937',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
    });

    let series;
    if (type === 'Line') {
      series = chart.addLineSeries({
        color: color,
        lineWidth: 2,
        priceScaleId: 'right',
        crosshairMarkerVisible: true,
      });
    } else {
      series = chart.addHistogramSeries({
        color: color,
        priceScaleId: 'right',
        priceFormat: { type: 'volume' },
      });
    }

    seriesRef.current = series;
    chartRef.current = chart;

    if (data.length > 0) {
      series.setData(data);
    }

    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []); // Init chart only once

  // Update data when props change
  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      seriesRef.current.setData(data);
      chartRef.current?.timeScale().fitContent();
    }
  }, [data]);

  return (
    <div className="relative w-full border-t border-gray-800 bg-[#141824]">
      <div className="absolute top-1 left-2 z-10 text-[10px] font-bold" style={{ color }}>
        {title}
      </div>
      <div ref={containerRef} className="w-full" style={{ height }} />
    </div>
  );
}

export default function IndicatorPanel({ symbol, interval }: IndicatorPanelProps) {
  const { language } = useStore();
  const t = translations[language].indicators;
  
  const [indicatorData, setIndicatorData] = useState<{
    oi: any[];
    rsi: any[];
    liq: any[];
  }>({ oi: [], rsi: [], liq: [] });

  // RSI Calculation Helper
  const calculateRSI = (prices: number[], period: number = 14) => {
    if (prices.length < period + 1) return Array(prices.length).fill(50); // Not enough data

    const rsiData = [];
    let gains = 0;
    let losses = 0;

    // First period
    for (let i = 1; i <= period; i++) {
      const diff = prices[i] - prices[i - 1];
      if (diff >= 0) gains += diff;
      else losses += Math.abs(diff);
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    // First RSI
    rsiData.push(100 - (100 / (1 + avgGain / (avgLoss || 1)))); // Avoid div by zero

    // Subsequent periods (Smoothed)
    for (let i = period + 1; i < prices.length; i++) {
      const diff = prices[i] - prices[i - 1];
      const currentGain = diff > 0 ? diff : 0;
      const currentLoss = diff < 0 ? Math.abs(diff) : 0;

      avgGain = ((avgGain * (period - 1)) + currentGain) / period;
      avgLoss = ((avgLoss * (period - 1)) + currentLoss) / period;

      const rs = avgGain / (avgLoss || 1);
      rsiData.push(100 - (100 / (1 + rs)));
    }

    // Pad the beginning
    return [...Array(period).fill(null), ...rsiData];
  };

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      const kInterval = getKiyotakaInterval(interval);
      const lookback = 200 * (interval === '1h' ? 3600 : 60); // Increased lookback for RSI
      const start = Math.floor(Date.now() / 1000) - lookback;

      const data = await kiyotakaApi.getIndicatorData(symbol, kInterval, start);

      // Process Open Interest
      const oiData = data.oi.map(p => ({
        time: p.timestamp.seconds as any,
        value: p.oiClose || p.close || 0
      }));

      // Collect prices for RSI (using close price from buy trades aggregation)
      const len = data.buyTrades.length;
      const prices: number[] = [];
      const times: number[] = [];
      
      for (let i = 0; i < len; i++) {
        const buy = data.buyTrades[i];
        prices.push(buy.close || 0);
        times.push(buy.timestamp.seconds);
      }

      // Process RSI
      const rsiValues = calculateRSI(prices);
      const rsiData = rsiValues.map((val, i) => {
        if (val === null) return null;
        return {
          time: times[i] as any,
          value: val
        };
      }).filter(d => d !== null);

      // Process Liquidations
      const liqData = data.liquidations.map(p => ({
        time: p.timestamp.seconds as any,
        value: p.liquidations || 0,
        color: '#ef4444'
      }));

      setIndicatorData({ oi: oiData, rsi: rsiData, liq: liqData });
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60000);
    return () => clearInterval(intervalId);
  }, [symbol, interval]);

  return (
    <div className="flex flex-col w-full -mt-px">
      <SingleIndicatorChart 
        title={t.oi}
        color="#3b82f6" 
        type="Line" 
        data={indicatorData.oi} 
        height={100} 
      />
      <SingleIndicatorChart 
        title={t.rsi} 
        color="#8b5cf6" 
        type="Line" 
        data={indicatorData.rsi} 
        height={100} 
      />
      <SingleIndicatorChart 
        title={t.liq} 
        color="#ef4444" 
        type="Histogram" 
        data={indicatorData.liq} 
        height={100} 
      />
    </div>
  );
}
