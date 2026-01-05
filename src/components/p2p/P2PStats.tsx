import React from 'react';
import { BarChart3, TrendingUp, Store, DollarSign } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const P2PStats: React.FC = () => {
  const { p2pOpportunities } = useStore();

  const totalOpportunities = p2pOpportunities.length;
  const maxDiff = p2pOpportunities.reduce((max, curr) => Math.max(max, curr.diferenca_pct), 0);
  const uniqueExchanges = new Set([
    ...p2pOpportunities.map(o => o.exchange_entrada),
    ...p2pOpportunities.map(o => o.exchange_saida)
  ]).size;
  
  // Encontra o timestamp mais recente entre todas as oportunidades
  const lastUpdate = p2pOpportunities.length > 0 
    ? p2pOpportunities.reduce((latest, current) => {
        return new Date(current.timestamp) > new Date(latest) ? current.timestamp : latest;
      }, p2pOpportunities[0].timestamp)
    : null;

  const stats = [
    {
      label: 'Total de Oportunidades',
      value: totalOpportunities,
      icon: BarChart3,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      label: 'Maior Diferença',
      value: `${maxDiff.toFixed(2)}%`,
      icon: TrendingUp,
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    {
      label: 'Exchanges Monitoradas',
      value: uniqueExchanges,
      icon: Store,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    {
      label: 'Maior Lucro',
      value: `${(p2pOpportunities.length > 0 ? Math.max(...p2pOpportunities.map(o => o.preco_entrada - o.preco_saida)) : 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
      icon: DollarSign,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-[#1E222D] p-6 rounded-xl border border-[#2B2B43] flex items-center gap-4">
          <div className={`p-3 rounded-lg ${stat.bg}`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <div>
            <p className="text-sm text-gray-400">{stat.label}</p>
            <p className="text-xl font-bold text-white">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default P2PStats;
