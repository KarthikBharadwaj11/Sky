'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, TrendingUp, TrendingDown, Plus, X, MousePointer2, AlignJustify, ArrowUpRight, Pencil, Type, Ruler, GitFork, Activity, Search, Sparkles, Send } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';

// ── Static demo OHLC chart data ─────────────────────────────────────────────
const DEMO_DATA = [
  { time: '9:30',  open: 185.90, high: 186.75, low: 185.30, close: 186.20 },
  { time: '9:35',  open: 186.25, high: 187.20, low: 186.10, close: 186.85 },
  { time: '9:40',  open: 186.90, high: 187.60, low: 186.70, close: 187.30 },
  { time: '9:45',  open: 187.35, high: 187.50, low: 186.80, close: 187.10 },
  { time: '9:50',  open: 187.05, high: 187.30, low: 186.40, close: 186.75 },
  { time: '9:55',  open: 186.80, high: 187.50, low: 186.60, close: 187.20 },
  { time: '10:00', open: 187.25, high: 188.10, low: 187.10, close: 187.80 },
  { time: '10:05', open: 187.85, high: 188.40, low: 187.70, close: 188.10 },
  { time: '10:10', open: 188.15, high: 188.30, low: 187.50, close: 187.90 },
  { time: '10:15', open: 187.95, high: 188.10, low: 187.20, close: 187.50 },
  { time: '10:20', open: 187.55, high: 187.80, low: 186.90, close: 187.20 },
  { time: '10:25', open: 187.25, high: 187.40, low: 186.60, close: 186.90 },
  { time: '10:30', open: 186.85, high: 186.90, low: 186.10, close: 186.50 },
  { time: '10:35', open: 186.45, high: 186.60, low: 185.80, close: 186.20 },
  { time: '10:40', open: 186.15, high: 186.30, low: 185.40, close: 185.80 },
  { time: '10:45', open: 185.75, high: 185.90, low: 185.00, close: 185.40 },
  { time: '10:50', open: 185.45, high: 186.10, low: 185.30, close: 185.70 },
  { time: '10:55', open: 185.75, high: 186.40, low: 185.60, close: 186.10 },
  { time: '11:00', open: 186.15, high: 186.70, low: 186.00, close: 186.40 },
  { time: '11:05', open: 186.45, high: 187.10, low: 186.30, close: 186.80 },
  { time: '11:10', open: 186.85, high: 187.50, low: 186.70, close: 187.20 },
  { time: '11:15', open: 187.25, high: 187.90, low: 187.10, close: 187.60 },
  { time: '11:20', open: 187.65, high: 188.30, low: 187.50, close: 188.00 },
  { time: '11:25', open: 188.05, high: 188.60, low: 187.90, close: 188.35 },
  { time: '11:30', open: 188.30, high: 188.50, low: 187.70, close: 188.10 },
  { time: '11:35', open: 188.05, high: 188.20, low: 187.40, close: 187.80 },
  { time: '11:40', open: 187.75, high: 187.90, low: 187.10, close: 187.50 },
  { time: '11:45', open: 187.45, high: 187.60, low: 186.80, close: 187.20 },
  { time: '11:50', open: 187.15, high: 187.30, low: 186.50, close: 186.90 },
  { time: '11:55', open: 186.95, high: 187.40, low: 186.80, close: 187.10 },
  { time: '12:00', open: 187.15, high: 187.70, low: 187.00, close: 187.40 },
  { time: '12:05', open: 187.45, high: 188.00, low: 187.30, close: 187.70 },
  { time: '12:10', open: 187.75, high: 188.30, low: 187.60, close: 188.00 },
  { time: '12:15', open: 188.05, high: 188.60, low: 187.90, close: 188.30 },
  { time: '12:20', open: 188.35, high: 188.90, low: 188.20, close: 188.60 },
  { time: '12:25', open: 188.55, high: 188.80, low: 188.00, close: 188.40 },
  { time: '12:30', open: 188.35, high: 188.50, low: 187.70, close: 188.10 },
  { time: '12:35', open: 188.05, high: 188.20, low: 187.40, close: 187.80 },
  { time: '12:40', open: 187.85, high: 188.30, low: 187.70, close: 188.00 },
  { time: '12:45', open: 188.05, high: 188.60, low: 187.90, close: 188.30 },
  { time: '13:00', open: 188.35, high: 188.90, low: 188.20, close: 188.60 },
  { time: '13:05', open: 188.65, high: 189.20, low: 188.50, close: 188.90 },
  { time: '13:10', open: 188.95, high: 189.50, low: 188.80, close: 189.20 },
  { time: '13:15', open: 189.25, high: 189.80, low: 189.10, close: 189.50 },
  { time: '13:20', open: 189.45, high: 189.70, low: 188.90, close: 189.30 },
  { time: '13:25', open: 189.25, high: 189.40, low: 188.60, close: 189.00 },
  { time: '13:30', open: 189.05, high: 189.50, low: 188.90, close: 189.20 },
  { time: '13:35', open: 189.25, high: 189.80, low: 189.10, close: 189.50 },
  { time: '13:40', open: 189.55, high: 190.10, low: 189.40, close: 189.80 },
  { time: '13:45', open: 189.75, high: 189.95, low: 189.20, close: 189.60 },
  { time: '13:50', open: 189.55, high: 189.75, low: 189.00, close: 189.40 },
  { time: '13:55', open: 189.35, high: 189.55, low: 188.80, close: 189.20 },
  { time: '14:00', open: 189.25, high: 189.80, low: 189.10, close: 189.50 },
  { time: '14:05', open: 189.55, high: 190.00, low: 189.40, close: 189.70 },
  { time: '14:10', open: 189.75, high: 190.30, low: 189.60, close: 190.00 },
  { time: '14:15', open: 189.95, high: 190.15, low: 189.40, close: 189.80 },
  { time: '14:20', open: 189.75, high: 189.90, low: 189.10, close: 189.50 },
  { time: '14:25', open: 189.45, high: 189.65, low: 188.90, close: 189.30 },
  { time: '14:30', open: 189.25, high: 189.45, low: 188.70, close: 189.10 },
  { time: '14:35', open: 189.05, high: 189.20, low: 188.50, close: 188.90 },
  { time: '14:40', open: 188.95, high: 189.40, low: 188.80, close: 189.10 },
  { time: '14:45', open: 189.15, high: 189.60, low: 189.00, close: 189.30 },
  { time: '14:50', open: 189.35, high: 189.80, low: 189.20, close: 189.50 },
  { time: '14:55', open: 189.55, high: 190.00, low: 189.40, close: 189.70 },
  { time: '15:00', open: 189.75, high: 190.30, low: 189.60, close: 190.00 },
  { time: '15:05', open: 189.95, high: 190.15, low: 189.40, close: 189.80 },
  { time: '15:10', open: 189.75, high: 189.95, low: 189.20, close: 189.60 },
  { time: '15:15', open: 189.55, high: 189.75, low: 189.00, close: 189.40 },
  { time: '15:20', open: 189.35, high: 189.55, low: 188.80, close: 189.20 },
  { time: '15:25', open: 189.25, high: 189.80, low: 189.10, close: 189.50 },
  { time: '15:30', open: 189.55, high: 190.00, low: 189.40, close: 189.70 },
  { time: '15:35', open: 189.75, high: 190.30, low: 189.60, close: 190.00 },
  { time: '15:40', open: 189.95, high: 190.15, low: 189.40, close: 189.80 },
  { time: '15:45', open: 189.75, high: 189.95, low: 189.20, close: 189.60 },
  { time: '15:50', open: 189.55, high: 189.75, low: 189.00, close: 189.40 },
  { time: '15:55', open: 189.35, high: 189.55, low: 188.80, close: 189.20 },
  { time: '16:00', open: 189.25, high: 189.50, low: 189.00, close: 189.30 },
];

// ── Custom SVG candlestick chart ─────────────────────────────────────────────
interface OHLCPoint { time: string; open: number; high: number; low: number; close: number; }

function CandlestickChart({ data, width = 600, height = 400 }: { data: OHLCPoint[]; width?: number; height?: number }) {
  const pad = { top: 12, right: 62, bottom: 28, left: 8 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;

  const minPrice = Math.min(...data.map(d => d.low));
  const maxPrice = Math.max(...data.map(d => d.high));
  const pricePad = (maxPrice - minPrice) * 0.06;
  const yMin = minPrice - pricePad;
  const yMax = maxPrice + pricePad;
  const yRange = yMax - yMin;

  const toY = (price: number) => pad.top + chartH - ((price - yMin) / yRange) * chartH;
  const spacing = chartW / data.length;
  const barW = Math.max(spacing * 0.6, 2);
  const xInterval = Math.ceil(data.length / 9);
  const yTicks = 6;

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      {/* Grid + Y labels */}
      {Array.from({ length: yTicks }).map((_, i) => {
        const price = yMax - (yRange / (yTicks - 1)) * i;
        const y = toY(price);
        return (
          <g key={i}>
            <line x1={pad.left} y1={y} x2={width - pad.right} y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 3" />
            <text x={width - pad.right + 6} y={y + 4} fontSize={10} fill="rgba(140,150,170,0.8)" fontFamily="monospace">
              {price.toFixed(2)}
            </text>
          </g>
        );
      })}

      {/* Candlesticks */}
      {data.map((d, i) => {
        const cx = pad.left + i * spacing + spacing / 2;
        const isUp = d.close >= d.open;
        const color = isUp ? '#22c55e' : '#ef4444';
        const yHigh = toY(d.high);
        const yLow = toY(d.low);
        const yBodyTop = toY(Math.max(d.open, d.close));
        const yBodyBot = toY(Math.min(d.open, d.close));
        const bodyH = Math.max(yBodyBot - yBodyTop, 1);

        return (
          <g key={i}>
            <line x1={cx} y1={yHigh} x2={cx} y2={yLow} stroke={color} strokeWidth={1} />
            <rect x={cx - barW / 2} y={yBodyTop} width={barW} height={bodyH} fill={color} opacity={0.85} />
            {i % xInterval === 0 && (
              <text x={cx} y={height - 6} fontSize={10} fill="rgba(140,150,170,0.8)" textAnchor="middle" fontFamily="monospace">
                {d.time}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function useContainerSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return size;
}

const INDICATORS = ['MA (20)', 'EMA (9)', 'EMA (21)', 'MACD', 'RSI (14)', 'Bollinger Bands', 'VWAP', 'Volume'];

const CHART_TYPES = ['Candlesticks', 'Heikin Ashi', 'Line', 'Area', 'Bar', 'Hollow Candles'];

const COMPARE_TICKERS = ['SPY', 'QQQ', 'MSFT', 'NVDA', 'BTC'];

const DRAWING_TOOLS = [
  { icon: MousePointer2, label: 'Cursor' },
  { icon: TrendingUp,    label: 'Trend Line' },
  { icon: GitFork,       label: 'Fib Retracement' },
  { icon: ArrowUpRight,  label: 'Long Position' },
  { icon: Pencil,        label: 'Brush' },
  { icon: Type,          label: 'Text' },
  { icon: Ruler,         label: 'Measure' },
  { icon: AlignJustify,  label: 'Price Levels' },
];

const TIMEFRAMES = ['1m', '5m', '15m', '1h', '4h', '1D', '1W'];

const WATCHLIST = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 189.30, change: 1.24, pct: 0.66 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 251.20, change: 3.40, pct: 1.37 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 487.65, change: -4.20, pct: -0.85 },
  { symbol: 'MSFT', name: 'Microsoft', price: 378.92, change: 2.10, pct: 0.56 },
  { symbol: 'AMZN', name: 'Amazon', price: 182.40, change: -1.30, pct: -0.71 },
  { symbol: 'GOOGL', name: 'Alphabet', price: 163.75, change: 0.95, pct: 0.58 },
  { symbol: 'META', name: 'Meta Platforms', price: 492.30, change: 5.60, pct: 1.15 },
  { symbol: 'SPY', name: 'S&P 500 ETF', price: 524.18, change: 1.80, pct: 0.34 },
];

const POSITIONS = [
  { symbol: 'AAPL', qty: 10, avg: 182.50, current: 189.30, pnl: 68.00, pnlPct: 3.73 },
  { symbol: 'TSLA', qty: 5, avg: 248.00, current: 251.20, pnl: 16.00, pnlPct: 1.29 },
  { symbol: 'MSFT', qty: 8, avg: 390.00, current: 378.92, pnl: -88.64, pnlPct: -2.84 },
];

const OPEN_ORDERS = [
  { id: 1, symbol: 'NVDA', side: 'Buy', qty: 2, type: 'Limit', price: 475.00, status: 'Pending' },
  { id: 2, symbol: 'AMZN', side: 'Sell', qty: 3, type: 'Limit', price: 185.00, status: 'Pending' },
];

const SIGNALS = [
  { id: 1, expert: 'Expert 1', symbol: 'AAPL', action: 'BUY' as const, qty: 10, price: 189.30, orderType: 'market', time: '2m ago' },
  { id: 2, expert: 'Expert 2', symbol: 'NVDA', action: 'SELL' as const, qty: 5, price: 490.00, orderType: 'limit', time: '18m ago' },
  { id: 3, expert: 'Expert 3', symbol: 'TSLA', action: 'BUY' as const, qty: 8, price: 250.00, orderType: 'market', time: '34m ago' },
  { id: 4, expert: 'Expert 1', symbol: 'META', action: 'BUY' as const, qty: 3, price: 490.50, orderType: 'limit', time: '1h ago' },
];


export default function TradingTerminal() {
  const { user } = useAuth();
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [timeframe, setTimeframe] = useState('5m');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [qty, setQty] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [activeTab, setActiveTab] = useState<'positions' | 'orders'>('positions');
  const [showIndicators, setShowIndicators] = useState(false);
  const [showChartTypes, setShowChartTypes] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [compareSearch, setCompareSearch] = useState('');

  const closeDropdowns = () => { setShowIndicators(false); setShowChartTypes(false); setShowCompare(false); setShowAccountMenu(false); };

  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('Demo Account');
  const [rightPanel, setRightPanel] = useState<'watchlist' | 'signals'>('watchlist');
  const [showSkyIntel, setShowSkyIntel] = useState(false);
  const [intelInput, setIntelInput] = useState('');
  const ACCOUNTS = ['Demo Account', 'Trading Account'];

  const chartRef = useRef<HTMLDivElement>(null);
  const { width: chartW, height: chartH } = useContainerSize(chartRef);

  const currentStock = WATCHLIST.find(s => s.symbol === selectedSymbol) || WATCHLIST[0];
  const priceUp = currentStock.change >= 0;

  return (
    <div className="flex flex-col overflow-hidden" style={{ height: '100vh', background: '#080c14' }}>

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-6 px-4 border-b shrink-0" style={{ height: '48px', borderColor: 'var(--glass-border-color)', background: 'var(--navbar-bg, rgba(10,10,20,0.95))' }}>
        {/* Symbol selector */}
        <div className="flex items-center gap-2">
          <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{selectedSymbol}</span>
          <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>${currentStock.price.toFixed(2)}</span>
          <span className={`text-sm font-semibold flex items-center gap-1 ${priceUp ? 'text-green-400' : 'text-red-400'}`}>
            {priceUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {priceUp ? '+' : ''}{currentStock.change.toFixed(2)} ({priceUp ? '+' : ''}{currentStock.pct.toFixed(2)}%)
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-5" style={{ background: 'var(--glass-border-color)' }} />

        {/* Market indices */}
        <div className="hidden lg:flex items-center gap-5">
          {[
            { label: 'S&P 500', value: '5,234.18', up: true },
            { label: 'NASDAQ', value: '16,428.82', up: true },
            { label: 'DOW', value: '38,712.21', up: false },
          ].map(idx => (
            <div key={idx.label} className="flex items-center gap-1.5">
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{idx.label}</span>
              <span className={`text-xs font-semibold ${idx.up ? 'text-green-400' : 'text-red-400'}`}>{idx.value}</span>
            </div>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Account stats */}
        <div className="hidden lg:flex items-center gap-5 mr-4">
          {[
            { label: 'Cash Balance', value: `$${user?.balance?.toLocaleString() ?? '—'}`, color: undefined },
            { label: 'Portfolio', value: '$12,847.50', color: undefined },
            { label: 'Day P&L', value: '+$234.56', color: 'text-green-400' },
            { label: 'Open P&L', value: '-$4.64', color: 'text-red-400' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{item.label}</span>
              <span className={`text-sm font-semibold ${item.color ?? ''}`} style={!item.color ? { color: 'var(--text-secondary)' } : {}}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-5 mr-4" style={{ background: 'var(--glass-border-color)' }} />

        {/* Market status */}
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-xs font-semibold text-green-400">Market Open</span>
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Closes in 3h 24m</span>
        </div>

        {/* Divider */}
        <div className="w-px h-5" style={{ background: 'var(--glass-border-color)' }} />

        {/* Account selector */}
        <div className="relative">
          <button
            onClick={() => { setShowAccountMenu(!showAccountMenu); setShowIndicators(false); setShowChartTypes(false); setShowCompare(false); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-white/10"
            style={{ border: '1px solid var(--glass-border-color)', color: 'var(--text-primary)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
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

        {/* Divider */}
        <div className="w-px h-5" style={{ background: 'var(--glass-border-color)' }} />

        {/* Sky Intelligence button */}
        <button
          onClick={() => setShowSkyIntel(!showSkyIntel)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:bg-white/10"
          style={{
            border: `1px solid ${showSkyIntel ? 'rgba(139,92,246,0.6)' : 'var(--glass-border-color)'}`,
            background: showSkyIntel ? 'rgba(139,92,246,0.12)' : 'transparent',
            color: showSkyIntel ? '#a78bfa' : 'var(--text-secondary)',
          }}
        >
          Sky Intelligence
        </button>
      </div>

      {/* ── Main area ───────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Chart area */}
        <div className="flex flex-col flex-1" style={{ minHeight: 0 }}>

          {/* Timeframe toolbar */}
          <div className="flex items-center gap-1 px-4 py-2 border-b shrink-0 relative z-30" style={{ borderColor: 'var(--glass-border-color)' }}>
            {TIMEFRAMES.map(tf => (
              <button
                key={tf}
                onClick={() => { setTimeframe(tf); closeDropdowns(); }}
                className="px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150"
                style={{
                  background: timeframe === tf ? 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(124,58,237,0.25))' : 'transparent',
                  color: timeframe === tf ? 'var(--text-accent)' : 'var(--text-tertiary)',
                  border: timeframe === tf ? '1px solid rgba(124,58,237,0.4)' : '1px solid transparent',
                }}
              >
                {tf}
              </button>
            ))}

            {/* Divider */}
            <div className="w-px h-4 mx-2" style={{ background: 'var(--glass-border-color)' }} />

            {/* Indicators */}
            <div className="relative">
              <button
                onClick={() => { setShowIndicators(!showIndicators); setShowChartTypes(false); setShowCompare(false); }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150 hover:bg-white/10"
                style={{ color: showIndicators ? 'var(--text-accent)' : 'var(--text-tertiary)' }}
              >
                <Activity className="w-3.5 h-3.5" />
                Indicators
                <ChevronDown className="w-3 h-3" style={{ transform: showIndicators ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
              </button>
              {showIndicators && (
                <div className="absolute top-full left-0 mt-1 w-44 rounded-lg overflow-hidden shadow-xl" style={{ background: 'rgba(10,14,26,0.97)', border: '1px solid var(--glass-border-color)', backdropFilter: 'blur(16px)' }}>
                  {INDICATORS.map(ind => (
                    <button key={ind} className="w-full px-3 py-2 text-left text-xs hover:bg-white/10 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                      {ind}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Chart type (candlestick icon) */}
            <div className="relative">
              <button
                onClick={() => { setShowChartTypes(!showChartTypes); setShowIndicators(false); setShowCompare(false); }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150 hover:bg-white/10"
                style={{ color: showChartTypes ? 'var(--text-accent)' : 'var(--text-tertiary)' }}
              >
                {/* Mini candlestick SVG */}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <line x1="2" y1="1" x2="2" y2="13" stroke="currentColor" strokeWidth="0.8" />
                  <rect x="0.5" y="4" width="3" height="5" rx="0.4" fill="currentColor" />
                  <line x1="7" y1="2" x2="7" y2="13" stroke="currentColor" strokeWidth="0.8" />
                  <rect x="5.5" y="5" width="3" height="4" rx="0.4" fill="currentColor" opacity="0.4" />
                  <line x1="12" y1="0" x2="12" y2="12" stroke="currentColor" strokeWidth="0.8" />
                  <rect x="10.5" y="3" width="3" height="6" rx="0.4" fill="currentColor" />
                </svg>
                <ChevronDown className="w-3 h-3" style={{ transform: showChartTypes ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
              </button>
              {showChartTypes && (
                <div className="absolute top-full left-0 mt-1 w-40 rounded-lg overflow-hidden shadow-xl" style={{ background: 'rgba(10,14,26,0.97)', border: '1px solid var(--glass-border-color)', backdropFilter: 'blur(16px)' }}>
                  {CHART_TYPES.map((ct, i) => (
                    <button key={ct} className="w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-white/10 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                      {ct}
                      {i === 0 && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(59,130,246,0.2)', color: 'var(--text-accent)' }}>Active</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Compare */}
            <div className="relative">
              <button
                onClick={() => { setShowCompare(!showCompare); setShowIndicators(false); setShowChartTypes(false); }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150 hover:bg-white/10"
                style={{ color: showCompare ? 'var(--text-accent)' : 'var(--text-tertiary)' }}
              >
                <Plus className="w-3.5 h-3.5" />
                Compare
              </button>
              {showCompare && (
                <div className="absolute top-full left-0 mt-1 w-44 rounded-lg overflow-hidden shadow-xl" style={{ background: 'rgba(10,14,26,0.97)', border: '1px solid var(--glass-border-color)', backdropFilter: 'blur(16px)' }}>
                  <div className="p-2 border-b" style={{ borderColor: 'var(--glass-border-color)' }}>
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <Search className="w-3 h-3 shrink-0" style={{ color: 'var(--text-tertiary)' }} />
                      <input
                        autoFocus
                        value={compareSearch}
                        onChange={e => setCompareSearch(e.target.value)}
                        placeholder="Search ticker…"
                        className="flex-1 bg-transparent text-xs outline-none"
                        style={{ color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>
                  {COMPARE_TICKERS.filter(t => t.includes(compareSearch.toUpperCase())).map(t => (
                    <button key={t} className="w-full px-3 py-2 text-left text-xs hover:bg-white/10 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chart row: drawing tools + chart */}
          <div className="flex flex-1" style={{ minHeight: 0 }}>

            {/* Drawing tools sidebar */}
            <div className="flex flex-col items-center py-2 gap-0.5 shrink-0" style={{ width: '34px', borderRight: '1px solid var(--glass-border-color)' }}>
              {DRAWING_TOOLS.map(({ icon: Icon, label }, i) => (
                <div key={label}>
                  {i === 1 && <div className="w-5 h-px my-1.5" style={{ background: 'var(--glass-border-color)' }} />}
                  <div className="relative group">
                    <button
                      className="w-7 h-7 flex items-center justify-center rounded transition-colors hover:bg-white/10"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                    <div
                      className="absolute left-full ml-2 px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50"
                      style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border-color)', color: 'var(--text-primary)', backdropFilter: 'blur(12px)' }}
                    >
                      {label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div ref={chartRef} className="flex-1 p-2" style={{ overflow: 'hidden' }}>
              {chartW > 0 && chartH > 0 && (
                <CandlestickChart data={DEMO_DATA} width={chartW} height={chartH} />
              )}
            </div>
          </div>
        </div>

        {/* ── Right panel ─────────────────────────────────────────────── */}
        <div className="flex flex-col shrink-0 overflow-hidden" style={{ width: '290px', borderLeft: '1px solid var(--glass-border-color)' }}>

          {/* Watchlist / Signals tabs */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Tab header */}
            <div className="flex shrink-0 border-b" style={{ borderColor: 'var(--glass-border-color)' }}>
              <button
                onClick={() => setRightPanel('watchlist')}
                className="flex-1 py-2 text-xs font-bold transition-colors"
                style={{
                  color: rightPanel === 'watchlist' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  borderBottom: rightPanel === 'watchlist' ? '2px solid #3b82f6' : '2px solid transparent',
                }}
              >
                Watchlist
              </button>
              <button
                onClick={() => setRightPanel('signals')}
                className="flex-1 py-2 text-xs font-bold transition-colors relative"
                style={{
                  color: rightPanel === 'signals' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  borderBottom: rightPanel === 'signals' ? '2px solid #3b82f6' : '2px solid transparent',
                }}
              >
                Signals
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400">{SIGNALS.length}</span>
              </button>
              {rightPanel === 'watchlist' && (
                <button className="px-2.5"><Plus className="w-3.5 h-3.5" style={{ color: 'var(--text-tertiary)' }} /></button>
              )}
            </div>

            {/* Watchlist content */}
            {rightPanel === 'watchlist' && (
              <div className="overflow-y-auto flex-1">
                {WATCHLIST.map(stock => (
                  <button
                    key={stock.symbol}
                    onClick={() => setSelectedSymbol(stock.symbol)}
                    className="w-full flex items-center justify-between px-3 py-2.5 transition-colors hover:bg-white/5"
                    style={{
                      background: selectedSymbol === stock.symbol ? 'rgba(59,130,246,0.08)' : 'transparent',
                      borderLeft: selectedSymbol === stock.symbol ? '2px solid #3b82f6' : '2px solid transparent',
                    }}
                  >
                    <div className="text-left">
                      <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{stock.symbol}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>${stock.price.toFixed(2)}</p>
                      <p className={`text-[10px] font-semibold ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.pct.toFixed(2)}%
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Signals content */}
            {rightPanel === 'signals' && (
              <div className="overflow-y-auto flex-1">
                {SIGNALS.map(sig => (
                  <button
                    key={sig.id}
                    onClick={() => setSelectedSymbol(sig.symbol)}
                    className="w-full px-3 py-2.5 text-left transition-colors hover:bg-white/5 border-b"
                    style={{
                      borderColor: 'var(--glass-border-color)',
                      background: selectedSymbol === sig.symbol ? 'rgba(59,130,246,0.06)' : 'transparent',
                      borderLeft: selectedSymbol === sig.symbol ? '2px solid #3b82f6' : '2px solid transparent',
                    }}
                  >
                    {/* Row 1: badge + symbol + price */}
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${sig.action === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {sig.action}
                        </span>
                        <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{sig.symbol}</span>
                      </div>
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>${sig.price.toFixed(2)}</span>
                    </div>
                    {/* Row 2: expert + qty + time */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{sig.expert}</span>
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{sig.qty} shares · {sig.time}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Order form */}
          <div className="shrink-0 border-t p-3" style={{ borderColor: 'var(--glass-border-color)' }}>
            {/* Buy / Sell toggle */}
            <div className="flex rounded-lg overflow-hidden mb-3" style={{ border: '1px solid var(--glass-border-color)' }}>
              <button
                onClick={() => setSide('buy')}
                className="flex-1 py-2 text-xs font-bold transition-all duration-150"
                style={{ background: side === 'buy' ? 'rgba(34,197,94,0.2)' : 'transparent', color: side === 'buy' ? '#22c55e' : 'var(--text-tertiary)' }}
              >
                Buy
              </button>
              <button
                onClick={() => setSide('sell')}
                className="flex-1 py-2 text-xs font-bold transition-all duration-150"
                style={{ background: side === 'sell' ? 'rgba(239,68,68,0.2)' : 'transparent', color: side === 'sell' ? '#ef4444' : 'var(--text-tertiary)' }}
              >
                Sell
              </button>
            </div>

            {/* Order type */}
            <div className="flex gap-2 mb-3">
              {(['market', 'limit'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setOrderType(t)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                  style={{
                    background: orderType === t ? 'rgba(59,130,246,0.15)' : 'var(--glass-bg)',
                    color: orderType === t ? 'var(--text-accent)' : 'var(--text-tertiary)',
                    border: `1px solid ${orderType === t ? 'rgba(59,130,246,0.4)' : 'var(--glass-border-color)'}`,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Qty */}
            <div className="mb-2">
              <label className="block text-[10px] font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>Quantity</label>
              <input
                type="number"
                placeholder="0"
                value={qty}
                onChange={e => setQty(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border-color)', color: 'var(--text-primary)' }}
              />
            </div>

            {/* Limit price */}
            {orderType === 'limit' && (
              <div className="mb-2">
                <label className="block text-[10px] font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>Limit Price</label>
                <input
                  type="number"
                  placeholder={currentStock.price.toFixed(2)}
                  value={limitPrice}
                  onChange={e => setLimitPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                  style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border-color)', color: 'var(--text-primary)' }}
                />
              </div>
            )}

            {/* Submit */}
            <button
              className="w-full py-2.5 rounded-lg text-xs font-bold mt-1 transition-all duration-150 hover:opacity-90"
              style={{ background: side === 'buy' ? 'rgba(34,197,94,0.85)' : 'rgba(239,68,68,0.85)', color: '#fff' }}
            >
              {side === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
            </button>

            {/* Buying power */}
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Buying power</span>
              <span className="text-[10px] font-semibold" style={{ color: 'var(--text-secondary)' }}>${user?.balance?.toLocaleString() ?? '—'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom panel ────────────────────────────────────────────────── */}
      <div className="shrink-0" style={{ height: '180px', borderTop: '1px solid var(--glass-border-color)' }}>
        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: 'var(--glass-border-color)' }}>
          {(['positions', 'orders'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2 text-xs font-semibold capitalize transition-colors"
              style={{
                color: activeTab === tab ? 'var(--text-accent)' : 'var(--text-tertiary)',
                borderBottom: activeTab === tab ? '2px solid var(--text-accent)' : '2px solid transparent',
              }}
            >
              {tab === 'orders' ? 'Open Orders' : 'Positions'}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="overflow-y-auto" style={{ height: 'calc(180px - 37px)' }}>

          {/* Positions */}
          {activeTab === 'positions' && (
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border-color)' }}>
                  {['Symbol', 'Qty', 'Avg Price', 'Current', 'P&L', 'P&L %'].map(h => (
                    <th key={h} className="px-4 py-2 text-left font-semibold" style={{ color: 'var(--text-tertiary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {POSITIONS.map(p => (
                  <tr key={p.symbol} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-2 font-bold" style={{ color: 'var(--text-primary)' }}>{p.symbol}</td>
                    <td className="px-4 py-2" style={{ color: 'var(--text-secondary)' }}>{p.qty}</td>
                    <td className="px-4 py-2" style={{ color: 'var(--text-secondary)' }}>${p.avg.toFixed(2)}</td>
                    <td className="px-4 py-2" style={{ color: 'var(--text-secondary)' }}>${p.current.toFixed(2)}</td>
                    <td className={`px-4 py-2 font-semibold ${p.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {p.pnl >= 0 ? '+' : ''}${p.pnl.toFixed(2)}
                    </td>
                    <td className={`px-4 py-2 font-semibold ${p.pnlPct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {p.pnlPct >= 0 ? '+' : ''}{p.pnlPct.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Open Orders */}
          {activeTab === 'orders' && (
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border-color)' }}>
                  {['Symbol', 'Side', 'Qty', 'Type', 'Price', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-2 text-left font-semibold" style={{ color: 'var(--text-tertiary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {OPEN_ORDERS.map(o => (
                  <tr key={o.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-2 font-bold" style={{ color: 'var(--text-primary)' }}>{o.symbol}</td>
                    <td className={`px-4 py-2 font-semibold ${o.side === 'Buy' ? 'text-green-400' : 'text-red-400'}`}>{o.side}</td>
                    <td className="px-4 py-2" style={{ color: 'var(--text-secondary)' }}>{o.qty}</td>
                    <td className="px-4 py-2" style={{ color: 'var(--text-secondary)' }}>{o.type}</td>
                    <td className="px-4 py-2" style={{ color: 'var(--text-secondary)' }}>${o.price.toFixed(2)}</td>
                    <td className="px-4 py-2 text-yellow-400">{o.status}</td>
                    <td className="px-4 py-2">
                      <button className="hover:text-red-400 transition-colors" style={{ color: 'var(--text-tertiary)' }}>
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>
      </div>

      {/* ── Sky Intelligence slide-in panel ─────────────────────────── */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col"
        style={{
          width: '360px',
          background: 'rgba(8,10,20,0.98)',
          borderLeft: '1px solid rgba(139,92,246,0.3)',
          backdropFilter: 'blur(24px)',
          transform: showSkyIntel ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0" style={{ borderColor: 'rgba(139,92,246,0.2)' }}>
          <span className="text-sm font-bold text-violet-300">Sky Intelligence</span>
          <button onClick={() => setShowSkyIntel(false)} className="hover:text-white transition-colors" style={{ color: 'var(--text-tertiary)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feed */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">

          {/* AI insight card */}
          <div className="rounded-xl p-4" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-violet-400 uppercase tracking-wide">AI Insight</span>
              <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Just now</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              NVIDIA looks strong today. The stock has been climbing steadily and traders are buying more ahead of next week's earnings. A good level to watch is $490 — if it stays above that, the trend is likely to continue.
            </p>
          </div>

          {/* News card */}
          <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border-color)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>Market News</span>
              <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>14m ago</span>
            </div>
            <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Apple set to unveil new AI features at WWDC</p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Apple is expected to announce a major update to its AI capabilities at next month's developer conference. Investors are watching closely — the last time Apple made a big AI announcement, the stock jumped over 7% in a single day.
            </p>
          </div>

        </div>

        {/* Chat input */}
        <div className="shrink-0 px-4 py-4 border-t" style={{ borderColor: 'rgba(139,92,246,0.2)' }}>
          <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(139,92,246,0.25)' }}>
            <input
              type="text"
              placeholder="Ask Sky Intelligence…"
              value={intelInput}
              onChange={e => setIntelInput(e.target.value)}
              className="flex-1 bg-transparent outline-none text-xs"
              style={{ color: 'var(--text-primary)' }}
            />
            <button className="shrink-0 transition-colors hover:text-violet-300" style={{ color: intelInput ? '#a78bfa' : 'var(--text-tertiary)' }}>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[10px] mt-2 text-center" style={{ color: 'var(--text-tertiary)' }}>Powered by Sky AI · For informational purposes only</p>
        </div>
      </div>
    </div>
  );
}
