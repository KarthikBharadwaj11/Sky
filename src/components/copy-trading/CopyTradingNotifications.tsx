'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { Bell, TrendingUp, TrendingDown, User, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CopyTradeSignal {
  id: string;
  expertId: string;
  expertName: string;
  symbol: string;
  action: 'buy' | 'sell';
  price: number;
  quantity: number;
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

interface Notification {
  id: string;
  message: string;
  type: 'trade' | 'profit' | 'loss' | 'subscription';
  timestamp: string;
  isRead: boolean;
}

export default function CopyTradingNotifications() {
  const { user, updateBalance } = useAuth();
  const router = useRouter();
  const [signals, setSignals] = useState<CopyTradeSignal[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Load existing notifications from localStorage
    const savedNotifications = JSON.parse(localStorage.getItem(`notifications_${user.id}`) || '[]') as Notification[];
    setNotifications(savedNotifications);

    // Note: Mock signals and notifications have been removed.
    // Real notifications will be generated from actual copy trading activity.
  }, [user]);

  // Route trade signal based on auto/manual mode
  const routeTradeSignal = (signal: CopyTradeSignal) => {
    if (!user) return;

    const subscriptions = JSON.parse(localStorage.getItem(`subscriptions_${user.id}`) || '[]') as Subscription[];
    const subscription = subscriptions.find((sub: Subscription) => sub.expertId === signal.expertId && sub.status === 'active');

    if (!subscription) {
      console.log('No active subscription found for this expert');
      return;
    }

    if (subscription.autoCopy) {
      // Auto mode: Execute immediately
      executeTradeAutomatically(signal, subscription);
    } else {
      // Manual mode: Add to pending trades
      addToPendingTrades(signal);
    }
  };

  // Add trade to pending list for manual review
  const addToPendingTrades = (signal: CopyTradeSignal) => {
    if (!user) return;

    const pendingTrade = {
      id: Date.now().toString() + Math.random(),
      expertId: signal.expertId,
      expertName: signal.expertName,
      expertAvatar: '👨‍💼', // Default avatar, can be enhanced
      symbol: signal.symbol,
      action: signal.action,
      shares: signal.quantity,
      price: signal.price,
      timestamp: new Date().toISOString(),
      reason: signal.reason
    };

    const pendingTrades = JSON.parse(localStorage.getItem(`pending_trades_${user.id}`) || '[]');
    pendingTrades.push(pendingTrade);
    localStorage.setItem(`pending_trades_${user.id}`, JSON.stringify(pendingTrades));

    // Create notification
    const notification = {
      id: Date.now().toString(),
      message: `New trade from ${signal.expertName}: ${signal.action.toUpperCase()} ${signal.quantity} ${signal.symbol} @ $${signal.price}`,
      type: 'trade',
      timestamp: new Date().toISOString(),
      isRead: false
    };

    const notifications = JSON.parse(localStorage.getItem(`notifications_${user.id}`) || '[]');
    notifications.unshift(notification);
    localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifications));

    // Remove from signals since it's now in pending
    setSignals(signals.filter(s => s.id !== signal.id));
  };

  // Execute trade automatically (for auto-copy mode)
  const executeTradeAutomatically = (signal: CopyTradeSignal, subscription: Subscription) => {
    if (!user) return;

    const totalCost = signal.price * signal.quantity;
    const copyAmount = Math.min(totalCost, subscription.amount * 0.1);
    const adjustedQuantity = Math.floor(copyAmount / signal.price);

    if (adjustedQuantity === 0) {
      console.log('Insufficient allocated funds for this trade');
      return;
    }

    const actualCost = signal.price * adjustedQuantity;

    if (signal.action === 'buy' && user.balance < actualCost) {
      console.log('Insufficient account balance for auto copy trade');
      return;
    }

    // Execute the trade
    const portfolio = JSON.parse(localStorage.getItem(`portfolio_${user.id}`) || '[]');
    let newBalance = user.balance;

    if (signal.action === 'buy') {
      newBalance -= actualCost;

      const existingHoldingIndex = portfolio.findIndex((h: any) => h.symbol === signal.symbol);

      if (existingHoldingIndex !== -1) {
        const existingHolding = portfolio[existingHoldingIndex];
        const totalShares = existingHolding.shares + adjustedQuantity;
        const totalCostBasis = (existingHolding.shares * existingHolding.averagePrice) + actualCost;

        portfolio[existingHoldingIndex] = {
          ...existingHolding,
          shares: totalShares,
          averagePrice: totalCostBasis / totalShares,
          currentPrice: signal.price
        };
      } else {
        portfolio.push({
          symbol: signal.symbol,
          name: `${signal.symbol} Corp.`,
          shares: adjustedQuantity,
          averagePrice: signal.price,
          currentPrice: signal.price
        });
      }
    } else {
      // Sell logic
      const existingHoldingIndex = portfolio.findIndex((h: any) => h.symbol === signal.symbol);

      if (existingHoldingIndex !== -1) {
        const existingHolding = portfolio[existingHoldingIndex];
        const sharesToSell = Math.min(adjustedQuantity, existingHolding.shares);
        const saleAmount = signal.price * sharesToSell;

        newBalance += saleAmount;

        if (sharesToSell === existingHolding.shares) {
          portfolio.splice(existingHoldingIndex, 1);
        } else {
          portfolio[existingHoldingIndex] = {
            ...existingHolding,
            shares: existingHolding.shares - sharesToSell,
            currentPrice: signal.price
          };
        }
      }
    }

    // Save changes
    localStorage.setItem(`portfolio_${user.id}`, JSON.stringify(portfolio));
    user.balance = newBalance;

    // Record transaction
    const transaction = {
      id: Date.now().toString(),
      type: signal.action,
      symbol: signal.symbol,
      name: `${signal.symbol} Corp. (Auto Copy)`,
      shares: adjustedQuantity,
      price: signal.price,
      total: actualCost,
      date: new Date().toISOString(),
      copyTrade: true,
      expert: signal.expertName
    };

    const transactions = JSON.parse(localStorage.getItem(`transactions_${user.id}`) || '[]');
    transactions.push(transaction);
    localStorage.setItem(`transactions_${user.id}`, JSON.stringify(transactions));

    // Save to copied trades
    const copiedTrade = {
      id: Date.now().toString(),
      expertId: signal.expertId,
      expertName: signal.expertName,
      expertAvatar: '👨‍💼',
      symbol: signal.symbol,
      action: signal.action,
      shares: adjustedQuantity,
      entryPrice: signal.price,
      currentPrice: signal.price,
      status: 'active',
      openedAt: new Date().toISOString(),
      copyMode: 'auto'
    };

    const copiedTrades = JSON.parse(localStorage.getItem(`copied_trades_${user.id}`) || '[]');
    copiedTrades.push(copiedTrade);
    localStorage.setItem(`copied_trades_${user.id}`, JSON.stringify(copiedTrades));

    // Create notification about auto-executed trade
    const notification = {
      id: Date.now().toString(),
      message: `Auto-copied: ${signal.action.toUpperCase()} ${adjustedQuantity} ${signal.symbol} @ $${signal.price} from ${signal.expertName}`,
      type: 'trade',
      timestamp: new Date().toISOString(),
      isRead: false
    };

    const notifications = JSON.parse(localStorage.getItem(`notifications_${user.id}`) || '[]');
    notifications.unshift(notification);
    localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifications));

    // Remove executed signal
    setSignals(signals.filter(s => s.id !== signal.id));
  };

  const executeCopyTrade = async (signal: CopyTradeSignal) => {
    if (!user) return;

    // Get subscription details
    const subscriptions = JSON.parse(localStorage.getItem(`subscriptions_${user.id}`) || '[]') as Subscription[];
    const subscription = subscriptions.find((sub: Subscription) => sub.expertId === signal.expertId && sub.status === 'active');

    if (!subscription) {
      alert('No active subscription found for this expert');
      return;
    }

    const totalCost = signal.price * signal.quantity;
    const copyAmount = Math.min(totalCost, subscription.amount * 0.1); // Use 10% of allocated amount per trade
    const adjustedQuantity = Math.floor(copyAmount / signal.price);

    if (adjustedQuantity === 0) {
      alert('Insufficient allocated funds for this trade');
      return;
    }

    const actualCost = signal.price * adjustedQuantity;

    if (signal.action === 'buy' && user.balance < actualCost) {
      alert('Insufficient account balance for copy trade');
      return;
    }

    // Execute the copy trade
    const portfolio = JSON.parse(localStorage.getItem(`portfolio_${user.id}`) || '[]') as { symbol: string; shares: number; averagePrice: number; currentPrice: number; name: string }[];
    let newBalance = user.balance;

    if (signal.action === 'buy') {
      newBalance -= actualCost;
      
      const existingHoldingIndex = portfolio.findIndex((h) => h.symbol === signal.symbol);
      
      if (existingHoldingIndex !== -1) {
        const existingHolding = portfolio[existingHoldingIndex];
        const totalShares = existingHolding.shares + adjustedQuantity;
        const totalCostBasis = (existingHolding.shares * existingHolding.averagePrice) + actualCost;
        
        portfolio[existingHoldingIndex] = {
          ...existingHolding,
          shares: totalShares,
          averagePrice: totalCostBasis / totalShares,
          currentPrice: signal.price
        };
      } else {
        portfolio.push({
          symbol: signal.symbol,
          name: `${signal.symbol} Corp.`,
          shares: adjustedQuantity,
          averagePrice: signal.price,
          currentPrice: signal.price
        });
      }
    } else {
      // Sell logic
      const existingHoldingIndex = portfolio.findIndex((h) => h.symbol === signal.symbol);
      
      if (existingHoldingIndex !== -1) {
        const existingHolding = portfolio[existingHoldingIndex];
        const sharesToSell = Math.min(adjustedQuantity, existingHolding.shares);
        const saleAmount = signal.price * sharesToSell;
        
        newBalance += saleAmount;
        
        if (sharesToSell === existingHolding.shares) {
          portfolio.splice(existingHoldingIndex, 1);
        } else {
          portfolio[existingHoldingIndex] = {
            ...existingHolding,
            shares: existingHolding.shares - sharesToSell,
            currentPrice: signal.price
          };
        }
      }
    }

    // Save changes
    localStorage.setItem(`portfolio_${user.id}`, JSON.stringify(portfolio));
    updateBalance(newBalance);

    // Record transaction
    const transaction = {
      id: Date.now().toString(),
      type: signal.action,
      symbol: signal.symbol,
      name: `${signal.symbol} Corp. (Copy Trade)`,
      shares: adjustedQuantity,
      price: signal.price,
      total: actualCost,
      date: new Date().toISOString(),
      copyTrade: true,
      expert: signal.expertName
    };

    const transactions = JSON.parse(localStorage.getItem(`transactions_${user.id}`) || '[]');
    transactions.push(transaction);
    localStorage.setItem(`transactions_${user.id}`, JSON.stringify(transactions));

    // Save to copied trades
    const copiedTrade = {
      id: Date.now().toString(),
      expertId: signal.expertId,
      expertName: signal.expertName,
      expertAvatar: '👨‍💼', // You can enhance this with actual avatar mapping
      symbol: signal.symbol,
      action: signal.action,
      shares: adjustedQuantity,
      entryPrice: signal.price,
      currentPrice: signal.price,
      status: 'active',
      openedAt: new Date().toISOString(),
      copyMode: 'manual' // This was a manual copy from notification
    };

    const copiedTrades = JSON.parse(localStorage.getItem(`copied_trades_${user.id}`) || '[]');
    copiedTrades.push(copiedTrade);
    localStorage.setItem(`copied_trades_${user.id}`, JSON.stringify(copiedTrades));

    // Remove executed signal
    setSignals(signals.filter(s => s.id !== signal.id));

    // Redirect to copy trading portfolio
    alert(`Copy trade executed: ${signal.action.toUpperCase()} ${adjustedQuantity} shares of ${signal.symbol} at $${signal.price}`);
    router.push('/copy-trading-portfolio');
  };

  const dismissSignal = (signalId: string) => {
    setSignals(signals.filter(s => s.id !== signalId));
  };

  const markNotificationAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    setNotifications(updatedNotifications);
    
    // Save to localStorage
    if (user) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updatedNotifications));
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'trade': return 'var(--primary-blue)';
      case 'profit': return 'var(--success)';
      case 'loss': return 'var(--error)';
      case 'subscription': return 'var(--primary-purple)';
      default: return 'var(--primary-blue)';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'trade': return <TrendingUp className="w-5 h-5" style={{ color: getNotificationColor(type) }} />;
      case 'profit': return <TrendingUp className="w-5 h-5" style={{ color: getNotificationColor(type) }} />;
      case 'loss': return <TrendingDown className="w-5 h-5" style={{ color: getNotificationColor(type) }} />;
      case 'subscription': return <User className="w-5 h-5" style={{ color: getNotificationColor(type) }} />;
      default: return <Bell className="w-5 h-5" style={{ color: getNotificationColor(type) }} />;
    }
  };

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (!user) {
    return null;
  }

  return (
    <>
      {/* Floating Notification Button - Always visible when user is logged in */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="btn-primary p-4 rounded-full hover:scale-110 transition-all duration-300 relative"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold border-2" style={{ borderColor: 'var(--background-primary)' }}>
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Copy Trading Signals */}
      {signals.length > 0 && (
        <div className="fixed top-20 right-4 w-80 space-y-2 z-30">
          {signals.map((signal) => (
            <div key={signal.id} className="card border-l-4 animate-slide-in" style={{ borderLeftColor: 'var(--primary-blue)' }}>
              <div className="card-body">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-secondary)' }}>
                      <User className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
                    </div>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{signal.expertName}</span>
                  </div>
                  <button
                    onClick={() => dismissSignal(signal.id)}
                    className="glass-morphism p-1 rounded-lg hover:scale-110 transition-all duration-200"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-3 mb-3">
                  {signal.action === 'buy' ? (
                    <TrendingUp className="w-5 h-5 status-positive" />
                  ) : (
                    <TrendingDown className="w-5 h-5 status-negative" />
                  )}
                  <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{signal.symbol}</span>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${signal.action === 'buy' ? 'status-positive' : 'status-negative'}`}>
                    {signal.action.toUpperCase()}
                  </span>
                </div>
                
                <div className="text-base mb-3" style={{ color: 'var(--text-secondary)' }}>
                  {signal.quantity} shares @ ${signal.price}
                </div>
                
                {signal.reason && (
                  <div className="text-sm mb-4 glass-morphism p-3 rounded-lg" style={{ color: 'var(--text-tertiary)' }}>
                    {signal.reason}
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => executeCopyTrade(signal)}
                    className="flex-1 btn-primary py-2 px-4 text-sm hover:scale-105 transition-all duration-300"
                  >
                    Copy Trade
                  </button>
                  <button
                    onClick={() => dismissSignal(signal.id)}
                    className="px-4 py-2 glass-morphism rounded-lg text-sm font-medium hover:scale-105 transition-all duration-300"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notifications Panel */}
      {showNotifications && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setShowNotifications(false)}
          />
          
          {/* Notification Panel */}
          <div className="fixed top-20 right-4 w-96 glass-morphism rounded-2xl shadow-2xl z-50 max-h-[80vh] overflow-hidden animate-notification-slide-in border-2" 
               style={{ 
                 borderColor: 'var(--primary-blue)',
                 background: 'var(--glass-bg)',
                 backdropFilter: 'blur(25px)',
                 boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 30px color-mix(in srgb, var(--primary-blue) 20%, transparent)'
               }}>
            {/* Header */}
            <div className="p-6 border-b-2" style={{ borderColor: 'var(--glass-border)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gradient">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-2 rounded-lg hover:scale-110 transition-all duration-200 glass-morphism border"
                  style={{ borderColor: 'var(--glass-border)', color: 'var(--text-muted)' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`p-5 hover:bg-white/5 cursor-pointer transition-all duration-300 border-l-4 notification-item ${
                    !notification.isRead ? 'notification-unread' : 'border-transparent'
                  }`}
                  style={{
                    borderLeftColor: !notification.isRead ? getNotificationColor(notification.type) : 'transparent',
                    animationDelay: `${index * 50}ms`
                  }}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" 
                      style={{ background: `${getNotificationColor(notification.type)}20` }}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-medium mb-1 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                        {notification.message}
                      </div>
                      <div className="text-sm flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                        <span>{getRelativeTime(notification.timestamp)}</span>
                        {!notification.isRead && (
                          <div className="w-2 h-2 rounded-full" style={{ background: getNotificationColor(notification.type) }}></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {notifications.length === 0 && (
                <div className="p-12 text-center">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" 
                    style={{ background: 'var(--gradient-secondary)' }}
                  >
                    <Bell className="w-8 h-8" style={{ color: 'var(--text-primary)' }} />
                  </div>
                  <h4 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    No notifications yet
                  </h4>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    We'll notify you about important updates and activities
                  </p>
                </div>
              )}
            </div>

            {/* Footer Action */}
            {notifications.length > 0 && unreadCount > 0 && (
              <div className="p-4 border-t-2" style={{ borderColor: 'var(--glass-border)' }}>
                <button
                  onClick={() => {
                    const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
                    setNotifications(updatedNotifications);
                    if (user) {
                      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updatedNotifications));
                    }
                  }}
                  className="w-full btn-secondary text-sm py-3 hover:scale-105 transition-all duration-300"
                >
                  Mark All as Read
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes notification-slide-in {
          from {
            transform: translateY(-20px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        
        @keyframes notification-item-fade {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-notification-slide-in {
          animation: notification-slide-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .notification-item {
          animation: notification-item-fade 0.3s ease-out forwards;
          opacity: 0;
        }
        
        .notification-unread {
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent);
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--glass-bg);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--primary-blue);
          border-radius: 3px;
          opacity: 0.5;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          opacity: 1;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </>
  );
}