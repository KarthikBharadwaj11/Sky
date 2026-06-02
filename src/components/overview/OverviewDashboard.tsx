'use client';

import { useAuth } from '../auth/AuthProvider';
import React, { useState, useEffect } from 'react';
import LineChart from '../charts/LineChart';
import AreaChart from '../charts/AreaChart';
import ComparisonChart from '../charts/ComparisonChart';
import PieChart from '../charts/PieChart';
import TradingModal from '../trading/TradingModal';

import { Sparkles, ChevronDown, Plus, Search, Filter, X, Check } from 'lucide-react';

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

interface Order {
  id: string;
  orderId: string;
  assetType: 'stock' | 'option' | 'etf';
  symbol: string;
  name: string;
  quantity: number;
  orderType: 'market' | 'limit' | 'stop-loss' | 'stop-limit';
  orderPrice: number;
  currentPrice: number;
  status: 'pending' | 'executed' | 'cancelled' | 'partially-filled' | 'rejected';
  date: string;
  side: 'buy' | 'sell';
}

export default function OverviewDashboard() {
  const { user } = useAuth();
  const [topStocks, setTopStocks] = useState<Stock[]>([]);
  const [portfolio, setPortfolio] = useState<Holding[]>([]);
  const [portfolioHistory, setPortfolioHistory] = useState<{ name: string; value: number }[]>([]);
  const [comparisonData, setComparisonData] = useState<{ name: string; userPerformance: number; marketPerformance: number }[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('30d');
  const [selectedComparisonTimeframe, setSelectedComparisonTimeframe] = useState<string>('30d');
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [isPortfolioLoading, setIsPortfolioLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState<Holding | null>(null);
  const [showTradingModal, setShowTradingModal] = useState(false);
  const [plMode, setPlMode] = useState<'cumulative' | 'daily'>('cumulative');
  const [calendarMonth, setCalendarMonth] = useState('May 2026');
  const [selectedAccount, setSelectedAccount] = useState('Demo Account');
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const ACCOUNTS = ['Demo Account', 'Trading Account'];

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersTab, setOrdersTab] = useState<'all' | 'stocks' | 'options' | 'etfs'>('all');
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | Order['status']>('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<'all' | Order['orderType']>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderSortBy, setOrderSortBy] = useState<'date' | 'price' | 'quantity'>('date');
  const [showOrderFilters, setShowOrderFilters] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
      { id: 4, type: 'buy', symbol: 'NVDA', shares: 3, price: 180.00, time: '3 hours ago', value: 540.00 },
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
    const baseValue = (user?.balance || 10000);

    // Static data for each timeframe
    const staticData: { [key: string]: { name: string; value: number }[] } = {
      '30d': [
        { name: 'Nov 13', value: baseValue + 1200 },
        { name: 'Nov 14', value: baseValue + 1450 },
        { name: 'Nov 15', value: baseValue + 1150 },
        { name: 'Nov 16', value: baseValue + 1350 },
        { name: 'Nov 17', value: baseValue + 1680 },
        { name: 'Nov 18', value: baseValue + 1420 },
        { name: 'Nov 19', value: baseValue + 1590 },
        { name: 'Nov 20', value: baseValue + 1820 },
        { name: 'Nov 21', value: baseValue + 1650 },
        { name: 'Nov 22', value: baseValue + 1900 },
        { name: 'Nov 23', value: baseValue + 2100 },
        { name: 'Nov 24', value: baseValue + 1880 },
        { name: 'Nov 25', value: baseValue + 2050 },
        { name: 'Nov 26', value: baseValue + 2280 },
        { name: 'Nov 27', value: baseValue + 2120 },
        { name: 'Nov 28', value: baseValue + 2350 },
        { name: 'Nov 29', value: baseValue + 2580 },
        { name: 'Nov 30', value: baseValue + 2420 },
        { name: 'Dec 1', value: baseValue + 2650 },
        { name: 'Dec 2', value: baseValue + 2720 },
        { name: 'Dec 3', value: baseValue + 2580 },
        { name: 'Dec 4', value: baseValue + 2750 },
        { name: 'Dec 5', value: baseValue + 2920 },
        { name: 'Dec 6', value: baseValue + 2780 },
        { name: 'Dec 7', value: baseValue + 3050 },
        { name: 'Dec 8', value: baseValue + 3180 },
        { name: 'Dec 9', value: baseValue + 2950 },
        { name: 'Dec 10', value: baseValue + 3220 },
        { name: 'Dec 11', value: baseValue + 3350 },
        { name: 'Dec 12', value: baseValue + 3500 }
      ],
      '3m': [
        { name: 'Sep 12', value: baseValue - 500 },
        { name: 'Sep 19', value: baseValue - 300 },
        { name: 'Sep 26', value: baseValue - 100 },
        { name: 'Oct 3', value: baseValue + 100 },
        { name: 'Oct 10', value: baseValue + 300 },
        { name: 'Oct 17', value: baseValue + 500 },
        { name: 'Oct 24', value: baseValue + 700 },
        { name: 'Oct 31', value: baseValue + 900 },
        { name: 'Nov 7', value: baseValue + 1200 },
        { name: 'Nov 14', value: baseValue + 1500 },
        { name: 'Nov 21', value: baseValue + 1800 },
        { name: 'Nov 28', value: baseValue + 2200 },
        { name: 'Dec 5', value: baseValue + 2700 },
        { name: 'Dec 12', value: baseValue + 3200 }
      ],
      '6m': [
        { name: 'Jun 12', value: baseValue - 2000 },
        { name: 'Jun 26', value: baseValue - 1700 },
        { name: 'Jul 10', value: baseValue - 1400 },
        { name: 'Jul 24', value: baseValue - 1100 },
        { name: 'Aug 7', value: baseValue - 800 },
        { name: 'Aug 21', value: baseValue - 500 },
        { name: 'Sep 4', value: baseValue - 200 },
        { name: 'Sep 18', value: baseValue + 100 },
        { name: 'Oct 2', value: baseValue + 500 },
        { name: 'Oct 16', value: baseValue + 900 },
        { name: 'Oct 30', value: baseValue + 1400 },
        { name: 'Nov 13', value: baseValue + 1900 },
        { name: 'Nov 27', value: baseValue + 2500 },
        { name: 'Dec 12', value: baseValue + 3200 }
      ],
      '1y': [
        { name: '2024 Jan', value: baseValue - 5000 },
        { name: '2024 Feb', value: baseValue - 4200 },
        { name: '2024 Mar', value: baseValue - 3500 },
        { name: '2024 Apr', value: baseValue - 2800 },
        { name: '2024 May', value: baseValue - 2100 },
        { name: '2024 Jun', value: baseValue - 1500 },
        { name: '2024 Jul', value: baseValue - 900 },
        { name: '2024 Aug', value: baseValue - 400 },
        { name: '2024 Sep', value: baseValue + 200 },
        { name: '2024 Oct', value: baseValue + 900 },
        { name: '2024 Nov', value: baseValue + 1800 },
        { name: '2024 Dec', value: baseValue + 3200 }
      ],
      '5y': [
        { name: '2020 Jan', value: baseValue - 8000 },
        { name: '2020 Jul', value: baseValue - 6000 },
        { name: '2021 Jan', value: baseValue - 4000 },
        { name: '2021 Jul', value: baseValue - 2000 },
        { name: '2022 Jan', value: baseValue - 500 },
        { name: '2022 Jul', value: baseValue + 500 },
        { name: '2023 Jan', value: baseValue + 1500 },
        { name: '2023 Jul', value: baseValue + 2000 },
        { name: '2024 Jan', value: baseValue + 2500 },
        { name: '2024 Jul', value: baseValue + 2800 },
        { name: '2024 Dec', value: baseValue + 3200 }
      ]
    };

    setPortfolioHistory(staticData[timeframe] || staticData['30d']);
  };

  const generateComparisonData = (timeframe: string) => {
    // Static comparison data for each timeframe
    const staticComparisonData: { [key: string]: { name: string; userPerformance: number; marketPerformance: number }[] } = {
      '7d': [
        { name: 'Mon', userPerformance: 0.5, marketPerformance: 0.3 },
        { name: 'Tue', userPerformance: 1.2, marketPerformance: 0.8 },
        { name: 'Wed', userPerformance: 0.8, marketPerformance: 0.6 },
        { name: 'Thu', userPerformance: 1.5, marketPerformance: 1.1 },
        { name: 'Fri', userPerformance: 2.1, marketPerformance: 1.5 },
        { name: 'Sat', userPerformance: 2.4, marketPerformance: 1.7 },
        { name: 'Sun', userPerformance: 2.8, marketPerformance: 2.0 }
      ],
      '30d': [
        { name: 'Nov 13', userPerformance: -0.5, marketPerformance: -0.3 },
        { name: 'Nov 15', userPerformance: 0.8, marketPerformance: 0.4 },
        { name: 'Nov 17', userPerformance: 0.3, marketPerformance: 0.2 },
        { name: 'Nov 19', userPerformance: 1.2, marketPerformance: 0.8 },
        { name: 'Nov 21', userPerformance: 2.1, marketPerformance: 1.3 },
        { name: 'Nov 23', userPerformance: 1.6, marketPerformance: 1.0 },
        { name: 'Nov 25', userPerformance: 2.8, marketPerformance: 1.9 },
        { name: 'Nov 27', userPerformance: 3.5, marketPerformance: 2.4 },
        { name: 'Nov 29', userPerformance: 3.0, marketPerformance: 2.0 },
        { name: 'Dec 1', userPerformance: 4.2, marketPerformance: 2.9 },
        { name: 'Dec 3', userPerformance: 5.5, marketPerformance: 3.7 },
        { name: 'Dec 5', userPerformance: 4.8, marketPerformance: 3.2 },
        { name: 'Dec 7', userPerformance: 6.2, marketPerformance: 4.3 },
        { name: 'Dec 9', userPerformance: 7.0, marketPerformance: 4.8 },
        { name: 'Dec 12', userPerformance: 8.5, marketPerformance: 5.7 }
      ],
      '3m': [
        { name: 'Sep 12', userPerformance: -2.5, marketPerformance: -1.8 },
        { name: 'Sep 19', userPerformance: -1.8, marketPerformance: -1.2 },
        { name: 'Sep 26', userPerformance: -0.8, marketPerformance: -0.5 },
        { name: 'Oct 3', userPerformance: 0.3, marketPerformance: 0.2 },
        { name: 'Oct 10', userPerformance: 1.5, marketPerformance: 1.0 },
        { name: 'Oct 17', userPerformance: 2.8, marketPerformance: 1.9 },
        { name: 'Oct 24', userPerformance: 4.2, marketPerformance: 2.9 },
        { name: 'Oct 31', userPerformance: 5.6, marketPerformance: 3.8 },
        { name: 'Nov 7', userPerformance: 6.8, marketPerformance: 4.6 },
        { name: 'Nov 14', userPerformance: 7.5, marketPerformance: 5.2 },
        { name: 'Nov 21', userPerformance: 8.2, marketPerformance: 5.7 },
        { name: 'Nov 28', userPerformance: 9.0, marketPerformance: 6.3 },
        { name: 'Dec 5', userPerformance: 10.2, marketPerformance: 7.1 },
        { name: 'Dec 12', userPerformance: 11.5, marketPerformance: 8.0 }
      ],
      '1y': [
        { name: '2024 Jan', userPerformance: -5.2, marketPerformance: -3.8 },
        { name: '2024 Feb', userPerformance: -3.5, marketPerformance: -2.4 },
        { name: '2024 Mar', userPerformance: -1.8, marketPerformance: -1.2 },
        { name: '2024 Apr', userPerformance: 0.5, marketPerformance: 0.3 },
        { name: '2024 May', userPerformance: 2.8, marketPerformance: 1.9 },
        { name: '2024 Jun', userPerformance: 5.2, marketPerformance: 3.6 },
        { name: '2024 Jul', userPerformance: 7.5, marketPerformance: 5.2 },
        { name: '2024 Aug', userPerformance: 9.8, marketPerformance: 6.8 },
        { name: '2024 Sep', userPerformance: 12.2, marketPerformance: 8.5 },
        { name: '2024 Oct', userPerformance: 14.5, marketPerformance: 10.1 },
        { name: '2024 Nov', userPerformance: 16.8, marketPerformance: 11.7 },
        { name: '2024 Dec', userPerformance: 19.2, marketPerformance: 13.4 }
      ]
    };

    setComparisonData(staticComparisonData[timeframe] || staticComparisonData['30d']);
  };

  // Orders logic
  const generateMockOrders = (): Order[] => ([
    { id: 'order_1', orderId: 'ORD001002', assetType: 'stock',  symbol: 'NVDA',      name: 'NVIDIA Corporation',    quantity: 10, orderType: 'limit',     orderPrice: 842.50, currentPrice: 855.20, status: 'executed',  date: new Date('2026-04-28T10:32:00').toISOString(), side: 'buy'  },
    { id: 'order_2', orderId: 'ORD001003', assetType: 'stock',  symbol: 'AAPL',      name: 'Apple Inc.',            quantity: 25, orderType: 'market',    orderPrice: 175.43, currentPrice: 178.10, status: 'executed',  date: new Date('2026-04-27T14:15:00').toISOString(), side: 'buy'  },
    { id: 'order_3', orderId: 'ORD001004', assetType: 'option', symbol: 'TSLA 180P', name: 'Tesla Put $180',        quantity: 10, orderType: 'limit',     orderPrice: 3.50,   currentPrice: 3.80,   status: 'pending',   date: new Date('2026-04-29T09:45:00').toISOString(), side: 'buy'  },
    { id: 'order_4', orderId: 'ORD001005', assetType: 'etf',    symbol: 'SPY',       name: 'SPDR S&P 500 ETF',     quantity: 5,  orderType: 'stop-loss', orderPrice: 510.00, currentPrice: 523.18, status: 'cancelled', date: new Date('2026-04-26T11:20:00').toISOString(), side: 'sell' },
    { id: 'order_5', orderId: 'ORD001006', assetType: 'stock',  symbol: 'AMD',       name: 'Advanced Micro Devices',quantity: 20, orderType: 'market',    orderPrice: 182.00, currentPrice: 179.50, status: 'executed',  date: new Date('2026-04-25T15:55:00').toISOString(), side: 'sell' },
  ]);

  useEffect(() => {
    if (!user) return;
    const stored = localStorage.getItem(`orders_${user.id}`);
    if (stored) {
      setOrders(JSON.parse(stored));
    } else {
      const mock = generateMockOrders();
      localStorage.setItem(`orders_${user.id}`, JSON.stringify(mock));
      setOrders(mock);
    }
  }, [user]);

  const filteredOrders = orders.filter(o => {
    if (ordersTab !== 'all' && o.assetType !== ordersTab.slice(0, -1)) return false;
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (orderTypeFilter !== 'all' && o.orderType !== orderTypeFilter) return false;
    if (orderSearchQuery && !o.symbol.toLowerCase().includes(orderSearchQuery.toLowerCase()) && !o.name.toLowerCase().includes(orderSearchQuery.toLowerCase())) return false;
    return true;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (orderSortBy === 'date')     return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (orderSortBy === 'price')    return b.currentPrice - a.currentPrice;
    if (orderSortBy === 'quantity') return b.quantity - a.quantity;
    return 0;
  });

  const handleSelectAll = () => {
    setSelectedOrders(selectedOrders.size === sortedOrders.length ? new Set() : new Set(sortedOrders.map(o => o.id)));
  };

  const handleSelectOrder = (id: string) => {
    const next = new Set(selectedOrders);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedOrders(next);
  };

  const getOrderStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'executed':        return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'pending':         return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'cancelled':       return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'partially-filled':return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'rejected':        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default:                return 'glass-morphism';
    }
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


  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 px-6 shrink-0" style={{ height: '48px', borderBottom: '1px solid var(--glass-border-color)', background: 'var(--navbar-bg, rgba(10,10,20,0.95))' }}>
        {/* Account dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAccountMenu(!showAccountMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-white/10"
            style={{ border: '1px solid var(--glass-border-color)', color: 'var(--text-primary)' }}
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${selectedAccount === 'Trading Account' ? 'bg-green-400' : 'bg-yellow-400'}`} />
            {selectedAccount}
            <ChevronDown className="w-3 h-3" style={{ color: 'var(--text-tertiary)', transform: showAccountMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
          </button>
          {showAccountMenu && (
            <div className="absolute top-full right-0 mt-1 w-44 rounded-lg overflow-hidden shadow-xl z-50" style={{ background: 'rgba(10,14,26,0.97)', border: '1px solid var(--glass-border-color)', backdropFilter: 'blur(16px)' }}>
              {ACCOUNTS.map(acc => (
                <button
                  key={acc}
                  onClick={() => { setSelectedAccount(acc); setShowAccountMenu(false); }}
                  className="w-full px-3 py-2.5 text-left text-xs flex items-center gap-2 hover:bg-white/10 transition-colors"
                  style={{ color: acc === selectedAccount ? 'var(--text-accent)' : 'var(--text-secondary)' }}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${acc === 'Trading Account' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                  {acc}
                  {acc === selectedAccount && <span className="ml-auto text-[10px]" style={{ color: 'var(--text-accent)' }}>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Add account */}
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-white/10"
          style={{ border: '1px solid var(--glass-border-color)', color: 'var(--text-tertiary)' }}
        >
          <Plus className="w-3 h-3" />
          Add Account
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-8 pt-4 pb-8">

        {/* ── Date range ────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs px-2.5 py-1 rounded-lg" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border-color)', color: 'var(--text-tertiary)' }}>
            20 Feb 2026 – 21 May 2026
          </span>
        </div>

        {/* ── Performance stat strip ────────────────────────────────── */}
        <div className="grid grid-cols-4 rounded-xl mb-6 overflow-hidden" style={{ border: '1px solid var(--glass-border-color)' }}>
          {[
            { label: 'Net P&L', value: '$0.00', sub: 'Track your daily change', color: 'var(--text-primary)' },
            { label: 'Win Rate', value: '0.00%', sub: 'Track your daily change', color: 'var(--text-primary)' },
            { label: 'Profit Factor', value: '—', sub: 'Track your daily change', color: 'var(--text-primary)' },
            { label: 'Avg. Win/Loss Ratio', value: '—', sub: 'Track your daily change', color: 'var(--text-primary)' },
          ].map((stat, i) => (
            <div key={stat.label} className={`px-6 py-5 ${i > 0 ? 'border-l' : ''}`} style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border-color)' }}>
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</p>
              <p className="text-2xl font-bold mb-1.5" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-[11px] flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
                <svg className="w-3 h-3 opacity-60" viewBox="0 0 12 12" fill="none"><path d="M1 9 L4 5 L7 7 L11 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        {/* ── Performance Breakdown + P&L Chart ────────────────────── */}
        <div className="grid grid-cols-2 gap-6 mb-6">

          {/* Quick Stats */}
          <div className="card">
            <div className="card-body p-5">
              <h3 className="text-base font-bold mb-5" style={{ color: 'var(--text-primary)' }}>Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Total Trades', value: '0' },
                  { label: 'Days Traded', value: '0' },
                  { label: 'Avg Daily P&L', value: '$0.00' },
                  { label: 'Largest Win', value: '$0.00', color: '#22c55e' },
                  { label: 'Largest Loss', value: '$0.00', color: '#ef4444' },
                  { label: 'Avg Hold Time', value: '—' },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border-color)' }}>
                    <p className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>{s.label}</p>
                    <p className="text-xl font-bold" style={{ color: s.color ?? 'var(--text-primary)' }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* P&L Performance */}
          <div className="card">
            <div className="card-body p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>P&L Performance</h3>
                <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--glass-border-color)' }}>
                  {(['Cumulative', 'Daily'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setPlMode(mode.toLowerCase() as 'cumulative' | 'daily')}
                      className="px-3 py-1.5 text-xs font-semibold transition-all"
                      style={{
                        background: plMode === mode.toLowerCase() ? 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(124,58,237,0.25))' : 'transparent',
                        color: plMode === mode.toLowerCase() ? 'var(--text-accent)' : 'var(--text-tertiary)',
                      }}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
              <LineChart
                data={portfolioHistory}
                color="#10B981"
                height={280}
                minimalistic={false}
                showGrid={true}
                enableZoom={false}
                disableTooltip={true}
                hideLine={true}
              />
            </div>
          </div>
        </div>

        {/* ── Trading Calendar ──────────────────────────────────────── */}
        <div className="card mb-6">
          <div className="card-body p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Calendar</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 transition-colors" style={{ color: 'var(--text-tertiary)' }}>
                    <svg viewBox="0 0 12 12" width="12" height="12" fill="none"><path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>May 2026</span>
                  <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 transition-colors" style={{ color: 'var(--text-tertiary)' }}>
                    <svg viewBox="0 0 12 12" width="12" height="12" fill="none"><path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-lg" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border-color)', color: 'var(--text-tertiary)' }}>Current Month</span>
              </div>
            </div>

            {/* Calendar grid */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(7, 1fr) 140px' }}>
              {/* Day headers */}
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'WEEKLY'].map(d => (
                <div key={d} className="py-2 text-center text-[11px] font-semibold border-b border-r last:border-r-0" style={{ color: 'var(--text-tertiary)', borderColor: 'var(--glass-border-color)' }}>
                  {d}
                </div>
              ))}

              {/* Weeks — flattened to avoid fragment key issues */}
              {(() => {
                const weeks = [
                  { days: [{ n: 26, cur: false }, { n: 27, cur: false }, { n: 28, cur: false }, { n: 29, cur: false }, { n: 30, cur: false }, { n: 1, cur: true }, { n: 2, cur: true }], wk: 1 },
                  { days: [{ n: 3, cur: true }, { n: 4, cur: true }, { n: 5, cur: true }, { n: 6, cur: true }, { n: 7, cur: true }, { n: 8, cur: true }, { n: 9, cur: true }], wk: 2 },
                  { days: [{ n: 10, cur: true }, { n: 11, cur: true }, { n: 12, cur: true }, { n: 13, cur: true }, { n: 14, cur: true }, { n: 15, cur: true }, { n: 16, cur: true }], wk: 3 },
                  { days: [{ n: 17, cur: true }, { n: 18, cur: true }, { n: 19, cur: true }, { n: 20, cur: true }, { n: 21, cur: true }, { n: 22, cur: true }, { n: 23, cur: true }], wk: 4 },
                  { days: [{ n: 24, cur: true }, { n: 25, cur: true }, { n: 26, cur: true }, { n: 27, cur: true }, { n: 28, cur: true }, { n: 29, cur: true }, { n: 30, cur: true }], wk: 5 },
                  { days: [{ n: 31, cur: true }, null, null, null, null, null, null], wk: 6 },
                ];
                const cells: React.ReactNode[] = [];
                weeks.forEach(({ days, wk }) => {
                  days.forEach((day, di) => {
                    cells.push(
                      <div
                        key={`d-${wk}-${di}`}
                        className="border-b border-r"
                        style={{
                          height: '72px',
                          borderColor: 'var(--glass-border-color)',
                          background: day === null ? 'transparent' : day.cur ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.004)',
                        }}
                      >
                        {day !== null && (
                          <span className="block p-2 text-xs font-medium" style={{ color: day.cur ? 'var(--text-tertiary)' : 'rgba(140,150,170,0.3)' }}>
                            {day.n}
                          </span>
                        )}
                      </div>
                    );
                  });
                  cells.push(
                    <div key={`w-${wk}`} className="border-b flex flex-col justify-center px-4" style={{ borderColor: 'var(--glass-border-color)', background: 'rgba(255,255,255,0.02)' }}>
                      <p className="text-[10px] font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>Week {wk}</p>
                      <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>$0.00</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>0 days</p>
                    </div>
                  );
                });
                return cells;
              })()}
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
                            <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                              {holding.symbol}
                            </span>
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
              <p className="text-xl mb-2" style={{ color: 'var(--text-primary)' }}>No positions yet.</p>
              <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>Start trading to build your portfolio!</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Orders ───────────────────────────────────────────────── */}
      <div className="card mb-8">
        {/* Stats bar */}
        <div className="grid grid-cols-4 border-b" style={{ borderColor: 'var(--glass-border-color)' }}>
          {[
            { label: 'Total Orders', value: orders.length, color: 'var(--primary-blue)' },
            { label: 'Executed',     value: orders.filter(o => o.status === 'executed').length,  color: '#22c55e' },
            { label: 'Pending',      value: orders.filter(o => o.status === 'pending').length,   color: '#facc15' },
            { label: 'Total Value',  value: `$${orders.reduce((s, o) => s + o.quantity * o.currentPrice, 0).toFixed(2)}`, color: 'var(--primary-purple)' },
          ].map((stat, i) => (
            <div key={stat.label} className={`px-5 py-4 ${i > 0 ? 'border-l' : ''}`} style={{ borderColor: 'var(--glass-border-color)' }}>
              <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</p>
              <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 px-5 pt-4 pb-0 border-b" style={{ borderColor: 'var(--glass-border-color)' }}>
          <h2 className="text-base font-bold mr-4" style={{ color: 'var(--text-primary)' }}>Orders</h2>
          {(['all', 'stocks', 'options', 'etfs'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setOrdersTab(tab)}
              className="px-4 py-2 rounded-t-lg text-xs font-semibold transition-all"
              style={{
                background: ordersTab === tab ? 'linear-gradient(135deg, #3b82f6, #9333ea)' : 'transparent',
                color: ordersTab === tab ? '#fff' : 'var(--text-secondary)',
                borderBottom: ordersTab === tab ? 'none' : undefined,
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Search + filters */}
        <div className="px-5 py-3 border-b flex flex-col gap-3" style={{ borderColor: 'var(--glass-border-color)' }}>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                placeholder="Search by symbol or name…"
                value={orderSearchQuery}
                onChange={e => setOrderSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border-color)', color: 'var(--text-primary)' }}
              />
            </div>
            <button
              onClick={() => setShowOrderFilters(!showOrderFilters)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: showOrderFilters ? 'linear-gradient(135deg, #3b82f6, #9333ea)' : 'rgba(255,255,255,0.04)',
                color: showOrderFilters ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--glass-border-color)',
              }}
            >
              <Filter className="w-3.5 h-3.5" /> Filters
            </button>
            <select
              value={orderSortBy}
              onChange={e => setOrderSortBy(e.target.value as typeof orderSortBy)}
              className="px-3 py-2 text-xs rounded-lg"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border-color)', color: 'var(--text-secondary)' }}
            >
              <option value="date">Sort by Date</option>
              <option value="price">Sort by Price</option>
              <option value="quantity">Sort by Quantity</option>
            </select>
          </div>

          {showOrderFilters && (
            <div className="flex items-end gap-4 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border-color)' }}>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Status</label>
                <select value={orderStatusFilter} onChange={e => setOrderStatusFilter(e.target.value as typeof orderStatusFilter)} className="px-3 py-1.5 text-xs rounded-lg" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border-color)', color: 'var(--text-secondary)' }}>
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="executed">Executed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="partially-filled">Partially Filled</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Order Type</label>
                <select value={orderTypeFilter} onChange={e => setOrderTypeFilter(e.target.value as typeof orderTypeFilter)} className="px-3 py-1.5 text-xs rounded-lg" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border-color)', color: 'var(--text-secondary)' }}>
                  <option value="all">All</option>
                  <option value="market">Market</option>
                  <option value="limit">Limit</option>
                  <option value="stop-loss">Stop Loss</option>
                  <option value="stop-limit">Stop Limit</option>
                </select>
              </div>
              <button
                onClick={() => { setOrderStatusFilter('all'); setOrderTypeFilter('all'); setOrderSearchQuery(''); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs hover:bg-red-500/20 transition-colors"
                style={{ border: '1px solid var(--glass-border-color)', color: 'var(--text-secondary)' }}
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
          )}
        </div>

        {/* Bulk actions */}
        {selectedOrders.size > 0 && (
          <div className="px-5 py-3 border-b flex items-center justify-between" style={{ background: 'rgba(59,130,246,0.06)', borderColor: 'var(--glass-border-color)' }}>
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{selectedOrders.size} selected</span>
            <div className="flex gap-2">
              <button onClick={() => { if (confirm(`Sell ${selectedOrders.size} order(s)?`)) setSelectedOrders(new Set()); }} className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all">Sell Selected</button>
              <button onClick={() => setSelectedOrders(new Set())} className="px-3 py-1.5 rounded-lg text-xs" style={{ border: '1px solid var(--glass-border-color)', color: 'var(--text-secondary)' }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          {sortedOrders.length > 0 ? (
            <table className="table w-full">
              <thead>
                <tr>
                  <th><input type="checkbox" checked={selectedOrders.size === sortedOrders.length && sortedOrders.length > 0} onChange={handleSelectAll} className="w-4 h-4 rounded" /></th>
                  <th className="text-left text-xs">Order ID</th>
                  <th className="text-left text-xs">Asset</th>
                  <th className="text-left text-xs">Side</th>
                  <th className="text-right text-xs">Qty</th>
                  <th className="text-left text-xs">Type</th>
                  <th className="text-right text-xs">Order Price</th>
                  <th className="text-right text-xs">Current Price</th>
                  <th className="text-left text-xs">Status</th>
                  <th className="text-left text-xs">Date</th>
                  <th className="text-center text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders.map(order => {
                  const change = order.currentPrice - order.orderPrice;
                  const changePct = (change / order.orderPrice) * 100;
                  return (
                    <tr key={order.id} className={selectedOrders.has(order.id) ? 'bg-blue-500/5' : ''}>
                      <td><input type="checkbox" checked={selectedOrders.has(order.id)} onChange={() => handleSelectOrder(order.id)} className="w-4 h-4 rounded" /></td>
                      <td><span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{order.orderId}</span></td>
                      <td>
                        <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{order.symbol}</span>
                        <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{order.name}</div>
                      </td>
                      <td><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${order.side === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{order.side.toUpperCase()}</span></td>
                      <td className="text-right text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{order.quantity}</td>
                      <td><span className="text-xs px-2 py-0.5 rounded capitalize" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>{order.orderType.replace('-', ' ')}</span></td>
                      <td className="text-right text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>${order.orderPrice.toFixed(2)}</td>
                      <td className="text-right">
                        <div className="text-sm font-bold" style={{ color: 'var(--text-accent)' }}>${order.currentPrice.toFixed(2)}</div>
                        <div className={`text-xs ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>{change >= 0 ? '+' : ''}{changePct.toFixed(2)}%</div>
                      </td>
                      <td><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getOrderStatusColor(order.status)}`}>{order.status.replace('-', ' ').toUpperCase()}</span></td>
                      <td>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{new Date(order.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                      <td>
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={() => { setSelectedOrder(order); setShowBuyModal(true); }} className="text-xs px-2.5 py-1 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all font-semibold">Buy More</button>
                          <button onClick={() => { setSelectedOrder(order); setShowSellModal(true); }} className="text-xs px-2.5 py-1 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all font-semibold">Sell</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No orders found</p>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                {orderSearchQuery || orderStatusFilter !== 'all' || orderTypeFilter !== 'all' ? 'Try adjusting your filters' : 'Start trading to see your orders here'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* P/L by Ticker */}
      <div className="card mb-8">
        <div className="card-body p-5">
          <h3 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>P/L by Ticker</h3>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border-color)' }}>
                {['Symbol', 'Trades', 'Net P&L', 'Win Rate', 'Avg Win', 'Avg Loss'].map(h => (
                  <th key={h} className="pb-3 text-left font-semibold text-xs" style={{ color: 'var(--text-tertiary)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { symbol: 'AAPL', name: 'Apple Inc.'      },
                { symbol: 'NVDA', name: 'NVIDIA Corp.'    },
                { symbol: 'MSFT', name: 'Microsoft Corp.' },
                { symbol: 'AMZN', name: 'Amazon.com'      },
                { symbol: 'GOOGL', name: 'Alphabet Inc.'  },
                { symbol: 'TSLA', name: 'Tesla Inc.'      },
              ].map(t => (
                <tr key={t.symbol} className="hover:bg-white/5 transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="py-3 pr-4">
                    <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{t.symbol}</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{t.name}</p>
                  </td>
                  <td className="py-3 pr-4" style={{ color: 'var(--text-tertiary)' }}>—</td>
                  <td className="py-3 pr-4" style={{ color: 'var(--text-tertiary)' }}>—</td>
                  <td className="py-3 pr-4" style={{ color: 'var(--text-tertiary)' }}>—</td>
                  <td className="py-3 pr-4" style={{ color: 'var(--text-tertiary)' }}>—</td>
                  <td className="py-3" style={{ color: 'var(--text-tertiary)' }}>—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* Recent Activity */}
      <div className="card mb-12">
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
                              <span className="font-bold text-blue-400">
                                ${activity.symbol}
                              </span>
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


        {/* Buy More Modal */}
        {showBuyModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="card max-w-md w-full">
              <div className="card-header border-b" style={{ borderColor: 'var(--glass-border-color)' }}>
                <h3 className="text-xl font-bold text-gradient">Buy More {selectedOrder.symbol}</h3>
              </div>
              <div className="card-body space-y-3">
                <div className="flex justify-between text-sm"><span style={{ color: 'var(--text-secondary)' }}>Current Price</span><span className="font-bold" style={{ color: 'var(--text-primary)' }}>${selectedOrder.currentPrice.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span style={{ color: 'var(--text-secondary)' }}>Previous Qty</span><span className="font-bold" style={{ color: 'var(--text-primary)' }}>{selectedOrder.quantity}</span></div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => { alert(`Buy order placed for ${selectedOrder.quantity} shares of ${selectedOrder.symbol}`); setShowBuyModal(false); }} className="btn-primary flex-1">Confirm Purchase</button>
                  <button onClick={() => setShowBuyModal(false)} className="btn-secondary flex-1">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sell Modal */}
        {showSellModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="card max-w-md w-full">
              <div className="card-header border-b" style={{ borderColor: 'var(--glass-border-color)' }}>
                <h3 className="text-xl font-bold text-gradient">Sell {selectedOrder.symbol}</h3>
              </div>
              <div className="card-body space-y-3">
                <div className="flex justify-between text-sm"><span style={{ color: 'var(--text-secondary)' }}>Current Price</span><span className="font-bold" style={{ color: 'var(--text-primary)' }}>${selectedOrder.currentPrice.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span style={{ color: 'var(--text-secondary)' }}>Quantity</span><span className="font-bold" style={{ color: 'var(--text-primary)' }}>{selectedOrder.quantity}</span></div>
                <div className="flex justify-between text-sm"><span style={{ color: 'var(--text-secondary)' }}>Estimated Total</span><span className="font-bold text-green-400">${(selectedOrder.quantity * selectedOrder.currentPrice).toFixed(2)}</span></div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => { alert(`Sell order placed for ${selectedOrder.quantity} shares of ${selectedOrder.symbol}`); setShowSellModal(false); }} className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all">Confirm Sale</button>
                  <button onClick={() => setShowSellModal(false)} className="btn-secondary flex-1">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

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
  );
}
