const BASE_URL = 'https://api.coingecko.com/api/v3';

export interface CoinDetails {
  id: string;
  symbol: string;
  name: string;
  description: { en: string; pt?: string };
  market_cap_rank: number;
  links: {
    homepage: string[];
  };
  image: {
    large: string;
  };
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    high_24h: { usd: number };
    low_24h: { usd: number };
  };
}

export const coinGeckoApi = {
  getCoinDetails: async (symbol: string): Promise<CoinDetails | null> => {
    try {
      // 1. Search for the coin id first (e.g. BTC -> bitcoin)
      // Since we don't have the id mapping, we search first.
      // Note: In production, better to have a static map for top coins to save requests.
      const searchRes = await fetch(`${BASE_URL}/search?query=${symbol}`);
      const searchData = await searchRes.json();
      
      const coin = searchData.coins?.[0];
      if (!coin) return null;

      // 2. Fetch details
      const detailsRes = await fetch(`${BASE_URL}/coins/${coin.id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`);
      const details = await detailsRes.json();
      
      return details;
    } catch (error) {
      console.error('CoinGecko API Error:', error);
      return null;
    }
  }
};
