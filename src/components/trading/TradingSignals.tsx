'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Zap, Target } from 'lucide-react';

interface TradingSignal {
  id: string;
  symbol: string;
  name: string;
  action: 'buy' | 'sell' | 'hold';
  currentPrice: number;
  targetPrice: number;
  confidence: number;
  timeframe: string;
  reason: string;
  technicalAnalysis: {
    rsi: number;
    macd: 'bullish' | 'bearish' | 'neutral';
    sma: 'above' | 'below' | 'neutral';
    volume: 'high' | 'low' | 'normal';
  };
  riskLevel: 'low' | 'medium' | 'high';
  expectedReturn: number;
  stopLoss: number;
  createdAt: string;
}

export default function TradingSignals() {
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell' | 'hold'>('all');

  useEffect(() => {
    // Generate mock trading signals
    const mockSignals: TradingSignal[] = [
      {
        id: '1',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        action: 'buy',
        currentPrice: 175.43,
        targetPrice: 195.00,
        confidence: 85,
        timeframe: '2-4 weeks',
        reason: 'Strong earnings momentum, iPhone 15 sales exceeding expectations',
        technicalAnalysis: {
          rsi: 32,
          macd: 'bullish',
          sma: 'above',
          volume: 'high'
        },
        riskLevel: 'low',
        expectedReturn: 11.2,
        stopLoss: 165.00,
        createdAt: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: '2',
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        action: 'sell',
        currentPrice: 248.42,
        targetPrice: 220.00,
        confidence: 73,
        timeframe: '1-2 weeks',
        reason: 'Overbought conditions, regulatory concerns in China',
        technicalAnalysis: {
          rsi: 78,
          macd: 'bearish',
          sma: 'below',
          volume: 'normal'
        },
        riskLevel: 'high',
        expectedReturn: -11.4,
        stopLoss: 265.00,
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '3',
        symbol: 'NVDA',
        name: 'NVIDIA Corp.',
        action: 'buy',
        currentPrice: 875.28,
        targetPrice: 950.00,
        confidence: 92,
        timeframe: '3-6 weeks',
        reason: 'AI chip demand surge, data center expansion accelerating',
        technicalAnalysis: {
          rsi: 45,
          macd: 'bullish',
          sma: 'above',
          volume: 'high'
        },
        riskLevel: 'medium',
        expectedReturn: 8.5,
        stopLoss: 825.00,
        createdAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: '4',
        symbol: 'MSFT',
        name: 'Microsoft Corp.',
        action: 'hold',
        currentPrice: 378.85,
        targetPrice: 385.00,
        confidence: 68,
        timeframe: '2-3 weeks',
        reason: 'Consolidation phase, Azure growth slowing but stable',
        technicalAnalysis: {
          rsi: 55,
          macd: 'neutral',
          sma: 'neutral',
          volume: 'low'
        },
        riskLevel: 'low',
        expectedReturn: 1.6,
        stopLoss: 365.00,
        createdAt: new Date(Date.now() - 10800000).toISOString()
      }
    ];

    setSignals(mockSignals);
  }, []);

  const filteredSignals = filter === 'all' ? signals : signals.filter(signal => signal.action === filter);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'buy': return 'text-green-300 bg-green-900/30 border-green-500/30';
      case 'sell': return 'text-red-300 bg-red-900/30 border-red-500/30';
      case 'hold': return 'text-yellow-300 bg-yellow-900/30 border-yellow-500/30';
      default: return 'text-gray-300 bg-gray-900/30 border-gray-500/30';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'buy': return <TrendingUp className="w-4 h-4" />;
      case 'sell': return <TrendingDown className="w-4 h-4" />;
      case 'hold': return <Target className="w-4 h-4" />;
      default: return null;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-300 bg-green-900/20 border-green-500/20';
      case 'medium': return 'text-yellow-300 bg-yellow-900/20 border-yellow-500/20';
      case 'high': return 'text-red-300 bg-red-900/20 border-red-500/20';
      default: return 'text-gray-300 bg-gray-900/20 border-gray-500/20';
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <Zap className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
            </div>
            <h2 className="text-3xl font-bold text-gradient">Trading Signals</h2>
          </div>
          
          <div className="flex space-x-2">
            {(['all', 'buy', 'sell', 'hold'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  filter === filterOption
                    ? 'btn-primary'
                    : 'glass-morphism'
                }`}
                style={filter !== filterOption ? { color: 'var(--text-secondary)' } : {}}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {filteredSignals.map((signal) => (
            <div key={signal.id} className="glass-morphism p-6 rounded-xl hover:scale-[1.02] transition-all duration-300 border border-opacity-30" style={{ borderColor: 'var(--glass-border)' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>{signal.symbol}</h3>
                    <p className="text-base" style={{ color: 'var(--text-secondary)' }}>{signal.name}</p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium border ${getActionColor(signal.action)}`}>
                    {getActionIcon(signal.action)}
                    <span className="ml-1">{signal.action.toUpperCase()}</span>
                  </span>
                </div>
                
                <div className="text-right">
                  <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Confidence</div>
                  <div className="font-bold text-2xl" style={{ color: 'var(--text-accent)' }}>{signal.confidence}%</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
                <div>
                  <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Current Price</div>
                  <div className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>${signal.currentPrice.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Target Price</div>
                  <div className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>${signal.targetPrice.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Expected Return</div>
                  <div className={`font-semibold text-lg ${signal.expectedReturn >= 0 ? 'status-positive' : 'status-negative'}`}>
                    {signal.expectedReturn >= 0 ? '+' : ''}{signal.expectedReturn.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Timeframe</div>
                  <div className="font-semibold" style={{ color: 'var(--text-secondary)' }}>{signal.timeframe}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm mb-2" style={{ color: 'var(--text-tertiary)' }}>Analysis Reason</div>
                <p className="text-base" style={{ color: 'var(--text-secondary)' }}>{signal.reason}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm">
                  <div>
                    <span style={{ color: 'var(--text-tertiary)' }}>RSI:</span>
                    <span className={`ml-2 font-semibold ${
                      signal.technicalAnalysis.rsi < 30 ? 'status-positive' :
                      signal.technicalAnalysis.rsi > 70 ? 'status-negative' : ''
                    }`} style={{ color: signal.technicalAnalysis.rsi >= 30 && signal.technicalAnalysis.rsi <= 70 ? 'var(--text-secondary)' : '' }}>
                      {signal.technicalAnalysis.rsi}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-tertiary)' }}>MACD:</span>
                    <span className={`ml-2 font-semibold ${
                      signal.technicalAnalysis.macd === 'bullish' ? 'status-positive' :
                      signal.technicalAnalysis.macd === 'bearish' ? 'status-negative' : ''
                    }`} style={{ color: signal.technicalAnalysis.macd === 'neutral' ? 'var(--text-secondary)' : '' }}>
                      {signal.technicalAnalysis.macd}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-tertiary)' }}>Volume:</span>
                    <span className={`ml-2 font-semibold ${
                      signal.technicalAnalysis.volume === 'high' ? 'text-blue-400' : ''
                    }`} style={{ color: signal.technicalAnalysis.volume !== 'high' ? 'var(--text-secondary)' : '' }}>
                      {signal.technicalAnalysis.volume}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(signal.riskLevel)}`}>
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {signal.riskLevel} risk
                  </span>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {new Date(signal.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSignals.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--gradient-secondary)' }}>
              <Zap className="w-10 h-10" style={{ color: 'var(--text-primary)' }} />
            </div>
            <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>No signals available for the selected filter</p>
          </div>
        )}
      </div>
    </div>
  );
}