export interface User {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  user_metadata?: {
    username?: string;
    avatar_url?: string;
  };
  subscription_status: 'free' | 'premium';
  subscription_expires_at?: string;
  telegram_chat_id?: string;
}

export interface Alert {
  id: string;
  user_id: string;
  symbol: string;
  target_price: number;
  condition: 'above' | 'below';
  description?: string;
  status: 'active' | 'triggered';
  created_at: string;
}

export interface P2POpportunity {
  id?: string;
  tipo: string; // 'entre_exchanges' | 'mesma_exchange'
  exchange_entrada: string;
  exchange_saida: string;
  preco_entrada: number;
  preco_saida: number;
  diferenca_pct: number;
  comerciante_entrada: string;
  comerciante_saida: string;
  timestamp: string;
}

export interface Signal {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  entry_price: number;
  target_price: number;
  stop_loss: number;
  confidence: number;
  status: 'active' | 'closed' | 'cancelled';
  created_at: string;
  closed_at?: string;
  performance?: number;
}

export interface Asset {
  symbol: string;
  name: string;
  current_price: number;
  change_24h: number;
  volume_24h: number;
  market_cap: number;
  strength: 'very_strong' | 'strong' | 'neutral' | 'weak' | 'very_weak';
}

export interface TradingOpportunity {
  id: string;
  symbol: string;
  score: number;
  strength: string;
  signal: string;
  setup: string;
  volatility: number;
  volume_ratio: number;
  rsi: number;
  price: number;
  detected_at: string;
}

export interface ActiveTrade {
  id: string;
  symbol: string;
  side: string;
  setup: string;
  score: number;
  strength: string;
  entry_price: number;
  current_price: number;
  pnl: number;
  entry_time: string;
  updated_at: string;
}

export interface TradeHistory {
  id: string;
  symbol: string;
  side: string;
  setup: string;
  score: number;
  entry_price: number;
  exit_price: number;
  pnl: number;
  result: string;
  entry_time: string;
  exit_time: string;
}

export interface PortfolioTrade {
  id: string;
  symbol: string;
  type: 'Long' | 'Short';
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  date: string;
  notes?: string;
}
