'use client';

import { useState } from 'react';
import OptionsChain, { SelectedOption } from '@/components/options/OptionsChain';
import { OptionsPosition } from '@/types/options';
import { Search, ChevronDown, TrendingUp, TrendingDown, X } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

const ACCOUNTS = ['Demo Account', 'Trading Account'];
const popularSymbols = ['AAPL', 'TSLA', 'NVDA', 'SPY', 'MSFT', 'AMZN'];

export default function OptionsPage() {
  const { user } = useAuth();
  const [selectedSymbol, setSelectedSymbol] = useState<string>('NVDA');
  const [selectedAccount, setSelectedAccount] = useState('Demo Account');
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  // Order sidebar state
  const [selectedOption, setSelectedOption] = useState<SelectedOption | null>(null);
  const [orderAction, setOrderAction] = useState<'buy_to_open' | 'sell_to_open'>('buy_to_open');
  const [orderQty, setOrderQty] = useState(1);
  const [orderQtyInput, setOrderQtyInput] = useState('1');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [limitPrice, setLimitPrice] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSelectOption = (opt: SelectedOption) => {
    setSelectedOption(opt);
    setOrderAction('buy_to_open');
    setOrderQty(1);
    setOrderQtyInput('1');
    setOrderType('market');
    setLimitPrice(opt.lastPrice.toFixed(2));
    setShowSuccess(false);
  };

  const premium = selectedOption
    ? orderType === 'market'
      ? (orderAction === 'buy_to_open' ? selectedOption.ask : selectedOption.bid)
      : parseFloat(limitPrice) || 0
    : 0;
  const totalCost = premium * orderQty * 100;
  const breakEven = selectedOption
    ? selectedOption.type === 'call' ? selectedOption.strike + premium : selectedOption.strike - premium
    : 0;
  const maxProfit = selectedOption
    ? selectedOption.type === 'call' && orderAction === 'buy_to_open' ? 'Unlimited'
    : selectedOption.type === 'put' && orderAction === 'buy_to_open' ? `$${((selectedOption.strike - premium) * 100 * orderQty).toFixed(2)}`
    : `$${totalCost.toFixed(2)}`
    : '—';
  const maxLoss = selectedOption
    ? orderAction === 'buy_to_open' ? `$${totalCost.toFixed(2)}`
    : selectedOption.type === 'call' ? 'Unlimited'
    : `$${((selectedOption.strike - premium) * 100 * orderQty).toFixed(2)}`
    : '—';
  const canAfford = user ? user.balance >= totalCost : false;

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
      purchaseDate: '2024-03-01',
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
      purchaseDate: '2024-02-28',
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
      purchaseDate: '2024-02-25',
    },
  ];

  const upcomingExpirations = [
    { date: '2024-03-15', count: 2, value: 2410 },
    { date: '2024-03-22', count: 1, value: 720 },
    { date: '2024-04-05', count: 1, value: 2430 },
  ];

  const mostActiveOptions = [
    { symbol: 'SPY',  type: 'call' as const, strike: 520, volume: 125420, price: 3.25,  change: 8.5  },
    { symbol: 'AAPL', type: 'put'  as const, strike: 170, volume: 98540,  price: 2.15,  change: -3.2 },
    { symbol: 'TSLA', type: 'call' as const, strike: 250, volume: 87230,  price: 12.40, change: 15.7 },
    { symbol: 'NVDA', type: 'call' as const, strike: 900, volume: 76890,  price: 15.80, change: 22.3 },
  ];

  const totalValue   = activePositions.reduce((sum, p) => sum + p.currentValue, 0);
  const totalPL      = activePositions.reduce((sum, p) => sum + p.profitLoss, 0);
  const totalPLPct   = (totalPL / (totalValue - totalPL)) * 100;

  const fmtVol = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : String(v);

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ height: '100vh', background: 'var(--background)' }}
      onClick={() => showAccountMenu && setShowAccountMenu(false)}
    >
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-4 px-4 border-b shrink-0"
        style={{ height: '48px', borderColor: 'var(--glass-border-color)', background: 'var(--navbar-bg, rgba(10,10,20,0.95))' }}
      >
        {/* Title */}
        <span className="text-sm font-bold shrink-0" style={{ color: 'var(--text-primary)' }}>Options Trading</span>

        <div className="w-px h-5 shrink-0" style={{ background: 'var(--glass-border-color)' }} />

        {/* Account stats */}
        <div className="hidden lg:flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Buying Power</span>
            <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>${totalValue.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Total P/L</span>
            <span className={`text-sm font-semibold ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalPL >= 0 ? '+' : ''}${totalPL.toFixed(0)} <span className="text-xs">({totalPL >= 0 ? '+' : ''}{totalPLPct.toFixed(2)}%)</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Active Positions</span>
            <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{activePositions.length}</span>
          </div>
        </div>

        <div className="flex-1" />

        {/* Market status */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-xs font-semibold text-green-400">Market Open</span>
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Closes in 3h 24m</span>
        </div>

        <div className="w-px h-5" style={{ background: 'var(--glass-border-color)' }} />

        {/* Account selector */}
        <div className="relative" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => setShowAccountMenu(!showAccountMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-white/10"
            style={{ border: '1px solid var(--glass-border-color)', color: 'var(--text-primary)' }}
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${selectedAccount === 'Trading Account' ? 'bg-green-400' : 'bg-yellow-400'}`} />
            {selectedAccount}
            <ChevronDown
              className="w-3 h-3"
              style={{ color: 'var(--text-tertiary)', transform: showAccountMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
            />
          </button>
          {showAccountMenu && (
            <div
              className="absolute top-full right-0 mt-1 w-44 rounded-lg overflow-hidden shadow-xl z-50"
              style={{ background: 'rgba(10,14,26,0.97)', border: '1px solid var(--glass-border-color)', backdropFilter: 'blur(16px)' }}
            >
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
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[95vw] mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4">

              {/* Active Positions */}
              <div className="rounded-xl border" style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border-color)' }}>
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--glass-border-color)' }}>
                  <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Active Positions</h3>
                </div>
                <div className="p-3 space-y-2">
                  {activePositions.map((position) => (
                    <div
                      key={position.id}
                      className="p-3 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border-color)' }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{position.symbol}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${
                              position.type === 'call' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {position.type.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                            ${position.strike} · {position.expiration}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-bold ${position.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {position.profitLoss >= 0 ? '+' : ''}${position.profitLoss}
                          </div>
                          <div className={`text-xs ${position.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {position.profitLoss >= 0 ? '+' : ''}{position.profitLossPercent.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        <span>{position.quantity} contract{position.quantity > 1 ? 's' : ''}</span>
                        <span>{position.daysToExpiration}d left</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Expirations */}
              <div className="rounded-xl border" style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border-color)' }}>
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--glass-border-color)' }}>
                  <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Upcoming Expirations</h3>
                </div>
                <div className="p-3 space-y-2">
                  {upcomingExpirations.map((exp) => (
                    <div
                      key={exp.date}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border-color)' }}
                    >
                      <div>
                        <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{exp.date}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                          {exp.count} position{exp.count > 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>${exp.value.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Most Active */}
              <div className="rounded-xl border" style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border-color)' }}>
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--glass-border-color)' }}>
                  <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Most Active</h3>
                </div>
                <div className="p-3 space-y-2">
                  {mostActiveOptions.map((option, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border-color)' }}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{option.symbol}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${
                            option.type === 'call' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {option.type.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                          ${option.strike} · Vol: {fmtVol(option.volume)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>${option.price.toFixed(2)}</div>
                        <div className={`text-xs font-semibold ${option.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {option.change >= 0 ? '+' : ''}{option.change.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center Column - Options Chain */}
            <div className="lg:col-span-8">
              <div className="rounded-xl border" style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border-color)' }}>
                {/* Search + symbol picker */}
                <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: 'var(--glass-border-color)' }}>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                    <input
                      type="text"
                      placeholder="Search for a stock to view options chain…"
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm cursor-not-allowed opacity-60"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border-color)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Popular:</span>
                    {popularSymbols.map((symbol) => (
                      <button
                        key={symbol}
                        onClick={() => setSelectedSymbol(symbol)}
                        className="px-3 py-1 text-xs font-semibold rounded-lg transition-all"
                        style={{
                          background: selectedSymbol === symbol ? 'linear-gradient(135deg, #3b82f6, #9333ea)' : 'rgba(255,255,255,0.05)',
                          color: selectedSymbol === symbol ? '#fff' : 'var(--text-tertiary)',
                          border: selectedSymbol === symbol ? 'none' : '1px solid var(--glass-border-color)',
                        }}
                      >
                        {symbol}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Options Chain */}
                <div className="p-4">
                  <OptionsChain symbol={selectedSymbol} onSelectOption={handleSelectOption} />
                </div>
              </div>

              {/* Option Strategies */}
              <div className="rounded-xl border mt-4" style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border-color)' }}>
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--glass-border-color)' }}>
                  <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Option Strategies</h3>
                </div>
                <div className="px-4 py-10 flex items-center justify-center">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Strategies Coming Soon</p>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Order Form */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border sticky top-4" style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border-color)' }}>
                {!selectedOption ? (
                  <div className="px-4 py-10 text-center">
                    <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <TrendingUp className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
                    </div>
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>No option selected</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Click Buy on a row in the options chain to place an order</p>
                  </div>
                ) : showSuccess ? (
                  <div className="px-4 py-10 text-center">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center bg-green-500/20">
                      <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Order Placed!</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {orderAction === 'buy_to_open' ? 'Bought' : 'Sold'} {orderQty} {selectedOption.symbol} {selectedOption.type.toUpperCase()} contract{orderQty > 1 ? 's' : ''}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--glass-border-color)' }}>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{selectedOption.symbol}</span>
                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${selectedOption.type === 'call' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {selectedOption.type.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                          ${selectedOption.strike} · Exp {selectedOption.expiration}
                        </p>
                      </div>
                      <button onClick={() => setSelectedOption(null)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" style={{ color: 'var(--text-tertiary)' }}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-4 space-y-4">
                      {/* Bid / Ask / Last */}
                      <div className="grid grid-cols-3 gap-2 rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border-color)' }}>
                        {[
                          { label: 'Last', value: selectedOption.lastPrice.toFixed(2), color: 'var(--text-primary)' },
                          { label: 'Bid',  value: selectedOption.bid.toFixed(2),       color: '#ef4444' },
                          { label: 'Ask',  value: selectedOption.ask.toFixed(2),       color: '#22c55e' },
                        ].map(item => (
                          <div key={item.label} className="text-center">
                            <div className="text-[10px] mb-0.5" style={{ color: 'var(--text-tertiary)' }}>{item.label}</div>
                            <div className="text-sm font-bold" style={{ color: item.color }}>${item.value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Buy / Sell toggle */}
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => setOrderAction('buy_to_open')} className="py-2 rounded-lg text-xs font-bold transition-all" style={{ background: orderAction === 'buy_to_open' ? '#16a34a' : 'rgba(255,255,255,0.05)', color: orderAction === 'buy_to_open' ? '#fff' : 'var(--text-secondary)', border: '1px solid transparent' }}>
                          Buy to Open
                        </button>
                        <button onClick={() => setOrderAction('sell_to_open')} className="py-2 rounded-lg text-xs font-bold transition-all" style={{ background: orderAction === 'sell_to_open' ? '#dc2626' : 'rgba(255,255,255,0.05)', color: orderAction === 'sell_to_open' ? '#fff' : 'var(--text-secondary)', border: '1px solid transparent' }}>
                          Sell to Open
                        </button>
                      </div>

                      {/* Order type + Quantity */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>Order Type</label>
                          <select value={orderType} onChange={e => setOrderType(e.target.value as 'market' | 'limit')} className="w-full px-2 py-2 text-xs rounded-lg outline-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border-color)', color: 'var(--text-primary)' }}>
                            <option value="market">Market</option>
                            <option value="limit">Limit</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>Contracts</label>
                          <input type="number" min="1" value={orderQtyInput}
                            onChange={e => { setOrderQtyInput(e.target.value); const n = parseInt(e.target.value); if (!isNaN(n) && n > 0) setOrderQty(n); }}
                            onBlur={e => { if (!e.target.value || parseInt(e.target.value) < 1) { setOrderQtyInput('1'); setOrderQty(1); } }}
                            className="w-full px-2 py-2 text-xs rounded-lg text-center outline-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border-color)', color: 'var(--text-primary)' }} />
                        </div>
                      </div>

                      {/* Limit price */}
                      {orderType === 'limit' && (
                        <div>
                          <label className="block text-[10px] font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>Limit Price</label>
                          <input type="number" step="0.01" value={limitPrice} onChange={e => setLimitPrice(e.target.value)} className="w-full px-2 py-2 text-xs rounded-lg text-center outline-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border-color)', color: 'var(--text-primary)' }} />
                        </div>
                      )}

                      {/* Summary */}
                      <div className="rounded-lg p-3 space-y-1.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border-color)' }}>
                        {[
                          { label: 'Premium',    value: `$${premium.toFixed(2)}` },
                          { label: 'Contracts',  value: `${orderQty} × 100` },
                          { label: 'Break-even', value: `$${breakEven.toFixed(2)}` },
                        ].map(row => (
                          <div key={row.label} className="flex justify-between text-xs">
                            <span style={{ color: 'var(--text-tertiary)' }}>{row.label}</span>
                            <span style={{ color: 'var(--text-secondary)' }}>{row.value}</span>
                          </div>
                        ))}
                        <div className="border-t pt-1.5 mt-1 flex justify-between items-center" style={{ borderColor: 'var(--glass-border-color)' }}>
                          <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{orderAction === 'buy_to_open' ? 'Total Cost' : 'Credit'}</span>
                          <span className="text-base font-bold text-gradient">${totalCost.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Risk */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-lg p-2.5" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
                          <div className="text-[10px] mb-1" style={{ color: 'var(--text-tertiary)' }}>Max Profit</div>
                          <div className="text-xs font-bold text-green-400">{maxProfit}</div>
                        </div>
                        <div className="rounded-lg p-2.5" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                          <div className="text-[10px] mb-1" style={{ color: 'var(--text-tertiary)' }}>Max Loss</div>
                          <div className="text-xs font-bold text-red-400">{maxLoss}</div>
                        </div>
                      </div>

                      {/* Balance */}
                      <div className="flex items-center justify-between text-xs">
                        <span style={{ color: 'var(--text-tertiary)' }}>Buying power</span>
                        <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>${user?.balance?.toLocaleString() ?? '—'}</span>
                      </div>

                      {/* Insufficient funds warning */}
                      {orderAction === 'buy_to_open' && !canAfford && user && (
                        <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-red-400" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                          <X className="w-3.5 h-3.5 shrink-0" /> Insufficient funds
                        </div>
                      )}

                      {/* Submit */}
                      <button
                        onClick={() => { setShowSuccess(true); setTimeout(() => { setShowSuccess(false); setSelectedOption(null); }, 2500); }}
                        disabled={orderAction === 'buy_to_open' && !canAfford}
                        className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        style={{ background: orderAction === 'buy_to_open' ? '#16a34a' : '#dc2626', boxShadow: orderAction === 'buy_to_open' ? '0 4px 14px rgba(22,163,74,0.3)' : '0 4px 14px rgba(220,38,38,0.3)' }}
                      >
                        {orderAction === 'buy_to_open' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {orderAction === 'buy_to_open' ? 'Buy' : 'Sell'} {orderQty} Contract{orderQty > 1 ? 's' : ''}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
