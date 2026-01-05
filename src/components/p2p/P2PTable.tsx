import React, { useState } from 'react';
import { ArrowRight, TrendingUp, TrendingDown, Filter, Search } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { format, addHours } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/Input';

const P2PTable: React.FC = () => {
  const { p2pOpportunities } = useStore();
  const [filterType, setFilterType] = useState('all');
  const [minDiff, setMinDiff] = useState(0);
  const [searchExchange, setSearchExchange] = useState('');

  const filteredOpportunities = p2pOpportunities.filter(opp => {
    if (filterType !== 'all' && opp.tipo !== filterType) return false;
    if (opp.diferenca_pct < minDiff) return false;
    if (searchExchange && (
      !opp.exchange_entrada.toLowerCase().includes(searchExchange.toLowerCase()) &&
      !opp.exchange_saida.toLowerCase().includes(searchExchange.toLowerCase())
    )) return false;
    return true;
  }).sort((a, b) => b.diferenca_pct - a.diferenca_pct);

  return (
    <div className="bg-[#1E222D] rounded-xl border border-[#2B2B43] overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-[#2B2B43] flex flex-col md:flex-row gap-4 justify-between items-center bg-[#1E222D]">
        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filterType === 'all' ? 'bg-[#2962FF] text-white' : 'text-gray-400 hover:text-white hover:bg-[#2B2B43]'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterType('entre_exchanges')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filterType === 'entre_exchanges' ? 'bg-[#2962FF] text-white' : 'text-gray-400 hover:text-white hover:bg-[#2B2B43]'
            }`}
          >
            Entre Exchanges
          </button>
          <button
            onClick={() => setFilterType('mesma_exchange')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filterType === 'mesma_exchange' ? 'bg-[#2962FF] text-white' : 'text-gray-400 hover:text-white hover:bg-[#2B2B43]'
            }`}
          >
            Mesma Exchange
          </button>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
           <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar Exchange..."
              value={searchExchange}
              onChange={(e) => setSearchExchange(e.target.value)}
              className="pl-9 pr-4 py-2 bg-[#131722] border border-[#2B2B43] rounded-lg text-white text-sm focus:outline-none focus:border-[#2962FF] w-full md:w-48"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 whitespace-nowrap">Min %:</span>
            <input
              type="number"
              value={minDiff}
              onChange={(e) => setMinDiff(Number(e.target.value))}
              className="w-20 px-3 py-2 bg-[#131722] border border-[#2B2B43] rounded-lg text-white text-sm focus:outline-none focus:border-[#2962FF]"
            />
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-7 gap-4 p-4 text-sm font-medium text-gray-400 border-b border-[#2B2B43]">
        <div className="col-span-1">Tipo</div>
        <div className="col-span-1">Venda</div>
        <div className="col-span-1">Compra</div>
        <div className="col-span-1 text-right">Preço Venda</div>
        <div className="col-span-1 text-right">Preço Compra</div>
        <div className="col-span-1 text-right">Diferença</div>
        <div className="col-span-1 text-right">Horário</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-[#2B2B43]">
        <AnimatePresence>
          {filteredOpportunities.map((opp) => (
            <motion.div
              key={opp.id || `${opp.timestamp}-${opp.exchange_entrada}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`grid grid-cols-7 gap-4 p-4 items-center hover:bg-[#2B2B43]/50 transition-colors ${
                opp.diferenca_pct > 1 ? 'bg-green-500/5' : ''
              }`}
            >
              <div className="col-span-1">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  opp.tipo === 'entre_exchanges' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {opp.tipo === 'entre_exchanges' ? 'Entre Exchanges' : 'Mesma Exchange'}
                </span>
              </div>
              
              <div className="col-span-1">
                <div className="flex flex-col">
                  <span className="font-medium text-white">{opp.exchange_entrada}</span>
                </div>
              </div>

              <div className="col-span-1">
                <div className="flex flex-col">
                  <span className="font-medium text-white">{opp.exchange_saida}</span>
                </div>
              </div>

              <div className="col-span-1 text-right font-mono text-white">
                R$ {opp.preco_entrada.toFixed(3)}
              </div>

              <div className="col-span-1 text-right font-mono text-white">
                R$ {opp.preco_saida.toFixed(3)}
              </div>

              <div className="col-span-1 text-right">
                <span className={`font-bold ${
                  opp.diferenca_pct > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {opp.diferenca_pct > 0 ? '+' : ''}{opp.diferenca_pct.toFixed(2)}%
                </span>
                {opp.diferenca_pct > 1 && (
                  <span className="ml-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded animate-pulse">
                    HOT
                  </span>
                )}
              </div>

              <div className="col-span-1 text-right text-sm text-gray-400 font-mono">
                {format(addHours(new Date(opp.timestamp), 3), 'HH:mm:ss')}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredOpportunities.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            Nenhuma oportunidade encontrada com os filtros atuais.
          </div>
        )}
      </div>
    </div>
  );
};

export default P2PTable;
