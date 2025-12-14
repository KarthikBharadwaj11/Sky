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
      { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.15, changePercent: 1.24, volume: 45678900, marketCap: '2.8T', sector: 'Technology' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.42, change: -5.23, changePercent: -2.06, volume: 67890123, marketCap: '789B', sector: 'Automotive' },
      { symbol: 'META', name: 'Meta Platforms Inc.', price: 644.23, change: -2.45, changePercent: -0.38, volume: 45678901, marketCap: '1.5T', sector: 'Technology' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.21, change: -1.32, changePercent: -0.95, volume: 23456789, marketCap: '1.7T', sector: 'Technology' },
      { symbol: 'NFLX', name: 'Netflix Inc.', price: 95.98, change: -8.12, changePercent: -7.80, volume: 34567891, marketCap: '42B', sector: 'Communication' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 180.00, change: -2.85, changePercent: -1.55, volume: 78901234, marketCap: '2.2T', sector: 'Technology' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.85, change: 4.12, changePercent: 1.10, volume: 34567890, marketCap: '2.9T', sector: 'Technology' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 127.74, change: 1.89, changePercent: 1.50, volume: 56789012, marketCap: '1.3T', sector: 'E-commerce' },
      { symbol: 'AMD', name: 'Advanced Micro Devices Inc.', price: 210.50, change: 3.21, changePercent: 1.55, volume: 34567897, marketCap: '340B', sector: 'Technology' },
      { symbol: 'RIVN', name: 'Rivian Automotive Inc.', price: 18.92, change: 2.12, changePercent: 12.61, volume: 23456788, marketCap: '18B', sector: 'Automotive' }
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
    <div className="min-h-screen trading-background">
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
