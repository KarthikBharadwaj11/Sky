'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { TrendingUp, TrendingDown, User, Filter, Clock, DollarSign, Activity, XCircle, CheckCircle, Pause, Play, Settings, BarChart3, ArrowUpRight, ArrowDownRight, Bell, Users, PieChart, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface CopiedTrade {
  id: string;
  expertId: string;
  expertName: string;
  expertAvatar: string;
  symbol: string;
  action: 'buy' | 'sell';
  shares: number;
  entryPrice: number;
  currentPrice: number;
  status: 'active' | 'closed';
  openedAt: string;
  closedAt?: string;
  profit?: number;
  copyMode: 'manual' | 'auto';
}

interface Expert {
  id: string;
  name: string;
  avatar: string;
}

interface PendingTrade {
  id: string;
  expertId: string;
  expertName: string;
  expertAvatar: string;
  symbol: string;
  action: 'buy' | 'sell';
  shares: number;
  price: number;
  timestamp: string;
  reason?: string;
}

interface Subscription {
  expertId: string;
  expertName: string;
  expertAvatar: string;
  startDate: string;
  amount: number;
  status: 'active' | 'paused';
  autoCopy: boolean;
}

export default function CopyTradingPortfolio() {
  const { user } = useAuth();
  const [copiedTrades, setCopiedTrades] = useState<CopiedTrade[]>([]);
  const [pendingTrades, setPendingTrades] = useState<PendingTrade[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'closed'>('all');
  const [filterExpert, setFilterExpert] = useState<string>('all');
  const [experts, setExperts] = useState<Expert[]>([]);

  // Inline expansion for pending trades
  const [expandedTradeId, setExpandedTradeId] = useState<string | null>(null);
  const [reviewedTrade, setReviewedTrade] = useState<{
    quantity: number;
    addStopLoss: boolean;
    stopLossPercent: number;
    addTakeProfit: boolean;
    takeProfitPercent: number;
  } | null>(null);

  useEffect(() => {
    if (!user) return;

    // Load subscriptions from localStorage
    const savedSubscriptions = JSON.parse(localStorage.getItem(`subscriptions_${user.id}`) || '[]');

    // Add mock subscriptions if none exist
    if (savedSubscriptions.length === 0) {
      const mockSubscriptions: Subscription[] = [
        {
          expertId: '1',
          expertName: 'Sarah Chen',
          expertAvatar: '👩‍💼',
          startDate: new Date(Date.now() - 86400000 * 30).toISOString(),
          amount: 5000,
          status: 'active',
          autoCopy: false // Manual mode
        },
        {
          expertId: '2',
          expertName: 'Marcus Johnson',
          expertAvatar: '👨‍💼',
          startDate: new Date(Date.now() - 86400000 * 15).toISOString(),
          amount: 3000,
          status: 'active',
          autoCopy: true // Auto mode
        },
        {
          expertId: '3',
          expertName: 'Alex Rodriguez',
          expertAvatar: '👨‍💻',
          startDate: new Date(Date.now() - 86400000 * 10).toISOString(),
          amount: 2000,
          status: 'active',
          autoCopy: false // Manual mode
        }
      ];
      setSubscriptions(mockSubscriptions);
      localStorage.setItem(`subscriptions_${user.id}`, JSON.stringify(mockSubscriptions));
    } else {
      setSubscriptions(savedSubscriptions);
    }

    // Load pending trades from localStorage
    const savedPendingTrades = JSON.parse(localStorage.getItem(`pending_trades_${user.id}`) || '[]');

    // Add mock pending trades if none exist
    if (savedPendingTrades.length === 0) {
      const mockPendingTrades: PendingTrade[] = [
        {
          id: '1',
          expertId: '1',
          expertName: 'Sarah Chen',
          expertAvatar: '👩‍💼',
          symbol: 'TSLA',
          action: 'buy',
          shares: 15,
          price: 242.50,
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          reason: 'Strong technical breakout above resistance level. RSI shows bullish momentum with increasing volume.'
        },
        {
          id: '2',
          expertId: '3',
          expertName: 'Alex Rodriguez',
          expertAvatar: '👨‍💻',
          symbol: 'MSFT',
          action: 'buy',
          shares: 20,
          price: 378.90,
          timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
          reason: 'Cloud revenue growth exceeding expectations. AI integration showing strong market adoption.'
        },
        {
          id: '3',
          expertName: 'Sarah Chen',
          expertId: '1',
          expertAvatar: '👩‍💼',
          symbol: 'AMD',
          action: 'sell',
          shares: 30,
          price: 165.20,
          timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
          reason: 'Taking profits at resistance. Market showing signs of consolidation.'
        }
      ];
      setPendingTrades(mockPendingTrades);
      localStorage.setItem(`pending_trades_${user.id}`, JSON.stringify(mockPendingTrades));
    } else {
      setPendingTrades(savedPendingTrades);
    }

    // Load copied trades from localStorage
    const savedTrades = JSON.parse(localStorage.getItem(`copied_trades_${user.id}`) || '[]');

    // Mock data if no trades exist
    if (savedTrades.length === 0) {
      const mockTrades: CopiedTrade[] = [
        {
          id: '1',
          expertId: '1',
          expertName: 'Sarah Chen',
          expertAvatar: '👩‍💼',
          symbol: 'AAPL',
          action: 'buy',
          shares: 10,
          entryPrice: 175.43,
          currentPrice: 178.20,
          status: 'active',
          openedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          copyMode: 'auto'
        },
        {
          id: '2',
          expertId: '2',
          expertName: 'Marcus Johnson',
          expertAvatar: '👨‍💼',
          symbol: 'JNJ',
          action: 'buy',
          shares: 25,
          entryPrice: 158.32,
          currentPrice: 160.45,
          status: 'active',
          openedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
          copyMode: 'auto'
        },
        {
          id: '3',
          expertId: '1',
          expertName: 'Sarah Chen',
          expertAvatar: '👩‍💼',
          symbol: 'NVDA',
          action: 'buy',
          shares: 5,
          entryPrice: 850.00,
          currentPrice: 875.28,
          status: 'active',
          openedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          copyMode: 'manual'
        },
        {
          id: '4',
          expertId: '3',
          expertName: 'Alex Rodriguez',
          expertAvatar: '👨‍💻',
          symbol: 'COIN',
          action: 'buy',
          shares: 8,
          entryPrice: 245.67,
          currentPrice: 256.80,
          status: 'closed',
          openedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
          closedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          profit: 89.04,
          copyMode: 'auto'
        },
        {
          id: '5',
          expertId: '2',
          expertName: 'Marcus Johnson',
          expertAvatar: '👨‍💼',
          symbol: 'KO',
          action: 'buy',
          shares: 50,
          entryPrice: 62.45,
          currentPrice: 64.20,
          status: 'closed',
          openedAt: new Date(Date.now() - 3600000 * 72).toISOString(),
          closedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
          profit: 87.50,
          copyMode: 'auto'
        }
      ];
      setCopiedTrades(mockTrades);
      localStorage.setItem(`copied_trades_${user.id}`, JSON.stringify(mockTrades));
    } else {
      setCopiedTrades(savedTrades);
    }

    // Extract unique experts
    const uniqueExperts: Expert[] = [];
    const expertMap = new Map();

    savedTrades.forEach((trade: CopiedTrade) => {
      if (!expertMap.has(trade.expertId)) {
        expertMap.set(trade.expertId, {
          id: trade.expertId,
          name: trade.expertName,
          avatar: trade.expertAvatar
        });
      }
    });

    setExperts(Array.from(expertMap.values()));
  }, [user]);

  const handleCloseTrade = (tradeId: string) => {
    if (!user) return;

    const confirmed = window.confirm('Are you sure you want to close this copied trade?');
    if (!confirmed) return;

    const updatedTrades = copiedTrades.map(trade => {
      if (trade.id === tradeId && trade.status === 'active') {
        const profit = (trade.currentPrice - trade.entryPrice) * trade.shares;
        return {
          ...trade,
          status: 'closed' as const,
          closedAt: new Date().toISOString(),
          profit
        };
      }
      return trade;
    });

    setCopiedTrades(updatedTrades);
    localStorage.setItem(`copied_trades_${user.id}`, JSON.stringify(updatedTrades));
    alert('Trade closed successfully!');
  };

  const calculateProfit = (trade: CopiedTrade) => {
    if (trade.status === 'closed' && trade.profit !== undefined) {
      return trade.profit;
    }
    return (trade.currentPrice - trade.entryPrice) * trade.shares;
  };

  const calculateProfitPercent = (trade: CopiedTrade) => {
    const profit = calculateProfit(trade);
    const costBasis = trade.entryPrice * trade.shares;
    return (profit / costBasis) * 100;
  };

  const getFilteredTrades = () => {
    let filtered = copiedTrades;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(trade => trade.status === filterStatus);
    }

    if (filterExpert !== 'all') {
      filtered = filtered.filter(trade => trade.expertId === filterExpert);
    }

    return filtered;
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleToggleExpand = (trade: PendingTrade) => {
    if (expandedTradeId === trade.id) {
      // Collapse
      setExpandedTradeId(null);
      setReviewedTrade(null);
    } else {
      // Expand
      setExpandedTradeId(trade.id);
      setReviewedTrade({
        quantity: trade.shares,
        addStopLoss: false,
        stopLossPercent: 5,
        addTakeProfit: false,
        takeProfitPercent: 10
      });
    }
  };

  const handleConfirmAcceptTrade = (pendingTrade: PendingTrade) => {
    if (!reviewedTrade) return;

    // Use the reviewed trade parameters
    const modifiedTrade = {
      ...pendingTrade,
      shares: reviewedTrade.quantity
    };

    handleAcceptTrade(modifiedTrade);

    // Collapse after accepting
    setExpandedTradeId(null);
    setReviewedTrade(null);
  };

  const handleAcceptTrade = (pendingTrade: PendingTrade) => {
    if (!user) return;

    const totalCost = pendingTrade.price * pendingTrade.shares;

    // Check if user has sufficient balance for buy orders
    if (pendingTrade.action === 'buy' && user.balance < totalCost) {
      alert('Insufficient balance to execute this trade');
      return;
    }

    // Get portfolio
    const portfolio = JSON.parse(localStorage.getItem(`portfolio_${user.id}`) || '[]');
    let newBalance = user.balance;

    // Execute trade
    if (pendingTrade.action === 'buy') {
      newBalance -= totalCost;

      const existingHoldingIndex = portfolio.findIndex((h: any) => h.symbol === pendingTrade.symbol);

      if (existingHoldingIndex !== -1) {
        const existingHolding = portfolio[existingHoldingIndex];
        const totalShares = existingHolding.shares + pendingTrade.shares;
        const totalCostBasis = (existingHolding.shares * existingHolding.averagePrice) + totalCost;

        portfolio[existingHoldingIndex] = {
          ...existingHolding,
          shares: totalShares,
          averagePrice: totalCostBasis / totalShares,
          currentPrice: pendingTrade.price
        };
      } else {
        portfolio.push({
          symbol: pendingTrade.symbol,
          name: `${pendingTrade.symbol} Corp.`,
          shares: pendingTrade.shares,
          averagePrice: pendingTrade.price,
          currentPrice: pendingTrade.price
        });
      }
    } else {
      // Sell logic
      const existingHoldingIndex = portfolio.findIndex((h: any) => h.symbol === pendingTrade.symbol);

      if (existingHoldingIndex !== -1) {
        const existingHolding = portfolio[existingHoldingIndex];
        const sharesToSell = Math.min(pendingTrade.shares, existingHolding.shares);
        const saleAmount = pendingTrade.price * sharesToSell;

        newBalance += saleAmount;

        if (sharesToSell === existingHolding.shares) {
          portfolio.splice(existingHoldingIndex, 1);
        } else {
          portfolio[existingHoldingIndex] = {
            ...existingHolding,
            shares: existingHolding.shares - sharesToSell,
            currentPrice: pendingTrade.price
          };
        }
      }
    }

    // Save portfolio and update balance
    localStorage.setItem(`portfolio_${user.id}`, JSON.stringify(portfolio));
    user.balance = newBalance;

    // Record transaction
    const transaction = {
      id: Date.now().toString(),
      type: pendingTrade.action,
      symbol: pendingTrade.symbol,
      name: `${pendingTrade.symbol} Corp. (Copy Trade)`,
      shares: pendingTrade.shares,
      price: pendingTrade.price,
      total: totalCost,
      date: new Date().toISOString(),
      copyTrade: true,
      expert: pendingTrade.expertName
    };

    const transactions = JSON.parse(localStorage.getItem(`transactions_${user.id}`) || '[]');
    transactions.push(transaction);
    localStorage.setItem(`transactions_${user.id}`, JSON.stringify(transactions));

    // Add to copied trades
    const copiedTrade: CopiedTrade = {
      id: Date.now().toString(),
      expertId: pendingTrade.expertId,
      expertName: pendingTrade.expertName,
      expertAvatar: pendingTrade.expertAvatar,
      symbol: pendingTrade.symbol,
      action: pendingTrade.action,
      shares: pendingTrade.shares,
      entryPrice: pendingTrade.price,
      currentPrice: pendingTrade.price,
      status: 'active',
      openedAt: new Date().toISOString(),
      copyMode: 'manual'
    };

    const updatedCopiedTrades = [...copiedTrades, copiedTrade];
    setCopiedTrades(updatedCopiedTrades);
    localStorage.setItem(`copied_trades_${user.id}`, JSON.stringify(updatedCopiedTrades));

    // Remove from pending trades
    const updatedPendingTrades = pendingTrades.filter(t => t.id !== pendingTrade.id);
    setPendingTrades(updatedPendingTrades);
    localStorage.setItem(`pending_trades_${user.id}`, JSON.stringify(updatedPendingTrades));

    alert(`Trade executed: ${pendingTrade.action.toUpperCase()} ${pendingTrade.shares} shares of ${pendingTrade.symbol} at $${pendingTrade.price}`);
  };

  const handleDeclineTrade = (tradeId: string) => {
    if (!user) return;

    const confirmed = window.confirm('Are you sure you want to decline this trade?');
    if (!confirmed) return;

    const updatedPendingTrades = pendingTrades.filter(t => t.id !== tradeId);
    setPendingTrades(updatedPendingTrades);
    localStorage.setItem(`pending_trades_${user.id}`, JSON.stringify(updatedPendingTrades));
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gradient mb-6">
            Please log in to view your copy trading portfolio
          </h1>
        </div>
      </div>
    );
  }

  const filteredTrades = getFilteredTrades();
  const activeTrades = copiedTrades.filter(t => t.status === 'active');
  const closedTrades = copiedTrades.filter(t => t.status === 'closed');

  const totalProfit = copiedTrades.reduce((sum, trade) => sum + calculateProfit(trade), 0);
  const activeTradesValue = activeTrades.reduce((sum, trade) => sum + (trade.currentPrice * trade.shares), 0);
  const totalInvested = copiedTrades.reduce((sum, trade) => sum + (trade.entryPrice * trade.shares), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        {/* Back Button */}
        <Link href="/copy-trading?tab=portfolio-center">
          <button className="mb-4 px-3 py-2 rounded-lg border transition-colors text-sm font-medium flex items-center gap-2 hover:bg-white/5"
                  style={{
                    borderColor: 'var(--glass-border)',
                    background: 'transparent',
                    color: 'var(--text-secondary)'
                  }}>
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio Center
          </button>
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              Portfolio Management
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Review pending trades and manage your copy trading positions
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Pending Actions Section - Prominently at Top */}
          {pendingTrades.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--glass-border)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                       style={{ background: 'var(--background-secondary)' }}>
                    <Bell className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Pending Trades
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full"
                            style={{ background: 'var(--background-secondary)', color: 'var(--text-secondary)' }}>
                        {pendingTrades.length}
                      </span>
                    </h2>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                      Review and approve trades from experts
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {pendingTrades.map((trade) => (
                  <div key={trade.id} className="rounded-lg border p-4 transition-colors hover:bg-white/[0.02]"
                       style={{ borderColor: 'var(--glass-border)', background: 'var(--background-secondary)' }}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Expert Info */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                               style={{ background: 'var(--background-primary)' }}>
                            {trade.expertAvatar}
                          </div>
                          <div>
                            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Trade from</p>
                            <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                              {trade.expertName}
                            </p>
                          </div>
                        </div>

                        {/* Trade Details */}
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm mb-1" style={{ color: 'var(--text-tertiary)' }}>Symbol</p>
                            <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                              {trade.symbol}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs mb-1.5" style={{ color: 'var(--text-tertiary)' }}>Action</p>
                            <span className={`px-2.5 py-1 rounded text-xs font-medium inline-flex items-center gap-1 ${
                              trade.action === 'buy'
                                ? 'bg-green-500/10 text-green-400'
                                : 'bg-red-500/10 text-red-400'
                            }`}>
                              {trade.action === 'buy' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                              {trade.action.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm mb-1" style={{ color: 'var(--text-tertiary)' }}>Shares</p>
                            <p className="font-bold" style={{ color: 'var(--text-primary)' }}>
                              {trade.shares}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm mb-1" style={{ color: 'var(--text-tertiary)' }}>Price</p>
                            <p className="font-bold" style={{ color: 'var(--text-primary)' }}>
                              ${trade.price.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Total Cost */}
                        <div className="text-center md:text-right">
                          <p className="text-sm mb-1" style={{ color: 'var(--text-tertiary)' }}>Total Cost</p>
                          <p className="font-bold text-xl" style={{ color: 'var(--primary-blue)' }}>
                            ${(trade.price * trade.shares).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Reason */}
                      {trade.reason && (
                        <div className="mt-4 p-4 glass-morphism rounded-lg">
                          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                            Trade Reason:
                          </p>
                          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                            {trade.reason}
                          </p>
                        </div>
                      )}

                      {/* Time & Actions */}
                      <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t"
                           style={{ borderColor: 'var(--glass-border)' }}>
                        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                          <Clock className="w-4 h-4" />
                          Received {getTimeAgo(trade.timestamp)}
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleDeclineTrade(trade.id)}
                            className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium hover:scale-105 flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Decline
                          </button>
                          <button
                            onClick={() => handleToggleExpand(trade)}
                            className="px-6 py-2 btn-primary hover:scale-105 transition-all duration-300 flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            {expandedTradeId === trade.id ? 'Cancel Review' : 'Accept Trade'}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Review Section */}
                      {expandedTradeId === trade.id && reviewedTrade && (
                        <div className="mt-4 p-6 glass-morphism rounded-lg border-2 border-blue-500/30 animate-fadeIn">
                          <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                            <CheckCircle className="w-5 h-5 text-blue-400" />
                            Review Trade Details
                          </h3>

                          {/* Current Price Info */}
                          <div className="mb-6 p-4 rounded-lg" style={{ background: 'var(--background-secondary)' }}>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Expert Price</p>
                                <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                                  ${trade.price.toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Current Price</p>
                                <p className="text-lg font-bold text-green-400">
                                  ${(trade.price * (1 + (Math.random() * 0.04 - 0.02))).toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Available Balance</p>
                                <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                                  ${user?.balance.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Quantity Adjustment */}
                          <div className="mb-6">
                            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                              Adjust Quantity
                            </label>
                            <div className="flex items-center gap-4">
                              <input
                                type="range"
                                min="1"
                                max={trade.shares * 2}
                                value={reviewedTrade.quantity}
                                onChange={(e) => setReviewedTrade({ ...reviewedTrade, quantity: parseInt(e.target.value) })}
                                className="flex-1"
                              />
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="1"
                                  value={reviewedTrade.quantity}
                                  onChange={(e) => setReviewedTrade({ ...reviewedTrade, quantity: parseInt(e.target.value) || 1 })}
                                  className="w-20 px-3 py-2 rounded-lg text-center font-bold"
                                  style={{ background: 'var(--background-secondary)', color: 'var(--text-primary)' }}
                                />
                                <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>shares</span>
                              </div>
                            </div>
                            <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
                              Total Cost: ${(trade.price * reviewedTrade.quantity).toFixed(2)}
                            </p>
                          </div>

                          {/* Risk Controls */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {/* Stop Loss */}
                            <div className="p-4 rounded-lg border" style={{
                              background: reviewedTrade.addStopLoss ? 'var(--background-secondary)' : 'transparent',
                              borderColor: reviewedTrade.addStopLoss ? 'var(--error)' : 'var(--glass-border)'
                            }}>
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={reviewedTrade.addStopLoss}
                                  onChange={(e) => setReviewedTrade({ ...reviewedTrade, addStopLoss: e.target.checked })}
                                  className="w-5 h-5"
                                />
                                <div className="flex-1">
                                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Add Stop Loss</p>
                                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Limit downside risk</p>
                                </div>
                              </label>
                              {reviewedTrade.addStopLoss && (
                                <div className="mt-3 flex items-center gap-2">
                                  <input
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={reviewedTrade.stopLossPercent}
                                    onChange={(e) => setReviewedTrade({ ...reviewedTrade, stopLossPercent: parseFloat(e.target.value) })}
                                    className="w-20 px-2 py-1 rounded text-center"
                                    style={{ background: 'var(--background-primary)', color: 'var(--text-primary)' }}
                                  />
                                  <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>% below entry</span>
                                </div>
                              )}
                            </div>

                            {/* Take Profit */}
                            <div className="p-4 rounded-lg border" style={{
                              background: reviewedTrade.addTakeProfit ? 'var(--background-secondary)' : 'transparent',
                              borderColor: reviewedTrade.addTakeProfit ? 'var(--success)' : 'var(--glass-border)'
                            }}>
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={reviewedTrade.addTakeProfit}
                                  onChange={(e) => setReviewedTrade({ ...reviewedTrade, addTakeProfit: e.target.checked })}
                                  className="w-5 h-5"
                                />
                                <div className="flex-1">
                                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Add Take Profit</p>
                                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Lock in gains</p>
                                </div>
                              </label>
                              {reviewedTrade.addTakeProfit && (
                                <div className="mt-3 flex items-center gap-2">
                                  <input
                                    type="number"
                                    min="1"
                                    max="200"
                                    value={reviewedTrade.takeProfitPercent}
                                    onChange={(e) => setReviewedTrade({ ...reviewedTrade, takeProfitPercent: parseFloat(e.target.value) })}
                                    className="w-20 px-2 py-1 rounded text-center"
                                    style={{ background: 'var(--background-primary)', color: 'var(--text-primary)' }}
                                  />
                                  <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>% above entry</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Risk Warning */}
                          {((trade.price * reviewedTrade.quantity) / (user?.balance || 1)) > 0.1 && (
                            <div className="mb-6 p-4 rounded-lg border-2 border-yellow-500/50 bg-yellow-500/10">
                              <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-sm font-semibold text-yellow-300 mb-1">Position Size Warning</p>
                                  <p className="text-xs text-yellow-200">
                                    This trade will be {(((trade.price * reviewedTrade.quantity) / (user?.balance || 1)) * 100).toFixed(1)}% of your portfolio.
                                    Consider reducing quantity for better diversification.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Confirm Buttons */}
                          <div className="flex gap-3 justify-end">
                            <button
                              onClick={() => {
                                setExpandedTradeId(null);
                                setReviewedTrade(null);
                              }}
                              className="px-6 py-2 btn-secondary"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleConfirmAcceptTrade(trade)}
                              className="px-8 py-2 btn-primary hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-lg"
                            >
                              <CheckCircle className="w-5 h-5" />
                              Confirm Accept
                            </button>
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="rounded-lg border p-5 text-center" style={{ borderColor: 'var(--glass-border)', background: 'var(--background-secondary)' }}>
              <div className="w-10 h-10 mx-auto mb-3 rounded-lg flex items-center justify-center" style={{ background: 'var(--background-primary)' }}>
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Active Trades</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{activeTrades.length}</p>
            </div>

            <div className="rounded-lg border p-5 text-center" style={{ borderColor: 'var(--glass-border)', background: 'var(--background-secondary)' }}>
              <div className="w-10 h-10 mx-auto mb-3 rounded-lg flex items-center justify-center" style={{ background: 'var(--background-primary)' }}>
                <DollarSign className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Active Value</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                ${activeTradesValue.toFixed(2)}
              </p>
            </div>

            <div className="rounded-lg border p-5 text-center" style={{ borderColor: 'var(--glass-border)', background: 'var(--background-secondary)' }}>
              <div className="w-10 h-10 mx-auto mb-3 rounded-lg flex items-center justify-center" style={{ background: 'var(--background-primary)' }}>
                {totalProfit >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                )}
              </div>
              <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Total P/L</p>
              <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
              </p>
            </div>

            <div className="rounded-lg border p-5 text-center" style={{ borderColor: 'var(--glass-border)', background: 'var(--background-secondary)' }}>
              <div className="w-10 h-10 mx-auto mb-3 rounded-lg flex items-center justify-center" style={{ background: 'var(--background-primary)' }}>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Closed Trades</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{closedTrades.length}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="rounded-lg border p-4 mb-6" style={{ borderColor: 'var(--glass-border)', background: 'var(--background-secondary)' }}>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                <h3 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Filter Trades</h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {/* Status Filter */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      filterStatus === 'all'
                        ? 'bg-blue-500 text-white'
                        : 'border'
                    }`}
                    style={filterStatus !== 'all' ? { borderColor: 'var(--glass-border)', color: 'var(--text-secondary)' } : {}}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterStatus('active')}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      filterStatus === 'active'
                        ? 'bg-blue-500 text-white'
                        : 'border'
                    }`}
                    style={filterStatus !== 'active' ? { borderColor: 'var(--glass-border)', color: 'var(--text-secondary)' } : {}}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setFilterStatus('closed')}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      filterStatus === 'closed'
                        ? 'bg-blue-500 text-white'
                        : 'border'
                    }`}
                    style={filterStatus !== 'closed' ? { borderColor: 'var(--glass-border)', color: 'var(--text-secondary)' } : {}}
                  >
                    Closed
                  </button>
                </div>

                {/* Expert Filter */}
                <select
                  value={filterExpert}
                  onChange={(e) => setFilterExpert(e.target.value)}
                  className="form-input px-3 py-1.5 text-sm"
                >
                  <option value="all">All Experts</option>
                  {experts.map(expert => (
                    <option key={expert.id} value={expert.id}>
                      {expert.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Trades List */}
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--glass-border)', background: 'var(--background-secondary)' }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--glass-border)' }}>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Copied Trades ({filteredTrades.length})
              </h2>
            </div>

        {filteredTrades.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th className="text-left">Expert</th>
                  <th className="text-left">Symbol</th>
                  <th className="text-right">Shares</th>
                  <th className="text-right">Entry Price</th>
                  <th className="text-right">Current Price</th>
                  <th className="text-right">P/L</th>
                  <th className="text-center">Mode</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Time</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrades.map((trade) => {
                  const profit = calculateProfit(trade);
                  const profitPercent = calculateProfitPercent(trade);

                  return (
                    <tr key={trade.id} className="hover:bg-white/5 transition-colors">
                      <td>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{trade.expertAvatar}</span>
                          <div>
                            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                              {trade.expertName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Link href={`/stock/${trade.symbol.toLowerCase()}`}>
                          <div className="text-lg font-bold hover:text-blue-400 cursor-pointer transition-colors" style={{ color: 'var(--text-primary)' }}>
                            {trade.symbol}
                          </div>
                        </Link>
                      </td>
                      <td className="text-right">
                        <div className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {trade.shares}
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="text-base" style={{ color: 'var(--text-secondary)' }}>
                          ${trade.entryPrice.toFixed(2)}
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                          ${trade.currentPrice.toFixed(2)}
                        </div>
                      </td>
                      <td className="text-right">
                        <div className={`text-lg font-bold ${profit >= 0 ? 'status-positive' : 'status-negative'}`}>
                          {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
                        </div>
                        <div className={`text-sm ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ({profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%)
                        </div>
                      </td>
                      <td className="text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          trade.copyMode === 'auto'
                            ? 'bg-blue-900/30 text-blue-300'
                            : 'bg-purple-900/30 text-purple-300'
                        }`}>
                          {trade.copyMode === 'auto' ? 'Auto' : 'Manual'}
                        </span>
                      </td>
                      <td className="text-center">
                        {trade.status === 'active' ? (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-900/30 text-green-300 flex items-center gap-1 justify-center">
                            <Play className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-900/30 text-gray-300 flex items-center gap-1 justify-center">
                            <CheckCircle className="w-3 h-3" />
                            Closed
                          </span>
                        )}
                      </td>
                      <td className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                            <Clock className="w-3 h-3" />
                            {getTimeAgo(trade.openedAt)}
                          </div>
                          {trade.closedAt && (
                            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              Closed {getTimeAgo(trade.closedAt)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="text-center">
                        {trade.status === 'active' ? (
                          <button
                            onClick={() => handleCloseTrade(trade.id)}
                            className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center gap-1.5 mx-auto"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Close
                          </button>
                        ) : (
                          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center" style={{ background: 'var(--background-primary)' }}>
                <BarChart3 className="w-8 h-8" style={{ color: 'var(--text-tertiary)' }} />
              </div>
              <p className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                No copied trades found
              </p>
            <p className="text-lg mb-6" style={{ color: 'var(--text-tertiary)' }}>
              {filterStatus !== 'all' || filterExpert !== 'all'
                ? 'Try adjusting your filters'
                : 'Start copying expert traders to see your trades here'}
            </p>
              <Link href="/copy-trading">
                <button className="btn-primary px-6 py-2.5 text-sm">
                  Browse Expert Traders
                </button>
              </Link>
            </div>
          )}
          </div>


          {/* Expert Analytics Section */}
          <div className="mt-8 space-y-4">
            <div className="px-1">
              <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                Expert Performance Analytics
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Compare performance across all experts you&apos;re following
              </p>
            </div>

            {subscriptions.filter(sub => sub.status === 'active').length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {subscriptions.filter(sub => sub.status === 'active').map((subscription) => {
                  const expertTrades = copiedTrades.filter(t => t.expertId === subscription.expertId);
                  const expertActiveTrades = expertTrades.filter(t => t.status === 'active');
                  const expertClosedTrades = expertTrades.filter(t => t.status === 'closed');
                  const expertProfit = expertTrades.reduce((sum, trade) => sum + calculateProfit(trade), 0);
                  const expertWinRate = expertClosedTrades.length > 0
                    ? (expertClosedTrades.filter(t => (t.profit || 0) > 0).length / expertClosedTrades.length) * 100
                    : 0;
                  const expertActiveValue = expertActiveTrades.reduce((sum, trade) => sum + (trade.currentPrice * trade.shares), 0);

                  return (
                    <div key={subscription.expertId} className="rounded-lg border p-5" style={{ borderColor: 'var(--glass-border)', background: 'var(--background-secondary)' }}>
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                               style={{ background: 'var(--background-primary)' }}>
                            {subscription.expertAvatar}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                              {subscription.expertName}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                subscription.autoCopy
                                  ? 'bg-blue-500/10 text-blue-400'
                                  : 'bg-purple-500/10 text-purple-400'
                              }`}>
                                {subscription.autoCopy ? 'Auto Copy' : 'Manual Copy'}
                              </span>
                              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                                Since {new Date(subscription.startDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button className="btn-secondary px-3 py-2 text-sm flex items-center gap-1.5">
                          <Settings className="w-3.5 h-3.5" />
                          Settings
                        </button>
                      </div>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                        <div className="rounded-lg border p-3 text-center" style={{ borderColor: 'var(--glass-border)', background: 'var(--background-primary)' }}>
                          <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Total Trades</p>
                          <p className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {expertTrades.length}
                          </p>
                        </div>

                        <div className="rounded-lg border p-3 text-center" style={{ borderColor: 'var(--glass-border)', background: 'var(--background-primary)' }}>
                          <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Active</p>
                          <p className="text-xl font-semibold text-blue-400">
                            {expertActiveTrades.length}
                          </p>
                        </div>

                        <div className="rounded-lg border p-3 text-center" style={{ borderColor: 'var(--glass-border)', background: 'var(--background-primary)' }}>
                          <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Active Value</p>
                          <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                            ${expertActiveValue.toFixed(0)}
                          </p>
                        </div>

                        <div className="rounded-lg border p-3 text-center" style={{ borderColor: 'var(--glass-border)', background: 'var(--background-primary)' }}>
                          <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Total P/L</p>
                          <p className={`text-xl font-semibold ${expertProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {expertProfit >= 0 ? '+' : ''}${expertProfit.toFixed(2)}
                          </p>
                        </div>

                        <div className="rounded-lg border p-3 text-center" style={{ borderColor: 'var(--glass-border)', background: 'var(--background-primary)' }}>
                          <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Win Rate</p>
                          <p className="text-xl font-semibold text-green-400">
                            {expertWinRate.toFixed(0)}%
                          </p>
                        </div>
                      </div>

                        {/* Recent Trades from this Expert */}
                        {expertTrades.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                              Recent Trades ({expertTrades.slice(0, 3).length})
                            </h4>
                            <div className="space-y-2">
                              {expertTrades.slice(0, 3).map((trade) => (
                                <div key={trade.id} className="glass-morphism p-3 rounded-lg flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                                      {trade.symbol}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded ${
                                      trade.action === 'buy' ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
                                    }`}>
                                      {trade.action.toUpperCase()}
                                    </span>
                                    <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                                      {trade.shares} shares @ ${trade.entryPrice.toFixed(2)}
                                    </span>
                                  </div>
                                  <div className={`font-semibold ${calculateProfit(trade) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {calculateProfit(trade) >= 0 ? '+' : ''}${calculateProfit(trade).toFixed(2)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="card">
                <div className="card-body text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                       style={{ background: 'var(--gradient-accent)' }}>
                    <Users className="w-10 h-10" style={{ color: 'var(--text-primary)' }} />
                  </div>
                  <p className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    No Active Subscriptions
                  </p>
                  <p className="text-lg mb-6" style={{ color: 'var(--text-tertiary)' }}>
                    Start following expert traders to see their performance analytics
                  </p>
                  <Link href="/copy-trading">
                    <button className="btn-primary px-8 py-3 hover:scale-105 transition-all duration-300">
                      Explore Experts
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
