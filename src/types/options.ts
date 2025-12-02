// Options Trading Types

export interface OptionContract {
  strike: number;
  expiration: string;
  lastPrice: number;
  bid: number;
  ask: number;
  volume: number;
  openInterest: number;
  percentChange: number;
  impliedVolatility?: number;
  inTheMoney: boolean;
}

export interface OptionsChainData {
  symbol: string;
  stockPrice: number;
  stockChange: number;
  calls: OptionContract[];
  puts: OptionContract[];
  expirationDates: string[];
}

export interface OptionsPosition {
  id: string;
  symbol: string;
  stockName: string;
  type: 'call' | 'put';
  strike: number;
  expiration: string;
  quantity: number;
  action: 'buy_to_open' | 'sell_to_open';
  entryPremium: number;
  currentPremium: number;
  totalCost: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
  breakEven: number;
  daysToExpiration: number;
  purchaseDate: string;
}

export interface OptionsTransaction {
  id: string;
  symbol: string;
  stockName: string;
  type: 'call' | 'put';
  strike: number;
  expiration: string;
  action: 'buy_to_open' | 'sell_to_open' | 'buy_to_close' | 'sell_to_close';
  quantity: number;
  premium: number;
  totalAmount: number;
  timestamp: string;
}

export type ExpirationCycle = 'weekly' | 'monthly';
