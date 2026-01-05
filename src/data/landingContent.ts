import { 
  BarChart2, 
  Cpu, 
  Bell, 
  History, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  Layout, 
  RefreshCw, 
  Target 
} from 'lucide-react';

export const landingContent = {
  header: {
    menu: [
      { label: 'Início', href: '#hero' },
      { label: 'Plataforma', href: '#platform' },
      { label: 'Por que Escolher', href: '#why-choose' },
      { label: 'Planos', href: '#pricing' },
      { label: 'Sobre Nós', href: '#about' },
      { label: 'FAQ', href: '#faq' },
    ],
    cta: 'Acessar Dashboard'
  },
  hero: {
    title: 'Flash Signal',
    subtitle: 'Inteligência Artificial que transforma dados em decisões lucrativas',
    subtitleEn: 'AI-powered trading signals for smarter market decisions',
    description: 'Análises avançadas, sinais inteligentes e monitoramento contínuo do mercado, tudo impulsionado por Inteligência Artificial.',
    ctaPrimary: 'Acessar Dashboard',
    ctaSecondary: 'Conheça o Flash Signal'
  },
  aboutProduct: {
    title: 'Conheça o Flash Signal',
    textPt: 'O Flash Signal é uma plataforma desenvolvida para traders que buscam vantagem estratégica, utilizando Inteligência Artificial para identificar padrões, tendências e oportunidades reais de mercado.',
    textEn: 'Flash Signal delivers AI-driven insights, alerts, and trading signals to support informed decision-making.'
  },
  features: {
    title: 'O que o Flash Signal faz',
    items: [
      {
        icon: BarChart2,
        titlePt: 'Análise de Mercado em Tempo Real',
        titleEn: 'Real-time market analysis'
      },
      {
        icon: Cpu,
        titlePt: 'Geração de Sinais por IA',
        titleEn: 'AI-based trading signals'
      },
      {
        icon: Bell,
        titlePt: 'Alertos Inteligentes',
        titleEn: 'Smart alerts for key market movements'
      },
      {
        icon: History,
        titlePt: 'Análise de Dados Históricos',
        titleEn: 'Historical data pattern recognition'
      },
      {
        icon: Zap,
        titlePt: 'Alta Performance e Precisão',
        titleEn: 'High-performance data processing'
      }
    ]
  },
  whyChoose: {
    title: 'Por que Escolher o Flash Signal?',
    subtitle: 'Built for traders who value data, speed, and intelligence.',
    items: [
      { icon: Cpu, text: 'Tecnologia de IA de última geração' },
      { icon: TrendingUp, text: 'Decisões baseadas em dados, não emoção' },
      { icon: Layout, text: 'Interface simples e profissional' },
      { icon: RefreshCw, text: 'Atualizações constantes' },
      { icon: Target, text: 'Foco total em performance e precisão' }
    ]
  },
  howItWorks: {
    title: 'Como Funciona',
    steps: [
      { number: '01', text: 'Acesse o Dashboard' },
      { number: '02', text: 'A IA analisa o mercado continuamente' },
      { number: '03', text: 'Sinais e alertas são gerados' },
      { number: '04', text: 'Você decide quando operar' }
    ]
  },
  pricing: {
    title: 'Planos de Acesso ao Flash Signal',
    subtitle: 'Simple pricing. Powerful intelligence.',
    monthly: {
      title: 'PLANO MENSAL',
      priceBr: 'R$ 299,00',
      periodBr: '/ mês',
      priceInt: 'US$ 55.00',
      periodInt: '/ month',
      features: [
        'Acesso completo ao Dashboard',
        'Sinais gerados por IA',
        'Alertos inteligentes',
        'Atualizações contínuas'
      ],
      cta: 'Acessar Dashboard'
    },
    annual: {
      title: 'PLANO ANUAL',
      badge: 'Mais vantajoso',
      priceBr: 'R$ 1.499,00',
      periodBr: '/ ano',
      priceInt: 'US$ 276.41',
      periodInt: '/ year',
      features: [
        'Todos os recursos do plano mensal',
        'Melhor custo-benefício',
        'Prioridade em novas features'
      ],
      cta: 'Acessar Dashboard'
    }
  },
  aboutUs: {
    title: 'Sobre o Flash Signal',
    textPt: 'O Flash Signal nasceu da união entre tecnologia, dados e mercado financeiro. Nosso foco é entregar uma plataforma robusta, confiável e inteligente para traders que buscam operar com mais clareza e eficiência.',
    textEn: 'We combine AI, data science, and market intelligence to empower smarter trading decisions.'
  },
  faq: {
    title: 'Perguntas Frequentes',
    items: [
      {
        q: 'O Flash Signal realiza operações automaticamente?',
        a: 'Não. Ele fornece sinais e análises. A decisão final é sempre do usuário.'
      },
      {
        q: 'Existe garantia de lucro?',
        a: 'Não. Trading envolve riscos. O Flash Signal é uma ferramenta de apoio.'
      },
      {
        q: 'Preciso conectar minha corretora?',
        a: 'Não é obrigatório.'
      },
      {
        q: 'Funciona para iniciantes?',
        a: 'Sim. A interface é simples, porém poderosa.'
      },
      {
        q: 'Como faço para acessar?',
        a: 'Clique em Acessar Dashboard.'
      }
    ]
  },
  finalCta: {
    title: 'Comece agora a operar com Inteligência Artificial',
    subtitle: 'Transforme dados em decisões estratégicas com o Flash Signal',
    cta: 'Acessar Dashboard'
  },
  footer: {
    copyright: '© 2026 Flash Signal. Todos os direitos reservados.',
    disclaimerPt: 'Flash Signal não oferece aconselhamento financeiro. Operações no mercado envolvem riscos.',
    disclaimerEn: 'Flash Signal does not provide financial advice.'
  }
};
