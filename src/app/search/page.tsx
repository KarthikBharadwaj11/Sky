'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import TradingModal from '@/components/trading/TradingModal';
import Link from 'next/link';
import { TrendingUp, TrendingDown, BarChart3, Grid3x3, List, Sparkles } from 'lucide-react';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  sector: string;
}

export default function SearchStocks() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Market indices
  const marketIndices = [
    { name: 'S&P 500', value: 4567.89, change: 23.45, changePercent: 0.52 },
    { name: 'NASDAQ', value: 15234.56, change: -45.67, changePercent: -0.30 },
    { name: 'DOW', value: 35678.90, change: 125.34, changePercent: 0.35 }
  ];

  useEffect(() => {
    const mockStocks: Stock[] = [
      // Tech Giants
      { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.15, changePercent: 1.24, volume: 45678900, marketCap: '2.8T', sector: 'Technology' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.21, change: -1.32, changePercent: -0.95, volume: 23456789, marketCap: '1.7T', sector: 'Technology' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.85, change: 4.12, changePercent: 1.10, volume: 34567890, marketCap: '2.9T', sector: 'Technology' },
      { symbol: 'META', name: 'Meta Platforms Inc.', price: 312.96, change: -2.45, changePercent: -0.78, volume: 45678901, marketCap: '791B', sector: 'Technology' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.28, change: 15.67, changePercent: 1.83, volume: 78901234, marketCap: '2.2T', sector: 'Technology' },
      { symbol: 'NFLX', name: 'Netflix Inc.', price: 445.87, change: -8.12, changePercent: -1.79, volume: 34567891, marketCap: '198B', sector: 'Communication' },
      { symbol: 'CRM', name: 'Salesforce Inc.', price: 218.54, change: 3.21, changePercent: 1.49, volume: 23456790, marketCap: '214B', sector: 'Technology' },

      // E-commerce & Retail
      { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 127.74, change: 1.89, changePercent: 1.50, volume: 56789012, marketCap: '1.3T', sector: 'Consumer Discretionary' },
      { symbol: 'SHOP', name: 'Shopify Inc.', price: 67.89, change: 2.34, changePercent: 3.57, volume: 12345678, marketCap: '84B', sector: 'Technology' },
      { symbol: 'WMT', name: 'Walmart Inc.', price: 158.92, change: 1.23, changePercent: 0.78, volume: 23456781, marketCap: '434B', sector: 'Consumer Staples' },

      // Automotive
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.42, change: -5.23, changePercent: -2.06, volume: 67890123, marketCap: '789B', sector: 'Consumer Discretionary' },
      { symbol: 'F', name: 'Ford Motor Co.', price: 12.45, change: 0.34, changePercent: 2.81, volume: 78901235, marketCap: '50B', sector: 'Consumer Discretionary' },
      { symbol: 'GM', name: 'General Motors Co.', price: 38.76, change: -0.89, changePercent: -2.25, volume: 34567892, marketCap: '56B', sector: 'Consumer Discretionary' },

      // Financial Services
      { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 154.32, change: 2.87, changePercent: 1.89, volume: 45678903, marketCap: '453B', sector: 'Financial Services' },
      { symbol: 'BAC', name: 'Bank of America Corp.', price: 32.18, change: -0.45, changePercent: -1.38, volume: 56789013, marketCap: '259B', sector: 'Financial Services' },
      { symbol: 'WFC', name: 'Wells Fargo & Co.', price: 43.91, change: 1.12, changePercent: 2.62, volume: 23456782, marketCap: '162B', sector: 'Financial Services' },
      { symbol: 'V', name: 'Visa Inc.', price: 267.45, change: 3.21, changePercent: 1.22, volume: 34567893, marketCap: '570B', sector: 'Financial Services' },
      { symbol: 'MA', name: 'Mastercard Inc.', price: 412.87, change: 4.56, changePercent: 1.12, volume: 12345679, marketCap: '395B', sector: 'Financial Services' },

      // Transportation & Logistics
      { symbol: 'UBER', name: 'Uber Technologies Inc.', price: 62.31, change: -1.08, changePercent: -1.70, volume: 45678902, marketCap: '129B', sector: 'Technology' },
      { symbol: 'LYFT', name: 'Lyft Inc.', price: 14.82, change: 0.67, changePercent: 4.73, volume: 23456783, marketCap: '5.2B', sector: 'Technology' },
      { symbol: 'FDX', name: 'FedEx Corp.', price: 251.34, change: -2.45, changePercent: -0.97, volume: 34567894, marketCap: '65B', sector: 'Industrials' },

      // Healthcare & Pharma
      { symbol: 'JNJ', name: 'Johnson & Johnson', price: 158.92, change: 1.87, changePercent: 1.19, volume: 56789014, marketCap: '418B', sector: 'Healthcare' },
      { symbol: 'PFE', name: 'Pfizer Inc.', price: 28.45, change: -0.34, changePercent: -1.18, volume: 78901236, marketCap: '160B', sector: 'Healthcare' },
      { symbol: 'MRNA', name: 'Moderna Inc.', price: 87.23, change: 2.91, changePercent: 3.45, volume: 23456784, marketCap: '32B', sector: 'Healthcare' },

      // Energy
      { symbol: 'XOM', name: 'Exxon Mobil Corp.', price: 108.76, change: 3.21, changePercent: 3.04, volume: 34567895, marketCap: '456B', sector: 'Energy' },
      { symbol: 'CVX', name: 'Chevron Corp.', price: 147.89, change: 2.34, changePercent: 1.61, volume: 45678904, marketCap: '284B', sector: 'Energy' },

      // Aerospace & Defense
      { symbol: 'BA', name: 'Boeing Co.', price: 198.45, change: -4.23, changePercent: -2.09, volume: 56789015, marketCap: '118B', sector: 'Industrials' },
      { symbol: 'LMT', name: 'Lockheed Martin Corp.', price: 432.18, change: 1.87, changePercent: 0.43, volume: 12345680, marketCap: '108B', sector: 'Industrials' },

      // Food & Beverage
      { symbol: 'KO', name: 'Coca-Cola Co.', price: 59.87, change: 0.45, changePercent: 0.76, volume: 23456785, marketCap: '259B', sector: 'Consumer Staples' },
      { symbol: 'PEP', name: 'PepsiCo Inc.', price: 172.34, change: -0.89, changePercent: -0.51, volume: 34567896, marketCap: '237B', sector: 'Consumer Staples' },
      { symbol: 'MCD', name: 'McDonald\'s Corp.', price: 289.76, change: 2.14, changePercent: 0.74, volume: 45678905, marketCap: '214B', sector: 'Consumer Discretionary' },

      // Entertainment & Media
      { symbol: 'DIS', name: 'Walt Disney Co.', price: 91.23, change: -1.45, changePercent: -1.56, volume: 56789016, marketCap: '166B', sector: 'Communication' },
      { symbol: 'SPOT', name: 'Spotify Technology SA', price: 156.78, change: 3.21, changePercent: 2.09, volume: 23456786, marketCap: '30B', sector: 'Communication' },

      // Semiconductors
      { symbol: 'AMD', name: 'Advanced Micro Devices Inc.', price: 134.56, change: 4.23, changePercent: 3.25, volume: 34567897, marketCap: '217B', sector: 'Technology' },
      { symbol: 'INTC', name: 'Intel Corp.', price: 43.21, change: -0.78, changePercent: -1.77, volume: 45678906, marketCap: '183B', sector: 'Technology' },

      // Real Estate
      { symbol: 'AMT', name: 'American Tower Corp.', price: 198.45, change: 1.23, changePercent: 0.62, volume: 12345681, marketCap: '89B', sector: 'Real Estate' },

      // Cryptocurrency Related
      { symbol: 'COIN', name: 'Coinbase Global Inc.', price: 89.76, change: 5.67, changePercent: 6.74, volume: 23456787, marketCap: '22B', sector: 'Financial Services' }
    ];

    setStocks(mockStocks);
    setFilteredStocks(mockStocks);
  }, []);

  useEffect(() => {
    let filtered = stocks;

    // Filter by sector
    if (selectedSector !== 'All') {
      filtered = filtered.filter(stock => stock.sector === selectedSector);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        stock =>
          stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stock.sector.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStocks(filtered);
  }, [searchTerm, stocks, selectedSector]);

  const handleTradeClick = (stock: Stock) => {
    setSelectedStock(stock);
    setShowTradeModal(true);
  };

  const sectors = ['All', 'Technology', 'Financial Services', 'Consumer Discretionary', 'Consumer Staples', 'Healthcare', 'Energy', 'Industrials', 'Communication', 'Real Estate'];

  const getSectorColor = (sector: string) => {
    const colors = {
      'Technology': 'var(--primary-blue)',
      'Financial Services': 'var(--success)',
      'Consumer Discretionary': 'var(--primary-purple)',
      'Consumer Staples': 'var(--warning)',
      'Healthcare': 'var(--error)',
      'Energy': '#f59e0b',
      'Industrials': '#64748b',
      'Communication': 'var(--accent-violet)',
      'Real Estate': '#059669'
    };
    return colors[sector as keyof typeof colors] || 'var(--primary-blue)';
  };

  const topGainers = [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
  const topLosers = [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
  const trendingStocks = stocks.filter((_, i) => [0, 4, 8, 12].includes(i));

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gradient mb-6">
            Please log in to search and trade stocks
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-background)' }}>
      <div className="container mx-auto p-6 pt-28">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient gradient-shift mb-2">
            Discover Stocks
          </h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            Search, analyze, and trade your favorite stocks
          </p>
        </div>

        {/* AI Recommendations */}
        <div className="card mb-6" style={{ background: 'rgba(168, 85, 247, 0.05)', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
          <div className="card-body p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-bold text-purple-400">AI Stock Recommendations</h2>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              Based on your portfolio and trading patterns, AI suggests these opportunities
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {stocks.slice(0, 3).map((stock) => (
                <Link key={stock.symbol} href={`/stock/${stock.symbol.toLowerCase()}`}>
                  <div className="glass-morphism p-3 rounded-lg hover:bg-white/5 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{stock.symbol}</span>
                      <span className={`text-xs font-semibold ${stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                    <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>${stock.price.toFixed(2)}</p>
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span className="text-xs text-purple-400">Strong buy signal</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Market Indices */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {marketIndices.map((index) => (
            <div key={index.name} className="card">
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>{index.name}</p>
                    <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {index.value.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center gap-1 ${index.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {index.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span className="text-sm font-bold">
                        {index.change >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trending & Top Movers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Trending Stocks */}
          <div className="card">
            <div className="card-body p-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4" style={{ color: 'var(--primary-blue)' }} />
                <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Trending</h3>
              </div>
              <div className="space-y-2">
                {trendingStocks.map((stock) => (
                  <Link key={stock.symbol} href={`/stock/${stock.symbol.toLowerCase()}`}>
                    <div className="flex items-center justify-between p-2 rounded-lg glass-morphism hover:bg-white/5 transition-all cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{stock.symbol}</p>
                          <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>${stock.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold ${stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Top Gainers */}
          <div className="card">
            <div className="card-body p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Top Gainers</h3>
              </div>
              <div className="space-y-2">
                {topGainers.map((stock) => (
                  <Link key={stock.symbol} href={`/stock/${stock.symbol.toLowerCase()}`}>
                    <div className="flex items-center justify-between p-2 rounded-lg glass-morphism hover:bg-white/5 transition-all cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{stock.symbol}</p>
                          <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>${stock.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-green-400">
                        +{stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Top Losers */}
          <div className="card">
            <div className="card-body p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Top Losers</h3>
              </div>
              <div className="space-y-2">
                {topLosers.map((stock) => (
                  <Link key={stock.symbol} href={`/stock/${stock.symbol.toLowerCase()}`}>
                    <div className="flex items-center justify-between p-2 rounded-lg glass-morphism hover:bg-white/5 transition-all cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{stock.symbol}</p>
                          <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>${stock.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-red-400">
                        {stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-6">
          <div className="glass-morphism rounded-xl p-4">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search stocks by name, symbol, or sector..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-transparent border-2 transition-all duration-300 focus:outline-none focus:border-blue-500 text-sm"
                style={{
                  borderColor: 'var(--glass-border)',
                  color: 'var(--text-primary)'
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Sector Filters & View Toggle */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {sectors.map((sector) => (
              <button
                key={sector}
                onClick={() => setSelectedSector(sector)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                  selectedSector === sector
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'glass-morphism'
                }`}
                style={selectedSector !== sector ? { color: 'var(--text-secondary)' } : {}}
              >
                {sector}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'glass-morphism'}`}
              style={viewMode !== 'grid' ? { color: 'var(--text-secondary)' } : {}}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'glass-morphism'}`}
              style={viewMode !== 'list' ? { color: 'var(--text-secondary)' } : {}}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stock Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredStocks.map((stock) => (
              <div
                key={stock.symbol}
                className="glass-morphism rounded-xl p-4 hover:scale-105 transition-all duration-300 cursor-pointer glow-effect group"
                style={{
                  borderLeft: `3px solid ${getSectorColor(stock.sector)}`
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Link href={`/stock/${stock.symbol.toLowerCase()}`}>
                      <h3 className="font-bold text-base hover:text-blue-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
                        {stock.symbol}
                      </h3>
                    </Link>
                    <p className="text-[10px]" style={{ color: getSectorColor(stock.sector) }}>
                      {stock.sector}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                      ${stock.price.toFixed(2)}
                    </p>
                    <p className={`text-xs font-semibold ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </p>
                  </div>
                </div>

                <h4 className="font-medium mb-2 text-xs line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                  {stock.name}
                </h4>

                <div className="flex items-center justify-between mb-3 text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                  <div>Vol: {(stock.volume / 1000000).toFixed(1)}M</div>
                  <div>Cap: {stock.marketCap}</div>
                </div>

                <button
                  onClick={() => handleTradeClick(stock)}
                  className="btn-primary w-full py-1.5 text-xs opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  Trade
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="card">
            <div className="card-body p-4">
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th className="text-left">Stock</th>
                      <th className="text-left">Name</th>
                      <th className="text-right">Price</th>
                      <th className="text-right">Change</th>
                      <th className="text-right">Volume</th>
                      <th className="text-right">Market Cap</th>
                      <th className="text-left">Sector</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStocks.map((stock) => (
                      <tr key={stock.symbol}>
                        <td>
                          <Link href={`/stock/${stock.symbol.toLowerCase()}`}>
                            <span className="font-bold hover:text-blue-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
                              {stock.symbol}
                            </span>
                          </Link>
                        </td>
                        <td className="text-sm" style={{ color: 'var(--text-secondary)' }}>{stock.name}</td>
                        <td className="text-right font-semibold" style={{ color: 'var(--text-primary)' }}>
                          ${stock.price.toFixed(2)}
                        </td>
                        <td className={`text-right font-semibold ${stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </td>
                        <td className="text-right text-sm" style={{ color: 'var(--text-tertiary)' }}>
                          {stock.volume.toLocaleString()}
                        </td>
                        <td className="text-right text-sm" style={{ color: 'var(--text-tertiary)' }}>
                          {stock.marketCap}
                        </td>
                        <td>
                          <span className="text-xs px-2 py-1 rounded-full glass-morphism" style={{ color: getSectorColor(stock.sector) }}>
                            {stock.sector}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            onClick={() => handleTradeClick(stock)}
                            className="px-3 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all"
                          >
                            Trade
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {filteredStocks.length === 0 && (
          <div className="text-center py-12">
            <div className="glass-morphism rounded-xl p-8 inline-block">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-secondary)' }}>
                <svg className="w-8 h-8" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                No stocks found
              </p>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Try adjusting your search or filters
              </p>
            </div>
          </div>
        )}

        {showTradeModal && selectedStock && (
          <TradingModal
            stock={selectedStock}
            onClose={() => {
              setShowTradeModal(false);
              setSelectedStock(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
