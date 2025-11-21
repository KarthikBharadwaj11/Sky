'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';
import { MessageCircle, Heart, Share2, Clock, Tag, ExternalLink, TrendingUp, TrendingDown, BarChart3, Bookmark, Eye, Award, Users, Zap, Target, BookOpen, Camera, Video, Mic, Send, Smile, Pin, Globe, Calendar, AlertCircle, ThumbsUp, ThumbsDown, Play, PlusCircle, Filter, Search, Bell, Star } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  imageUrl?: string;
  category: 'market' | 'earnings' | 'economics' | 'crypto' | 'politics' | 'breaking';
  relatedStocks?: string[];
  url: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  priority: 'high' | 'medium' | 'low';
}

interface SocialPost {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
    followers: number;
    isExpert?: boolean;
    badges?: string[];
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  type: 'text' | 'trade' | 'prediction' | 'milestone' | 'educational' | 'signal' | 'poll' | 'video';
  attachments?: {
    type: 'chart' | 'image' | 'video';
    url: string;
    title?: string;
  }[];
  stockMentions?: string[];
  tradeData?: {
    action: 'buy' | 'sell';
    symbol: string;
    price: number;
    quantity: number;
    profit?: number;
    percentage?: number;
  };
  pollData?: {
    question: string;
    options: { label: string; votes: number; percentage: number }[];
    totalVotes: number;
    userVoted?: number;
  };
  predictionData?: {
    symbol: string;
    target: number;
    timeframe: string;
    confidence: number;
    reasoning: string;
  };
}

interface MarketSignal {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
    successRate: number;
  };
  type: 'buy' | 'sell' | 'hold';
  symbol: string;
  currentPrice: number;
  targetPrice: number;
  stopLoss: number;
  timeframe: string;
  confidence: number;
  reasoning: string;
  timestamp: string;
  likes: number;
  followers: number;
}

interface TrendingTopic {
  tag: string;
  posts: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  growth: number;
}

export default function SocialFeed() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'for-you' | 'following' | 'news' | 'signals'>('for-you');
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [marketSignals, setMarketSignals] = useState<MarketSignal[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [filter, setFilter] = useState<'all' | 'market' | 'earnings' | 'economics' | 'crypto'>('all');
  const [newPost, setNewPost] = useState('');
  const [showPostComposer, setShowPostComposer] = useState(false);

  useEffect(() => {
    // Enhanced mock news articles
    const mockNews: NewsArticle[] = [
      {
        id: '1',
        title: '🚨 BREAKING: Apple Reports Record Q4 Earnings, Stock Surges 8%',
        summary: 'Apple Inc. exceeded analyst expectations with quarterly revenue of $123.5 billion, driven by strong iPhone 15 sales and growing services revenue. CEO Tim Cook highlights breakthrough in AI integration.',
        source: 'MarketWatch',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        category: 'breaking',
        relatedStocks: ['AAPL'],
        url: '#',
        likes: 1234,
        comments: 267,
        isLiked: false,
        sentiment: 'bullish',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Federal Reserve Signals Potential Rate Cut in Q2 2024',
        summary: 'Fed Chair Jerome Powell hints at monetary policy easing as inflation shows signs of cooling to target levels. Markets rally on dovish commentary.',
        source: 'Reuters',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        category: 'economics',
        relatedStocks: ['SPY', 'QQQ', 'IWM'],
        url: '#',
        likes: 2456,
        comments: 523,
        isLiked: true,
        sentiment: 'bullish',
        priority: 'high'
      },
      {
        id: '3',
        title: 'Tesla Unveils Revolutionary Battery Technology',
        summary: 'Elon Musk demonstrates new 4680 battery cells that could cut production costs by 50% and increase range by 40%. Major breakthrough for EV industry.',
        source: 'Electrek',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        category: 'market',
        relatedStocks: ['TSLA', 'PANW'],
        url: '#',
        likes: 1876,
        comments: 445,
        isLiked: false,
        sentiment: 'bullish',
        priority: 'medium'
      },
      {
        id: '4',
        title: 'Bitcoin Breaks $45,000 Resistance After ETF Approval Rumors',
        summary: 'Cryptocurrency markets surge as institutional adoption accelerates. Major banks reportedly preparing Bitcoin custody services.',
        source: 'CoinDesk',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        category: 'crypto',
        relatedStocks: ['BTC', 'ETH'],
        url: '#',
        likes: 3421,
        comments: 789,
        isLiked: true,
        sentiment: 'bullish',
        priority: 'high'
      },
      {
        id: '5',
        title: 'Amazon Web Services Reports 35% Growth in Cloud Revenue',
        summary: 'AWS continues to dominate enterprise cloud infrastructure with major enterprise migrations and AI service adoption driving unprecedented growth.',
        source: 'TechCrunch',
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        category: 'earnings',
        relatedStocks: ['AMZN', 'MSFT'],
        url: '#',
        likes: 987,
        comments: 234,
        isLiked: false,
        sentiment: 'bullish',
        priority: 'medium'
      }
    ];

    const mockSocialPosts: SocialPost[] = [
      {
        id: '1',
        user: { name: 'Alex Rodriguez', avatar: '🔥', verified: true, followers: 45600, isExpert: true, badges: ['Top Trader'] },
        content: 'Just closed my $AAPL position with a 23% gain! The earnings beat was exactly what I predicted last week. Sometimes patience really pays off in this market.',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        likes: 234,
        comments: 45,
        shares: 12,
        isLiked: false,
        type: 'trade',
        stockMentions: ['AAPL'],
        tradeData: {
          action: 'sell',
          symbol: 'AAPL',
          price: 189.50,
          quantity: 100,
          profit: 3450,
          percentage: 23.2
        }
      },
      {
        id: '2',
        user: { name: 'Sarah Chen', avatar: '👩‍💼', verified: true, followers: 32400, isExpert: true, badges: ['Crypto Expert'] },
        content: 'Market prediction: $BTC will test $50k resistance within the next 2 weeks. The institutional buying pressure is building up nicely. What do you think?',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        likes: 567,
        comments: 89,
        shares: 34,
        isLiked: true,
        type: 'prediction',
        stockMentions: ['BTC'],
        predictionData: {
          symbol: 'BTC',
          target: 50000,
          timeframe: '2 weeks',
          confidence: 78,
          reasoning: 'Institutional buying pressure and technical breakout patterns'
        }
      },
      {
        id: '3',
        user: { name: 'Marcus Johnson', avatar: '👨‍💻', verified: false, followers: 8900, badges: ['Rising Star'] },
        content: 'Sharing my portfolio milestone today! 🎉 Finally hit 6-figure returns this year. Started with $10k in January, now sitting at $167k. Mainly focused on tech growth stocks and some crypto positions.',
        timestamp: new Date(Date.now() - 2700000).toISOString(),
        likes: 1243,
        comments: 156,
        shares: 67,
        isLiked: false,
        type: 'milestone',
        stockMentions: []
      },
      {
        id: '4',
        user: { name: 'Emily Davis', avatar: '📊', verified: true, followers: 67800, isExpert: true, badges: ['Technical Analyst'] },
        content: 'Educational thread: Understanding RSI divergence 📚\n\nWhen price makes higher highs but RSI makes lower highs, it often signals a potential reversal. This is called bearish divergence and can be a powerful tool for timing exits.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        likes: 456,
        comments: 78,
        shares: 123,
        isLiked: true,
        type: 'educational'
      },
      {
        id: '5',
        user: { name: 'Pro Mike', avatar: '⚡', verified: true, followers: 123000, isExpert: true, badges: ['Signal Provider', 'Top Trader'] },
        content: 'New signal alert! 🚨 Looking at a potential breakout in $NVDA. All indicators aligning for a move to $520. Entry zone: $480-485. This could be a 7% quick gain if we see the momentum continue.',
        timestamp: new Date(Date.now() - 4500000).toISOString(),
        likes: 789,
        comments: 234,
        shares: 45,
        isLiked: false,
        type: 'signal',
        stockMentions: ['NVDA']
      },
      {
        id: '6',
        user: { name: 'Crypto Queen', avatar: '👑', verified: true, followers: 89000, isExpert: true, badges: ['DeFi Expert'] },
        content: 'Poll time! Which sector will outperform in Q1 2024?',
        timestamp: new Date(Date.now() - 5400000).toISOString(),
        likes: 234,
        comments: 67,
        shares: 23,
        isLiked: true,
        type: 'poll',
        pollData: {
          question: 'Which sector will outperform in Q1 2024?',
          options: [
            { label: 'Technology', votes: 456, percentage: 45.6 },
            { label: 'Healthcare', votes: 234, percentage: 23.4 },
            { label: 'Energy', votes: 189, percentage: 18.9 },
            { label: 'Financial', votes: 121, percentage: 12.1 }
          ],
          totalVotes: 1000,
          userVoted: 0
        }
      }
    ];

    const mockSignals: MarketSignal[] = [
      {
        id: '1',
        user: { name: 'Signal Master', avatar: '🎯', verified: true, successRate: 89 },
        type: 'buy',
        symbol: 'MSFT',
        currentPrice: 378.50,
        targetPrice: 410.00,
        stopLoss: 365.00,
        timeframe: '2-3 weeks',
        confidence: 85,
        reasoning: 'Strong quarterly earnings, Azure growth acceleration, and technical breakout above $375 resistance. RSI shows healthy momentum without being overbought.',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        likes: 456,
        followers: 1234
      },
      {
        id: '2',
        user: { name: 'Crypto Sage', avatar: '🧙‍♂️', verified: true, successRate: 76 },
        type: 'sell',
        symbol: 'ETH',
        currentPrice: 2450.00,
        targetPrice: 2200.00,
        stopLoss: 2550.00,
        timeframe: '1-2 weeks',
        confidence: 72,
        reasoning: 'Bearish divergence on daily chart, declining DeFi TVL, and potential regulatory headwinds. Risk-reward favors short-term downside.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        likes: 234,
        followers: 891
      },
      {
        id: '3',
        user: { name: 'Tech Analyst Pro', avatar: '💻', verified: true, successRate: 82 },
        type: 'buy',
        symbol: 'GOOGL',
        currentPrice: 142.30,
        targetPrice: 165.00,
        stopLoss: 135.00,
        timeframe: '4-6 weeks',
        confidence: 78,
        reasoning: 'Undervalued relative to peers, strong AI positioning with Bard integration, and potential YouTube Shorts monetization upside. Oversold on recent dip.',
        timestamp: new Date(Date.now() - 5400000).toISOString(),
        likes: 345,
        followers: 567
      }
    ];

    const mockTrending: TrendingTopic[] = [
      { tag: '#NVDA', posts: 2847, sentiment: 'bullish', growth: 23 },
      { tag: '#FedMeeting', posts: 1923, sentiment: 'neutral', growth: 45 },
      { tag: '#TechEarnings', posts: 1654, sentiment: 'bullish', growth: 12 },
      { tag: '#CryptoETF', posts: 1432, sentiment: 'bullish', growth: 67 },
      { tag: '#AIStocks', posts: 1287, sentiment: 'bullish', growth: 34 },
      { tag: '#MarketCrash', posts: 987, sentiment: 'bearish', growth: -15 },
      { tag: '#GoldRush', posts: 876, sentiment: 'bullish', growth: 28 }
    ];

    setNewsArticles(mockNews);
    setSocialPosts(mockSocialPosts);
    setMarketSignals(mockSignals);
    setTrendingTopics(mockTrending);
  }, []);

  const toggleLike = (id: string, type: 'news' | 'social') => {
    if (type === 'news') {
      setNewsArticles(prev => prev.map(article =>
        article.id === id
          ? { ...article, isLiked: !article.isLiked, likes: article.isLiked ? article.likes - 1 : article.likes + 1 }
          : article
      ));
    } else {
      setSocialPosts(prev => prev.map(post =>
        post.id === id
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      ));
    }
  };

  const filteredNews = newsArticles.filter(article =>
    filter === 'all' || article.category === filter
  );

  const getCategoryColor = (category: string) => {
    const colors = {
      breaking: 'border-red-500/50 bg-red-900/20 text-red-300',
      market: 'border-blue-500/50 bg-blue-900/20 text-blue-300',
      earnings: 'border-green-500/50 bg-green-900/20 text-green-300',
      economics: 'border-purple-500/50 bg-purple-900/20 text-purple-300',
      crypto: 'border-yellow-500/50 bg-yellow-900/20 text-yellow-300',
      politics: 'border-gray-500/50 bg-gray-500/10'
    };
    return colors[category as keyof typeof colors] || colors.market;
  };

  const getPostTypeIcon = (type: string) => {
    const icons = {
      trade: <BarChart3 className="w-4 h-4" style={{ color: 'var(--success)' }} />,
      prediction: <Target className="w-4 h-4" style={{ color: 'var(--primary-blue)' }} />,
      milestone: <Award className="w-4 h-4" style={{ color: 'var(--warning)' }} />,
      educational: <BookOpen className="w-4 h-4" style={{ color: 'var(--primary-purple)' }} />,
      signal: <Zap className="w-4 h-4 text-orange-400" />,
      poll: <BarChart3 className="w-4 h-4 text-pink-400" />,
      video: <Video className="w-4 h-4 text-red-400" />,
      text: <MessageCircle className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
    };
    return icons[type as keyof typeof icons] || icons.text;
  };

  const renderTradeData = (tradeData: any) => (
    <div className="p-4 rounded-xl mb-4 border" style={{ background: 'var(--background-secondary)', borderColor: 'var(--success)', borderWidth: '1px', borderStyle: 'solid', borderOpacity: '0.3' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" style={{ color: 'var(--success)' }} />
          <span className="font-bold text-lg">${tradeData.symbol}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
            tradeData.action === 'buy' ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
          }`}>
            {tradeData.action.toUpperCase()}
          </span>
        </div>
        <div className="text-right">
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Price</div>
          <div className="font-bold">${tradeData.price}</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Quantity</div>
          <div className="font-bold">{tradeData.quantity}</div>
        </div>
        {tradeData.profit && (
          <div className="text-center">
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Profit</div>
            <div className="font-bold" style={{ color: 'var(--success)' }}>+${tradeData.profit}</div>
          </div>
        )}
        {tradeData.percentage && (
          <div className="text-center">
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Return</div>
            <div className="font-bold" style={{ color: 'var(--success)' }}>+{tradeData.percentage}%</div>
          </div>
        )}
      </div>
    </div>
  );

  const renderPollData = (pollData: any) => (
    <div className="p-4 rounded-xl mb-4 border" style={{ background: 'var(--background-secondary)', borderColor: 'var(--border-primary)' }}>
      <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{pollData.question}</h4>
      <div className="space-y-3">
        {pollData.options.map((option: any, index: number) => (
          <div key={index} className="cursor-pointer p-2 rounded-lg transition-colors hover:opacity-75" style={{ background: 'var(--background-tertiary)' }}>
            <div className="flex justify-between mb-1">
              <span style={{ color: 'var(--text-secondary)' }}>{option.label}</span>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{option.percentage}%</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--background-tertiary)' }}>
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${option.percentage}%` }}
              ></div>
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{option.votes} votes</div>
          </div>
        ))}
      </div>
      <div className="text-sm mt-3" style={{ color: 'var(--text-muted)' }}>
        {pollData.totalVotes} total votes
      </div>
    </div>
  );

  const renderPredictionData = (predictionData: any) => (
    <div className="bg-blue-900/20 p-4 rounded-xl mb-4 border border-blue-500/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5" style={{ color: 'var(--primary-blue)' }} />
          <span className="font-bold text-lg">${predictionData.symbol}</span>
        </div>
        <div className="text-right">
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Target</div>
          <div className="font-bold" style={{ color: 'var(--primary-blue)' }}>${predictionData.target}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="text-center">
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Timeframe</div>
          <div className="font-bold">{predictionData.timeframe}</div>
        </div>
        <div className="text-center">
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Confidence</div>
          <div className="font-bold" style={{ color: 'var(--primary-blue)' }}>{predictionData.confidence}%</div>
        </div>
      </div>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        <strong>Reasoning:</strong> {predictionData.reasoning}
      </p>
    </div>
  );

  const tabs = [
    { id: 'for-you', label: 'For You', icon: '🎯', desc: 'Personalized feed' },
    { id: 'following', label: 'Following', icon: '👥', desc: 'Your network' },
    { id: 'news', label: 'News', icon: '📰', desc: 'Market updates' },
    { id: 'signals', label: 'Signals', icon: '⚡', desc: 'Trading alerts' }
  ];

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gradient mb-6">
            Please log in to view the social feed
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background-primary)' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gradient mb-4">
              Social Trading Hub
            </h1>
            <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
              Connect • Learn • Trade • Share
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="flex gap-2 p-2 rounded-2xl backdrop-blur-sm overflow-x-auto" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border-color)' }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 whitespace-nowrap ${
                    activeTab === tab.id ? 'btn-primary shadow-lg' : 'glass-morphism hover:bg-white/10'
                  }`}
                  style={activeTab !== tab.id ? { color: 'var(--text-secondary)' } : {}}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <div className="text-center">
                    <div className="text-sm font-bold">{tab.label}</div>
                    <div className="text-xs opacity-70">{tab.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* Left Sidebar - Trending & Quick Actions */}
            <div className="lg:col-span-1 space-y-6">

              {/* Trending Topics */}
              <div className="card">
                <div className="card-body">
                  <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <TrendingUp className="w-5 h-5" style={{ color: 'var(--success)' }} />
                    Trending Now
                  </h3>
                  <div className="space-y-3">
                    {trendingTopics.map((topic, index) => (
                      <div key={topic.tag} className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors hover:opacity-75" style={{ background: 'var(--background-tertiary)' }}>
                        <div>
                          <div className="font-medium" style={{ color: 'var(--primary-blue)' }}>{topic.tag}</div>
                          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            {topic.posts.toLocaleString()} posts
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xs px-2 py-1 rounded-full ${
                            topic.sentiment === 'bullish' ? 'bg-green-900/30 text-green-300' :
                            topic.sentiment === 'bearish' ? 'bg-red-900/30 text-red-300' :
''
                          }`}>
                            {topic.sentiment}
                          </div>
                          <div className="text-xs mt-1" style={{ color: 'var(--success)' }}>+{topic.growth}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="card">
                <div className="card-body">
                  <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Market Pulse</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Active Traders</span>
                      <span className="font-bold" style={{ color: 'var(--success)' }}>12.5K</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Posts Today</span>
                      <span className="font-bold" style={{ color: 'var(--text-primary)' }}>2,847</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Signals Shared</span>
                      <span className="font-bold" style={{ color: 'var(--primary-blue)' }}>156</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Success Rate</span>
                      <span className="font-bold" style={{ color: 'var(--success)' }}>73%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">

              {/* Share Your Thoughts Composer */}
              <div className="card">
                <div className="card-body">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{user?.username?.charAt(0) || '👤'}</div>
                    <div className="flex-1">
                      <div className="mb-3">
                        <textarea
                          value={newPost}
                          onChange={(e) => setNewPost(e.target.value)}
                          placeholder="Share your thoughts, trades, or insights..."
                          className="w-full p-4 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                          style={{
                            background: 'var(--glass-bg)',
                            border: '1px solid var(--glass-border-color)',
                            color: 'var(--text-primary)',
                            minHeight: '100px'
                          }}
                          rows={3}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors" style={{ color: 'var(--text-muted)' }}>
                            <Camera className="w-4 h-4" />
                            Photo
                          </button>
                          <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors" style={{ color: 'var(--text-muted)' }}>
                            <BarChart3 className="w-4 h-4" />
                            Chart
                          </button>
                          <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors" style={{ color: 'var(--text-muted)' }}>
                            <Target className="w-4 h-4" />
                            Prediction
                          </button>
                          <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors" style={{ color: 'var(--text-muted)' }}>
                            <Zap className="w-4 h-4" />
                            Signal
                          </button>
                        </div>

                        <button
                          className="btn-primary px-6 py-2 font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
                          disabled={!newPost.trim()}
                          onClick={() => {
                            // Handle post submission here
                            setNewPost('');
                          }}
                        >
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {activeTab === 'news' && (
                <>
                  {/* Category Filter */}
                  <div className="flex justify-center gap-2 mb-6 flex-wrap">
                    {(['all', 'market', 'earnings', 'economics', 'crypto'] as const).map((filterOption) => (
                      <button
                        key={filterOption}
                        onClick={() => setFilter(filterOption)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                          filter === filterOption ? 'btn-primary' : 'glass-morphism'
                        }`}
                        style={filter !== filterOption ? { color: 'var(--text-secondary)' } : {}}
                      >
                        {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* News Articles */}
                  <div className="space-y-6">
                    {filteredNews.map((article) => (
                      <div key={article.id} className="card hover:scale-[1.02] transition-all duration-300">
                        <div className="card-body">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(article.category)}`}>
                                {article.category}
                              </span>
                              {article.priority === 'high' && (
                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-900/30 text-red-300 border border-red-500/30 transition-opacity duration-1000">
                                  HOT
                                </span>
                              )}
                              <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                                {article.source}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                              <Clock className="w-4 h-4" />
                              {new Date(article.timestamp).toLocaleTimeString()}
                            </div>
                          </div>

                          <h3 className="text-xl font-bold mb-3 transition-colors cursor-pointer hover:opacity-75" style={{ color: 'var(--text-primary)' }}>
                            {article.title}
                          </h3>

                          <p className="mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {article.summary}
                          </p>

                          {article.relatedStocks && (
                            <div className="flex items-center gap-2 mb-4">
                              <Tag className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                              <div className="flex gap-2 flex-wrap">
                                {article.relatedStocks.map(stock => (
                                  <Link key={stock} href={`/stock/${stock.toLowerCase()}`}>
                                    <span className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded text-xs font-medium hover:bg-blue-800/40 transition-colors cursor-pointer">
                                      ${stock}
                                    </span>
                                  </Link>
                                ))}
                              </div>
                              <div className={`ml-auto px-2 py-1 rounded text-xs font-medium ${
                                article.sentiment === 'bullish' ? 'bg-green-900/30 text-green-300' :
                                article.sentiment === 'bearish' ? 'bg-red-900/30 text-red-300' :
    ''
                              }`}>
                                {article.sentiment}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--glass-border)' }}>
                            <div className="flex items-center gap-6">
                              <button
                                onClick={() => toggleLike(article.id, 'news')}
                                className={`flex items-center gap-2 hover:scale-110 transition-all duration-300 ${
                                  article.isLiked ? 'text-red-400' : ''
                                }`}
                                style={{ color: article.isLiked ? '#f87171' : 'var(--text-muted)' }}
                              >
                                <Heart className={`w-4 h-4 ${article.isLiked ? 'fill-current' : ''}`} />
                                {article.likes}
                              </button>
                              <button className="flex items-center gap-2 hover:scale-110 transition-all duration-300" style={{ color: 'var(--text-muted)' }}>
                                <MessageCircle className="w-4 h-4" />
                                {article.comments}
                              </button>
                              <button className="flex items-center gap-2 hover:scale-110 transition-all duration-300" style={{ color: 'var(--text-muted)' }}>
                                <Share2 className="w-4 h-4" />
                              </button>
                              <button className="flex items-center gap-2 hover:scale-110 transition-all duration-300" style={{ color: 'var(--text-muted)' }}>
                                <Bookmark className="w-4 h-4" />
                              </button>
                            </div>
                            <button className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors" style={{ color: 'var(--text-accent)' }}>
                              Read More <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'signals' && (
                <div className="space-y-6">
                  {marketSignals.map((signal) => (
                    <div key={signal.id} className="card hover:scale-[1.01] transition-all duration-300">
                      <div className="card-body">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{signal.user.avatar}</div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                                  {signal.user.name}
                                </span>
                                {signal.user.verified && <span style={{ color: 'var(--primary-blue)' }}>✓</span>}
                                <span className="text-xs bg-green-900/30 text-green-300 px-2 py-1 rounded-full">
                                  {signal.user.successRate}% success
                                </span>
                              </div>
                              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                {new Date(signal.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                            signal.type === 'buy' ? 'bg-green-900/30 text-green-300' :
                            signal.type === 'sell' ? 'bg-red-900/30 text-red-300' :
                            'bg-yellow-900/30 text-yellow-300'
                          }`}>
                            {signal.type.toUpperCase()}
                          </div>
                        </div>

                        <div className="glass-morphism p-4 rounded-xl mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Zap className="w-5 h-5" style={{ color: 'var(--warning)' }} />
                              <span className="font-bold text-xl">${signal.symbol}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Current</div>
                              <div className="font-bold text-lg">${signal.currentPrice}</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div className="text-center">
                              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Target</div>
                              <div className="font-bold" style={{ color: 'var(--success)' }}>${signal.targetPrice}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Stop Loss</div>
                              <div className="font-bold text-red-400">${signal.stopLoss}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Timeframe</div>
                              <div className="font-bold" style={{ color: 'var(--text-primary)' }}>{signal.timeframe}</div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span style={{ color: 'var(--text-secondary)' }}>Confidence</span>
                              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{signal.confidence}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--background-tertiary)' }}>
                              <div
                                className="h-full bg-yellow-500 transition-all duration-300"
                                style={{ width: `${signal.confidence}%` }}
                              ></div>
                            </div>
                          </div>

                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            <strong>Reasoning:</strong> {signal.reasoning}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 hover:scale-110 transition-all duration-300" style={{ color: 'var(--text-muted)' }}>
                              <Heart className="w-4 h-4" />
                              {signal.likes}
                            </button>
                            <button className="flex items-center gap-2 hover:scale-110 transition-all duration-300" style={{ color: 'var(--text-muted)' }}>
                              <Users className="w-4 h-4" />
                              {signal.followers}
                            </button>
                            <button className="flex items-center gap-2 hover:scale-110 transition-all duration-300" style={{ color: 'var(--text-muted)' }}>
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                          <button className="btn-secondary px-4 py-2 text-sm hover:scale-105 transition-all duration-300">
                            Follow Signal
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(activeTab === 'for-you' || activeTab === 'following') && (
                <div className="space-y-6">
                  {/* Social Posts */}
                  {socialPosts.map((post) => (
                    <div key={post.id} className="card hover:scale-[1.01] transition-all duration-300">
                      <div className="card-body">
                        <div className="flex items-start gap-4">
                          <div className="text-3xl">{post.user.avatar}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                {post.user.name}
                              </span>
                              {post.user.verified && <span style={{ color: 'var(--primary-blue)' }}>✓</span>}
                              {post.user.isExpert && (
                                <span className="text-xs bg-purple-900/30 text-purple-300 px-2 py-1 rounded-full">
                                  Expert
                                </span>
                              )}
                              {post.user.badges?.map(badge => (
                                <span key={badge} className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--background-secondary)', color: 'var(--text-secondary)' }}>
                                  {badge}
                                </span>
                              ))}
                              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                @{post.user.name.toLowerCase().replace(' ', '')} • {post.user.followers.toLocaleString()} followers
                              </span>
                              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                • {new Date(post.timestamp).toLocaleTimeString()}
                              </span>
                              <div className="ml-auto">
                                {getPostTypeIcon(post.type)}
                              </div>
                            </div>

                            <p className="mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                              {post.content.split(/(\$[A-Z]+)/g).map((part, index) =>
                                part.match(/\$[A-Z]+/) ? (
                                  <Link key={index} href={`/stock/${part.slice(1).toLowerCase()}`}>
                                    <span className="font-semibold hover:underline cursor-pointer" style={{ color: 'var(--primary-blue)' }}>
                                      {part}
                                    </span>
                                  </Link>
                                ) : (
                                  part
                                )
                              )}
                            </p>

                            {post.tradeData && renderTradeData(post.tradeData)}
                            {post.pollData && renderPollData(post.pollData)}
                            {post.predictionData && renderPredictionData(post.predictionData)}

                            {post.stockMentions && post.stockMentions.length > 0 && (
                              <div className="flex items-center gap-2 mb-4">
                                <div className="flex gap-2 flex-wrap">
                                  {post.stockMentions.map(stock => (
                                    <Link key={stock} href={`/stock/${stock.toLowerCase()}`}>
                                      <span className="px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer hover:opacity-75" style={{ background: 'var(--background-secondary)', color: 'var(--text-accent)' }}>
                                        ${stock}
                                      </span>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-6 pt-3 border-t" style={{ borderColor: 'var(--glass-border)' }}>
                              <button
                                onClick={() => toggleLike(post.id, 'social')}
                                className={`flex items-center gap-2 hover:scale-110 transition-all duration-300 ${
                                  post.isLiked ? 'text-red-400' : ''
                                }`}
                                style={{ color: post.isLiked ? '#f87171' : 'var(--text-muted)' }}
                              >
                                <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                                {post.likes}
                              </button>
                              <button className="flex items-center gap-2 hover:scale-110 transition-all duration-300" style={{ color: 'var(--text-muted)' }}>
                                <MessageCircle className="w-4 h-4" />
                                {post.comments}
                              </button>
                              <button className="flex items-center gap-2 hover:scale-110 transition-all duration-300" style={{ color: 'var(--text-muted)' }}>
                                <Share2 className="w-4 h-4" />
                                {post.shares}
                              </button>
                              <button className="flex items-center gap-2 hover:scale-110 transition-all duration-300" style={{ color: 'var(--text-muted)' }}>
                                <Bookmark className="w-4 h-4" />
                              </button>
                              {post.user.isExpert && (
                                <button className="ml-auto btn-secondary px-3 py-1 text-xs hover:scale-105 transition-all duration-300">
                                  Follow
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Show additional content only in For You tab */}
                  {activeTab === 'for-you' && (
                    <>
                      {/* Trading Challenges Section */}
                      <div className="card">
                        <div className="card-body">
                          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                            🏅 Trading Challenges
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                              {
                                title: 'November Championship',
                                prize: '$10,000',
                                participants: 1247,
                                timeLeft: '12 days',
                                yourRank: 23
                              },
                              {
                                title: 'Tech Stock Challenge',
                                prize: '$5,000',
                                participants: 567,
                                timeLeft: '5 days',
                                yourRank: 45
                              }
                            ].map((challenge, index) => (
                              <div key={index} className="p-4 rounded-lg border hover:scale-105 transition-all duration-300" style={{ background: 'var(--background-secondary)', borderColor: 'var(--border-primary)' }}>
                                <h4 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{challenge.title}</h4>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <span style={{ color: 'var(--text-muted)' }}>Prize: </span>
                                    <span className="font-bold text-yellow-400">{challenge.prize}</span>
                                  </div>
                                  <div>
                                    <span style={{ color: 'var(--text-muted)' }}>Your Rank: </span>
                                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>#{challenge.yourRank}</span>
                                  </div>
                                  <div>
                                    <span style={{ color: 'var(--text-muted)' }}>Participants: </span>
                                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{challenge.participants}</span>
                                  </div>
                                  <div>
                                    <span style={{ color: 'var(--text-muted)' }}>Time Left: </span>
                                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{challenge.timeLeft}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Top Performers Leaderboard */}
                      <div className="card">
                        <div className="card-body">
                          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                            🏆 Top Performers This Month
                          </h3>
                          <div className="space-y-3">
                            {[
                              { rank: 1, name: 'Alex Rodriguez', avatar: '🔥', return: '+24.7%', followers: 45600 },
                              { rank: 2, name: 'Sarah Chen', avatar: '👩‍💼', return: '+22.3%', followers: 32400 },
                              { rank: 3, name: 'Pro Mike', avatar: '⚡', return: '+21.8%', followers: 123000 },
                              { rank: 4, name: 'Marcus Johnson', avatar: '👨‍💻', return: '+19.5%', followers: 8900 },
                              { rank: 5, name: 'Emily Davis', avatar: '📊', return: '+18.2%', followers: 67800 }
                            ].map((leader) => (
                              <div key={leader.rank} className="flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer hover:opacity-75" style={{ background: 'var(--background-tertiary)' }}>
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                    leader.rank === 1 ? 'bg-yellow-500 text-black' :
                                    leader.rank === 2 ? 'bg-gray-400 text-black' :
                                    leader.rank === 3 ? 'bg-orange-600 text-white' :
                                    'bg-gray-600 text-white'
                                  }`}>
                                    {leader.rank}
                                  </div>
                                  <span className="text-2xl">{leader.avatar}</span>
                                  <div>
                                    <h5 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{leader.name}</h5>
                                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                      {leader.followers?.toLocaleString()} followers
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold" style={{ color: 'var(--success)' }}>
                                    {leader.return}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

            </div>

            {/* Right Sidebar - Suggestions & Activity */}
            <div className="lg:col-span-1 space-y-6">

              {/* Suggested Follows */}
              <div className="card">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                      <Users className="w-5 h-5" />
                      Expert Traders
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'Warren AI', avatar: '🤖', followers: '2.1M', verified: true, badge: 'AI Analyst' },
                      { name: 'Crypto Queen', avatar: '👑', followers: '890K', verified: true, badge: 'DeFi Expert' },
                      { name: 'Stock Sage', avatar: '🧙‍♂️', followers: '456K', verified: true, badge: 'Value Investor' }
                    ].map((suggestion, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg transition-colors hover:opacity-75" style={{ background: 'var(--background-tertiary)' }}>
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{suggestion.avatar}</div>
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                                {suggestion.name}
                              </span>
                              {suggestion.verified && <span className="text-xs" style={{ color: 'var(--primary-blue)' }}>✓</span>}
                            </div>
                            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {suggestion.followers} • {suggestion.badge}
                            </div>
                          </div>
                        </div>
                        <button className="btn-primary px-3 py-1 text-xs hover:scale-105 transition-all duration-300">
                          Follow
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 mt-3 border-t" style={{ borderColor: 'var(--glass-border)' }}>
                    <button className="text-sm transition-colors hover:opacity-75" style={{ color: 'var(--text-accent)' }}>
                      Show more
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="card">
                <div className="card-body">
                  <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <Bell className="w-5 h-5" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {[
                      { text: 'Sarah Chen liked your post', time: '2m ago', icon: '❤️' },
                      { text: 'New signal from Pro Mike', time: '5m ago', icon: '⚡' },
                      { text: 'Marcus started following you', time: '12m ago', icon: '👤' },
                      { text: '$AAPL mentioned 234 times', time: '15m ago', icon: '📊' },
                      { text: 'Your prediction was 89% correct!', time: '1h ago', icon: '🎯' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-2 rounded-lg transition-colors cursor-pointer hover:opacity-75" style={{ background: 'var(--background-tertiary)' }}>
                        <div className="text-lg">{activity.icon}</div>
                        <div className="flex-1">
                          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{activity.text}</div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Performers */}
              <div className="card">
                <div className="card-body">
                  <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <Award className="w-5 h-5" style={{ color: 'var(--warning)' }} />
                    Top Performers
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Alex Rodriguez', return: '+42.3%', avatar: '🔥', rank: 1 },
                      { name: 'Sarah Chen', return: '+38.7%', avatar: '👩‍💼', rank: 2 },
                      { name: 'Marcus Johnson', return: '+35.1%', avatar: '👨‍💻', rank: 3 }
                    ].map((performer) => (
                      <div key={performer.rank} className="flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer hover:opacity-75" style={{ background: 'var(--background-tertiary)' }}>
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center text-white" style={{ background: 'var(--gradient-primary)' }}>
                            {performer.rank}
                          </div>
                          <div className="text-xl">{performer.avatar}</div>
                          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            {performer.name}
                          </span>
                        </div>
                        <div className="font-bold" style={{ color: 'var(--success)' }}>{performer.return}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}