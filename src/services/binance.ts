export interface BinanceTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

export interface BinanceKline {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteAssetVolume: string;
  trades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
}

export interface WsTickerData {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  p: string; // Price change
  P: string; // Price change percent
  w: string; // Weighted average price
  x: string; // First trade(ID)
  c: string; // Last price
  Q: string; // Last quantity
  b: string; // Best bid price
  B: string; // Best bid quantity
  a: string; // Best ask price
  A: string; // Best ask quantity
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Total traded base asset volume
  q: string; // Total traded quote asset volume
  O: number; // Statistics open time
  C: number; // Statistics close time
  F: number; // First trade ID
  L: number; // Last trade Id
  n: number; // Total number of trades
}

export interface WsKlineData {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  k: {
    t: number; // Kline start time
    T: number; // Kline close time
    s: string; // Symbol
    i: string; // Interval
    f: number; // First trade ID
    L: number; // Last trade ID
    o: string; // Open price
    c: string; // Close price
    h: string; // High price
    l: string; // Low price
    v: string; // Base asset volume
    n: number; // Number of trades
    x: boolean; // Is this kline closed?
    q: string; // Quote asset volume
    V: string; // Taker buy base asset volume
    Q: string; // Taker buy quote asset volume
    B: string; // Ignore
  };
}

export interface WsTradeData {
  e: string; // Event type: trade
  E: number; // Event time
  s: string; // Symbol
  t: number; // Trade ID
  p: string; // Price
  q: string; // Quantity
  b: number; // Buyer order ID
  a: number; // Seller order ID
  T: number; // Trade time
  m: boolean; // Is the buyer the market maker? (True = Sell, False = Buy)
  M: boolean; // Ignore
}

const BASE_URL = 'https://api.binance.com/api/v3';
const WS_BASE_URL = 'wss://stream.binance.com:9443/ws';

export const binanceApi = {
  // REST API
  getTopVolumeCoins: async (limit = 20): Promise<BinanceTicker[]> => {
    try {
      const response = await fetch(`${BASE_URL}/ticker/24hr`);
      if (!response.ok) throw new Error('Failed to fetch ticker data');
      
      const data: BinanceTicker[] = await response.json();
      
      return data
        .filter(ticker => ticker.symbol.endsWith('USDT') && parseFloat(ticker.quoteVolume) > 0)
        .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching top coins:', error);
      return [];
    }
  },

  get24hrStats: async (symbol: string): Promise<BinanceTicker | null> => {
    try {
      const response = await fetch(`${BASE_URL}/ticker/24hr?symbol=${symbol.toUpperCase()}`);
      if (!response.ok) throw new Error('Failed to fetch ticker data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching 24hr stats:', error);
      return null;
    }
  },

  getKlines: async (symbol: string, interval: string = '1h', limit: number = 500): Promise<BinanceKline[]> => {
    try {
      const response = await fetch(
        `${BASE_URL}/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`
      );
      if (!response.ok) throw new Error('Failed to fetch klines');
      
      const data: any[][] = await response.json();
      
      return data.map(k => ({
        openTime: k[0],
        open: k[1],
        high: k[2],
        low: k[3],
        close: k[4],
        volume: k[5],
        closeTime: k[6],
        quoteAssetVolume: k[7],
        trades: k[8],
        takerBuyBaseAssetVolume: k[9],
        takerBuyQuoteAssetVolume: k[10],
      }));
    } catch (error) {
      console.error('Error fetching klines:', error);
      return [];
    }
  },

  getOrderBook: async (symbol: string, limit: number = 20) => {
    try {
      const response = await fetch(
        `${BASE_URL}/depth?symbol=${symbol.toUpperCase()}&limit=${limit}`
      );
      if (!response.ok) throw new Error('Failed to fetch depth');
      return await response.json();
    } catch (error) {
      console.error('Error fetching depth:', error);
      return { bids: [], asks: [] };
    }
  },

  // WebSocket Manager
  subscribeToTickers: (symbols: string[], callback: (data: WsTickerData) => void) => {
    const streams = symbols.map(s => `${s.toLowerCase()}@ticker`).join('/');
    const ws = new WebSocket(`${WS_BASE_URL}/${streams}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Handle both raw stream and combined stream format
      const payload = data.stream ? data.data : data;
      callback(payload);
    };

    return ws;
  },

  subscribeToKline: (symbol: string, interval: string, callback: (data: WsKlineData) => void) => {
    const ws = new WebSocket(`${WS_BASE_URL}/${symbol.toLowerCase()}@kline_${interval}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };

    return ws;
  },

  subscribeToTrades: (symbol: string, callback: (data: WsTradeData) => void) => {
    const ws = new WebSocket(`${WS_BASE_URL}/${symbol.toLowerCase()}@trade`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };

    return ws;
  }
};
