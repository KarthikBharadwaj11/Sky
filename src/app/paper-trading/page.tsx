'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Activity, DollarSign, Target, BarChart3, Zap, BookOpen, Award } from 'lucide-react';
import LineChart from '@/components/charts/LineChart';

interface PaperHolding {
  symbol: string;
  name: string;
  shares: number;
  averagePrice: number;
  currentPrice: number;
}

export default function PaperTrading() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [paperBalance, setPaperBalance] = useState(100000);
  const [paperPortfolio, setPaperPortfolio] = useState<PaperHolding[]>([]);
  const [selectedStock, setSelectedStock] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [showOrderForm, setShowOrderForm] = useState(false);

  // Portfolio history data
  const [portfolioHistory] = useState([
    { name: 'Day 1', value: 100000 },
    { name: 'Day 2', value: 100500 },
    { name: 'Day 3', value: 101200 },
    { name: 'Day 4', value: 100800 },
    { name: 'Day 5', value: 102000 },
    { name: 'Day 6', value: 103500 },
    { name: 'Day 7', value: 104200 },
  ]);

  // Available stocks for paper trading
  const availableStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.15, changePercent: 1.24 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.21, change: -1.32, changePercent: -0.95 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.85, change: 4.12, changePercent: 1.10 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.42, change: -5.23, changePercent: -2.06 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 127.74, change: 1.89, changePercent: 1.50 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.28, change: 15.67, changePercent: 1.83 },
  ];

  useEffect(() => {
    // Initialize demo portfolio with some sample positions
    if (user && paperPortfolio.length === 0) {
      setPaperPortfolio([
        { symbol: 'AAPL', name: 'Apple Inc.', shares: 10, averagePrice: 170.00, currentPrice: 175.43 },
        { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 5, averagePrice: 360.00, currentPrice: 378.85 },
      ]);
    }
  }, [user, paperPortfolio.length]);

  const totalPortfolioValue = paperPortfolio.reduce((total, holding) => {
    return total + (holding.shares * holding.currentPrice);
  }, 0);

  const totalReturn = paperPortfolio.reduce((total, holding) => {
    const invested = holding.shares * holding.averagePrice;
    const current = holding.shares * holding.currentPrice;
    return total + (current - invested);
  }, 0);

  const totalReturnPercent = totalPortfolioValue > 0 ? (totalReturn / totalPortfolioValue) * 100 : 0;

  const handleTrade = (stock: { symbol: string; name: string; price: number }) => {
    setSelectedStock(stock.symbol);
    setShowOrderForm(true);
  };

  const executeTrade = () => {
    if (!selectedStock || quantity <= 0) return;

    const stock = availableStocks.find(s => s.symbol === selectedStock);
    if (!stock) return;

    if (orderType === 'buy') {
      const totalCost = stock.price * quantity;
      if (totalCost > paperBalance) {
        alert('Insufficient paper balance!');
        return;
      }

      // Update balance
      setPaperBalance(prev => prev - totalCost);

      // Update portfolio
      setPaperPortfolio(prev => {
        const existing = prev.find(h => h.symbol === selectedStock);
        if (existing) {
          return prev.map(h => {
            if (h.symbol === selectedStock) {
              const totalShares = h.shares + quantity;
              const totalCost = (h.shares * h.averagePrice) + (quantity * stock.price);
              return {
                ...h,
                shares: totalShares,
                averagePrice: totalCost / totalShares,
                currentPrice: stock.price
              };
            }
            return h;
          });
        } else {
          return [...prev, {
            symbol: stock.symbol,
            name: stock.name,
            shares: quantity,
            averagePrice: stock.price,
            currentPrice: stock.price
          }];
        }
      });

      alert(`Successfully bought ${quantity} shares of ${selectedStock}!`);
    } else {
      // Sell logic
      const holding = paperPortfolio.find(h => h.symbol === selectedStock);
      if (!holding || holding.shares < quantity) {
        alert('Insufficient shares to sell!');
        return;
      }

      const totalValue = stock.price * quantity;
      setPaperBalance(prev => prev + totalValue);

      setPaperPortfolio(prev => {
        return prev.map(h => {
          if (h.symbol === selectedStock) {
            return { ...h, shares: h.shares - quantity };
          }
          return h;
        }).filter(h => h.shares > 0);
      });

      alert(`Successfully sold ${quantity} shares of ${selectedStock}!`);
    }

    setShowOrderForm(false);
    setQuantity(1);
  };

  // Theme-aware colors
  const isDark = theme === 'dark';
  const bgPrimary = isDark ? '#0a0a0a' : '#ffffff';
  const bgSecondary = isDark ? '#1a1a1a' : '#f5f5f5';
  const textPrimary = isDark ? '#ffffff' : '#000000';
  const textSecondary = isDark ? '#a0a0a0' : '#666666';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const cardBg = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
  const chartColor = isDark ? '#ffffff' : '#000000';

  // Preview for non-logged-in users
  if (!user) {
    return (
      <div className="min-h-screen trading-background">
        <section className="pt-48 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto text-center mb-16">
              <div className="inline-block px-4 py-2 rounded-full mb-6 glass-morphism">
                <span className="text-sm font-bold" style={{ color: 'var(--text-accent)' }}>🎯 PRACTICE MODE</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold gradient-shift leading-tight mb-6">
                Paper Trading
              </h1>
              <p className="text-xl md:text-2xl mb-8" style={{ color: 'var(--text-secondary)' }}>
                Practice trading with $100,000 virtual money. Zero risk, real learning.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-5xl mx-auto">
              <div className="card p-6 text-center hover:scale-105 transition-all duration-300">
                <div className="text-3xl font-bold mb-2 text-gradient">X</div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Starting Balance</div>
              </div>
              <div className="card p-6 text-center hover:scale-105 transition-all duration-300">
                <div className="text-3xl font-bold mb-2 text-gradient">X</div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Live Market Prices</div>
              </div>
              <div className="card p-6 text-center hover:scale-105 transition-all duration-300">
                <div className="text-3xl font-bold mb-2 text-gradient">X</div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Practice Safely</div>
              </div>
              <div className="card p-6 text-center hover:scale-105 transition-all duration-300">
                <div className="text-3xl font-bold mb-2 text-gradient">X</div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>All Trading Tools</div>
              </div>
            </div>

            {/* What is Paper Trading */}
            <div className="max-w-4xl mx-auto mb-16">
              <div className="card p-8">
                <h2 className="text-3xl font-bold mb-4 text-center text-gradient">What is Paper Trading?</h2>
                <p className="text-lg text-center mb-8" style={{ color: 'var(--text-secondary)' }}>
                  Paper trading is a risk-free way to practice trading with virtual money. Test your strategies, learn the market, and build confidence before trading with real money.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-morphism p-6 rounded-xl hover:scale-105 transition-all duration-300">
                    <BookOpen className="w-10 h-10 mb-4" style={{ color: 'var(--text-accent)' }} />
                    <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Learn Trading</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Practice buying and selling stocks without any financial risk</p>
                  </div>
                  <div className="glass-morphism p-6 rounded-xl hover:scale-105 transition-all duration-300">
                    <BarChart3 className="w-10 h-10 mb-4" style={{ color: 'var(--text-accent)' }} />
                    <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Test Strategies</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Experiment with different trading strategies and see what works</p>
                  </div>
                  <div className="glass-morphism p-6 rounded-xl hover:scale-105 transition-all duration-300">
                    <Award className="w-10 h-10 mb-4" style={{ color: 'var(--text-accent)' }} />
                    <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Build Confidence</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Gain experience and confidence before using real money</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call-to-action */}
            <div className="text-center max-w-4xl mx-auto">
              <div className="card p-8">
                <h2 className="text-3xl font-bold mb-4 text-gradient">Ready to Start Paper Trading?</h2>
                <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
                  Sign up now and get $100,000 in virtual money to practice trading
                </p>
                <div className="flex gap-4 justify-center">
                  <a href="/register" className="btn-primary px-8 py-4 hover:scale-105 transition-all duration-300">
                    Get Started Now
                  </a>
                  <a href="/learn" className="btn-secondary px-8 py-4 hover:scale-105 transition-all duration-300">
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Full paper trading interface for logged-in users
  return (
    <div className="min-h-screen" style={{ background: isDark ? `linear-gradient(135deg, ${bgPrimary} 0%, ${bgSecondary} 50%, ${bgPrimary} 100%)` : `linear-gradient(135deg, ${bgSecondary} 0%, ${bgPrimary} 50%, ${bgSecondary} 100%)` }}>
      <div className="pt-20 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-8 h-8" style={{ color: textPrimary }} />
            <h1 className="text-4xl font-bold" style={{
              color: textPrimary
            }}>
              Paper Trading
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold" style={{
              background: cardBg,
              color: textPrimary,
              border: `1px solid ${borderColor}`
            }}>
              PRACTICE MODE
            </span>
          </div>
          <p style={{ color: textSecondary }}>Practice trading with virtual money - No real money at risk</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="rounded-xl p-6" style={{
            background: cardBg,
            border: `1px solid ${borderColor}`
          }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold" style={{ color: textSecondary }}>Paper Balance</h3>
              <DollarSign className="w-8 h-8" style={{ color: textPrimary }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: textPrimary }}>${paperBalance.toFixed(2)}</p>
            <p className="text-xs mt-1" style={{ color: textSecondary }}>Virtual Money</p>
          </div>

          <div className="rounded-xl p-6" style={{
            background: cardBg,
            border: `1px solid ${borderColor}`
          }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold" style={{ color: textSecondary }}>Portfolio Value</h3>
              <BarChart3 className="w-8 h-8" style={{ color: textPrimary }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: textPrimary }}>${totalPortfolioValue.toFixed(2)}</p>
            <p className="text-xs mt-1" style={{ color: textSecondary }}>Current Holdings</p>
          </div>

          <div className="rounded-xl p-6" style={{
            background: cardBg,
            border: `1px solid ${borderColor}`
          }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold" style={{ color: textSecondary }}>Total Assets</h3>
              <Activity className="w-8 h-8" style={{ color: textPrimary }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: textPrimary }}>${(paperBalance + totalPortfolioValue).toFixed(2)}</p>
            <p className="text-xs mt-1" style={{ color: textSecondary }}>Balance + Holdings</p>
          </div>

          <div className="rounded-xl p-6" style={{
            background: cardBg,
            border: `1px solid ${borderColor}`
          }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold" style={{ color: textSecondary }}>Total Return</h3>
              {totalReturn >= 0 ? <TrendingUp className="w-8 h-8 text-green-600" /> : <TrendingDown className="w-8 h-8 text-red-600" />}
            </div>
            <p className={`text-3xl font-bold ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalReturn >= 0 ? '+' : ''}${totalReturn.toFixed(2)}
            </p>
            <p className={`text-xs mt-1 ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalReturn >= 0 ? '+' : ''}{totalReturnPercent.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Copy Trading Placeholder */}
        <div className="rounded-xl p-6 mb-8" style={{
          background: `linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)`,
          border: `2px solid ${isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`
        }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: textPrimary }}>Paper Copy Trading</h2>
                <p className="text-sm" style={{ color: textSecondary }}>Practice copying expert traders with virtual money</p>
              </div>
            </div>
          </div>

          {/* Expert Traders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Expert 1 */}
            <div className="rounded-lg p-4" style={{
              background: cardBg,
              border: `1px solid ${borderColor}`
            }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold" style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white'
                }}>
                  TS
                </div>
                <div>
                  <h3 className="font-bold" style={{ color: textPrimary }}>Tony Stark</h3>
                  <p className="text-xs" style={{ color: textSecondary }}>Tech Stocks Expert</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <p className="text-xs" style={{ color: textSecondary }}>Win Rate</p>
                  <p className="font-bold text-green-500">76%</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: textSecondary }}>Return</p>
                  <p className="font-bold text-green-500">+24.5%</p>
                </div>
              </div>
              <button className="w-full py-2 rounded-lg text-sm font-medium" style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                color: 'white'
              }}>
                Copy
              </button>
            </div>

            {/* Expert 2 */}
            <div className="rounded-lg p-4" style={{
              background: cardBg,
              border: `1px solid ${borderColor}`
            }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold" style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white'
                }}>
                  HG
                </div>
                <div>
                  <h3 className="font-bold" style={{ color: textPrimary }}>Hermione Granger</h3>
                  <p className="text-xs" style={{ color: textSecondary }}>Growth Investor</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <p className="text-xs" style={{ color: textSecondary }}>Win Rate</p>
                  <p className="font-bold text-green-500">82%</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: textSecondary }}>Return</p>
                  <p className="font-bold text-green-500">+31.2%</p>
                </div>
              </div>
              <button className="w-full py-2 rounded-lg text-sm font-medium" style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                color: 'white'
              }}>
                Copy
              </button>
            </div>

            {/* Expert 3 */}
            <div className="rounded-lg p-4" style={{
              background: cardBg,
              border: `1px solid ${borderColor}`
            }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold" style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  color: 'white'
                }}>
                  DS
                </div>
                <div>
                  <h3 className="font-bold" style={{ color: textPrimary }}>Doctor Strange</h3>
                  <p className="text-xs" style={{ color: textSecondary }}>Day Trader</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <p className="text-xs" style={{ color: textSecondary }}>Win Rate</p>
                  <p className="font-bold text-green-500">68%</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: textSecondary }}>Return</p>
                  <p className="font-bold text-green-500">+18.7%</p>
                </div>
              </div>
              <button className="w-full py-2 rounded-lg text-sm font-medium" style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                color: 'white'
              }}>
                Copy
              </button>
            </div>
          </div>
        </div>

        {/* Portfolio Chart */}
        <div className="rounded-xl p-6 mb-8" style={{
          background: cardBg,
          border: `1px solid ${borderColor}`
        }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: textPrimary }}>Portfolio Performance</h2>
          <LineChart
            data={portfolioHistory}
            title="Portfolio Performance"
            color={chartColor}
            height={300}
            minimalistic={true}
            showGrid={false}
          />
        </div>

        {/* Holdings Table */}
        {paperPortfolio.length > 0 && (
          <div className="rounded-xl p-6 mb-8" style={{
            background: cardBg,
            border: `1px solid ${borderColor}`
          }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: textPrimary }}>Your Paper Holdings</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ borderColor: borderColor }}>
                    <th className="text-left py-3" style={{ color: textSecondary }}>Symbol</th>
                    <th className="text-left py-3" style={{ color: textSecondary }}>Name</th>
                    <th className="text-right py-3" style={{ color: textSecondary }}>Shares</th>
                    <th className="text-right py-3" style={{ color: textSecondary }}>Avg Price</th>
                    <th className="text-right py-3" style={{ color: textSecondary }}>Current Price</th>
                    <th className="text-right py-3" style={{ color: textSecondary }}>Total Value</th>
                    <th className="text-right py-3" style={{ color: textSecondary }}>Return</th>
                  </tr>
                </thead>
                <tbody>
                  {paperPortfolio.map((holding) => {
                    const marketValue = holding.shares * holding.currentPrice;
                    const totalCost = holding.shares * holding.averagePrice;
                    const gainLoss = marketValue - totalCost;
                    const gainLossPercent = (gainLoss / totalCost) * 100;

                    return (
                      <tr key={holding.symbol} className="border-b" style={{ borderColor: borderColor }}>
                        <td className="py-3">
                          <Link href={`/stock/${holding.symbol.toLowerCase()}`}>
                            <span className="font-bold cursor-pointer" style={{ color: textPrimary }}>
                              {holding.symbol}
                            </span>
                          </Link>
                        </td>
                        <td className="py-3" style={{ color: textSecondary }}>{holding.name}</td>
                        <td className="text-right py-3" style={{ color: textSecondary }}>{holding.shares}</td>
                        <td className="text-right py-3" style={{ color: textSecondary }}>${holding.averagePrice.toFixed(2)}</td>
                        <td className="text-right py-3" style={{ color: textSecondary }}>${holding.currentPrice.toFixed(2)}</td>
                        <td className="text-right py-3 font-bold" style={{ color: textPrimary }}>${marketValue.toFixed(2)}</td>
                        <td className={`text-right py-3 font-bold ${gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {gainLoss >= 0 ? '+' : ''}${gainLoss.toFixed(2)} ({gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%)
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Available Stocks */}
        <div className="rounded-xl p-6" style={{
          background: cardBg,
          border: `1px solid ${borderColor}`
        }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: textPrimary }}>Available Stocks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableStocks.map((stock) => (
              <div key={stock.symbol} className="rounded-xl p-4" style={{
                background: cardBg,
                border: `1px solid ${borderColor}`
              }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <Link href={`/stock/${stock.symbol.toLowerCase()}`}>
                      <h3 className="font-bold text-lg cursor-pointer" style={{ color: textPrimary }}>{stock.symbol}</h3>
                    </Link>
                    <p className="text-sm" style={{ color: textSecondary }}>{stock.name}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${stock.change >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </span>
                </div>
                <p className="text-2xl font-bold mb-3" style={{ color: textPrimary }}>${stock.price.toFixed(2)}</p>
                <button
                  onClick={() => handleTrade(stock)}
                  className="w-full py-2 rounded-lg font-semibold transition-all duration-200"
                  style={{
                    background: textPrimary,
                    color: bgPrimary,
                    boxShadow: isDark ? '0 2px 10px rgba(255, 255, 255, 0.2)' : '0 2px 10px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  Trade
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Order Form Modal */}
        {showOrderForm && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{
            background: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)'
          }}>
            <div className="rounded-2xl p-8 max-w-md w-full" style={{
              background: bgPrimary,
              border: `2px solid ${borderColor}`
            }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: textPrimary }}>Place Paper Trade</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: textSecondary }}>Stock</label>
                <p className="text-xl font-bold" style={{ color: textPrimary }}>{selectedStock}</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: textSecondary }}>Order Type</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOrderType('buy')}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                      orderType === 'buy'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-600/20 text-green-400'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setOrderType('sell')}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                      orderType === 'sell'
                        ? 'bg-red-600 text-white'
                        : 'bg-red-600/20 text-red-400'
                    }`}
                  >
                    Sell
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: textSecondary }}>Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 rounded-lg border font-semibold"
                  style={{
                    background: cardBg,
                    borderColor: borderColor,
                    color: textPrimary
                  }}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={executeTrade}
                  className="flex-1 py-3 rounded-lg font-semibold transition-all"
                  style={{
                    background: textPrimary,
                    color: bgPrimary,
                    boxShadow: isDark ? '0 4px 20px rgba(255, 255, 255, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  Confirm Trade
                </button>
                <button
                  onClick={() => setShowOrderForm(false)}
                  className="flex-1 py-3 rounded-lg font-semibold transition-all"
                  style={{
                    background: cardBg,
                    border: `1px solid ${borderColor}`,
                    color: textPrimary
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
