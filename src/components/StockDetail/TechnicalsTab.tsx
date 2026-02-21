import { useStore } from '../../store/useStore';
import { getStockData } from '../../data/stocks';
import { formatCurrency } from '../../utils/format';
import { cn } from '../../utils/format';

function signal(value: number, thresholds: { buy: number; sell: number }): 'buy' | 'sell' | 'neutral' {
  if (value > thresholds.buy) return 'buy';
  if (value < thresholds.sell) return 'sell';
  return 'neutral';
}

export function TechnicalsTab() {
  const { selectedSymbol } = useStore();
  const data = getStockData(selectedSymbol);
  if (!data) return null;

  const { technicals, quote } = data;
  const price = quote.price;

  const movingAverages = [
    {
      label: 'SMA 20',
      value: technicals.sma20,
      sig: price > technicals.sma20 ? 'buy' : 'sell',
    },
    {
      label: 'SMA 50',
      value: technicals.sma50,
      sig: price > technicals.sma50 ? 'buy' : 'sell',
    },
    {
      label: 'SMA 200',
      value: technicals.sma200,
      sig: price > technicals.sma200 ? 'buy' : 'sell',
    },
    {
      label: 'EMA 12',
      value: technicals.ema12,
      sig: price > technicals.ema12 ? 'buy' : 'sell',
    },
    {
      label: 'EMA 26',
      value: technicals.ema26,
      sig: price > technicals.ema26 ? 'buy' : 'sell',
    },
  ] as const;

  const oscillators = [
    {
      label: 'RSI (14)',
      value: technicals.rsi14.toFixed(2),
      sig: signal(technicals.rsi14, { buy: 50, sell: 30 }),
    },
    {
      label: 'MACD',
      value: technicals.macd.toFixed(2),
      sig: technicals.macd > technicals.macdSignal ? 'buy' : 'sell',
    },
    {
      label: 'MACD Signal',
      value: technicals.macdSignal.toFixed(2),
      sig: 'neutral' as const,
    },
    {
      label: 'MACD Histogram',
      value: technicals.macdHistogram.toFixed(2),
      sig: technicals.macdHistogram > 0 ? 'buy' : 'sell',
    },
    {
      label: 'Stochastic %K',
      value: technicals.stochK.toFixed(2),
      sig: signal(technicals.stochK, { buy: 50, sell: 20 }),
    },
    {
      label: 'ADX (14)',
      value: technicals.adx14.toFixed(2),
      sig: Number(technicals.adx14) > 25 ? 'buy' : 'neutral',
    },
    {
      label: 'ATR (14)',
      value: technicals.atr14.toFixed(2),
      sig: 'neutral' as const,
    },
  ] as const;

  const bollinger = [
    { label: 'Upper Band', value: technicals.bollingerUpper },
    { label: 'Middle Band', value: technicals.bollingerMiddle },
    { label: 'Lower Band', value: technicals.bollingerLower },
  ];

  // Summary counts
  const allSignals = [...movingAverages.map((m) => m.sig), ...oscillators.map((o) => o.sig)];
  const buyCount = allSignals.filter((s) => s === 'buy').length;
  const sellCount = allSignals.filter((s) => s === 'sell').length;
  const neutralCount = allSignals.filter((s) => s === 'neutral').length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
      <div>
        <div className="tech-section">
          <div className="tech-section-title">Summary</div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <span className={cn('signal-badge', 'buy')}>Buy {buyCount}</span>
            <span className={cn('signal-badge', 'neutral')}>Neutral {neutralCount}</span>
            <span className={cn('signal-badge', 'sell')}>Sell {sellCount}</span>
          </div>
          <div
            style={{
              height: 6,
              borderRadius: 3,
              display: 'flex',
              overflow: 'hidden',
              background: 'var(--bg-tertiary)',
            }}
          >
            <div
              style={{
                width: `${(buyCount / allSignals.length) * 100}%`,
                background: 'var(--green)',
              }}
            />
            <div
              style={{
                width: `${(neutralCount / allSignals.length) * 100}%`,
                background: 'var(--yellow)',
              }}
            />
            <div
              style={{
                width: `${(sellCount / allSignals.length) * 100}%`,
                background: 'var(--red)',
              }}
            />
          </div>
        </div>

        <div className="tech-section">
          <div className="tech-section-title">Bollinger Bands</div>
          {bollinger.map(({ label, value }) => (
            <div key={label} className="tech-row">
              <span className="tech-label">{label}</span>
              <span className="tech-value">{formatCurrency(value)}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="tech-section">
          <div className="tech-section-title">Moving Averages</div>
          {movingAverages.map(({ label, value, sig }) => (
            <div key={label} className="tech-row">
              <span className="tech-label">{label}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="tech-value">{formatCurrency(value)}</span>
                <span className={cn('signal-badge', sig)}>{sig}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="tech-section">
          <div className="tech-section-title">Oscillators</div>
          {oscillators.map(({ label, value, sig }) => (
            <div key={label} className="tech-row">
              <span className="tech-label">{label}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="tech-value">{value}</span>
                <span className={cn('signal-badge', sig)}>{sig}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
