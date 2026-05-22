'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';

import { TrendingUp, TrendingDown, Search, Filter, X, Check } from 'lucide-react';

export interface Order {
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

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedTab, setSelectedTab] = useState<'all' | 'stocks' | 'options' | 'etfs'>('all');
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<'all' | Order['orderType']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'quantity'>('date');
  const [showFilters, setShowFilters] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Load orders from localStorage
  const loadOrders = useCallback(() => {
    if (!user) return;

    const storedOrders = localStorage.getItem(`orders_${user.id}`);
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      // Generate mock orders if none exist
      const mockOrders = generateMockOrders();
      localStorage.setItem(`orders_${user.id}`, JSON.stringify(mockOrders));
      setOrders(mockOrders);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user, loadOrders]);

  // Generate mock orders for demo
  const generateMockOrders = (): Order[] => {
    return [
      {
        id: 'order_1',
        orderId: 'ORD001002',
        assetType: 'stock',
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        quantity: 10,
        orderType: 'limit',
        orderPrice: 842.50,
        currentPrice: 855.20,
        status: 'executed',
        date: new Date('2026-04-28T10:32:00').toISOString(),
        side: 'buy',
      },
      {
        id: 'order_2',
        orderId: 'ORD001003',
        assetType: 'stock',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        quantity: 25,
        orderType: 'market',
        orderPrice: 175.43,
        currentPrice: 178.10,
        status: 'executed',
        date: new Date('2026-04-27T14:15:00').toISOString(),
        side: 'buy',
      },
      {
        id: 'order_3',
        orderId: 'ORD001004',
        assetType: 'option',
        symbol: 'TSLA 180P',
        name: 'Tesla Put $180',
        quantity: 10,
        orderType: 'limit',
        orderPrice: 3.50,
        currentPrice: 3.80,
        status: 'pending',
        date: new Date('2026-04-29T09:45:00').toISOString(),
        side: 'buy',
      },
      {
        id: 'order_4',
        orderId: 'ORD001005',
        assetType: 'etf',
        symbol: 'SPY',
        name: 'SPDR S&P 500 ETF',
        quantity: 5,
        orderType: 'stop-loss',
        orderPrice: 510.00,
        currentPrice: 523.18,
        status: 'cancelled',
        date: new Date('2026-04-26T11:20:00').toISOString(),
        side: 'sell',
      },
      {
        id: 'order_5',
        orderId: 'ORD001006',
        assetType: 'stock',
        symbol: 'AMD',
        name: 'Advanced Micro Devices',
        quantity: 20,
        orderType: 'market',
        orderPrice: 182.00,
        currentPrice: 179.50,
        status: 'executed',
        date: new Date('2026-04-25T15:55:00').toISOString(),
        side: 'sell',
      },
    ];
  };

  // Filter and sort orders
  const filteredOrders = orders.filter(order => {
    // Tab filter
    if (selectedTab !== 'all' && order.assetType !== selectedTab.slice(0, -1)) return false;

    // Status filter
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;

    // Order type filter
    if (orderTypeFilter !== 'all' && order.orderType !== orderTypeFilter) return false;

    // Search filter
    if (searchQuery && !order.symbol.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !order.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;

    return true;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === 'price') {
      return b.currentPrice - a.currentPrice;
    } else if (sortBy === 'quantity') {
      return b.quantity - a.quantity;
    }
    return 0;
  });

  // Handle select all
  const handleSelectAll = () => {
    if (selectedOrders.size === sortedOrders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(sortedOrders.map(o => o.id)));
    }
  };

  // Handle select order
  const handleSelectOrder = (orderId: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  // Handle bulk sell
  const handleBulkSell = () => {
    if (selectedOrders.size === 0) return;

    if (confirm(`Are you sure you want to sell ${selectedOrders.size} order(s)?`)) {
      // In a real app, this would place sell orders
      alert(`Placed sell orders for ${selectedOrders.size} asset(s)`);
      setSelectedOrders(new Set());
    }
  };

  // Handle buy more
  const handleBuyMore = (order: Order) => {
    setSelectedOrder(order);
    setShowBuyModal(true);
  };

  // Handle sell
  const handleSell = (order: Order) => {
    setSelectedOrder(order);
    setShowSellModal(true);
  };

  // Calculate price change
  const calculatePriceChange = (order: Order) => {
    const change = order.currentPrice - order.orderPrice;
    const changePercent = (change / order.orderPrice) * 100;
    return { change, changePercent };
  };

  // Get status badge color
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'executed': return 'status-positive';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'cancelled': return 'status-negative';
      case 'partially-filled': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default: return 'glass-morphism';
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gradient mb-6">
            Please log in to view your orders
          </h1>
        </div>
      </div>
    );
  }

  const totalOrders = orders.length;
  const executedOrders = orders.filter(o => o.status === 'executed').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalValue = orders.reduce((sum, o) => sum + (o.quantity * o.currentPrice), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gradient gradient-shift">Orders</h1>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-8 p-4 rounded-2xl" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border-color)' }}>
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gradient-primary)' }}>
              <svg className="w-4 h-4" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total Orders</p>
              <p className="text-xl font-bold" style={{ color: 'var(--primary-blue)' }}>{totalOrders}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 border-l" style={{ borderColor: 'var(--glass-border-color)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gradient-accent)' }}>
              <Check className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Executed</p>
              <p className="text-xl font-bold text-green-400">{executedOrders}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 border-l" style={{ borderColor: 'var(--glass-border-color)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #FBBF24, #F59E0B)' }}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Pending</p>
              <p className="text-xl font-bold text-yellow-400">{pendingOrders}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 border-l" style={{ borderColor: 'var(--glass-border-color)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gradient-secondary)' }}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total Value</p>
              <p className="text-xl font-bold" style={{ color: 'var(--primary-purple)' }}>${totalValue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Main Orders Card */}
        <div className="card">
          {/* Tabs */}
          <div className="border-b" style={{ borderColor: 'var(--glass-border-color)' }}>
            <div className="flex items-center gap-2 px-6 pt-6">
              {(['all', 'stocks', 'options', 'etfs'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-6 py-3 rounded-t-lg text-sm font-semibold transition-all duration-200 ${
                    selectedTab === tab
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'glass-morphism'
                  }`}
                  style={selectedTab !== tab ? { color: 'var(--text-secondary)' } : {}}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Filters and Search */}
          <div className="card-header border-b" style={{ borderColor: 'var(--glass-border-color)' }}>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
                <input
                  type="text"
                  placeholder="Search by symbol or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input pl-10 w-full"
                />
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    showFilters ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'glass-morphism'
                  }`}
                  style={!showFilters ? { color: 'var(--text-secondary)' } : {}}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="form-input px-3 py-2"
                >
                  <option value="date">Sort by Date</option>
                  <option value="price">Sort by Price</option>
                  <option value="quantity">Sort by Quantity</option>
                </select>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 p-4 rounded-lg glass-morphism flex flex-wrap gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="form-input px-3 py-2"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="executed">Executed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="partially-filled">Partially Filled</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Order Type</label>
                  <select
                    value={orderTypeFilter}
                    onChange={(e) => setOrderTypeFilter(e.target.value as any)}
                    className="form-input px-3 py-2"
                  >
                    <option value="all">All Types</option>
                    <option value="market">Market</option>
                    <option value="limit">Limit</option>
                    <option value="stop-loss">Stop Loss</option>
                    <option value="stop-limit">Stop Limit</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setOrderTypeFilter('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium glass-morphism hover:bg-red-500/20 transition-all duration-200 flex items-center gap-2 self-end"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Bulk Actions Bar */}
          {selectedOrders.size > 0 && (
            <div className="px-6 py-4 bg-blue-500/10 border-b" style={{ borderColor: 'var(--glass-border-color)' }}>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {selectedOrders.size} order(s) selected
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={handleBulkSell}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold"
                  >
                    Sell Selected
                  </button>
                  <button
                    onClick={() => setSelectedOrders(new Set())}
                    className="glass-morphism px-4 py-2 rounded-lg hover:bg-red-500/20 transition-all duration-200"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Orders Table */}
          <div className="overflow-x-auto">
            {sortedOrders.length > 0 ? (
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="text-left">
                      <input
                        type="checkbox"
                        checked={selectedOrders.size === sortedOrders.length && sortedOrders.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-2"
                        style={{ borderColor: 'var(--primary-blue)' }}
                      />
                    </th>
                    <th className="text-left">Order ID</th>
                    <th className="text-left">Asset / Stock</th>
                    <th className="text-left">Type</th>
                    <th className="text-right">Qty</th>
                    <th className="text-left">Order Type</th>
                    <th className="text-right">Order Price</th>
                    <th className="text-right">Current Price</th>
                    <th className="text-left">Status</th>
                    <th className="text-left">Date</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedOrders.map((order) => {
                    const { change, changePercent } = calculatePriceChange(order);
                    const isPositive = change >= 0;

                    return (
                      <tr key={order.id} className={selectedOrders.has(order.id) ? 'bg-blue-500/5' : ''}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedOrders.has(order.id)}
                            onChange={() => handleSelectOrder(order.id)}
                            className="w-4 h-4 rounded border-2"
                            style={{ borderColor: 'var(--primary-blue)' }}
                          />
                        </td>
                        <td>
                          <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                            {order.orderId}
                          </span>
                        </td>
                        <td>
                          <div>
                              <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                                {order.symbol}
                              </span>
                            <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                              {order.name}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                            order.side === 'buy' ? 'status-positive' : 'status-negative'
                          }`}>
                            {order.side.toUpperCase()}
                          </span>
                        </td>
                        <td className="text-right">
                          <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {order.quantity}
                          </span>
                        </td>
                        <td>
                          <span className="text-sm capitalize px-2 py-1 rounded glass-morphism" style={{ color: 'var(--text-secondary)' }}>
                            {order.orderType.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="text-right">
                          <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                            ${order.orderPrice.toFixed(2)}
                          </span>
                        </td>
                        <td className="text-right">
                          <div className="text-base font-bold" style={{ color: 'var(--text-accent)' }}>
                            ${order.currentPrice.toFixed(2)}
                          </div>
                          <div className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
                          </div>
                        </td>
                        <td>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                            {order.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {new Date(order.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {new Date(order.date).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleBuyMore(order)}
                              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 text-xs font-semibold"
                            >
                              Buy More
                            </button>
                            <button
                              onClick={() => handleSell(order)}
                              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 text-xs font-semibold"
                            >
                              Sell
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="card-body text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-secondary)' }}>
                  <svg className="w-10 h-10" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  No orders found
                </p>
                <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>
                  {searchQuery || statusFilter !== 'all' || orderTypeFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Start trading to see your orders here!'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Buy More Modal */}
      {showBuyModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card max-w-md w-full">
            <div className="card-header border-b" style={{ borderColor: 'var(--glass-border-color)' }}>
              <h3 className="text-2xl font-bold text-gradient">Buy More {selectedOrder.symbol}</h3>
            </div>
            <div className="card-body">
              <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                Repeat order for {selectedOrder.name}
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Current Price:</span>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>${selectedOrder.currentPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Previous Quantity:</span>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{selectedOrder.quantity}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    alert(`Placed buy order for ${selectedOrder.quantity} shares of ${selectedOrder.symbol}`);
                    setShowBuyModal(false);
                  }}
                  className="btn-primary flex-1"
                >
                  Confirm Purchase
                </button>
                <button
                  onClick={() => setShowBuyModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
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
              <h3 className="text-2xl font-bold text-gradient">Sell {selectedOrder.symbol}</h3>
            </div>
            <div className="card-body">
              <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                Place sell order for {selectedOrder.name}
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Current Price:</span>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>${selectedOrder.currentPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Quantity:</span>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{selectedOrder.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Estimated Total:</span>
                  <span className="font-bold text-green-400">${(selectedOrder.quantity * selectedOrder.currentPrice).toFixed(2)}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    alert(`Placed sell order for ${selectedOrder.quantity} shares of ${selectedOrder.symbol}`);
                    setShowSellModal(false);
                  }}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold flex-1"
                >
                  Confirm Sale
                </button>
                <button
                  onClick={() => setShowSellModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
