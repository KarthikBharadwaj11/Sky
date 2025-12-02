'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';
import OptionsPortfolio from '@/components/options/OptionsPortfolio';
import { OptionsPosition } from '@/types/options';

interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  symbol: string;
  name: string;
  shares: number;
  price: number;
  total: number;
  date: string;
  profit?: number;
  profitPercent?: number;
}

export default function PortfolioAnalytics() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'stocks' | 'options'>('stocks');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'profit' | 'amount'>('date');

  const loadTransactions = useCallback(() => {
    if (!user) return;

    const userTransactions = JSON.parse(localStorage.getItem(`transactions_${user.id}`) || '[]');
    setTransactions(userTransactions.sort((a: Transaction, b: Transaction) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
  }, [user]);

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user, loadTransactions]);

  // Mock options positions for visual prototype
  const mockOptionsPositions: OptionsPosition[] = [
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

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gradient mb-6">
            Please log in to view portfolio analytics
          </h1>
        </div>
      </div>
    );
  }

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === 'profit' && a.profit !== undefined && b.profit !== undefined) {
      return b.profit - a.profit;
    } else if (sortBy === 'amount') {
      return b.total - a.total;
    }
    return 0;
  });

  const totalBuyVolume = transactions.filter(t => t.type === 'buy').reduce((sum, t) => sum + t.total, 0);
  const totalSellVolume = transactions.filter(t => t.type === 'sell').reduce((sum, t) => sum + t.total, 0);
  const totalTrades = transactions.length;
  const profitableTrades = transactions.filter(t => t.profit && t.profit > 0).length;
  const winRate = totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Portfolio Analytics</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Track your trading history and performance</p>
          </div>
          <Link href="/overview">
            <button className="btn-secondary px-4 py-2 text-sm">
              ← Back to Overview
            </button>
          </Link>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 mb-6 p-1 rounded-lg inline-flex" style={{ background: 'var(--background-secondary)' }}>
          <button
            onClick={() => setActiveTab('stocks')}
            className={`py-2 px-6 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'stocks'
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Stocks
          </button>
          <button
            onClick={() => setActiveTab('options')}
            className={`py-2 px-6 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'options'
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Options
          </button>
        </div>

        {/* Stocks Tab Content */}
        {activeTab === 'stocks' && (
          <>
            {/* Analytics Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="rounded-lg border p-5 text-center" style={{ borderColor: 'var(--glass-border)', background: 'var(--background-secondary)' }}>
                <div className="w-10 h-10 mx-auto mb-3 rounded-lg flex items-center justify-center" style={{ background: 'var(--background-primary)' }}>
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Total Trades</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{totalTrades}</p>
              </div>

              <div className="rounded-lg border p-5 text-center" style={{ borderColor: 'var(--glass-border)', background: 'var(--background-secondary)' }}>
                <div className="w-10 h-10 mx-auto mb-3 rounded-lg flex items-center justify-center" style={{ background: 'var(--background-primary)' }}>
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Win Rate</p>
                <p className="text-2xl font-bold text-green-400">{winRate.toFixed(1)}%</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>{profitableTrades} profitable</p>
              </div>

              <div className="rounded-lg border p-5 text-center" style={{ borderColor: 'var(--glass-border)', background: 'var(--background-secondary)' }}>
                <div className="w-10 h-10 mx-auto mb-3 rounded-lg flex items-center justify-center" style={{ background: 'var(--background-primary)' }}>
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Total Buy Volume</p>
                <p className="text-2xl font-bold text-green-400">${totalBuyVolume.toFixed(2)}</p>
              </div>

              <div className="rounded-lg border p-5 text-center" style={{ borderColor: 'var(--glass-border)', background: 'var(--background-secondary)' }}>
                <div className="w-10 h-10 mx-auto mb-3 rounded-lg flex items-center justify-center" style={{ background: 'var(--background-primary)' }}>
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
                <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Total Sell Volume</p>
                <p className="text-2xl font-bold text-red-400">${totalSellVolume.toFixed(2)}</p>
              </div>
            </div>

            {/* Complete Transaction History */}
            <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--glass-border)', background: 'var(--background-secondary)' }}>
              <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--glass-border)' }}>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Transaction History</h2>

                <div className="flex items-center gap-3">
                  {/* Filter */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        filter === 'all' ? 'bg-blue-500 text-white' : 'border'
                      }`}
                      style={filter !== 'all' ? { borderColor: 'var(--glass-border)', color: 'var(--text-secondary)' } : {}}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilter('buy')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        filter === 'buy' ? 'bg-green-500 text-white' : 'border'
                      }`}
                      style={filter !== 'buy' ? { borderColor: 'var(--glass-border)', color: 'var(--text-secondary)' } : {}}
                    >
                      Buys
                    </button>
                    <button
                      onClick={() => setFilter('sell')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        filter === 'sell' ? 'bg-red-500 text-white' : 'border'
                      }`}
                      style={filter !== 'sell' ? { borderColor: 'var(--glass-border)', color: 'var(--text-secondary)' } : {}}
                    >
                      Sells
                    </button>
                  </div>

                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="form-input px-3 py-1.5 text-sm"
                    >
                      <option value="date">Date</option>
                      <option value="amount">Amount</option>
                      <option value="profit">Profit</option>
                    </select>
                  </div>
                </div>
              </div>

          <div className="overflow-x-auto">
            {sortedTransactions.length > 0 ? (
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="text-left">Date & Time</th>
                    <th className="text-left">Type</th>
                    <th className="text-left">Symbol</th>
                    <th className="text-left">Name</th>
                    <th className="text-right">Shares</th>
                    <th className="text-right">Price</th>
                    <th className="text-right">Total</th>
                    <th className="text-right">Profit/Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>
                        <div className="text-base" style={{ color: 'var(--text-secondary)' }}>
                          {new Date(transaction.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {new Date(transaction.date).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td>
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                          transaction.type === 'buy' ? 'status-positive' : 'status-negative'
                        }`}>
                          {transaction.type.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <Link href={`/stock/${transaction.symbol.toLowerCase()}`}>
                          <span className="text-lg font-bold hover:text-blue-400 transition-colors cursor-pointer" style={{ color: 'var(--text-primary)' }}>
                            {transaction.symbol}
                          </span>
                        </Link>
                      </td>
                      <td>
                        <span className="text-base" style={{ color: 'var(--text-secondary)' }}>
                          {transaction.name}
                        </span>
                      </td>
                      <td className="text-right">
                        <span className="text-base font-semibold" style={{ color: 'var(--text-secondary)' }}>
                          {transaction.shares}
                        </span>
                      </td>
                      <td className="text-right">
                        <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                          ${transaction.price.toFixed(2)}
                        </span>
                      </td>
                      <td className="text-right">
                        <span className="text-lg font-bold" style={{ color: 'var(--text-accent)' }}>
                          ${transaction.total.toFixed(2)}
                        </span>
                      </td>
                      <td className="text-right">
                        {transaction.profit !== undefined ? (
                          <div>
                            <div className={`text-lg font-bold ${transaction.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {transaction.profit >= 0 ? '+' : ''}${transaction.profit.toFixed(2)}
                            </div>
                            {transaction.profitPercent !== undefined && (
                              <div className={`text-sm ${transaction.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                ({transaction.profit >= 0 ? '+' : ''}{transaction.profitPercent.toFixed(2)}%)
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="card-body text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-secondary)' }}>
                  <svg className="w-10 h-10" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  No transactions yet.
                </p>
                <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>
                  Start trading to see your transaction history!
                </p>
              </div>
            )}
          </div>
        </div>
          </>
        )}

        {/* Options Tab Content */}
        {activeTab === 'options' && (
          <OptionsPortfolio positions={mockOptionsPositions} />
        )}
      </div>
    </div>
  );
}
