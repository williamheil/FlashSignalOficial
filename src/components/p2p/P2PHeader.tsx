import React from 'react';
import { RefreshCw, Activity } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { format, addHours } from 'date-fns';

const P2PHeader: React.FC = () => {
  const { p2pOpportunities } = useStore();
  
  // Encontra o timestamp mais recente entre todas as oportunidades
  const lastUpdate = p2pOpportunities.length > 0 
    ? p2pOpportunities.reduce((latest, current) => {
        return new Date(current.timestamp) > new Date(latest) ? current.timestamp : latest;
      }, p2pOpportunities[0].timestamp)
    : null;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Monitoramento P2P</h1>
        <p className="text-gray-400">Oportunidades de arbitragem P2P para criadores de anúncios</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium text-green-500">Live</span>
        </div>

        {lastUpdate && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <RefreshCw className="w-4 h-4" />
            <span>
              Última atualização: {format(addHours(new Date(lastUpdate), 3), 'HH:mm:ss')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default P2PHeader;
