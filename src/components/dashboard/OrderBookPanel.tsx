import { useEffect, useState, useRef } from 'react';
import { binanceApi, WsTradeData } from '@/services/binance';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import { useStore } from '@/store/useStore';
import { translations } from '@/utils/i18n';

interface OrderBookPanelProps {
  symbol: string;
}

interface Trade {
  id: number;
  price: number;
  qty: number;
  time: number;
  isBuyerMaker: boolean; // true = Sell, false = Buy
}

export default function OrderBookPanel({ symbol }: OrderBookPanelProps) {
  const { language } = useStore();
  const t = translations[language].orderBook;
  const [bids, setBids] = useState<string[][]>([]);
  const [asks, setAsks] = useState<string[][]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [lastPriceDirection, setLastPriceDirection] = useState<'up' | 'down' | 'neutral'>('neutral');

  // Fetch Initial Depth
  useEffect(() => {
    const fetchDepth = async () => {
      const depth = await binanceApi.getOrderBook(symbol, 20); // Get top 20 levels
      setBids(depth.bids);
      setAsks(depth.asks.reverse()); // Reverse asks to show lowest ask at bottom (closest to spread)
      
      // Initialize current price from mid market if available
      if (depth.bids.length > 0 && depth.asks.length > 0) {
        const mid = (parseFloat(depth.bids[0][0]) + parseFloat(depth.asks[depth.asks.length-1][0])) / 2;
        setCurrentPrice(mid);
      }
    };

    fetchDepth();
    const interval = setInterval(fetchDepth, 2000); // Poll every 2s
    return () => clearInterval(interval);
  }, [symbol]);

  // Subscribe to Real-time Trades
  useEffect(() => {
    const ws = binanceApi.subscribeToTrades(symbol, (data: WsTradeData) => {
      const newTrade: Trade = {
        id: data.t,
        price: parseFloat(data.p),
        qty: parseFloat(data.q),
        time: data.T,
        isBuyerMaker: data.m
      };

      setTrades(prev => [newTrade, ...prev].slice(0, 50)); // Keep last 50 trades
      
      // Update price and direction
      const price = parseFloat(data.p);
      setCurrentPrice(prev => {
        if (price > prev) setLastPriceDirection('up');
        else if (price < prev) setLastPriceDirection('down');
        return price;
      });
    });

    return () => ws.close();
  }, [symbol]);

  // Calculate cumulative volume for depth visualization
  const calculateAccumulated = (orders: string[][], type: 'bid' | 'ask') => {
    let total = 0;
    return orders.map(order => {
      const qty = parseFloat(order[1]);
      total += qty;
      return {
        price: parseFloat(order[0]),
        qty: qty,
        total: total
      };
    });
  };

  const processedAsks = calculateAccumulated(asks, 'ask').slice(-14); // Show bottom 14 asks (closest to price)
  const processedBids = calculateAccumulated(bids, 'bid').slice(0, 14); // Show top 14 bids

  // Calculate max volume for depth bars
  const maxVol = Math.max(
    processedAsks.length > 0 ? processedAsks[0].total : 0, // Since we sliced asks from end, first is total
    processedBids.length > 0 ? processedBids[processedBids.length-1].total : 0
  );

  return (
    <div className="grid grid-cols-2 h-[400px] border-t border-[#2B2B43] bg-[#131722] text-[11px] font-mono">
      {/* Left Column: Order Book */}
      <div className="border-r border-[#2B2B43] flex flex-col">
        {/* Asks (Sells) - Top Half */}
        <div className="flex-1 overflow-hidden flex flex-col-reverse">
          {processedAsks.map((ask, i) => (
            <div key={i} className="grid grid-cols-3 hover:bg-[#2A2E39] cursor-pointer relative group px-2 py-0.5">
              <span className="text-[#F23645]">{ask.price.toFixed(2)}</span>
              <span className="text-[#B2B5BE] text-right">{ask.qty.toFixed(5)}</span>
              <span className="text-[#787B86] text-right">{ask.total.toFixed(2)}</span>
              <div 
                className="absolute right-0 top-0 bottom-0 bg-[#F23645]/10 pointer-events-none" 
                style={{ width: `${(ask.total / maxVol) * 100}%` }} 
              />
            </div>
          ))}
          {/* Header for Asks (hidden visually but logical top) */}
        </div>

        {/* Spread / Current Price */}
        <div className="py-2 flex items-center justify-center gap-2 border-y border-[#2B2B43] bg-[#141824]">
          <span className={clsx(
            "text-lg font-bold",
            lastPriceDirection === 'up' ? "text-[#089981]" : 
            lastPriceDirection === 'down' ? "text-[#F23645]" : "text-white"
          )}>
            {currentPrice.toFixed(2)}
          </span>
          {lastPriceDirection === 'up' ? <ArrowUp className="w-4 h-4 text-[#089981]" /> : 
           lastPriceDirection === 'down' ? <ArrowDown className="w-4 h-4 text-[#F23645]" /> : null}
        </div>

        {/* Bids (Buys) - Bottom Half */}
        <div className="flex-1 overflow-hidden">
          {processedBids.map((bid, i) => (
            <div key={i} className="grid grid-cols-3 hover:bg-[#2A2E39] cursor-pointer relative group px-2 py-0.5">
              <span className="text-[#089981]">{bid.price.toFixed(2)}</span>
              <span className="text-[#B2B5BE] text-right">{bid.qty.toFixed(5)}</span>
              <span className="text-[#787B86] text-right">{bid.total.toFixed(2)}</span>
              <div 
                className="absolute right-0 top-0 bottom-0 bg-[#089981]/10 pointer-events-none" 
                style={{ width: `${(bid.total / maxVol) * 100}%` }} 
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Market Trades (Tape) */}
      <div className="flex flex-col overflow-hidden">
        <div className="grid grid-cols-3 px-2 py-1 text-[#787B86] font-bold border-b border-[#2B2B43] text-[10px]">
          <span>{t.price} (USDT)</span>
          <span className="text-right">{t.amount}</span>
          <span className="text-right">{t.time}</span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {trades.map((trade) => (
            <div key={trade.id} className="grid grid-cols-[auto_1fr_auto] gap-2 px-2 py-0.5 hover:bg-[#2A2E39] items-center">
              <div className="flex items-center gap-1">
                {/* isBuyerMaker = true means Sell (taker sold to maker buy order) */}
                {trade.isBuyerMaker ? (
                  <ArrowDown className="w-3 h-3 text-[#F23645]" />
                ) : (
                  <ArrowUp className="w-3 h-3 text-[#089981]" />
                )}
                <span className={trade.isBuyerMaker ? "text-[#F23645]" : "text-[#089981]"}>
                  {trade.price.toFixed(2)}
                </span>
              </div>
              <span className="text-[#B2B5BE] text-right">{trade.qty.toFixed(5)}</span>
              <span className="text-[#787B86] text-right">
                {format(trade.time, 'HH:mm:ss')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
