'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { TrendingUp, TrendingDown, ArrowLeft, Clock, BarChart3, DollarSign, Activity, TrendingUpIcon, Users, Sparkles } from 'lucide-react';
import TradingModal from '@/components/trading/TradingModal';
import StockChart from '@/components/charts/StockChart';
import OptionsChain from '@/components/options/OptionsChain';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  dayHigh: number;
  dayLow: number;
  yearHigh: number;
  yearLow: number;
  pe: number;
  eps: number;
  dividend: number;
  avgVolume: number;
  beta: number;
  previousClose: number;
  open: number;
}

export default function StockPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { user } = useAuth();
  const router = useRouter();
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL'>('1D');
  const [symbol, setSymbol] = useState<string>('');
  const [tradingMode, setTradingMode] = useState<'stock' | 'options'>('stock');

  // Order form state
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop' | 'stop-limit'>('market');
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState<string>('');
  const [limitPrice, setLimitPrice] = useState<string>('');
  const [stopPrice, setStopPrice] = useState<string>('');
  const [timeInForce, setTimeInForce] = useState<'day' | 'gtc'>('day');
  const [isStopLoss, setIsStopLoss] = useState(false);
  const [takeProfitPrice, setTakeProfitPrice] = useState<string>('');
  const [addTakeProfit, setAddTakeProfit] = useState(false);

  // Allowed tickers only
  const ALLOWED_TICKERS = ['AAPL', 'NVDA', 'TSLA'];

  useEffect(() => {
    async function loadParams() {
      const resolvedParams = await params;
      const symbolValue = resolvedParams.symbol.toUpperCase();

      // Redirect if not an allowed ticker
      if (!ALLOWED_TICKERS.includes(symbolValue)) {
        router.push('/search');
        return;
      }

      setSymbol(symbolValue);
    }
    loadParams();
  }, [params, router]);

  useEffect(() => {
    if (!symbol) return;

    // Mock stock data for allowed tickers only
    const mockStockData: { [key: string]: StockData } = {
      'AAPL': {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 175.43,
        change: 2.15,
        changePercent: 1.24,
        volume: 45678900,
        marketCap: '2.8T',
        dayHigh: 177.20,
        dayLow: 174.10,
        yearHigh: 198.23,
        yearLow: 124.17,
        pe: 28.5,
        eps: 6.16,
        dividend: 0.96,
        avgVolume: 52340000,
        beta: 1.24,
        previousClose: 173.28,
        open: 174.50
      },
      'TSLA': {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        price: 248.42,
        change: -5.23,
        changePercent: -2.06,
        volume: 67890123,
        marketCap: '789B',
        dayHigh: 252.30,
        dayLow: 245.80,
        yearHigh: 299.29,
        yearLow: 138.80,
        pe: 45.3,
        eps: 5.48,
        dividend: 0.00,
        avgVolume: 89230000,
        beta: 2.01,
        previousClose: 253.65,
        open: 250.10
      },
      'NVDA': {
        symbol: 'NVDA',
        name: 'NVIDIA Corp.',
        price: 875.28,
        change: 15.67,
        changePercent: 1.83,
        volume: 78901234,
        marketCap: '2.2T',
        dayHigh: 882.50,
        dayLow: 869.10,
        yearHigh: 950.02,
        yearLow: 180.96,
        pe: 65.8,
        eps: 13.31,
        dividend: 0.16,
        avgVolume: 45670000,
        beta: 1.68,
        previousClose: 859.61,
        open: 870.25
      }
    };

    const stock = mockStockData[symbol];
    if (stock) {
      setStockData(stock);
    }
  }, [symbol]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gradient mb-5">
            Please log in to view stock details
          </h1>
        </div>
      </div>
    );
  }

  if (!stockData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gradient mb-5">Loading...</h1>
        </div>
      </div>
    );
  }

  const timeRangeOptions = [
    { value: '1D', label: '1D' },
    { value: '1W', label: '1W' },
    { value: '1M', label: '1M' },
    { value: '3M', label: '3M' },
    { value: '6M', label: '6M' },
    { value: '1Y', label: '1Y' },
    { value: 'ALL', label: 'ALL' }
  ];

  const handlePlaceOrder = () => {
    if (!quantity || parseFloat(quantity) <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    // Only validate required fields based on order type
    if (orderType === 'limit' && (!limitPrice || parseFloat(limitPrice) <= 0)) {
      alert('Please enter a valid limit price for limit order');
      return;
    }

    if (orderType === 'stop' && (!stopPrice || parseFloat(stopPrice) <= 0)) {
      alert('Please enter a valid stop price for stop order');
      return;
    }

    if (orderType === 'stop-limit') {
      if (!limitPrice || parseFloat(limitPrice) <= 0) {
        alert('Please enter a valid limit price for stop-limit order');
        return;
      }
      if (!stopPrice || parseFloat(stopPrice) <= 0) {
        alert('Please enter a valid stop price for stop-limit order');
        return;
      }
    }

    // Create order object
    const order = {
      symbol: stockData?.symbol,
      side: orderSide,
      type: orderType,
      quantity: parseFloat(quantity),
      limitPrice: limitPrice ? parseFloat(limitPrice) : null,
      stopPrice: stopPrice ? parseFloat(stopPrice) : null,
      timeInForce: timeInForce,
      isStopLoss: isStopLoss,
      takeProfitPrice: addTakeProfit && takeProfitPrice ? parseFloat(takeProfitPrice) : null,
      timestamp: new Date().toISOString()
    };

    console.log('Order placed:', order);
    alert(`${orderSide.toUpperCase()} order placed for ${quantity} shares of ${stockData?.symbol}`);

    // Reset form
    setQuantity('');
    setLimitPrice('');
    setStopPrice('');
    setTakeProfitPrice('');
    setAddTakeProfit(false);
    setIsStopLoss(false);
  };

  return (
    <div className="min-h-screen trading-background">
      <div className="max-w-[95%] mx-auto px-6 py-6 pt-24">
        {/* Header - Back Arrow and Title */}
        <div className="absolute top-24 left-6">
          <button
            onClick={() => router.back()}
            className="glass-morphism p-2.5 rounded-lg hover:scale-110 transition-all duration-300"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-1">
                {stockData.symbol}
              </h1>
              <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
                {stockData.name}
              </p>
            </div>

            {/* Stock/Options Toggle */}
            <div className="flex items-center gap-2 bg-black/30 p-1.5 rounded-xl">
              <button
                onClick={() => setTradingMode('stock')}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  tradingMode === 'stock'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'hover:bg-white/5'
                }`}
                style={tradingMode !== 'stock' ? { color: 'var(--text-tertiary)' } : {}}
              >
                Stock
              </button>
              <button
                onClick={() => setTradingMode('options')}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  tradingMode === 'options'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'hover:bg-white/5'
                }`}
                style={tradingMode !== 'options' ? { color: 'var(--text-tertiary)' } : {}}
              >
                Options
              </button>
            </div>
          </div>
        </div>

        {/* Main Layout - Chart Left/Center, Stats Right */}
        <div className="grid grid-cols-12 gap-6">
          {/* Main Chart Section - Left/Center (Highlight) */}
          <div className="col-span-12 lg:col-span-9">
            <div className="card">
              <div className="card-body p-6">
                {/* Price Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        ${stockData.price.toFixed(2)}
                      </div>

                      {/* Timeframe Selector - Far Right */}
                      <div className="flex items-center gap-1.5 bg-black/30 p-1.5 rounded-xl">
                        {timeRangeOptions.map((range) => (
                          <button
                            key={range.value}
                            onClick={() => setTimeRange(range.value as typeof timeRange)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                              timeRange === range.value
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                : 'hover:bg-white/5'
                            }`}
                            style={timeRange !== range.value ? { color: 'var(--text-tertiary)' } : {}}
                          >
                            {range.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className={`text-xl font-semibold flex items-center gap-2 ${
                      stockData.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {stockData.change >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                      {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)} ({stockData.changePercent.toFixed(2)}%)
                    </div>
                    <div className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>
                      <Clock className="w-4 h-4 inline mr-1" />
                      Last updated: {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="mb-6">
                  <StockChart symbol={symbol} timeRange={timeRange} />
                </div>

                {/* Technical Indicators */}
                <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Open</div>
                    <div className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>${stockData.open.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Prev Close</div>
                    <div className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>${stockData.previousClose.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Day Range</div>
                    <div className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                      ${stockData.dayLow.toFixed(2)} - ${stockData.dayHigh.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Volume</div>
                    <div className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                      {(stockData.volume / 1000000).toFixed(1)}M
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Options Chain - Shows when Options mode is selected */}
            {tradingMode === 'options' && (
              <div className="mt-6">
                <OptionsChain symbol={symbol} />
              </div>
            )}

            {/* Additional Statistics - Bottom */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="card">
                <div className="card-body p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>52W Range</div>
                      <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                        ${stockData.yearLow} - ${stockData.yearHigh}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                      <TrendingUpIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Avg Volume</div>
                      <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                        {(stockData.avgVolume / 1000000).toFixed(1)}M
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Beta</div>
                      <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                        {stockData.beta.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Key Statistics */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            {/* Order Entry Panel */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-bold text-gradient">Place Order</h3>
              </div>
              <div className="card-body">
                {/* Buy/Sell Toggle */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setOrderSide('buy')}
                    className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
                      orderSide === 'buy'
                        ? 'bg-green-600 text-white'
                        : 'glass-morphism text-gray-400 hover:text-white'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setOrderSide('sell')}
                    className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
                      orderSide === 'sell'
                        ? 'bg-red-600 text-white'
                        : 'glass-morphism text-gray-400 hover:text-white'
                    }`}
                  >
                    Sell
                  </button>
                </div>

                {/* Order Type */}
                <div className="mb-4">
                  <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-tertiary)' }}>
                    Order Type
                  </label>
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg glass-morphism border border-white/10 text-sm focus:outline-none focus:border-blue-500"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <option value="market">Market</option>
                    <option value="limit">Limit</option>
                    <option value="stop">Stop</option>
                    <option value="stop-limit">Stop Limit</option>
                  </select>
                </div>

                {/* Quantity */}
                <div className="mb-4">
                  <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-tertiary)' }}>
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="1"
                    className="w-full p-2.5 rounded-lg glass-morphism border border-white/10 text-sm focus:outline-none focus:border-blue-500"
                    style={{ color: 'var(--text-primary)' }}
                  />
                </div>

                {/* Limit Price */}
                <div className="mb-4">
                  <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-tertiary)' }}>
                    Limit Price {(orderType === 'market' || orderType === 'stop') && '(optional)'}
                  </label>
                  <input
                    type="number"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full p-2.5 rounded-lg glass-morphism border border-white/10 text-sm focus:outline-none focus:border-blue-500"
                    style={{ color: 'var(--text-primary)' }}
                  />
                </div>

                {/* Stop Price */}
                <div className="mb-4">
                  <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-tertiary)' }}>
                    Stop Price {(orderType === 'market' || orderType === 'limit') && '(optional)'}
                  </label>
                  <input
                    type="number"
                    value={stopPrice}
                    onChange={(e) => setStopPrice(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full p-2.5 rounded-lg glass-morphism border border-white/10 text-sm focus:outline-none focus:border-blue-500"
                    style={{ color: 'var(--text-primary)' }}
                  />
                </div>

                {/* Time in Force */}
                <div className="mb-4">
                  <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-tertiary)' }}>
                    Time in Force
                  </label>
                  <select
                    value={timeInForce}
                    onChange={(e) => setTimeInForce(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg glass-morphism border border-white/10 text-sm focus:outline-none focus:border-blue-500"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <option value="day">Day</option>
                    <option value="gtc">Good Till Canceled (GTC)</option>
                  </select>
                </div>

                {/* Stop Loss Checkbox */}
                <div className="mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isStopLoss}
                      onChange={(e) => setIsStopLoss(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Stop Loss Order
                    </span>
                  </label>
                </div>

                {/* Take Profit */}
                <div className="mb-4">
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      checked={addTakeProfit}
                      onChange={(e) => setAddTakeProfit(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Add Take Profit
                    </span>
                  </label>
                  {addTakeProfit && (
                    <input
                      type="number"
                      value={takeProfitPrice}
                      onChange={(e) => setTakeProfitPrice(e.target.value)}
                      placeholder="Take Profit Price"
                      min="0"
                      step="0.01"
                      className="w-full p-2.5 rounded-lg glass-morphism border border-white/10 text-sm focus:outline-none focus:border-blue-500"
                      style={{ color: 'var(--text-primary)' }}
                    />
                  )}
                </div>

                {/* Order Summary */}
                {quantity && parseFloat(quantity) > 0 && (
                  <div className="mb-4 p-3 rounded-lg glass-morphism border border-white/10">
                    <div className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>Order Summary</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: 'var(--text-secondary)' }}>Quantity:</span>
                        <span style={{ color: 'var(--text-primary)' }}>{quantity} shares</span>
                      </div>
                      {(orderType === 'limit' || orderType === 'market') && stockData && (
                        <div className="flex justify-between text-sm">
                          <span style={{ color: 'var(--text-secondary)' }}>Est. Total:</span>
                          <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                            ${(parseFloat(quantity) * (limitPrice ? parseFloat(limitPrice) : stockData.price)).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    orderSide === 'buy'
                      ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                      : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                  } text-white shadow-lg`}
                >
                  {orderSide === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
                </button>
              </div>
            </div>

            {/* AI Price Prediction */}
            <div className="card" style={{ background: 'rgba(168, 85, 247, 0.05)', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
              <div className="card-header">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-bold text-purple-400">AI Price Forecast</h3>
                </div>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>1 Week Target</span>
                    <span className="text-base font-bold text-green-400">${(stockData.price * 1.03).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>1 Month Target</span>
                    <span className="text-base font-bold text-green-400">${(stockData.price * 1.08).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Confidence</span>
                    <span className="text-sm font-semibold text-purple-400">72%</span>
                  </div>
                  <div className="mt-3 p-2 rounded" style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      AI analysis based on technical indicators, sentiment, and historical patterns
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-bold text-gradient">Key Statistics</h3>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-white/10">
                    <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Market Cap</span>
                    <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{stockData.marketCap}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/10">
                    <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>P/E Ratio</span>
                    <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{stockData.pe}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/10">
                    <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>EPS (TTM)</span>
                    <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>${stockData.eps}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/10">
                    <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Dividend Yield</span>
                    <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                      {stockData.dividend > 0 ? `${stockData.dividend}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Beta (5Y)</span>
                    <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{stockData.beta.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-bold text-gradient">Performance</h3>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Today</span>
                      <span className={`text-sm font-bold ${stockData.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stockData.changePercent >= 0 ? '+' : ''}{stockData.changePercent.toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${stockData.changePercent >= 0 ? 'bg-green-400' : 'bg-red-400'}`}
                        style={{ width: `${Math.min(Math.abs(stockData.changePercent) * 20, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Week</span>
                      <span className="text-sm font-bold text-green-400">+3.2%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="h-2 rounded-full bg-green-400" style={{ width: '64%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Month</span>
                      <span className="text-sm font-bold text-green-400">+8.7%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="h-2 rounded-full bg-green-400" style={{ width: '87%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Year</span>
                      <span className="text-sm font-bold text-green-400">+42.3%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="h-2 rounded-full bg-green-400" style={{ width: '100%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trading Modal */}
      {showTradeModal && stockData && (
        <TradingModal
          stock={{
            symbol: stockData.symbol,
            name: stockData.name,
            price: stockData.price,
            change: stockData.change,
            changePercent: stockData.changePercent
          }}
          onClose={() => setShowTradeModal(false)}
        />
      )}
    </div>
  );
}
