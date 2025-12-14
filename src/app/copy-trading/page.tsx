'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import LineChart from '@/components/charts/LineChart';
import AccountSwitcher from '@/components/trading/AccountSwitcher';
import { TrendingUp, Users, Award, Bell, MessageCircle, Share2, TrendingDown, Star, Shield, Target, Calendar, DollarSign, Activity, ExternalLink, UserMinus, Settings, BarChart3, BookOpen, User, TrendingDown as TrendingDownIcon, Copy, Brain, Zap, CheckCircle, PlayCircle, UserCheck, Clock, PieChart, LineChart as LineChartIcon, Heart, Sparkles, Globe, Lock, ArrowRight, ArrowDown } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Expert {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  totalReturn: number;
  monthlyReturn: number;
  followers: number;
  copiers: number;
  winRate: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  isVerified: boolean;
  monthlyFee: number;
  yearsSince: number;
  tradingStyle: string;
  specialties: string[];
  avgHoldTime: string;
  socialScore: number;
  performanceData: { name: string; value: number }[];
  recentTrades: {
    symbol: string;
    type: 'buy' | 'sell';
    price: number;
    quantity: number;
    date: string;
    profit?: number;
  }[];
}

interface CopySettings {
  tradePercentage: number;
  allowBuyOnly: boolean;
  allowSellOnly: boolean;
  stopLossPercentage: number;
  takeProfitPercentage: number;
  maxDailyTrades: number;
  tradingHoursOnly: boolean;
}

interface Subscription {
  expertId: string;
  startDate: string;
  amount: number;
  status: 'active' | 'paused';
  autoCopy: boolean;
  settings: CopySettings;
}

interface PendingTrade {
  id: string;
  expertId: string;
  expertName: string;
  expertAvatar: string;
  symbol: string;
  action: 'buy' | 'sell';
  price: number;
  quantity: number;
  timestamp: string;
  reasoning?: string;
}

export default function CopyTrading() {
  const { user, updateBalance } = useAuth();
  const searchParams = useSearchParams();
  const [experts, setExperts] = useState<Expert[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [subscriptionAmount, setSubscriptionAmount] = useState(1000);
  const [autoCopyEnabled, setAutoCopyEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'your-trading' | 'live-feed' | 'portfolio-center' | 'pending-trades'>('dashboard');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [riskLevel, setRiskLevel] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [stopLossEnabled, setStopLossEnabled] = useState(true);
  const [stopLossPercentage, setStopLossPercentage] = useState(5);
  const [maxDailyLoss, setMaxDailyLoss] = useState(2);
  const [portfolioAllocation, setPortfolioAllocation] = useState({
    'alex-rodriguez': 40,
    'sarah-chen': 35,
    'marcus-johnson': 25
  });

  // Pending Trades State
  const [pendingTrades, setPendingTrades] = useState<PendingTrade[]>([]);

  // Live Feed States
  const [liveTrades, setLiveTrades] = useState<any[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<any | null>(null);
  const [showCopyTradeModal, setShowCopyTradeModal] = useState(false);
  const [copyAmount, setCopyAmount] = useState(500);
  const [liveFilter, setLiveFilter] = useState<'all' | 'following' | 'high-risk' | 'low-risk'>('all');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedExpertForVideo, setSelectedExpertForVideo] = useState<any | null>(null);
  const [liveStreamingExperts, setLiveStreamingExperts] = useState<string[]>([]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedSubscriptionForSettings, setSelectedSubscriptionForSettings] = useState<string | null>(null);

  // Default copy settings
  const defaultCopySettings: CopySettings = {
    tradePercentage: 50,
    allowBuyOnly: false,
    allowSellOnly: false,
    stopLossPercentage: 5,
    takeProfitPercentage: 10,
    maxDailyTrades: 0,
    tradingHoursOnly: false
  };

  // Current settings being edited in modal
  const [currentSettings, setCurrentSettings] = useState<CopySettings>(defaultCopySettings);
  const [copyDuration, setCopyDuration] = useState<'until-cancelled' | '7-days' | '30-days' | '90-days' | 'custom'>('until-cancelled');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  const copyTradingTestimonials = [
    {
      name: "Wanda Maximoff",
      role: "Marketing Executive",
      avatar: "👩‍💼",
      rating: 5,
      quote: "I started copy trading 6 months ago with zero experience. Following expert traders has given me a 34% return while I focus on my career. It's like having a personal trading assistant!",
      profit: "+$12,450",
      timeframe: "6 months"
    },
    {
      name: "Neville Longbottom",
      role: "Software Engineer",
      avatar: "👨‍💻",
      rating: 5,
      quote: "As a busy developer, I don't have time to analyze markets. Copy trading lets me diversify across 3 expert strategies automatically. My portfolio is up 28% this year!",
      profit: "+$8,970",
      timeframe: "8 months"
    },
    {
      name: "Ginny Weasley",
      role: "College Student",
      avatar: "👩‍🎓",
      rating: 5,
      quote: "Started with just $500 as a student. Following a conservative trader helped me grow my savings to $850 while learning about investing. Perfect for beginners!",
      profit: "+$350",
      timeframe: "4 months"
    },
    {
      name: "Thor Odinson",
      role: "Business Owner",
      avatar: "👨‍💼",
      rating: 5,
      quote: "Copy trading has revolutionized my investment strategy. I allocate funds across multiple expert traders and my returns have been consistently beating the market by 15%!",
      profit: "+$45,200",
      timeframe: "1 year"
    }
  ];

  const copyTradingFeatures = [
    {
      icon: <Copy className="w-8 h-8" />,
      title: "Automatic Copying",
      description: "Every trade your chosen expert makes is automatically replicated in your account proportionally.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Risk Control",
      description: "Set your own risk limits, stop-losses, and maximum allocation per trade for complete control.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Learn While You Earn",
      description: "See expert reasoning, analysis, and market insights to improve your own trading knowledge.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Social Trading",
      description: "Connect with expert traders, ask questions, and join a community of successful investors.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Transparent Performance",
      description: "View detailed performance metrics, trade history, and risk analysis for every expert.",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Trading",
      description: "Your investments work around the clock, even while you sleep or focus on other priorities.",
      color: "from-teal-500 to-green-500"
    }
  ];

  const steps = [
    {
      step: "1",
      title: "Browse Expert Traders",
      description: "Explore our curated list of verified expert traders with proven track records and transparent performance metrics.",
      icon: <UserCheck className="w-10 h-10" />,
      color: "from-blue-500 to-purple-600"
    },
    {
      step: "2",
      title: "Analyze & Choose",
      description: "Review detailed performance history, trading style, risk level, and specialties to find traders that match your goals.",
      icon: <Target className="w-10 h-10" />,
      color: "from-purple-500 to-pink-500"
    },
    {
      step: "3",
      title: "Set Your Parameters",
      description: "Define your copy trading amount, risk limits, and preferences. You maintain complete control over your investments.",
      icon: <Settings className="w-10 h-10" />,
      color: "from-pink-500 to-red-500"
    },
    {
      step: "4",
      title: "Start Copying & Earning",
      description: "Sit back and watch as expert trades are automatically executed in your account. Monitor performance and adjust anytime.",
      icon: <TrendingUp className="w-10 h-10" />,
      color: "from-green-500 to-blue-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % copyTradingTestimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Read tab from URL query parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['dashboard', 'your-trading', 'live-feed', 'portfolio-center', 'pending-trades'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);

  // Simulate live trades
  useEffect(() => {
    const generateLiveTrade = () => {
      const stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'COIN', 'AMD', 'JPM', 'BAC', 'KO', 'PEP', 'DIS'];
      const actions = ['buy', 'sell'] as const;
      const reasons = [
        'Strong earnings beat expectations',
        'Technical breakout above resistance',
        'Oversold conditions, potential reversal',
        'Momentum building, riding the trend',
        'Taking profits at resistance level',
        'Cutting losses, risk management',
        'Accumulating on dip, long-term value',
        'News catalyst driving price action',
        'Sector rotation opportunity',
        'Chart pattern confirmation'
      ];
      const strategies = ['Day Trade', 'Swing Trade', 'Momentum', 'Value', 'Breakout'];
      const confidence = ['High', 'Medium', 'Low'];

      const expertsList = experts.length > 0 ? experts : [
        { id: '1', name: 'Loki Laufeyson', avatar: '👩‍💼', riskLevel: 'Medium' },
        { id: '2', name: 'Minerva McGonagall', avatar: '👨‍💼', riskLevel: 'Low' },
        { id: '3', name: 'Sam Wilson', avatar: '👨‍💻', riskLevel: 'High' }
      ];

      const randomExpert = expertsList[Math.floor(Math.random() * expertsList.length)];
      const randomStock = stocks[Math.floor(Math.random() * stocks.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const randomPrice = (Math.random() * 500 + 50).toFixed(2);
      const randomQuantity = Math.floor(Math.random() * 50) + 1;

      return {
        id: Date.now() + Math.random(),
        expertId: randomExpert.id,
        expertName: randomExpert.name,
        expertAvatar: randomExpert.avatar,
        symbol: randomStock,
        action: randomAction,
        price: parseFloat(randomPrice),
        quantity: randomQuantity,
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        strategy: strategies[Math.floor(Math.random() * strategies.length)],
        confidence: confidence[Math.floor(Math.random() * confidence.length)],
        riskLevel: randomExpert.riskLevel,
        timestamp: new Date().toISOString(),
        copiedBy: Math.floor(Math.random() * 200) + 10,
        timeAgo: 'Just now'
      };
    };

    // Generate initial trades
    const initialTrades = Array.from({ length: 8 }, () => generateLiveTrade()).map((trade, index) => ({
      ...trade,
      timestamp: new Date(Date.now() - index * 120000).toISOString(),
      timeAgo: index === 0 ? 'Just now' : `${index * 2} min ago`
    }));
    setLiveTrades(initialTrades);

    // Add new trade every 10-30 seconds
    const interval = setInterval(() => {
      const newTrade = generateLiveTrade();
      setLiveTrades(prev => [newTrade, ...prev.slice(0, 19)]); // Keep last 20 trades
    }, Math.random() * 20000 + 10000);

    return () => clearInterval(interval);
  }, [experts]);

  // Set initial live experts (static for prototype)
  useEffect(() => {
    if (experts.length > 0) {
      // Select first 2 experts to be "live" (static)
      const liveIds = experts.slice(0, 2).map(e => e.id);
      setLiveStreamingExperts(liveIds);
    }
  }, [experts]);

  useEffect(() => {
    // Mock expert data
    const mockExperts: Expert[] = [
      {
        id: '1',
        name: 'Draco Malfoy',
        username: '@tech_trader_pro',
        avatar: '👩‍💼',
        bio: 'Tech stock specialist with 8 years experience. Focus on growth stocks and emerging technologies.',
        totalReturn: 145.7,
        monthlyReturn: 12.3,
        followers: 2340,
        copiers: 890,
        winRate: 78.5,
        riskLevel: 'Medium',
        isVerified: true,
        monthlyFee: 49.99,
        yearsSince: 8,
        tradingStyle: 'Growth Investor',
        specialties: ['Tech Stocks', 'AI/ML', 'Semiconductors'],
        avgHoldTime: '3-6 months',
        socialScore: 4.8,
        performanceData: generatePerformanceData(145.7),
        recentTrades: [
          { symbol: 'NVDA', type: 'buy', price: 875.28, quantity: 10, date: '2025-01-08', profit: 234.50 },
          { symbol: 'AAPL', type: 'sell', price: 175.43, quantity: 25, date: '2025-01-07', profit: 156.75 },
          { symbol: 'GOOGL', type: 'buy', price: 138.21, quantity: 15, date: '2025-01-06' }
        ]
      },
      {
        id: '2',
        name: 'Nick Fury',
        username: '@dividend_king',
        avatar: '👨‍💼',
        bio: 'Conservative dividend investor. Steady returns with low volatility approach.',
        totalReturn: 89.2,
        monthlyReturn: 7.8,
        followers: 1890,
        copiers: 1250,
        winRate: 85.2,
        riskLevel: 'Low',
        isVerified: true,
        monthlyFee: 29.99,
        yearsSince: 12,
        tradingStyle: 'Dividend Investor',
        specialties: ['Blue Chips', 'Dividend Aristocrats', 'REITs'],
        avgHoldTime: '2+ years',
        socialScore: 4.6,
        performanceData: generatePerformanceData(89.2),
        recentTrades: [
          { symbol: 'KO', type: 'buy', price: 62.45, quantity: 50, date: '2025-01-08', profit: 87.50 },
          { symbol: 'JNJ', type: 'buy', price: 158.32, quantity: 20, date: '2025-01-07', profit: 65.20 }
        ]
      },
      {
        id: '3',
        name: 'Severus Snape',
        username: '@crypto_stocks',
        avatar: '👨‍💻',
        bio: 'High-growth momentum trader. Specializes in crypto-related stocks and high volatility plays.',
        totalReturn: 234.1,
        monthlyReturn: 18.9,
        followers: 3420,
        copiers: 567,
        winRate: 68.3,
        riskLevel: 'High',
        isVerified: true,
        monthlyFee: 79.99,
        yearsSince: 5,
        tradingStyle: 'Momentum Trader',
        specialties: ['Crypto Stocks', 'High Beta', 'Day Trading'],
        avgHoldTime: '1-4 weeks',
        socialScore: 4.2,
        performanceData: generatePerformanceData(234.1),
        recentTrades: [
          { symbol: 'COIN', type: 'buy', price: 245.67, quantity: 8, date: '2025-01-08', profit: 189.34 },
          { symbol: 'MSTR', type: 'sell', price: 412.89, quantity: 5, date: '2025-01-07', profit: -78.45 }
        ]
      },
      {
        id: '4',
        name: 'Pepper Potts',
        username: '@esg_investor',
        avatar: '👩‍🔬',
        bio: 'ESG and sustainable investing expert. Long-term value creation through responsible investing.',
        totalReturn: 67.8,
        monthlyReturn: 5.4,
        followers: 1560,
        copiers: 890,
        winRate: 82.1,
        riskLevel: 'Low',
        isVerified: true,
        monthlyFee: 34.99,
        yearsSince: 6,
        tradingStyle: 'ESG Investor',
        specialties: ['Clean Energy', 'Sustainable Tech', 'ESG ETFs'],
        avgHoldTime: '1+ years',
        socialScore: 4.7,
        performanceData: generatePerformanceData(67.8),
        recentTrades: [
          { symbol: 'TSLA', type: 'buy', price: 248.42, quantity: 12, date: '2025-01-08', profit: 98.76 },
          { symbol: 'NEE', type: 'buy', price: 78.90, quantity: 30, date: '2025-01-07', profit: 45.60 }
        ]
      }
    ];

    setExperts(mockExperts);

    // Load user subscriptions
    if (user) {
      const userSubs = JSON.parse(localStorage.getItem(`subscriptions_${user.id}`) || '[]');
      setSubscriptions(userSubs);
    }
  }, [user]);

  // Load and generate demo pending trades (PROTOTYPE MODE - always show demo data)
  useEffect(() => {
    if (!user) return;

    // Load existing pending trades
    const storedPending = JSON.parse(localStorage.getItem(`pendingTrades_${user.id}`) || '[]');

    // For prototype: Always show demo pending trades if none exist
    if (storedPending.length === 0) {
      const demoPending: PendingTrade[] = [
        {
          id: 'pending-1',
          expertId: '1',
          expertName: 'Sarah Chen',
          expertAvatar: '👩‍💼',
          symbol: 'NVDA',
          action: 'buy',
          price: 880.50,
          quantity: 12,
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
          reasoning: 'Strong earnings beat expectations. NVDA showing bullish momentum with AI sector growth. Entry point at key support level.'
        },
        {
          id: 'pending-2',
          expertId: '3',
          expertName: 'Alex Rodriguez',
          expertAvatar: '👨‍💻',
          symbol: 'AAPL',
          action: 'sell',
          price: 178.25,
          quantity: 20,
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          reasoning: 'Taking profits at resistance level. AAPL has reached my price target of $178. Risk-reward ratio suggests locking in gains.'
        },
        {
          id: 'pending-3',
          expertId: '1',
          expertName: 'Sarah Chen',
          expertAvatar: '👩‍💼',
          symbol: 'TSLA',
          action: 'buy',
          price: 242.80,
          quantity: 15,
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
          reasoning: 'Tesla breaking out of consolidation pattern. Volume increasing with positive momentum. Good entry for swing trade.'
        }
      ];

      setPendingTrades(demoPending);
      localStorage.setItem(`pendingTrades_${user.id}`, JSON.stringify(demoPending));
    } else {
      setPendingTrades(storedPending);
    }
  }, [user]);

  function generatePerformanceData(totalReturn: number): { name: string; value: number }[] {
    const data = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let currentValue = 10000;

    for (let i = 0; i < 12; i++) {
      const monthlyGain = (totalReturn / 12) * (0.8 + Math.random() * 0.4);
      currentValue += (currentValue * monthlyGain) / 100;
      data.push({
        name: months[i],
        value: currentValue
      });
    }
    return data;
  }

  const handleSubscribe = async (expert: Expert) => {
    if (!user) return;

    if (user.balance < expert.monthlyFee) {
      alert('Insufficient balance to follow this expert');
      return;
    }

    const newSubscription: Subscription = {
      expertId: expert.id,
      startDate: new Date().toISOString(),
      amount: subscriptionAmount,
      status: 'active',
      autoCopy: autoCopyEnabled,
      settings: currentSettings
    };

    const updatedSubs = [...subscriptions, newSubscription];
    setSubscriptions(updatedSubs);
    localStorage.setItem(`subscriptions_${user.id}`, JSON.stringify(updatedSubs));

    updateBalance(user.balance - expert.monthlyFee);

    const mode = autoCopyEnabled ? 'automatically' : 'manually';
    alert(`Successfully following ${expert.name}! You will ${mode} copy their trades with $${subscriptionAmount} allocation.`);
    setShowSubscribeModal(false);
    setSelectedExpert(null);
    setAutoCopyEnabled(true); // Reset to default
    setCurrentSettings(defaultCopySettings); // Reset settings
  };

  const handleUnsubscribe = async (expertId: string) => {
    if (!user) return;

    const expert = experts.find(e => e.id === expertId);
    if (!expert) return;

    const confirmUnsubscribe = window.confirm(
      `Are you sure you want to unfollow ${expert.name}? You will stop copying their trades immediately.`
    );

    if (confirmUnsubscribe) {
      const updatedSubs = subscriptions.map(sub =>
        sub.expertId === expertId ? { ...sub, status: 'paused' as const } : sub
      );
      setSubscriptions(updatedSubs);
      localStorage.setItem(`subscriptions_${user.id}`, JSON.stringify(updatedSubs));

      alert(`Successfully unfollowed ${expert.name}. Your existing positions remain unchanged.`);
    }
  };

  const isSubscribed = (expertId: string) => {
    return subscriptions.some(sub => sub.expertId === expertId && sub.status === 'active');
  };

  const handleApproveTrade = (tradeId: string) => {
    const trade = pendingTrades.find(t => t.id === tradeId);
    if (!trade || !user) return;

    // Execute the trade
    alert(`Trade approved! ${trade.action.toUpperCase()} ${trade.quantity} shares of ${trade.symbol} at $${trade.price}`);

    // Remove from pending
    setPendingTrades(prev => prev.filter(t => t.id !== tradeId));
    localStorage.setItem(`pendingTrades_${user.id}`, JSON.stringify(pendingTrades.filter(t => t.id !== tradeId)));
  };

  const handleRejectTrade = (tradeId: string) => {
    if (!user) return;

    const updatedPending = pendingTrades.filter(t => t.id !== tradeId);
    setPendingTrades(updatedPending);
    localStorage.setItem(`pendingTrades_${user.id}`, JSON.stringify(updatedPending));
    alert('Trade rejected');
  };

  const handleUpdateSettings = (expertId: string) => {
    const subscription = subscriptions.find(sub => sub.expertId === expertId);
    if (!subscription || !user) return;

    const updatedSubs = subscriptions.map(sub =>
      sub.expertId === expertId ? { ...sub, settings: currentSettings } : sub
    );

    setSubscriptions(updatedSubs);
    localStorage.setItem(`subscriptions_${user.id}`, JSON.stringify(updatedSubs));
    setShowSettingsModal(false);
    setSelectedSubscriptionForSettings(null);
    alert('Copy trading settings updated successfully!');
  };

  const openSettingsModal = (expertId: string) => {
    const subscription = subscriptions.find(sub => sub.expertId === expertId);
    if (subscription) {
      setCurrentSettings(subscription.settings);
      setSelectedSubscriptionForSettings(expertId);
      setShowSettingsModal(true);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return 'var(--success)';
      case 'Medium': return 'var(--warning)';
      case 'High': return 'var(--error)';
      default: return 'var(--primary-blue)';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return <Shield className="w-4 h-4" />;
      case 'Medium': return <Target className="w-4 h-4" />;
      case 'High': return <Activity className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getStarsDisplay = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 fill-current" style={{ color: 'var(--warning)' }} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-4 h-4 fill-current opacity-50" style={{ color: 'var(--warning)' }} />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />);
      }
    }
    return stars;
  };

  // Show preview/info page when user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen trading-background">
        <section className="pt-48 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto text-center mb-16">
              <h1 className="text-5xl md:text-7xl font-bold gradient-shift leading-tight mb-6">
                Copy Trading Made Simple
              </h1>
              <p className="text-xl md:text-2xl mb-8" style={{ color: 'var(--text-secondary)' }}>
                Automatically copy trades from expert traders and earn while you learn.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="text-4xl md:text-4xl font-black text-gradient mb-2">X</div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>Active Traders</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-4xl font-black text-gradient mb-2">X</div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>Expert Traders</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-4xl font-black text-gradient mb-2">X</div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>Assets Under Management</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-4xl font-black text-gradient mb-2">X</div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>Positive Returns</div>
              </div>
            </div>

            {/* How It Works */}
            <div className="max-w-4xl mx-auto mb-16">
              <div className="card p-8">
                <h2 className="text-3xl font-bold mb-4 text-center" style={{ color: 'var(--text-primary)' }}>How Copy Trading Works</h2>
                <p className="text-lg text-center mb-8" style={{ color: 'var(--text-secondary)' }}>
                  Start copying expert traders in four simple steps
                </p>

                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Browse Expert Traders</h3>
                      <p style={{ color: 'var(--text-secondary)' }}>Explore our marketplace of verified expert traders. View their performance history, win rates, and trading strategies.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Select a Trader to Copy</h3>
                      <p style={{ color: 'var(--text-secondary)' }}>Choose an expert trader that matches your investment goals and risk tolerance.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                      <span className="text-white font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Set Your Parameters</h3>
                      <p style={{ color: 'var(--text-secondary)' }}>Decide how much to invest, choose between automatic or manual copying, and set your duration preferences.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                      <span className="text-white font-bold">4</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Start Copying</h3>
                      <p style={{ color: 'var(--text-secondary)' }}>Sit back and watch as trades are copied to your account. Monitor performance and adjust settings anytime.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Copy Trading Modes */}
            <div className="max-w-4xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4 text-center" style={{ color: 'var(--text-primary)' }}>Choose Your Copy Trading Mode</h2>
              <p className="text-lg text-center mb-8" style={{ color: 'var(--text-secondary)' }}>
                Two ways to copy trades - pick what works best for you
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card p-6">
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Automatic Copying</h3>
                  <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Trades are executed instantly when your chosen expert makes a move. Completely hands-free.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span style={{ color: 'var(--text-secondary)' }}>Instant trade execution</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span style={{ color: 'var(--text-secondary)' }}>No manual intervention needed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span style={{ color: 'var(--text-secondary)' }}>Set duration and forget</span>
                    </li>
                  </ul>
                </div>

                <div className="card p-6">
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Manual Approval</h3>
                  <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Review each trade before it's executed. You maintain full control over every decision.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">✓</span>
                      <span style={{ color: 'var(--text-secondary)' }}>Review before executing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">✓</span>
                      <span style={{ color: 'var(--text-secondary)' }}>Full control over each trade</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">✓</span>
                      <span style={{ color: 'var(--text-secondary)' }}>Learn from expert strategies</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Call-to-action */}
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Ready to Start Copy Trading?</h2>
              <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
                Join thousands of traders who are already earning with copy trading
              </p>
              <div className="flex gap-4 justify-center">
                <a href="/register" className="btn-primary px-8 py-4">
                  Get Started Now
                </a>
                <a href="/learn" className="btn-secondary px-8 py-4">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const tabs = [
    {
      id: 'dashboard',
      label: 'Learn & Explore',
      icon: BarChart3,
      description: 'Discover copy trading',
      badge: undefined
    },
    {
      id: 'portfolio-center',
      label: 'Portfolio Center',
      icon: Shield,
      description: 'Manage & track portfolio',
      badge: pendingTrades.length > 0 ? pendingTrades.length : undefined // Show pending count
    },
    {
      id: 'your-trading',
      label: 'Expert Traders',
      icon: User,
      description: 'Browse & copy experts',
      badge: undefined
    },
    {
      id: 'live-feed',
      label: 'Live Feed',
      icon: Activity,
      description: 'Real-time trades',
      badge: undefined
    }
  ];

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl p-5 border border-blue-500/30">
        {/* Floating elements */}
        <div className="absolute top-10 left-10 w-10 h-10 rounded-full opacity-20  bg-gradient-to-r from-blue-500 to-cyan-500" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-20 right-20 w-10 h-10 rounded-full opacity-20  bg-gradient-to-r from-purple-500 to-pink-500" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-20 h-20 rounded-full opacity-20  bg-gradient-to-r from-green-500 to-emerald-500" style={{ animationDelay: '2s' }}></div>

        <div className="relative text-center mb-5">
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center transition-opacity duration-1000" style={{ background: 'var(--gradient-primary)' }}>
              <Copy className="w-10 h-10" style={{ color: 'var(--text-primary)' }} />
            </div>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-gradient mb-5 gradient-shift">
            Copy Trading<br />
            <span className="text-gradient">Made Simple</span>
          </h1>
          <p className="text-2xl md:text-3xl max-w-4xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Automatically copy trades from <span className="text-gradient font-bold">expert traders</span> and earn while you learn.
            No experience needed, just choose your strategy and watch your money grow!
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-5">
          <div className="text-center group hover:scale-110 transition-all duration-300">
            <div className="flex justify-center mb-4 opacity-60 group-hover:opacity-100 transition-opacity">
              <Users className="w-10 h-10" style={{ color: 'var(--primary-blue)' }} />
            </div>
            <div className="text-4xl md:text-4xl font-black text-gradient mb-2">X</div>
            <div className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>Active Copy Traders</div>
          </div>
          <div className="text-center group hover:scale-110 transition-all duration-300">
            <div className="flex justify-center mb-4 opacity-60 group-hover:opacity-100 transition-opacity">
              <Award className="w-10 h-10" style={{ color: 'var(--primary-blue)' }} />
            </div>
            <div className="text-4xl md:text-4xl font-black text-gradient mb-2">X</div>
            <div className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>Expert Traders</div>
          </div>
          <div className="text-center group hover:scale-110 transition-all duration-300">
            <div className="flex justify-center mb-4 opacity-60 group-hover:opacity-100 transition-opacity">
              <DollarSign className="w-10 h-10" style={{ color: 'var(--primary-blue)' }} />
            </div>
            <div className="text-4xl md:text-4xl font-black text-gradient mb-2">X</div>
            <div className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>Assets Under Management</div>
          </div>
          <div className="text-center group hover:scale-110 transition-all duration-300">
            <div className="flex justify-center mb-4 opacity-60 group-hover:opacity-100 transition-opacity">
              <TrendingUp className="w-10 h-10" style={{ color: 'var(--primary-blue)' }} />
            </div>
            <div className="text-4xl md:text-4xl font-black text-gradient mb-2">X</div>
            <div className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>Positive Returns</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <button
            onClick={() => setActiveTab('your-trading')}
            className="btn-primary px-10 py-5 text-base font-bold hover:scale-110 transition-all duration-300 group"
          >
            <span className="flex items-center gap-3">
              <PlayCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              Start Copy Trading
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </span>
          </button>
          <button className="btn-secondary px-10 py-5 text-base font-bold hover:scale-110 transition-all duration-300 group">
            <span className="flex items-center gap-3">
              <PlayCircle className="w-6 h-6" />
              Watch Demo
              <Sparkles className="w-6 h-6 group-hover:rotate-180 transition-transform" />
            </span>
          </button>
        </div>
      </div>

      {/* What is Copy Trading Section */}
      <div className="bg-gradient-to-r from-transparent via-blue-500/5 to-transparent py-12 rounded-3xl">
        <div className="card">
          <div className="card-body p-5">
            <div className="text-center mb-5">
              <h2 className="text-base font-bold text-gradient mb-5">What is Copy Trading?</h2>
              <p className="text-base max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Imagine having a personal trading expert making investment decisions for you 24/7. That's exactly what copy trading is!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div>
                    <h3 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                      Automatic Trade Replication
                    </h3>
                    <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      When an expert trader makes a trade, the same trade is automatically executed in your account proportionally.
                      No manual copying, no delays, no missed opportunities.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div>
                    <h3 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                      Learn from the Best
                    </h3>
                    <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      Follow expert traders with proven track records and transparent performance history.
                      Learn their strategies, understand market movements, and grow your knowledge.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div>
                    <h3 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                      You Stay in Control
                    </h3>
                    <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      Set your own risk limits, choose how much to allocate, and stop copying anytime.
                      Your money, your rules, enhanced by expert knowledge.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-morphism p-5 rounded-2xl">
                <div className="text-center mb-5">
                  <h3 className="text-base font-bold text-gradient mb-4">How It Works</h3>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 glass-morphism rounded-xl">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: 'var(--gradient-primary)' }}>
                      1
                    </div>
                    <div>
                      <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>Expert makes a trade</h4>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Buys $1000 of Apple stock</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowDown className="w-8 h-8 " style={{ color: 'var(--primary-blue)' }} />
                  </div>

                  <div className="flex items-center gap-4 p-4 glass-morphism rounded-xl">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: 'var(--gradient-secondary)' }}>
                      2
                    </div>
                    <div>
                      <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>You automatically copy</h4>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Your $500 allocation = $50 Apple stock</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowDown className="w-8 h-8 " style={{ color: 'var(--primary-blue)' }} />
                  </div>

                  <div className="flex items-center gap-4 p-4 glass-morphism rounded-xl">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: 'var(--gradient-accent)' }}>
                      3
                    </div>
                    <div>
                      <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>You both profit together</h4>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Stock goes up 10% = You earn $5</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Copy Trading Section */}
      <div className="card">
        <div className="card-body p-5">
          <div className="text-center mb-5">
            <h2 className="text-base font-bold text-gradient mb-5">Why Choose Copy Trading?</h2>
            <p className="text-base max-w-4xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Whether you're a complete beginner or an experienced investor looking to diversify, copy trading offers unique advantages
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {copyTradingFeatures.map((feature, index) => (
              <div key={index} className="glass-morphism p-5 rounded-xl hover:scale-105 transition-all duration-500 group">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-gradient-to-r ${feature.color} group-hover:rotate-12 transition-transform duration-300`}>
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-base font-bold mb-4 text-center" style={{ color: 'var(--text-primary)' }}>
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-center" style={{ color: 'var(--text-secondary)' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How to Get Started Section */}
      <div className="bg-gradient-to-r from-transparent via-purple-500/5 to-transparent py-12 rounded-3xl">
        <div className="card">
          <div className="card-body p-5">
            <div className="text-center mb-5">
              <h2 className="text-base font-bold text-gradient mb-5">How to Get Started</h2>
              <p className="text-base max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Getting started with copy trading is incredibly simple. Follow these four easy steps to begin your journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {steps.map((step, index) => (
                <div key={index} className="glass-morphism p-5 rounded-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-r ${step.color}`}>
                      <span className="text-sm font-bold text-white">{step.step}</span>
                    </div>
                    <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <button
                onClick={() => setActiveTab('your-trading')}
                className="btn-primary px-10 py-5 text-base font-bold hover:scale-110 transition-all duration-300 group"
              >
                <span className="flex items-center gap-3">
                  <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  Start Your Copy Trading Journey
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 rounded-3xl p-5 text-center border border-blue-500/20">
        <h2 className="text-base font-bold text-gradient mb-5">
          Ready to Start Your Copy Trading Journey?
        </h2>
        <p className="text-2xl mb-5 leading-relaxed max-w-4xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Join thousands of successful copy traders and start building wealth today.
          No experience required, just choose your strategy and watch your money grow!
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center mb-5">
          <button
            onClick={() => setActiveTab('your-trading')}
            className="btn-primary px-10 py-5 text-base font-bold hover:scale-110 transition-all duration-300 group"
          >
            <span className="flex items-center justify-center gap-3">
              <Copy className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              Browse Expert Traders
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </span>
          </button>

          <button className="btn-secondary px-10 py-5 text-base font-bold hover:scale-110 transition-all duration-300 group">
            <span className="flex items-center justify-center gap-3">
              <Brain className="w-6 h-6" />
              Learn More First
              <Sparkles className="w-6 h-6 group-hover:rotate-180 transition-transform" />
            </span>
          </button>
        </div>

        <div className="flex justify-center items-center gap-8 text-sm" style={{ color: 'var(--text-muted)' }}>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Regulated & Secure
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Your Money Protected
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Global Community
          </div>
        </div>
      </div>
    </div>
  );

  const renderYourTrading = () => (
    <div className="space-y-8">
      {/* Following */}
      {subscriptions.filter(sub => sub.status === 'active').length > 0 && (
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold flex items-center" style={{ color: 'var(--text-primary)' }}>
                <Bell className="w-6 h-6 mr-3" style={{ color: 'var(--primary-blue)' }} />
                Following ({subscriptions.filter(sub => sub.status === 'active').length})
              </h2>
              <Link href="/copy-trading-portfolio">
                <button className="btn-primary px-4 py-2 text-sm flex items-center gap-2 hover:scale-105 transition-all duration-300">
                  <BarChart3 className="w-4 h-4" />
                  View Portfolio
                </button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {subscriptions.filter(sub => sub.status === 'active').map(sub => {
                const expert = experts.find(e => e.id === sub.expertId);
                if (!expert) return null;
                const daysSinceStart = Math.floor((new Date().getTime() - new Date(sub.startDate).getTime()) / (1000 * 60 * 60 * 24));

                return (
                  <div key={sub.expertId} className="glass-morphism p-5 rounded-xl border-2 hover:scale-105 transition-all duration-300" style={{ borderColor: 'var(--success)' }}>
                    <Link href={`/expert/${expert.id}`} className="block cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{expert.avatar}</span>
                          <div>
                            <p className="font-bold text-base flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                              {expert.name}
                              {expert.isVerified && <Award className="w-4 h-4" style={{ color: 'var(--primary-blue)' }} />}
                            </p>
                          </div>
                        </div>
                        <span className="status-positive text-xs px-2 py-1">
                          Active
                        </span>
                      </div>
                    </Link>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: 'var(--text-tertiary)' }}>Allocated:</span>
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>${sub.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: 'var(--text-tertiary)' }}>Copy Mode:</span>
                        <span className={`font-semibold px-2 py-0.5 rounded text-xs ${
                          sub.autoCopy
                            ? 'bg-blue-900/30 text-blue-300'
                            : 'bg-purple-900/30 text-purple-300'
                        }`}>
                          {sub.autoCopy ? 'Auto' : 'Manual'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: 'var(--text-tertiary)' }}>Days Active:</span>
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{daysSinceStart}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: 'var(--text-tertiary)' }}>Monthly Fee:</span>
                        <span className="font-semibold" style={{ color: 'var(--success)' }}>${expert.monthlyFee}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        disabled
                        className="py-2 px-2 text-xs flex items-center justify-center gap-1 opacity-50 cursor-not-allowed glass-morphism rounded-lg"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Feed
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleUnsubscribe(sub.expertId);
                        }}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-2 text-xs rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                      >
                        <UserMinus className="w-4 h-4" />
                        Stop
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Expert Traders Grid - Enhanced */}
      <div className="card">
        <div className="card-body">
          <h2 className="text-base font-bold mb-5" style={{ color: 'var(--text-primary)' }}>Available Expert Traders</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {experts.map((expert, index) => {
              const isTopPerformer = expert.totalReturn > 50;
              const isTrending = expert.monthlyReturn > 15;

              return (
                <div
                  key={expert.id}
                  className={`relative glass-morphism rounded-2xl p-5 hover:scale-105 transition-all duration-300 group ${
                    isTopPerformer ? 'border-2 border-yellow-500/50' : 'border border-white/10'
                  }`}
                >
                  {/* Top Badge */}
                  {isTopPerformer && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg z-10">
                      <Star className="w-3 h-3 fill-current" />
                      TOP TRADER
                    </div>
                  )}
                  {isTrending && !isTopPerformer && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg z-10">
                      <TrendingUp className="w-3 h-3" />
                      TRENDING
                    </div>
                  )}

                  {/* Header with Avatar */}
                  <div className="flex items-start justify-between mb-4">
                    <Link href={`/expert/${expert.id}`} className="flex items-center gap-3 flex-1">
                      <div className={`relative text-3xl p-3 rounded-xl ${
                        isTopPerformer
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                          : 'bg-gradient-to-r from-blue-500 to-purple-600'
                      } shadow-lg`}>
                        {expert.avatar}
                        {expert.isVerified && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center border-2 border-white">
                            <Award className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold group-hover:text-blue-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
                          {expert.name}
                        </h3>
                        <p className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 inline-block mt-1">
                          {expert.tradingStyle}
                        </p>
                      </div>
                    </Link>
                    <Link
                      href={`/expert/${expert.id}`}
                      className="px-3 py-2 rounded-lg glass-morphism hover:bg-white/10 transition-all text-xs font-semibold flex items-center gap-1.5"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Visit Profile
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <Link href={`/expert/${expert.id}`} className="block cursor-pointer">

                    {/* Specialty Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {expert.specialties.slice(0, 2).map((specialty, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 rounded-lg font-medium"
                          style={{
                            background: 'var(--glass-bg)',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--glass-border-color)'
                          }}
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>

                    {/* Performance Stats - Highlighted */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="glass-morphism p-3 rounded-lg text-center">
                        <p className="text-lg font-black text-green-400">+{expert.totalReturn}%</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Total</p>
                      </div>
                      <div className="glass-morphism p-3 rounded-lg text-center">
                        <p className="text-lg font-black text-blue-400">+{expert.monthlyReturn}%</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Monthly</p>
                      </div>
                      <div className="glass-morphism p-3 rounded-lg text-center">
                        <p className="text-lg font-black text-purple-400">{expert.winRate}%</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Win Rate</p>
                      </div>
                    </div>

                    {/* Social Proof & Risk */}
                    <div className="flex items-center justify-between mb-4 p-3 rounded-lg glass-morphism">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {expert.copiers.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-4 w-px bg-white/20"></div>
                        <div className="flex items-center gap-1.5">
                          {getRiskIcon(expert.riskLevel)}
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded"
                            style={{
                              color: getRiskColor(expert.riskLevel),
                              background: `${getRiskColor(expert.riskLevel)}15`
                            }}
                          >
                            {expert.riskLevel}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-bold" style={{ color: 'var(--success)' }}>${expert.monthlyFee}</p>
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>per month</p>
                      </div>
                    </div>
                  </Link>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        // Follow trader logic
                        alert('Follow trader functionality');
                      }}
                      className="flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 glass-morphism border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10"
                    >
                      <UserCheck className="w-4 h-4" />
                      Follow
                    </button>
                    {isSubscribed(expert.id) ? (
                      <button
                        className="flex-1 py-3 px-4 rounded-lg font-semibold glass-morphism cursor-default border-2 border-green-500 text-green-400 flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Copying
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedExpert(expert);
                          setShowSubscribeModal(true);
                        }}
                        className="flex-1 btn-primary py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLiveFeed = () => {
    const filteredTrades = liveTrades.filter(trade => {
      if (liveFilter === 'following') {
        return subscriptions.some(sub => sub.expertId === trade.expertId && sub.status === 'active');
      }
      if (liveFilter === 'high-risk') {
        return trade.riskLevel === 'High';
      }
      if (liveFilter === 'low-risk') {
        return trade.riskLevel === 'Low' || trade.riskLevel === 'Medium';
      }
      return true;
    });

    return (
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-red-600/20 via-orange-600/20 to-yellow-600/20 rounded-3xl p-5 border border-red-500/30">
          <div className="absolute top-10 right-10 w-20 h-20 rounded-full opacity-10 transition-opacity duration-1000 bg-gradient-to-r from-red-500 to-orange-500"></div>
          <div className="absolute bottom-10 left-10 w-10 h-10 rounded-full opacity-10 transition-opacity duration-1000 bg-gradient-to-r from-orange-500 to-yellow-500" style={{ animationDelay: '1s' }}></div>

          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-500 transition-opacity duration-1000"></div>
                <h2 className="text-base font-bold text-gradient">Live Trading Feed</h2>
              </div>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Watch expert traders make moves in real-time and copy instantly
              </p>
            </div>
            <div className="text-right">
              <p className="text-base font-bold text-gradient mb-1">{liveTrades.length}</p>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Active Trades</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="glass-morphism p-5 rounded-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-base font-bold" style={{ color: 'var(--success)' }}>{liveTrades.filter(t => t.action === 'buy').length}</p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Buy Signals</p>
              </div>
            </div>
          </div>

          <div className="glass-morphism p-5 rounded-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-base font-bold" style={{ color: 'var(--error)' }}>{liveTrades.filter(t => t.action === 'sell').length}</p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Sell Signals</p>
              </div>
            </div>
          </div>

          <div className="glass-morphism p-5 rounded-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-base font-bold text-gradient">{liveTrades.reduce((sum, t) => sum + t.copiedBy, 0)}</p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Total Copies</p>
              </div>
            </div>
          </div>

          <div className="glass-morphism p-5 rounded-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-base font-bold text-gradient">{experts.length}</p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Active Experts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Streaming Experts */}
        {liveStreamingExperts.length > 0 && (
          <div className="card border-2 border-red-500/30">
            <div className="card-body">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 transition-opacity duration-1000"></div>
                  <h3 className="text-base font-bold text-gradient">Live Now</h3>
                  <span className="text-sm px-3 py-1 rounded-full bg-red-500/20 text-red-300 font-semibold">
                    {liveStreamingExperts.length} Expert{liveStreamingExperts.length > 1 ? 's' : ''} Streaming
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {liveStreamingExperts.map(expertId => {
                  const expert = experts.find(e => e.id === expertId);
                  if (!expert) return null;

                  return (
                    <div
                      key={expertId}
                      className="relative overflow-hidden glass-morphism rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
                      onClick={() => {
                        setSelectedExpertForVideo(expert);
                        setShowVideoModal(true);
                      }}
                    >
                      {/* Video Thumbnail Placeholder */}
                      <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
                        {/* Animated gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 transition-opacity duration-1000"></div>

                        {/* Trading screen mockup */}
                        <div className="relative z-10 text-center">
                          <div className="text-6xl mb-3">{expert.avatar}</div>
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 transition-opacity duration-1000"></div>
                            <span className="text-red-400 font-bold text-sm">LIVE</span>
                          </div>
                        </div>

                        {/* Play button overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <PlayCircle className="w-10 h-10 text-white" />
                          </div>
                        </div>

                        {/* Live badge */}
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center gap-1 transition-opacity duration-1000">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                          LIVE
                        </div>

                        {/* Viewer count */}
                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-semibold flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {Math.floor(Math.random() * 500) + 100}
                        </div>
                      </div>

                      {/* Expert Info */}
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <h4 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{expert.name}</h4>
                          {expert.isVerified && <Award className="w-4 h-4" style={{ color: 'var(--primary-blue)' }} />}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded font-semibold ${
                            expert.riskLevel === 'High' ? 'bg-red-500/20 text-red-300' :
                            expert.riskLevel === 'Medium' ? 'bg-orange-500/20 text-orange-300' :
                            'bg-green-500/20 text-green-300'
                          }`}>
                            {expert.riskLevel} Risk
                          </span>
                          <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300 font-semibold">
                            +{expert.monthlyReturn}% Monthly
                          </span>
                        </div>

                        <button className="w-full mt-4 btn-primary py-2 text-sm flex items-center justify-center gap-2 hover:scale-105 transition-all">
                          <PlayCircle className="w-4 h-4" />
                          Watch Live Stream
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Settings className="w-5 h-5" />
                Filters
              </h3>
            </div>
            <div className="flex gap-3 flex-wrap">
              {[
                { id: 'all', label: 'All Trades', icon: Globe },
                { id: 'following', label: 'Following Only', icon: Heart },
                { id: 'high-risk', label: 'High Risk', icon: Activity },
                { id: 'low-risk', label: 'Low Risk', icon: Shield }
              ].map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setLiveFilter(filter.id as any)}
                    className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105 ${
                      liveFilter === filter.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'glass-morphism hover:bg-white/5'
                    }`}
                    style={liveFilter !== filter.id ? { color: 'var(--text-secondary)' } : {}}
                  >
                    <Icon className="w-4 h-4" />
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Trade Cards */}
        <div className="space-y-4">
          {filteredTrades.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-16">
                <Activity className="w-10 h-10 mx-auto mb-4 opacity-30" style={{ color: 'var(--text-tertiary)' }} />
                <p className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No trades match your filters</p>
                <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters to see more live trades</p>
              </div>
            </div>
          ) : (
            filteredTrades.map((trade, index) => (
              <div
                key={trade.id}
                className="card hover:scale-102 transition-all duration-300 animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="card-body">
                  <div className="flex items-start justify-between gap-5">
                    {/* Left: Expert Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-4xl">{trade.expertAvatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h4 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{trade.expertName}</h4>
                          <span className={`text-xs px-2 py-1 rounded font-semibold ${
                            trade.riskLevel === 'High' ? 'bg-red-500/20 text-red-300' :
                            trade.riskLevel === 'Medium' ? 'bg-orange-500/20 text-orange-300' :
                            'bg-green-500/20 text-green-300'
                          }`}>
                            {trade.riskLevel} Risk
                          </span>
                          {subscriptions.some(sub => sub.expertId === trade.expertId && sub.status === 'active') && (
                            <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300 font-semibold flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              Following
                            </span>
                          )}
                          {liveStreamingExperts.includes(trade.expertId) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const expert = experts.find(ex => ex.id === trade.expertId);
                                if (expert) {
                                  setSelectedExpertForVideo(expert);
                                  setShowVideoModal(true);
                                }
                              }}
                              className="text-xs px-2 py-1 rounded bg-red-500 text-white font-bold flex items-center gap-1 transition-opacity duration-1000 hover:scale-110 transition-all"
                            >
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                              LIVE NOW
                            </button>
                          )}
                        </div>

                        {/* Trade Details */}
                        <div className="flex items-center gap-4 mb-3">
                          <div className={`px-4 py-2 rounded-xl font-bold text-base ${
                            trade.action === 'buy' ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
                          }`}>
                            {trade.action.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{trade.symbol}</p>
                            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                              {trade.quantity} shares @ ${trade.price}
                            </p>
                          </div>
                        </div>

                        {/* Strategy & Confidence */}
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs px-3 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-semibold">
                            {trade.strategy}
                          </span>
                          <span className={`text-xs px-3 py-1 rounded-lg font-semibold ${
                            trade.confidence === 'High' ? 'bg-green-500/20 text-green-300' :
                            trade.confidence === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-gray-500/20 text-gray-300'
                          }`}>
                            {trade.confidence} Confidence
                          </span>
                        </div>

                        {/* Reason */}
                        <div className="p-4 rounded-xl glass-morphism mb-3">
                          <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                            💬 Expert's Note:
                          </p>
                          <p className="text-base" style={{ color: 'var(--text-primary)' }}>"{trade.reason}"</p>
                        </div>

                        {/* Social Proof */}
                        <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{trade.copiedBy} people copied this</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{trade.timeAgo}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Copy Button */}
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => {
                          setSelectedTrade(trade);
                          setShowCopyTradeModal(true);
                        }}
                        className="btn-primary px-8 py-4 rounded-xl font-bold text-base flex items-center gap-2 hover:scale-110 transition-all duration-300 whitespace-nowrap"
                      >
                        <Copy className="w-5 h-5" />
                        Copy Trade
                      </button>
                      <Link href={`/expert/${trade.expertId}`}>
                        <button className="btn-secondary px-8 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 hover:scale-105 transition-all duration-300 w-full">
                          <User className="w-4 h-4" />
                          View Profile
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderPortfolioCenter = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-cyan-600/20 rounded-3xl p-5 border border-purple-500/30">
        <div className="absolute top-10 right-10 w-20 h-20 rounded-full opacity-10 transition-opacity duration-1000 bg-gradient-to-r from-purple-500 to-pink-500"></div>
        <div className="absolute bottom-10 left-10 w-10 h-10 rounded-full opacity-10 transition-opacity duration-1000 bg-gradient-to-r from-blue-500 to-cyan-500" style={{ animationDelay: '1s' }}></div>

        <div className="relative">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-gradient mb-2">Portfolio Analytics</h2>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Comprehensive insights into your copy trading performance
              </p>
            </div>
            <button
              disabled
              className="px-6 py-3 flex items-center gap-2 rounded-lg opacity-50 cursor-not-allowed glass-morphism"
            >
              <PieChart className="w-5 h-5" />
              <span>Manage Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Performance Overview - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="relative overflow-hidden bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-2xl p-5 border border-green-500/30 hover:scale-105 transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 bg-gradient-to-r from-green-400 to-emerald-400 translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-300 font-semibold">+12.4% MTD</span>
            </div>
            <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Total Return</h3>
            <p className="text-3xl font-black text-gradient">+24.7%</p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>$2,470 profit this month</p>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-2xl p-5 border border-blue-500/30 hover:scale-105 transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 bg-gradient-to-r from-blue-400 to-cyan-400 translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-semibold">Top 15%</span>
            </div>
            <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Win Rate</h3>
            <p className="text-3xl font-black text-gradient">73.5%</p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>97 winning / 35 losing trades</p>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl p-5 border border-purple-500/30 hover:scale-105 transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 bg-gradient-to-r from-purple-400 to-pink-400 translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold">Excellent</span>
            </div>
            <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Sharpe Ratio</h3>
            <p className="text-3xl font-black text-gradient">1.82</p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>Risk-adjusted returns</p>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-2xl p-5 border border-orange-500/30 hover:scale-105 transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 bg-gradient-to-r from-orange-400 to-red-400 translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 font-semibold">Moderate</span>
            </div>
            <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Max Drawdown</h3>
            <p className="text-3xl font-black text-gradient">-8.3%</p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>Largest peak-to-trough decline</p>
          </div>
        </div>
      </div>

      {/* Performance Chart & Expert Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="lg:col-span-2 card">
          <div className="card-body">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <LineChartIcon className="w-6 h-6" style={{ color: 'var(--primary-blue)' }} />
                  Portfolio Performance
                </h3>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Your combined expert trading performance</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 text-sm font-semibold hover:bg-blue-500/30 transition-colors">1M</button>
                <button className="px-4 py-2 rounded-lg glass-morphism text-sm hover:bg-white/5 transition-colors" style={{ color: 'var(--text-secondary)' }}>3M</button>
                <button className="px-4 py-2 rounded-lg glass-morphism text-sm hover:bg-white/5 transition-colors" style={{ color: 'var(--text-secondary)' }}>1Y</button>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center rounded-xl glass-morphism">
              <div className="text-center">
                <TrendingUp className="w-10 h-10 mx-auto mb-4" style={{ color: 'var(--primary-blue)' }} />
                <p style={{ color: 'var(--text-secondary)' }}>Performance chart visualization</p>
              </div>
            </div>
          </div>
        </div>

        {/* Expert Performance Breakdown */}
        <div className="card">
          <div className="card-body">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Users className="w-5 h-5" />
              Expert Breakdown
            </h3>
            <div className="space-y-4">
              {subscriptions.filter(sub => sub.status === 'active').length > 0 ? (
                subscriptions.filter(sub => sub.status === 'active').map(sub => {
                  const expert = experts.find(e => e.id === sub.expertId);
                  if (!expert) return null;
                  const performanceColor = expert.monthlyReturn > 10 ? 'from-green-500 to-emerald-500' : expert.monthlyReturn > 5 ? 'from-blue-500 to-cyan-500' : 'from-orange-500 to-red-500';

                  return (
                    <div key={sub.expertId} className="glass-morphism p-4 rounded-xl hover:scale-105 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{expert.avatar}</span>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{expert.name}</h4>
                          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>${sub.amount.toLocaleString()} allocated</p>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-bold" style={{ color: 'var(--success)' }}>+{expert.monthlyReturn}%</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div className={`h-2 rounded-full bg-gradient-to-r ${performanceColor}`} style={{ width: `${Math.min(expert.monthlyReturn * 5, 100)}%` }}></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: 'var(--text-tertiary)' }} />
                  <p style={{ color: 'var(--text-secondary)' }}>No active subscriptions</p>
                  <button onClick={() => setActiveTab('your-trading')} className="btn-primary px-4 py-2 mt-4 text-sm">Browse Experts</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pending Trades & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Trades Section */}
        {pendingTrades.length > 0 ? (
          <div className="space-y-5">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-orange-600/20 via-yellow-600/20 to-amber-600/20 rounded-2xl p-4 border border-orange-500/30">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 bg-gradient-to-r from-orange-400 to-yellow-400 translate-x-16 -translate-y-16"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-gradient mb-1">Pending Trade Approvals</h2>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Review and approve trades from experts you follow
                  </p>
                </div>
                <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30">
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Pending</p>
                  <p className="text-xl font-black text-gradient">{pendingTrades.length}</p>
                </div>
              </div>
            </div>

            {/* Pending Trades List */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
              {pendingTrades.map((trade) => {
                const expert = experts.find(e => e.id === trade.expertId);
                const subscription = subscriptions.find(s => s.expertId === trade.expertId);

                return (
                  <div key={trade.id} className="card hover:shadow-lg transition-shadow duration-200">
                    <div className="p-4">
                      {/* Header Row - Expert & Action */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{trade.expertAvatar}</div>
                          <div>
                            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                              {trade.expertName}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                              {new Date(trade.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(trade.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1.5 rounded-lg font-bold text-sm ${
                          trade.action === 'buy'
                            ? 'bg-green-500/20 text-green-400 border-2 border-green-500/40'
                            : 'bg-red-500/20 text-red-400 border-2 border-red-500/40'
                        }`}>
                          {trade.action.toUpperCase()}
                        </span>
                      </div>

                      {/* Trade Details Grid */}
                      <div className="grid grid-cols-4 gap-4 mb-3 p-3 glass-morphism rounded-lg">
                        <div>
                          <p className="text-xs mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Symbol</p>
                          <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{trade.symbol}</p>
                        </div>
                        <div>
                          <p className="text-xs mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Quantity</p>
                          <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{trade.quantity} shares</p>
                        </div>
                        <div>
                          <p className="text-xs mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Price</p>
                          <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>${trade.price.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Total Cost</p>
                          <p className="text-base font-bold" style={{ color: 'var(--primary-blue)' }}>
                            ${(trade.price * trade.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleRejectTrade(trade.id)}
                          className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 border-2 border-red-500/30 hover:border-red-500 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:scale-[1.02]"
                        >
                          Reject Trade
                        </button>
                        <button
                          onClick={() => handleApproveTrade(trade.id)}
                          className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02]"
                        >
                          Approve & Execute
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="card p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Quick Actions</h3>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Manage all pending trades
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to reject all ${pendingTrades.length} pending trades?`)) {
                      setPendingTrades([]);
                      if (user) localStorage.setItem(`pendingTrades_${user.id}`, JSON.stringify([]));
                      alert('All pending trades rejected');
                    }
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 border border-red-500/30 hover:border-red-500 bg-red-500/10 hover:bg-red-500/20 text-red-400"
                >
                  Reject All
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="card-body text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>All Caught Up!</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                No pending trades to review at the moment.
              </p>
            </div>
          </div>
        )}

        {/* Recent Activity Timeline */}
        <div className="card">
          <div className="card-body">
            <h3 className="text-base font-bold mb-5 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Clock className="w-6 h-6" style={{ color: 'var(--primary-blue)' }} />
              Recent Activity
            </h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
              {[
                { symbol: 'AAPL', action: 'BUY', shares: 15, price: 189.50, profit: +234, expert: 'Sarah Chen', time: '2h ago', status: 'win' },
                { symbol: 'MSFT', action: 'SELL', shares: 8, price: 378.20, profit: +156, expert: 'Sarah Chen', time: '4h ago', status: 'win' },
                { symbol: 'NVDA', action: 'BUY', shares: 5, price: 520.30, profit: -45, expert: 'Marcus Johnson', time: '6h ago', status: 'loss' },
                { symbol: 'GOOGL', action: 'SELL', shares: 12, price: 142.10, profit: +678, expert: 'Alex Rodriguez', time: '1d ago', status: 'win' },
                { symbol: 'TSLA', action: 'BUY', shares: 10, price: 248.42, profit: +89, expert: 'Sarah Chen', time: '1d ago', status: 'win' },
                { symbol: 'COIN', action: 'SELL', shares: 6, price: 245.67, profit: -23, expert: 'Alex Rodriguez', time: '2d ago', status: 'loss' },
              ].map((trade, index) => (
                <div key={index} className="relative pl-8 pb-4 border-l-2 border-gray-700 last:border-l-0">
                  <div className={`absolute left-0 top-0 w-4 h-4 rounded-full -translate-x-[9px] ${
                    trade.status === 'win' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div className="glass-morphism p-4 rounded-xl hover:scale-105 transition-all duration-300">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          trade.action === 'BUY' ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
                        }`}>
                          {trade.action}
                        </div>
                        <div>
                          <h4 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{trade.symbol}</h4>
                          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{trade.shares} shares @ ${trade.price}</p>
                        </div>
                      </div>
                      <div className={`text-right font-bold ${trade.profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {trade.profit > 0 ? '+' : ''}${trade.profit}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: 'var(--text-secondary)' }}>Copied from {trade.expert}</span>
                      <span style={{ color: 'var(--text-tertiary)' }}>{trade.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Smart Risk Controls - Simplified */}
        <div className="card">
          <div className="card-body">
            <h3 className="text-base font-bold mb-5 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Shield className="w-6 h-6" style={{ color: 'var(--primary-blue)' }} />
              Smart Risk Controls
            </h3>

            {/* Risk Profile - Simplified */}
            <div className="mb-5">
              <label className="text-sm font-semibold mb-3 block" style={{ color: 'var(--text-secondary)' }}>
                Risk Profile
              </label>
              <div className="flex gap-2">
                {(['conservative', 'moderate', 'aggressive'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setRiskLevel(level)}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-300 ${
                      riskLevel === level
                        ? 'border-blue-500 bg-blue-500/20 text-white'
                        : 'border-gray-700 glass-morphism'
                    }`}
                    style={riskLevel !== level ? { color: 'var(--text-secondary)' } : {}}
                  >
                    <div className="text-sm font-bold capitalize">{level}</div>
                    <div className="text-xs mt-1">
                      {level === 'conservative' ? '5-10%' : level === 'moderate' ? '10-20%' : '20%+'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stop Loss - Simplified */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Stop Loss Protection
                </label>
                <button
                  onClick={() => setStopLossEnabled(!stopLossEnabled)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    stopLossEnabled ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-lg ${
                    stopLossEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {stopLossEnabled && (
                <div className="glass-morphism p-4 rounded-lg space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Per-Trade Stop Loss</span>
                      <span className="text-sm font-bold text-red-400">{stopLossPercentage}%</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={stopLossPercentage}
                      onChange={(e) => setStopLossPercentage(Number(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${(stopLossPercentage / 20) * 100}%, #374151 ${(stopLossPercentage / 20) * 100}%, #374151 100%)`
                      }}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Daily Loss Limit</span>
                      <span className="text-sm font-bold text-orange-400">{maxDailyLoss}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="10"
                      step="0.5"
                      value={maxDailyLoss}
                      onChange={(e) => setMaxDailyLoss(Number(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #f97316 0%, #f97316 ${(maxDailyLoss / 10) * 100}%, #374151 ${(maxDailyLoss / 10) * 100}%, #374151 100%)`
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Market Insights */}
        <div className="card">
          <div className="card-body">
            <h3 className="text-base font-bold mb-5 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Globe className="w-6 h-6" style={{ color: 'var(--primary-blue)' }} />
              Market Insights
            </h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
              {[
                { title: 'Fed Interest Rate Decision Impact', tag: 'Economics', readTime: '8 min', trend: 'hot' },
                { title: 'Tech Sector Q4 Earnings Preview', tag: 'Earnings', readTime: '12 min', trend: 'trending' },
                { title: 'Risk-On vs Risk-Off Strategies', tag: 'Strategy', readTime: '6 min', trend: 'new' },
                { title: 'Volatility Surge: What to Do', tag: 'Risk', readTime: '10 min', trend: 'hot' },
                { title: 'Dividend Stocks for 2025', tag: 'Income', readTime: '15 min', trend: 'trending' },
              ].map((article, index) => (
                <div key={index} className="glass-morphism p-4 rounded-lg hover:bg-white/5 transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                      article.trend === 'hot' ? 'bg-red-500/20 text-red-300' :
                      article.trend === 'trending' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {article.trend === 'hot' ? 'HOT' : article.trend === 'trending' ? 'TRENDING' : 'NEW'}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded font-semibold bg-blue-500/20 text-blue-300">
                      {article.tag}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm mb-2 group-hover:text-blue-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
                    {article.title}
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>📖 {article.readTime} read</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--primary-blue)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen trading-background">
      {/* Left Sidebar - Fixed */}
      <div className="w-80 glass-morphism border-r border-white/10 p-5 fixed left-0 top-20 overflow-y-auto" style={{ height: 'calc(100vh - 5rem)' }}>
        <div className="mb-8">
          <h1 className="text-base font-bold text-gradient mb-2">Copy Trading</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Follow expert traders automatically
          </p>
        </div>

        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:scale-105 relative ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 glow-effect'
                    : 'glass-morphism hover:bg-white/5'
                }`}
              >
                <Icon
                  className="w-5 h-5"
                  style={{ color: activeTab === tab.id ? 'var(--primary-blue)' : 'var(--text-tertiary)' }}
                />
                <div className="text-left flex-1">
                  <p className={`font-medium ${
                    activeTab === tab.id ? 'text-white' : ''
                  }`}
                  style={activeTab !== tab.id ? { color: 'var(--text-secondary)' } : {}}>
                    {tab.label}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{tab.description}</p>
                </div>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                    {tab.badge}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Stats Section */}
        <div className="mt-8 space-y-4">
          <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Quick Stats</h3>
          <div className="space-y-3">
            <div className="glass-morphism p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Active Subscriptions</span>
                <span className="font-bold text-lg" style={{ color: 'var(--success)' }}>
                  {subscriptions.filter(sub => sub.status === 'active').length}
                </span>
              </div>
            </div>
            <div className="glass-morphism p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Available Experts</span>
                <span className="font-bold text-lg" style={{ color: 'var(--primary-blue)' }}>
                  {experts.length}
                </span>
              </div>
            </div>
            <div className="glass-morphism p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Your Balance</span>
                <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                  ${user?.balance.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 overflow-y-auto ml-80">
        {/* Account Switcher */}
        <div className="flex justify-end mb-4">
          <AccountSwitcher />
        </div>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'portfolio-center' && renderPortfolioCenter()}
        {activeTab === 'your-trading' && renderYourTrading()}
        {activeTab === 'live-feed' && renderLiveFeed()}
      </div>

      {/* Subscribe Modal */}
      {showSubscribeModal && selectedExpert && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm overflow-y-auto p-4">
          <div className="card max-w-4xl w-full my-8">
            <div className="card-body">
              <h2 className="text-xl font-bold text-gradient mb-6">
                Copy {selectedExpert.name}
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Copy Trading Amount */}
                  <div>
                    <label className="block text-base font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                      Total Copy Trading Amount (USD)
                    </label>
                    <input
                      type="number"
                      min="100"
                      max={user.balance}
                      value={subscriptionAmount}
                      onChange={(e) => setSubscriptionAmount(Math.max(100, parseInt(e.target.value) || 100))}
                      className="form-input text-lg"
                    />
                    <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>
                      Minimum: $100 | Available: ${user.balance.toFixed(2)}
                    </p>
                  </div>

                  {/* Copy Mode Selection */}
                  <div className="glass-morphism p-5 rounded-xl">
                    <h4 className="font-semibold text-base mb-4" style={{ color: 'var(--text-primary)' }}>
                      Copy Trading Mode
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all border-2"
                        style={{
                          borderColor: autoCopyEnabled ? 'var(--primary-blue)' : 'var(--glass-border)',
                          background: autoCopyEnabled ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                        }}>
                        <input
                          type="checkbox"
                          checked={autoCopyEnabled}
                          onChange={() => setAutoCopyEnabled(true)}
                          className="w-5 h-5 rounded mt-0.5"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
                            Automatic
                          </p>
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Trades are copied instantly when the expert executes them
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all border-2"
                        style={{
                          borderColor: !autoCopyEnabled ? 'var(--accent-violet)' : 'var(--glass-border)',
                          background: !autoCopyEnabled ? 'rgba(168, 85, 247, 0.1)' : 'transparent'
                        }}>
                        <input
                          type="checkbox"
                          checked={!autoCopyEnabled}
                          onChange={() => setAutoCopyEnabled(false)}
                          className="w-5 h-5 rounded mt-0.5"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
                            Manual Approval
                          </p>
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Review and approve each trade before execution
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right Column - Copy Settings */}
                <div className={`transition-opacity ${!autoCopyEnabled ? 'opacity-40 pointer-events-none' : ''}`}>
                  <div className="glass-morphism p-5 rounded-xl">
                    <h4 className="font-semibold text-base mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                      <Settings className="w-5 h-5" />
                      Copy Settings
                    </h4>

                    <div className="space-y-4">
                      {/* Trade Percentage - shown for both modes */}
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                          Set Percentage Amount Per Trade
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {[25, 50, 75, 100].map((percentage) => (
                            <button
                              key={percentage}
                              onClick={() => setCurrentSettings({...currentSettings, tradePercentage: percentage})}
                              disabled={!autoCopyEnabled}
                              className={`py-2.5 px-3 rounded-lg font-semibold text-sm transition-all ${
                                currentSettings.tradePercentage === percentage
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                  : 'glass-morphism hover:bg-white/10'
                              } ${!autoCopyEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                              style={currentSettings.tradePercentage !== percentage ? { color: 'var(--text-secondary)' } : {}}
                            >
                              {percentage}%
                            </button>
                          ))}
                        </div>
                        <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
                          Percentage of expert's trade size to copy
                        </p>
                      </div>

                      {/* Copy Duration - shown for both modes */}
                      <div>
                        <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                          {autoCopyEnabled ? 'Copy Duration' : 'Notification Duration'}
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="duration"
                              value="until-cancelled"
                              checked={copyDuration === 'until-cancelled'}
                              onChange={(e) => setCopyDuration(e.target.value as any)}
                              disabled={!autoCopyEnabled}
                              className="w-4 h-4"
                            />
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              Until Cancelled
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="duration"
                              value="7-days"
                              checked={copyDuration === '7-days'}
                              onChange={(e) => setCopyDuration(e.target.value as any)}
                              disabled={!autoCopyEnabled}
                              className="w-4 h-4"
                            />
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              7 Days
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="duration"
                              value="30-days"
                              checked={copyDuration === '30-days'}
                              onChange={(e) => setCopyDuration(e.target.value as any)}
                              disabled={!autoCopyEnabled}
                              className="w-4 h-4"
                            />
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              30 Days
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="duration"
                              value="90-days"
                              checked={copyDuration === '90-days'}
                              onChange={(e) => setCopyDuration(e.target.value as any)}
                              disabled={!autoCopyEnabled}
                              className="w-4 h-4"
                            />
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              90 Days
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="duration"
                              value="custom"
                              checked={copyDuration === 'custom'}
                              onChange={(e) => setCopyDuration(e.target.value as any)}
                              disabled={!autoCopyEnabled}
                              className="w-4 h-4"
                            />
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              Custom End Date
                            </span>
                          </label>
                          {copyDuration === 'custom' && (
                            <input
                              type="date"
                              value={customEndDate}
                              onChange={(e) => setCustomEndDate(e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                              disabled={!autoCopyEnabled}
                              className="form-input mt-2"
                            />
                          )}
                        </div>
                        <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
                          {autoCopyEnabled
                            ? 'How long should trades be automatically copied'
                            : 'How long should you receive trade notifications'}
                        </p>
                      </div>

                      {/* Trade Type Filters - shown for both modes */}
                      <div>
                        <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                          Trade Type Filters
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={currentSettings.allowBuyOnly}
                              onChange={(e) => setCurrentSettings({...currentSettings, allowBuyOnly: e.target.checked, allowSellOnly: e.target.checked ? false : currentSettings.allowSellOnly})}
                              className="w-4 h-4 rounded"
                            />
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {autoCopyEnabled ? 'Copy BUY trades only' : 'Show BUY trades only'}
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={currentSettings.allowSellOnly}
                              onChange={(e) => setCurrentSettings({...currentSettings, allowSellOnly: e.target.checked, allowBuyOnly: e.target.checked ? false : currentSettings.allowBuyOnly})}
                              className="w-4 h-4 rounded"
                            />
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {autoCopyEnabled ? 'Copy SELL trades only' : 'Show SELL trades only'}
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Trading Hours Only */}
                      <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={currentSettings.tradingHoursOnly}
                            onChange={(e) => setCurrentSettings({...currentSettings, tradingHoursOnly: e.target.checked})}
                            className="w-4 h-4 rounded"
                          />
                          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {autoCopyEnabled
                              ? 'Copy trades during market hours only (9:30 AM - 4:00 PM ET)'
                              : 'Receive notifications during market hours only (9:30 AM - 4:00 PM ET)'}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-morphism p-5 rounded-xl mb-5">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>Total Amount Allocated:</span>
                  <span className="font-bold text-2xl" style={{ color: 'var(--success)' }}>${subscriptionAmount}</span>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowSubscribeModal(false);
                    setSelectedExpert(null);
                  }}
                  className="btn-secondary flex-1 py-4"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubscribe(selectedExpert)}
                  className="btn-primary flex-1 py-4"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Copy Trade Modal */}
      {showCopyTradeModal && selectedTrade && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="card max-w-lg w-full mx-4">
            <div className="card-body">
              <h2 className="text-base font-bold text-gradient mb-5">
                Copy This Trade
              </h2>

              {/* Trade Summary */}
              <div className="glass-morphism p-5 rounded-xl mb-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{selectedTrade.expertAvatar}</div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{selectedTrade.expertName}</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Expert Trader</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-secondary)' }}>Action:</span>
                    <span className={`font-bold px-3 py-1 rounded text-sm ${
                      selectedTrade.action === 'buy' ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
                    }`}>
                      {selectedTrade.action.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-secondary)' }}>Symbol:</span>
                    <span className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>{selectedTrade.symbol}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-secondary)' }}>Price:</span>
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>${selectedTrade.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-secondary)' }}>Expert Quantity:</span>
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{selectedTrade.quantity} shares</span>
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-6">
                <label className="block text-base font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Your Investment Amount (USD)
                </label>
                <input
                  type="number"
                  min="100"
                  max={user.balance}
                  value={copyAmount}
                  onChange={(e) => setCopyAmount(Math.max(100, parseInt(e.target.value) || 100))}
                  className="form-input text-lg"
                />
                <p className="text-base mt-2" style={{ color: 'var(--text-tertiary)' }}>
                  Minimum: $100 | Available: ${user.balance.toFixed(2)}
                </p>
              </div>

              {/* Calculated Shares */}
              <div className="glass-morphism p-4 rounded-xl mb-5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>You will purchase:</span>
                  <span className="font-bold text-base text-gradient">
                    {Math.floor(copyAmount / selectedTrade.price)} shares
                  </span>
                </div>
                <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
                  At current market price of ${selectedTrade.price}
                </p>
              </div>

              {/* Expert's Note */}
              <div className="p-4 rounded-xl glass-morphism mb-5">
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  💬 Expert's Reasoning:
                </p>
                <p className="text-base italic" style={{ color: 'var(--text-primary)' }}>"{selectedTrade.reason}"</p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowCopyTradeModal(false);
                    setSelectedTrade(null);
                  }}
                  className="btn-secondary flex-1 py-4"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (user.balance < copyAmount) {
                      alert('Insufficient balance');
                      return;
                    }

                    // Save copied trade
                    const copiedTrade = {
                      id: Date.now().toString(),
                      expertId: selectedTrade.expertId,
                      expertName: selectedTrade.expertName,
                      expertAvatar: selectedTrade.expertAvatar,
                      symbol: selectedTrade.symbol,
                      action: selectedTrade.action,
                      shares: Math.floor(copyAmount / selectedTrade.price),
                      entryPrice: selectedTrade.price,
                      currentPrice: selectedTrade.price,
                      status: 'active',
                      openedAt: new Date().toISOString(),
                      copyMode: 'manual'
                    };

                    const copiedTrades = JSON.parse(localStorage.getItem(`copied_trades_${user.id}`) || '[]');
                    copiedTrades.push(copiedTrade);
                    localStorage.setItem(`copied_trades_${user.id}`, JSON.stringify(copiedTrades));

                    alert(`Successfully copied ${selectedTrade.expertName}'s ${selectedTrade.action.toUpperCase()} trade for ${selectedTrade.symbol}!`);
                    setShowCopyTradeModal(false);
                    setSelectedTrade(null);
                  }}
                  className="btn-primary flex-1 py-4 flex items-center justify-center gap-2"
                >
                  <Copy className="w-5 h-5" />
                  Confirm Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Copy Settings Modal */}
      {showSettingsModal && selectedSubscriptionForSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm overflow-y-auto p-4">
          <div className="card max-w-4xl w-full my-8">
            <div className="card-body">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gradient">
                  Copy Trading Settings
                </h2>
                <button
                  onClick={() => {
                    setShowSettingsModal(false);
                    setSelectedSubscriptionForSettings(null);
                  }}
                  className="w-8 h-8 rounded-full glass-morphism flex items-center justify-center hover:bg-red-500/20 transition-all"
                >
                  ✕
                </button>
              </div>

              {(() => {
                const expert = experts.find(e => e.id === selectedSubscriptionForSettings);
                const subscription = subscriptions.find(s => s.expertId === selectedSubscriptionForSettings);

                return (
                  <>
                    {expert && (
                      <div className="glass-morphism p-5 rounded-xl mb-6 flex items-center gap-4">
                        <div className="text-5xl">{expert.avatar}</div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{expert.name}</h3>
                        </div>
                        <div className="text-right">
                          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Allocated</p>
                          <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>${subscription?.amount.toLocaleString()}</p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left Column - Mode Selection */}
                      <div>
                        <div className="glass-morphism p-5 rounded-xl">
                          <h4 className="font-semibold text-base mb-4" style={{ color: 'var(--text-primary)' }}>
                            Copy Trading Mode
                          </h4>
                          <div className="space-y-3">
                            <label className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all border-2"
                              style={{
                                borderColor: subscription?.autoCopy ? 'var(--primary-blue)' : 'var(--glass-border)',
                                background: subscription?.autoCopy ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                              }}>
                              <input
                                type="checkbox"
                                checked={subscription?.autoCopy || false}
                                onChange={() => {
                                  if (subscription) {
                                    const updatedSubs = subscriptions.map(sub =>
                                      sub.expertId === selectedSubscriptionForSettings
                                        ? { ...sub, autoCopy: true }
                                        : sub
                                    );
                                    setSubscriptions(updatedSubs);
                                    if (user) localStorage.setItem(`subscriptions_${user.id}`, JSON.stringify(updatedSubs));
                                  }
                                }}
                                className="w-5 h-5 rounded mt-0.5"
                              />
                              <div className="flex-1">
                                <p className="font-semibold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
                                  Automatic
                                </p>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                  Trades are copied instantly when the expert executes them
                                </p>
                              </div>
                            </label>

                            <label className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all border-2"
                              style={{
                                borderColor: !subscription?.autoCopy ? 'var(--accent-violet)' : 'var(--glass-border)',
                                background: !subscription?.autoCopy ? 'rgba(168, 85, 247, 0.1)' : 'transparent'
                              }}>
                              <input
                                type="checkbox"
                                checked={!subscription?.autoCopy}
                                onChange={() => {
                                  if (subscription) {
                                    const updatedSubs = subscriptions.map(sub =>
                                      sub.expertId === selectedSubscriptionForSettings
                                        ? { ...sub, autoCopy: false }
                                        : sub
                                    );
                                    setSubscriptions(updatedSubs);
                                    if (user) localStorage.setItem(`subscriptions_${user.id}`, JSON.stringify(updatedSubs));
                                  }
                                }}
                                className="w-5 h-5 rounded mt-0.5"
                              />
                              <div className="flex-1">
                                <p className="font-semibold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
                                  Manual Approval
                                </p>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                  Review and approve each trade before execution
                                </p>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Copy Settings */}
                      <div className={`transition-opacity ${!subscription?.autoCopy ? 'opacity-40 pointer-events-none' : ''}`}>
                        <div className="glass-morphism p-5 rounded-xl">
                          <h4 className="font-semibold text-base mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                            <Settings className="w-5 h-5" />
                            Copy Settings
                          </h4>

                          <div className="space-y-4">
                            {/* Trade Percentage */}
                            <div>
                              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                                Set Percentage Amount Per Trade
                              </label>
                              <div className="grid grid-cols-4 gap-2">
                                {[25, 50, 75, 100].map((percentage) => (
                                  <button
                                    key={percentage}
                                    onClick={() => setCurrentSettings({...currentSettings, tradePercentage: percentage})}
                                    disabled={!subscription?.autoCopy}
                                    className={`py-2.5 px-3 rounded-lg font-semibold text-sm transition-all ${
                                      currentSettings.tradePercentage === percentage
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                        : 'glass-morphism hover:bg-white/10'
                                    } ${!subscription?.autoCopy ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    style={currentSettings.tradePercentage !== percentage ? { color: 'var(--text-secondary)' } : {}}
                                  >
                                    {percentage}%
                                  </button>
                                ))}
                              </div>
                              <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
                                Percentage of expert's trade size to copy
                              </p>
                            </div>

                            {/* Settings specific to Automatic mode */}
                            {subscription?.autoCopy && (
                              <>
                                {/* Stop Loss & Take Profit */}
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                                      Stop Loss (%)
                                    </label>
                                    <input
                                      type="number"
                                      min="1"
                                      max="50"
                                      value={currentSettings.stopLossPercentage}
                                      onChange={(e) => setCurrentSettings({...currentSettings, stopLossPercentage: Math.max(1, parseInt(e.target.value) || 5)})}
                                      className="form-input"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                                      Take Profit (%)
                                    </label>
                                    <input
                                      type="number"
                                      min="1"
                                      max="100"
                                      value={currentSettings.takeProfitPercentage}
                                      onChange={(e) => setCurrentSettings({...currentSettings, takeProfitPercentage: Math.max(1, parseInt(e.target.value) || 10)})}
                                      className="form-input"
                                    />
                                  </div>
                                </div>
                                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                                  Automatically exit positions at these thresholds
                                </p>
                              </>
                            )}

                            {/* Settings for Manual mode */}
                            {!subscription?.autoCopy && (
                              <div className="p-3 rounded-lg" style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                  In manual mode, you'll receive notifications for trades matching your filters. You can set stop-loss and take-profit when approving each trade.
                                </p>
                              </div>
                            )}

                            {/* Trade Type Filters */}
                            <div>
                              <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                                Trade Type Filters
                              </label>
                              <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={currentSettings.allowBuyOnly}
                                    onChange={(e) => setCurrentSettings({...currentSettings, allowBuyOnly: e.target.checked, allowSellOnly: e.target.checked ? false : currentSettings.allowSellOnly})}
                                    className="w-4 h-4 rounded"
                                  />
                                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    {subscription?.autoCopy ? 'Copy BUY trades only' : 'Show BUY trades only'}
                                  </span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={currentSettings.allowSellOnly}
                                    onChange={(e) => setCurrentSettings({...currentSettings, allowSellOnly: e.target.checked, allowBuyOnly: e.target.checked ? false : currentSettings.allowBuyOnly})}
                                    className="w-4 h-4 rounded"
                                  />
                                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    {subscription?.autoCopy ? 'Copy SELL trades only' : 'Show SELL trades only'}
                                  </span>
                                </label>
                              </div>
                            </div>

                            {/* Trading Hours Only */}
                            <div>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={currentSettings.tradingHoursOnly}
                                  onChange={(e) => setCurrentSettings({...currentSettings, tradingHoursOnly: e.target.checked})}
                                  className="w-4 h-4 rounded"
                                />
                                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                  {subscription?.autoCopy
                                    ? 'Copy trades during market hours only (9:30 AM - 4:00 PM ET)'
                                    : 'Receive notifications during market hours only (9:30 AM - 4:00 PM ET)'}
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={() => {
                          setShowSettingsModal(false);
                          setSelectedSubscriptionForSettings(null);
                        }}
                        className="flex-1 btn-secondary py-3"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdateSettings(selectedSubscriptionForSettings)}
                        className="flex-1 btn-primary py-3"
                      >
                        Save Settings
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Live Video Modal */}
      {showVideoModal && selectedExpertForVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="w-full max-w-6xl mx-4 relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowVideoModal(false);
                setSelectedExpertForVideo(null);
              }}
              className="absolute -top-12 right-0 text-white hover:text-red-500 transition-colors"
            >
              <div className="flex items-center gap-2 text-base font-semibold">
                <span>Close</span>
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-red-500/20 transition-colors">
                  ✕
                </div>
              </div>
            </button>

            <div className="card overflow-hidden">
              {/* Video Player Area */}
              <div className="relative bg-gradient-to-br from-gray-900 to-black aspect-video flex items-center justify-center">
                {/* Live Badge */}
                <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-red-500 text-white font-bold flex items-center gap-2 z-20 transition-opacity duration-1000">
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                  LIVE
                </div>

                {/* Viewer Count */}
                <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm text-white font-semibold flex items-center gap-2 z-20">
                  <Users className="w-4 h-4" />
                  342 watching
                </div>

                {/* Simulated Video Content */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 transition-opacity duration-1000"></div>

                {/* Trading Screen Mockup */}
                <div className="relative z-10 w-full h-full p-5">
                  <div className="grid grid-cols-3 gap-4 h-full">
                    {/* Left: Expert */}
                    <div className="col-span-1 flex flex-col items-center justify-center">
                      <div className="text-9xl mb-4">{selectedExpertForVideo.avatar}</div>
                      <h3 className="text-base font-bold text-white mb-4">{selectedExpertForVideo.name}</h3>
                      <div className="px-4 py-2 rounded-full bg-green-500/20 text-green-300 font-semibold">
                        +{selectedExpertForVideo.monthlyReturn}% This Month
                      </div>
                    </div>

                    {/* Center: Chart Mockup */}
                    <div className="col-span-2 glass-morphism rounded-xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-gray-400 text-sm">Currently Analyzing</p>
                          <h4 className="text-base font-bold text-white">AAPL - Apple Inc.</h4>
                        </div>
                        <div className="text-right">
                          <p className="text-4xl font-bold text-green-400">$189.50</p>
                          <p className="text-green-400 text-lg">+2.34%</p>
                        </div>
                      </div>

                      {/* Simulated Chart */}
                      <div className="h-64 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-lg flex items-end p-4 gap-2">
                        {Array.from({ length: 20 }, (_, i) => {
                          const height = Math.random() * 100;
                          return (
                            <div
                              key={i}
                              className="flex-1 bg-gradient-to-t from-green-500 to-blue-500 rounded-t opacity-60"
                              style={{ height: `${height}%` }}
                            ></div>
                          );
                        })}
                      </div>

                      {/* Commentary */}
                      <div className="mt-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                        <p className="text-white text-sm italic">
                          "I'm seeing strong momentum here. RSI is showing bullish divergence and we're breaking above the 50-day MA.
                          This could be a good entry point for a swing trade..."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 z-20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                        <PlayCircle className="w-6 h-6 text-white" />
                      </button>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 transition-opacity duration-1000"></div>
                        <span className="text-white font-semibold">Live Stream Active</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors text-sm font-semibold">
                        💬 Chat
                      </button>
                      <button className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors text-sm font-semibold">
                        🔊 Audio
                      </button>
                      <button className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors text-sm font-semibold">
                        ⚙️ Quality
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Bar Below Video */}
              <div className="card-body bg-gradient-to-r from-gray-900 to-black border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gradient mb-2">
                      {selectedExpertForVideo.name}'s Trading Session
                    </h3>
                    <p className="text-gray-400">
                      Live trading and market analysis • {selectedExpertForVideo.tradingStyle} • {selectedExpertForVideo.specialties.join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {!subscriptions.some(sub => sub.expertId === selectedExpertForVideo.id && sub.status === 'active') ? (
                      <button
                        onClick={() => {
                          setSelectedExpert(selectedExpertForVideo);
                          setShowSubscribeModal(true);
                          setShowVideoModal(false);
                          setSelectedExpertForVideo(null);
                        }}
                        className="btn-primary px-6 py-3 flex items-center gap-2 hover:scale-105 transition-all"
                      >
                        <Heart className="w-5 h-5" />
                        Follow {selectedExpertForVideo.name}
                      </button>
                    ) : (
                      <div className="px-6 py-3 rounded-lg bg-green-500/20 text-green-300 font-semibold flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Following
                      </div>
                    )}

                    <Link href={`/expert/${selectedExpertForVideo.id}`}>
                      <button className="btn-secondary px-6 py-3 flex items-center gap-2 hover:scale-105 transition-all">
                        <User className="w-5 h-5" />
                        View Profile
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Recent Trades from this Expert */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h4 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Recent Trades from Stream</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {liveTrades
                      .filter(t => t.expertId === selectedExpertForVideo.id)
                      .slice(0, 3)
                      .map((trade, index) => (
                        <div key={index} className="glass-morphism p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs px-2 py-1 rounded font-bold ${
                              trade.action === 'buy' ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
                            }`}>
                              {trade.action.toUpperCase()}
                            </span>
                            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{trade.timeAgo}</span>
                          </div>
                          <p className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{trade.symbol}</p>
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {trade.quantity} shares @ ${trade.price}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}