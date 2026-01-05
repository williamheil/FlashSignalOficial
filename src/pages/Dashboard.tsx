import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import AssetList from '@/components/dashboard/AssetList';
import ChartSection from '@/components/dashboard/ChartSection';
import SignalPanel from '@/components/dashboard/SignalPanel';
import { binanceApi } from '@/services/binance';

export default function Dashboard() {
  const { assets, fetchAssets, fetchSignals, fetchActiveTrades, fetchTradeHistory, updateAssetPrice } = useStore();

  useEffect(() => {
    fetchAssets();
    fetchSignals();
    fetchActiveTrades();
    fetchTradeHistory();
    
    let ws: WebSocket;
    const connectWs = () => {
      if (assets.length > 0) {
        const symbols = assets.map(a => a.symbol);
        ws = binanceApi.subscribeToTickers(symbols, (data) => {
          updateAssetPrice(data.s, parseFloat(data.c), parseFloat(data.P));
        });
      }
    };

    const timer = setTimeout(() => {
      if (assets.length > 0) connectWs();
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (ws) ws.close();
    };
  }, [assets.length]);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background-primary">
      {/* Left Column: Markets */}
      <div className="hidden md:block h-full">
        <AssetList assets={assets} />
      </div>

      {/* Center Column: Main Chart */}
      <div className="flex-1 h-full min-w-0 bg-background-secondary relative">
        <ChartSection />
      </div>

      {/* Right Column: Signals */}
      <div className="hidden lg:block h-full">
        <SignalPanel assets={assets} />
      </div>
    </div>
  );
}
