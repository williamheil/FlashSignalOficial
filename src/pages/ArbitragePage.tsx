import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, VolumeX, Share2, ArrowRight, Settings, 
  Activity, RefreshCw, AlertTriangle, Check, Wallet, 
  ArrowLeftRight, Zap, Bell, Globe
} from 'lucide-react';

// --- Components ---

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-[#1a1a2e]/80 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const variants = {
    primary: 'bg-[#ff8c00] text-white hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20',
    secondary: 'bg-[#8b5cf6] text-white hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20',
    ghost: 'bg-transparent text-[#a0a0b0] hover:text-white hover:bg-white/5',
    outline: 'border border-[#2B2B43] text-[#a0a0b0] hover:text-white hover:border-[#ff8c00]'
  };

  return (
    <button 
      className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${variants[variant as keyof typeof variants]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ label, icon: Icon, ...props }: any) => (
  <div className="space-y-2">
    {label && <label className="text-sm font-medium text-[#a0a0b0]">{label}</label>}
    <div className="relative group">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a0b0] group-focus-within:text-[#8b5cf6] transition-colors">
          <Icon size={18} />
        </div>
      )}
      <input 
        className={`w-full bg-[#0a0a0f] border border-[#2B2B43] rounded-[10px] py-3 ${Icon ? 'pl-10' : 'pl-4'} pr-4 text-white placeholder-[#a0a0b0]/50 focus:outline-none focus:border-[#8b5cf6] focus:shadow-[0_0_0_4px_rgba(139,92,246,0.1)] transition-all`}
        {...props}
      />
    </div>
  </div>
);

// --- Main Page ---

const ArbitragePage = () => {
  const [muted, setMuted] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState('Binance');
  const [logicInverted, setLogicInverted] = useState(false);
  
  // Simulation States
  const [spotPrice, setSpotPrice] = useState(0.001399);
  const [futurePrice, setFuturePrice] = useState(0.001404);
  const [diff, setDiff] = useState(0.36);
  
  // Bot Config States
  const [alertLimit, setAlertLimit] = useState(1.0);
  const [liquidity, setLiquidity] = useState(150);

  // Audio Ref
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); // Simple beep
  }, []);

  // Live Price Simulation & Alert Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const newSpot = 0.001390 + Math.random() * 0.000020;
      const newFuture = 0.001400 + Math.random() * 0.000020;
      
      // Calculate diff based on logic
      let calculatedDiff;
      if (logicInverted) {
        // Future x Spot (Short Future, Long Spot) -> Entry = Future, Exit = Spot
        // Profit = (Future - Spot) / Future
        calculatedDiff = ((newFuture - newSpot) / newFuture) * 100;
      } else {
        // Spot x Future (Long Spot, Short Future) -> Entry = Spot, Exit = Future
        // Profit = (newFuture - newSpot) / newSpot * 100
        calculatedDiff = ((newFuture - newSpot) / newSpot) * 100;
      }

      setSpotPrice(newSpot);
      setFuturePrice(newFuture);
      setDiff(calculatedDiff);

      // Check Alert
      if (Math.abs(calculatedDiff) >= alertLimit && !muted) {
        audioRef.current?.play().catch(() => {});
      }

    }, 2000);
    return () => clearInterval(interval);
  }, [alertLimit, muted, logicInverted]);

  // Calculator States
  const [calcSpot, setCalcSpot] = useState('');
  const [calcFuture, setCalcFuture] = useState('');
  const [calcResult, setCalcResult] = useState<number | null>(null);

  const handleOpenCharts = () => {
    // Open Spot Chart
    window.open('https://www.binance.com/en/trade/DOGE_USDT', '_blank', 'left=0,top=0,width=' + window.screen.width / 2 + ',height=' + window.screen.height);
    
    // Open Future Chart
    window.open('https://www.binance.com/en/futures/DOGUSDT', '_blank', 'left=' + window.screen.width / 2 + ',top=0,width=' + window.screen.width / 2 + ',height=' + window.screen.height);
  };

  const handleCalculate = () => {
    const s = parseFloat(calcSpot);
    const f = parseFloat(calcFuture);
    if (!isNaN(s) && !isNaN(f)) {
      setCalcResult(((f - s) / s) * 100);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 font-sans selection:bg-[#ff8c00]/30">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 -z-10" />
      
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Page Title (Mobile only) */}
        <div className="lg:hidden mb-6">
           <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-[#a0a0b0] bg-clip-text text-transparent">
             Arbitrage Dashboard
           </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 📊 Coluna 1: Monitoramento ao Vivo */}
          <Card className="h-full flex flex-col p-6 relative group border-t-4 border-t-[#ff8c00]">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#ff8c00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            {/* Header */}
            <div className="flex justify-between items-center mb-8 relative z-10">
              <button 
                onClick={handleOpenCharts}
                className="flex items-center gap-2 text-[#a0a0b0] hover:text-[#ff8c00] transition-colors"
                title="Abrir gráficos Spot e Future lado a lado"
              >
                <span className="font-bold text-lg tracking-wide uppercase">Monitoramento ao Vivo</span>
                <Globe size={16} />
              </button>
              <button 
                onClick={() => setMuted(!muted)}
                className="text-[#a0a0b0] hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
              >
                {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>

            {/* Display Principal */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 relative z-10">
              <h2 className="text-5xl font-extrabold tracking-tighter">DOG</h2>
              
              <div className="w-full space-y-6">
                {logicInverted ? (
                  <>
                    {/* Future Price (Top) */}
                    <div className="text-center space-y-2">
                      <div className="text-[#8b5cf6] text-xs font-bold tracking-[0.2em] uppercase">Future</div>
                      <div className="text-4xl md:text-5xl font-mono font-bold text-[#00ffcc] drop-shadow-[0_0_15px_rgba(0,255,204,0.3)] tabular-nums">
                        {futurePrice.toFixed(6)}
                      </div>
                    </div>

                    {/* Diff */}
                    <div className="text-center py-2">
                      <div className="text-[#a0a0b0] text-xs font-medium mb-1">DIF. (%)</div>
                      <div className={`text-3xl font-bold flex items-center justify-center gap-2 ${diff >= 0 ? 'text-[#00ffcc]' : 'text-[#ff4444]'}`}>
                        {diff > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                        {Math.abs(diff).toFixed(2)}%
                      </div>
                    </div>

                    {/* Spot Price (Bottom) */}
                    <div className="text-center space-y-2">
                      <div className="text-[#ff6b9d] text-xs font-bold tracking-[0.2em] uppercase">Spot</div>
                      <div className="text-4xl md:text-5xl font-mono font-bold text-[#ff8c00] drop-shadow-[0_0_15px_rgba(255,140,0,0.3)] tabular-nums">
                        {spotPrice.toFixed(6)}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Spot Price (Top) */}
                    <div className="text-center space-y-2">
                      <div className="text-[#ff6b9d] text-xs font-bold tracking-[0.2em] uppercase">Spot</div>
                      <div className="text-4xl md:text-5xl font-mono font-bold text-[#ff8c00] drop-shadow-[0_0_15px_rgba(255,140,0,0.3)] tabular-nums">
                        {spotPrice.toFixed(6)}
                      </div>
                    </div>

                    {/* Diff */}
                    <div className="text-center py-2">
                      <div className="text-[#a0a0b0] text-xs font-medium mb-1">DIF. (%)</div>
                      <div className={`text-3xl font-bold flex items-center justify-center gap-2 ${diff >= 0 ? 'text-[#00ffcc]' : 'text-[#ff4444]'}`}>
                        {diff > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                        {Math.abs(diff).toFixed(2)}%
                      </div>
                    </div>

                    {/* Future Price (Bottom) */}
                    <div className="text-center space-y-2">
                      <div className="text-[#8b5cf6] text-xs font-bold tracking-[0.2em] uppercase">Future</div>
                      <div className="text-4xl md:text-5xl font-mono font-bold text-[#00ffcc] drop-shadow-[0_0_15px_rgba(0,255,204,0.3)] tabular-nums">
                        {futurePrice.toFixed(6)}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Footer Controls */}
            <div className="mt-8 space-y-6 relative z-10">
              {/* Exchanges */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mask-fade">
                {['Binance'].map(ex => (
                  <button
                    key={ex}
                    onClick={() => setSelectedExchange(ex)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      selectedExchange === ex 
                        ? 'bg-[#ff8c00] text-white shadow-lg shadow-orange-500/20 scale-105' 
                        : 'bg-[#2a2a3e] text-[#a0a0b0] hover:bg-[#35354a]'
                    }`}
                  >
                    {ex}
                  </button>
                ))}
              </div>

              {/* Logic Toggle */}
              <div className="flex items-center justify-between bg-[#0a0a0f]/50 p-3 rounded-xl border border-[#2B2B43]">
                <span className="text-sm text-[#a0a0b0]">Lógica: <span className={logicInverted ? "text-[#8b5cf6]" : "text-[#2962FF]"}>Invertida</span></span>
                <button 
                  onClick={() => setLogicInverted(!logicInverted)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 relative ${logicInverted ? 'bg-[#8b5cf6]' : 'bg-[#2962FF]'}`}
                >
                  <motion.div 
                    layout
                    className="w-4 h-4 bg-white rounded-full shadow-md"
                    animate={{ x: logicInverted ? 24 : 0 }}
                  />
                </button>
              </div>
            </div>
          </Card>

          {/* ⚙️ Coluna 2: Configurações do Bot */}
          <div className="space-y-6">
            <Card className="p-6 space-y-6 border-t-4 border-t-[#8b5cf6]">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Settings className="text-[#8b5cf6]" size={20} />
                Configurações do Bot
              </h3>

              {/* 1. Limite de Alerta */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-[#a0a0b0]">Limite de Alerta (%)</label>
                  <span className="text-xs text-[#8b5cf6]">Ativo</span>
                </div>
                <div className="flex gap-3">
                  <Input 
                    value={alertLimit} 
                    onChange={(e: any) => setAlertLimit(parseFloat(e.target.value))} 
                    type="number" 
                    step="0.1" 
                    icon={AlertTriangle} 
                  />
                  <Button variant="primary" className="whitespace-nowrap">Salvar</Button>
                </div>
              </div>

              {/* 2. Trocar Moeda */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-[#a0a0b0]">Trocar Moeda</label>
                <div className="space-y-3">
                  <Input placeholder="Ex: BTC, ETH, UNI" icon={RefreshCw} />
                  <Button variant="secondary" className="w-full">
                    Aplicar Moeda
                  </Button>
                </div>
              </div>

              {/* 3. Liquidez do Worker */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-[#a0a0b0]">Liquidez do Worker ($)</label>
                <div className="flex gap-3">
                  <Input 
                    value={liquidity}
                    onChange={(e: any) => setLiquidity(parseFloat(e.target.value))}
                    type="number" 
                    icon={Wallet} 
                  />
                  <Button variant="primary" className="whitespace-nowrap">Salvar</Button>
                </div>
                <p className="text-xs text-[#a0a0b0] flex items-center gap-1">
                  <Zap size={12} className="text-[#ff8c00]" />
                  Coletando até ${liquidity} no book de ofertas
                </p>
              </div>
            </Card>
            
            {/* Webhook Configuration */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                 <h3 className="text-lg font-bold flex items-center gap-2">
                  <Globe className="text-[#00ffcc]" size={20} />
                  Webhook Binance
                </h3>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-xs font-bold text-green-500">CONECTADO</span>
                </div>
              </div>
              
              <div className="bg-[#0a0a0f] p-4 rounded-xl border border-[#2B2B43] space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#a0a0b0]">Latência</span>
                  <span className="text-[#00ffcc]">45ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#a0a0b0]">Último update</span>
                  <span className="text-white">Agora</span>
                </div>
              </div>

              <Button variant="outline" className="w-full border-dashed">
                Configurar Webhook
              </Button>
            </Card>
          </div>

          {/* 🧮 Coluna 3: Calculadora Manual */}
          <Card className="h-full flex flex-col relative overflow-hidden">
             {/* Header Destaque */}
             <div className="bg-gradient-to-r from-[#2962FF]/20 to-[#8b5cf6]/20 p-6 border-b border-white/5">
               <h3 className="text-xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-[#a0a0b0]">
                 Calculadora Manual
                 <br />
                 <span className="text-sm font-normal text-[#a0a0b0]">de Arbitragem</span>
               </h3>
             </div>

             <div className="p-6 flex-1 flex flex-col space-y-6">
                <Input 
                  label="Preço Spot" 
                  placeholder="Ex: 1.23456" 
                  value={calcSpot}
                  onChange={(e: any) => setCalcSpot(e.target.value)}
                  type="number"
                />
                
                <Input 
                  label="Preço Future" 
                  placeholder="Ex: 1.23456" 
                  value={calcFuture}
                  onChange={(e: any) => setCalcFuture(e.target.value)}
                  type="number"
                />

                <Button 
                  onClick={handleCalculate}
                  className="w-full py-4 text-lg font-bold shadow-xl shadow-orange-500/10"
                >
                  Calcular Diferença <RefreshCw className="ml-2 animate-spin-slow" size={20} />
                </Button>

                <div className="flex-1 flex flex-col justify-end">
                  <div className="bg-[#0a0a0f] rounded-xl p-6 border border-[#2B2B43] text-center space-y-2">
                    <span className="text-sm text-[#a0a0b0] uppercase tracking-wider">Resultado</span>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={calcResult}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`text-4xl font-bold ${
                          (calcResult || 0) > 0 ? 'text-[#00ffcc]' : (calcResult || 0) < 0 ? 'text-[#ff4444]' : 'text-white'
                        }`}
                      >
                         {calcResult !== null ? `${calcResult.toFixed(2)}%` : '--'}
                      </motion.div>
                    </AnimatePresence>
                    {calcResult !== null && (
                       <div className="text-sm text-[#a0a0b0]">
                         Diferença bruta: $ {Math.abs(parseFloat(calcFuture) - parseFloat(calcSpot)).toFixed(6)}
                       </div>
                    )}
                  </div>
                </div>
             </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

// Icons Helpers
const TrendingUpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const TrendingDownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
    <polyline points="17 18 23 18 23 12"></polyline>
  </svg>
);

export default ArbitragePage;
