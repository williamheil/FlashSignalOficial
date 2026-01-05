export const translations = {
  en: {
    nav: {
      dashboard: 'Dashboard',
      signals: 'Signals',
      alarm: 'Alarm',
      p2p: 'P2P Monitor',
      settings: 'Settings',
      search: 'Search assets...',
      login: 'Log In',
      signup: 'Sign Up',
      logout: 'Sign Out',
      profile: 'Profile',
      subscription: 'Subscription',
      myAccount: 'My Account'
    },
    market: {
      title: 'Markets',
      searchPlaceholder: 'Search BTC, ETH...',
      vol: 'Vol 24h',
      signalStrength: 'Signal Strength',
      noAssets: 'No assets found',
      filter: {
        sortBy: 'Sort By',
        topGainers: 'Top Gainers',
        topLosers: 'Top Losers',
        priceHighLow: 'Price (High to Low)',
        priceLowHigh: 'Price (Low to High)',
        volumeHighLow: 'Volume (High to Low)'
      }
    },
    signals: {
      activeTitle: 'Active Signals',
      unlockTitle: 'Unlock Top Ratios',
      unlockDesc: 'Get access to institutional-grade signals and metrics.',
      upgrade: 'Upgrade to Premium',
      entry: 'Entry',
      current: 'Current',
      confidence: 'Confidence',
      details: 'Details',
      ago: 'ago'
    },
    alerts: {
      title: 'Price Alarm',
      subtitle: 'Get instant Telegram notifications when prices hit your targets.',
      create: 'Create New Alarm',
      active: 'Active Alarms',
      noActive: 'No active alarms. Create one above to get started!',
      limitReached: 'Limit reached. Upgrade for more.',
      asset: 'Asset',
      condition: 'Condition',
      targetPrice: 'Target Price ($)',
      createButton: 'Create',
      priceAbove: 'Price Goes Above',
      priceBelow: 'Price Goes Below',
      crossesAbove: 'CROSSES ABOVE',
      crossesBelow: 'CROSSES BELOW',
      target: 'Target',
      deleteConfirm: 'Delete this alarm?'
    },
    settings: {
      title: 'Settings',
      subtitle: 'Manage your personal information, security, and preferences.',
      tabs: {
        profile: 'Profile',
        security: 'Security',
        subscription: 'Subscription',
        notifications: 'Notifications'
      },
      profile: {
        title: 'Personal Information',
        subtitle: 'Update your photo and personal details.',
        avatarUrl: 'Avatar URL',
        avatarDesc: 'Enter a URL for your profile picture. Supported formats: JPG, PNG, GIF.',
        username: 'Username',
        email: 'Email Address',
        save: 'Save Changes',
        success: 'Profile updated successfully!',
        error: 'Failed to update profile'
      },
      security: {
        title: 'Security',
        subtitle: 'Manage your password and account security.',
        passwordReq: 'Password Requirements',
        reqList: [
          'Minimum 6 characters long',
          'Use a mix of letters, numbers, and symbols',
          'Avoid using common words'
        ],
        newPassword: 'New Password',
        confirmPassword: 'Confirm New Password',
        updatePassword: 'Update Password',
        matchError: "Passwords don't match",
        success: 'Password updated successfully!'
      },
      subscription: {
        title: 'Subscription Plan',
        subtitle: 'Manage your billing and plan details.',
        currentPlan: 'Current Plan',
        premium: 'Premium',
        free: 'Free',
        premiumDesc: 'You have access to all premium features including advanced signals, alerts, and performance analytics.',
        freeDesc: 'Upgrade to Premium to unlock advanced signals, real-time alerts, and detailed performance metrics.',
        active: 'ACTIVE',
        expiresOn: 'Expires on',
        daysLeft: 'days left',
        activate: 'Activate Subscription',
        enterKey: 'Enter your activation key',
        keyPlaceholder: 'Enter your activation key',
        activateBtn: 'Activate',
        keyDesc: 'Enter the license key provided to you to upgrade your account.',
        success: 'Subscription activated successfully!',
        benefits: 'Premium Benefits',
        benefitList: [
          'Unlimited Price Alerts',
          'Full Access to Maker P2P Arbitrage',
          'Real-time Trading Signals',
          'Priority Support'
        ],
        upgrade: 'Upgrade Now',
        upgradeDesc: 'Get instant access to all premium features.',
        renew: 'Renew Subscription',
        getPremium: 'Get Premium Access',
        paymentNote: 'Payments are processed securely via Telegram support.'
      },
      notifications: {
        title: 'Notifications',
        subtitle: 'Configure how you receive alerts.',
        setup: 'Setup Instructions',
        step1: 'Start the bot on Telegram:',
        step2: 'Send the command',
        step2Code: '/start',
        step2End: 'to the bot.',
        step3: 'Copy your Chat ID and paste it in the field below.',
        chatId: 'Telegram Chat ID',
        locked: 'Chat ID is permanently linked.',
        contactSupport: 'Contact support for changes.',
        save: 'Save Chat ID',
        test: 'Send Test Message',
        testSuccess: 'Test message sent! Check Telegram.',
        testError: 'Failed to send test message. Check Chat ID.',
        saveSuccess: 'Telegram settings saved!'
      }
    },
    chart: {
      vol: 'Vol',
      high: 'High',
      low: 'Low',
      indicators: 'Indicators',
      style: 'Chart Style'
    },
    orderBook: {
      price: 'Price',
      amount: 'Amount',
      time: 'Time',
      total: 'Total'
    },
    indicators: {
      cvd: 'CVD (Delta)',
      oi: 'Open Interest',
      liq: 'Liquidations',
      rsi: 'RSI'
    },
    auth: {
      welcomeBack: 'Welcome Back',
      signInSubtitle: 'Sign in to access your trading signals',
      createAccount: 'Create Account',
      joinSubtitle: 'Join Flash Signal and start trading smarter',
      email: 'Email Address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      username: 'Username',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      passMatchError: "Passwords don't match",
      genericError: 'An error occurred',
      success: 'Success',
      emailPlaceholder: 'name@example.com',
      passwordPlaceholder: 'Enter your password',
      confirmPlaceholder: 'Confirm your password',
      usernamePlaceholder: 'johndoe',
      backToHome: '← Back to Home'
    },
    performancePage: {
      title: 'Performance Analytics',
      comingSoon: 'Detailed P&L analysis and equity curves coming soon.'
    },
    premiumGate: {
      title: 'Premium Feature Locked',
      description: 'This section is reserved for premium members. Upgrade now to access advanced signals, performance analytics, and institutional-grade metrics.',
      viewPlans: 'View Plans'
    },
    signalsPage: {
      title: 'Signals & Analysis',
      subtitle: 'Real-time AI-powered trading signals.',
      realTimeActive: 'Real-Time Data Active',
      upgrade: 'Upgrade to Premium',
      tabs: {
        active: 'Active Signals',
        opportunities: 'Opportunities',
        history: 'History'
      },
      table: {
        time: 'Time',
        symbol: 'Symbol',
        side: 'Side',
        setup: 'Setup',
        entry: 'Entry',
        exit: 'Exit',
        pnl: 'P&L',
        status: 'Status',
        win: 'WIN',
        loss: 'LOSS'
      },
      empty: {
        active: 'No active trades at the moment. Market is quiet.',
        opportunities: 'No high-probability opportunities detected.',
        history: 'No trade history found.'
      },
      premium: {
        activeTitle: 'Active Signals Locked',
        activeDesc: 'Upgrade to Premium to access real-time active trade signals with precise entry and exit points.',
        oppTitle: 'Opportunity Scanner Locked',
        oppDesc: 'Get instant access to AI-powered trading opportunities and market scanners with Premium.',
        historyDelay: 'Free members view trade history with a',
        delayTime: '2-hour delay',
        unlock: 'Unlock Premium Features'
      },
      cards: {
        entry: 'Entry Price',
        mark: 'Mark Price',
        live: 'Live',
        strategy: 'Strategy',
        strength: 'Strength',
        volatility: 'Volatility',
        currentPnl: 'Current P&L'
      }
    },
    details: {
      about: 'About',
      rank: 'Rank',
      marketCap: 'Market Cap',
      website: 'Website',
      close: 'Close',
      loading: 'Loading asset details...'
    },
    portfolio: {
      title: 'Portfolio',
      subtitle: 'Track your trades, profits and performance in one place',
      addTrade: 'Add Trade',
      exportCSV: 'Export CSV',
      exportPDF: 'Export PDF',
      stats: {
        totalProfit: 'Total Profit',
        totalRoi: 'Total ROI',
        totalTrades: 'Total Trades',
        positiveTrades: 'Positive Trades',
        negativeTrades: 'Negative Trades'
      },
      table: {
        date: 'Date',
        symbol: 'Coin',
        type: 'Type',
        entry: 'Entry Price',
        exit: 'Exit Price',
        quantity: 'Quantity',
        resultUsd: 'Result ($)',
        resultPct: 'Result (%)',
        actions: 'Actions',
        empty: 'No trades recorded yet. Add your first trade!'
      },
      modal: {
        title: 'Add New Trade',
        editTitle: 'Edit Trade',
        symbol: 'Coin (e.g. BTCUSDT)',
        type: 'Type',
        entry: 'Entry Price',
        exit: 'Exit Price',
        quantity: 'Quantity',
        date: 'Date & Time',
        save: 'Save Trade',
        cancel: 'Cancel',
        long: 'Long',
        short: 'Short'
      },
      filters: {
        week: 'Week',
        month: 'Month',
        semester: 'Semester',
        all: 'All Time'
      }
    },
    landing: {
      hero: {
        title: 'Flash Signal',
        subtitle: 'Artificial Intelligence for Smarter Crypto Decisions',
        desc: 'Institutional-grade analysis, real-time signals, and automated monitoring to maximize your trading performance.',
        startNow: 'Access Dashboard',
        meetFlash: 'Meet Flash Signal'
      },
      dashboardPreview: {
        title: 'Power at Your Fingertips',
        subtitle: 'Everything you need to trade with confidence, centralized in one professional dashboard.',
        items: [
          { title: 'Real-Time Monitoring', desc: 'Live tracking of top assets with instant updates.' },
          { title: 'Long/Short Signals', desc: 'AI-driven entry points with calculated strength.' },
          { title: 'Volume Analysis', desc: 'Detect trend reversals before they happen.' },
          { title: 'Instant Alerts', desc: 'Never miss a move with automated notifications.' },
          { title: 'Watchlist', desc: 'Track your favorite assets in one place.' },
          { title: 'Trade History', desc: 'Transparent performance tracking and statistics.' }
        ]
      },
      whyChoose: {
        title: 'Why Flash Signal?',
        subtitle: 'Built for traders who demand speed, accuracy, and clarity.',
        items: [
          { title: 'Proprietary Evolutionary AI', desc: 'Unique algorithms that analyze patterns, learn from the market, and continuously adapt to changes.' },
          { title: 'Real-Time Market Data', desc: 'Ultra-low latency market feeds for fast, accurate, and perfectly timed decision-making.' },
          { title: 'Clean & Intelligent Interface', desc: 'Professional, distraction-free design. Only clear, relevant, and actionable data.' },
          { title: 'High Performance', desc: 'Optimized architecture for fast analysis and execution, even during high market volatility.' },
          { title: 'Built for All Skill Levels', desc: 'Easy for beginners, powerful for professional traders — you grow together with the platform.' },
          { title: 'Smart & Context-Aware Signals', desc: 'Signals are never generic. Every alert considers trend, volume, volatility, and momentum.' },
          { title: '24/7 Continuous Monitoring', desc: 'The market never sleeps — Flash Signal doesn’t either. Always-on analysis, all the time.' },
          { title: 'Modular & Scalable Technology', desc: 'A future-ready platform built to support new strategies, markets, and integrations.' },
          { title: 'Reliability & Stability', desc: 'Robust infrastructure focused on security, uptime, and data consistency.' }
        ]
      },
      howItWorks: {
        title: 'How It Works',
        steps: [
          { number: '01', title: 'Access Dashboard', text: 'Log in to your secure trading environment.' },
          { number: '02', title: 'Choose Asset', text: 'Select from top cryptocurrencies to analyze.' },
          { number: '03', title: 'Analyze Signals', text: 'Review AI-generated setups and metrics.' },
          { number: '04', title: 'Decide & Trade', text: 'Execute with confidence based on data.' }
        ]
      },
      finalCta: {
        title: 'Start Using AI in Your Trading Now',
        subtitle: 'Join the community of traders who trust Flash Signal for their daily analysis.',
        cta: 'Enter Dashboard'
      },
      footer: {
        copyright: '© 2026 Flash Signal. All rights reserved.',
        disclaimer: 'Flash Signal does not offer financial advice. Market operations involve risks.'
      },
      header: {
        menu: [
          { label: 'Home', href: '#hero' },
          { label: 'Features', href: '#features' },
          { label: 'Why Flash', href: '#why-choose' },
          { label: 'How it Works', href: '#how-it-works' }
        ],
        cta: 'Access Dashboard'
      }
    }
  },
  pt: {
    nav: {
      dashboard: 'Dashboard',
      signals: 'Sinais',
      alarm: 'Alarme',
      p2p: 'Monitoramento P2P',
      settings: 'Configurações',
      search: 'Buscar ativos...',
      login: 'Entrar',
      signup: 'Criar Conta',
      logout: 'Sair',
      profile: 'Perfil',
      subscription: 'Assinatura',
      myAccount: 'Minha Conta'
    },
    market: {
      title: 'Mercados',
      searchPlaceholder: 'Buscar BTC, ETH...',
      vol: 'Vol 24h',
      signalStrength: 'Força do Sinal',
      noAssets: 'Nenhum ativo encontrado',
      filter: {
        sortBy: 'Ordenar Por',
        topGainers: 'Maiores Altas',
        topLosers: 'Maiores Baixas',
        priceHighLow: 'Preço (Maior para Menor)',
        priceLowHigh: 'Preço (Menor para Maior)',
        volumeHighLow: 'Volume (Maior para Menor)'
      }
    },
    signals: {
      activeTitle: 'Sinais',
      unlockTitle: 'Desbloquear Métricas',
      unlockDesc: 'Acesse sinais e métricas de nível institucional.',
      upgrade: 'Seja Premium',
      entry: 'Entrada',
      current: 'Atual',
      confidence: 'Confiança',
      details: 'Detalhes',
      ago: 'atrás'
    },
    alerts: {
      title: 'Alarme de Preço',
      subtitle: 'Receba notificações instantâneas no Telegram quando os preços atingirem seus alvos.',
      create: 'Criar Novo Alarme',
      active: 'Alarmes Ativos',
      noActive: 'Nenhum alarme ativo. Crie um acima para começar!',
      limitReached: 'Limite atingido. Faça upgrade para mais.',
      asset: 'Ativo',
      condition: 'Condição',
      targetPrice: 'Preço Alvo ($)',
      createButton: 'Criar',
      priceAbove: 'Preço Subir Acima de',
      priceBelow: 'Preço Cair Abaixo de',
      crossesAbove: 'CRUZAR ACIMA',
      crossesBelow: 'CRUZAR ABAIXO',
      target: 'Alvo',
      deleteConfirm: 'Excluir este alarme?'
    },
    settings: {
      title: 'Configurações',
      subtitle: 'Gerencie suas informações pessoais, segurança e preferências.',
      tabs: {
        profile: 'Perfil',
        security: 'Segurança',
        subscription: 'Assinatura',
        notifications: 'Notificações'
      },
      profile: {
        title: 'Informações Pessoais',
        subtitle: 'Atualize sua foto e detalhes pessoais.',
        avatarUrl: 'URL do Avatar',
        avatarDesc: 'Insira uma URL para sua foto de perfil. Formatos suportados: JPG, PNG, GIF.',
        username: 'Nome de Usuário',
        email: 'Endereço de Email',
        save: 'Salvar Alterações',
        success: 'Perfil atualizado com sucesso!',
        error: 'Falha ao atualizar perfil'
      },
      security: {
        title: 'Segurança',
        subtitle: 'Gerencie sua senha e segurança da conta.',
        passwordReq: 'Requisitos de Senha',
        reqList: [
          'Mínimo de 6 caracteres',
          'Use uma mistura de letras, números e símbolos',
          'Evite usar palavras comuns'
        ],
        newPassword: 'Nova Senha',
        confirmPassword: 'Confirmar Nova Senha',
        updatePassword: 'Atualizar Senha',
        matchError: "As senhas não coincidem",
        success: 'Senha atualizada com sucesso!'
      },
      subscription: {
        title: 'Plano de Assinatura',
        subtitle: 'Gerencie seu faturamento e detalhes do plano.',
        currentPlan: 'Plano Atual',
        premium: 'Premium',
        free: 'Gratuito',
        premiumDesc: 'Você tem acesso a todos os recursos premium, incluindo sinais avançados, alertas e análises de desempenho.',
        freeDesc: 'Faça upgrade para Premium para desbloquear sinais avançados, alertas em tempo real e métricas detalhadas.',
        active: 'ATIVO',
        expiresOn: 'Expira em',
        daysLeft: 'dias restantes',
        activate: 'Ativar Assinatura',
        enterKey: 'Insira sua chave de ativação',
        keyPlaceholder: 'Insira sua chave de ativação',
        activateBtn: 'Ativar',
        keyDesc: 'Insira a chave de licença fornecida para atualizar sua conta.',
        success: 'Assinatura ativada com sucesso!',
        benefits: 'Benefícios Premium',
        benefitList: [
          'Alertas de Preço Ilimitados',
          'Acesso Total à Arbitragem P2P Maker',
          'Sinais de Negociação em Tempo Real',
          'Suporte Prioritário'
        ],
        upgrade: 'Fazer Upgrade Agora',
        upgradeDesc: 'Obtenha acesso instantâneo a todos os recursos premium.',
        renew: 'Renovar Assinatura',
        getPremium: 'Obter Acesso Premium',
        paymentNote: 'Pagamentos são processados de forma segura via suporte no Telegram.'
      },
      notifications: {
        title: 'Notificações',
        subtitle: 'Configure como você recebe alertas.',
        setup: 'Instruções de Configuração',
        step1: 'Inicie o bot no Telegram:',
        step2: 'Envie o comando',
        step2Code: '/start',
        step2End: 'para o bot.',
        step3: 'Copie seu Chat ID e cole no campo abaixo.',
        chatId: 'Telegram Chat ID',
        locked: 'Chat ID está permanentemente vinculado.',
        contactSupport: 'Contate o suporte para alterações.',
        save: 'Salvar Chat ID',
        test: 'Enviar Mensagem de Teste',
        testSuccess: 'Mensagem de teste enviada! Verifique o Telegram.',
        testError: 'Falha ao enviar mensagem. Verifique o Chat ID.',
        saveSuccess: 'Configurações do Telegram salvas!'
      }
    },
    chart: {
      vol: 'Vol',
      high: 'Máx',
      low: 'Mín',
      indicators: 'Indicadores',
      style: 'Estilo'
    },
    orderBook: {
      price: 'Preço',
      amount: 'Quant.',
      time: 'Hora',
      total: 'Total'
    },
    indicators: {
      cvd: 'CVD (Delta)',
      oi: 'Interesse em Aberto',
      liq: 'Liquidações',
      rsi: 'RSI'
    },
    auth: {
      welcomeBack: 'Bem-vindo de Volta',
      signInSubtitle: 'Entre para acessar seus sinais de negociação',
      createAccount: 'Criar Conta',
      joinSubtitle: 'Junte-se ao Flash Signal e comece a operar com mais inteligência',
      email: 'Endereço de Email',
      password: 'Senha',
      confirmPassword: 'Confirmar Senha',
      username: 'Nome de Usuário',
      signIn: 'Entrar',
      signUp: 'Inscrever-se',
      noAccount: "Não tem uma conta?",
      hasAccount: 'Já tem uma conta?',
      passMatchError: "As senhas não coincidem",
      genericError: 'Ocorreu um erro',
      success: 'Sucesso',
      emailPlaceholder: 'nome@exemplo.com',
      passwordPlaceholder: 'Digite sua senha',
      confirmPlaceholder: 'Confirme sua senha',
      usernamePlaceholder: 'seunome',
      successModal: {
        title: 'Cadastro Realizado!',
        message: 'Sua conta foi criada com sucesso.',
        action: 'Por favor, confirme seu email para continuar.',
        button: 'Ir para Login'
      }
    },
    performancePage: {
      title: 'Análise de Performance',
      comingSoon: 'Análise detalhada de P&L e curvas de patrimônio em breve.'
    },
    premiumGate: {
      title: 'Recurso Premium Bloqueado',
      description: 'Esta seção é reservada para membros premium. Faça upgrade agora para acessar sinais avançados, análises de desempenho e métricas de nível institucional.',
      viewPlans: 'Ver Planos'
    },
    signalsPage: {
      title: 'Sinais & Análise',
      subtitle: 'Sinais de negociação em tempo real alimentados por IA.',
      realTimeActive: 'Dados em Tempo Real Ativos',
      upgrade: 'Seja Premium',
      tabs: {
        active: 'Sinais Ativos',
        opportunities: 'Oportunidades',
        history: 'Histórico'
      },
      table: {
        time: 'Hora',
        symbol: 'Símbolo',
        side: 'Lado',
        setup: 'Setup',
        entry: 'Entrada',
        exit: 'Saída',
        pnl: 'P&L',
        status: 'Status',
        win: 'WIN',
        loss: 'LOSS'
      },
      empty: {
        active: 'Nenhum trade ativo no momento. Mercado está calmo.',
        opportunities: 'Nenhuma oportunidade de alta probabilidade detectada.',
        history: 'Nenhum histórico de trade encontrado.'
      },
      premium: {
        activeTitle: 'Sinais Ativos Bloqueados',
        activeDesc: 'Faça upgrade para Premium para acessar sinais de trade ativos em tempo real com pontos precisos de entrada e saída.',
        oppTitle: 'Scanner de Oportunidades Bloqueado',
        oppDesc: 'Obtenha acesso instantâneo a oportunidades de negociação via IA e scanners de mercado com Premium.',
        historyDelay: 'Membros gratuitos veem o histórico de trades com um',
        delayTime: 'atraso de 2 horas',
        unlock: 'Desbloquear Recursos Premium'
      },
      cards: {
        entry: 'Preço Entrada',
        mark: 'Preço Ref.',
        live: 'Ao Vivo',
        strategy: 'Estratégia',
        strength: 'Força',
        volatility: 'Volatilidade',
        currentPnl: 'P&L Atual'
      }
    },
    details: {
      about: 'Sobre',
      rank: 'Rank',
      marketCap: 'Valor de Mercado',
      website: 'Site',
      close: 'Fechar',
      loading: 'Carregando detalhes...'
    },
    portfolio: {
      title: 'Portfolio',
      subtitle: 'Acompanhe seus trades, lucros e desempenho em um só lugar',
      addTrade: 'Adicionar Trade',
      exportCSV: 'Exportar CSV',
      exportPDF: 'Exportar PDF',
      stats: {
        totalProfit: 'Lucro Total',
        totalRoi: 'ROI Total',
        totalTrades: 'Total de Trades',
        positiveTrades: 'Trades Positivos',
        negativeTrades: 'Trades Negativos'
      },
      table: {
        date: 'Data',
        symbol: 'Moeda',
        type: 'Tipo',
        entry: 'Entrada',
        exit: 'Saída',
        quantity: 'Quantidade',
        resultUsd: 'Resultado ($)',
        resultPct: 'Resultado (%)',
        actions: 'Ações',
        empty: 'Nenhum trade registrado ainda. Adicione seu primeiro trade!'
      },
      modal: {
        title: 'Adicionar Novo Trade',
        editTitle: 'Editar Trade',
        symbol: 'Moeda (ex: BTCUSDT)',
        type: 'Tipo',
        entry: 'Preço de Entrada',
        exit: 'Preço de Saída',
        quantity: 'Quantidade',
        date: 'Data e Hora',
        save: 'Salvar Trade',
        cancel: 'Cancelar',
        long: 'Long',
        short: 'Short'
      },
      filters: {
        week: 'Semana',
        month: 'Mês',
        semester: 'Semestre',
        all: 'Tudo'
      }
    },
    landing: {
      hero: {
        title: 'Flash Signal',
        subtitle: 'Inteligência Artificial para Decisões Cripto Mais Inteligentes',
        desc: 'Análise de nível institucional, sinais em tempo real e monitoramento automatizado para maximizar sua performance no trading.',
        startNow: 'Acessar Dashboard',
        meetFlash: 'Conheça o Flash Signal'
      },
      dashboardPreview: {
        title: 'Poder na Ponta dos Dedos',
        subtitle: 'Tudo o que você precisa para operar com confiança, centralizado em um dashboard profissional.',
        items: [
          { title: 'Monitoramento em Tempo Real', desc: 'Rastreamento ao vivo dos principais ativos com atualizações instantâneas.' },
          { title: 'Sinais Long/Short', desc: 'Pontos de entrada baseados em IA com força calculada.' },
          { title: 'Análise de Volume', desc: 'Detecte reversões de tendência antes que aconteçam.' },
          { title: 'Alertas Instantâneos', desc: 'Nunca perca um movimento com notificações automatizadas.' },
          { title: 'Favoritos', desc: 'Acompanhe seus ativos favoritos em um só lugar.' },
          { title: 'Histórico de Trades', desc: 'Rastreamento transparente de desempenho e estatísticas.' }
        ]
      },
      whyChoose: {
        title: 'Por que Flash Signal?',
        subtitle: 'Construído para traders que exigem velocidade, precisão e clareza.',
        items: [
          { title: 'IA Proprietária Evolutiva', desc: 'Algoritmos exclusivos que analisam padrões, aprendem com o mercado e se adaptam continuamente às mudanças.' },
          { title: 'Dados em Tempo Real', desc: 'Feeds de mercado com latência ultra baixa para decisões rápidas, precisas e no momento certo.' },
          { title: 'Interface Limpa e Inteligente', desc: 'Design profissional sem distrações. Apenas informações relevantes, claras e acionáveis.' },
          { title: 'Alta Performance', desc: 'Arquitetura otimizada para análise e execução ágil, mesmo em momentos de alta volatilidade.' },
          { title: 'Para Todos os Níveis', desc: 'Fácil para iniciantes, avançado para traders experientes você evolui junto com a plataforma.' },
          { title: 'Sinais Inteligentes e Contextuais', desc: 'Os sinais não são genéricos cada alerta considera tendência, volume, volatilidade e momentum.' },
          { title: 'Monitoramento Contínuo 24/7', desc: 'O mercado nunca dorme o Flash Signal também não. Análises ativas o tempo todo.' },
          { title: 'Tecnologia Modular e Escalável', desc: 'Plataforma preparada para novas estratégias, mercados e integrações futuras.' },
          { title: 'Confiabilidade e Estabilidade', desc: 'Infraestrutura robusta focada em segurança, disponibilidade e consistência dos dados.' }
        ]
      },
      howItWorks: {
        title: 'Como Funciona',
        steps: [
          { number: '01', title: 'Acesse o Dashboard', text: 'Faça login no seu ambiente de negociação seguro.' },
          { number: '02', title: 'Escolha o Ativo', text: 'Selecione entre as principais criptomoedas para analisar.' },
          { number: '03', title: 'Analise os Sinais', text: 'Revise setups e métricas gerados pela IA.' },
          { number: '04', title: 'Decida e Opere', text: 'Execute com confiança baseada em dados.' }
        ]
      },
      finalCta: {
        title: 'Comece Agora a Usar IA no seu Trading',
        subtitle: 'Junte-se à comunidade de traders que confiam no Flash Signal para suas análises diárias.',
        cta: 'Entrar no Dashboard'
      },
      footer: {
        copyright: '© 2026 Flash Signal. Todos os direitos reservados.',
        disclaimer: 'Flash Signal não oferece aconselhamento financeiro. Operações no mercado envolvem riscos.'
      },
      header: {
        menu: [
          { label: 'Início', href: '#hero' },
          { label: 'Funcionalidades', href: '#features' },
          { label: 'Por que Flash', href: '#why-choose' },
          { label: 'Como Funciona', href: '#how-it-works' }
        ],
        cta: 'Acessar Dashboard'
      }
    }
  }
};
