// Types based on the provided API documentation

export enum PointType {
  TRADE = 'TRADE',
  TRADE_AGG = 'TRADE_AGG',
  OPEN_INTEREST_AGG = 'OPEN_INTEREST_AGG',
  FUNDING_RATE_AGG = 'FUNDING_RATE_AGG',
  LIQUIDATION_AGG = 'LIQUIDATION_AGG',
}

export enum PointSide {
  UNKNOWN = 'UNKNOWN_SIDE',
  SELL = 'SELL',
  BUY = 'BUY',
}

export enum PointInterval {
  MINUTE = 'MINUTE',
  FIVE_MINUTES = 'FIVE_MINUTES',
  FIFTEEN_MINUTES = 'FIFTEEN_MINUTES',
  HOUR = 'HOUR',
  FOUR_HOURS = 'FOUR_HOURS',
  DAY = 'DAY',
  WEEK = 'WEEK',
}

export interface KiyotakaRequest {
  type: PointType[];
  exchange: string[];
  coin: string[];
  interval: PointInterval;
  from: number;
  period?: number;
  side?: PointSide;
}

export interface PointData {
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
  // Common fields across aggregations
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
  liquidations?: number;
  oiClose?: number; // Inferred from option OI, might vary for standard OI
  valueClose?: number; // For CME OI
}

export interface PointSeries {
  points: PointData[];
  id: {
    type: PointType;
    side?: PointSide;
  };
}

export interface KiyotakaResponse {
  series: PointSeries[];
}

const BASE_URL = 'https://api.kiyotaka.ai/v1';

export const kiyotakaApi = {
  getPoints: async (
    symbol: string, 
    types: PointType[], 
    interval: PointInterval,
    startTime: number
  ): Promise<KiyotakaResponse> => {
    const apiKey = import.meta.env.VITE_KIYOTAKA_API_KEY;
    
    // Using a proxy or direct call? Direct call for now.
    // Note: In production, API keys should be handled backend-side to avoid exposure.
    // For this demo, we'll fetch from client.
    
    const params = new URLSearchParams();
    types.forEach(t => params.append('type', t));
    params.append('exchange', 'BINANCE'); // Defaulting to Binance as per context
    params.append('coin', symbol.replace('USDT', '')); // Extract coin name like BTC
    params.append('interval', interval);
    params.append('from', startTime.toString());
    
    // Add side=BUY and side=SELL for TRADE_AGG to calculate CVD if needed
    // But the API seems to filter by side if provided. 
    // We might need multiple requests if we want both sides for the same type.
    
    try {
      const response = await fetch(`${BASE_URL}/points?${params.toString()}`, {
        headers: {
          'x-kiyotaka-key': apiKey || '',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        // Fallback to mock data if API fails (e.g. invalid key)
        console.warn('Kiyotaka API failed, using mock data');
        return generateMockData(types, startTime);
      }

      return await response.json();
    } catch (error) {
      console.error('Kiyotaka API error:', error);
      return generateMockData(types, startTime);
    }
  },

  // Helper to fetch specific indicators separately since they might need different params (like side)
  getIndicatorData: async (symbol: string, interval: PointInterval, start: number) => {
    // We need:
    // 1. Trade Agg (Buy) -> for CVD & Buying Volume
    // 2. Trade Agg (Sell) -> for CVD & Selling Volume
    // 3. Open Interest -> Total OI
    // 4. Liquidations -> Total or Sided
    
    // Since we can't batch different 'side' params in one request usually, we make parallel calls.
    
    const coin = symbol.replace('USDT', '');
    const commonParams = {
      exchange: ['BINANCE'],
      coin: [coin],
      interval: interval,
      from: start,
    };

    // Helper to construct URL
    const buildUrl = (p: any) => {
      const params = new URLSearchParams();
      p.type.forEach((t: string) => params.append('type', t));
      p.exchange.forEach((e: string) => params.append('exchange', e));
      p.coin.forEach((c: string) => params.append('coin', c));
      params.append('interval', p.interval);
      params.append('from', p.from.toString());
      if (p.side) params.append('side', p.side);
      return `${BASE_URL}/points?${params.toString()}`;
    };

    const headers = { 'x-kiyotaka-key': import.meta.env.VITE_KIYOTAKA_API_KEY || '' };

    try {
      const [buyTrades, sellTrades, oi, liq] = await Promise.all([
        fetch(buildUrl({ ...commonParams, type: [PointType.TRADE_AGG], side: PointSide.BUY }), { headers }).then(r => r.ok ? r.json() : { series: [] }),
        fetch(buildUrl({ ...commonParams, type: [PointType.TRADE_AGG], side: PointSide.SELL }), { headers }).then(r => r.ok ? r.json() : { series: [] }),
        fetch(buildUrl({ ...commonParams, type: [PointType.OPEN_INTEREST_AGG] }), { headers }).then(r => r.ok ? r.json() : { series: [] }),
        fetch(buildUrl({ ...commonParams, type: [PointType.LIQUIDATION_AGG] }), { headers }).then(r => r.ok ? r.json() : { series: [] }),
      ]);

      return {
        buyTrades: buyTrades.series?.[0]?.points || [],
        sellTrades: sellTrades.series?.[0]?.points || [],
        oi: oi.series?.[0]?.points || [],
        liquidations: liq.series?.[0]?.points || []
      };
    } catch (e) {
      console.error("Error fetching indicators", e);
      // Return mock
      const mock = generateMockData([PointType.TRADE_AGG], start);
      return {
        buyTrades: mock.series[0].points,
        sellTrades: mock.series[0].points.map(p => ({...p, volume: (p.volume || 0) * 0.9})),
        oi: mock.series[0].points.map(p => ({...p, close: (p.close || 0) * 100})),
        liquidations: mock.series[0].points.map(p => ({...p, liquidations: Math.random() * 1000}))
      };
    }
  }
};

// Mock Data Generator for Fallback
function generateMockData(types: PointType[], startTime: number): KiyotakaResponse {
  const points: PointData[] = [];
  let currentPrice = 50000;
  let time = startTime;
  
  for (let i = 0; i < 100; i++) {
    time += 60; // 1 min
    const change = (Math.random() - 0.5) * 100;
    currentPrice += change;
    
    points.push({
      timestamp: { seconds: time, nanoseconds: 0 },
      open: currentPrice,
      high: currentPrice + 50,
      low: currentPrice - 50,
      close: currentPrice + 20,
      volume: Math.random() * 10,
      liquidations: Math.random() * 5000,
      oiClose: Math.random() * 1000000
    });
  }

  return {
    series: types.map(t => ({
      id: { type: t },
      points
    }))
  };
}
