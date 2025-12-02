'use client';

import { useState } from 'react';
import { OptionsChainData, OptionContract } from '@/types/options';
import { TrendingUp, TrendingDown } from 'lucide-react';
import OptionsTradeModal from './OptionsTradeModal';

interface OptionsChainProps {
  symbol: string;
  onTrade?: (type: 'call' | 'put', strike: number, expiration: string) => void;
}

interface SelectedOption {
  symbol: string;
  type: 'call' | 'put';
  strike: number;
  expiration: string;
  lastPrice: number;
  bid: number;
  ask: number;
}

export default function OptionsChain({ symbol, onTrade }: OptionsChainProps) {
  const [selectedExpiration, setSelectedExpiration] = useState<string>('2024-03-15');
  const [selectedOption, setSelectedOption] = useState<SelectedOption | null>(null);

  // Mock data for visual prototype
  const stockPrice = symbol === 'AAPL' ? 175.43 :
                     symbol === 'TSLA' ? 248.42 :
                     symbol === 'NVDA' ? 875.28 : 175.43;

  const stockChange = symbol === 'AAPL' ? 2.15 :
                      symbol === 'TSLA' ? -5.23 :
                      symbol === 'NVDA' ? 15.67 : 2.15;

  const expirationDates = [
    { date: '2024-03-15', label: 'Mar 15', cycle: 'weekly' },
    { date: '2024-03-22', label: 'Mar 22', cycle: 'weekly' },
    { date: '2024-03-29', label: 'Mar 29', cycle: 'weekly' },
    { date: '2024-04-05', label: 'Apr 5', cycle: 'weekly' },
    { date: '2024-04-19', label: 'Apr 19', cycle: 'monthly' },
    { date: '2024-05-17', label: 'May 17', cycle: 'monthly' },
  ];

  // Generate mock options chain (5 strikes above and below current price)
  const generateOptionsChain = (): { calls: OptionContract[], puts: OptionContract[] } => {
    const strikes = [];
    const strikeInterval = 2.5;
    const atmStrike = Math.round(stockPrice / strikeInterval) * strikeInterval;

    for (let i = -5; i <= 4; i++) {
      strikes.push(atmStrike + (i * strikeInterval));
    }

    const calls: OptionContract[] = strikes.map(strike => {
      const distance = strike - stockPrice;
      const itm = strike < stockPrice;
      const lastPrice = Math.max(0.05, stockPrice - strike + (Math.random() * 3));
      const bid = Math.max(0.05, lastPrice - 0.10);
      const ask = lastPrice + 0.10;
      const volume = Math.floor(Math.random() * 15000) + 100;
      const openInterest = Math.floor(Math.random() * 20000) + 200;
      const percentChange = (Math.random() - 0.5) * 30;

      return {
        strike,
        expiration: selectedExpiration,
        lastPrice: Number(lastPrice.toFixed(2)),
        bid: Number(bid.toFixed(2)),
        ask: Number(ask.toFixed(2)),
        volume,
        openInterest,
        percentChange: Number(percentChange.toFixed(1)),
        inTheMoney: itm
      };
    });

    const puts: OptionContract[] = strikes.map(strike => {
      const itm = strike > stockPrice;
      const lastPrice = Math.max(0.05, strike - stockPrice + (Math.random() * 3));
      const bid = Math.max(0.05, lastPrice - 0.10);
      const ask = lastPrice + 0.10;
      const volume = Math.floor(Math.random() * 10000) + 100;
      const openInterest = Math.floor(Math.random() * 15000) + 200;
      const percentChange = (Math.random() - 0.5) * 30;

      return {
        strike,
        expiration: selectedExpiration,
        lastPrice: Number(lastPrice.toFixed(2)),
        bid: Number(bid.toFixed(2)),
        ask: Number(ask.toFixed(2)),
        volume,
        openInterest,
        percentChange: Number(percentChange.toFixed(1)),
        inTheMoney: itm
      };
    });

    return { calls, puts };
  };

  const { calls, puts } = generateOptionsChain();

  const formatVolume = (vol: number) => {
    if (vol >= 1000) return `${(vol / 1000).toFixed(1)}K`;
    return vol.toString();
  };

  const atmStrike = Math.round(stockPrice / 2.5) * 2.5;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {symbol} Options Chain
        </h2>

        {/* Expiration Selector - Dropdown Only */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Expiration:</span>
          <select
            value={selectedExpiration}
            onChange={(e) => setSelectedExpiration(e.target.value)}
            className="px-4 py-2 text-sm font-semibold rounded-lg glass-morphism"
            style={{ color: 'var(--text-primary)' }}
          >
            {expirationDates.map(exp => (
              <option key={exp.date} value={exp.date}>{exp.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Options Chain Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--glass-bg)', borderBottom: '2px solid var(--glass-border)' }}>
                <th colSpan={7} className="text-center py-3 text-sm font-bold text-green-400 border-r-2" style={{ borderColor: 'var(--glass-border)' }}>
                  CALLS
                </th>
                <th className="py-3 px-3 text-xs font-bold text-center" style={{ color: 'var(--text-tertiary)' }}>
                  STRIKE
                </th>
                <th colSpan={7} className="text-center py-3 text-sm font-bold text-red-400 border-l-2" style={{ borderColor: 'var(--glass-border)' }}>
                  PUTS
                </th>
              </tr>
              <tr style={{ background: 'rgba(88, 40, 130, 0.2)' }}>
                {/* Calls columns */}
                <th className="px-2 py-2 text-xs font-semibold text-left" style={{ color: 'var(--text-tertiary)' }}>Last</th>
                <th className="px-2 py-2 text-xs font-semibold text-left" style={{ color: 'var(--text-tertiary)' }}>Bid</th>
                <th className="px-2 py-2 text-xs font-semibold text-left" style={{ color: 'var(--text-tertiary)' }}>Ask</th>
                <th className="px-2 py-2 text-xs font-semibold text-left" style={{ color: 'var(--text-tertiary)' }}>Vol</th>
                <th className="px-2 py-2 text-xs font-semibold text-left" style={{ color: 'var(--text-tertiary)' }}>OI</th>
                <th className="px-2 py-2 text-xs font-semibold text-left" style={{ color: 'var(--text-tertiary)' }}>Δ%</th>
                <th className="px-2 py-2 text-xs font-semibold border-r-2" style={{ color: 'var(--text-tertiary)', borderColor: 'var(--glass-border)' }}></th>

                {/* Strike */}
                <th className="px-3 py-2 text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}></th>

                {/* Puts columns */}
                <th className="px-2 py-2 text-xs font-semibold border-l-2" style={{ color: 'var(--text-tertiary)', borderColor: 'var(--glass-border)' }}></th>
                <th className="px-2 py-2 text-xs font-semibold text-left" style={{ color: 'var(--text-tertiary)' }}>Δ%</th>
                <th className="px-2 py-2 text-xs font-semibold text-left" style={{ color: 'var(--text-tertiary)' }}>Vol</th>
                <th className="px-2 py-2 text-xs font-semibold text-left" style={{ color: 'var(--text-tertiary)' }}>OI</th>
                <th className="px-2 py-2 text-xs font-semibold text-left" style={{ color: 'var(--text-tertiary)' }}>Bid</th>
                <th className="px-2 py-2 text-xs font-semibold text-left" style={{ color: 'var(--text-tertiary)' }}>Ask</th>
                <th className="px-2 py-2 text-xs font-semibold text-left" style={{ color: 'var(--text-tertiary)' }}>Last</th>
              </tr>
            </thead>
            <tbody>
              {calls.map((call, index) => {
                const put = puts[index];
                const isATM = call.strike === atmStrike;

                return (
                  <tr
                    key={call.strike}
                    className="group hover:bg-white/5 transition-all cursor-pointer"
                    style={{
                      background: isATM ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                      borderBottom: '1px solid var(--glass-border)'
                    }}
                  >
                    {/* CALLS */}
                    <td className="px-2 py-2.5 text-xs font-medium" style={{ color: call.inTheMoney ? 'var(--success)' : 'var(--text-secondary)' }}>
                      ${call.lastPrice.toFixed(2)}
                    </td>
                    <td className="px-2 py-2.5 text-xs" style={{ color: 'var(--text-secondary)' }}>${call.bid.toFixed(2)}</td>
                    <td className="px-2 py-2.5 text-xs" style={{ color: 'var(--text-secondary)' }}>${call.ask.toFixed(2)}</td>
                    <td className="px-2 py-2.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>{formatVolume(call.volume)}</td>
                    <td className="px-2 py-2.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>{formatVolume(call.openInterest)}</td>
                    <td className={`px-2 py-2.5 text-xs font-semibold ${call.percentChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {call.percentChange >= 0 ? '+' : ''}{call.percentChange}%
                    </td>
                    <td className="px-2 py-2.5 border-r-2" style={{ borderColor: 'var(--glass-border)' }}>
                      <button
                        onClick={() => setSelectedOption({
                          symbol,
                          type: 'call',
                          strike: call.strike,
                          expiration: call.expiration,
                          lastPrice: call.lastPrice,
                          bid: call.bid,
                          ask: call.ask
                        })}
                        className="opacity-0 group-hover:opacity-100 text-xs px-2 py-1 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all"
                      >
                        Trade
                      </button>
                    </td>

                    {/* STRIKE */}
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                        {call.strike.toFixed(2)}
                        {isATM && <span className="text-blue-400">*</span>}
                      </span>
                    </td>

                    {/* PUTS */}
                    <td className="px-2 py-2.5 border-l-2" style={{ borderColor: 'var(--glass-border)' }}>
                      <button
                        onClick={() => setSelectedOption({
                          symbol,
                          type: 'put',
                          strike: put.strike,
                          expiration: put.expiration,
                          lastPrice: put.lastPrice,
                          bid: put.bid,
                          ask: put.ask
                        })}
                        className="opacity-0 group-hover:opacity-100 text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                      >
                        Trade
                      </button>
                    </td>
                    <td className={`px-2 py-2.5 text-xs font-semibold ${put.percentChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {put.percentChange >= 0 ? '+' : ''}{put.percentChange}%
                    </td>
                    <td className="px-2 py-2.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>{formatVolume(put.volume)}</td>
                    <td className="px-2 py-2.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>{formatVolume(put.openInterest)}</td>
                    <td className="px-2 py-2.5 text-xs" style={{ color: 'var(--text-secondary)' }}>${put.bid.toFixed(2)}</td>
                    <td className="px-2 py-2.5 text-xs" style={{ color: 'var(--text-secondary)' }}>${put.ask.toFixed(2)}</td>
                    <td className="px-2 py-2.5 text-xs font-medium" style={{ color: put.inTheMoney ? 'var(--success)' : 'var(--text-secondary)' }}>
                      ${put.lastPrice.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--glass-border)', background: 'var(--glass-bg)' }}>
          <div className="flex items-center gap-6 text-xs" style={{ color: 'var(--text-tertiary)' }}>
            <span>* At-the-money</span>
            <span>Vol = Volume</span>
            <span>OI = Open Interest</span>
            <span>Δ% = Percent Change</span>
          </div>
        </div>
      </div>

      {/* Options Trade Modal */}
      {selectedOption && (
        <OptionsTradeModal
          option={selectedOption}
          onClose={() => setSelectedOption(null)}
        />
      )}
    </div>
  );
}
