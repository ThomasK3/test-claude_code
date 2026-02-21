export interface OHLCV {
  time: string; // YYYY-MM-DD
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockQuote {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe: number;
  eps: number;
  high52w: number;
  low52w: number;
  avgVolume: number;
  dividend: number;
  dividendYield: number;
  beta: number;
  exchange: string;
}

export interface FinancialData {
  year: number;
  quarter?: string;
  revenue: number;
  netIncome: number;
  grossMargin: number;
  operatingMargin: number;
  netMargin: number;
  eps: number;
  freeCashFlow: number;
  totalDebt: number;
  totalCash: number;
  roe: number;
  roa: number;
}

export interface ValuationMetrics {
  peRatio: number;
  forwardPE: number;
  pegRatio: number;
  priceToSales: number;
  priceToBook: number;
  evToEbitda: number;
  evToRevenue: number;
  dcfValue: number;
  analystTarget: number;
  upside: number;
}

export interface TechnicalIndicators {
  sma20: number;
  sma50: number;
  sma200: number;
  ema12: number;
  ema26: number;
  rsi14: number;
  macd: number;
  macdSignal: number;
  macdHistogram: number;
  bollingerUpper: number;
  bollingerMiddle: number;
  bollingerLower: number;
  atr14: number;
  adx14: number;
  stochK: number;
  stochD: number;
}

export interface EarningsEvent {
  symbol: string;
  date: string;
  quarter: string;
  estimatedEps: number;
  actualEps?: number;
  surprise?: number;
  time: 'BMO' | 'AMC'; // before market open / after market close
}

export interface Alert {
  id: string;
  symbol: string;
  type: 'price_above' | 'price_below' | 'percent_change' | 'volume_spike';
  value: number;
  triggered: boolean;
  createdAt: string;
}

export interface PortfolioPosition {
  symbol: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
}

export interface StockData {
  quote: StockQuote;
  history: OHLCV[];
  financials: FinancialData[];
  valuation: ValuationMetrics;
  technicals: TechnicalIndicators;
}

export type TimeRange = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y';
export type ChartType = 'candle' | 'line' | 'area';
export type DetailTab = 'overview' | 'financials' | 'valuation' | 'technicals';
export type IndicatorType = 'sma' | 'ema' | 'bollinger' | 'rsi' | 'macd' | 'volume';
