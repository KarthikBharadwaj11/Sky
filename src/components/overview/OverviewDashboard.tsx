'use client';

import { useAuth } from '../auth/AuthProvider';
import { useState, useEffect, useRef } from 'react';
import LineChart from '../charts/LineChart';
import AreaChart from '../charts/AreaChart';
import ComparisonChart from '../charts/ComparisonChart';
import PieChart from '../charts/PieChart';
import TradingModal from '../trading/TradingModal';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

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

export default function OverviewDashboard() {
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
  const [isPortfolioLoading, setIsPortfolioLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState<Holding | null>(null);
  const [showTradingModal, setShowTradingModal] = useState(false);
  const [watchlists, setWatchlists] = useState<{ name: string; stocks: Stock[] }[]>([]);
  const [activeWatchlistIndex, setActiveWatchlistIndex] = useState(0);
  const [showWatchlistManager, setShowWatchlistManager] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [showAddStock, setShowAddStock] = useState(false);
  const [marketOverview, setMarketOverview] = useState<{ topStocks: Stock[]; us: Stock[]; international: Stock[]; commodities: Stock[] }>({ topStocks: [], us: [], international: [], commodities: [] });
  const [selectedMarketTab, setSelectedMarketTab] = useState<'topStocks' | 'us' | 'international' | 'commodities'>('topStocks');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

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

  // All available stocks for search
  const allStocks: Stock[] = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.15, changePercent: 1.24 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.21, change: -1.32, changePercent: -0.95 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.85, change: 4.12, changePercent: 1.10 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.42, change: -5.23, changePercent: -2.06 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 127.74, change: 1.89, changePercent: 1.50 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.28, change: 15.67, changePercent: 1.83 },
    { symbol: 'META', name: 'Meta Platforms', price: 312.96, change: -2.45, changePercent: -0.78 },
    { symbol: 'AMD', name: 'Advanced Micro Devices', price: 142.33, change: 3.21, changePercent: 2.31 },
    { symbol: 'NFLX', name: 'Netflix Inc.', price: 445.87, change: -8.12, changePercent: -1.79 },
    { symbol: 'COIN', name: 'Coinbase Global', price: 167.89, change: 12.34, changePercent: 7.93 },
    { symbol: 'V', name: 'Visa Inc.', price: 245.67, change: 1.89, changePercent: 0.78 },
    { symbol: 'JPM', name: 'JPMorgan Chase', price: 156.34, change: -2.11, changePercent: -1.33 },
    { symbol: 'WMT', name: 'Walmart Inc.', price: 159.88, change: 0.45, changePercent: 0.28 },
    { symbol: 'DIS', name: 'Walt Disney Co.', price: 92.15, change: 1.23, changePercent: 1.35 },
    { symbol: 'BA', name: 'Boeing Co.', price: 186.54, change: -3.45, changePercent: -1.82 },
    { symbol: 'NKE', name: 'Nike Inc.', price: 108.92, change: 2.34, changePercent: 2.20 },
    { symbol: 'INTC', name: 'Intel Corp.', price: 43.78, change: 0.89, changePercent: 2.07 },
    { symbol: 'PYPL', name: 'PayPal Holdings', price: 62.45, change: -1.12, changePercent: -1.76 },
    { symbol: 'ADBE', name: 'Adobe Inc.', price: 578.32, change: 5.67, changePercent: 0.99 },
    { symbol: 'CRM', name: 'Salesforce Inc.', price: 234.56, change: -4.23, changePercent: -1.77 },
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF', price: 452.89, change: 3.45, changePercent: 0.77 },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust', price: 389.12, change: 2.78, changePercent: 0.72 },
    { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', price: 415.34, change: 3.12, changePercent: 0.76 }
  ];

  // Handle click outside search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setTopStocks([
      { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.15, changePercent: 1.24 },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.21, change: -1.32, changePercent: -0.95 },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.85, change: 4.12, changePercent: 1.10 },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.42, change: -5.23, changePercent: -2.06 },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 127.74, change: 1.89, changePercent: 1.50 }
    ]);

    // Initialize watchlists from localStorage or create default
    const savedWatchlists = localStorage.getItem(`watchlists_${user?.id}`);
    if (savedWatchlists) {
      const parsed = JSON.parse(savedWatchlists);
      setWatchlists(parsed);
    } else {
      // Create default watchlist
      const defaultWatchlists = [
        {
          name: 'My Watchlist',
          stocks: [
            { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.28, change: 15.67, changePercent: 1.83 },
            { symbol: 'META', name: 'Meta Platforms', price: 312.96, change: -2.45, changePercent: -0.78 },
            { symbol: 'AMD', name: 'Advanced Micro Devices', price: 142.33, change: 3.21, changePercent: 2.31 },
            { symbol: 'NFLX', name: 'Netflix Inc.', price: 445.87, change: -8.12, changePercent: -1.79 },
            { symbol: 'COIN', name: 'Coinbase Global', price: 167.89, change: 12.34, changePercent: 7.93 }
          ]
        },
        {
          name: 'Tech Stocks',
          stocks: [
            { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.15, changePercent: 1.24 },
            { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.85, change: 4.12, changePercent: 1.10 },
            { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.21, change: -1.32, changePercent: -0.95 },
            { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 127.74, change: 1.89, changePercent: 1.50 }
          ]
        }
      ];
      setWatchlists(defaultWatchlists);
      if (user) {
        localStorage.setItem(`watchlists_${user.id}`, JSON.stringify(defaultWatchlists));
      }
    }

    // Backward compatibility with old watchlist
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

    // Market Overview
    setMarketOverview({
      topStocks: [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.15, changePercent: 1.24 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.21, change: -1.32, changePercent: -0.95 },
        { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.85, change: 4.12, changePercent: 1.10 },
        { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.42, change: -5.23, changePercent: -2.06 },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 127.74, change: 1.89, changePercent: 1.50 }
      ],
      us: [
        { symbol: 'SPX', name: 'S&P 500', price: 5234.18, change: 23.45, changePercent: 0.45 },
        { symbol: 'IXIC', name: 'NASDAQ', price: 16428.82, change: 127.34, changePercent: 0.78 },
        { symbol: 'DJI', name: 'Dow Jones', price: 38712.21, change: -46.32, changePercent: -0.12 },
        { symbol: 'RUT', name: 'Russell 2000', price: 2048.52, change: 15.67, changePercent: 0.77 },
        { symbol: 'VIX', name: 'Volatility Index', price: 14.23, change: -0.89, changePercent: -5.89 }
      ],
      international: [
        { symbol: 'FTSE', name: 'FTSE 100', price: 7842.45, change: 34.21, changePercent: 0.44 },
        { symbol: 'DAX', name: 'DAX', price: 17234.67, change: -45.32, changePercent: -0.26 },
        { symbol: 'CAC', name: 'CAC 40', price: 7523.89, change: 12.45, changePercent: 0.17 },
        { symbol: 'N225', name: 'Nikkei 225', price: 38456.78, change: 234.56, changePercent: 0.61 },
        { symbol: 'HSI', name: 'Hang Seng', price: 17892.34, change: -123.45, changePercent: -0.68 },
        { symbol: 'SSEC', name: 'Shanghai Composite', price: 3234.56, change: 23.45, changePercent: 0.73 }
      ],
      commodities: [
        { symbol: 'GC', name: 'Gold', price: 2034.50, change: 12.30, changePercent: 0.61 },
        { symbol: 'SI', name: 'Silver', price: 24.67, change: 0.34, changePercent: 1.40 },
        { symbol: 'CL', name: 'Crude Oil WTI', price: 78.45, change: -1.23, changePercent: -1.54 },
        { symbol: 'BZ', name: 'Brent Crude', price: 82.34, change: -0.89, changePercent: -1.07 },
        { symbol: 'NG', name: 'Natural Gas', price: 2.87, change: 0.12, changePercent: 4.36 }
      ]
    });

    // Load portfolio with loading state
    setIsPortfolioLoading(true);
    setTimeout(() => {
      const userHoldings = JSON.parse(localStorage.getItem(`portfolio_${user?.id}`) || '[]');
      setPortfolio(userHoldings);
      setIsPortfolioLoading(false);
    }, 500);

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

  const totalInvested = portfolio.reduce((total, holding) => {
    return total + (holding.shares * holding.averagePrice);
  }, 0);

  const totalReturn = totalPortfolioValue - totalInvested;
  const totalReturnPercent = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

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

  // Portfolio allocation data for pie chart
  const allocationData = portfolio.map(holding => ({
    name: holding.symbol,
    value: holding.shares * holding.currentPrice
  }));

  // Handle trade action
  const handleTrade = (holding: Holding) => {
    setSelectedStock(holding);
    setShowTradingModal(true);
  };

  // Watchlist management functions
  const createNewWatchlist = () => {
    if (!newWatchlistName.trim()) return;

    const newWatchlists = [...watchlists, { name: newWatchlistName, stocks: [] }];
    setWatchlists(newWatchlists);
    if (user) {
      localStorage.setItem(`watchlists_${user.id}`, JSON.stringify(newWatchlists));
    }
    setNewWatchlistName('');
    setShowWatchlistManager(false);
    setActiveWatchlistIndex(newWatchlists.length - 1);
  };

  const deleteWatchlist = (index: number) => {
    if (watchlists.length <= 1) {
      alert('You must have at least one watchlist');
      return;
    }

    const newWatchlists = watchlists.filter((_, i) => i !== index);
    setWatchlists(newWatchlists);
    if (user) {
      localStorage.setItem(`watchlists_${user.id}`, JSON.stringify(newWatchlists));
    }
    if (activeWatchlistIndex >= newWatchlists.length) {
      setActiveWatchlistIndex(newWatchlists.length - 1);
    }
  };

  const removeFromWatchlist = (stockSymbol: string) => {
    const updatedWatchlists = [...watchlists];
    updatedWatchlists[activeWatchlistIndex].stocks = updatedWatchlists[activeWatchlistIndex].stocks.filter(
      s => s.symbol !== stockSymbol
    );
    setWatchlists(updatedWatchlists);
    if (user) {
      localStorage.setItem(`watchlists_${user.id}`, JSON.stringify(updatedWatchlists));
    }
  };

  const currentWatchlist = watchlists[activeWatchlistIndex] || { name: 'My Watchlist', stocks: [] };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const results = allStocks.filter(stock =>
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
    setShowSearchResults(true);
  };

  const handleSelectStock = (stock: Stock) => {
    setSearchQuery('');
    setShowSearchResults(false);
    // For now, just close the search - functionality to be added later
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar - Watchlist - Fixed */}
      <div className="w-[20.8rem] glass-morphism border-r border-white/10 fixed left-0 top-[120px] h-[calc(100vh-120px)] overflow-hidden z-20 flex flex-col">
        {/* Watchlist Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Watchlists
            </h2>
            <button
              onClick={() => setShowWatchlistManager(!showWatchlistManager)}
              className="p-1.5 rounded-lg glass-morphism hover:bg-white/10 transition-all duration-200"
              style={{ color: 'var(--text-secondary)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
          </div>

          {/* Watchlist Tabs */}
          <div className="flex gap-1 overflow-x-auto hide-scrollbar">
            {watchlists.map((wl, index) => (
              <button
                key={index}
                onClick={() => setActiveWatchlistIndex(index)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeWatchlistIndex === index
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'glass-morphism hover:bg-white/5'
                }`}
                style={activeWatchlistIndex !== index ? { color: 'var(--text-secondary)' } : {}}
              >
                {wl.name}
              </button>
            ))}
          </div>
        </div>

        {/* Watchlist Manager Modal */}
        {showWatchlistManager && (
          <div className="p-4 border-b border-white/10 glass-morphism">
            <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Manage Watchlists</h3>
            <div className="space-y-2 mb-3">
              {watchlists.map((wl, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg glass-morphism">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{wl.name}</span>
                  {watchlists.length > 1 && (
                    <button
                      onClick={() => deleteWatchlist(index)}
                      className="p-1 rounded hover:bg-red-500/20 transition-colors"
                    >
                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newWatchlistName}
                onChange={(e) => setNewWatchlistName(e.target.value)}
                placeholder="New watchlist name"
                className="flex-1 px-3 py-2 rounded-lg text-sm glass-morphism border border-white/10 focus:border-blue-500/50 outline-none"
                style={{ color: 'var(--text-primary)' }}
              />
              <button
                onClick={createNewWatchlist}
                disabled={!newWatchlistName.trim()}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* Stocks List */}
        <div className="flex-1 overflow-y-auto p-4">
          {currentWatchlist.stocks.length > 0 ? (
            <div className="space-y-3">
              {currentWatchlist.stocks.map((stock) => (
                <div key={stock.symbol} className="glass-morphism rounded-xl border border-white/5 hover:border-blue-500/30 transition-all duration-200 overflow-hidden">
                  <Link href={`/stock/${stock.symbol.toLowerCase()}`}>
                    <div className="p-4 hover:bg-white/5 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                              {stock.symbol}
                            </span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${stock.change >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                              {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                            </span>
                          </div>
                          <p className="text-xs truncate mb-2" style={{ color: 'var(--text-tertiary)' }}>{stock.name}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            removeFromWatchlist(stock.symbol);
                          }}
                          className="p-1 rounded hover:bg-red-500/20 transition-colors"
                        >
                          <svg className="w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex items-end justify-between">
                        <div>
                          <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            ${stock.price.toFixed(2)}
                          </span>
                        </div>
                        <div className={`text-sm font-semibold flex items-center gap-1 ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {stock.change >= 0 ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                          ${Math.abs(stock.change).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </Link>
                  <Link href={`/stock/${stock.symbol.toLowerCase()}`}>
                    <button className="w-full px-4 py-2 text-sm font-semibold transition-all duration-200 bg-gradient-to-r from-blue-500/10 to-purple-600/10 hover:from-blue-500/20 hover:to-purple-600/20 border-t border-white/5" style={{ color: 'var(--primary-blue)' }}>
                      Trade Now →
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-secondary)' }}>
                <svg className="w-8 h-8" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>No stocks yet</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Add stocks to track them here</p>
            </div>
          )}
        </div>

        {/* Add Stock Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => setShowAddStock(true)}
            className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/50 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Stock
          </button>
        </div>
      </div>

      {/* Main Content - with left margin to account for sidebar */}
      <div className="flex-1 ml-[20.8rem] px-8 pt-8 pb-8">
        {/* 1. Stats Cards */}
        <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card pulse-glow">
            <div className="card-body p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Buying Power</h3>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-secondary)' }}>
                  <svg className="w-4 h-4" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold mb-1" style={{ color: 'var(--success)' }}>${user?.balance.toFixed(2)}</p>
              <span className="text-[10px] text-green-400 font-semibold">+2.1% this week</span>
            </div>
          </div>
          <div className="card pulse-glow">
            <div className="card-body p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Portfolio Value</h3>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-accent)' }}>
                  <svg className="w-4 h-4" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold mb-1" style={{ color: 'var(--primary-blue)' }}>${totalPortfolioValue.toFixed(2)}</p>
              <span className="text-[10px] text-green-400 font-semibold">+5.8% this week</span>
            </div>
          </div>
          <div className="card pulse-glow">
            <div className="card-body p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Total Return</h3>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                  <svg className="w-4 h-4" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold mb-1" style={{ color: 'var(--accent-violet)' }}>
                ${((user?.balance || 0) + totalPortfolioValue).toFixed(2)}
              </p>
              <span className="text-[10px] text-green-400 font-semibold">+12.3% all time</span>
            </div>
          </div>
          <div className="card pulse-glow">
            <div className="card-body p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Today's P&L</h3>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
                  <svg className="w-4 h-4" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold mb-1 text-green-400">+$234.56</p>
              <span className="text-[10px] text-green-400 font-semibold">+2.1% today</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Charts Section - Moved above Holdings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="card-body p-4">
            <h3 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Portfolio Performance</h3>

            {/* Sub-tabs for P&L and Symbol */}
            <div className="flex gap-2 mb-4">
              <button
                className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
              >
                P&L
              </button>
              <button
                className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Symbol
              </button>
            </div>

            <LineChart
              data={portfolioHistory}
              color="#10B981"
              height={280}
              minimalistic={false}
              showGrid={true}
              enableZoom={true}
            />
            <div className="flex justify-center gap-1.5 mt-3">
              {timeframeOptions.map((option) => (
                <button
                  key={option.value}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
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
          <div className="card-body p-4">
            <h3 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Portfolio vs Market</h3>
            <ComparisonChart
              data={comparisonData}
              height={256}
              showGrid={true}
            />
            <div className="flex justify-center gap-1.5 mt-3">
              {comparisonTimeframeOptions.map((option) => (
                <button
                  key={option.value}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
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

      {/* 3. Market Overview */}
      <div className="card mb-8">
        <div className="card-body">
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Market Overview
          </h2>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setSelectedMarketTab('topStocks')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedMarketTab === 'topStocks'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              style={selectedMarketTab !== 'topStocks' ? { color: 'var(--text-secondary)' } : {}}
            >
              Top Stocks
            </button>
            <button
              onClick={() => setSelectedMarketTab('us')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedMarketTab === 'us'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              style={selectedMarketTab !== 'us' ? { color: 'var(--text-secondary)' } : {}}
            >
              US Indices
            </button>
            <button
              onClick={() => setSelectedMarketTab('international')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedMarketTab === 'international'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              style={selectedMarketTab !== 'international' ? { color: 'var(--text-secondary)' } : {}}
            >
              International
            </button>
            <button
              onClick={() => setSelectedMarketTab('commodities')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedMarketTab === 'commodities'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              style={selectedMarketTab !== 'commodities' ? { color: 'var(--text-secondary)' } : {}}
            >
              Commodities
            </button>
          </div>

          {/* Market Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketOverview[selectedMarketTab].map((item) => (
              <div key={item.symbol} className="glass-morphism p-4 rounded-xl hover:bg-white/5 transition-all duration-200 border border-white/5 hover:border-blue-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{item.symbol}</h3>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{item.name}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    item.changePercent >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className={`text-xs font-medium ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Positions Table */}
      <div className="card mb-8">
        <div className="card-body p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              Positions
            </h2>
          </div>

          {isPortfolioLoading ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Loading portfolio...</p>
            </div>
          ) : portfolio.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Name</th>
                    <th className="text-right">Shares</th>
                    <th className="text-right">Avg Price</th>
                    <th className="text-right">Current Price</th>
                    <th className="text-right">Market Value</th>
                    <th className="text-right">Total Return</th>
                    <th className="text-right">% of Portfolio</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.map((holding) => {
                    const marketValue = holding.shares * holding.currentPrice;
                    const totalCost = holding.shares * holding.averagePrice;
                    const gainLoss = marketValue - totalCost;
                    const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;
                    const percentOfPortfolio = totalPortfolioValue > 0 ? (marketValue / totalPortfolioValue) * 100 : 0;

                    return (
                      <tr key={holding.symbol}>
                        <td>
                          <Link href={`/stock/${holding.symbol.toLowerCase()}`}>
                            <span className="font-bold hover:text-blue-400 cursor-pointer transition-colors" style={{ color: 'var(--text-primary)' }}>
                              {holding.symbol}
                            </span>
                          </Link>
                        </td>
                        <td style={{ color: 'var(--text-tertiary)' }}>{holding.name}</td>
                        <td className="text-right font-semibold" style={{ color: 'var(--text-secondary)' }}>{holding.shares}</td>
                        <td className="text-right font-semibold" style={{ color: 'var(--text-secondary)' }}>${holding.averagePrice.toFixed(2)}</td>
                        <td className="text-right font-semibold" style={{ color: 'var(--text-primary)' }}>${holding.currentPrice.toFixed(2)}</td>
                        <td className="text-right font-bold" style={{ color: 'var(--text-primary)' }}>${marketValue.toFixed(2)}</td>
                        <td className={`text-right font-bold ${gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {gainLoss >= 0 ? '+' : ''}${gainLoss.toFixed(2)} ({gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%)
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
                        <td className="text-right">
                          <button
                            onClick={() => handleTrade(holding)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/50"
                          >
                            Trade
                          </button>
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
              <p className="text-xl mb-2" style={{ color: 'var(--text-primary)' }}>No positions yet.</p>
              <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>Start trading to build your portfolio!</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Performance Metrics & Market Movers | Recent Activity & Copy Trading */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Left Column: Performance Metrics + Market Movers */}
        <div className="space-y-8">
          {/* Performance Metrics */}
          <div className="card">
            <div className="card-body">
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Performance Metrics
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-morphism p-3 rounded-lg">
                  <span className="text-xs block mb-1" style={{ color: 'var(--text-secondary)' }}>Total Return</span>
                  <span className={`text-lg font-bold ${totalReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {totalReturn >= 0 ? '+' : ''}${totalReturn.toFixed(2)}
                  </span>
                </div>
                <div className="glass-morphism p-3 rounded-lg">
                  <span className="text-xs block mb-1" style={{ color: 'var(--text-secondary)' }}>Return %</span>
                  <span className={`text-lg font-bold ${totalReturnPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {totalReturnPercent >= 0 ? '+' : ''}{totalReturnPercent.toFixed(2)}%
                  </span>
                </div>
                <div className="glass-morphism p-3 rounded-lg">
                  <span className="text-xs block mb-1" style={{ color: 'var(--text-secondary)' }}>Best Day</span>
                  <span className="text-lg font-bold text-green-400">+$1,234.56</span>
                </div>
                <div className="glass-morphism p-3 rounded-lg">
                  <span className="text-xs block mb-1" style={{ color: 'var(--text-secondary)' }}>Worst Day</span>
                  <span className="text-lg font-bold text-red-400">-$567.89</span>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Market Movers */}
          <div className="card">
            <div className="card-body">
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                Today's Market Movers
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
                    Gainers
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
                    Losers
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
                    Most Active
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

        {/* Recent Activity */}
        <div className="card">
          <div className="card-body">
            <div className="mb-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Recent Activity
              </h2>
            </div>

            <div className="space-y-3">
              {recentActivities.map((activity) => {
                const getActivityIcon = (type: string) => {
                  switch (type) {
                    case 'buy':
                      return { icon: 'BUY', color: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', label: 'Bought' };
                    case 'sell':
                      return { icon: 'SELL', color: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', label: 'Sold' };
                    case 'dividend':
                      return { icon: 'DIV', color: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', label: 'Dividend' };
                    case 'watchlist':
                      return { icon: 'WL', color: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', label: 'Added to Watchlist' };
                    case 'price_alert':
                      return { icon: 'ALT', color: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', label: 'Price Alert' };
                    default:
                      return { icon: 'ACT', color: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)', label: 'Activity' };
                  }
                };

                const activityInfo = getActivityIcon(activity.type);

                return (
                  <div key={activity.id} className="glass-morphism p-4 rounded-xl hover:bg-white/5 transition-all duration-200 border border-white/5 hover:border-blue-500/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: activityInfo.color }}>
                        <span className="text-xs font-bold text-white">{activityInfo.icon}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{activityInfo.label}</span>
                          {activity.symbol && (
                            <Link href={`/stock/${activity.symbol?.toLowerCase()}`}>
                              <span className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
                                ${activity.symbol}
                              </span>
                            </Link>
                          )}
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
      </div>

      {/* 5. Asset Allocation */}
      {portfolio.length > 0 && (
        <div className="card mb-12">
          <div className="card-body">
            <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Asset Allocation</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex items-center justify-center">
                <PieChart
                  data={allocationData}
                  title="Asset Allocation"
                  height={300}
                />
              </div>
              <div className="space-y-3">
                <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>Position Details</h4>
                {portfolio.map((holding, index) => {
                  const marketValue = holding.shares * holding.currentPrice;
                  const percentOfPortfolio = totalPortfolioValue > 0 ? (marketValue / totalPortfolioValue) * 100 : 0;
                  const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444'];
                  const color = colors[index % colors.length];

                  return (
                    <div key={holding.symbol} className="glass-morphism p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                          <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{holding.symbol}</span>
                        </div>
                        <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{percentOfPortfolio.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span style={{ color: 'var(--text-secondary)' }}>{holding.shares} shares</span>
                        <span style={{ color: 'var(--text-secondary)' }}>${marketValue.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Market News & Sentiment Section */}
      <div className="card mb-12">
        <div className="card-body">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
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
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gradient-primary)' }}>
                  <span className="text-white font-bold text-xs">UP</span>
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
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gradient-secondary)' }}>
                  <span className="text-white font-bold text-xs">FED</span>
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
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gradient-accent)' }}>
                  <span className="text-white font-bold text-xs">BTC</span>
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
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--success)' }}>
                  <span className="text-white font-bold text-xs">ER</span>
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
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--primary-purple)' }}>
                  <span className="text-white font-bold text-xs">AI</span>
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
              <div className="flex items-start">
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

        {/* Trading Modal */}
        {showTradingModal && selectedStock && (
          <TradingModal
            symbol={selectedStock.symbol}
            name={selectedStock.name}
            currentPrice={selectedStock.currentPrice}
            onClose={() => {
              setShowTradingModal(false);
              setSelectedStock(null);
            }}
          />
        )}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
