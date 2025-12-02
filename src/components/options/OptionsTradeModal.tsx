'use client';

import { useState } from 'react';
import { X, TrendingUp, TrendingDown, DollarSign, Wallet, Info } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';

interface OptionDetails {
  symbol: string;
  type: 'call' | 'put';
  strike: number;
  expiration: string;
  lastPrice: number;
  bid: number;
  ask: number;
}

interface OptionsTradeModalProps {
  option: OptionDetails;
  onClose: () => void;
}

export default function OptionsTradeModal({ option, onClose }: OptionsTradeModalProps) {
  const { user } = useAuth();
  const [action, setAction] = useState<'buy_to_open' | 'sell_to_open'>('buy_to_open');
  const [quantity, setQuantity] = useState<number>(1);
  const [quantityInput, setQuantityInput] = useState<string>('1');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [limitPrice, setLimitPrice] = useState<string>(option.lastPrice.toFixed(2));
  const [showSuccess, setShowSuccess] = useState(false);

  // Calculate values
  const premium = orderType === 'market' ?
    (action === 'buy_to_open' ? option.ask : option.bid) :
    parseFloat(limitPrice);

  const contractMultiplier = 100; // Standard options contract
  const totalCost = premium * quantity * contractMultiplier;

  const breakEven = option.type === 'call' ?
    option.strike + premium :
    option.strike - premium;

  const maxProfit = option.type === 'call' && action === 'buy_to_open' ?
    'Unlimited' :
    option.type === 'put' && action === 'buy_to_open' ?
    `$${((option.strike - premium) * contractMultiplier * quantity).toFixed(2)}` :
    `$${(premium * contractMultiplier * quantity).toFixed(2)}`;

  const maxLoss = action === 'buy_to_open' ?
    `$${totalCost.toFixed(2)}` :
    option.type === 'call' ? 'Unlimited' : `$${((option.strike - premium) * contractMultiplier * quantity).toFixed(2)}`;

  const canAfford = user ? user.balance >= totalCost : false;

  const handleTrade = () => {
    setShowSuccess(true);
    setTimeout(() => {
      onClose();
      setShowSuccess(false);
    }, 2000);
  };

  if (!user) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--background-primary) 70%, transparent)',
        pointerEvents: 'auto',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="card max-w-5xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-body p-6">
          {!showSuccess ? (
            <>
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    option.type === 'call' ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    {option.type === 'call' ?
                      <TrendingUp className="w-5 h-5 text-green-400" /> :
                      <TrendingDown className="w-5 h-5 text-red-400" />
                    }
                  </div>
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {option.symbol} {option.type.toUpperCase()} ${option.strike}
                    </h2>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      Expires {option.expiration}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 glass-morphism rounded-lg hover:bg-white/10 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column - Trade Inputs */}
                <div className="space-y-4">
                  {/* Price Info */}
                  <div className="glass-morphism p-3 rounded-lg">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <div className="text-xs mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Last</div>
                        <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                          ${option.lastPrice.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Bid</div>
                        <div className="text-sm font-bold text-red-400">
                          ${option.bid.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Ask</div>
                        <div className="text-sm font-bold text-green-400">
                          ${option.ask.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Selector */}
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Action
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setAction('buy_to_open')}
                        className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
                          action === 'buy_to_open'
                            ? 'bg-green-600 text-white'
                            : 'glass-morphism text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        Buy to Open
                      </button>
                      <button
                        onClick={() => setAction('sell_to_open')}
                        className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
                          action === 'sell_to_open'
                            ? 'bg-red-600 text-white'
                            : 'glass-morphism text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        Sell to Open
                      </button>
                    </div>
                  </div>

                  {/* Order Type & Quantity Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                        Order Type
                      </label>
                      <select
                        value={orderType}
                        onChange={(e) => setOrderType(e.target.value as 'market' | 'limit')}
                        className="form-input text-sm w-full"
                      >
                        <option value="market">Market</option>
                        <option value="limit">Limit</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={quantityInput}
                        onChange={(e) => {
                          const value = e.target.value;
                          setQuantityInput(value);
                          if (value === '') {
                            setQuantity(1);
                          } else {
                            const numValue = parseInt(value);
                            if (!isNaN(numValue) && numValue > 0) {
                              setQuantity(numValue);
                            }
                          }
                        }}
                        onBlur={(e) => {
                          const value = e.target.value;
                          if (value === '' || parseInt(value) < 1) {
                            setQuantityInput('1');
                            setQuantity(1);
                          }
                        }}
                        className="form-input text-sm text-center w-full"
                        placeholder="1"
                      />
                    </div>
                  </div>

                  {/* Limit Price (if limit order) */}
                  {orderType === 'limit' && (
                    <div>
                      <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                        Limit Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={limitPrice}
                        onChange={(e) => setLimitPrice(e.target.value)}
                        className="form-input text-sm text-center w-full"
                        placeholder="0.00"
                      />
                    </div>
                  )}
                </div>

                {/* Right Column - Summary & Info */}
                <div className="space-y-4">
                  {/* Trade Summary */}
                  <div className="glass-morphism p-3 rounded-lg">
                    <h3 className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                      <DollarSign className="w-3 h-3" />
                      Summary
                    </h3>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span style={{ color: 'var(--text-tertiary)' }}>Premium:</span>
                        <span style={{ color: 'var(--text-primary)' }}>${premium.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span style={{ color: 'var(--text-tertiary)' }}>Contracts:</span>
                        <span style={{ color: 'var(--text-primary)' }}>{quantity} × 100</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span style={{ color: 'var(--text-tertiary)' }}>Break-even:</span>
                        <span style={{ color: 'var(--text-primary)' }}>${breakEven.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-1.5 mt-1.5" style={{ borderColor: 'var(--glass-border)' }}>
                        <div className="flex justify-between font-bold">
                          <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                            {action === 'buy_to_open' ? 'Total:' : 'Credit:'}
                          </span>
                          <span className="text-lg text-gradient">${totalCost.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Risk & Balance */}
                  <div className="glass-morphism p-3 rounded-lg">
                    <h3 className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                      <Info className="w-3 h-3" />
                      Risk & Balance
                    </h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Max Profit</div>
                          <div className="text-sm font-bold text-green-400">{typeof maxProfit === 'string' && maxProfit === 'Unlimited' ? maxProfit : maxProfit}</div>
                        </div>
                        <div>
                          <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Max Loss</div>
                          <div className="text-sm font-bold text-red-400">{typeof maxLoss === 'string' && maxLoss === 'Unlimited' ? maxLoss : maxLoss}</div>
                        </div>
                      </div>
                      <div className="border-t pt-2" style={{ borderColor: 'var(--glass-border)' }}>
                        <div className="flex items-center gap-1 mb-1">
                          <Wallet className="w-3 h-3" style={{ color: 'var(--text-tertiary)' }} />
                          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Balance</span>
                        </div>
                        <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                          ${user.balance.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {action === 'buy_to_open' && !canAfford && (
                    <div className="glass-morphism p-2 rounded-lg border border-red-500/30">
                      <p className="text-red-400 text-xs font-medium text-center flex items-center justify-center gap-1">
                        <X className="w-3 h-3" />
                        Insufficient funds
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Execute Button */}
              <button
                onClick={handleTrade}
                disabled={action === 'buy_to_open' && !canAfford}
                className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 mt-4 ${
                  action === 'buy_to_open'
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30'
                    : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {action === 'buy_to_open' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                {action === 'buy_to_open' ? 'Buy' : 'Sell'} {quantity} Contract{quantity > 1 ? 's' : ''}
              </button>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-green-500/20">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Trade Executed!
              </h3>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                {action === 'buy_to_open' ? 'Bought' : 'Sold'} {quantity} {option.symbol} {option.type.toUpperCase()} contract{quantity > 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
