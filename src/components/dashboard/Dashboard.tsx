'use client';

import { useAuth } from '../auth/AuthProvider';
import { useState, useEffect } from 'react';
import LineChart from '../charts/LineChart';
import ComparisonChart from '../charts/ComparisonChart';
import PieChart from '../charts/PieChart';
import TradingSignals from '../trading/TradingSignals';
import Link from 'next/link';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface Holding {
  symbol: string;
  name: string;
  shares: number;
  averagePrice: number;
  currentPrice: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [topStocks, setTopStocks] = useState<Stock[]>([]);
  const [portfolio, setPortfolio] = useState<Holding[]>([]);
  const [portfolioHistory, setPortfolioHistory] = useState<{ name: string; value: number }[]>([]);
  const [comparisonData, setComparisonData] = useState<{ name: string; userPerformance: number; marketPerformance: number }[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('30d');
  const [selectedComparisonTimeframe, setSelectedComparisonTimeframe] = useState<string>('30d');
  const [watchlist, setWatchlist] = useState<Stock[]>([]);
  const [marketMovers, setMarketMovers] = useState<{ gainers: Stock[]; losers: Stock[]; mostActive: Stock[] }>({gainers: [], losers: [], mostActive: []});
  const [selectedMoverTab, setSelectedMoverTab] = useState<'gainers' | 'losers' | 'mostActive'>('gainers');
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  // Mini sparkline component
  const MiniSparkline = ({ data, color }: { data: number[], color: string }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 100;
    const height = 30;
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} className="opacity-60">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
        />
      </svg>
    );
  };

  useEffect(() => {
    setTopStocks([
      { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.15, changePercent: 1.24 },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.21, change: -1.32, changePercent: -0.95 },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.85, change: 4.12, changePercent: 1.10 },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.42, change: -5.23, changePercent: -2.06 },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 127.74, change: 1.89, changePercent: 1.50 }
    ]);

    // Watchlist
    setWatchlist([
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.28, change: 15.67, changePercent: 1.83 },
      { symbol: 'META', name: 'Meta Platforms', price: 312.96, change: -2.45, changePercent: -0.78 },
      { symbol: 'AMD', name: 'Advanced Micro Devices', price: 142.33, change: 3.21, changePercent: 2.31 },
      { symbol: 'NFLX', name: 'Netflix Inc.', price: 445.87, change: -8.12, changePercent: -1.79 }
    ]);

    // Market Movers
    setMarketMovers({
      gainers: [
        { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.28, change: 45.23, changePercent: 5.45 },
        { symbol: 'AMD', name: 'AMD Inc.', price: 142.33, change: 8.42, changePercent: 6.29 },
        { symbol: 'COIN', name: 'Coinbase', price: 167.89, change: 12.34, changePercent: 7.93 },
        { symbol: 'PLTR', name: 'Palantir', price: 23.45, change: 1.89, changePercent: 8.78 },
        { symbol: 'RIVN', name: 'Rivian', price: 18.92, change: 2.12, changePercent: 12.61 }
      ],
      losers: [
        { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.42, change: -15.23, changePercent: -5.78 },
        { symbol: 'NFLX', name: 'Netflix', price: 445.87, change: -22.12, changePercent: -4.73 },
        { symbol: 'SNAP', name: 'Snap Inc.', price: 12.34, change: -0.98, changePercent: -7.36 },
        { symbol: 'UBER', name: 'Uber', price: 62.31, change: -3.42, changePercent: -5.20 },
        { symbol: 'LYFT', name: 'Lyft', price: 14.56, change: -1.23, changePercent: -7.79 }
      ],
      mostActive: [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.15, changePercent: 1.24 },
        { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.42, change: -5.23, changePercent: -2.06 },
        { symbol: 'NVDA', name: 'NVIDIA', price: 875.28, change: 15.67, changePercent: 1.83 },
        { symbol: 'AMZN', name: 'Amazon', price: 127.74, change: 1.89, changePercent: 1.50 },
        { symbol: 'MSFT', name: 'Microsoft', price: 378.85, change: 4.12, changePercent: 1.10 }
      ]
    });

    const userHoldings = JSON.parse(localStorage.getItem(`portfolio_${user?.id}`) || '[]');
    setPortfolio(userHoldings);

    // Recent Activities
    setRecentActivities([
      { id: 1, type: 'buy', symbol: 'AAPL', shares: 10, price: 175.43, time: '2 minutes ago', value: 1754.30 },
      { id: 2, type: 'sell', symbol: 'TSLA', shares: 5, price: 248.42, time: '15 minutes ago', value: 1242.10 },
      { id: 3, type: 'dividend', symbol: 'MSFT', amount: 45.20, time: '1 hour ago' },
      { id: 4, type: 'buy', symbol: 'NVDA', shares: 3, price: 875.28, time: '3 hours ago', value: 2625.84 },
      { id: 5, type: 'watchlist', symbol: 'META', time: '5 hours ago' },
      { id: 6, type: 'sell', symbol: 'GOOGL', shares: 8, price: 138.21, time: 'Yesterday', value: 1105.68 },
      { id: 7, type: 'buy', symbol: 'AMD', shares: 15, price: 142.33, time: 'Yesterday', value: 2134.95 },
      { id: 8, type: 'price_alert', symbol: 'NFLX', targetPrice: 450.00, time: '2 days ago' }
    ]);

    // Generate mock portfolio history based on selected timeframe
    generatePortfolioHistory(selectedTimeframe);

    // Generate mock comparison data
    generateComparisonData(selectedComparisonTimeframe);
  }, [user, selectedTimeframe, selectedComparisonTimeframe]);

  const generatePortfolioHistory = (timeframe: string) => {
    const today = new Date();
    const historyData = [];
    let days = 30;
    let dateFormat: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };

    switch (timeframe) {
      case '30d':
        days = 30;
        dateFormat = { month: 'short', day: 'numeric' };
        break;
      case '3m':
        days = 90;
        dateFormat = { month: 'short', day: 'numeric' };
        break;
      case '6m':
        days = 180;
        dateFormat = { month: 'short', day: 'numeric' };
        break;
      case '1y':
        days = 365;
        dateFormat = { year: 'numeric', month: 'short' };
        break;
      case '5y':
        days = 1825;
        dateFormat = { year: 'numeric', month: 'short' };
        break;
    }

    const interval = days > 365 ? Math.floor(days / 50) : Math.floor(days / 30);
    const dataPoints = Math.min(50, days);
    
    for (let i = dataPoints - 1; i >= 0; i--) {
      const date = new Date(today);
      const daysBack = i * interval;
      date.setDate(date.getDate() - daysBack);
      
      const baseValue = (user?.balance || 10000) + Math.random() * 5000;
      const longTermTrend = timeframe === '5y' ? (i * 50) : (timeframe === '1y' ? (i * 20) : 0);
      const variation = Math.sin(i * 0.2) * 1000 + Math.random() * 500;
      
      historyData.push({
        name: date.toLocaleDateString('en-US', dateFormat),
        value: Math.max(0, baseValue + variation + longTermTrend)
      });
    }
    
    setPortfolioHistory(historyData.reverse());
  };

  const generateComparisonData = (timeframe: string) => {
    const comparisonData = [];
    let dataPoints = 30;
    let dateFormat: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };

    switch (timeframe) {
      case '7d':
        dataPoints = 7;
        dateFormat = { weekday: 'short' };
        break;
      case '30d':
        dataPoints = 30;
        dateFormat = { month: 'short', day: 'numeric' };
        break;
      case '3m':
        dataPoints = 90;
        dateFormat = { month: 'short', day: 'numeric' };
        break;
      case '1y':
        dataPoints = 365;
        dateFormat = { year: 'numeric', month: 'short' };
        break;
    }

    const interval = Math.floor(dataPoints / 15); // Show max 15 points
    
    for (let i = Math.floor(dataPoints / interval) - 1; i >= 0; i--) {
      const date = new Date();
      const daysBack = i * interval;
      date.setDate(date.getDate() - daysBack);
      
      // User performance (slightly better than market on average)
      const userBasePerformance = Math.sin(i * 0.3) * 8 + Math.random() * 6 - 3;
      const userPerformance = userBasePerformance + 2; // User doing slightly better
      
      // Market performance (S&P 500-like)
      const marketBasePerformance = Math.sin(i * 0.25) * 6 + Math.random() * 4 - 2;
      const marketPerformance = marketBasePerformance;
      
      comparisonData.push({
        name: date.toLocaleDateString('en-US', dateFormat),
        userPerformance: Math.max(-20, Math.min(25, userPerformance)), // Clamp between -20% and 25%
        marketPerformance: Math.max(-15, Math.min(20, marketPerformance)) // Market slightly less volatile
      });
    }
    
    setComparisonData(comparisonData.reverse());
  };

  const timeframeOptions = [
    { value: '30d', label: '30 Days' },
    { value: '3m', label: '3 Months' },
    { value: '6m', label: '6 Months' },
    { value: '1y', label: '1 Year' },
    { value: '5y', label: '5 Years' }
  ];

  const comparisonTimeframeOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '3m', label: '3 Months' },
    { value: '1y', label: '1 Year' }
  ];

  const totalPortfolioValue = portfolio.reduce((total, holding) => {
    return total + (holding.shares * holding.currentPrice);
  }, 0);

  // Generate mini trend data for stats cards
  const generateMiniTrend = (baseValue: number, isPositive: boolean) => {
    const trend = [];
    for (let i = 0; i < 12; i++) {
      const variation = Math.sin(i * 0.5) * (baseValue * 0.02);
      const direction = isPositive ? 1 : -1;
      trend.push(baseValue + variation + (i * baseValue * 0.005 * direction));
    }
    return trend;
  };

  const buyingPowerTrend = generateMiniTrend(user?.balance || 10000, true);
  const portfolioValueTrend = generateMiniTrend(totalPortfolioValue || 5000, true);
  const totalAssetsTrend = generateMiniTrend((user?.balance || 0) + totalPortfolioValue, true);
  const todayPLTrend = generateMiniTrend(234.56, true);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card pulse-glow">
            <div className="card-body">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Buying Power</h3>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-secondary)' }}>
                  <svg className="w-5 h-5" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold mb-2" style={{ color: 'var(--success)' }}>${user?.balance.toFixed(2)}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-400 font-semibold">+2.1% this week</span>
                <MiniSparkline data={buyingPowerTrend} color="#10B981" />
              </div>
            </div>
          </div>
          <div className="card pulse-glow">
            <div className="card-body">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Portfolio Value</h3>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-accent)' }}>
                  <svg className="w-5 h-5" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold mb-2" style={{ color: 'var(--primary-blue)' }}>${totalPortfolioValue.toFixed(2)}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-400 font-semibold">+5.8% this week</span>
                <MiniSparkline data={portfolioValueTrend} color="#3B82F6" />
              </div>
            </div>
          </div>
          <div className="card pulse-glow">
            <div className="card-body">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Total Return</h3>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                  <svg className="w-5 h-5" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold mb-2" style={{ color: 'var(--accent-violet)' }}>
                ${((user?.balance || 0) + totalPortfolioValue).toFixed(2)}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-400 font-semibold">+12.3% all time</span>
                <MiniSparkline data={totalAssetsTrend} color="#8B5CF6" />
              </div>
            </div>
          </div>
          <div className="card pulse-glow">
            <div className="card-body">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Today's P&L</h3>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
                  <svg className="w-5 h-5" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold mb-2 text-green-400">+$234.56</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-400 font-semibold">+2.1% today</span>
                <MiniSparkline data={todayPLTrend} color="#10B981" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="card">
          <div className="card-body">
            <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Portfolio Performance</h3>
            <LineChart
              data={portfolioHistory}
              title="Portfolio Performance"
              color="#10B981"
              height={350}
              minimalistic={false}
              showGrid={true}
              enableZoom={true}
            />
            <div className="flex justify-center gap-2 mt-4">
              {timeframeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedTimeframe(option.value)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedTimeframe === option.value
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Performance vs Market</h3>
            <ComparisonChart
              data={comparisonData}
              title="Performance vs Market"
              height={320}
              showGrid={true}
            />
            <div className="flex justify-center gap-2 mt-4">
              {comparisonTimeframeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedComparisonTimeframe(option.value)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedComparisonTimeframe === option.value
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Watchlist & Market Movers Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Watchlist */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                  <svg className="w-5 h-5" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                Watchlist
              </h2>
              <button className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 glass-morphism border border-white/10 hover:border-blue-500/50 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Symbol
              </button>
            </div>
            <div className="space-y-3">
              {watchlist.map((stock) => (
                <div key={stock.symbol} className="glass-morphism p-4 rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer border border-white/5 hover:border-blue-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <Link href={`/stock/${stock.symbol.toLowerCase()}`}>
                          <span className="text-lg font-bold hover:text-blue-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
                            {stock.symbol}
                          </span>
                        </Link>
                        <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{stock.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                          ${stock.price.toFixed(2)}
                        </span>
                        <span className={`text-sm font-semibold flex items-center gap-1 ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {stock.change >= 0 ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                    <Link href={`/stock/${stock.symbol.toLowerCase()}`}>
                      <button className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/50">
                        Trade
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Market Movers */}
        <div className="card">
          <div className="card-body">
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6" style={{ color: 'var(--text-primary)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-secondary)' }}>
                <svg className="w-5 h-5" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              Market Movers
            </h2>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setSelectedMoverTab('gainers')}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  selectedMoverTab === 'gainers'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                    : 'glass-morphism border border-white/10 hover:border-green-500/30'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  🔥 Gainers
                </span>
              </button>
              <button
                onClick={() => setSelectedMoverTab('losers')}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  selectedMoverTab === 'losers'
                    ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30'
                    : 'glass-morphism border border-white/10 hover:border-red-500/30'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  📉 Losers
                </span>
              </button>
              <button
                onClick={() => setSelectedMoverTab('mostActive')}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  selectedMoverTab === 'mostActive'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                    : 'glass-morphism border border-white/10 hover:border-blue-500/30'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  ⚡ Most Active
                </span>
              </button>
            </div>

            {/* Stock List */}
            <div className="space-y-2.5">
              {marketMovers[selectedMoverTab].map((stock, index) => (
                <div key={stock.symbol} className="glass-morphism p-4 rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer border border-white/5 hover:border-blue-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{
                        background: selectedMoverTab === 'gainers'
                          ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                          : selectedMoverTab === 'losers'
                          ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
                          : 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)'
                      }}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <Link href={`/stock/${stock.symbol.toLowerCase()}`}>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-base font-bold hover:text-blue-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
                              {stock.symbol}
                            </span>
                            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{stock.name}</span>
                          </div>
                        </Link>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                            ${stock.price.toFixed(2)}
                          </span>
                          <span className={`text-sm font-bold ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link href={`/stock/${stock.symbol.toLowerCase()}`}>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 glass-morphism border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10">
                        Trade
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="card mb-12">
        <div className="card-body">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-accent)' }}>
                <svg className="w-5 h-5" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Recent Activity
            </h2>
            <Link href="/portfolio">
              <button className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 glass-morphism border border-white/10 hover:border-blue-500/50">
                View All
              </button>
            </Link>
          </div>

          <div className="space-y-3">
            {recentActivities.map((activity) => {
              const getActivityIcon = (type: string) => {
                switch (type) {
                  case 'buy':
                    return { icon: '📈', color: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', label: 'Bought' };
                  case 'sell':
                    return { icon: '📉', color: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', label: 'Sold' };
                  case 'dividend':
                    return { icon: '💰', color: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', label: 'Dividend' };
                  case 'watchlist':
                    return { icon: '⭐', color: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', label: 'Added to Watchlist' };
                  case 'price_alert':
                    return { icon: '🔔', color: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', label: 'Price Alert' };
                  default:
                    return { icon: '📊', color: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)', label: 'Activity' };
                }
              };

              const activityInfo = getActivityIcon(activity.type);

              return (
                <div key={activity.id} className="glass-morphism p-4 rounded-xl hover:bg-white/5 transition-all duration-200 border border-white/5 hover:border-blue-500/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: activityInfo.color }}>
                      <span className="text-2xl">{activityInfo.icon}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{activityInfo.label}</span>
                        <Link href={`/stock/${activity.symbol?.toLowerCase()}`}>
                          <span className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
                            ${activity.symbol}
                          </span>
                        </Link>
                      </div>

                      <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {activity.type === 'buy' || activity.type === 'sell' ? (
                          <>
                            <span>{activity.shares} shares @ ${activity.price.toFixed(2)}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full glass-morphism">
                              ${activity.value.toFixed(2)}
                            </span>
                          </>
                        ) : activity.type === 'dividend' ? (
                          <span className="text-green-400 font-semibold">+${activity.amount.toFixed(2)}</span>
                        ) : activity.type === 'price_alert' ? (
                          <span>Target: ${activity.targetPrice.toFixed(2)}</span>
                        ) : null}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{activity.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Market News & Sentiment Section */}
      <div className="card mb-12">
        <div className="card-body">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold flex items-center gap-4" style={{ color: 'var(--text-primary)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-accent)' }}>
                <svg className="w-5 h-5" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              Market News & Sentiment
            </h2>

            {/* Overall Market Sentiment Gauge */}
            <div className="flex items-center gap-4">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Market Sentiment:</span>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass-morphism border border-green-500/30">
                <div className="w-2 h-2 rounded-full bg-green-500 transition-opacity duration-1000"></div>
                <span className="text-sm font-bold text-green-400">Bullish (72%)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* News Item 1 */}
            <div className="glass-morphism p-6 rounded-xl market-update-card cursor-pointer hover:border-green-500/30 border border-white/5 transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gradient-primary)' }}>
                  <span className="text-white font-bold text-sm">📈</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-semibold">Bullish</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>CNBC</span>
                  </div>
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>S&P 500 hits new all-time high as tech stocks rally continues</p>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>Major indices surge on positive earnings reports and Fed rate speculation...</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>2 minutes ago</p>
                    <div className="flex gap-1">
                      <span className="text-xs px-2 py-0.5 rounded glass-morphism">SPY</span>
                      <span className="text-xs px-2 py-0.5 rounded glass-morphism">QQQ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* News Item 2 */}
            <div className="glass-morphism p-6 rounded-xl market-update-card cursor-pointer hover:border-blue-500/30 border border-white/5 transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gradient-secondary)' }}>
                  <span className="text-white font-bold text-sm">💰</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold">Neutral</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Bloomberg</span>
                  </div>
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Federal Reserve hints at potential rate cuts in Q2 2025</p>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>Fed Chair signals dovish stance as inflation moderates below target...</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>15 minutes ago</p>
                    <div className="flex gap-1">
                      <span className="text-xs px-2 py-0.5 rounded glass-morphism">TLT</span>
                      <span className="text-xs px-2 py-0.5 rounded glass-morphism">DXY</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* News Item 3 */}
            <div className="glass-morphism p-6 rounded-xl market-update-card cursor-pointer hover:border-green-500/30 border border-white/5 transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gradient-accent)' }}>
                  <span className="text-white font-bold text-sm">🚀</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-semibold">Bullish</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Reuters</span>
                  </div>
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Bitcoin surges 8% following institutional adoption news</p>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>Major investment firms announce cryptocurrency integration plans...</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>32 minutes ago</p>
                    <div className="flex gap-1">
                      <span className="text-xs px-2 py-0.5 rounded glass-morphism">BTC</span>
                      <span className="text-xs px-2 py-0.5 rounded glass-morphism">COIN</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* News Item 4 */}
            <div className="glass-morphism p-6 rounded-xl market-update-card cursor-pointer hover:border-green-500/30 border border-white/5 transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--success)' }}>
                  <span className="text-white font-bold text-sm">📊</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-semibold">Bullish</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>MarketWatch</span>
                  </div>
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>AAPL beats Q4 earnings expectations by 12%</p>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>Apple reports record revenue driven by iPhone and services growth...</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>1 hour ago</p>
                    <div className="flex gap-1">
                      <span className="text-xs px-2 py-0.5 rounded glass-morphism">AAPL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* News Item 5 */}
            <div className="glass-morphism p-6 rounded-xl market-update-card cursor-pointer hover:border-green-500/30 border border-white/5 transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--primary-purple)' }}>
                  <span className="text-white font-bold text-sm">🔥</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-semibold">Bullish</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>TechCrunch</span>
                  </div>
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>AI stocks rally as NVIDIA announces new chip architecture</p>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>Next-gen GPU promises 40% performance boost for AI workloads...</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>2 hours ago</p>
                    <div className="flex gap-1">
                      <span className="text-xs px-2 py-0.5 rounded glass-morphism">NVDA</span>
                      <span className="text-xs px-2 py-0.5 rounded glass-morphism">AMD</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* News Item 6 */}
            <div className="glass-morphism p-6 rounded-xl market-update-card cursor-pointer hover:border-red-500/30 border border-white/5 transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--error)' }}>
                  <span className="text-white font-bold text-sm">⚠️</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-semibold">Bearish</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>WSJ</span>
                  </div>
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Energy sector faces volatility amid geopolitical tensions</p>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>Oil prices fluctuate as Middle East conflicts escalate concerns...</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>3 hours ago</p>
                    <div className="flex gap-1">
                      <span className="text-xs px-2 py-0.5 rounded glass-morphism">XLE</span>
                      <span className="text-xs px-2 py-0.5 rounded glass-morphism">USO</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="card-body">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-4" style={{ color: 'var(--text-primary)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-secondary)' }}>
                <svg className="w-5 h-5" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              Market Overview
            </h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Name</th>
                    <th className="text-right">Price</th>
                    <th className="text-right">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {topStocks.map((stock) => (
                    <tr key={stock.symbol}>
                      <td>
                        <Link href={`/stock/${stock.symbol.toLowerCase()}`}>
                          <span className="font-bold hover:text-blue-400 cursor-pointer transition-colors" style={{ color: 'var(--text-primary)' }}>
                            {stock.symbol}
                          </span>
                        </Link>
                      </td>
                      <td style={{ color: 'var(--text-tertiary)' }}>{stock.name}</td>
                      <td className="text-right font-semibold" style={{ color: 'var(--text-primary)' }}>${stock.price.toFixed(2)}</td>
                      <td className={`text-right ${stock.change >= 0 ? 'status-positive' : 'status-negative'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-4" style={{ color: 'var(--text-primary)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-accent)' }}>
                <svg className="w-5 h-5" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              Your Holdings
            </h2>
            {portfolio.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th className="text-right">Shares</th>
                      <th className="text-right">Value</th>
                      <th className="text-right">% of Portfolio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.map((holding) => {
                      const holdingValue = holding.shares * holding.currentPrice;
                      const percentOfPortfolio = totalPortfolioValue > 0 ? (holdingValue / totalPortfolioValue) * 100 : 0;
                      return (
                        <tr key={holding.symbol}>
                          <td>
                            <Link href={`/stock/${holding.symbol.toLowerCase()}`}>
                              <span className="font-bold hover:text-blue-400 cursor-pointer transition-colors" style={{ color: 'var(--text-primary)' }}>
                                {holding.symbol}
                              </span>
                            </Link>
                          </td>
                          <td className="text-right font-semibold" style={{ color: 'var(--text-secondary)' }}>{holding.shares}</td>
                          <td className="text-right font-semibold" style={{ color: 'var(--text-primary)' }}>
                            ${holdingValue.toFixed(2)}
                          </td>
                          <td className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.min(percentOfPortfolio, 100)}%` }}
                                ></div>
                              </div>
                              <span className="font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>
                                {percentOfPortfolio.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--gradient-primary)' }}>
                  <svg className="w-10 h-10" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-xl mb-2" style={{ color: 'var(--text-primary)' }}>No holdings yet.</p>
                <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>Start trading to build your portfolio!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trading Signals */}
      <div className="mt-8">
        <TradingSignals />
      </div>
    </div>
  );
}