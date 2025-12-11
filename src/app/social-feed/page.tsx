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
  const [activeTab, setActiveTab] = useState<'for-you' | 'following'>('for-you');
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
        user: { name: 'Tony Stark', avatar: '🦾', verified: true, followers: 125000, isExpert: false },
        content: 'Just bought some $TSLA shares. Electric vehicles are the future! Really excited about the tech innovations happening in this space.',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        likes: 234,
        comments: 45,
        shares: 12,
        isLiked: false,
        type: 'text',
        stockMentions: ['TSLA']
      },
      {
        id: '2',
        user: { name: 'Hermione Granger', avatar: '📚', verified: true, followers: 89000, isExpert: false },
        content: 'Been doing research on $AAPL and their recent earnings report looks promising. The growth in services revenue is particularly interesting.',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        likes: 567,
        comments: 89,
        shares: 34,
        isLiked: true,
        type: 'text',
        stockMentions: ['AAPL']
      },
      {
        id: '3',
        user: { name: 'Peter Parker', avatar: '🕷️', verified: false, followers: 42000, isExpert: false },
        content: 'Market looking good today! Anyone else watching $NVDA? The tech sector has been strong this week.',
        timestamp: new Date(Date.now() - 2700000).toISOString(),
        likes: 412,
        comments: 67,
        shares: 23,
        isLiked: false,
        type: 'text',
        stockMentions: ['NVDA']
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
    { id: 'following', label: 'Following', icon: '👥', desc: 'Your network' }
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
                                {post.user.followers.toLocaleString()} followers
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
                      { name: 'Doctor Strange', avatar: '🧙‍♂️', followers: '2.1M', verified: true, badge: 'AI Analyst' },
                      { name: 'Black Widow', avatar: '🕷️', followers: '890K', verified: true, badge: 'Tech Expert' },
                      { name: 'Dumbledore', avatar: '✨', followers: '456K', verified: true, badge: 'Value Investor' }
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
                      { name: 'Thor', return: '+42.3%', avatar: '⚡', rank: 1 },
                      { name: 'Scarlet Witch', return: '+38.7%', avatar: '🔮', rank: 2 },
                      { name: 'Ron Weasley', return: '+35.1%', avatar: '♟️', rank: 3 }
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