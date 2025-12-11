'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { TrendingUp, TrendingDown, Calendar, Globe, BarChart3, Activity, Sparkles, Clock, DollarSign, AlertCircle } from 'lucide-react';

export default function MarketPage() {
  const { user } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');

  // Mock data for major indices
  const majorIndices = [
    { name: 'S&P 500', symbol: 'SPX', value: 4783.45, change: 23.67, changePercent: 0.50 },
    { name: 'Nasdaq', symbol: 'IXIC', value: 15095.14, change: -45.23, changePercent: -0.30 },
    { name: 'Dow Jones', symbol: 'DJI', value: 37545.33, change: 156.78, changePercent: 0.42 },
    { name: 'Russell 2000', symbol: 'RUT', value: 2034.56, change: 12.34, changePercent: 0.61 },
  ];

  // Mock data for global markets
  const globalMarkets = [
    { name: 'FTSE 100', region: 'UK', value: 7685.34, changePercent: 0.23 },
    { name: 'DAX', region: 'Germany', value: 16789.12, changePercent: -0.15 },
    { name: 'Nikkei 225', region: 'Japan', value: 33456.78, changePercent: 0.67 },
    { name: 'Hang Seng', region: 'Hong Kong', value: 16234.45, changePercent: -0.42 },
  ];

  // Mock data for sector performance
  const sectors = [
    { name: 'Technology', changePercent: 1.24, color: 'var(--primary-blue)' },
    { name: 'Healthcare', changePercent: 0.87, color: 'var(--success)' },
    { name: 'Finance', changePercent: -0.34, color: 'var(--error)' },
    { name: 'Energy', changePercent: 2.15, color: 'var(--success)' },
    { name: 'Consumer', changePercent: 0.45, color: 'var(--primary-purple)' },
    { name: 'Industrials', changePercent: -0.12, color: 'var(--error)' },
  ];

  // Mock data for market news
  const marketNews = [
    {
      id: 1,
      headline: 'Fed Signals Potential Rate Cuts in Q2 2025',
      source: 'Bloomberg',
      time: '15 minutes ago',
      category: 'Monetary Policy',
      aiInsight: 'AI analysis suggests 70% probability of rate cut in March',
      sentiment: 'bullish'
    },
    {
      id: 2,
      headline: 'Tech Stocks Rally as AI Revenue Growth Exceeds Expectations',
      source: 'Reuters',
      time: '1 hour ago',
      category: 'Technology',
      aiInsight: 'Pattern recognition indicates continued momentum for AI sector',
      sentiment: 'bullish'
    },
    {
      id: 3,
      headline: 'Oil Prices Decline Amid Global Demand Concerns',
      source: 'CNBC',
      time: '2 hours ago',
      category: 'Energy',
      aiInsight: 'Historical correlations suggest energy sector volatility ahead',
      sentiment: 'bearish'
    },
    {
      id: 4,
      headline: 'Retail Sales Data Shows Stronger Than Expected Consumer Spending',
      source: 'MarketWatch',
      time: '3 hours ago',
      category: 'Economy',
      aiInsight: 'AI models predict sustained consumer confidence through Q1',
      sentiment: 'bullish'
    },
  ];

  // Mock data for economic calendar
  const economicEvents = [
    { event: 'CPI Report', date: 'Today, 8:30 AM EST', impact: 'High', aiPrediction: 'Slight increase expected' },
    { event: 'Fed Meeting Minutes', date: 'Tomorrow, 2:00 PM EST', impact: 'High', aiPrediction: 'Dovish tone anticipated' },
    { event: 'Jobless Claims', date: 'Jan 18, 8:30 AM EST', impact: 'Medium', aiPrediction: 'Stable at current levels' },
    { event: 'GDP Data', date: 'Jan 25, 8:30 AM EST', impact: 'High', aiPrediction: 'Growth of 2.3% forecasted' },
  ];

  // Mock data for trending themes
  const trendingThemes = [
    { theme: 'Artificial Intelligence', momentum: 'Strong', stocks: 12 },
    { theme: 'Clean Energy', momentum: 'Rising', stocks: 8 },
    { theme: 'Cybersecurity', momentum: 'Moderate', stocks: 6 },
    { theme: 'Healthcare Innovation', momentum: 'Strong', stocks: 10 },
  ];

  return (
    <div className="min-h-screen pt-12 pb-8 px-6 trading-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Market Intelligence
          </h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            Real-time market data, news, and AI-powered insights
          </p>
        </div>

        {/* Market Overview - Major Indices */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Major Indices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {majorIndices.map((index) => (
              <div key={index.symbol} className="glass-morphism p-5 rounded-xl hover:scale-105 transition-all duration-300">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{index.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{index.symbol}</p>
                  </div>
                  {index.changePercent >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {index.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className={`text-sm font-semibold ${index.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {index.changePercent >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Market Outlook - Left Side */}
        <div className="mb-6">
          <div className="card">
            <div className="card-body p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Market Outlook
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                  <p className="text-xs text-blue-400 mb-2">This Week</p>
                  <p className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                    Likely Up
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Markets expected to rise
                  </p>
                </div>
                <div className="p-4 rounded-lg" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <p className="text-xs text-green-400 mb-2">This Month</p>
                  <p className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                    Steady Growth
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    3-5% gains expected
                  </p>
                </div>
                <div className="p-4 rounded-lg" style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                  <p className="text-xs text-purple-400 mb-2">Watch For</p>
                  <p className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                    Fed News
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Interest rate updates
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Market Sentiment & AI Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market Sentiment */}
          <div className="card">
            <div className="card-body p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Market Sentiment
                </h3>
                <div className="flex items-center gap-1" title="AI-Powered Analysis">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-purple-400">AI</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Overall</span>
                  <span className="text-sm font-bold text-green-400">Bullish (68%)</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: 'var(--glass-bg)' }}>
                  <div className="h-full rounded-full bg-green-400" style={{ width: '68%' }}></div>
                </div>
                <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  <span>Bearish</span>
                  <span>Neutral</span>
                  <span>Bullish</span>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-lg" style={{ background: 'var(--glass-bg)' }}>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  AI sentiment analysis across 10,000+ news sources and social media
                </p>
              </div>
            </div>
          </div>

          {/* Fear & Greed Index */}
          <div className="card">
            <div className="card-body p-5">
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Fear & Greed Index
              </h3>
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-3">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="var(--glass-border-color)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#10B981"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(62 / 100) * 351.68} 351.68`}
                    />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>62</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Greed</p>
                  </div>
                </div>
                <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
                  Market showing optimistic behavior
                </p>
              </div>
            </div>
          </div>

          {/* Market Volatility */}
          <div className="card">
            <div className="card-body p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Volatility (VIX)
                </h3>
                <div className="flex items-center gap-1" title="AI Forecast">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-purple-400">AI</span>
                </div>
              </div>
              <p className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                14.23
              </p>
              <p className="text-sm text-green-400 mb-4">
                -0.87 (-5.76%)
              </p>
              <div className="p-3 rounded-lg" style={{ background: 'var(--glass-bg)' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>AI Forecast</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Low volatility expected to continue. 72% probability of range-bound movement.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sector Performance */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Sector Performance
          </h2>
          <div className="card">
            <div className="card-body p-5">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {sectors.map((sector) => (
                  <div key={sector.name} className="glass-morphism p-4 rounded-xl text-center">
                    <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                      {sector.name}
                    </p>
                    <p className={`text-xl font-bold ${sector.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {sector.changePercent >= 0 ? '+' : ''}{sector.changePercent.toFixed(2)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Market News with AI Insights */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Market News
            </h2>
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg" style={{ background: 'var(--glass-bg)' }}>
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-400">AI-Enhanced</span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {marketNews.map((news) => (
              <div key={news.id} className="card hover:scale-102 transition-all duration-300 cursor-pointer">
                <div className="card-body p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 rounded" style={{
                          background: 'var(--glass-bg)',
                          color: 'var(--primary-blue)'
                        }}>
                          {news.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          news.sentiment === 'bullish' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {news.sentiment === 'bullish' ? 'Bullish' : 'Bearish'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold mb-2 hover:text-blue-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
                        {news.headline}
                      </h3>
                      <div className="flex items-center gap-2 text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>
                        <span>{news.source}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>{news.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                    <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-purple-400 mb-1">AI Insight</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {news.aiInsight}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Economic Calendar & Trending Themes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Economic Calendar */}
          <div className="card">
            <div className="card-body p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" style={{ color: 'var(--primary-blue)' }} />
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    Economic Calendar
                  </h3>
                </div>
                <div className="flex items-center gap-1" title="AI Predictions">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-purple-400">AI</span>
                </div>
              </div>
              <div className="space-y-3">
                {economicEvents.map((event, index) => (
                  <div key={index} className="glass-morphism p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                          {event.event}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          {event.date}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        event.impact === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {event.impact}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span className="text-purple-400">Prediction:</span>
                      <span>{event.aiPrediction}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trending Themes */}
          <div className="card">
            <div className="card-body p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5" style={{ color: 'var(--primary-purple)' }} />
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    Trending Themes
                  </h3>
                </div>
                <div className="flex items-center gap-1" title="AI-Detected Trends">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-purple-400">AI</span>
                </div>
              </div>
              <div className="space-y-3">
                {trendingThemes.map((item, index) => (
                  <div key={index} className="glass-morphism p-4 rounded-lg hover:bg-white/5 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                        {item.theme}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.momentum === 'Strong' ? 'bg-green-500/20 text-green-400' :
                        item.momentum === 'Rising' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {item.momentum}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      <span>{item.stocks} stocks</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        <span>AI-detected momentum</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Global Markets */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-5 h-5" style={{ color: 'var(--primary-blue)' }} />
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Global Markets
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {globalMarkets.map((market) => (
              <div key={market.name} className="glass-morphism p-5 rounded-xl">
                <p className="text-sm mb-1" style={{ color: 'var(--text-tertiary)' }}>{market.region}</p>
                <p className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {market.name}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {market.value.toLocaleString()}
                  </p>
                  <p className={`text-sm font-bold ${market.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {market.changePercent >= 0 ? '+' : ''}{market.changePercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
