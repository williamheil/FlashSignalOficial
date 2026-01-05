import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Asset, Signal, User, Alert, ActiveTrade, TradeHistory, PortfolioTrade, P2POpportunity } from '@/types';
import { binanceApi } from '@/services/binance';

type Language = 'en' | 'pt';

interface AppState {
  user: User | null;
  assets: Asset[];
  selectedAsset: string;
  signals: Signal[];
  activeTrades: ActiveTrade[];
  tradeHistory: TradeHistory[];
  portfolioTrades: PortfolioTrade[];
  p2pOpportunities: P2POpportunity[];
  alerts: Alert[];
  isLoading: boolean;
  language: Language;
  theme: 'default' | 'blue';
  
  // Actions
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  toggleTheme: () => void;
  fetchAssets: () => Promise<void>;
  fetchSignals: () => Promise<void>;
  fetchActiveTrades: () => Promise<void>;
  fetchTradeHistory: () => Promise<void>;
  fetchPortfolioTrades: () => void;
  addPortfolioTrade: (trade: PortfolioTrade) => void;
  updatePortfolioTrade: (trade: PortfolioTrade) => void;
  deletePortfolioTrade: (id: string) => void;
  fetchP2POpportunities: () => Promise<void>;
  fetchAlerts: () => Promise<void>;
  checkSession: () => Promise<void>;
  setSelectedAsset: (symbol: string) => void;
  updateAssetPrice: (symbol: string, price: number, change: number) => void;
  createAlert: (alert: Omit<Alert, 'id' | 'created_at' | 'status' | 'user_id'>) => Promise<void>;
  deleteAlert: (id: string) => Promise<void>;
  checkPriceAlerts: (symbol: string, price: number) => void;
}

import { SUPPORTED_ASSETS } from '@/data/supportedAssets';

export const useStore = create<AppState>((set, get) => ({
  user: null,
  assets: [],
  selectedAsset: 'BTCUSDT',
  signals: [],
  activeTrades: [],
  tradeHistory: [],
  portfolioTrades: [],
  p2pOpportunities: [],
  alerts: [],
  isLoading: false,
  language: 'en',
  theme: 'default',

  setLanguage: (lang) => set({ language: lang }),
  toggleLanguage: () => set((state) => ({ language: state.language === 'en' ? 'pt' : 'en' })),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'default' ? 'blue' : 'default' })),

  fetchAssets: async () => {
    set({ isLoading: true });
    
    // Fetch all tickers from Binance
    const topCoins = await binanceApi.getTopVolumeCoins(1000); // Increased limit to fetch more/all
    
    // Filter to keep only supported assets
    const assets: Asset[] = topCoins
      .filter(coin => SUPPORTED_ASSETS.includes(coin.symbol))
      .map(coin => ({
        symbol: coin.symbol,
        name: coin.symbol.replace('USDT', ''),
        current_price: parseFloat(coin.lastPrice),
        change_24h: parseFloat(coin.priceChangePercent),
        volume_24h: parseFloat(coin.quoteVolume),
        market_cap: 0,
        strength: getStrength(parseFloat(coin.priceChangePercent))
      }));

    set({ assets, isLoading: false });
  },

  fetchSignals: async () => {
    const { data } = await supabase
      .from('signals')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data) {
      set({ signals: data as Signal[] });
    }

    // Subscribe to realtime changes
    supabase
      .channel('signals-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'signals' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            set((state) => ({ signals: [payload.new as Signal, ...state.signals] }));
          } else if (payload.eventType === 'UPDATE') {
            set((state) => ({
              signals: state.signals.map((s) => 
                s.id === payload.new.id ? (payload.new as Signal) : s
              ),
            }));
          }
        }
      )
      .subscribe();
  },

  fetchActiveTrades: async () => {
    const { data } = await supabase
      .from('active_trades')
      .select('*')
      .order('entry_time', { ascending: false });
      
    if (data) {
      set({ activeTrades: data as ActiveTrade[] });
    }

    // Realtime subscription for active_trades
    supabase
      .channel('active-trades-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'active_trades' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            set((state) => ({ activeTrades: [payload.new as ActiveTrade, ...state.activeTrades] }));
          } else if (payload.eventType === 'UPDATE') {
            set((state) => ({
              activeTrades: state.activeTrades.map((t) => 
                t.id === payload.new.id ? (payload.new as ActiveTrade) : t
              ),
            }));
          } else if (payload.eventType === 'DELETE') {
            set((state) => ({
              activeTrades: state.activeTrades.filter((t) => t.id !== payload.old.id),
            }));
          }
        }
      )
      .subscribe();
  },

  fetchTradeHistory: async () => {
    const { data } = await supabase
      .from('trade_history')
      .select('*')
      .order('exit_time', { ascending: false });
      
    if (data) {
      set({ tradeHistory: data as TradeHistory[] });
    }

    // Realtime subscription for trade_history
    supabase
      .channel('trade-history-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'trade_history' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            set((state) => ({ tradeHistory: [payload.new as TradeHistory, ...state.tradeHistory] }));
          }
          // Usually history doesn't get updated or deleted, but mainly inserted
        }
      )
      .subscribe();
  },

  fetchPortfolioTrades: () => {
    try {
      const saved = localStorage.getItem('portfolioTrades');
      if (saved) {
        set({ portfolioTrades: JSON.parse(saved) });
      }
    } catch (e) {
      console.error('Failed to load portfolio trades', e);
    }
  },

  addPortfolioTrade: (trade) => {
    set(state => {
      const newTrades = [trade, ...state.portfolioTrades];
      localStorage.setItem('portfolioTrades', JSON.stringify(newTrades));
      return { portfolioTrades: newTrades };
    });
  },

  updatePortfolioTrade: (trade) => {
    set(state => {
      const newTrades = state.portfolioTrades.map(t => t.id === trade.id ? trade : t);
      localStorage.setItem('portfolioTrades', JSON.stringify(newTrades));
      return { portfolioTrades: newTrades };
    });
  },

  deletePortfolioTrade: (id) => {
    set(state => {
      const newTrades = state.portfolioTrades.filter(t => t.id !== id);
      localStorage.setItem('portfolioTrades', JSON.stringify(newTrades));
      return { portfolioTrades: newTrades };
    });
  },

  fetchP2POpportunities: async () => {
    const { data } = await supabase
      .from('p2p_opportunities')
      .select('*')
      .order('timestamp', { ascending: false });
      
    if (data) {
      set({ p2pOpportunities: data as P2POpportunity[] });
    }

    // Subscribe to realtime changes
    supabase
      .channel('p2p-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'p2p_opportunities' },
        (payload) => {
          console.log('Realtime P2P received:', payload);
          if (payload.eventType === 'INSERT') {
            set((state) => ({ 
              p2pOpportunities: [payload.new as P2POpportunity, ...state.p2pOpportunities] 
            }));
          } else if (payload.eventType === 'DELETE') {
             // If we receive a DELETE, we remove it from the list
             // However, since we do a full wipe and replace, we might get many DELETEs.
             // If the ID is '0000...' it might not match real IDs if we use UUIDs.
             // But the webhook deletes ALL rows.
             set((state) => ({
                p2pOpportunities: state.p2pOpportunities.filter(opp => opp.id !== payload.old.id)
             }));
          }
        }
      )
      .subscribe((status) => {
        console.log('P2P Subscription status:', status);
      });
  },

  fetchAlerts: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data } = await supabase
      .from('alerts')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (data) {
      set({ alerts: data as Alert[] });
    }
  },

  checkSession: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        let profile = null;
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts && !profile) {
          const { data, error } = await supabase
            .from('profiles')
            .select('username, avatar_url, subscription_status, telegram_chat_id, subscription_expires_at, premium_until')
            .eq('id', session.user.id)
            .maybeSingle();

          if (!error && data) {
            profile = data;
          } else {
            attempts++;
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 500 * attempts)); // Backoff: 500ms, 1000ms
            } else {
              console.error('Failed to fetch profile after multiple attempts:', error);
            }
          }
        }
        
        // Verify subscription expiration logic
        let status = profile?.subscription_status || 'free';
        const expiresAt = profile?.subscription_expires_at || profile?.premium_until;

        // Check if expired
        if (status === 'premium' && expiresAt) {
          if (new Date(expiresAt) < new Date()) {
            status = 'free';
          }
        }

        const user: User = {
          id: session.user.id,
          email: session.user.email!,
          user_metadata: session.user.user_metadata,
          username: profile?.username || session.user.user_metadata?.username,
          avatar_url: profile?.avatar_url || session.user.user_metadata?.avatar_url,
          subscription_status: status as 'free' | 'premium',
          subscription_expires_at: expiresAt,
          telegram_chat_id: profile?.telegram_chat_id
        };
        
        set({ user });
        get().fetchAlerts(); // Fetch alerts on login
      } else {
        set({ user: null, alerts: [] });
      }
    } catch (error) {
      console.error('Session check error:', error);
      set({ user: null });
    }
  },

  setSelectedAsset: (symbol: string) => {
    set({ selectedAsset: symbol });
  },

  updateAssetPrice: (symbol: string, price: number, change: number) => {
    set(state => ({
      assets: state.assets.map(asset => 
        asset.symbol === symbol 
          ? { ...asset, current_price: price, change_24h: change }
          : asset
      )
    }));
    
    // Check alerts whenever price updates
    get().checkPriceAlerts(symbol, price);
  },

  createAlert: async (alertData) => {
    // Refresh user data to ensure we have the latest chat_id
    await get().checkSession();
    
    const { user, alerts } = get();
    if (!user) return;

    if (!user.telegram_chat_id) {
      throw new Error('Please configure Telegram Chat ID in Settings first.');
    }

    // Check limits
    if (user.subscription_status === 'free' && alerts.length >= 5) {
      throw new Error('Free plan limited to 5 alarms. Upgrade to Premium for unlimited alarms.');
    }

    const { error } = await supabase
      .from('alerts')
      .insert({
        user_id: user.id,
        symbol: alertData.symbol,
        target_price: alertData.target_price,
        condition: alertData.condition,
        description: alertData.description,
        status: 'active'
      });

    if (error) throw error;
    get().fetchAlerts();
  },

  deleteAlert: async (id) => {
    const { error } = await supabase
      .from('alerts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    get().fetchAlerts();
  },

  checkPriceAlerts: async (symbol: string, price: number) => {
    const { alerts, user } = get();
    if (!user || !user.telegram_chat_id) return;

    const relevantAlerts = alerts.filter(a => a.symbol === symbol && a.status === 'active');

    for (const alert of relevantAlerts) {
      let triggered = false;
      if (alert.condition === 'above' && price >= alert.target_price) triggered = true;
      if (alert.condition === 'below' && price <= alert.target_price) triggered = true;

      if (triggered) {
        // 1. Mark as triggered in DB immediately to prevent loop
        await supabase
          .from('alerts')
          .update({ status: 'triggered' })
          .eq('id', alert.id);

        // 2. Send Telegram Message
        const message = `🔔 *Price Alert Triggered!* 🔔\n\n` +
                        `💎 *Coin:* ${alert.symbol}\n` +
                        `💰 *Price:* $${price.toLocaleString()}\n` +
                        `📈 *Condition:* Went ${alert.condition} $${alert.target_price}\n` +
                        (alert.description ? `📝 *Note:* ${alert.description}` : '');
        
        await sendTelegramMessage(user.telegram_chat_id, message);

        // 3. Update local state
        get().fetchAlerts();
      }
    }
  }
}));

async function sendTelegramMessage(chatId: string, text: string) {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error("Telegram Token not found");
    return;
  }
  
  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
      })
    });
  } catch (error) {
    console.error("Failed to send Telegram message", error);
  }
}

function getStrength(change: number): 'very_strong' | 'strong' | 'neutral' | 'weak' | 'very_weak' {
  if (change > 10) return 'very_strong';
  if (change > 3) return 'strong';
  if (change < -10) return 'very_weak';
  if (change < -3) return 'weak';
  return 'neutral';
}
