'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { X, TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import OptionsChain from '../options/OptionsChain';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface TradingModalProps {
  stock: Stock;
  onClose: () => void;
}

export default function TradingModal({ stock, onClose }: TradingModalProps) {
  const { user, updateBalance } = useAuth();
  const [activeTab, setActiveTab] = useState<'stocks' | 'options'>('stocks');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState<number>(1);
  const [quantityInput, setQuantityInput] = useState<string>('1');
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Debug: Track component lifecycle
  useEffect(() => {
    console.log('🚀 TradingModal MOUNTED for', stock?.symbol);
    console.log('📊 Stock data:', stock);
    console.log('👤 User data:', user);
    
    return () => {
      console.log('💀 TradingModal UNMOUNTING for', stock?.symbol);
    };
  }, []);

  // Debug: Track when onClose function changes
  useEffect(() => {
    console.log('🔄 onClose function changed');
  }, [onClose]);


  if (!stock || !user) {
    return null;
  }

  const totalValue = quantity * stock.price;
  const canAfford = user ? user.balance >= totalValue : false;

  const getCurrentHoldings = () => {
    if (!user) return 0;
    const portfolio = JSON.parse(localStorage.getItem(`portfolio_${user.id}`) || '[]');
    const holding = portfolio.find((h: { symbol: string; shares: number }) => h.symbol === stock.symbol);
    return holding ? holding.shares : 0;
  };

  const currentShares = getCurrentHoldings();
  const canSell = currentShares >= quantity;

  const handleTrade = async () => {
    if (!user) return;
    
    setLoading(true);

    try {
      const portfolio = JSON.parse(localStorage.getItem(`portfolio_${user.id}`) || '[]');
      let newBalance = user.balance;

      if (tradeType === 'buy') {
        if (!canAfford) {
          alert('Insufficient funds');
          setLoading(false);
          return;
        }

        newBalance -= totalValue;
        
        const existingHoldingIndex = portfolio.findIndex((h: { symbol: string }) => h.symbol === stock.symbol);
        
        if (existingHoldingIndex !== -1) {
          const existingHolding = portfolio[existingHoldingIndex];
          const totalShares = existingHolding.shares + quantity;
          const totalCost = (existingHolding.shares * existingHolding.averagePrice) + totalValue;
          
          portfolio[existingHoldingIndex] = {
            ...existingHolding,
            shares: totalShares,
            averagePrice: totalCost / totalShares,
            currentPrice: stock.price
          };
        } else {
          portfolio.push({
            symbol: stock.symbol,
            name: stock.name,
            shares: quantity,
            averagePrice: stock.price,
            currentPrice: stock.price
          });
        }
      } else {
        if (!canSell) {
          alert('Insufficient shares');
          setLoading(false);
          return;
        }

        newBalance += totalValue;
        
        const existingHoldingIndex = portfolio.findIndex((h: { symbol: string }) => h.symbol === stock.symbol);
        
        if (existingHoldingIndex !== -1) {
          const existingHolding = portfolio[existingHoldingIndex];
          const newShares = existingHolding.shares - quantity;
          
          if (newShares === 0) {
            portfolio.splice(existingHoldingIndex, 1);
          } else {
            portfolio[existingHoldingIndex] = {
              ...existingHolding,
              shares: newShares,
              currentPrice: stock.price
            };
          }
        }
      }

      localStorage.setItem(`portfolio_${user.id}`, JSON.stringify(portfolio));
      updateBalance(newBalance);
      
      const transaction = {
        id: Date.now().toString(),
        type: tradeType,
        symbol: stock.symbol,
        name: stock.name,
        shares: quantity,
        price: stock.price,
        total: totalValue,
        date: new Date().toISOString()
      };
      
      const transactions = JSON.parse(localStorage.getItem(`transactions_${user.id}`) || '[]');
      transactions.push(transaction);
      localStorage.setItem(`transactions_${user.id}`, JSON.stringify(transactions));
      
      alert(`Successfully ${tradeType === 'buy' ? 'bought' : 'sold'} ${quantity} shares of ${stock.symbol}`);
      onClose();
    } catch {
      alert('Trade failed. Please try again.');
    }
    
    setLoading(false);
  };

  console.log('🎨 RENDERING TradingModal for', stock.symbol);

  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'color-mix(in srgb, var(--background-primary) 70%, transparent)' }}
      onClick={(e) => {
        console.log('🖱️ Backdrop click detected', e.target === e.currentTarget);
        if (e.target === e.currentTarget) {
          console.log('🚪 Closing modal via backdrop click');
          onClose();
        }
      }}
      style={{ 
        pointerEvents: 'auto',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <div
        className="card max-w-4xl w-full mx-4"
        onClick={(e) => {
          console.log('📦 Modal content clicked - preventing close');
          e.stopPropagation();
        }}
      >
        <div className="card-body">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                {activeTab === 'stocks' ? (
                  tradeType === 'buy' ?
                    <TrendingUp className="w-6 h-6" style={{ color: 'var(--text-primary)' }} /> :
                    <TrendingDown className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
                ) : (
                  <DollarSign className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Trade {stock.symbol}
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{stock.name}</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                console.log('❌ Close button clicked');
                e.stopPropagation();
                onClose();
              }}
              className="p-2 glass-morphism rounded-lg hover:bg-white/10 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('stocks')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-semibold transition-all ${
                activeTab === 'stocks'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'glass-morphism text-gray-400 hover:text-white'
              }`}
            >
              Stocks
            </button>
            <button
              onClick={() => setActiveTab('options')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-semibold transition-all ${
                activeTab === 'options'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'glass-morphism text-gray-400 hover:text-white'
              }`}
            >
              Options
            </button>
          </div>

          {/* Stocks Tab Content */}
          {activeTab === 'stocks' && (
            <>
              {/* Stock Price Info */}
              <div className="glass-morphism p-4 rounded-xl mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      ${stock.price.toFixed(2)}
                    </div>
                    <div className={`text-sm font-semibold flex items-center gap-1 ${
                      stock.change >= 0 ? 'status-positive' : 'status-negative'
                    }`}>
                      {stock.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Last updated</div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Trade Type Toggle */}
              <div className="flex gap-2 mb-6">
            <button
              onClick={() => setTradeType('buy')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                tradeType === 'buy'
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30'
                  : 'glass-morphism text-gray-300 hover:bg-white/10'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Buy
            </button>
            <button
              onClick={() => setTradeType('sell')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                tradeType === 'sell'
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30'
                  : 'glass-morphism text-gray-300 hover:bg-white/10'
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              Sell
            </button>
          </div>

          {/* Quantity Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
              Quantity (shares)
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
              onFocus={(e) => e.target.select()}
              className="form-input text-xl font-semibold text-center"
              placeholder="1"
            />
          </div>

          {/* Order Summary */}
          <div className="glass-morphism p-4 rounded-xl mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <DollarSign className="w-4 h-4" />
              Order Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--text-tertiary)' }}>Price per share:</span>
                <span style={{ color: 'var(--text-primary)' }}>${stock.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--text-tertiary)' }}>Quantity:</span>
                <span style={{ color: 'var(--text-primary)' }}>{quantity} shares</span>
              </div>
              <div className="border-t pt-2 mt-2" style={{ borderColor: 'var(--glass-border)' }}>
                <div className="flex justify-between font-bold text-lg">
                  <span style={{ color: 'var(--text-primary)' }}>Total:</span>
                  <span className="text-gradient">${totalValue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="glass-morphism p-4 rounded-xl mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="w-4 h-4" style={{ color: 'var(--text-accent)' }} />
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Account Info</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-tertiary)' }}>Available balance:</span>
                <span style={{ color: 'var(--text-primary)' }}>${user?.balance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-tertiary)' }}>Current holdings:</span>
                <span style={{ color: 'var(--text-primary)' }}>{currentShares} shares</span>
              </div>
            </div>
          </div>

          {/* Error Messages */}
          {tradeType === 'buy' && !canAfford && (
            <div className="glass-morphism p-3 rounded-lg border-2 border-red-500/30 mb-4">
              <p className="text-red-400 text-sm font-medium text-center flex items-center justify-center gap-2">
                <X className="w-4 h-4" />
                Insufficient funds for this purchase
              </p>
            </div>
          )}

          {tradeType === 'sell' && !canSell && (
            <div className="glass-morphism p-3 rounded-lg border-2 border-red-500/30 mb-4">
              <p className="text-red-400 text-sm font-medium text-center flex items-center justify-center gap-2">
                <X className="w-4 h-4" />
                Insufficient shares for this sale
              </p>
            </div>
          )}

              {/* Execute Trade Button */}
              <button
                onClick={handleTrade}
                disabled={loading || (tradeType === 'buy' && !canAfford) || (tradeType === 'sell' && !canSell)}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  tradeType === 'buy'
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30 hover:scale-105'
                    : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 hover:scale-105'
                } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                {loading ? (
                  <>
                    <div className="loading-shimmer w-5 h-5 rounded-full"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    {tradeType === 'buy' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    {tradeType === 'buy' ? 'Buy' : 'Sell'} {quantity} shares
                  </>
                )}
              </button>
            </>
          )}

          {/* Options Tab Content */}
          {activeTab === 'options' && (
            <div className="max-h-[600px] overflow-y-auto">
              <OptionsChain
                symbol={stock.symbol}
                onTrade={(type, strike, expiration) => {
                  console.log('Options trade:', { type, strike, expiration });
                  alert(`Option trade simulation:\n${type.toUpperCase()} ${stock.symbol} $${strike} ${expiration}`);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}