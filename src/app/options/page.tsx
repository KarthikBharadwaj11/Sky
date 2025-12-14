'use client';

import { useState } from 'react';
import OptionsChain from '@/components/options/OptionsChain';
import { OptionsPosition } from '@/types/options';
import { TrendingUp, TrendingDown, Search, Calendar, Activity } from 'lucide-react';
import AccountSwitcher from '@/components/trading/AccountSwitcher';

export default function OptionsPage() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('NVDA');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock active positions
  const activePositions: OptionsPosition[] = [
    {
      id: '1',
      symbol: 'AAPL',
      stockName: 'Apple Inc.',
      type: 'call',
      strike: 175,
      expiration: '2024-03-15',
      quantity: 2,
      action: 'buy_to_open',
      entryPremium: 5.25,
      currentPremium: 6.80,
      totalCost: 1050,
      currentValue: 1360,
      profitLoss: 310,
      profitLossPercent: 29.52,
      breakEven: 180.25,
      daysToExpiration: 8,
      purchaseDate: '2024-03-01'
    },
    {
      id: '2',
      symbol: 'TSLA',
      stockName: 'Tesla Inc.',
      type: 'put',
      strike: 250,
      expiration: '2024-03-22',
      quantity: 1,
      action: 'buy_to_open',
      entryPremium: 8.50,
      currentPremium: 7.20,
      totalCost: 850,
      currentValue: 720,
      profitLoss: -130,
      profitLossPercent: -15.29,
      breakEven: 241.50,
      daysToExpiration: 15,
      purchaseDate: '2024-02-28'
    },
    {
      id: '3',
      symbol: 'NVDA',
      stockName: 'NVIDIA Corp.',
      type: 'call',
      strike: 870,
      expiration: '2024-04-05',
      quantity: 1,
      action: 'buy_to_open',
      entryPremium: 18.75,
      currentPremium: 24.30,
      totalCost: 1875,
      currentValue: 2430,
      profitLoss: 555,
      profitLossPercent: 29.60,
      breakEven: 888.75,
      daysToExpiration: 29,
      purchaseDate: '2024-02-25'
    }
  ];

  // Mock upcoming expirations
  const upcomingExpirations = [
    { date: '2024-03-15', count: 2, value: 2410 },
    { date: '2024-03-22', count: 1, value: 720 },
    { date: '2024-04-05', count: 1, value: 2430 }
  ];

  // Mock most active options
  const mostActiveOptions = [
    { symbol: 'SPY', type: 'call' as const, strike: 520, volume: 125420, price: 3.25, change: 8.5 },
    { symbol: 'AAPL', type: 'put' as const, strike: 170, volume: 98540, price: 2.15, change: -3.2 },
    { symbol: 'TSLA', type: 'call' as const, strike: 250, volume: 87230, price: 12.40, change: 15.7 },
    { symbol: 'NVDA', type: 'call' as const, strike: 900, volume: 76890, price: 15.80, change: 22.3 }
  ];

  const popularSymbols = ['AAPL', 'TSLA', 'NVDA', 'SPY', 'MSFT', 'AMZN'];

  const totalValue = activePositions.reduce((sum, pos) => sum + pos.currentValue, 0);
  const totalPL = activePositions.reduce((sum, pos) => sum + pos.profitLoss, 0);
  const totalPLPercent = (totalPL / (totalValue - totalPL)) * 100;

  const formatVolume = (vol: number) => {
    if (vol >= 1000) return `${(vol / 1000).toFixed(1)}K`;
    return vol.toString();
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="max-w-[95vw] mx-auto px-6 py-6 space-y-6">
        {/* Account Switcher */}
        <div className="flex justify-end mb-4">
          <AccountSwitcher />
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Options Trading
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Trade calls and puts with real-time options chains
            </p>
          </div>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Value */}
          <div className="card">
            <div className="card-body">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Total Options Buying Power
                </span>
                <Activity className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                ${totalValue.toLocaleString()}
              </div>
            </div>
          </div>

          {/* P/L */}
          <div className="card">
            <div className="card-body">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Total P/L
                </span>
                {totalPL >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
              </div>
              <div className={`text-2xl font-bold ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalPL >= 0 ? '+' : ''}${totalPL.toFixed(0)}
                <span className="text-sm ml-2">
                  ({totalPL >= 0 ? '+' : ''}{totalPLPercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Active Positions */}
          <div className="card">
            <div className="card-body">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Active Positions
                </span>
                <Calendar className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {activePositions.length}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Active Positions & Expirations */}
          <div className="lg:col-span-3 space-y-6">
            {/* Active Positions */}
            <div className="card">
              <div className="card-body">
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Active Positions
                </h3>
                <div className="space-y-3">
                  {activePositions.map((position) => (
                    <div
                      key={position.id}
                      className="p-3 rounded-lg glass-morphism hover:bg-white/5 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                              {position.symbol}
                            </span>
                            <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${
                              position.type === 'call' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {position.type.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                            ${position.strike} • {position.expiration}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-bold ${
                            position.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {position.profitLoss >= 0 ? '+' : ''}${position.profitLoss}
                          </div>
                          <div className={`text-xs ${
                            position.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {position.profitLoss >= 0 ? '+' : ''}{position.profitLossPercent.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        <span>{position.quantity} contract{position.quantity > 1 ? 's' : ''}</span>
                        <span>{position.daysToExpiration} days left</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Expirations */}
            <div className="card">
              <div className="card-body">
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Upcoming Expirations
                </h3>
                <div className="space-y-3">
                  {upcomingExpirations.map((exp) => (
                    <div
                      key={exp.date}
                      className="flex items-center justify-between p-3 rounded-lg glass-morphism"
                    >
                      <div>
                        <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {exp.date}
                        </div>
                        <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                          {exp.count} position{exp.count > 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                          ${exp.value.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Most Active Options */}
            <div className="card">
              <div className="card-body">
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Most Active
                </h3>
                <div className="space-y-3">
                  {mostActiveOptions.map((option, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg glass-morphism hover:bg-white/5 transition-all cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                            {option.symbol}
                          </span>
                          <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${
                            option.type === 'call' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {option.type.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                          ${option.strike} • Vol: {formatVolume(option.volume)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                          ${option.price.toFixed(2)}
                        </div>
                        <div className={`text-xs font-semibold ${
                          option.change >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {option.change >= 0 ? '+' : ''}{option.change.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Options Chain */}
          <div className="lg:col-span-9">
            <div className="card">
              <div className="card-body">
                {/* Stock Search */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                    <input
                      type="text"
                      placeholder="Search for a stock to view options chain..."
                      value=""
                      disabled
                      className="w-full pl-10 pr-4 py-3 rounded-lg glass-morphism text-sm cursor-not-allowed opacity-70"
                      style={{ color: 'var(--text-primary)' }}
                    />
                  </div>

                  {/* Popular Symbols */}
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                      Popular:
                    </span>
                    {popularSymbols.map((symbol) => (
                      <button
                        key={symbol}
                        onClick={() => setSelectedSymbol(symbol)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                          selectedSymbol === symbol
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                            : 'glass-morphism text-gray-400 hover:text-white'
                        }`}
                      >
                        {symbol}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Options Chain */}
                <OptionsChain
                  symbol={selectedSymbol}
                  onTrade={(type, strike, expiration) => {
                    console.log('Trade clicked:', { type, strike, expiration });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
