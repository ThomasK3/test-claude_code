import type { StockData, OHLCV, EarningsEvent } from '../types/stock';

// Deterministic pseudo-random number generator
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateOHLCV(
  startPrice: number,
  days: number,
  volatility: number,
  trend: number,
  seed: number
): OHLCV[] {
  const rng = seededRandom(seed);
  const data: OHLCV[] = [];
  let price = startPrice;
  const startDate = new Date('2023-01-03');

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    // Skip weekends
    const day = date.getDay();
    if (day === 0 || day === 6) continue;

    const dailyReturn = trend / 252 + volatility * (rng() - 0.5) * 2;
    const open = price;
    const close = price * (1 + dailyReturn);
    const high = Math.max(open, close) * (1 + rng() * volatility * 0.5);
    const low = Math.min(open, close) * (1 - rng() * volatility * 0.5);
    const volume = Math.floor(5000000 + rng() * 20000000);

    data.push({
      time: date.toISOString().split('T')[0],
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
      volume,
    });

    price = close;
  }

  return data;
}

const STOCK_CONFIGS = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    startPrice: 130,
    volatility: 0.02,
    trend: 0.25,
    seed: 42,
    marketCap: 2.95e12,
    pe: 29.5,
    eps: 6.42,
    dividend: 0.96,
    beta: 1.21,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Technology',
    startPrice: 240,
    volatility: 0.018,
    trend: 0.3,
    seed: 43,
    marketCap: 2.78e12,
    pe: 34.2,
    eps: 10.31,
    dividend: 2.72,
    beta: 0.89,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    sector: 'Technology',
    startPrice: 90,
    volatility: 0.022,
    trend: 0.28,
    seed: 44,
    marketCap: 1.72e12,
    pe: 25.8,
    eps: 5.21,
    dividend: 0,
    beta: 1.06,
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    sector: 'Consumer Cyclical',
    startPrice: 85,
    volatility: 0.025,
    trend: 0.35,
    seed: 45,
    marketCap: 1.55e12,
    pe: 58.3,
    eps: 2.9,
    dividend: 0,
    beta: 1.14,
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Technology',
    startPrice: 150,
    volatility: 0.035,
    trend: 0.8,
    seed: 46,
    marketCap: 1.22e12,
    pe: 62.5,
    eps: 7.62,
    dividend: 0.16,
    beta: 1.68,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    sector: 'Consumer Cyclical',
    startPrice: 120,
    volatility: 0.04,
    trend: 0.15,
    seed: 47,
    marketCap: 0.61e12,
    pe: 55.2,
    eps: 3.91,
    dividend: 0,
    beta: 2.05,
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    sector: 'Technology',
    startPrice: 125,
    volatility: 0.028,
    trend: 0.6,
    seed: 48,
    marketCap: 0.89e12,
    pe: 27.4,
    eps: 14.87,
    dividend: 0,
    beta: 1.32,
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    sector: 'Financial Services',
    startPrice: 135,
    volatility: 0.015,
    trend: 0.12,
    seed: 49,
    marketCap: 0.43e12,
    pe: 11.2,
    eps: 13.56,
    dividend: 4.0,
    beta: 1.08,
  },
  {
    symbol: 'V',
    name: 'Visa Inc.',
    sector: 'Financial Services',
    startPrice: 220,
    volatility: 0.014,
    trend: 0.18,
    seed: 50,
    marketCap: 0.51e12,
    pe: 30.5,
    eps: 8.29,
    dividend: 1.8,
    beta: 0.94,
  },
  {
    symbol: 'JNJ',
    name: 'Johnson & Johnson',
    sector: 'Healthcare',
    startPrice: 172,
    volatility: 0.012,
    trend: 0.05,
    seed: 51,
    marketCap: 0.42e12,
    pe: 15.8,
    eps: 10.72,
    dividend: 4.52,
    beta: 0.56,
  },
  {
    symbol: 'WMT',
    name: 'Walmart Inc.',
    sector: 'Consumer Defensive',
    startPrice: 145,
    volatility: 0.013,
    trend: 0.1,
    seed: 52,
    marketCap: 0.39e12,
    pe: 24.1,
    eps: 6.29,
    dividend: 2.28,
    beta: 0.51,
  },
  {
    symbol: 'XOM',
    name: 'Exxon Mobil Corporation',
    sector: 'Energy',
    startPrice: 110,
    volatility: 0.019,
    trend: -0.05,
    seed: 53,
    marketCap: 0.45e12,
    pe: 9.8,
    eps: 11.43,
    dividend: 3.64,
    beta: 0.87,
  },
];

function generateFinancials(seed: number) {
  const rng = seededRandom(seed + 100);
  const baseRevenue = 50 + rng() * 300;
  return [2021, 2022, 2023, 2024].map((year) => {
    const growth = 1 + rng() * 0.15;
    const revenue = baseRevenue * growth * (1 + (year - 2021) * 0.08);
    const grossMargin = 0.35 + rng() * 0.3;
    const operatingMargin = grossMargin * (0.4 + rng() * 0.3);
    const netMargin = operatingMargin * (0.7 + rng() * 0.2);
    return {
      year,
      revenue: +(revenue * 1e9).toFixed(0),
      netIncome: +(revenue * netMargin * 1e9).toFixed(0),
      grossMargin: +grossMargin.toFixed(4),
      operatingMargin: +operatingMargin.toFixed(4),
      netMargin: +netMargin.toFixed(4),
      eps: +(2 + rng() * 12).toFixed(2),
      freeCashFlow: +(revenue * netMargin * 0.8 * 1e9).toFixed(0),
      totalDebt: +(revenue * 0.3 * 1e9).toFixed(0),
      totalCash: +(revenue * 0.2 * 1e9).toFixed(0),
      roe: +(0.1 + rng() * 0.35).toFixed(4),
      roa: +(0.05 + rng() * 0.15).toFixed(4),
    };
  });
}

function generateValuation(price: number, seed: number) {
  const rng = seededRandom(seed + 200);
  const pe = 10 + rng() * 50;
  const target = price * (0.85 + rng() * 0.4);
  return {
    peRatio: +pe.toFixed(2),
    forwardPE: +(pe * (0.8 + rng() * 0.3)).toFixed(2),
    pegRatio: +(0.5 + rng() * 2.5).toFixed(2),
    priceToSales: +(2 + rng() * 15).toFixed(2),
    priceToBook: +(1.5 + rng() * 20).toFixed(2),
    evToEbitda: +(8 + rng() * 25).toFixed(2),
    evToRevenue: +(2 + rng() * 12).toFixed(2),
    dcfValue: +(price * (0.7 + rng() * 0.6)).toFixed(2),
    analystTarget: +target.toFixed(2),
    upside: +(((target - price) / price) * 100).toFixed(2),
  };
}

function computeTechnicals(history: OHLCV[]): StockData['technicals'] {
  const closes = history.map((d) => d.close);
  const last = closes[closes.length - 1];
  const sma = (period: number) => {
    const slice = closes.slice(-period);
    return +(slice.reduce((a, b) => a + b, 0) / slice.length).toFixed(2);
  };
  const sma20 = sma(20);
  const sma50 = sma(50);
  const sma200 = sma(200);

  // EMA helper
  const ema = (period: number) => {
    const k = 2 / (period + 1);
    let e = closes[0];
    for (let i = 1; i < closes.length; i++) {
      e = closes[i] * k + e * (1 - k);
    }
    return +e.toFixed(2);
  };
  const ema12 = ema(12);
  const ema26 = ema(26);
  const macd = +(ema12 - ema26).toFixed(2);

  // RSI
  let gains = 0,
    losses = 0;
  const period = 14;
  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff > 0) gains += diff;
    else losses -= diff;
  }
  const rs = gains / (losses || 1);
  const rsi14 = +(100 - 100 / (1 + rs)).toFixed(2);

  // Bollinger
  const std20 =
    Math.sqrt(
      closes.slice(-20).reduce((s, c) => s + (c - sma20) ** 2, 0) / 20
    ) || 1;

  // ATR
  const atrVals = history.slice(-15).map((d, i, arr) => {
    if (i === 0) return d.high - d.low;
    return Math.max(
      d.high - d.low,
      Math.abs(d.high - arr[i - 1].close),
      Math.abs(d.low - arr[i - 1].close)
    );
  });
  const atr14 = +(atrVals.reduce((a, b) => a + b, 0) / atrVals.length).toFixed(2);

  return {
    sma20,
    sma50,
    sma200,
    ema12,
    ema26,
    rsi14,
    macd,
    macdSignal: +(macd * 0.8).toFixed(2),
    macdHistogram: +(macd * 0.2).toFixed(2),
    bollingerUpper: +(sma20 + 2 * std20).toFixed(2),
    bollingerMiddle: sma20,
    bollingerLower: +(sma20 - 2 * std20).toFixed(2),
    atr14,
    adx14: +(20 + Math.random() * 30).toFixed(2),
    stochK: +(((last - Math.min(...closes.slice(-14))) / (Math.max(...closes.slice(-14)) - Math.min(...closes.slice(-14)) || 1)) * 100).toFixed(2),
    stochD: 0, // computed below
  };
}

// Build all stock data
const allStockData: Record<string, StockData> = {};

for (const config of STOCK_CONFIGS) {
  const history = generateOHLCV(
    config.startPrice,
    750, // ~3 years of trading days
    config.volatility,
    config.trend,
    config.seed
  );
  const lastBar = history[history.length - 1];
  const prevBar = history[history.length - 2];
  const change = +(lastBar.close - prevBar.close).toFixed(2);
  const changePercent = +((change / prevBar.close) * 100).toFixed(2);

  const technicals = computeTechnicals(history);
  // Fill stochD as 3-period SMA of stochK (approximation)
  technicals.stochD = +(technicals.stochK * 0.9).toFixed(2);

  allStockData[config.symbol] = {
    quote: {
      symbol: config.symbol,
      name: config.name,
      sector: config.sector,
      price: lastBar.close,
      change,
      changePercent,
      volume: lastBar.volume,
      marketCap: config.marketCap,
      pe: config.pe,
      eps: config.eps,
      high52w: Math.max(...history.slice(-252).map((d) => d.high)),
      low52w: Math.min(...history.slice(-252).map((d) => d.low)),
      avgVolume: Math.floor(
        history.slice(-30).reduce((s, d) => s + d.volume, 0) / 30
      ),
      dividend: config.dividend,
      dividendYield: +((config.dividend / lastBar.close) * 100).toFixed(2),
      beta: config.beta,
      exchange: 'NASDAQ',
    },
    history,
    financials: generateFinancials(config.seed),
    valuation: generateValuation(lastBar.close, config.seed),
    technicals,
  };
}

export function getStockData(symbol: string): StockData | undefined {
  return allStockData[symbol];
}

export function getAllSymbols(): string[] {
  return STOCK_CONFIGS.map((c) => c.symbol);
}

export function getAllQuotes() {
  return STOCK_CONFIGS.map((c) => allStockData[c.symbol].quote);
}

export function getStockHistory(
  symbol: string,
  range: string
): OHLCV[] {
  const data = allStockData[symbol];
  if (!data) return [];
  const { history } = data;
  const daysMap: Record<string, number> = {
    '1D': 1,
    '1W': 5,
    '1M': 22,
    '3M': 66,
    '6M': 132,
    '1Y': 252,
    '5Y': 750,
  };
  const days = daysMap[range] || history.length;
  return history.slice(-days);
}

// Earnings calendar
export function getEarningsCalendar(): EarningsEvent[] {
  const rng = seededRandom(999);
  const events: EarningsEvent[] = [];
  const quarters = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'];
  for (const config of STOCK_CONFIGS) {
    for (let q = 0; q < quarters.length; q++) {
      const month = q * 3 + 1;
      const day = 15 + Math.floor(rng() * 10);
      const estimatedEps = +(2 + rng() * 8).toFixed(2);
      const actual = estimatedEps * (0.95 + rng() * 0.15);
      events.push({
        symbol: config.symbol,
        date: `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        quarter: quarters[q],
        estimatedEps,
        actualEps: q < 3 ? +actual.toFixed(2) : undefined,
        surprise: q < 3 ? +(((actual - estimatedEps) / estimatedEps) * 100).toFixed(2) : undefined,
        time: rng() > 0.5 ? 'BMO' : 'AMC',
      });
    }
  }
  return events.sort((a, b) => a.date.localeCompare(b.date));
}

// For time simulation: generate future OHLCV bars
export function generateFutureBars(
  lastBar: OHLCV,
  count: number,
  volatility: number,
  seed: number
): OHLCV[] {
  const rng = seededRandom(seed);
  const bars: OHLCV[] = [];
  let price = lastBar.close;
  const startDate = new Date(lastBar.time);

  for (let i = 0; i < count; i++) {
    startDate.setDate(startDate.getDate() + 1);
    const day = startDate.getDay();
    if (day === 0 || day === 6) continue;

    const dailyReturn = (volatility * (rng() - 0.48)) * 2;
    const open = price;
    const close = price * (1 + dailyReturn);
    const high = Math.max(open, close) * (1 + rng() * volatility * 0.4);
    const low = Math.min(open, close) * (1 - rng() * volatility * 0.4);
    const volume = Math.floor(5000000 + rng() * 20000000);

    bars.push({
      time: startDate.toISOString().split('T')[0],
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
      volume,
    });

    price = close;
  }

  return bars;
}

export default allStockData;
