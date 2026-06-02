'use client';

import { useState } from 'react';
import { OptionContract } from '@/types/options';
export interface SelectedOption {
  symbol: string;
  type: 'call' | 'put';
  strike: number;
  expiration: string;
  lastPrice: number;
  bid: number;
  ask: number;
}

interface OptionsChainProps {
  symbol: string;
  onSelectOption?: (option: SelectedOption) => void;
}

export default function OptionsChain({ symbol, onSelectOption }: OptionsChainProps) {
  const [selectedExpiration, setSelectedExpiration] = useState<string>('2024-03-22');
  const [activeStrike, setActiveStrike] = useState<{ strike: number; type: 'call' | 'put' } | null>(null);

  const stockPrice =
    symbol === 'AAPL' ? 175.43 :
    symbol === 'TSLA' ? 248.42 :
    symbol === 'NVDA' ? 875.28 :
    symbol === 'SPY'  ? 523.14 :
    symbol === 'MSFT' ? 412.67 :
    symbol === 'AMZN' ? 188.52 : 175.43;

  const expirationDates = [
    { date: '2024-03-15', label: 'Mar 15' },
    { date: '2024-03-22', label: 'Mar 22' },
    { date: '2024-03-29', label: 'Mar 29' },
    { date: '2024-04-05', label: 'Apr 5' },
    { date: '2024-04-19', label: 'Apr 19' },
    { date: '2024-05-17', label: 'May 17' },
  ];

  const generateOptionsChain = (): { calls: OptionContract[], puts: OptionContract[] } => {
    const strikeInterval = stockPrice > 500 ? 10 : 2.5;
    const atmStrike = Math.round(stockPrice / strikeInterval) * strikeInterval;
    const strikes: number[] = [];
    for (let i = -5; i <= 4; i++) strikes.push(atmStrike + i * strikeInterval);

    const baseIV = 26.5;

    const calls: OptionContract[] = strikes.map((strike, idx) => {
      const distance = Math.abs(strike - stockPrice);
      const iv = baseIV + (distance / stockPrice) * 60;
      const lastPrice = Math.max(0.05, stockPrice - strike + 1.5);
      const bid = Math.max(0.05, lastPrice - 0.10);
      const ask = lastPrice + 0.10;
      return {
        strike,
        expiration: selectedExpiration,
        lastPrice: Number(lastPrice.toFixed(2)),
        bid: Number(bid.toFixed(2)),
        ask: Number(ask.toFixed(2)),
        volume: Math.max(100, 8000 - idx * 700),
        openInterest: Math.max(200, 35000 - idx * 3000),
        percentChange: 0,
        impliedVolatility: Number(iv.toFixed(1)),
        inTheMoney: strike < stockPrice,
      };
    });

    const puts: OptionContract[] = strikes.map((strike, idx) => {
      const distance = Math.abs(strike - stockPrice);
      const iv = baseIV + (distance / stockPrice) * 60;
      const lastPrice = Math.max(0.05, strike - stockPrice + 1.5);
      const bid = Math.max(0.05, lastPrice - 0.10);
      const ask = lastPrice + 0.10;
      return {
        strike,
        expiration: selectedExpiration,
        lastPrice: Number(lastPrice.toFixed(2)),
        bid: Number(bid.toFixed(2)),
        ask: Number(ask.toFixed(2)),
        volume: Math.max(100, 6000 - idx * 500),
        openInterest: Math.max(200, 22000 - idx * 2000),
        percentChange: 0,
        impliedVolatility: Number(iv.toFixed(1)),
        inTheMoney: strike > stockPrice,
      };
    });

    return { calls, puts };
  };

  const { calls, puts } = generateOptionsChain();

  const totalCallOI = calls.reduce((sum, c) => sum + c.openInterest, 0);
  const totalPutOI  = puts.reduce((sum, p) => sum + p.openInterest, 0);
  const avgIV = calls.reduce((sum, c) => sum + (c.impliedVolatility ?? 0), 0) / calls.length;
  const pcRatio = (totalPutOI / totalCallOI).toFixed(2);
  const maxPain = calls[Math.floor(calls.length / 2)].strike;

  const strikeInterval = stockPrice > 500 ? 10 : 2.5;
  const atmStrikePrice = Math.round(stockPrice / strikeInterval) * strikeInterval;

  const fmt = (val: number) => val >= 1000 ? `${(val / 1000).toFixed(1)}K` : val.toString();

  return (
    <div>
      {/* Expiry pills */}
      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        <span className="text-xs font-semibold mr-1" style={{ color: 'var(--text-tertiary)' }}>Expiry:</span>
        {expirationDates.map(exp => (
          <button
            key={exp.date}
            onClick={() => setSelectedExpiration(exp.date)}
            className="px-3 py-1 rounded text-xs font-semibold transition-all"
            style={{
              background: selectedExpiration === exp.date ? 'rgba(59,130,246,0.2)' : 'transparent',
              color: selectedExpiration === exp.date ? 'var(--text-accent)' : 'var(--text-tertiary)',
              border: selectedExpiration === exp.date ? '1px solid rgba(59,130,246,0.4)' : '1px solid transparent',
            }}
          >
            {exp.label}
          </button>
        ))}
      </div>

      {/* Summary strip */}
      <div className="flex items-center gap-6 px-4 py-2 border-y" style={{ borderColor: 'var(--glass-border-color)', background: 'rgba(255,255,255,0.02)' }}>
        {[
          { label: 'Max Pain',      value: `$${maxPain.toFixed(2)}`,    cls: '',              style: { color: 'var(--text-primary)' } },
          { label: 'P/C Ratio',     value: pcRatio,                      cls: '',              style: { color: '#a78bfa' } },
          { label: 'IV30',          value: `${avgIV.toFixed(1)}%`,       cls: '',              style: { color: 'var(--text-primary)' } },
          { label: 'Total Call OI', value: fmt(totalCallOI),             cls: 'text-green-400', style: {} },
          { label: 'Total Put OI',  value: fmt(totalPutOI),              cls: 'text-red-400',   style: {} },
        ].map(stat => (
          <div key={stat.label} className="flex items-center gap-1.5">
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</span>
            <span className={`text-xs font-bold ${stat.cls}`} style={stat.style}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead className="sticky top-0" style={{ background: 'var(--glass-bg)' }}>
            <tr style={{ borderBottom: '1px solid var(--glass-border-color)' }}>
              <th colSpan={7} className="py-2 text-center font-bold text-green-400 text-sm border-r" style={{ borderColor: 'var(--glass-border-color)' }}>CALLS</th>
              <th className="py-2 px-3 text-center font-bold text-sm border-r" style={{ color: 'var(--text-primary)', borderColor: 'var(--glass-border-color)' }}>STRIKE</th>
              <th colSpan={7} className="py-2 text-center font-bold text-red-400 text-sm">PUTS</th>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--glass-border-color)' }}>
              {['IV', 'OI', 'Vol', 'Ask', 'Bid', 'Last', ''].map((h, i) => (
                <th
                  key={`c-${i}`}
                  className="py-1.5 px-2 text-right font-semibold"
                  style={{ color: 'var(--text-tertiary)', ...(i === 6 ? { borderRight: '1px solid var(--glass-border-color)', width: '60px' } : {}) }}
                >
                  {h}
                </th>
              ))}
              <th className="py-1.5 px-3 text-center font-semibold" style={{ color: 'var(--text-tertiary)', borderLeft: '1px solid var(--glass-border-color)', borderRight: '1px solid var(--glass-border-color)' }}>—</th>
              {['', 'Last', 'Bid', 'Ask', 'Vol', 'OI', 'IV'].map((h, i) => (
                <th
                  key={`p-${i}`}
                  className="py-1.5 px-2 text-right font-semibold"
                  style={{ color: 'var(--text-tertiary)', ...(i === 0 ? { borderLeft: '1px solid var(--glass-border-color)', width: '60px' } : {}) }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calls.map((call, index) => {
              const put = puts[index];
              const atm = call.strike === atmStrikePrice;
              const callSelected = activeStrike?.strike === call.strike && activeStrike.type === 'call';
              const putSelected  = activeStrike?.strike === put.strike  && activeStrike.type === 'put';
              const rowSelected  = callSelected || putSelected;

              const rowBg = rowSelected
                ? atm ? 'rgba(59,130,246,0.16)' : 'rgba(255,255,255,0.07)'
                : atm ? 'rgba(59,130,246,0.08)' : 'transparent';

              return (
                <tr
                  key={call.strike}
                  className="group hover:bg-white/5 transition-colors"
                  style={{
                    background: rowBg,
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    borderLeft: rowSelected
                      ? `2px solid ${callSelected ? '#22c55e' : '#ef4444'}`
                      : atm ? '2px solid #3b82f6' : '2px solid transparent',
                  }}
                >
                  {/* Call cells */}
                  <td className="px-2 py-2 text-right" style={{ color: 'var(--text-tertiary)' }}>{call.impliedVolatility?.toFixed(1)}%</td>
                  <td className="px-2 py-2 text-right" style={{ color: 'var(--text-secondary)' }}>{fmt(call.openInterest)}</td>
                  <td className="px-2 py-2 text-right" style={{ color: 'var(--text-secondary)' }}>{fmt(call.volume)}</td>
                  <td className="px-2 py-2 text-right text-green-400">{call.ask.toFixed(2)}</td>
                  <td className="px-2 py-2 text-right text-green-400">{call.bid.toFixed(2)}</td>
                  <td className="px-2 py-2 text-right font-semibold" style={{ color: 'var(--text-primary)' }}>{call.lastPrice.toFixed(2)}</td>
                  <td className="px-2 py-2" style={{ borderRight: '1px solid var(--glass-border-color)' }}>
                    <button
                      onClick={() => {
                        setActiveStrike({ strike: call.strike, type: 'call' });
                        onSelectOption?.({ symbol, type: 'call', strike: call.strike, expiration: call.expiration, lastPrice: call.lastPrice, bid: call.bid, ask: call.ask });
                      }}
                      className="text-xs px-2 py-1 rounded transition-all whitespace-nowrap hover:bg-green-500/20"
                      style={{ color: '#22c55e' }}
                    >
                      Buy
                    </button>
                  </td>

                  {/* Strike */}
                  <td
                    className="px-3 py-2 text-center font-bold"
                    style={{
                      color: atm ? '#60a5fa' : 'var(--text-primary)',
                      borderLeft: '1px solid var(--glass-border-color)',
                      borderRight: '1px solid var(--glass-border-color)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {call.strike.toFixed(2)}
                    {atm && (
                      <span className="ml-1.5 text-[9px] font-bold px-1 py-0.5 rounded" style={{ background: 'rgba(59,130,246,0.25)', color: '#93c5fd' }}>
                        ATM
                      </span>
                    )}
                  </td>

                  {/* Put cells */}
                  <td className="px-2 py-2" style={{ borderLeft: '1px solid var(--glass-border-color)' }}>
                    <button
                      onClick={() => {
                        setActiveStrike({ strike: put.strike, type: 'put' });
                        onSelectOption?.({ symbol, type: 'put', strike: put.strike, expiration: put.expiration, lastPrice: put.lastPrice, bid: put.bid, ask: put.ask });
                      }}
                      className="text-xs px-2 py-1 rounded transition-all whitespace-nowrap hover:bg-red-500/20"
                      style={{ color: '#ef4444' }}
                    >
                      Buy
                    </button>
                  </td>
                  <td className="px-2 py-2 text-right font-semibold" style={{ color: 'var(--text-primary)' }}>{put.lastPrice.toFixed(2)}</td>
                  <td className="px-2 py-2 text-right text-red-400">{put.bid.toFixed(2)}</td>
                  <td className="px-2 py-2 text-right text-red-400">{put.ask.toFixed(2)}</td>
                  <td className="px-2 py-2 text-right" style={{ color: 'var(--text-secondary)' }}>{fmt(put.volume)}</td>
                  <td className="px-2 py-2 text-right" style={{ color: 'var(--text-secondary)' }}>{fmt(put.openInterest)}</td>
                  <td className="px-2 py-2 text-right" style={{ color: 'var(--text-tertiary)' }}>{put.impliedVolatility?.toFixed(1)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
