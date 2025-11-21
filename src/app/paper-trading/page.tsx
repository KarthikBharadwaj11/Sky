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
      <div className="min-h-screen" style={{ background: isDark ? `linear-gradient(135deg, ${bgPrimary} 0%, ${bgSecondary} 50%, ${bgPrimary} 100%)` : `linear-gradient(135deg, ${bgSecondary} 0%, ${bgPrimary} 50%, ${bgSecondary} 100%)` }}>
        <div className="pt-20 container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-3xl p-12 mb-12" style={{
            background: cardBg,
            border: `2px solid ${borderColor}`
          }}>
            <div className="relative text-center mb-8">
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 rounded-3xl flex items-center justify-center transition-opacity duration-1000" style={{
                  background: textPrimary,
                  boxShadow: isDark ? '0 0 30px rgba(255, 255, 255, 0.2)' : '0 0 30px rgba(0, 0, 0, 0.2)'
                }}>
                  <Target className="w-12 h-12" style={{ color: bgPrimary }} />
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-6" style={{
                color: textPrimary
              }}>
                Paper Trading
              </h1>
              <p className="text-2xl md:text-3xl max-w-4xl mx-auto leading-relaxed" style={{ color: textSecondary }}>
                Practice trading with <span className="font-bold" style={{ color: textPrimary }}>$100,000</span> virtual money. Zero risk, real learning.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black mb-2" style={{ color: textPrimary }}>$100K</div>
                <div className="text-sm font-medium" style={{ color: textSecondary }}>Starting Balance</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black mb-2" style={{ color: textPrimary }}>Real Data</div>
                <div className="text-sm font-medium" style={{ color: textSecondary }}>Live Market Prices</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black mb-2" style={{ color: textPrimary }}>Zero Risk</div>
                <div className="text-sm font-medium" style={{ color: textSecondary }}>Practice Safely</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black mb-2" style={{ color: textPrimary }}>Full Access</div>
                <div className="text-sm font-medium" style={{ color: textSecondary }}>All Trading Tools</div>
              </div>
            </div>
          </div>

          {/* What is Paper Trading */}
          <div className="rounded-3xl p-8 mb-12" style={{
            background: cardBg,
            border: `1px solid ${borderColor}`
          }}>
            <h2 className="text-4xl font-bold mb-6 text-center" style={{ color: textPrimary }}>What is Paper Trading?</h2>
            <p className="text-xl text-center mb-8 max-w-3xl mx-auto" style={{ color: textSecondary }}>
              Paper trading is a risk-free way to practice trading with virtual money. Test your strategies, learn the market, and build confidence before trading with real money.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl" style={{ background: cardBg }}>
                <BookOpen className="w-12 h-12 mb-4" style={{ color: textPrimary }} />
                <h3 className="text-xl font-bold mb-2" style={{ color: textPrimary }}>Learn Trading</h3>
                <p style={{ color: textSecondary }}>Practice buying and selling stocks without any financial risk</p>
              </div>
              <div className="p-6 rounded-xl" style={{ background: cardBg }}>
                <BarChart3 className="w-12 h-12 mb-4" style={{ color: textPrimary }} />
                <h3 className="text-xl font-bold mb-2" style={{ color: textPrimary }}>Test Strategies</h3>
                <p style={{ color: textSecondary }}>Experiment with different trading strategies and see what works</p>
              </div>
              <div className="p-6 rounded-xl" style={{ background: cardBg }}>
                <Award className="w-12 h-12 mb-4" style={{ color: textPrimary }} />
                <h3 className="text-xl font-bold mb-2" style={{ color: textPrimary }}>Build Confidence</h3>
                <p style={{ color: textSecondary }}>Gain experience and confidence before using real money</p>
              </div>
            </div>
          </div>

          {/* Call-to-action */}
          <div className="text-center p-12 rounded-3xl" style={{
            background: cardBg,
            border: `2px solid ${borderColor}`
          }}>
            <h2 className="text-4xl font-bold mb-4" style={{ color: textPrimary }}>Ready to Start Paper Trading?</h2>
            <p className="text-xl mb-8" style={{ color: textSecondary }}>
              Sign up now and get $100,000 in virtual money to practice trading
            </p>
            <div className="flex gap-4 justify-center">
              <a href="/register" className="px-8 py-4 text-lg rounded-xl font-semibold transition-all duration-200" style={{
                background: textPrimary,
                color: bgPrimary,
                boxShadow: isDark ? '0 4px 20px rgba(255, 255, 255, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.3)'
              }}>
                Get Started Now
              </a>
              <a href="/learn" className="px-8 py-4 text-lg rounded-xl font-semibold transition-all duration-200" style={{
                background: cardBg,
                border: `1px solid ${borderColor}`,
                color: textPrimary
              }}>
                Learn More
              </a>
            </div>
          </div>
        </div>
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
