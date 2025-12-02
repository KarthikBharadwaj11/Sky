'use client';

import { OptionsPosition } from '@/types/options';
import { TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';

interface OptionsPortfolioProps {
  positions: OptionsPosition[];
}

export default function OptionsPortfolio({ positions }: OptionsPortfolioProps) {
  const totalValue = positions.reduce((sum, pos) => sum + pos.currentValue, 0);
  const totalCost = positions.reduce((sum, pos) => sum + pos.totalCost, 0);
  const totalPL = positions.reduce((sum, pos) => sum + pos.profitLoss, 0);
  const totalPLPercent = totalCost > 0 ? (totalPL / totalCost) * 100 : 0;

  const callsCount = positions.filter(p => p.type === 'call').length;
  const putsCount = positions.filter(p => p.type === 'put').length;

  const expiringThisWeek = positions.filter(p => p.daysToExpiration <= 7).length;

  if (positions.length === 0) {
    return (
      <div className="card-body text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-secondary)' }}>
          <DollarSign className="w-10 h-10" style={{ color: 'var(--text-primary)' }} />
        </div>
        <p className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          No options positions yet.
        </p>
        <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>
          Start trading options to see your positions here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card pulse-glow">
          <div className="card-body text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <DollarSign className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Total Value</h3>
            <p className="text-3xl font-bold" style={{ color: 'var(--primary-blue)' }}>${totalValue.toLocaleString()}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>{positions.length} positions</p>
          </div>
        </div>

        <div className="card pulse-glow">
          <div className="card-body text-center">
            <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
              totalPL >= 0 ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-rose-600'
            }`}>
              {totalPL >= 0 ? (
                <TrendingUp className="w-6 h-6 text-white" />
              ) : (
                <TrendingDown className="w-6 h-6 text-white" />
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Total P/L</h3>
            <p className={`text-3xl font-bold ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalPL >= 0 ? '+' : ''}${totalPL.toFixed(0)}
            </p>
            <p className={`text-sm mt-1 ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalPL >= 0 ? '+' : ''}{totalPLPercent.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="card pulse-glow">
          <div className="card-body text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Calls</h3>
            <p className="text-3xl font-bold text-green-400">{callsCount}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
              ${positions.filter(p => p.type === 'call').reduce((sum, p) => sum + p.currentValue, 0).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="card pulse-glow">
          <div className="card-body text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' }}>
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Puts</h3>
            <p className="text-3xl font-bold text-red-400">{putsCount}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
              ${positions.filter(p => p.type === 'put').reduce((sum, p) => sum + p.currentValue, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Expiration Alert */}
      {expiringThisWeek > 0 && (
        <div className="glass-morphism p-4 rounded-xl border-2 border-yellow-500/30">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="font-semibold text-yellow-400">
                {expiringThisWeek} position{expiringThisWeek > 1 ? 's' : ''} expiring within 7 days
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                Review your positions before expiration
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Positions Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-3xl font-bold text-gradient">Active Options Positions</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-left">Symbol</th>
                <th className="text-left">Type</th>
                <th className="text-right">Strike</th>
                <th className="text-left">Expiration</th>
                <th className="text-right">Qty</th>
                <th className="text-right">Entry</th>
                <th className="text-right">Current</th>
                <th className="text-right">Total Value</th>
                <th className="text-right">P/L</th>
                <th className="text-right">Break Even</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position) => (
                <tr key={position.id}>
                  <td>
                    <div>
                      <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                        {position.symbol}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {position.stockName}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                      position.type === 'call' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {position.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="text-right">
                    <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                      ${position.strike.toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <div>
                      <div className="text-base" style={{ color: 'var(--text-secondary)' }}>
                        {position.expiration}
                      </div>
                      <div className={`text-xs ${
                        position.daysToExpiration <= 7 ? 'text-yellow-400' :
                        position.daysToExpiration <= 30 ? 'text-orange-400' :
                        'text-gray-400'
                      }`}>
                        {position.daysToExpiration} days
                      </div>
                    </div>
                  </td>
                  <td className="text-right">
                    <span className="text-base font-semibold" style={{ color: 'var(--text-secondary)' }}>
                      {position.quantity}
                    </span>
                  </td>
                  <td className="text-right">
                    <span className="text-base" style={{ color: 'var(--text-secondary)' }}>
                      ${position.entryPremium.toFixed(2)}
                    </span>
                  </td>
                  <td className="text-right">
                    <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                      ${position.currentPremium.toFixed(2)}
                    </span>
                  </td>
                  <td className="text-right">
                    <span className="text-lg font-bold" style={{ color: 'var(--text-accent)' }}>
                      ${position.currentValue.toLocaleString()}
                    </span>
                  </td>
                  <td className="text-right">
                    <div>
                      <div className={`text-lg font-bold ${
                        position.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {position.profitLoss >= 0 ? '+' : ''}${position.profitLoss.toFixed(2)}
                      </div>
                      <div className={`text-sm ${
                        position.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        ({position.profitLoss >= 0 ? '+' : ''}{position.profitLossPercent.toFixed(2)}%)
                      </div>
                    </div>
                  </td>
                  <td className="text-right">
                    <span className="text-base" style={{ color: 'var(--text-tertiary)' }}>
                      ${position.breakEven.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
