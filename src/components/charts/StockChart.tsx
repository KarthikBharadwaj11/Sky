'use client';

import { useState, useEffect, useCallback } from 'react';
import { LineChart, BarChart3, TrendingUp, Settings, Eye, EyeOff, Plus, Minus, Maximize, Minimize, Volume2, Activity, BarChart, X, Brain, Sparkles, ThumbsUp, ThumbsDown, TrendingDown, Bell } from 'lucide-react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Brush, Area, Cell } from 'recharts';

interface ChartData {
  date: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma20?: number;
  sma50?: number;
  vwap?: number;
  obv?: number;
  stoch?: number;
  williams?: number;
  rsi?: number;
  ema12?: number;
  ema26?: number;
  macd?: number;
  macdSignal?: number;
  macdHistogram?: number;
  bb_upper?: number;
  bb_middle?: number;
  bb_lower?: number;
  atr?: number;
  adx?: number;
}

interface StockChartProps {
  symbol: string;
  timeRange: '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';
}

interface Indicator {
  key: string;
  name: string;
  color: string;
  enabled: boolean;
  type: 'line' | 'area' | 'bar';
  category: 'trend' | 'momentum' | 'volume' | 'volatility';
}

interface SupportResistance {
  id: string;
  level: number;
  type: 'support' | 'resistance' | 'stop_loss';
  color: string;
  enabled: boolean;
}

interface PriceAlert {
  id: string;
  level: number;
  type: 'above' | 'below';
  color: string;
  enabled: boolean;
}

interface AnalyticsData {
  priceChange24h: number;
  priceChangePercent24h: number;
  volatility: number;
  avgVolume: number;
  marketCap: string;
  avgTrueRange: number;
  relativeStrength: number;
  momentum: number;
  trendStrength: number;
}

// Custom Candlestick component
const CustomCandlestick = ({ payload, x, y, width, height }: any) => {
  if (!payload) return null;
  
  const { open, high, low, close } = payload;
  const isPositive = close > open;
  const color = isPositive ? '#10b981' : '#ef4444';
  
  // Calculate candlestick dimensions
  const bodyHeight = Math.abs((close - open) * height / (high - low));
  const bodyY = Math.min(open, close) * height / (high - low);
  const wickWidth = Math.max(1, width * 0.1);
  const bodyWidth = Math.max(2, width * 0.8);
  
  return (
    <g>
      {/* High-Low Wick */}
      <line
        x1={x + width / 2}
        y1={y}
        x2={x + width / 2}
        y2={y + height}
        stroke={color}
        strokeWidth={wickWidth}
      />
      {/* Body */}
      <rect
        x={x + (width - bodyWidth) / 2}
        y={y + bodyY}
        width={bodyWidth}
        height={Math.max(1, bodyHeight)}
        fill={color}
        fillOpacity={isPositive ? 0.8 : 1}
        stroke={color}
        strokeWidth={0.5}
      />
    </g>
  );
};

export default function StockChart({ symbol, timeRange }: StockChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [showIndicatorPanel, setShowIndicatorPanel] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVolumeChart, setShowVolumeChart] = useState(false);
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState<'overview' | 'technical' | 'volume' | 'volatility'>('overview');
  const [mainTab, setMainTab] = useState<'analytics' | 'compare' | 'ai-news'>('analytics');

  // Auto-determine chart type based on timeframe
  const chartType = ['1m', '5m', '15m', '30m', '1h', '4h'].includes(timeRange) ? 'candlestick' : 'line';
  const showAreaChart = ['1D', '1W', '1M'].includes(timeRange);

  const [indicators, setIndicators] = useState<Indicator[]>([
    // Trend Indicators
    { key: 'ema12', name: 'EMA 12', color: '#10b981', enabled: false, type: 'line', category: 'trend' },
    { key: 'ema26', name: 'EMA 26', color: '#f59e0b', enabled: false, type: 'line', category: 'trend' },
    { key: 'sma20', name: 'SMA 20', color: '#3b82f6', enabled: false, type: 'line', category: 'trend' },
    { key: 'sma50', name: 'SMA 50', color: '#8b5cf6', enabled: false, type: 'line', category: 'trend' },
    { key: 'bb', name: 'Bollinger Bands', color: '#ef4444', enabled: false, type: 'area', category: 'volatility' },
    { key: 'vwap', name: 'VWAP', color: '#06b6d4', enabled: false, type: 'line', category: 'volume' },
    
    // Momentum Indicators
    { key: 'rsi', name: 'RSI', color: '#8b5cf6', enabled: false, type: 'line', category: 'momentum' },
    { key: 'macd', name: 'MACD', color: '#06b6d4', enabled: false, type: 'line', category: 'momentum' },
    { key: 'stoch', name: 'Stochastic', color: '#f97316', enabled: false, type: 'line', category: 'momentum' },
    { key: 'williams', name: 'Williams %R', color: '#84cc16', enabled: false, type: 'line', category: 'momentum' },
    
    // Volume Indicators
    { key: 'obv', name: 'OBV', color: '#ec4899', enabled: false, type: 'line', category: 'volume' },
    
    // Volatility Indicators
    { key: 'atr', name: 'ATR', color: '#f59e0b', enabled: false, type: 'line', category: 'volatility' },
    { key: 'adx', name: 'ADX', color: '#10b981', enabled: false, type: 'line', category: 'trend' },
  ]);

  const [supportResistanceLines, setSupportResistanceLines] = useState<SupportResistance[]>([]);
  const [showLinesPanel, setShowLinesPanel] = useState(false);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [showPriceAlertsPanel, setShowPriceAlertsPanel] = useState(false);

  // Handle chart fullscreen (overlay mode)
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // Handle escape key for fullscreen
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isFullscreen]);

  useEffect(() => {
    generateMockData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, timeRange]);

  const generateMockData = useCallback(() => {
    const periods = {
      '1m': 1440,    '5m': 2016,    '15m': 2688,   '30m': 2976,
      '1h': 2160,    '4h': 2190,    '1D': 365,     '1W': 260,
      '1M': 120,     '3M': 80,      '6M': 40,      '1Y': 20,     'ALL': 50
    };

    const periodCount = Math.min(periods[timeRange], 500);
    const basePrice = Math.random() * 200 + 50;
    const data: ChartData[] = [];

    const getTimeIncrement = (range: string, index: number) => {
      const now = new Date();
      const multipliers = {
        '1m': 60 * 1000, '5m': 5 * 60 * 1000, '15m': 15 * 60 * 1000, '30m': 30 * 60 * 1000,
        '1h': 60 * 60 * 1000, '4h': 4 * 60 * 60 * 1000, '1D': 24 * 60 * 60 * 1000,
        '1W': 7 * 24 * 60 * 60 * 1000, '1M': 30 * 24 * 60 * 60 * 1000,
        '3M': 90 * 24 * 60 * 60 * 1000, '6M': 180 * 24 * 60 * 60 * 1000,
        '1Y': 365 * 24 * 60 * 60 * 1000, 'ALL': 24 * 60 * 60 * 1000
      };
      return new Date(now.getTime() - (periodCount - index) * (multipliers[range] || multipliers['1D']));
    };

    for (let i = 0; i < periodCount; i++) {
      const date = getTimeIncrement(timeRange, i);
      const prevClose = i === 0 ? basePrice : data[i - 1].close;
      const volatility = ['1m', '5m', '15m'].includes(timeRange) ? 0.005 : 0.02;
      const trend = (Math.random() - 0.5) * 0.01;
      
      const open = prevClose * (1 + (Math.random() - 0.5) * volatility * 0.5);
      const close = open * (1 + trend + (Math.random() - 0.5) * volatility);
      const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5);
      const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5);
      const volume = Math.floor(Math.random() * 50000000 + 5000000);

      data.push({
        date: date.toISOString(),
        timestamp: date.getTime(),
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume
      });
    }

    const dataWithIndicators = calculateAdvancedIndicators(data);
    setChartData(dataWithIndicators);
    setAnalytics(calculateAnalytics(dataWithIndicators));
    
    // Add default stop loss line based on current price (5% below current price)
    if (dataWithIndicators.length > 0) {
      const currentPrice = dataWithIndicators[dataWithIndicators.length - 1].close;
      const stopLossLevel = currentPrice * 0.95; // 5% below current price
      
      setSupportResistanceLines(prev => {
        // Remove existing stop loss line
        const withoutStopLoss = prev.filter(line => line.id !== 'default-stop-loss');
        // Add new stop loss line
        return [...withoutStopLoss, {
          id: 'default-stop-loss',
          level: stopLossLevel,
          type: 'stop_loss',
          color: '#d97706', // More subtle orange-yellow color
          label: 'Stop Loss'
        }];
      });
    }
  }, [timeRange]);

  const calculateAdvancedIndicators = (data: ChartData[]): ChartData[] => {
    const result = [...data];

    // Simple Moving Averages
    const calculateSMA = (prices: number[], period: number) => {
      return prices.map((_, index) => {
        if (index < period - 1) return undefined;
        const slice = prices.slice(index - period + 1, index + 1);
        return slice.reduce((sum, price) => sum + price, 0) / period;
      });
    };

    // Exponential Moving Averages
    const calculateEMA = (prices: number[], period: number) => {
      const multiplier = 2 / (period + 1);
      const emaValues: (number | undefined)[] = [];
      emaValues[0] = prices[0];
      for (let i = 1; i < prices.length; i++) {
        emaValues[i] = (prices[i] * multiplier) + ((emaValues[i - 1] || 0) * (1 - multiplier));
      }
      return emaValues;
    };

    // RSI
    const calculateRSI = (prices: number[], period: number = 14) => {
      const rsiValues: (number | undefined)[] = [];
      if (prices.length < period) return rsiValues;

      let gains = 0, losses = 0;
      for (let i = 1; i <= period; i++) {
        const change = prices[i] - prices[i - 1];
        if (change > 0) gains += change;
        else losses -= change;
      }

      let avgGain = gains / period;
      let avgLoss = losses / period;
      rsiValues[period] = 100 - (100 / (1 + avgGain / avgLoss));

      for (let i = period + 1; i < prices.length; i++) {
        const change = prices[i] - prices[i - 1];
        const gain = change > 0 ? change : 0;
        const loss = change < 0 ? -change : 0;
        avgGain = (avgGain * (period - 1) + gain) / period;
        avgLoss = (avgLoss * (period - 1) + loss) / period;
        rsiValues[i] = 100 - (100 / (1 + avgGain / avgLoss));
      }
      return rsiValues;
    };

    // Bollinger Bands
    const calculateBollingerBands = (prices: number[], period: number = 20, multiplier: number = 2) => {
      const bands: { upper: number | undefined; middle: number | undefined; lower: number | undefined }[] = [];
      for (let i = 0; i < prices.length; i++) {
        if (i < period - 1) {
          bands.push({ upper: undefined, middle: undefined, lower: undefined });
          continue;
        }
        const slice = prices.slice(i - period + 1, i + 1);
        const mean = slice.reduce((sum, price) => sum + price, 0) / period;
        const variance = slice.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / period;
        const stdDev = Math.sqrt(variance);
        bands.push({
          upper: mean + (stdDev * multiplier),
          middle: mean,
          lower: mean - (stdDev * multiplier)
        });
      }
      return bands;
    };

    // VWAP (Volume Weighted Average Price)
    const calculateVWAP = (data: ChartData[]) => {
      let cumulativeVolume = 0;
      let cumulativePriceVolume = 0;
      return data.map(candle => {
        const typicalPrice = (candle.high + candle.low + candle.close) / 3;
        cumulativePriceVolume += typicalPrice * candle.volume;
        cumulativeVolume += candle.volume;
        return cumulativeVolume > 0 ? cumulativePriceVolume / cumulativeVolume : undefined;
      });
    };

    const closePrices = result.map(d => d.close);
    const sma20 = calculateSMA(closePrices, 20);
    const sma50 = calculateSMA(closePrices, 50);
    const ema12 = calculateEMA(closePrices, 12);
    const ema26 = calculateEMA(closePrices, 26);
    const rsi = calculateRSI(closePrices, 14);
    const bollingerBands = calculateBollingerBands(closePrices, 20, 2);
    const vwap = calculateVWAP(result);

    // MACD calculation
    const macdLine: (number | undefined)[] = [];
    const macdSignal: (number | undefined)[] = [];
    const macdHistogram: (number | undefined)[] = [];

    for (let i = 0; i < result.length; i++) {
      if (ema12[i] !== undefined && ema26[i] !== undefined) {
        macdLine[i] = ema12[i]! - ema26[i]!;
      }
    }

    const signalEMA = calculateEMA(macdLine.filter(v => v !== undefined) as number[], 9);
    let signalIndex = 0;
    for (let i = 0; i < macdLine.length; i++) {
      if (macdLine[i] !== undefined) {
        macdSignal[i] = signalEMA[signalIndex];
        if (macdSignal[i] !== undefined && macdLine[i] !== undefined) {
          macdHistogram[i] = macdLine[i]! - macdSignal[i]!;
        }
        signalIndex++;
      }
    }

    // Apply all indicators to result
    for (let i = 0; i < result.length; i++) {
      result[i].sma20 = sma20[i] ? Number(sma20[i]!.toFixed(2)) : undefined;
      result[i].sma50 = sma50[i] ? Number(sma50[i]!.toFixed(2)) : undefined;
      result[i].ema12 = ema12[i] ? Number(ema12[i]!.toFixed(2)) : undefined;
      result[i].ema26 = ema26[i] ? Number(ema26[i]!.toFixed(2)) : undefined;
      result[i].rsi = rsi[i] ? Number(rsi[i]!.toFixed(2)) : undefined;
      result[i].macd = macdLine[i] ? Number(macdLine[i]!.toFixed(4)) : undefined;
      result[i].macdSignal = macdSignal[i] ? Number(macdSignal[i]!.toFixed(4)) : undefined;
      result[i].macdHistogram = macdHistogram[i] ? Number(macdHistogram[i]!.toFixed(4)) : undefined;
      result[i].bb_upper = bollingerBands[i].upper ? Number(bollingerBands[i].upper!.toFixed(2)) : undefined;
      result[i].bb_middle = bollingerBands[i].middle ? Number(bollingerBands[i].middle!.toFixed(2)) : undefined;
      result[i].bb_lower = bollingerBands[i].lower ? Number(bollingerBands[i].lower!.toFixed(2)) : undefined;
      result[i].vwap = vwap[i] ? Number(vwap[i]!.toFixed(2)) : undefined;
    }

    return result;
  };

  const calculateAnalytics = (data: ChartData[]): AnalyticsData => {
    if (data.length < 2) {
      return {
        priceChange24h: 0, priceChangePercent24h: 0, volatility: 0, avgVolume: 0,
        marketCap: '0', avgTrueRange: 0, relativeStrength: 50, momentum: 0, trendStrength: 0
      };
    }

    const latest = data[data.length - 1];
    const previous = data[data.length - 2];
    const priceChange24h = latest.close - previous.close;
    const priceChangePercent24h = (priceChange24h / previous.close) * 100;

    const prices = data.map(d => d.close);
    const returns = prices.slice(1).map((price, i) => Math.log(price / prices[i]));
    const volatility = Math.sqrt(returns.reduce((sum, ret) => sum + ret * ret, 0) / returns.length) * Math.sqrt(252) * 100;

    const avgVolume = data.reduce((sum, d) => sum + d.volume, 0) / data.length;
    const marketCap = `${(latest.close * 1000000000 / 1000000000).toFixed(1)}B`;

    const rsiValues = data.map(d => d.rsi).filter(Boolean) as number[];
    const relativeStrength = rsiValues.length > 0 ? rsiValues[rsiValues.length - 1] : 50;

    const momentum = data.length >= 10 ? 
      ((latest.close - data[data.length - 10].close) / data[data.length - 10].close) * 100 : 0;

    const sma20Values = data.map(d => d.sma20).filter(Boolean) as number[];
    const trendStrength = sma20Values.length > 0 && latest.sma20 ? 
      ((latest.close - latest.sma20) / latest.sma20) * 100 : 0;

    return {
      priceChange24h, priceChangePercent24h, volatility, avgVolume,
      marketCap, avgTrueRange: 0, relativeStrength, momentum, trendStrength
    };
  };

  const toggleIndicator = (key: string) => {
    setIndicators(prev => 
      prev.map(indicator => 
        indicator.key === key 
          ? { ...indicator, enabled: !indicator.enabled }
          : indicator
      )
    );
  };

  const addSupportResistanceLine = (type: 'support' | 'resistance' | 'stop_loss') => {
    if (chartData.length === 0) return;
    const prices = chartData.map(d => d.close);
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const newLine: SupportResistance = {
      id: Date.now().toString(),
      level: Number(avgPrice.toFixed(2)),
      type,
      color: type === 'support' ? '#10b981' : type === 'resistance' ? '#ef4444' : '#f59e0b',
      enabled: true
    };
    setSupportResistanceLines(prev => [...prev, newLine]);
  };

  const removeLine = (id: string) => {
    setSupportResistanceLines(prev => prev.filter(line => line.id !== id));
  };

  const updateLineLevel = (id: string, newLevel: number) => {
    setSupportResistanceLines(prev =>
      prev.map(line => line.id === id ? { ...line, level: newLevel } : line)
    );
  };

  const addPriceAlert = (type: 'above' | 'below') => {
    if (chartData.length === 0) return;
    const currentPrice = chartData[chartData.length - 1].close;
    const alertLevel = type === 'above' ? currentPrice * 1.05 : currentPrice * 0.95;
    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      level: Number(alertLevel.toFixed(2)),
      type,
      color: type === 'above' ? '#3b82f6' : '#a855f7',
      enabled: true
    };
    setPriceAlerts(prev => [...prev, newAlert]);
  };

  const removePriceAlert = (id: string) => {
    setPriceAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const updateAlertLevel = (id: string, newLevel: number) => {
    setPriceAlerts(prev =>
      prev.map(alert => alert.id === id ? { ...alert, level: newLevel } : alert)
    );
  };

  const formatXAxisLabel = (tickItem: string) => {
    const date = new Date(tickItem);
    if (['1m', '5m', '15m', '30m'].includes(timeRange)) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (['1h', '4h'].includes(timeRange)) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + 
             date.toLocaleTimeString([], { hour: '2-digit' });
    } else if (['1D', '1W'].includes(timeRange)) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString([], { year: 'numeric', month: 'short' });
    }
  };

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { payload: ChartData }[]; label?: string }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-morphism p-4 rounded-lg border border-white/20 max-w-xs">
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            {new Date(label!).toLocaleString()}
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div>Open: <span className="font-medium">${data.open}</span></div>
            <div>High: <span className="font-medium text-green-400">${data.high}</span></div>
            <div>Low: <span className="font-medium text-red-400">${data.low}</span></div>
            <div>Close: <span className="font-medium">${data.close}</span></div>
            <div className="col-span-2">Volume: <span className="font-medium">{data.volume?.toLocaleString()}</span></div>
            
            {indicators.find(i => i.key === 'rsi')?.enabled && data.rsi && (
              <div className="col-span-2">RSI: <span className="font-medium" style={{ color: '#8b5cf6' }}>{data.rsi}</span></div>
            )}
            {indicators.find(i => i.key === 'vwap')?.enabled && data.vwap && (
              <div className="col-span-2">VWAP: <span className="font-medium" style={{ color: '#06b6d4' }}>${data.vwap}</span></div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const getIndicatorsByCategory = (category: string) => 
    indicators.filter(indicator => indicator.category === category);

  const getEnabledIndicators = () => indicators.filter(indicator => indicator.enabled);

  const renderAnalyticsPanel = () => {
    if (!analytics) return null;

    const tabs = [
      { key: 'overview', label: 'Overview', icon: Activity },
      { key: 'technical', label: 'Technical', icon: TrendingUp },
      { key: 'volume', label: 'Volume', icon: Volume2 },
      { key: 'volatility', label: 'Volatility', icon: BarChart }
    ];

    return (
      <div className="card">
        <div className="card-body">
          <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Advanced Analytics
          </h4>
          
          {/* Analytics Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveAnalyticsTab(tab.key as any)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeAnalyticsTab === tab.key ? 'btn-primary' : 'glass-morphism hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Analytics Content */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {activeAnalyticsTab === 'overview' && (
              <>
                <div className="glass-morphism p-3 rounded-lg">
                  <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>24h Change</div>
                  <div className={`font-semibold text-sm ${analytics.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {analytics.priceChange24h >= 0 ? '+' : ''}${analytics.priceChange24h.toFixed(2)}
                  </div>
                  <div className={`text-xs ${analytics.priceChangePercent24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {analytics.priceChangePercent24h >= 0 ? '+' : ''}{analytics.priceChangePercent24h.toFixed(2)}%
                  </div>
                </div>
                <div className="glass-morphism p-3 rounded-lg">
                  <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Market Cap</div>
                  <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {analytics.marketCap}
                  </div>
                </div>
                <div className="glass-morphism p-3 rounded-lg">
                  <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Momentum</div>
                  <div className={`font-semibold text-sm ${analytics.momentum >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {analytics.momentum >= 0 ? '+' : ''}{analytics.momentum.toFixed(1)}%
                  </div>
                </div>
                <div className="glass-morphism p-3 rounded-lg">
                  <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Trend</div>
                  <div className={`font-semibold text-sm ${analytics.trendStrength >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {analytics.trendStrength >= 0 ? '+' : ''}{analytics.trendStrength.toFixed(1)}%
                  </div>
                </div>
              </>
            )}

            {activeAnalyticsTab === 'technical' && (
              <>
                <div className="glass-morphism p-3 rounded-lg">
                  <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>RSI</div>
                  <div className={`font-semibold text-sm ${
                    analytics.relativeStrength > 70 ? 'text-red-400' : 
                    analytics.relativeStrength < 30 ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {analytics.relativeStrength.toFixed(1)}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {analytics.relativeStrength > 70 ? 'Overbought' : 
                     analytics.relativeStrength < 30 ? 'Oversold' : 'Neutral'}
                  </div>
                </div>
                {chartData.length > 0 && chartData[chartData.length - 1].macd && (
                  <div className="glass-morphism p-3 rounded-lg">
                    <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>MACD</div>
                    <div className={`font-semibold text-sm ${
                      chartData[chartData.length - 1].macd! >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {chartData[chartData.length - 1].macd!.toFixed(4)}
                    </div>
                  </div>
                )}
                <div className="glass-morphism p-3 rounded-lg">
                  <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Chart Type</div>
                  <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {chartType === 'candlestick' ? '🕯️ Candles' : showAreaChart ? '📈 Area' : '📊 Line'}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Auto ({timeRange})
                  </div>
                </div>
              </>
            )}

            {activeAnalyticsTab === 'volume' && (
              <>
                <div className="glass-morphism p-3 rounded-lg">
                  <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Avg Volume</div>
                  <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {(analytics.avgVolume / 1000000).toFixed(1)}M
                  </div>
                </div>
                <div className="glass-morphism p-3 rounded-lg">
                  <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Current Volume</div>
                  <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {chartData.length > 0 ? (chartData[chartData.length - 1].volume / 1000000).toFixed(1) : '0'}M
                  </div>
                </div>
                {chartData.length > 0 && chartData[chartData.length - 1].vwap && (
                  <div className="glass-morphism p-3 rounded-lg">
                    <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>VWAP</div>
                    <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                      ${chartData[chartData.length - 1].vwap!.toFixed(2)}
                    </div>
                  </div>
                )}
              </>
            )}

            {activeAnalyticsTab === 'volatility' && (
              <>
                <div className="glass-morphism p-3 rounded-lg">
                  <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Volatility</div>
                  <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {analytics.volatility.toFixed(1)}%
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {analytics.volatility > 30 ? 'High' : analytics.volatility > 15 ? 'Med' : 'Low'}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Get responsive chart height
  const getChartHeight = () => {
    if (isFullscreen) return 'calc(100vh - 300px)';
    return '600px';
  };

  return (
    <>
      {/* Normal view */}
      {!isFullscreen && (
        <div className="w-full space-y-4">
          {/* Main Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMainTab('analytics')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                mainTab === 'analytics'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Advanced Analytics
            </button>
            <button
              onClick={() => setMainTab('compare')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                mainTab === 'compare'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Compare Stocks
            </button>
            <button
              onClick={() => setMainTab('ai-news')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                mainTab === 'ai-news'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              AI News
            </button>
          </div>

          {/* Analytics Panel */}
          {mainTab === 'analytics' && renderAnalyticsPanel()}

          {/* Compare Stocks Panel */}
          {mainTab === 'compare' && (
            <div className="card">
              <div className="card-body">
                <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Compare Stocks
                </h4>
                <div className="text-center py-12">
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Compare {symbol} with other stocks
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AI News Panel */}
          {mainTab === 'ai-news' && (
            <div className="space-y-6">
              {/* AI Sentiment Summary */}
              <div className="card">
                <div className="card-body p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-6 h-6 text-purple-400" />
                    <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      AI Sentiment Analysis
                    </h3>
                  </div>

                  {/* Overall Sentiment */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                      <ThumbsUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-400">68%</div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Positive</div>
                    </div>
                    <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(148, 163, 184, 0.1)', border: '1px solid rgba(148, 163, 184, 0.3)' }}>
                      <Minus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-400">22%</div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Neutral</div>
                    </div>
                    <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                      <ThumbsDown className="w-8 h-8 text-red-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-red-400">10%</div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Negative</div>
                    </div>
                  </div>

                  {/* AI Summary */}
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-2 text-purple-400">AI Summary</h4>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          Market sentiment for {symbol} is predominantly bullish with strong positive momentum driven by recent earnings beat and product announcements. Analyst upgrades and institutional buying activity support continued upward trajectory. Watch for potential resistance near $950 level.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* News with Analytics */}
              <div className="card">
                <div className="card-body p-6">
                  <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Recent News & Analysis
                  </h3>

                  <div className="space-y-4">
                    {/* News Item 1 */}
                    <div className="p-4 rounded-lg hover:bg-white/5 transition-all cursor-pointer" style={{ background: 'var(--glass-bg)' }}>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h4 className="font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>
                          {symbol} Reports Strong Quarterly Earnings, Beats Expectations
                        </h4>
                        <div className="flex items-center gap-1 px-2 py-1 rounded" style={{ background: 'rgba(34, 197, 94, 0.2)' }}>
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="text-xs font-semibold text-green-400">Bullish</span>
                        </div>
                      </div>
                      <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                        Company exceeds analyst expectations with revenue growth of 15% year-over-year, driven by strong demand in AI and data center segments.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          <span>MarketWatch</span>
                          <span>•</span>
                          <span>2 hours ago</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                            Impact: <span className="font-semibold text-green-400">+2.3%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* News Item 2 */}
                    <div className="p-4 rounded-lg hover:bg-white/5 transition-all cursor-pointer" style={{ background: 'var(--glass-bg)' }}>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h4 className="font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>
                          Major Investment Banks Raise {symbol} Price Target
                        </h4>
                        <div className="flex items-center gap-1 px-2 py-1 rounded" style={{ background: 'rgba(34, 197, 94, 0.2)' }}>
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="text-xs font-semibold text-green-400">Bullish</span>
                        </div>
                      </div>
                      <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                        Leading analysts upgrade price targets citing strong market position, innovation pipeline, and favorable industry tailwinds.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          <span>Bloomberg</span>
                          <span>•</span>
                          <span>5 hours ago</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                            Impact: <span className="font-semibold text-green-400">+1.8%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* News Item 3 */}
                    <div className="p-4 rounded-lg hover:bg-white/5 transition-all cursor-pointer" style={{ background: 'var(--glass-bg)' }}>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h4 className="font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>
                          {symbol} Announces Strategic Partnership Expansion
                        </h4>
                        <div className="flex items-center gap-1 px-2 py-1 rounded" style={{ background: 'rgba(148, 163, 184, 0.2)' }}>
                          <Minus className="w-4 h-4 text-gray-400" />
                          <span className="text-xs font-semibold text-gray-400">Neutral</span>
                        </div>
                      </div>
                      <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                        Company expands partnerships in cloud infrastructure, positioning for long-term growth in enterprise markets.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          <span>Reuters</span>
                          <span>•</span>
                          <span>8 hours ago</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                            Impact: <span className="font-semibold text-gray-400">+0.5%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* News Item 4 */}
                    <div className="p-4 rounded-lg hover:bg-white/5 transition-all cursor-pointer" style={{ background: 'var(--glass-bg)' }}>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h4 className="font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>
                          Regulatory Concerns Raised Over Market Dominance
                        </h4>
                        <div className="flex items-center gap-1 px-2 py-1 rounded" style={{ background: 'rgba(239, 68, 68, 0.2)' }}>
                          <TrendingDown className="w-4 h-4 text-red-400" />
                          <span className="text-xs font-semibold text-red-400">Bearish</span>
                        </div>
                      </div>
                      <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                        Government agencies examining competitive practices, though analysts view regulatory risk as manageable in near term.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          <span>CNBC</span>
                          <span>•</span>
                          <span>1 day ago</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                            Impact: <span className="font-semibold text-red-400">-0.8%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="card">
                <div className="card-body p-6">
                  <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    News Activity Metrics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl" style={{ background: 'var(--glass-bg)' }}>
                      <div className="text-sm mb-1" style={{ color: 'var(--text-tertiary)' }}>Articles (24h)</div>
                      <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>47</div>
                      <div className="text-xs text-green-400">+23% vs avg</div>
                    </div>
                    <div className="p-4 rounded-xl" style={{ background: 'var(--glass-bg)' }}>
                      <div className="text-sm mb-1" style={{ color: 'var(--text-tertiary)' }}>Social Mentions</div>
                      <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>12.4K</div>
                      <div className="text-xs text-green-400">+45% vs avg</div>
                    </div>
                    <div className="p-4 rounded-xl" style={{ background: 'var(--glass-bg)' }}>
                      <div className="text-sm mb-1" style={{ color: 'var(--text-tertiary)' }}>Analyst Ratings</div>
                      <div className="text-2xl font-bold text-green-400">Buy</div>
                      <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>15 Buy, 3 Hold, 1 Sell</div>
                    </div>
                    <div className="p-4 rounded-xl" style={{ background: 'var(--glass-bg)' }}>
                      <div className="text-sm mb-1" style={{ color: 'var(--text-tertiary)' }}>Price Target</div>
                      <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>$985</div>
                      <div className="text-xs text-green-400">+12.5% upside</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Chart */}
          <div className="card">
            <div className="card-body">
              {/* Header with Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {symbol} ({timeRange}) {chartType === 'candlestick' && <span className="text-sm text-yellow-400">🕯️</span>}
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowVolumeChart(!showVolumeChart)}
                    className={`px-3 py-2 rounded-lg transition-all duration-300 text-xs font-medium ${
                      showVolumeChart ? 'btn-primary' : 'glass-morphism hover:bg-white/10'
                    }`}
                    title="Toggle Volume"
                  >
                    Volume
                  </button>

                  <button
                    onClick={() => setShowIndicatorPanel(!showIndicatorPanel)}
                    className={`px-3 py-2 rounded-lg transition-all duration-300 text-xs font-medium ${
                      showIndicatorPanel ? 'btn-primary' : 'glass-morphism hover:bg-white/10'
                    }`}
                    title="Indicators"
                  >
                    Indicators
                  </button>

                  <button
                    onClick={() => setShowLinesPanel(!showLinesPanel)}
                    className={`px-3 py-2 rounded-lg transition-all duration-300 text-xs font-medium ${
                      showLinesPanel ? 'btn-primary' : 'glass-morphism hover:bg-white/10'
                    }`}
                    title="Lines"
                  >
                    Lines
                  </button>

                  <button
                    onClick={() => setShowPriceAlertsPanel(!showPriceAlertsPanel)}
                    className={`px-3 py-2 rounded-lg transition-all duration-300 text-xs font-medium ${
                      showPriceAlertsPanel ? 'btn-primary' : 'glass-morphism hover:bg-white/10'
                    }`}
                    title="Set Price Alerts"
                  >
                    Price Alerts
                  </button>
                </div>
              </div>

              {/* Indicator Panel */}
              {showIndicatorPanel && (
                <div className="glass-morphism rounded-lg p-3 mb-4">
                  <h4 className="text-base font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Technical Indicators
                  </h4>
                  
                  {/* Horizontal scrollable indicator list */}
                  <div className="flex flex-wrap gap-2">
                    {indicators.map((indicator) => (
                      <button
                        key={indicator.key}
                        onClick={() => toggleIndicator(indicator.key)}
                        className={`px-3 py-1.5 rounded-full transition-all duration-200 text-xs font-medium border ${
                          indicator.enabled 
                            ? 'bg-white/20 border-white/30 text-white' 
                            : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                        }`}
                        style={{ 
                          borderColor: indicator.enabled ? indicator.color : undefined,
                          boxShadow: indicator.enabled ? `0 0 8px ${indicator.color}20` : undefined 
                        }}
                      >
                        <div className="flex items-center gap-1.5">
                          <div 
                            className={`w-2 h-2 rounded-full ${indicator.enabled ? 'opacity-100' : 'opacity-40'}`}
                            style={{ backgroundColor: indicator.color }}
                          />
                          <span>{indicator.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Support/Resistance Lines Panel */}
              {showLinesPanel && (
                <div className="glass-morphism rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Trading Lines
                    </h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addSupportResistanceLine('support')}
                        className="glass-morphism p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                        title="Support"
                      >
                        <Plus className="w-4 h-4 text-green-400" />
                      </button>
                      <button
                        onClick={() => addSupportResistanceLine('resistance')}
                        className="glass-morphism p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                        title="Resistance"
                      >
                        <Plus className="w-4 h-4 text-red-400" />
                      </button>
                      <button
                        onClick={() => addSupportResistanceLine('stop_loss')}
                        className="glass-morphism p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                        title="Stop Loss"
                      >
                        <Plus className="w-4 h-4 text-yellow-400" />
                      </button>
                    </div>
                  </div>

                  {supportResistanceLines.length > 0 && (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {supportResistanceLines.map((line) => (
                        <div key={line.id} className="flex items-center justify-between p-2 glass-morphism rounded-lg">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: line.color }}
                            />
                            <span className="text-sm capitalize" style={{ color: 'var(--text-secondary)' }}>
                              {line.type.replace('_', ' ')}
                            </span>
                            <input
                              type="number"
                              value={line.level}
                              onChange={(e) => updateLineLevel(line.id, parseFloat(e.target.value) || 0)}
                              className="w-20 px-2 py-1 text-xs bg-white/10 border border-white/20 rounded text-center"
                              style={{ color: 'var(--text-primary)' }}
                              step="0.01"
                            />
                          </div>
                          <button
                            onClick={() => removeLine(line.id)}
                            className="p-1 hover:bg-red-500/20 rounded transition-all duration-300"
                          >
                            <Minus className="w-3 h-3 text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Price Alerts Panel */}
              {showPriceAlertsPanel && (
                <div className="glass-morphism rounded-xl p-4 mb-4" style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-blue-400" />
                      <h4 className="text-lg font-semibold text-blue-400">
                        Price Alerts
                      </h4>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addPriceAlert('above')}
                        className="glass-morphism px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all duration-300 text-xs font-medium"
                        title="Alert when price goes above"
                      >
                        <div className="flex items-center gap-1.5">
                          <Plus className="w-3 h-3 text-blue-400" />
                          <span className="text-blue-400">Above</span>
                        </div>
                      </button>
                      <button
                        onClick={() => addPriceAlert('below')}
                        className="glass-morphism px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all duration-300 text-xs font-medium"
                        title="Alert when price goes below"
                      >
                        <div className="flex items-center gap-1.5">
                          <Plus className="w-3 h-3 text-purple-400" />
                          <span className="text-purple-400">Below</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {priceAlerts.length > 0 ? (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {priceAlerts.map((alert) => (
                        <div key={alert.id} className="flex items-center justify-between p-2 glass-morphism rounded-lg">
                          <div className="flex items-center gap-3">
                            <Bell
                              className="w-3.5 h-3.5"
                              style={{ color: alert.color }}
                            />
                            <span className="text-sm capitalize" style={{ color: 'var(--text-secondary)' }}>
                              {alert.type === 'above' ? '↑ Above' : '↓ Below'}
                            </span>
                            <input
                              type="number"
                              value={alert.level}
                              onChange={(e) => updateAlertLevel(alert.id, parseFloat(e.target.value) || 0)}
                              className="w-20 px-2 py-1 text-xs bg-white/10 border border-white/20 rounded text-center"
                              style={{ color: 'var(--text-primary)' }}
                              step="0.01"
                            />
                          </div>
                          <button
                            onClick={() => removePriceAlert(alert.id)}
                            className="p-1 hover:bg-red-500/20 rounded transition-all duration-300"
                          >
                            <X className="w-3 h-3 text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        No price alerts set. Click above to add alerts.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Chart Display */}
              <div 
                className="glass-morphism rounded-xl p-2 sm:p-4 mb-4" 
                style={{ height: getChartHeight() }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart 
                    data={chartData} 
                    margin={{ top: 20, right: 60, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                      tickFormatter={formatXAxisLabel}
                      interval="preserveStartEnd"
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                      domain={['dataMin - 1', 'dataMax + 1']}
                      axisLine={false}
                      tickLine={false}
                      width={60}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    
                    {/* Support/Resistance Lines */}
                    {supportResistanceLines.map((line) => (
                      <ReferenceLine
                        key={line.id}
                        y={line.level}
                        stroke={line.color}
                        strokeDasharray="5 5"
                        strokeWidth={2}
                        label={{
                          value: `$${line.level}`,
                          position: 'topRight',
                          style: { fontSize: '10px', fill: line.color }
                        }}
                      />
                    ))}

                    {/* Price Alerts */}
                    {priceAlerts.map((alert) => (
                      <ReferenceLine
                        key={alert.id}
                        y={alert.level}
                        stroke={alert.color}
                        strokeDasharray="3 3"
                        strokeWidth={2}
                        label={{
                          value: `🔔 $${alert.level}`,
                          position: 'topLeft',
                          style: { fontSize: '10px', fill: alert.color, fontWeight: 'bold' }
                        }}
                      />
                    ))}

                    {/* Price Chart - Auto-switches based on timeframe */}
                    {chartType === 'candlestick' ? (
                      <>
                        {/* Candlestick representation using bars */}
                        <Bar dataKey="high" fill="transparent" />
                        <Bar dataKey="low" fill="transparent" />
                        <Bar dataKey="open" fill="transparent" />
                        <Bar dataKey="close" fill="transparent" />
                      </>
                    ) : showAreaChart ? (
                      <Area 
                        type="monotone" 
                        dataKey="close" 
                        stroke="#22d3ee" 
                        fill="url(#colorPrice)" 
                        strokeWidth={2}
                        name="Price"
                      />
                    ) : (
                      <Line 
                        type="monotone" 
                        dataKey="close" 
                        stroke="#22d3ee" 
                        strokeWidth={2}
                        dot={false}
                        name="Price"
                      />
                    )}

                    {/* Bollinger Bands */}
                    {indicators.find(i => i.key === 'bb')?.enabled && (
                      <>
                        <Line type="monotone" dataKey="bb_upper" stroke="#ef4444" strokeWidth={1} strokeDasharray="3 3" dot={false} name="BB Upper" />
                        <Line type="monotone" dataKey="bb_middle" stroke="#6b7280" strokeWidth={1} dot={false} name="BB Middle" />
                        <Line type="monotone" dataKey="bb_lower" stroke="#ef4444" strokeWidth={1} strokeDasharray="3 3" dot={false} name="BB Lower" />
                      </>
                    )}

                    {/* Moving Averages */}
                    {indicators.find(i => i.key === 'sma20')?.enabled && <Line type="monotone" dataKey="sma20" stroke="#f97316" strokeWidth={1} dot={false} name="SMA 20" />}
                    {indicators.find(i => i.key === 'sma50')?.enabled && <Line type="monotone" dataKey="sma50" stroke="#8b5cf6" strokeWidth={1} dot={false} name="SMA 50" />}
                    {indicators.find(i => i.key === 'ema12')?.enabled && <Line type="monotone" dataKey="ema12" stroke="#10b981" strokeWidth={1} dot={false} name="EMA 12" />}
                    {indicators.find(i => i.key === 'ema26')?.enabled && <Line type="monotone" dataKey="ema26" stroke="#f59e0b" strokeWidth={1} dot={false} name="EMA 26" />}
                    {indicators.find(i => i.key === 'vwap')?.enabled && <Line type="monotone" dataKey="vwap" stroke="#06b6d4" strokeWidth={2} dot={false} name="VWAP" />}

                    {/* Gradients */}
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                      </linearGradient>
                    </defs>

                    {/* Zoom Brush - Non-interactive */}
                    <Brush
                      dataKey="date"
                      height={30}
                      stroke="#22d3ee"
                      tickFormatter={formatXAxisLabel}
                      onChange={() => {}}
                      style={{ pointerEvents: 'none', opacity: 0.5 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Volume Chart */}
              {showVolumeChart && (
                <div className="glass-morphism rounded-xl p-2 sm:p-4 mb-4" style={{ height: '150px' }}>
                  <h5 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Volume
                  </h5>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                        tickFormatter={formatXAxisLabel}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip />
                      <Bar dataKey="volume" opacity={0.6} name="Volume">
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.close > entry.open ? '#10b981' : '#ef4444'} />
                        ))}
                      </Bar>
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* RSI Chart */}
              {indicators.find(i => i.key === 'rsi')?.enabled && (
                <div className="glass-morphism rounded-xl p-2 sm:p-4 mb-4" style={{ height: '150px' }}>
                  <h5 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    RSI
                  </h5>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickFormatter={formatXAxisLabel} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="2 2" />
                      <ReferenceLine y={30} stroke="#10b981" strokeDasharray="2 2" />
                      <Line type="monotone" dataKey="rsi" stroke="#8b5cf6" strokeWidth={2} dot={false} name="RSI" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* MACD Chart */}
              {indicators.find(i => i.key === 'macd')?.enabled && (
                <div className="glass-morphism rounded-xl p-2 sm:p-4 mb-4" style={{ height: '150px' }}>
                  <h5 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    MACD
                  </h5>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickFormatter={formatXAxisLabel} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="2 2" />
                      <Bar dataKey="macdHistogram" fill="#06b6d4" opacity={0.6} name="Histogram" />
                      <Line type="monotone" dataKey="macd" stroke="#06b6d4" strokeWidth={2} dot={false} name="MACD" />
                      <Line type="monotone" dataKey="macdSignal" stroke="#f59e0b" strokeWidth={1} dot={false} name="Signal" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Active Indicators Summary */}
          {getEnabledIndicators().length > 0 && (
            <div className="card">
              <div className="card-body">
                <h4 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                  Active Indicators
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-sm">
                  {getEnabledIndicators().map((indicator) => {
                    const latestData = chartData[chartData.length - 1];
                    let value = 'N/A';
                    
                    if (latestData) {
                      const dataKey = indicator.key as keyof ChartData;
                      const rawValue = latestData[dataKey];
                      if (typeof rawValue === 'number') {
                        value = ['volume', 'obv'].includes(indicator.key) ? 
                          `${(rawValue / 1000000).toFixed(1)}M` : 
                          indicator.key.includes('bb') || ['sma20', 'sma50', 'ema12', 'ema26', 'vwap'].includes(indicator.key) ? 
                          `$${rawValue.toFixed(2)}` : 
                          rawValue.toFixed(2);
                      }
                    }

                    return (
                      <div key={indicator.key} className="glass-morphism p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: indicator.color }} />
                          <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                            {indicator.name}
                          </span>
                        </div>
                        <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fullscreen Chart Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
          <div className="h-full flex flex-col p-6">
            {/* Fullscreen Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {symbol} Advanced Chart ({timeRange}) {chartType === 'candlestick' && <span className="text-sm text-yellow-400">🕯️</span>}
              </h2>
              
              <div className="flex items-center gap-4">
                {/* Quick Analytics */}
                {analytics && (
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span style={{ color: 'var(--text-muted)' }}>24h:</span>
                      <span className={`font-semibold ${analytics.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {analytics.priceChange24h >= 0 ? '+' : ''}${analytics.priceChange24h.toFixed(2)} ({analytics.priceChangePercent24h.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ color: 'var(--text-muted)' }}>RSI:</span>
                      <span className={`font-semibold ${
                        analytics.relativeStrength > 70 ? 'text-red-400' : 
                        analytics.relativeStrength < 30 ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {analytics.relativeStrength.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ color: 'var(--text-muted)' }}>Vol:</span>
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {chartData.length > 0 ? (chartData[chartData.length - 1].volume / 1000000).toFixed(1) : '0'}M
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={toggleFullscreen}
                  className="btn-primary p-3 rounded-lg"
                  title="Exit Chart Fullscreen"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Fullscreen Chart */}
            <div className="flex-1 glass-morphism rounded-xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart 
                  data={chartData} 
                  margin={{ top: 20, right: 80, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                    tickFormatter={formatXAxisLabel}
                    interval="preserveStartEnd"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                    domain={['dataMin - 1', 'dataMax + 1']}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  {/* Support/Resistance Lines */}
                  {supportResistanceLines.map((line) => (
                    <ReferenceLine
                      key={line.id}
                      y={line.level}
                      stroke={line.color}
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      label={{
                        value: `$${line.level}`,
                        position: 'topRight',
                        style: { fontSize: '12px', fill: line.color }
                      }}
                    />
                  ))}

                  {/* Price Alerts */}
                  {priceAlerts.map((alert) => (
                    <ReferenceLine
                      key={alert.id}
                      y={alert.level}
                      stroke={alert.color}
                      strokeDasharray="3 3"
                      strokeWidth={2}
                      label={{
                        value: `🔔 $${alert.level}`,
                        position: 'topLeft',
                        style: { fontSize: '12px', fill: alert.color, fontWeight: 'bold' }
                      }}
                    />
                  ))}

                  {/* Price Chart - Auto-switches based on timeframe */}
                  {chartType === 'candlestick' ? (
                    <>
                      <Bar dataKey="high" fill="transparent" />
                      <Bar dataKey="low" fill="transparent" />
                      <Bar dataKey="open" fill="transparent" />
                      <Bar dataKey="close" fill="transparent" />
                    </>
                  ) : showAreaChart ? (
                    <Area 
                      type="monotone" 
                      dataKey="close" 
                      stroke="#22d3ee" 
                      fill="url(#colorPriceFS)" 
                      strokeWidth={3}
                      name="Price"
                    />
                  ) : (
                    <Line 
                      type="monotone" 
                      dataKey="close" 
                      stroke="#22d3ee" 
                      strokeWidth={3}
                      dot={false}
                      name="Price"
                    />
                  )}

                  {/* Indicators */}
                  {indicators.find(i => i.key === 'bb')?.enabled && (
                    <>
                      <Line type="monotone" dataKey="bb_upper" stroke="#ef4444" strokeWidth={1} strokeDasharray="3 3" dot={false} name="BB Upper" />
                      <Line type="monotone" dataKey="bb_middle" stroke="#6b7280" strokeWidth={1} dot={false} name="BB Middle" />
                      <Line type="monotone" dataKey="bb_lower" stroke="#ef4444" strokeWidth={1} strokeDasharray="3 3" dot={false} name="BB Lower" />
                    </>
                  )}
                  {indicators.find(i => i.key === 'sma20')?.enabled && <Line type="monotone" dataKey="sma20" stroke="#f97316" strokeWidth={2} dot={false} name="SMA 20" />}
                  {indicators.find(i => i.key === 'sma50')?.enabled && <Line type="monotone" dataKey="sma50" stroke="#8b5cf6" strokeWidth={2} dot={false} name="SMA 50" />}
                  {indicators.find(i => i.key === 'ema12')?.enabled && <Line type="monotone" dataKey="ema12" stroke="#10b981" strokeWidth={2} dot={false} name="EMA 12" />}
                  {indicators.find(i => i.key === 'ema26')?.enabled && <Line type="monotone" dataKey="ema26" stroke="#f59e0b" strokeWidth={2} dot={false} name="EMA 26" />}
                  {indicators.find(i => i.key === 'vwap')?.enabled && <Line type="monotone" dataKey="vwap" stroke="#06b6d4" strokeWidth={3} dot={false} name="VWAP" />}

                  {/* Gradients for fullscreen */}
                  <defs>
                    <linearGradient id="colorPriceFS" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                    </linearGradient>
                  </defs>

                  {/* Enhanced Zoom Brush for fullscreen - Non-interactive */}
                  <Brush
                    dataKey="date"
                    height={40}
                    stroke="#22d3ee"
                    tickFormatter={formatXAxisLabel}
                    onChange={() => {}}
                    style={{ pointerEvents: 'none', opacity: 0.5 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
