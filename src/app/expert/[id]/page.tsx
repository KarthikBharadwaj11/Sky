'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import LineChart from '@/components/charts/LineChart';
import { TrendingUp, TrendingDown, Award, Shield, Target, Activity, Calendar, DollarSign, Users, Star, Clock, BarChart3, MessageCircle, AlertTriangle, CheckCircle, ArrowLeft, Copy, Heart } from 'lucide-react';
import Link from 'next/link';

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
  // Additional detailed info
  experience: string;
  profitPercentage: number;
  averageTradeDuration: string;
  totalTrades: number;
  profitableTrades: number;
  maxDrawdown: number;
  sharpeRatio: number;
  roiLastMonth: number;
  roiLastQuarter: number;
  roiLastYear: number;
  description: string;
}

export default function ExpertProfile({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { user, updateBalance } = useAuth();
  const router = useRouter();
  const [expert, setExpert] = useState<Expert | null>(null);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [subscriptionAmount, setSubscriptionAmount] = useState(1000);
  const [autoCopyEnabled, setAutoCopyEnabled] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'trades'>('overview');

  useEffect(() => {
    // Mock expert data based on ID
    const mockExperts: Expert[] = [
      {
        id: '1',
        name: 'Sarah Chen',
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
          { symbol: 'GOOGL', type: 'buy', price: 138.21, quantity: 15, date: '2025-01-06', profit: 89.23 }
        ],
        experience: '8+ years in tech stock trading with proven track record',
        profitPercentage: 145.7,
        averageTradeDuration: '3-6 months',
        totalTrades: 342,
        profitableTrades: 268,
        maxDrawdown: 12.3,
        sharpeRatio: 1.85,
        roiLastMonth: 12.3,
        roiLastQuarter: 34.2,
        roiLastYear: 78.9,
        description: 'Experienced tech stock specialist with a focus on high-growth companies and emerging technologies. My strategy revolves around identifying undervalued tech stocks before market recognition. I specialize in AI, machine learning, and semiconductor companies with strong fundamentals and growth potential.'
      },
      {
        id: '2',
        name: 'Marcus Johnson',
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
        ],
        experience: '12+ years focused on dividend investing and wealth preservation',
        profitPercentage: 89.2,
        averageTradeDuration: '2+ years',
        totalTrades: 156,
        profitableTrades: 133,
        maxDrawdown: 8.1,
        sharpeRatio: 2.15,
        roiLastMonth: 7.8,
        roiLastQuarter: 21.5,
        roiLastYear: 52.3,
        description: 'Conservative dividend investor with over a decade of experience. My strategy focuses on building long-term wealth through dividend aristocrats and blue-chip stocks. I prioritize capital preservation while generating consistent income streams for my followers.'
      },
      {
        id: '3',
        name: 'Alex Rodriguez',
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
        ],
        experience: '5+ years trading high-volatility crypto and momentum stocks',
        profitPercentage: 234.1,
        averageTradeDuration: '1-4 weeks',
        totalTrades: 892,
        profitableTrades: 609,
        maxDrawdown: 28.5,
        sharpeRatio: 1.35,
        roiLastMonth: 18.9,
        roiLastQuarter: 54.8,
        roiLastYear: 156.7,
        description: 'Aggressive momentum trader specializing in crypto-related stocks and high-beta plays. My approach leverages technical analysis and momentum indicators to capitalize on short to medium-term price movements. High risk, high reward strategy for experienced investors.'
      },
      {
        id: '4',
        name: 'Emma Watson',
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
        ],
        experience: '6+ years in ESG and sustainable investing',
        profitPercentage: 67.8,
        averageTradeDuration: '1+ years',
        totalTrades: 98,
        profitableTrades: 80,
        maxDrawdown: 9.7,
        sharpeRatio: 1.92,
        roiLastMonth: 5.4,
        roiLastQuarter: 18.2,
        roiLastYear: 43.6,
        description: 'Dedicated ESG investor focused on companies creating positive environmental and social impact. My portfolio emphasizes clean energy, sustainable technology, and companies with strong ESG ratings. Long-term value creation through responsible investing.'
      }
    ];

    const foundExpert = mockExperts.find(e => e.id === resolvedParams.id);
    setExpert(foundExpert || null);

    // Check if user is following
    if (user) {
      const subscriptions = JSON.parse(localStorage.getItem(`subscriptions_${user.id}`) || '[]');
      const isFollowingExpert = subscriptions.some((sub: any) => sub.expertId === resolvedParams.id && sub.status === 'active');
      setIsFollowing(isFollowingExpert);
    }
  }, [resolvedParams.id, user]);

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

  const handleFollow = async () => {
    if (!user || !expert) return;

    if (user.balance < expert.monthlyFee) {
      alert('Insufficient balance to follow this expert');
      return;
    }

    const newSubscription = {
      expertId: expert.id,
      startDate: new Date().toISOString(),
      amount: subscriptionAmount,
      status: 'active',
      autoCopy: autoCopyEnabled
    };

    const subscriptions = JSON.parse(localStorage.getItem(`subscriptions_${user.id}`) || '[]');
    subscriptions.push(newSubscription);
    localStorage.setItem(`subscriptions_${user.id}`, JSON.stringify(subscriptions));

    updateBalance(user.balance - expert.monthlyFee);

    const mode = autoCopyEnabled ? 'automatically' : 'manually';
    alert(`Successfully following ${expert.name}! You will ${mode} copy their trades with $${subscriptionAmount} allocation.`);
    setShowFollowModal(false);
    setIsFollowing(true);
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
      case 'Low': return <Shield className="w-5 h-5" />;
      case 'Medium': return <Target className="w-5 h-5" />;
      case 'High': return <Activity className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  if (!expert) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gradient mb-6">Expert not found</h1>
          <Link href="/copy-trading">
            <button className="btn-primary">Back to Copy Trading</button>
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gradient mb-6">
            Please log in to view expert profiles
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/copy-trading">
        <button className="btn-secondary mb-6 flex items-center gap-2 hover:scale-105 transition-all duration-300">
          <ArrowLeft className="w-4 h-4" />
          Back to Experts
        </button>
      </Link>

      {/* Hero Section */}
      <div className="card mb-8">
        <div className="card-body p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Profile Info */}
            <div className="lg:w-1/3">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full">
                  {expert.avatar}
                </div>
                <h1 className="text-4xl font-bold text-gradient mb-2">{expert.name}</h1>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <p className="text-xl" style={{ color: 'var(--text-accent)' }}>{expert.username}</p>
                  {expert.isVerified && <Award className="w-6 h-6" style={{ color: 'var(--primary-blue)' }} />}
                </div>

                {/* Rating */}
                <div className="flex justify-center items-center gap-2 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(expert.socialScore) ? 'fill-current' : ''}`}
                      style={{ color: i < Math.floor(expert.socialScore) ? 'var(--warning)' : 'var(--text-tertiary)' }}
                    />
                  ))}
                  <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    ({expert.socialScore})
                  </span>
                </div>

                {/* Follow Button */}
                {isFollowing ? (
                  <button
                    className="w-full py-4 px-6 rounded-lg font-semibold text-lg glass-morphism border-2 cursor-default mb-4"
                    style={{ borderColor: 'var(--success)', color: 'var(--success)' }}
                  >
                    <CheckCircle className="w-5 h-5 inline mr-2" />
                    Following
                  </button>
                ) : (
                  <button
                    onClick={() => setShowFollowModal(true)}
                    className="w-full btn-primary py-4 px-6 text-lg font-semibold mb-4 hover:scale-105 transition-all duration-300"
                  >
                    <Copy className="w-5 h-5 inline mr-2" />
                    Follow & Copy
                  </button>
                )}

                {/* Monthly Fee */}
                <div className="glass-morphism p-4 rounded-lg mb-4">
                  <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Monthly Fee</p>
                  <p className="text-3xl font-bold" style={{ color: 'var(--success)' }}>${expert.monthlyFee}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-morphism p-4 rounded-lg">
                    <Users className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--primary-blue)' }} />
                    <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{expert.followers.toLocaleString()}</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Followers</p>
                  </div>
                  <div className="glass-morphism p-4 rounded-lg">
                    <Copy className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--primary-purple)' }} />
                    <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{expert.copiers.toLocaleString()}</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Copiers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Details */}
            <div className="lg:w-2/3">
              {/* Bio */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>About</h3>
                <p className="text-lg leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>{expert.description}</p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="glass-morphism p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold" style={{ color: 'var(--success)' }}>+{expert.totalReturn}%</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Total Return</p>
                </div>
                <div className="glass-morphism p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold" style={{ color: 'var(--primary-blue)' }}>{expert.winRate}%</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Win Rate</p>
                </div>
                <div className="glass-morphism p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold" style={{ color: 'var(--accent-violet)' }}>{expert.sharpeRatio}</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Sharpe Ratio</p>
                </div>
                <div className="glass-morphism p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold" style={{ color: getRiskColor(expert.riskLevel) }}>
                    {expert.riskLevel}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Risk Level</p>
                </div>
              </div>

              {/* Experience & Style */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="glass-morphism p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5" style={{ color: 'var(--primary-blue)' }} />
                    <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Experience</h4>
                  </div>
                  <p style={{ color: 'var(--text-secondary)' }}>{expert.experience}</p>
                </div>
                <div className="glass-morphism p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="w-5 h-5" style={{ color: 'var(--primary-purple)' }} />
                    <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Trading Style</h4>
                  </div>
                  <p style={{ color: 'var(--text-secondary)' }}>{expert.tradingStyle}</p>
                </div>
                <div className="glass-morphism p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5" style={{ color: 'var(--warning)' }} />
                    <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Avg Hold Time</h4>
                  </div>
                  <p style={{ color: 'var(--text-secondary)' }}>{expert.avgHoldTime}</p>
                </div>
                <div className="glass-morphism p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="w-5 h-5" style={{ color: 'var(--error)' }} />
                    <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Max Drawdown</h4>
                  </div>
                  <p style={{ color: 'var(--text-secondary)' }}>{expert.maxDrawdown}%</p>
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {expert.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full text-sm font-medium"
                      style={{
                        background: 'var(--gradient-primary)',
                        color: 'white'
                      }}
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card mb-8">
        <div className="border-b" style={{ borderColor: 'var(--glass-border)' }}>
          <div className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-8 py-4 font-semibold transition-all duration-300 ${
                activeTab === 'overview'
                  ? 'border-b-4 text-blue-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              style={activeTab === 'overview' ? { borderColor: 'var(--primary-blue)' } : {}}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`px-8 py-4 font-semibold transition-all duration-300 ${
                activeTab === 'performance'
                  ? 'border-b-4 text-blue-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              style={activeTab === 'performance' ? { borderColor: 'var(--primary-blue)' } : {}}
            >
              Performance
            </button>
            <button
              onClick={() => setActiveTab('trades')}
              className={`px-8 py-4 font-semibold transition-all duration-300 ${
                activeTab === 'trades'
                  ? 'border-b-4 text-blue-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              style={activeTab === 'trades' ? { borderColor: 'var(--primary-blue)' } : {}}
            >
              Recent Trades
            </button>
          </div>
        </div>

        <div className="card-body p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-morphism p-6 rounded-xl">
                  <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <BarChart3 className="w-5 h-5" />
                    Total Trades
                  </h4>
                  <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{expert.totalTrades}</p>
                  <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                    {expert.profitableTrades} profitable ({((expert.profitableTrades / expert.totalTrades) * 100).toFixed(1)}%)
                  </p>
                </div>

                <div className="glass-morphism p-6 rounded-xl">
                  <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <TrendingUp className="w-5 h-5" />
                    ROI (Last Month)
                  </h4>
                  <p className="text-3xl font-bold" style={{ color: 'var(--success)' }}>+{expert.roiLastMonth}%</p>
                </div>

                <div className="glass-morphism p-6 rounded-xl">
                  <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <Calendar className="w-5 h-5" />
                    ROI (Last Year)
                  </h4>
                  <p className="text-3xl font-bold" style={{ color: 'var(--success)' }}>+{expert.roiLastYear}%</p>
                </div>
              </div>

              <div className="glass-morphism p-6 rounded-xl">
                <h4 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Performance Chart (12 Months)</h4>
                <LineChart
                  data={expert.performanceData}
                  title="Performance History"
                  color="#3B82F6"
                  height={300}
                />
              </div>
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-morphism p-6 rounded-xl text-center">
                  <p className="text-sm mb-2" style={{ color: 'var(--text-tertiary)' }}>Last Month ROI</p>
                  <p className="text-4xl font-bold" style={{ color: 'var(--success)' }}>+{expert.roiLastMonth}%</p>
                </div>
                <div className="glass-morphism p-6 rounded-xl text-center">
                  <p className="text-sm mb-2" style={{ color: 'var(--text-tertiary)' }}>Last Quarter ROI</p>
                  <p className="text-4xl font-bold" style={{ color: 'var(--success)' }}>+{expert.roiLastQuarter}%</p>
                </div>
                <div className="glass-morphism p-6 rounded-xl text-center">
                  <p className="text-sm mb-2" style={{ color: 'var(--text-tertiary)' }}>Last Year ROI</p>
                  <p className="text-4xl font-bold" style={{ color: 'var(--success)' }}>+{expert.roiLastYear}%</p>
                </div>
              </div>

              <div className="glass-morphism p-6 rounded-xl">
                <h4 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Key Performance Metrics</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 rounded-lg" style={{ background: 'var(--background-secondary)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Win Rate</span>
                    <span className="text-xl font-bold" style={{ color: 'var(--success)' }}>{expert.winRate}%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-lg" style={{ background: 'var(--background-secondary)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Sharpe Ratio</span>
                    <span className="text-xl font-bold" style={{ color: 'var(--primary-blue)' }}>{expert.sharpeRatio}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-lg" style={{ background: 'var(--background-secondary)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Max Drawdown</span>
                    <span className="text-xl font-bold" style={{ color: 'var(--error)' }}>{expert.maxDrawdown}%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-lg" style={{ background: 'var(--background-secondary)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Total Return</span>
                    <span className="text-xl font-bold" style={{ color: 'var(--success)' }}>+{expert.totalReturn}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trades Tab */}
          {activeTab === 'trades' && (
            <div className="space-y-4">
              <h4 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Recent Trades</h4>
              {expert.recentTrades.map((trade, index) => (
                <div key={index} className="glass-morphism p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {trade.type === 'buy' ? (
                        <TrendingUp className="w-8 h-8" style={{ color: 'var(--success)' }} />
                      ) : (
                        <TrendingDown className="w-8 h-8" style={{ color: 'var(--error)' }} />
                      )}
                      <div>
                        <h5 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{trade.symbol}</h5>
                        <p style={{ color: 'var(--text-secondary)' }}>
                          {trade.type.toUpperCase()} {trade.quantity} shares @ ${trade.price.toFixed(2)}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{new Date(trade.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {trade.profit !== undefined && (
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                          {((trade.profit / (trade.price * trade.quantity)) * 100).toFixed(2)}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Follow Modal */}
      {showFollowModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="card max-w-md w-full mx-4">
            <div className="card-body">
              <h2 className="text-3xl font-bold text-gradient mb-6">
                Follow {expert.name}
              </h2>

              <div className="mb-6">
                <label className="block text-base font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Copy Trading Amount (USD)
                </label>
                <input
                  type="number"
                  min="100"
                  max={user.balance}
                  value={subscriptionAmount}
                  onChange={(e) => setSubscriptionAmount(Math.max(100, parseInt(e.target.value) || 100))}
                  className="form-input text-lg"
                />
                <p className="text-base mt-2" style={{ color: 'var(--text-tertiary)' }}>
                  Minimum: $100 | Available: ${user.balance.toFixed(2)}
                </p>
              </div>

              <div className="mb-6 glass-morphism p-4 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>Auto-Copy Trades</h4>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {autoCopyEnabled
                        ? 'Trades will be copied automatically'
                        : 'You will approve each trade manually'}
                    </p>
                  </div>
                  <button
                    onClick={() => setAutoCopyEnabled(!autoCopyEnabled)}
                    className={`w-14 h-7 rounded-full transition-all duration-300 ${
                      autoCopyEnabled ? 'bg-blue-500' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-lg ${
                      autoCopyEnabled ? 'translate-x-7' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>

              <div className="glass-morphism p-6 rounded-xl mb-6">
                <div className="text-base space-y-4">
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-secondary)' }}>Monthly Fee:</span>
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>${expert.monthlyFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-secondary)' }}>Copy Amount:</span>
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>${subscriptionAmount}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-4" style={{ borderColor: 'var(--glass-border)' }}>
                    <span style={{ color: 'var(--text-accent)' }}>Total Cost:</span>
                    <span style={{ color: 'var(--success)' }}>${expert.monthlyFee}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowFollowModal(false)}
                  className="btn-secondary flex-1 py-4"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFollow}
                  className="btn-primary flex-1 py-4"
                >
                  Follow Trader
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
